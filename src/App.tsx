import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { LoginForm } from './components/LoginForm';
import { EventsManager } from './components/EventsManager';
import { SupabaseStatus } from './components/SupabaseStatus';
import { Loader2 } from 'lucide-react';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    // Auth state will be updated automatically by the listener
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowStatus(!showStatus)}
            className="bg-white shadow-lg border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Supabase Status
          </button>
        </div>
        {showStatus && (
          <div className="fixed top-16 right-4 z-50 w-80">
            <SupabaseStatus />
          </div>
        )}
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowStatus(!showStatus)}
          className="bg-white shadow-lg border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Supabase Status
        </button>
      </div>
      {showStatus && (
        <div className="fixed top-16 right-4 z-50 w-80">
          <SupabaseStatus />
        </div>
      )}
      <EventsManager 
        onLogout={handleLogout} 
        userEmail={user.email || ''} 
      />
    </div>
  );
}

export default App;