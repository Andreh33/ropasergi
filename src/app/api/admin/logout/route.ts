import { destroySession } from '@/lib/server/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
