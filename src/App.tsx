import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import DashboardPage from "./Dashboard"; // Komponen dari Dashboard.tsx
import { LoginForm } from "./components/login-form"; // Komponen dari login-form.tsx
import { ProtectedRoute } from "./components/ProtectedRoute";
import HistoriPage from "./HistoriPage";
import WelcomePage from "./WelcomePage";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={<WelcomePage />}
        />
        <Route
          path='/login'
          element={
            <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
              <div className='w-full max-w-sm'>
                <LoginForm />
              </div>
            </div>
          }
        />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/histori-data/:userId'
          element={
            <ProtectedRoute>
              <HistoriPage />
            </ProtectedRoute>
          }
        />
        {/* Mengarahkan root path ke /login secara default */}
        <Route
          path='/'
          element={
            <Navigate
              to='/login'
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
