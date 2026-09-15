'use client';

import React from 'react';
import { BookOpen, MessageSquare, Calendar, LogOut, User, ShieldCheck, GraduationCap } from 'lucide-react';

export default function Navbar({ user, activeTab, setActiveTab, onLogout }) {
  const isTeacher = user?.role === 'teacher';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg tracking-tight text-slate-900">
                IIIT Sri City Portal
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                UG2 Monsoon 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Academic Slides, Doubts & UG2 Free Slot Timetable</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'timetable'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>UG2 Timetable</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'slides'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Slides & Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Doubt Chat</span>
          </button>
        </nav>

        {/* User Info & Role Badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800">{user?.name}</span>
            <div className="flex items-center space-x-1.5">
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                  isTeacher
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                }`}
              >
                {isTeacher ? <ShieldCheck className="w-3 h-3 text-amber-700" /> : <User className="w-3 h-3 text-cyan-700" />}
                {user?.role}
              </span>
              <span className="text-xs text-slate-500 font-medium">{isTeacher ? user?.subject : user?.rollNo}</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Logout"
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
