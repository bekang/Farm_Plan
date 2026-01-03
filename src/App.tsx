import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { RootLayout } from './components/layout/RootLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Settings } from 'lucide-react';

// Lazy Load Components
const FieldDashboard = React.lazy(() =>
  import('./components/farm/FieldDashboard').then((module) => ({ default: module.FieldDashboard })),
);
const RevenueCalculator = React.lazy(() =>
  import('./components/simulation/RevenueCalculator').then((module) => ({
    default: module.RevenueCalculator,
  })),
);
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { FinancialLedgerPage } from './pages/FinancialLedgerPage';
import { FinancialReportPage } from './pages/FinancialReportPage';
import { ConsultingReportPage } from './pages/ConsultingReportPage';
import FinancialEvidencePage from './pages/FinancialEvidencePage';
import ConsultingEvidencePage from './pages/ConsultingEvidencePage';
import { FarmRegistrationPage } from './pages/FarmRegistrationPage';
import { CropPlanningPage } from './pages/CropPlanningPage';
import { CropPlanningDetail } from './pages/CropPlanningDetail';
import TimelinePlayground from './pages/TimelinePlayground';

// Text Loader
const PageLoader = () => (
  <div className="flex h-full min-h-[50vh] flex-col items-center justify-center space-y-4">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
    <p className="animate-pulse font-medium text-stone-500">페이지를 준비하고 있습니다...</p>
  </div>
);

function App() {
  console.log('[App] v2.1 Application Loaded');
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Playground Routes */}
        <Route
            path="/playground/timeline"
            element={
              <ErrorBoundary>
                <TimelinePlayground />
              </ErrorBoundary>
            }
          />

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
            path="revenue-calc"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <RevenueCalculator />
                </Suspense>
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



          <Route
            path="admin"
            element={
              <div className="mx-auto max-w-7xl p-8 text-center text-stone-500">
                <Settings className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <h2 className="text-xl font-bold">시스템 데이터 관리자</h2>
                <p className="mt-2 text-sm">준비 중입니다.</p>
              </div>
            }
          />

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
