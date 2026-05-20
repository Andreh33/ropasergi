import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LEYENDA',
  description: 'Términos, política, devoluciones. La parte que también es marca.',
};

const SECTIONS = [
  {
    id: 'empresa',
    title: 'QUIÉN COSE ESTO',
    body: [
      'PROYECTO UNO SL · CIF: B-NN.NNN.NNN · Calle NN, Sevilla, 41001.',
      'Inscrita en el Registro Mercantil de Sevilla, Tomo NN, Folio NN.',
      'Contacto: culto@proyecto-uno.com',
    ],
  },
  {
    id: 'datos',
    title: 'QUÉ HACEMOS CON TUS DATOS',
    body: [
      'Recogemos tu email solo si tú nos lo das. Lo usamos exclusivamente para enviarte avisos de drop y los manuscritos de cada prenda.',
      'No vendemos datos. No cedemos a terceros salvo para procesar pagos (Stripe) o envíos (SEUR/MRW).',
      'Puedes ejercer tus derechos RGPD escribiendo a culto@proyecto-uno.com.',
    ],
  },
  {
    id: 'devoluciones',
    title: 'QUÉ PASA SI QUIERES DEVOLVER',
    body: [
      'Tienes 14 días naturales desde la recepción para devolver. La prenda debe llegar en estado original, sin uso, con etiqueta y manuscrito.',
      'Devolución gratuita en península. Canarias, Baleares, Ceuta y Melilla, a cargo del comprador.',
      'Reembolso en el mismo medio de pago en un plazo máximo de 14 días.',
    ],
  },
  {
    id: 'envios',
    title: 'QUÉ PASA SI EL PAQUETE NO LLEGA',
    body: [
      'Envío en 48-72 horas hábiles a península. 5-7 días al resto de Europa.',
      'Si pasados 5 días desde la confirmación de envío no has recibido nada, escribe a culto@proyecto-uno.com con el número de orden.',
      'Cubrimos pérdidas y daños durante el transporte.',
    ],
  },
  {
    id: 'cookies',
    title: 'QUÉ COOKIES MORDEMOS',
    body: [
      'Cookies estrictamente necesarias para el funcionamiento del carro y la sesión.',
      'Sin tracking publicitario. Sin Facebook Pixel. Sin Google Analytics.',
      'Si añadimos analítica en el futuro, será Plausible (sin cookies).',
    ],
  },
  {
    id: 'tallas',
    title: 'GUÍA DE TALLAS',
    body: [
      'Las tallas se basan en medidas reales tomadas en plancha. Si dudas entre dos, escoge la pequeña — los algodones aquí no encogen mal.',
      'Pecho: XS 92cm · S 96cm · M 100cm · L 104cm · XL 108cm · XXL 112cm.',
      'Para botas, escala europea standard. Calza dos tercios de número.',
    ],
  },
  {
    id: 'trabajo',
    title: 'TRABAJA CON NOSOTROS',
    body: [
      'No abrimos posiciones. Cuando lo hagamos, será aquí.',
      'Para propuestas creativas o colaboraciones de drop: escribe a culto@proyecto-uno.com con asunto "COLABORACIÓN".',
    ],
  },
];

export default function LeyendaPage() {
  return (
    <div
      className="bg-[var(--bg-asphalt)] text-[var(--ink)] pt-[20vh] pb-[18vh] min-h-screen"
      style={{ paddingLeft: 'var(--grid-margin)', paddingRight: 'var(--grid-margin)' }}
    >
      <header className="pb-[10vh] border-b border-[var(--stroke)]">
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] mb-4">
          MMXXVI · PROYECTO UNO SL
        </p>
        <h1 className="font-display text-display tracking-[-0.04em] leading-[0.88] uppercase">
          LEYENDA
        </h1>
        <p className="font-serif italic text-h3 mt-6 max-w-3xl">
          La parte legal. Escrita corta para que sí la leas.
        </p>
      </header>

      <div className="max-w-3xl mx-auto pt-[10vh] space-y-[8vh]">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="space-y-4">
            <h2 className="font-display text-h2 tracking-[-0.03em] uppercase">{s.title}</h2>
            {s.body.map((para, i) => (
              <p key={i} className="font-serif italic text-h3 leading-[1.3] text-[var(--ink)]">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
