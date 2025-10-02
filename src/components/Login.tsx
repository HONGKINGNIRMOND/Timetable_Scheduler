import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, AlertCircle, HelpCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserSetupGuide } from './UserSetupGuide';
import { StudentSignup } from './StudentSignup';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSignup) {
    return <StudentSignup onBackToLogin={() => setShowSignup(false)} />;
  }

  if (showSetupGuide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => setShowSetupGuide(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Login
            </button>
          </div>
          <UserSetupGuide />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Scheduler</h1>
          <p className="text-gray-600">Intelligent Timetable Optimization Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowSetupGuide(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center w-full"
              >
                <HelpCircle size={16} className="mr-1" />
                Need help setting up? View Setup Guide
              </button>
            </div>

            <div className="text-center mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Don't have a student account?</p>
              <button
                onClick={() => setShowSignup(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center w-full"
              >
                <UserPlus size={16} className="mr-1" />
                Create Student Account
              </button>
            </div>
          </form>

        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-gray-600">
              <div className="font-medium">Smart Optimization</div>
              <div className="text-xs mt-1">AI-powered scheduling</div>
            </div>
            <div className="text-gray-600">
              <div className="font-medium">Multi-Department</div>
              <div className="text-xs mt-1">Cross-department support</div>
            </div>
            <div className="text-gray-600">
              <div className="font-medium">Real-time Updates</div>
              <div className="text-xs mt-1">Live schedule management</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}