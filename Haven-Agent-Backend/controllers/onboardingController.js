const path = require('path');
const { createSupabaseAdminClient, createSupabaseUserClient } = require('../config/supabase');

const BUCKET = 'agent-documents';
const ALLOWED_DOC_TYPES = new Set(['emiratesId', 'workVisa', 'brokerLicense']);

const mapDocTypeToDb = (docType) => {
  // Keep db doc_type aligned with frontend keys
  return docType;
};

const buildStatusPayload = async (supabaseAdmin, user) => {
  const userId = user.id;

  const [{ data: profile }, { data: onboarding }, { data: documents }] = await Promise.all([
    supabaseAdmin.from('profiles').select('full_name, phone').eq('id', userId).maybeSingle(),
    supabaseAdmin
      .from('onboarding')
      .select('is_licensed_agent, works_under_agency, agrees_to_rules, verification_status, account_activated')
      .eq('user_id', userId)
      .maybeSingle(),
    supabaseAdmin
      .from('documents')
      .select('doc_type, status')
      .eq('user_id', userId),
  ]);

  const docsMap = {
    emiratesId: false,
    workVisa: false,
    brokerLicense: false,
  };

  const failedDocuments = [];
  if (Array.isArray(documents)) {
    console.log('Found documents in DB:', documents);
    for (const doc of documents) {
      if (doc?.doc_type && Object.prototype.hasOwnProperty.call(docsMap, doc.doc_type)) {
        docsMap[doc.doc_type] = doc.status === 'uploaded' || doc.status === 'verified';
        if (doc.status === 'rejected') {
          failedDocuments.push(doc.doc_type);
        }
      }
    }
  } else {
    console.log('No documents found in DB');
  }

  return {
    eligibility: {
      isLicensedAgent: Boolean(onboarding?.is_licensed_agent),
      worksUnderAgency: Boolean(onboarding?.works_under_agency),
      agreesToRules: Boolean(onboarding?.agrees_to_rules),
    },
    basicDetails: {
      fullName: profile?.full_name || '',
      email: user.email || '',
      phone: profile?.phone || '',
    },
    documents: docsMap,
    verificationStatus: onboarding?.verification_status || null,
    failedDocuments,
    accountActivated: Boolean(onboarding?.account_activated),
  };
};

// Update eligibility status
exports.updateEligibility = async (req, res) => {
  try {
    const { field, value } = req.body;
    const userId = req.user.id;

    const fieldMap = {
      isLicensedAgent: 'is_licensed_agent',
      worksUnderAgency: 'works_under_agency',
      agreesToRules: 'agrees_to_rules',
    };

    const dbField = fieldMap[field];
    if (!dbField) {
      return res.status(400).json({ message: 'Invalid field' });
    }

    const supabaseAdmin = createSupabaseAdminClient();

    const { error } = await supabaseAdmin
      .from('onboarding')
      .upsert({ user_id: userId, [dbField]: Boolean(value) }, { onConflict: 'user_id' });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const payload = await buildStatusPayload(supabaseAdmin, req.user);
    res.json({ message: 'Eligibility updated successfully', ...payload });
  } catch (error) {
    console.error('Update eligibility error:', error);
    res.status(500).json({ message: 'Server error updating eligibility' });
  }
};

// Update basic details
exports.updateDetails = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    const userId = req.user.id;

    const supabaseAdmin = createSupabaseAdminClient();

    if (typeof fullName === 'string' || typeof phone === 'string') {
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert(
          {
            id: userId,
            ...(typeof fullName === 'string' ? { full_name: fullName } : {}),
            ...(typeof phone === 'string' ? { phone } : {}),
          },
          { onConflict: 'id' }
        );

      if (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    // Optional: allow email update (will require re-confirmation in Supabase)
    if (typeof email === 'string' && email && email !== req.user.email) {
      const supabaseUser = createSupabaseUserClient(req.accessToken);
      const { error: authError } = await supabaseUser.auth.updateUser({ email });
      if (authError) {
        return res.status(400).json({ message: authError.message });
      }
    }

    const payload = await buildStatusPayload(supabaseAdmin, req.user);
    res.json({ message: 'Details updated successfully', ...payload });
  } catch (error) {
    console.error('Update details error:', error);
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);
    res.status(500).json({ message: 'Server error updating details' });
  }
};

