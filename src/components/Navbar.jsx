'use client';

import React from 'react';
import { BookOpen, MessageSquare, Calendar, LogOut, User, ShieldCheck, GraduationCap } from 'lucide-react';

export default function Navbar({ user, activeTab, setActiveTab, onLogout }) {
  const isTeacher = user?.role === 'teacher';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base tracking-tight text-slate-900">
                IIIT Sri City Portal
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                UG2 Monsoon 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Academic Slides, Doubts & UG2 Free Slot Timetable</p>
          </div>
        </div>

        {/* Navigation Tabs (White + Green Theme) */}
        <nav className="flex items-center space-x-1.5">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'timetable'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>UG2 Timetable</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'slides'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Slides & Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Doubt Chat</span>
          </button>
        </nav>

        {/* User Info & Role Badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-900">{user?.name}</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span
                className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                  isTeacher
                    ? 'bg-amber-50 text-amber-900 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                }`}
              >
                {isTeacher ? <ShieldCheck className="w-3 h-3 text-amber-700" /> : <User className="w-3 h-3 text-emerald-700" />}
                {user?.role}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{isTeacher ? user?.subject : user?.rollNo}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
