import React, { useState } from 'react';
import { User, Key, Database, CheckCircle, AlertCircle, Copy } from 'lucide-react';

export function UserSetupGuide() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const demoAccounts = [
    {
      role: 'Admin',
      name: 'System Administrator',
      email: 'admin@university.edu',
      password: 'admin123',
      permissions: 'Full system access, user management, all departments',
      color: 'blue'
    },
    {
      role: 'Coordinator',
      name: 'Department Coordinator',
      email: 'coordinator@university.edu',
      password: 'coord123',
      permissions: 'Department management, timetable creation, faculty assignment',
      color: 'green'
    },
    {
      role: 'Reviewer',
      name: 'Academic Reviewer',
      email: 'reviewer@university.edu',
      password: 'review123',
      permissions: 'Timetable review and approval, conflict resolution',
      color: 'purple'
    }
  ];

  const setupSteps = [
    {
      step: 1,
      title: 'Connect to Supabase',
      description: 'Click the "Connect to Supabase" button in the top right corner',
      icon: Database
    },
    {
      step: 2,
      title: 'Run Database Migrations',
      description: 'The system will automatically create all necessary tables and sample data',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Create User Accounts',
      description: 'In your Supabase dashboard, go to Authentication > Users and create accounts with the emails below',
      icon: User
    },
    {
      step: 4,
      title: 'Test the System',
      description: 'Use the demo credentials to login and explore the timetable optimization features',
      icon: Key
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">System Setup Guide</h2>
          <p className="text-gray-600">Follow these steps to set up your Academic Timetable Optimization Platform</p>
        </div>

        {/* Setup Steps */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Steps</h3>
          <div className="space-y-4">
            {setupSteps.map((step) => (
              <div key={step.step} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <step.icon size={18} className="mr-2 text-blue-600" />
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo User Accounts</h3>
          <div className="grid gap-4">
            {demoAccounts.map((account) => (
              <div key={account.email} className={`border-2 border-${account.color}-200 bg-${account.color}-50 rounded-lg p-4`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className={`font-semibold text-${account.color}-900`}>{account.role} Account</h4>
                    <p className={`text-${account.color}-700 text-sm`}>{account.name}</p>
                  </div>
                  <User className={`text-${account.color}-600`} size={24} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white rounded p-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Email</span>
                      <p className="font-mono text-sm">{account.email}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(account.email, `email-${account.role}`)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {copiedField === `email-${account.role}` ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white rounded p-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Password</span>
                      <p className="font-mono text-sm">{account.password}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(account.password, `password-${account.role}`)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {copiedField === `password-${account.role}` ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong>Permissions:</strong> {account.permissions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="p-6 border-t border-gray-200 bg-yellow-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-yellow-900">Important Notes</h4>
              <ul className="text-yellow-800 text-sm mt-2 space-y-1">
                <li>• These are demo accounts for testing purposes only</li>
                <li>• In production, use strong passwords and enable MFA</li>
                <li>• The system includes comprehensive sample data for all departments</li>
                <li>• Role-based permissions are enforced at the database level</li>
                <li>• All data is stored securely with Row Level Security (RLS)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}