// Upload a document file to Supabase Storage
exports.uploadDocument = async (req, res) => {
  try {
    console.log('Upload request headers:', req.headers);
    console.log('Upload request file:', req.file);
    console.log('Upload request body keys:', Object.keys(req.body));
    const userId = req.user.id;
    const docType = req.params.docType;

    if (!ALLOWED_DOC_TYPES.has(docType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const supabaseAdmin = createSupabaseAdminClient();

    // Debug: list buckets to confirm
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) {
      console.error('List buckets error:', listError);
    } else {
      console.log('Available buckets:', buckets.map(b => b.name));
    }

    const ext = path.extname(req.file.originalname || '').toLowerCase();
    const safeExt = ext && ext.length <= 10 ? ext : '';
    const storagePath = `${userId}/${docType}/${Date.now()}${safeExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(400).json({ message: uploadError.message });
    }

    const { error: dbError } = await supabaseAdmin
      .from('documents')
      .upsert(
        {
          user_id: userId,
          doc_type: mapDocTypeToDb(docType),
          status: 'uploaded',
          storage_path: storagePath,
        },
        { onConflict: 'user_id,doc_type' }
      );

    if (dbError) {
      return res.status(400).json({ message: dbError.message });
    }

    // Log the saved document
    console.log(`Document uploaded: user=${userId}, docType=${docType}, status=uploaded`);

    const payload = await buildStatusPayload(supabaseAdmin, req.user);
    res.json({ message: 'Document uploaded successfully', ...payload });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Server error uploading document' });
  }
};

// Submit for verification
exports.submitVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const supabaseAdmin = createSupabaseAdminClient();

    // Verify all docs exist
    const { data: docs, error: docsError } = await supabaseAdmin
      .from('documents')
      .select('doc_type, status')
      .eq('user_id', userId);

    if (docsError) {
      return res.status(400).json({ message: docsError.message });
    }

    const present = new Set((docs || []).filter(d => d.status === 'uploaded' || d.status === 'verified').map(d => d.doc_type));
    for (const needed of ALLOWED_DOC_TYPES) {
      if (!present.has(needed)) {
        return res.status(400).json({ message: 'Please upload all required documents before submitting' });
      }
    }

    const { error } = await supabaseAdmin
      .from('onboarding')
      .upsert(
        {
          user_id: userId,
          verification_status: 'pending',
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const payload = await buildStatusPayload(supabaseAdmin, req.user);
    res.json({ message: 'Verification submitted successfully', ...payload });
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({ message: 'Server error submitting verification' });
  }
};

// Approve verification and auto-activate account (admin action)
exports.approveVerification = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const supabaseAdmin = createSupabaseAdminClient();

    // First, update verification status to approved
    const { error: verificationError } = await supabaseAdmin
      .from('onboarding')
      .upsert({ 
        user_id: userId, 
        verification_status: 'approved',
        account_activated: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (verificationError) {
      console.error('Database error during approval:', verificationError);
      return res.status(400).json({ message: verificationError.message });
    }

    // Get the updated user status to return
    const { data: user, error: userError } = await supabaseAdmin
      .from('auth.users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user after approval:', userError);
      // We'll continue anyway since the main operation succeeded
    }

    const payload = await buildStatusPayload(supabaseAdmin, { id: userId, email: user?.email || '' });
    res.json({ 
      message: 'Account approved and activated successfully', 
      user_email: user?.email,
      ...payload 
    });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({ message: 'Server error approving verification' });
  }
};

// Get onboarding status
exports.getOnboardingStatus = async (req, res) => {
  try {
    const supabaseAdmin = createSupabaseAdminClient();
    const payload = await buildStatusPayload(supabaseAdmin, req.user);
    
    // Debug logging
    console.log('Onboarding Status for user:', req.user.id);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    res.json(payload);
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ message: 'Server error getting status' });
  }
};