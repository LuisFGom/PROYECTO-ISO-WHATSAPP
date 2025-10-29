import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

// 🛑 CORRECCIÓN DE RUTAS: Eliminado el doble 'pages'
import { LoginPage } from '../pages/LoginPage'; 
import { RegisterPage } from '../pages/RegisterPage'; 
import { HomePage } from '../pages/HomePage'; 

// --- PrivateRoute ---
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// --- PublicRoute (Redirección Inmediata) ---
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  // 🛑 CLAVE: Reacciona al cambio de estado de isAuthenticated
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  console.log('🔷 PublicRoute renderizado');
  console.log('🔷 isAuthenticated actual:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('🔷 Mostrando children (no autenticado)');
    return <>{children}</>;
  } else {
    // Se ejecuta inmediatamente al llamar a setAuth en LoginPage
    console.log('🔷🔷🔷 LOGIN EXITOSO: NAVEGANDO A /home 🔷🔷🔷');
    return <Navigate to="/home" replace />;
  }
};

// --- AppRouter ---
export const AppRouter = () => {
  const initAuth = useAuthStore((state) => state.initAuth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initAuth();
    setIsInitializing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isInitializing) { 
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-whatsapp-green">Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};