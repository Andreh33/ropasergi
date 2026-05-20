'use client';
import { Download, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'proyecto-1:install-dismissed';

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // registrar el service worker (necesario para instalar)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };
    const onInstalled = () => {
      setInstalled(true);
      setOpen(false);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setOpen(false);
  }

  function dismiss() {
    setOpen(false);
    localStorage.setItem(DISMISS_KEY, '1');
  }

  if (installed) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.18, 0, 0, 1] }}
          className="fixed left-4 right-4 bottom-4 md:left-auto md:right-6 md:bottom-6 md:w-[360px]"
          style={{
            zIndex: 'var(--z-toast)' as unknown as number,
            paddingBottom: 'var(--safe-bottom)',
          }}
        >
          <div className="relative border border-[var(--violet)] bg-[var(--bg-tarmac)]/95 backdrop-blur-md p-5">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Cerrar"
              className="absolute top-3 right-3 w-8 h-8 grid place-items-center text-[var(--ink-mute)] hover:text-[var(--ink)]"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <span className="grid place-items-center w-10 h-10 shrink-0 bg-[var(--violet)] text-[var(--ink)]">
                <Download size={18} />
              </span>
              <div>
                <p className="font-display text-h3 tracking-[-0.02em] leading-[1] text-[var(--ink)]">
                  INSTALA LA APP
                </p>
                <p className="mt-1 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)]">
                  PROYECTO 1 EN TU PANTALLA · ACCESO DIRECTO
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={install}
              className="mt-4 w-full py-3 bg-[var(--violet)] hover:bg-[var(--violet-deep)] transition-colors text-[var(--ink)] font-mono text-micro uppercase tracking-[0.18em]"
            >
              DESCARGAR APP
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
