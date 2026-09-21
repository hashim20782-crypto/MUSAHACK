import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { TransactionProvider } from './context/TransactionContext';
import { RouterProvider, useRouter, ROUTES } from './components/Router';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { FarmerSignupPage } from './pages/FarmerSignupPage';
import { DashboardPage } from './pages/DashboardPage';

function RouteRenderer() {
  const { currentRoute } = useRouter();

  switch (currentRoute) {
    case ROUTES.LOGIN:
      return <LoginPage />;
    case ROUTES.SIGNUP:
      return <SignupPage />;
    case ROUTES.FARMER_SIGNUP:
      return <FarmerSignupPage />;
    case ROUTES.DASHBOARD:
      return <DashboardPage />;
    default:
      return <DashboardPage />;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <TransactionProvider>
            <RouterProvider>
              <RouteRenderer />
            </RouterProvider>
          </TransactionProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
