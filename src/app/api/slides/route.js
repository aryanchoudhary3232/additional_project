import { NextResponse } from 'next/server';
import { SLIDES, addSlide, deleteSlide } from '@/lib/mockDb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');

  let filteredSlides = [...SLIDES];
  if (subject && subject !== 'All') {
    filteredSlides = filteredSlides.filter(s => s.subject.toLowerCase() === subject.toLowerCase());
  }

  return NextResponse.json({ slides: filteredSlides });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subject, description, teacherName, fileType, fileSize, fileUrl } = body;

    if (!title || !subject) {
      return NextResponse.json({ error: 'Title and Subject are required fields' }, { status: 400 });
    }

    const newSlide = {
      id: `slide-${Date.now()}`,
      title,
      subject,
      uploadedBy: teacherName || 'Dr. Ananya Sharma',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: fileSize || '3.5 MB',
      fileType: fileType || 'pdf',
      description: description || 'No detailed description provided.',
      fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      downloads: 0
    };

    addSlide(newSlide);

    return NextResponse.json({ success: true, slide: newSlide }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload slide' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Slide ID is required' }, { status: 400 });
    }

    deleteSlide(id);

    return NextResponse.json({ success: true, message: 'Slide deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
