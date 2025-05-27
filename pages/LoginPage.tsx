import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { APP_NAME, ICONS } from '../constants';
import { AuthContextType } from '../types';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading, user } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      // Navigation is handled by useEffect
    } catch (err: any) {
      setError(err.message || 'Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-clinic-background p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-clinic-primary">{APP_NAME}</h1>
          <p className="text-clinic-text-secondary">Bem-vindo(a) de volta!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-clinic-text-primary">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-clinic-primary focus:border-clinic-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-clinic-text-primary">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-clinic-primary focus:border-clinic-primary sm:text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              leftIcon={ICONS.LOGIN}
            >
              Entrar
            </Button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-clinic-text-secondary">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-clinic-primary hover:text-clinic-secondary">
            Cadastre-se
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;