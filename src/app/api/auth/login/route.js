import { NextResponse } from 'next/server';
import { USERS } from '@/lib/mockDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    const user = USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (role && user.role !== role) {
      return NextResponse.json(
        { error: `Account exists but role is ${user.role.toUpperCase()}, not ${role.toUpperCase()}` },
        { status: 403 }
      );
    }

    // Return sanitized user object
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
