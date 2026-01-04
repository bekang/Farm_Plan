import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { RootLayout } from './components/layout/RootLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Settings } from 'lucide-react';

// Lazy Load Components
const FieldDashboard = React.lazy(() =>
  import('./components/farm/FieldDashboard').then((module) => ({ default: module.FieldDashboard })),
);

import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/auth/LoginPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { FinancialLedgerPage } from './pages/FinancialLedgerPage';
import { FinancialReportPage } from './pages/FinancialReportPage';
import { ConsultingReportPage } from './pages/ConsultingReportPage';
import FinancialEvidencePage from './pages/FinancialEvidencePage';
import ConsultingEvidencePage from './pages/ConsultingEvidencePage';
import { FarmRegistrationPage } from './pages/FarmRegistrationPage';
import { CropPlanningPage } from './pages/CropPlanningPage';
import { CropPlanningDetail } from './pages/CropPlanningDetail';

import { AdminDashboard } from './pages/AdminDashboard';
import { PageManager } from './pages/admin/PageManager';
import { SystemDocumentation } from './pages/admin/SystemDocumentation';
import { ApiManager } from './pages/admin/ApiManager';
import { UserManager } from './pages/admin/UserManager';
import { ProgramTableManager } from './pages/admin/ProgramTableManager';
import { ProgramStructureViewer } from './pages/admin/ProgramStructureViewer';
import { CoverPage } from './pages/CoverPage';

// Text Loader
const PageLoader = () => (
  <div className="flex h-full min-h-[50vh] flex-col items-center justify-center space-y-4">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
    <p className="animate-pulse font-medium text-stone-500">페이지를 준비하고 있습니다...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoverPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Wrap all routes in RootLayout */}
        <Route path="/dashboard" element={<RootLayout />}>
          <Route
            index
            element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            }
          />

          <Route
            path="financial-ledger"
            element={
              <ErrorBoundary>
                <FinancialLedgerPage />
              </ErrorBoundary>
            }
          />

          <Route
            path="financial-report"
            element={
              <ErrorBoundary>
                <FinancialReportPage />
              </ErrorBoundary>
            }
          />

          <Route
            path="financial-evidence"
            element={
              <ErrorBoundary>
                <FinancialEvidencePage />
              </ErrorBoundary>
            }
          />

          <Route
            path="consulting-report"
            element={
              <ErrorBoundary>
                <ConsultingReportPage />
              </ErrorBoundary>
            }
          />

          <Route
            path="consulting-evidence"
            element={
              <ErrorBoundary>
                <ConsultingEvidencePage />
              </ErrorBoundary>
            }
          />

          <Route
            path="farm-registration"
            element={
              <ErrorBoundary>
                <FarmRegistrationPage />
              </ErrorBoundary>
            }
          />

          <Route
            path="farm-dashboard"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <FieldDashboard />
                </Suspense>
              </ErrorBoundary>
            }
          />

          <Route
            path="planning"
            element={
              <ErrorBoundary>
                <CropPlanningPage />
              </ErrorBoundary>
            }
          />

          <Route
            path="planning/:fieldId"
            element={
              <ErrorBoundary>
                <CropPlanningDetail />
              </ErrorBoundary>
            }
          />

          <Route path="admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
          <Route path="admin/pages" element={<ErrorBoundary><PageManager /></ErrorBoundary>} />
          <Route path="admin/system" element={<ErrorBoundary><SystemDocumentation /></ErrorBoundary>} />
          <Route path="admin/table-config" element={<ErrorBoundary><ProgramTableManager /></ErrorBoundary>} />
          <Route path="admin/structure-viewer" element={<ErrorBoundary><ProgramStructureViewer /></ErrorBoundary>} />
          <Route path="admin/api-config" element={<ErrorBoundary><ApiManager /></ErrorBoundary>} />
          <Route path="admin/users" element={<ErrorBoundary><UserManager /></ErrorBoundary>} />

          <Route
            path="*"
            element={
              <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-stone-500">
                <p className="mb-4 text-6xl">🤔</p>
                <h2 className="mb-2 text-2xl font-bold text-stone-700">
                  페이지를 찾을 수 없습니다.
                </h2>
                <Link
                  to="/"
                  className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
