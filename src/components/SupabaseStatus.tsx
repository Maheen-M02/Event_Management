import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const SupabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setStatus('checking');
      setError(null);

      // Test the connection by making a simple query
      const { data, error } = await supabase
        .from('events')
        .select('count', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      setStatus('connected');
    } catch (err) {
      console.error('Supabase connection error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking connection...';
      case 'connected':
        return 'Connected to Supabase';
      case 'error':
        return `Connection failed: ${error}`;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'border-yellow-200 bg-yellow-50';
      case 'connected':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} mb-6`}>
      <div className="flex items-center gap-3">
        <Database className="w-6 h-6 text-gray-600" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Supabase Integration</h3>
          <div className="flex items-center gap-2 mt-1">
            {getStatusIcon()}
            <span className="text-sm text-gray-600">{getStatusText()}</span>
          </div>
        </div>
        {status === 'error' && (
          <button
            onClick={checkConnection}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};