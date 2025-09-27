import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded border">
                  <p className="font-medium text-blue-900">Admin Account:</p>
                  <p className="text-blue-700">Email: admin@university.edu</p>
                  <p className="text-blue-700">Password: admin123</p>
                </div>
                <div className="bg-green-50 p-3 rounded border">
                  <p className="font-medium text-green-900">Coordinator Account:</p>
                  <p className="text-green-700">Email: coordinator@university.edu</p>
                  <p className="text-green-700">Password: coord123</p>
                </div>
                <div className="bg-purple-50 p-3 rounded border">
                  <p className="font-medium text-purple-900">Reviewer Account:</p>
                  <p className="text-purple-700">Email: reviewer@university.edu</p>
                  <p className="text-purple-700">Password: review123</p>
                </div>
              </div>
              <p className="text-xs mt-3 text-gray-500">
                <strong>Setup:</strong> Click "Connect to Supabase" in the top right, then create these accounts in your Supabase Auth dashboard.
              </p>
            </div>
          </div>
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