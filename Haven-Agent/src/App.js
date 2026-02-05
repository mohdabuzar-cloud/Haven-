import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OnboardingProvider } from "@/context/OnboardingContext";

// Screen imports
import { Screen1Welcome } from "@/screens/Screen1Welcome";
import { Screen2Eligibility } from "@/screens/Screen2Eligibility";
import { Screen3BasicDetails } from "@/screens/Screen3BasicDetails";
import { Screen4Documents } from "@/screens/Screen4Documents";
import { Screen5Verification } from "@/screens/Screen5Verification";
import { Screen6Failed } from "@/screens/Screen6Failed";
import { Screen7Approved } from "@/screens/Screen7Approved";
import { Screen8Activation } from "@/screens/Screen8Activation";
import { Screen10Dashboard } from "@/screens/Screen10Dashboard";

function App() {
  return (
    <OnboardingProvider>
      <BrowserRouter>
        <Routes>
          {/* Screen 1: Welcome */}
          <Route path="/" element={<Screen1Welcome />} />
          
          {/* Screen 2: Eligibility */}
          <Route path="/onboarding/eligibility" element={<Screen2Eligibility />} />
          
          {/* Screen 3: Basic Details */}
          <Route path="/onboarding/details" element={<Screen3BasicDetails />} />
          
          {/* Screen 4: Document Upload */}
          <Route path="/onboarding/documents" element={<Screen4Documents />} />
          
          {/* Screen 5: Verification In Progress */}
          <Route path="/onboarding/verification" element={<Screen5Verification />} />
          
          {/* Screen 6: Verification Failed */}
          <Route path="/onboarding/failed" element={<Screen6Failed />} />
          
          {/* Screen 7: Verification Approved */}
          <Route path="/onboarding/approved" element={<Screen7Approved />} />
          
          {/* Screen 8: Account Activation - Now goes directly to dashboard */}
          <Route path="/onboarding/activate" element={<Screen8Activation />} />
          
          {/* Screen 10: Dashboard */}
          <Route path="/dashboard" element={<Screen10Dashboard />} />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </OnboardingProvider>
  );
}

export default App;
