// frontend/src/presentation/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import loginBackground from '../../assets/images/login-background.png';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUseCase.execute(formData);
      setAuth(response.data.user, response.data.token);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Lado izquierdo - Imagen */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBackground})` }}
      >
        <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-20">
          <h1 className="text-white text-5xl font-bold">WhatsApp Web</h1>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-whatsapp-green mb-2">
              LOGIN
            </h2>
            <h3 className="text-2xl font-semibold text-whatsapp-green">
              WHATSAPP WEB
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-whatsapp-green border-gray-300 rounded focus:ring-whatsapp-green"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Recordar Contraseña</span>
              </label>

              <button
                type="button"
                className="text-sm text-gray-600 hover:text-whatsapp-green"
                disabled={isLoading}
              >
                Olvidé mi Contraseña
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <Link
                to="/register"
                className="flex-1 py-3 px-6 bg-whatsapp-green text-white rounded-full font-semibold hover:bg-whatsapp-green-dark transition duration-200 text-center"
              >
                Registrarse
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-6 bg-whatsapp-green text-white rounded-full font-semibold hover:bg-whatsapp-green-dark transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};