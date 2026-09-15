'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SlideManager from '@/components/SlideManager';
import ChatSystem from '@/components/ChatSystem';
import Timetable from '@/components/Timetable';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timetable');

  useEffect(() => {
    const storedUser = localStorage.getItem('iiits_user');
    if (!storedUser) {
      router.push('/login');
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        router.push('/login');
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('iiits_user');
    setUser(null);
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-600 text-xs font-semibold">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading IIIT Sri City Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white">
        {activeTab === 'timetable' && (
          <Timetable user={user} onNavigateToChat={() => setActiveTab('chat')} />
        )}

        {activeTab === 'slides' && (
          <SlideManager user={user} />
        )}

        {activeTab === 'chat' && (
          <ChatSystem user={user} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 font-medium">
        <p>© 2026 Indian Institute of Information Technology Sri City, Chittoor • UG 2 Academic Portal</p>
      </footer>

    </div>
  );
}
