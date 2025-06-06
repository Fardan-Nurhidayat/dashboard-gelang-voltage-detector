import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    // Jika tidak ada user di localStorage, redirect ke login
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return children;
};
