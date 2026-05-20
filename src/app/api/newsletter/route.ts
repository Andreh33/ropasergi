import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

// memoria simple para evitar duplicados (mock dev — se resetea cada reinicio)
const seen = new Set<string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'EL FORMATO NO ES UN EMAIL.' }, { status: 400 });
    }
    if (seen.has(parsed.data.email.toLowerCase())) {
      return NextResponse.json({ error: 'ESE EMAIL YA HIZO EL PACTO.' }, { status: 409 });
    }
    seen.add(parsed.data.email.toLowerCase());
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'EL CULTO NO RESPONDE. INTÉNTALO EN UN MINUTO.' },
      { status: 500 },
    );
  }
}
