'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Download, Search, FileText, Trash2, Plus, Eye, CheckCircle2, X, Filter, BookOpen, Clock, FileDown } from 'lucide-react';

export default function SlideManager({ user }) {
  const isTeacher = user?.role === 'teacher';
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewSlide, setPreviewSlide] = useState(null);
  const [notification, setNotification] = useState(null);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('DBMS');
  const [newDescription, setNewDescription] = useState('');
  const [newFileType, setNewFileType] = useState('pdf');

  const subjects = ['All', 'DBMS', 'OOP', 'ADSA', 'OS', 'RANAC', 'CNA'];

  useEffect(() => {
    fetchSlides();
  }, [selectedSubject]);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/slides?subject=${selectedSubject}`);
      const data = await res.json();
      if (data.slides) {
        setSlides(data.slides);
      }
    } catch (err) {
      console.error('Failed to fetch slides', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          subject: newSubject,
          description: newDescription,
          teacherName: user?.name,
          fileType: newFileType,
          fileSize: `${(Math.random() * 4 + 1.5).toFixed(1)} MB`
        })
      });
      const data = await res.json();
      if (data.success) {
        setSlides([data.slide, ...slides]);
        setShowUploadModal(false);
        setNewTitle('');
        setNewDescription('');
        showToast('Slide uploaded successfully! Students can now download it.');
      }
    } catch (err) {
      console.error('Upload error', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      const res = await fetch(`/api/slides?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSlides(slides.filter(s => s.id !== id));
        showToast('Slide removed.');
      }
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleDownload = (slide) => {
    window.open(slide.fileUrl, '_blank');
    setSlides(slides.map(s => s.id === slide.id ? { ...s, downloads: s.downloads + 1 } : s));
    showToast(`Downloading: ${slide.title}`);
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredSlides = slides.filter(slide => {
    const matchesSearch = slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          slide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner (Light Theme) */}
      <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-indigo-200 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
                <BookOpen className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Slides & Study Material</h2>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {isTeacher
                ? 'Upload and manage course slides, lecture notes, and practice sheets for UG2 students.'
                : 'Browse, preview, and download course slides uploaded by your IIIT Sri City professors.'}
            </p>
          </div>

          {isTeacher && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Upload New Slide</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search slides by title or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition-all"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Subject:
          </span>
          {subjects.map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubject === subj
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-200/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredSlides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No slides found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or subject filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlides.map(slide => (
            <div
              key={slide.id}
              className="bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-xs hover:shadow-md"
            >
              <div>
                {/* Card Header: Subject Tag & Actions */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                    {slide.subject}
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {slide.uploadDate}
                    </span>
                    {isTeacher && (
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {slide.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed font-normal">
                  {slide.description}
                </p>
              </div>

              {/* Meta & Download Bar */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="block font-bold text-slate-800">{slide.uploadedBy}</span>
                  <span className="text-[11px] text-slate-400">{slide.fileSize} • {slide.downloads} downloads</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewSlide(slide)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Preview Slide"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDownload(slide)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal (Teacher Only) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Upload New Lecture Slide</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Slide Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DBMS Lecture 05 - Normalization"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Course Subject *
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    {subjects.filter(s => s !== 'All').map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    File Format
                  </label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-600 font-medium"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                    <option value="docx">Word Document (.docx)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Topic Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what key concepts this slide covers..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50">
                <FileText className="w-8 h-8 text-indigo-600 mx-auto mb-1" />
                <p className="text-xs text-slate-700 font-bold">Ready to publish to IIIT Sri City UG2 portal</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Students can immediately view and download once uploaded.</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20"
                >
                  Publish Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  {previewSlide.subject}
                </span>
                <h3 className="text-base font-bold text-slate-900 truncate max-w-md">{previewSlide.title}</h3>
              </div>
              <button
                onClick={() => setPreviewSlide(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Uploaded by: <strong className="text-slate-800">{previewSlide.uploadedBy}</strong></span>
                <span>Date: <strong className="text-slate-800">{previewSlide.uploadDate}</strong></span>
              </div>
              <p className="text-sm leading-relaxed text-slate-800">
                {previewSlide.description}
              </p>
              
              <div className="p-8 rounded-xl bg-white border border-slate-200 text-center space-y-2">
                <FileText className="w-12 h-12 text-indigo-600 mx-auto" />
                <p className="text-sm font-bold text-slate-800">{previewSlide.title}</p>
                <p className="text-xs text-slate-500">Sample preview file generated for IIIT Sri City UG2 Portal ({previewSlide.fileSize})</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setPreviewSlide(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(previewSlide);
                  setPreviewSlide(null);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
