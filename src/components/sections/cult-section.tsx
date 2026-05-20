'use client';
import { useAudio } from '@/components/providers/audio-context';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { RitualSeal } from '@/components/ui/ritual-seal';
import { useGSAP } from '@gsap/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('EL FORMATO NO ES UN EMAIL.'),
});

type FormValues = z.infer<typeof schema>;

export function CultSection() {
  const root = useRef<HTMLElement | null>(null);
  const cite = useRef<HTMLParagraphElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const audio = useAudio();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onSubmit' });

  useGSAP(
    () => {
      if (!cite.current) return;
      const split = new SplitText(cite.current, { type: 'words' });
      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.05,
        duration: 1.0,
        ease: 'p1-out',
        scrollTrigger: { trigger: cite.current, start: 'top 80%' },
      });
    },
    { scope: root as React.RefObject<HTMLElement> },
  );

  async function onSubmit(values: FormValues) {
    setStatus('loading');
    setErrorMsg(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error ?? 'EL CULTO NO RESPONDE. INTÉNTALO EN UN MINUTO.');
        audio.play('error');
        return;
      }
      audio.play('unlock');
      // flash
      const flash = document.createElement('div');
      flash.style.cssText =
        'position:fixed;inset:0;background:var(--neon-azure);opacity:0.6;z-index:9999;pointer-events:none;mix-blend-mode:difference;';
      document.body.appendChild(flash);
      window.setTimeout(() => flash.remove(), 120);
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('EL CULTO NO RESPONDE. INTÉNTALO EN UN MINUTO.');
      audio.play('error');
    }
  }

  function onInvalid() {
    const root = document.querySelector('[data-cult-input]');
    if (!root) return;
    gsap.fromTo(root, { x: 0 }, { x: 0, keyframes: { x: [0, -8, 8, -4, 4, 0] }, duration: 0.45 });
    audio.play('error');
    if (errors.email?.message) {
      setError('email', { message: errors.email.message });
    }
  }

  return (
    <section
      id="culto"
      ref={root}
      className="relative w-full overflow-hidden bg-[var(--bg-void)] text-[var(--ink)] py-[12vh] border-t border-[var(--stroke)]"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      {/* grain coarse */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(at 20% 20%, rgba(204,255,0,0.03) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(255,31,106,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-[64rem] mx-auto text-center space-y-12">
        <p
          ref={cite}
          className="font-serif italic text-display leading-[1.02] tracking-[-0.02em] text-[var(--ink)]"
        >
          {'“Los uniformes no se eligen. Se aceptan.”'}
        </p>

        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
          ACCESO PRIVADO · 24H ANTES DEL PRÓXIMO DROP
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6"
            >
              <RitualSeal size={180} delay={0.15} />
              <p className="font-display text-h3 tracking-[-0.02em] text-[var(--neon-blood-glow)]">
                ACEPTADO. ESPERA INSTRUCCIONES.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto items-stretch"
              noValidate
            >
              <div data-cult-input className="flex-1 relative">
                <input
                  type="email"
                  placeholder="EMAIL_PARA_ACCESO_PRIVADO@"
                  aria-label="Email"
                  data-cursor="input"
                  className="w-full px-2 py-4 bg-transparent border-b border-[var(--stroke-strong)] font-mono text-small uppercase tracking-[0.18em] text-[var(--ink)] placeholder:text-[var(--ink-mute)] focus:border-[var(--neon-azure)]"
                  {...register('email')}
                />
                {errors.email ? (
                  <p
                    className="absolute -bottom-6 left-0 font-mono text-micro uppercase tracking-[0.18em] text-[var(--blood)]"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <MagneticButton type="submit" variant="primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'INSCRIBIENDO...' : 'JURAR LEALTAD'}
              </MagneticButton>
            </motion.form>
          )}
        </AnimatePresence>

        {errorMsg && status === 'error' ? (
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--blood)]">
            {errorMsg}
          </p>
        ) : null}

        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-faint)] max-w-2xl mx-auto">
          Cero spam. Cero rebajas. Cero anuncios. Email solo para drops y manuscritos.
        </p>
      </div>
    </section>
  );
}
