import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Check password against environment variable
    const correctPassword = process.env.AUTH_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      // Password is correct
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
      });
    } else {
      // Password is incorrect
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('[Auth] Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
