import { NextResponse } from 'next/server';
import { DOUBTS, createDoubt, addDoubtMessage } from '@/lib/mockDb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const status = searchParams.get('status');

  let list = [...DOUBTS];
  if (studentId) {
    list = list.filter(d => d.studentId === studentId);
  }
  if (status && status !== 'All') {
    list = list.filter(d => d.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json({ doubts: list });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, studentName, studentRoll, studentAvatar, subject, title, initialMessage } = body;

    if (!title || !initialMessage) {
      return NextResponse.json({ error: 'Title and Question text are required' }, { status: 400 });
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newDoubt = {
      id: `doubt-${Date.now()}`,
      studentId: studentId || 'u2',
      studentName: studentName || 'Rahul Verma',
      studentRoll: studentRoll || 'UG2026-CSE-042',
      studentAvatar: studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      subject: subject || 'General',
      title,
      status: 'Pending',
      createdAt: now.toISOString(),
      messages: [
        {
          senderId: studentId || 'u2',
          senderName: studentName || 'Rahul Verma',
          role: 'student',
          text: initialMessage,
          timestamp: timeStr
        }
      ]
    };

    createDoubt(newDoubt);

    return NextResponse.json({ success: true, doubt: newDoubt }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create doubt thread' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { doubtId, senderId, senderName, role, text, newStatus } = body;

    if (!doubtId || !text) {
      return NextResponse.json({ error: 'Doubt ID and Message text are required' }, { status: 400 });
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const messageObj = {
      senderId,
      senderName,
      role: role || 'teacher',
      text,
      timestamp: timeStr
    };

    const updatedDoubt = addDoubtMessage(doubtId, messageObj, newStatus);

    if (!updatedDoubt) {
      return NextResponse.json({ error: 'Doubt thread not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, doubt: updatedDoubt });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
