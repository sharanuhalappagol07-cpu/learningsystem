import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/Layout/AppShell';
import { Spinner, Alert } from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Calendar } from 'lucide-react';

export function Profile() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (loading) {
    return (
      <AppShell>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner className="h-8 w-8 text-primary-600" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <Alert type="error" message="User not found" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

        <div className="card space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">Student</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Member since</p>
                <p className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
