'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Filter, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Timetable({ user, onNavigateToChat }) {
  const isTeacher = user?.role === 'teacher';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('All');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/timetable');
      const resData = await res.json();
      setData(resData);
    } catch (err) {
      console.error('Failed to fetch timetable', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-24 bg-slate-200/60 rounded-2xl animate-pulse"></div>
        <div className="h-96 bg-slate-200/60 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  const { institution, timeSlots, days, timetable, freeSlotsCount, freeSlotsList } = data;

  const filteredDays = activeDay === 'All' ? days : [activeDay];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Free Slot Counter (Light Theme) */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
                {institution.batch} Official Schedule
              </span>
              <span className="text-xs text-slate-600 font-semibold">({institution.session})</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {institution.name}
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Teacher & Student schedule analyzer featuring automated <strong className="text-emerald-700 font-bold">Free Slot Highlighting</strong>. Teachers can easily locate open slots to organize extra classes or doubt solving sessions.
            </p>
          </div>

          {/* Free Slots KPI Badge */}
          <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-emerald-300 shadow-sm flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-800 leading-none">{freeSlotsCount} Free Slots</div>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Identified in UG2 Schedule</p>
            </div>
          </div>
        </div>
      </div>

      {/* Free Slots Quick List Bar */}
      <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              UG2 Student Available Free Slots
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-bold">
            {isTeacher ? 'Click any free slot to schedule a doubt session' : 'Students are available during these slots'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {freeSlotsList.map((fs, i) => (
            <div
              key={i}
              className="bg-emerald-50/70 border border-emerald-300 hover:border-emerald-500 p-3.5 rounded-xl flex items-center justify-between transition-all group"
            >
              <div>
                <span className="text-xs font-bold text-emerald-800">{fs.day}</span>
                <p className="text-xs text-slate-700 font-semibold">{fs.time}</p>
              </div>
              <button
                onClick={() => {
                  if (onNavigateToChat) onNavigateToChat();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1"
              >
                <span>Book Slot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar: Day Filter & Free Slot Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Day Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {['All', ...days].map(d => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeDay === d
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Free Slot Toggle & Search */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              showFreeOnly
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Show Free Slots Only</span>
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course (e.g. DBMS, ADSA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

      </div>

      {/* Main Timetable Table View (Light Professional Design) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200">
              <th className="py-4 px-4 w-44 border-r border-slate-200">Time Slot</th>
              {filteredDays.map(d => (
                <th key={d} className="py-4 px-4 text-center border-r border-slate-200 last:border-r-0">
                  {d}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 text-xs">
            {timeSlots.map((ts) => {

              // Handle Break Rows
              if (ts.type === 'break') {
                return (
                  <tr key={ts.id} className="bg-amber-50 text-amber-900 border-y border-amber-200 font-bold">
                    <td className="py-2.5 px-4 text-slate-600 font-semibold border-r border-slate-200">
                      {ts.time}
                    </td>
                    <td colSpan={filteredDays.length} className="py-2.5 px-4 text-center tracking-widest text-[11px] uppercase">
                      ☕ {ts.label}
                    </td>
                  </tr>
                );
              }

              // Standard Class / Free Slot Row
              return (
                <tr key={ts.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Time Slot Cell */}
                  <td className="py-3 px-4 font-bold text-slate-800 bg-slate-50 border-r border-slate-200 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ts.time}</span>
                    </div>
                  </td>

                  {/* Day Columns */}
                  {filteredDays.map(d => {
                    const slotData = timetable[d]?.[ts.id];
                    const isFree = slotData?.isFree;

                    if (showFreeOnly && !isFree) {
                      return (
                        <td key={d} className="py-3 px-3 border-r border-slate-200 last:border-r-0 text-center text-slate-300 bg-slate-50/40">
                          -
                        </td>
                      );
                    }

                    // FREE SLOT CELL (Clean Light Emerald Highlight)
                    if (isFree) {
                      return (
                        <td
                          key={d}
                          className="py-3 px-3 border-r border-slate-200 last:border-r-0 bg-emerald-50 border-2 border-emerald-500 rounded-xl p-2.5 m-1 transition-all shadow-xs"
                        >
                          <div className="flex flex-col items-center justify-center text-center space-y-1">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 fill-white" /> FREE SLOT
                            </span>
                            <span className="text-[11px] font-bold text-emerald-800">
                              UG2 Students Free
                            </span>
                            <button
                              onClick={() => {
                                if (onNavigateToChat) onNavigateToChat();
                              }}
                              className="mt-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold shadow-xs transition-all"
                            >
                              {isTeacher ? 'Schedule Class' : 'Ask Doubt'}
                            </button>
                          </div>
                        </td>
                      );
                    }

                    // BUSY CLASS CELL
                    const items = slotData?.items || [];
                    const matchesSearch = searchQuery === '' || items.some(it => 
                      it.course.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      it.room.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    return (
                      <td
                        key={d}
                        className={`py-3 px-3 border-r border-slate-200 last:border-r-0 ${
                          !matchesSearch ? 'opacity-30' : ''
                        }`}
                      >
                        <div className="space-y-1.5">
                          {items.map((it, idx) => (
                            <div
                              key={idx}
                              className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]"
                            >
                              <span className="font-bold text-slate-900">{it.course}</span>
                              <span className="px-1.5 py-0.5 rounded bg-white text-indigo-700 text-[10px] font-mono border border-slate-300 font-semibold">
                                {it.room}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}
