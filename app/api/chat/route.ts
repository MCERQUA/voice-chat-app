import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Use session ID or generate one based on timestamp
    const session = sessionId || `chat-${Date.now()}`;

    // Execute claude code with continuation flag
    // The -c flag maintains conversation context across messages
    // Claude Code expects input from stdin, so we use echo
    // Run permissionless so it can execute commands without asking
    const escapedMessage = message.replace(/'/g, "'\"'\"'");  // Escape single quotes for bash
    const command = `echo '${escapedMessage}' | claude code -c "${session}" --print --dangerously-skip-permissions`;

    console.log(`[API] Session: ${session}, Message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);

    const { stdout, stderr } = await execAsync(command, {
      cwd: '/home/josh/Josh-AI',
      timeout: 120000, // 2 minute timeout for long responses
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer for large responses
    });

    if (stderr) {
      console.error(`[API] stderr: ${stderr}`);
    }

    return NextResponse.json({
      response: stdout.trim(),
      sessionId: session,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[API] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process message',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Claude Code chat API is running',
    timestamp: new Date().toISOString(),
  });
}
