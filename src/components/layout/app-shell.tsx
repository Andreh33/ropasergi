'use client';
import { GlobalInteractions } from '@/components/layout/global-interactions';
import { LogoTripleClick } from '@/components/layout/logo-triple-click';
import { ScrollVelocityFX } from '@/components/layout/scroll-velocity-fx';
import { AudioContextProvider } from '@/components/providers/audio-context';
import { GsapContext } from '@/components/providers/gsap-context';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CartDrawer } from './cart-drawer';
import { Footer } from './footer';
import { GrainOverlay } from './grain-overlay';
import { InstallPrompt } from './install-prompt';
import { Nav } from './nav';
import { NavCmdK } from './nav-cmdk';
import { PageTransitionOverlay } from './page-transition';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const pathname = usePathname();

  // El panel /admin es una herramienta interna: sin smooth-scroll, nav, footer
  // ni decoración premium. Scroll nativo y formularios limpios.
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <GsapContext>
      <AudioContextProvider>
        <SmoothScroll>
          <a href="#main" className="skip-link">
            SALTAR AL CONTENIDO
          </a>
          <Nav onOpenCmdK={() => setCmdOpen(true)} />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <NavCmdK open={cmdOpen} onOpenChange={setCmdOpen} />
          <PageTransitionOverlay />
          <GrainOverlay />
          <GlobalInteractions />
          <ScrollVelocityFX />
          <LogoTripleClick />
          <InstallPrompt />
        </SmoothScroll>
      </AudioContextProvider>
    </GsapContext>
  );
}
