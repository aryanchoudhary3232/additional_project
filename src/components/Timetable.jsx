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
      <div className="space-y-4 py-8 bg-white">
        <div className="h-20 bg-emerald-50/50 rounded-xl animate-pulse border border-emerald-100"></div>
        <div className="h-96 bg-slate-50 rounded-xl animate-pulse border border-slate-200"></div>
      </div>
    );
  }

  const { institution, timeSlots, days, timetable, freeSlotsCount, freeSlotsList } = data;

  const filteredDays = activeDay === 'All' ? days : [activeDay];

  return (
    <div className="space-y-5 bg-white">
      
      {/* Top Banner (White + Green Theme) */}
      <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-700 text-white uppercase tracking-wider">
              {institution.batch} Timetable
            </span>
            <span className="text-xs text-slate-600 font-semibold">({institution.session})</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1.5 tracking-tight">
            {institution.name}
          </h2>
          <p className="text-xs text-slate-700 mt-1">
            Official UG2 Schedule with <strong className="text-emerald-800 font-bold">Free Slot Highlighter</strong>. Teachers can check when students are free for extra classes or doubt solving.
          </p>
        </div>

        {/* Free Slots KPI Badge */}
        <div className="flex items-center space-x-3 bg-white border border-emerald-300 p-3.5 rounded-lg shadow-2xs flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-900 leading-none">{freeSlotsCount} Free Slots</div>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">Available for Doubt Sessions</p>
          </div>
        </div>
      </div>

      {/* Free Slots Quick List Bar */}
      <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              UG2 Student Available Free Slots
            </h3>
          </div>
          <span className="text-xs text-emerald-700 font-bold">
            {isTeacher ? 'Click any free slot to schedule a doubt session' : 'Students are available during these hours'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {freeSlotsList.map((fs, i) => (
            <div
              key={i}
              className="bg-emerald-50/70 border border-emerald-300 hover:border-emerald-400 p-3 rounded-lg flex items-center justify-between transition-all"
            >
              <div>
                <span className="text-xs font-bold text-emerald-900">{fs.day}</span>
                <p className="text-xs text-slate-700 font-semibold">{fs.time}</p>
              </div>
              <button
                onClick={() => {
                  if (onNavigateToChat) onNavigateToChat();
                }}
                className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center space-x-1"
              >
                <span>Book Slot</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar: Day Filter & Free Slot Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        
        {/* Day Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {['All', ...days].map(d => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
                activeDay === d
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Free Slot Toggle & Search */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowFreeOnly(!showFreeOnly)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-all ${
              showFreeOnly
                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-emerald-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Show Free Slots Only</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course (e.g. DBMS, ADSA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

      </div>

      {/* Main Timetable Grid (White + Green Theme) */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse min-w-[900px]">
          
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-100 text-slate-800 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-3 w-40 border-r border-slate-200">Time Slot</th>
              {filteredDays.map(d => (
                <th key={d} className="py-3 px-3 text-center border-r border-slate-200 last:border-r-0">
                  {d}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 text-xs bg-white">
            {timeSlots.map((ts) => {

              // Break Row
              if (ts.type === 'break') {
                return (
                  <tr key={ts.id} className="bg-amber-50/80 text-amber-900 border-y border-amber-200 font-bold">
                    <td className="py-2 px-3 text-slate-600 border-r border-slate-200 font-semibold">
                      {ts.time}
                    </td>
                    <td colSpan={filteredDays.length} className="py-2 px-3 text-center tracking-wider text-[11px] uppercase">
                      ☕ {ts.label}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={ts.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Time Slot Column */}
                  <td className="py-2.5 px-3 font-semibold text-slate-800 bg-slate-50 border-r border-slate-200 whitespace-nowrap">
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
                        <td key={d} className="py-2 px-2 border-r border-slate-200 last:border-r-0 text-center text-slate-300 bg-slate-50/30">
                          -
                        </td>
                      );
                    }

                    // FREE SLOT CELL (Highlighting Green)
                    if (isFree) {
                      return (
                        <td
                          key={d}
                          className="py-2.5 px-2 border-r border-slate-200 last:border-r-0 bg-emerald-50 border-2 border-emerald-400 rounded-md p-2 m-1 transition-all"
                        >
                          <div className="flex flex-col items-center justify-center text-center space-y-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-700 text-white uppercase tracking-wider">
                              FREE SLOT
                            </span>
                            <span className="text-[11px] font-bold text-emerald-950">
                              UG2 Students Free
                            </span>
                            <button
                              onClick={() => {
                                if (onNavigateToChat) onNavigateToChat();
                              }}
                              className="mt-0.5 px-2.5 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold shadow-2xs transition-all"
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
                        className={`py-2 px-2 border-r border-slate-200 last:border-r-0 ${
                          !matchesSearch ? 'opacity-30' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          {items.map((it, idx) => (
                            <div
                              key={idx}
                              className="p-1.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]"
                            >
                              <span className="font-bold text-slate-900">{it.course}</span>
                              <span className="px-1 py-0.2 rounded bg-white text-emerald-800 text-[10px] font-mono border border-slate-200 font-bold">
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
