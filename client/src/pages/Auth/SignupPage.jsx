import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Input, Select } from '../../components/UI';
import { useAuth } from '../../Hooks/useAuth';
import { useToast } from '../../Hooks/useToast';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2
    phone: '',
    department: '',
    position: '',
    // Step 3
    address: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        showError('Please fill all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showError('Passwords do not match');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      showError('Please agree to terms and conditions');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      showSuccess('Registration successful!');
      navigate('/login');
    } catch (error) {
      showError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-500 via-primary-500 to-secondary-700 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Join Staffly HRMS</h1>
          <p className="text-primary-100">Create your account in just a few steps</p>
        </div>

        {/* Signup Card */}
        <Card variant="elevated" className="backdrop-blur-sm bg-white/95 dark:bg-dark-800/95">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-dark-700 text-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > s ? 'bg-primary-600' : 'bg-gray-200 dark:bg-dark-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Basic Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Let's start with your basic details
                  </p>
                </div>

                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  leftIcon={<span>👤</span>}
                  required
                />

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
                  helperText="Must be at least 8 characters"
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  leftIcon={<span>🔒</span>}
                  required
                />
              </div>
            )}

            {/* Step 2: Work Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Work Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tell us about your role
                  </p>
                </div>

                <Input
                  label="Phone Number"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  leftIcon={<span>📱</span>}
                />

                <Select
                  label="Department"
                  placeholder="Select department"
                  options={[
                    { value: 'engineering', label: 'Engineering' },
                    { value: 'hr', label: 'Human Resources' },
                    { value: 'sales', label: 'Sales' },
                    { value: 'marketing', label: 'Marketing' },
                    { value: 'finance', label: 'Finance' },
                  ]}
                  value={formData.department}
                  onChange={(value) => setFormData({ ...formData, department: value })}
                />

                <Input
                  label="Position"
                  placeholder="Software Engineer"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  leftIcon={<span>💼</span>}
                />
              </div>
            )}

            {/* Step 3: Final Details */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Almost Done!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Just a few more details
                  </p>
                </div>

                <Input
                  label="Address"
                  placeholder="123 Main St, City, Country"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  leftIcon={<span>📍</span>}
                />

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-dark-600 text-primary-600 focus:ring-primary-500"
                    required
                  />
                  <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  Create Account
                </Button>
              )}
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
