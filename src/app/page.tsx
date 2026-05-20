import { CultSection } from '@/components/sections/cult-section';
import { DogmaPillars } from '@/components/sections/dogma-pillars';
import { FeaturedDrop } from '@/components/sections/featured-drop';
import { HeroManifesto } from '@/components/sections/hero-manifesto';
import { TiltedMarquee } from '@/components/sections/tilted-marquee';
import { getCatalog } from '@/lib/server/catalog';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getCatalog();
  return (
    <>
      <HeroManifesto />
      <DogmaPillars />
      <TiltedMarquee />
      <FeaturedDrop products={products} />
      <CultSection />
    </>
  );
}
