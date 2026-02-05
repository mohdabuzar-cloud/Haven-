import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI, onboardingAPI } from '@/services/api';

const OnboardingContext = createContext(null);

const initialState = {
  // Screen 2 - Eligibility
  eligibility: {
    isLicensedAgent: false,
    worksUnderAgency: false,
    agreesToRules: false,
  },
  // Screen 3 - Basic Details
  basicDetails: {
    fullName: '',
    email: '',
    phone: '',
  },
  // Screen 4 - Documents
  documents: {
    emiratesId: false,
    workVisa: false,
    brokerLicense: false,
  },
  // Screen 5/6 - Verification status
  verificationStatus: null, // 'pending', 'approved', 'failed'
  failedDocuments: [], // Array of failed document keys
  // Screen 8 - Account activation
  accountActivated: false,
  // Overall progress
  currentScreen: 1,
  completedScreens: [],
};

export const OnboardingProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user data on app start
  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setLoading(true);
          await authAPI.getCurrentUser();
          const onboardingData = await onboardingAPI.getStatus();

          setState(prev => ({
            ...prev,
            ...onboardingData,
          }));
        } catch (err) {
          console.error('Failed to load user data:', err);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      }
      // Mark as initialized even if no token (user not logged in)
      setIsInitialized(true);
    };

    loadUserData();
  }, []);

  // Register new user
  const registerUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);

      if (response?.token) {
        localStorage.setItem('token', response.token);

        const onboardingData = await onboardingAPI.getStatus();
        setState(prev => ({ ...prev, ...onboardingData }));
      }

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login user
  const loginUser = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);

      const onboardingData = await onboardingAPI.getStatus();
      setState(prev => ({ ...prev, ...onboardingData }));
      
      // Check if onboarding is complete: verification must be approved
      // (account activation will be auto-activated when verification is approved)
      const onboardingComplete = onboardingData?.verificationStatus === 'approved';
      
      // Debug logging
      console.log('Login onboarding check:', {
        verificationStatus: onboardingData?.verificationStatus,
        accountActivated: onboardingData?.accountActivated,
        onboardingComplete,
      });
      
      return {
        ...response,
        onboardingComplete,
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout user
  const logoutUser = useCallback(() => {
    localStorage.removeItem('token');
    setState(initialState);
  }, []);

  // Update eligibility checkboxes
  const updateEligibility = useCallback(async (field, value) => {
    // Update local state first for immediate UI response
    setState(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        [field]: value,
      },
    }));

    // Then call backend API
    try {
      const data = await onboardingAPI.updateEligibility(field, value);
      const { message, ...payload } = data || {};
      setState(prev => ({ ...prev, ...payload }));
    } catch (err) {
      setError(err.message);
      // Revert local state on error
      setState(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          [field]: !value,
        },
      }));
      throw err;
    }
  }, []);

  // Update basic details
  const updateBasicDetails = useCallback(async (field, value) => {
    // Update local state first for immediate UI response
    setState(prev => ({
      ...prev,
      basicDetails: {
        ...prev.basicDetails,
        [field]: value,
      },
    }));

    // Then call backend API
    try {
      const data = await onboardingAPI.updateDetails({
        [field]: value
      });
      const { message, ...payload } = data || {};
      setState(prev => ({ ...prev, ...payload }));
    } catch (err) {
      setError(err.message);
      // Revert local state on error
      setState(prev => ({
        ...prev,
        basicDetails: {
          ...prev.basicDetails,
          [field]: state.basicDetails[field],
        },
      }));
      throw err;
    }
  }, [state.basicDetails]);

  // Update document status
  const updateDocument = useCallback(async (docKey, file) => {
    try {
      setLoading(true);
      setError(null);

      const data = await onboardingAPI.uploadDocument(docKey, file);
      const { message, ...payload } = data || {};
      setState(prev => ({ ...prev, ...payload }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Set verification status
  const setVerificationStatus = useCallback((status, failedDocs = []) => {
    setState(prev => ({
      ...prev,
      verificationStatus: status,
      failedDocuments: failedDocs,
    }));
  }, []);

  // Submit verification to backend
  const submitVerification = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await onboardingAPI.submitVerification();
      const { message, ...payload } = data || {};
      setState(prev => ({ ...prev, ...payload }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh status from backend
  const refreshStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await onboardingAPI.getStatus();
      setState(prev => ({ ...prev, ...data }));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset failed documents
  const resetFailedDocuments = useCallback(() => {
    setState(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        ...prev.failedDocuments.reduce((acc, doc) => ({ ...acc, [doc]: false }), {}),
      },
      failedDocuments: [],
    }));
  }, []);

  // Set account activated
  const setAccountActivated = useCallback((activated) => {
    setState(prev => ({
      ...prev,
      accountActivated: activated,
    }));
  }, []);

  // Navigate to screen
  const navigateToScreen = useCallback((screenNumber) => {
    setState(prev => ({
      ...prev,
      currentScreen: screenNumber,
      completedScreens: screenNumber > prev.currentScreen 
        ? [...new Set([...prev.completedScreens, prev.currentScreen])]
        : prev.completedScreens,
    }));
  }, []);

  // Check if all eligibility items are checked
  const isEligibilityComplete = useCallback(() => {
    const { isLicensedAgent, worksUnderAgency, agreesToRules } = state.eligibility;
    return isLicensedAgent && worksUnderAgency && agreesToRules;
  }, [state.eligibility]);

  // Check if basic details are valid
  const isBasicDetailsValid = useCallback(() => {
    const { fullName, email, phone } = state.basicDetails;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    
    return (
      fullName.trim().length >= 2 &&
      emailRegex.test(email) &&
      phoneRegex.test(phone)
    );
  }, [state.basicDetails]);

  // Check if all documents are uploaded
  const areAllDocumentsUploaded = useCallback(() => {
    const { emiratesId, workVisa, brokerLicense } = state.documents;
    return emiratesId && workVisa && brokerLicense;
  }, [state.documents]);

  // Check if failed documents are re-uploaded
  const areFailedDocumentsFixed = useCallback(() => {
    return state.failedDocuments.every(doc => state.documents[doc]);
  }, [state.failedDocuments, state.documents]);

  // Check if can access dashboard
  const canAccessDashboard = useCallback(() => {
    return state.verificationStatus === 'approved' && state.accountActivated;
  }, [state.verificationStatus, state.accountActivated]);

  // Get last incomplete screen
  const getLastIncompleteScreen = useCallback(() => {
    if (!isEligibilityComplete()) return 2;
    if (!isBasicDetailsValid()) return 3;
    if (!areAllDocumentsUploaded()) return 4;
    if (state.verificationStatus !== 'approved') return 5;
    if (!state.accountActivated) return 8;
    return 10;
  }, [
    isEligibilityComplete, 
    isBasicDetailsValid, 
    areAllDocumentsUploaded, 
    state.verificationStatus, 
    state.accountActivated
  ]);

  // Reset state
  const resetOnboarding = useCallback(() => {
    setState(initialState);
  }, []);

  const value = {
    state,
    loading,
    error,
    isInitialized,
    registerUser,
    loginUser,
    logoutUser,
    updateEligibility,
    updateBasicDetails,
    updateDocument,
    setVerificationStatus,
    submitVerification,
    refreshStatus,
    resetFailedDocuments,
    setAccountActivated,
    navigateToScreen,
    isEligibilityComplete,
    isBasicDetailsValid,
    areAllDocumentsUploaded,
    areFailedDocumentsFixed,
    canAccessDashboard,
    getLastIncompleteScreen,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingContext;
