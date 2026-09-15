'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, CheckCircle, Clock, Plus, User, AlertCircle, Filter, Sparkles, BookOpen, Check, HelpCircle, X } from 'lucide-react';

export default function ChatSystem({ user }) {
  const isTeacher = user?.role === 'teacher';
  const [doubts, setDoubts] = useState([]);
  const [activeDoubtId, setActiveDoubtId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [replyText, setReplyText] = useState('');
  const [showNewDoubtModal, setShowNewDoubtModal] = useState(false);

  // New Doubt Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('DBMS');
  const [newQuestion, setNewQuestion] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchDoubts();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [activeDoubtId, doubts]);

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const url = isTeacher ? '/api/doubts' : `/api/doubts?studentId=${user?.id}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.doubts) {
        setDoubts(data.doubts);
        if (data.doubts.length > 0 && !activeDoubtId) {
          setActiveDoubtId(data.doubts[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load doubts', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeDoubt = doubts.find(d => d.id === activeDoubtId);

  const handleSendReply = async (customText = null, newStatus = null) => {
    const textToSend = customText || replyText;
    if (!textToSend.trim() || !activeDoubtId) return;

    try {
      const res = await fetch('/api/doubts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doubtId: activeDoubtId,
          senderId: user?.id,
          senderName: user?.name,
          role: user?.role,
          text: textToSend,
          newStatus: newStatus || (isTeacher ? 'In Progress' : activeDoubt?.status)
        })
      });

      const data = await res.json();
      if (data.success && data.doubt) {
        setDoubts(doubts.map(d => d.id === activeDoubtId ? data.doubt : d));
        setReplyText('');
      }
    } catch (err) {
      console.error('Send message error', err);
    }
  };

  const handleCreateDoubt = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim()) return;

    try {
      const res = await fetch('/api/doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id,
          studentName: user?.name,
          studentRoll: user?.rollNo || 'UG2026-STUDENT',
          studentAvatar: user?.avatar,
          subject: newSubject,
          title: newTitle,
          initialMessage: newQuestion
        })
      });

      const data = await res.json();
      if (data.success && data.doubt) {
        setDoubts([data.doubt, ...doubts]);
        setActiveDoubtId(data.doubt.id);
        setShowNewDoubtModal(false);
        setNewTitle('');
        setNewQuestion('');
      }
    } catch (err) {
      console.error('Create doubt error', err);
    }
  };

  const handleStatusChange = async (status) => {
    if (!activeDoubtId) return;
    try {
      const res = await fetch('/api/doubts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doubtId: activeDoubtId,
          senderId: user?.id,
          senderName: user?.name,
          role: user?.role,
          text: `[System Notice]: Doubt status updated to ${status}`,
          newStatus: status
        })
      });
      const data = await res.json();
      if (data.success && data.doubt) {
        setDoubts(doubts.map(d => d.id === activeDoubtId ? data.doubt : d));
      }
    } catch (err) {
      console.error('Status change error', err);
    }
  };

  const filteredDoubts = doubts.filter(d => {
    if (filterStatus === 'All') return true;
    return d.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const teacherPresets = [
    "Check Slide 4 in DBMS Lecture Notes.",
    "Available during Wednesday 4:30 PM Free Slot for 1-on-1 explanation!",
    "Great question! Refer to textbook section 3.2.",
    "Issue resolved. Let me know if you need further help!"
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-violet-600 text-white shadow-xs">
              <MessageSquare className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">Student Doubt Resolution Portal</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isTeacher
              ? 'Answer student questions, clarify concepts, or schedule doubt sessions during free slots.'
              : 'Ask questions to your IIIT Sri City professors and get personalized doubt solutions.'}
          </p>
        </div>

        {!isTeacher && (
          <button
            onClick={() => setShowNewDoubtModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-md shadow-violet-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ask New Doubt</span>
          </button>
        )}
      </div>

      {/* Main Chat Grid (Sidebar + Chat Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        
        {/* Left Sidebar: Threads List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            
            {/* Filter Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isTeacher ? 'Student Doubts Inbox' : 'My Question Threads'}
              </span>
              <div className="flex items-center space-x-1">
                {['All', 'Pending', 'Resolved'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      filterStatus === st
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Threads List */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredDoubts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No doubt questions found.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredDoubts.map(doubt => {
                  const isActive = doubt.id === activeDoubtId;

                  return (
                    <button
                      key={doubt.id}
                      onClick={() => setActiveDoubtId(doubt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isActive
                          ? 'bg-violet-50 border-violet-400 text-slate-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200 uppercase">
                          {doubt.subject}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            doubt.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : doubt.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                          }`}
                        >
                          {doubt.status === 'Resolved' ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />}
                          {doubt.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm mt-2 text-slate-900 line-clamp-1">{doubt.title}</h4>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                          {isTeacher ? doubt.studentName : 'Dr. Ananya Sharma'}
                        </span>
                        <span>{doubt.messages?.length || 0} msg</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* Right Area: Active Chat Conversation */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-xs overflow-hidden">
          
          {activeDoubt ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-violet-100 text-violet-800 border border-violet-200">
                      {activeDoubt.subject}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base truncate max-w-md">{activeDoubt.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Student: <strong className="text-slate-800">{activeDoubt.studentName}</strong> ({activeDoubt.studentRoll})
                  </p>
                </div>

                {/* Status Toggle buttons */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                      activeDoubt.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    Status: {activeDoubt.status}
                  </span>

                  {isTeacher && activeDoubt.status !== 'Resolved' && (
                    <button
                      onClick={() => handleStatusChange('Resolved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[420px] bg-slate-50/50">
                {activeDoubt.messages.map((msg, index) => {
                  const isMsgTeacher = msg.role === 'teacher';

                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isMsgTeacher ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-bold text-slate-700">{msg.senderName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            isMsgTeacher
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                          }`}
                        >
                          {msg.role}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                          isMsgTeacher
                            ? 'bg-violet-600 text-white font-medium rounded-tr-none shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips (Teacher Only) */}
              {isTeacher && (
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto scrollbar-none">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Reply:
                  </span>
                  {teacherPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendReply(preset, 'In Progress')}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-violet-50 text-slate-700 hover:text-violet-800 text-xs font-semibold border border-slate-300 hover:border-violet-300 whitespace-nowrap transition-all shadow-2xs"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              )}

              {/* Message Input Bar */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
                <input
                  type="text"
                  placeholder={isTeacher ? "Type your explanation or doubt resolution..." : "Ask follow-up question..."}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-600"
                />
                <button
                  onClick={() => handleSendReply()}
                  className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-600/20 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <HelpCircle className="w-12 h-12 mb-3 text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Select a doubt thread to read conversation</p>
            </div>
          )}

        </div>

      </div>

      {/* New Doubt Modal (Student) */}
      {showNewDoubtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-bold text-slate-900">Ask Doubt to Professor</h3>
              </div>
              <button
                onClick={() => setShowNewDoubtModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoubt} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-violet-600 font-semibold"
                >
                  <option value="DBMS">DBMS (Database Management Systems)</option>
                  <option value="OOP">OOP (Object Oriented Programming)</option>
                  <option value="ADSA">ADSA (Algorithm Design & Analysis)</option>
                  <option value="OS">OS (Operating Systems)</option>
                  <option value="RANAC">RANAC (Real Analysis)</option>
                  <option value="CNA">CNA (Computer Networks Architecture)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Topic / Summary Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clarification on 3NF Decomposition"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Question *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your doubt in detail. Mention slide number or lecture code if applicable..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewDoubtModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-md shadow-violet-600/20"
                >
                  Submit Doubt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
