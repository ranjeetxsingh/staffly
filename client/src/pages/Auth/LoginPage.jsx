import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Input, Checkbox } from '../../components/UI';
import { useAuth } from '../../Hooks/useAuth';
import { useToast } from '../../Hooks/useToast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      showSuccess('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      showError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth logic
    showError('Google login not yet implemented');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Staffly HRMS</h1>
          <p className="text-primary-100">Welcome back! Please login to your account.</p>
        </div>

        {/* Login Card */}
        <Card variant="elevated" className="backdrop-blur-sm bg-white/95 dark:bg-dark-800/95">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Sign In
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your credentials to access your account
              </p>
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<span>📧</span>}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              leftIcon={<span>🔒</span>}
              required
            />

            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              />
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Sign In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-dark-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <span className="mr-2">🔍</span>
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-primary-100 text-sm mt-6">
          © 2024 Staffly HRMS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
