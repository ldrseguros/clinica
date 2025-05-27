import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { APP_NAME, ICONS } from '../constants';
import { AuthContextType } from '../types';

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated, isLoading } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      await register(name, email, password);
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Falha no cadastro. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-clinic-background p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-clinic-primary">{APP_NAME}</h1>
          <p className="text-clinic-text-secondary">Crie sua conta para acessar o sistema.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-clinic-text-primary">
              Nome Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-clinic-primary focus:border-clinic-primary sm:text-sm"
            />
          </div>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-clinic-primary focus:border-clinic-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-clinic-text-primary">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              leftIcon={ICONS.USER_CIRCLE}
            >
              Cadastrar
            </Button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-clinic-text-secondary">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-clinic-primary hover:text-clinic-secondary">
            Faça login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;