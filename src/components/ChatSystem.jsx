'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, CheckCircle, Clock, Plus, User, AlertCircle, Filter, Sparkles, BookOpen, Check, HelpCircle, X, Paperclip, FileText } from 'lucide-react';

export default function ChatSystem({ user }) {
  const isTeacher = user?.role === 'teacher';
  const [doubts, setDoubts] = useState([]);
  const [activeDoubtId, setActiveDoubtId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [replyText, setReplyText] = useState('');
  const [showNewDoubtModal, setShowNewDoubtModal] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');

  // New Doubt Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('DBMS');
  const [newQuestion, setNewQuestion] = useState('');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleAttachmentUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingAttachment(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (data.success) {
          setAttachmentUrl(data.url);
          setReplyText(prev => `${prev} [Attachment: ${file.name}](${data.url})`);
        }
      } catch (err) {
        console.error('Attachment upload failed:', err);
      } finally {
        setUploadingAttachment(false);
      }
    }
  };

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
        setAttachmentUrl('');
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

  const renderMessageContent = (text, isMsgTeacher) => {
    if (!text) return null;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline font-bold transition-colors inline-flex items-center gap-1 ${
            isMsgTeacher ? 'text-amber-200 hover:text-white' : 'text-emerald-700 hover:text-emerald-900'
          }`}
        >
          <Paperclip className="w-3.5 h-3.5 inline" />
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
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
    <div className="space-y-5 bg-white">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-emerald-600 text-white shadow-2xs">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Student Doubt Resolution Portal</h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {isTeacher
              ? 'Answer student questions, clarify concepts, or schedule doubt sessions during free slots.'
              : 'Ask questions to your IIIT Sri City professors and get personalized doubt solutions.'}
          </p>
        </div>

        {!isTeacher && (
          <button
            onClick={() => setShowNewDoubtModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Ask New Doubt</span>
          </button>
        )}
      </div>

      {/* Main Chat Grid (Sidebar + Chat Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[560px]">
        
        {/* Left Sidebar: Threads List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div className="space-y-3">
            
            {/* Filter Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {isTeacher ? 'Student Doubts Inbox' : 'My Question Threads'}
              </span>
              <div className="flex items-center space-x-1">
                {['All', 'Pending', 'Resolved'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      filterStatus === st
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Threads List */}
            {loading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredDoubts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No doubt questions found.
              </div>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredDoubts.map(doubt => {
                  const isActive = doubt.id === activeDoubtId;

                  return (
                    <button
                      key={doubt.id}
                      onClick={() => setActiveDoubtId(doubt.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col justify-between ${
                        isActive
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200 uppercase">
                          {doubt.subject}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-bold flex items-center gap-1 ${
                            doubt.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : doubt.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {doubt.status === 'Resolved' ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />}
                          {doubt.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs mt-1.5 text-slate-900 line-clamp-1">{doubt.title}</h4>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                          {isTeacher ? doubt.studentName : (doubt.messages?.find(m => m.role === 'teacher')?.senderName || 'Course Instructor')}
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
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-2xs overflow-hidden">
          
          {activeDoubt ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                      {activeDoubt.subject}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm truncate max-w-md">{activeDoubt.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Student: <strong className="text-slate-800">{activeDoubt.studentName}</strong> ({activeDoubt.studentRoll})
                  </p>
                </div>

                {/* Status Toggle buttons */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
                      activeDoubt.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    Status: {activeDoubt.status}
                  </span>

                  {isTeacher && activeDoubt.status !== 'Resolved' && (
                    <button
                      onClick={() => handleStatusChange('Resolved')}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[400px] bg-slate-50/30">
                {activeDoubt.messages.map((msg, index) => {
                  const isMsgTeacher = msg.role === 'teacher';

                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isMsgTeacher ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className="text-xs font-bold text-slate-800">{msg.senderName}</span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                            isMsgTeacher
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {msg.role}
                        </span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-xl p-3 rounded-xl text-xs leading-relaxed ${
                          isMsgTeacher
                            ? 'bg-emerald-700 text-white font-medium rounded-tr-none shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                        }`}
                      >
                        {renderMessageContent(msg.text, isMsgTeacher)}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips (Teacher Only) */}
              {isTeacher && (
                <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 whitespace-nowrap">
                    <Sparkles className="w-3 h-3 text-amber-600" /> Quick Reply:
                  </span>
                  {teacherPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendReply(preset, 'In Progress')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-[11px] font-medium border border-slate-200 whitespace-nowrap transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              )}

              {/* Message Input Bar with S3 Attachment Input */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
                
                {/* File Attachment Input Trigger */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAttachmentUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach File to S3"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={
                    uploadingAttachment 
                      ? "Uploading attachment to S3..." 
                      : (isTeacher ? "Type your explanation or doubt resolution..." : "Ask follow-up question...")
                  }
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />

                <button
                  onClick={() => handleSendReply()}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <HelpCircle className="w-10 h-10 mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Select a doubt thread to read conversation</p>
            </div>
          )}

        </div>

      </div>

      {/* New Doubt Modal (Student) */}
      {showNewDoubtModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Ask Doubt to Professor</h3>
              </div>
              <button
                onClick={() => setShowNewDoubtModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDoubt} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewDoubtModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
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
