import { checkPassword, createSession } from '@/lib/server/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ password: z.string().min(1) });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Falta la contraseña.' }, { status: 400 });
  }
  if (!checkPassword(parsed.data.password)) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}
