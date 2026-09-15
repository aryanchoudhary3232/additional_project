'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, ShieldCheck, User, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('teacher');
  const [email, setEmail] = useState('teacher@iiits.ac.in');
  const [password, setPassword] = useState('teacher123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'teacher') {
      setEmail('teacher@iiits.ac.in');
      setPassword('teacher123');
    } else {
      setEmail('rahul@iiits.ac.in');
      setPassword('student123');
    }
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed.');
        setLoading(false);
        return;
      }

      localStorage.setItem('iiits_user', JSON.stringify(data.user));
      router.push('/');
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const quickDemoLogin = (demoUser) => {
    localStorage.setItem('iiits_user', JSON.stringify(demoUser));
    router.push('/');
  };

  const demoTeacher = {
    id: "u1",
    name: "Dr. Ananya Sharma",
    email: "teacher@iiits.ac.in",
    role: "teacher",
    department: "Computer Science & Engineering",
    subject: "DBMS & Systems",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  };

  const demoStudent = {
    id: "u2",
    name: "Rahul Verma",
    email: "rahul@iiits.ac.in",
    role: "student",
    rollNo: "UG2026-CSE-042",
    batch: "UG 2 (Batch G04)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 relative">
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-600/30 mb-2">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            IIIT Sri City Portal
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Monsoon 2026 • UG 2 Teacher & Student Portal
          </p>
        </div>

        {/* 1-Click Quick Demo Access Card */}
        <div className="bg-white border border-indigo-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Instant 1-Click Demo Login
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => quickDemoLogin(demoTeacher)}
              className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-left transition-all group"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-900">Teacher Login</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">Dr. Ananya Sharma</p>
            </button>

            <button
              onClick={() => quickDemoLogin(demoStudent)}
              className="p-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 text-left transition-all group"
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-cyan-700" />
                <span className="text-xs font-bold text-cyan-900">Student Login</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">Rahul Verma (UG2)</p>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5">
          
          {/* Role Switcher Pills */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-all ${
                role === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Teacher</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-all ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username@iiits.ac.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all"
            >
              <span>{loading ? 'Authenticating...' : `Sign In as ${role === 'teacher' ? 'Teacher' : 'Student'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
