export const MANIFESTO = {
  tagline: 'Primer dogma. Última calle.',
  city: 'Sevilla',
  year: 'MMXXVI',
  edition: 'ED. 001',
  blocks: {
    A: {
      title: 'APERTURA',
      paragraphs: [
        'PROYECTO 1 no es una marca.',
        'Es un acuerdo.',
        'El que firmas cuando entiendes que la ropa lleva años cobrándote sin decirte nada.',
      ],
    },
    B: {
      title: 'DIAGNÓSTICO',
      paragraphs: [
        'Vivimos el momento en que la calle se vendió a sí misma.',
        'Las marcas que nacieron del asfalto se mudaron a las galerías. Las que nacieron en las galerías se disfrazan de asfalto. Y entre los dos teatros, los precios suben y el contenido baja.',
        'PROYECTO 1 no es una protesta contra eso. Es lo siguiente.',
      ],
    },
    C: {
      title: 'TRES REGLAS',
      paragraphs: ['Tres reglas. Una sola dirección.'],
    },
    D: {
      title: 'QUÉ PROMETEMOS',
      paragraphs: [
        'Las mejores marcas. Elegidas una a una. Al precio que deberían costar.',
        'No inventamos prendas: las buscamos, las conseguimos y te las traemos sin el peaje de siempre.',
        'No haremos rebajas falsas. No inflamos para descontar. El precio es el precio.',
      ],
    },
    E: {
      title: 'QUÉ NO SOMOS',
      paragraphs: [
        'No somos una colección.',
        'No somos temporada.',
        'No somos exclusivos — somos primeros.',
        'No queremos llenarte el armario. Queremos vaciártelo.',
      ],
    },
    F: {
      title: 'CIERRE',
      paragraphs: [
        'Esto es PROYECTO 1.',
        'Si lo entiendes, ya formas parte.',
        'Si no lo entiendes, también está bien — solo que aquí no.',
      ],
      seal: 'Sevilla — MMXXVI — ED. 001',
    },
  },
} as const;

export type DogmaId = '01' | '02' | '03';

export type Dogma = {
  id: DogmaId;
  word: string;
  numerator: string;
  main: string;
  sub: [string, string];
};

export const DOGMAS: Dogma[] = [
  {
    id: '01',
    word: 'SELECCIÓN',
    numerator: 'DOGMA · 01 / 03',
    main: 'No fabricamos nada. Elegimos lo que merece la pena.',
    sub: ['Las mejores marcas ya existen.', 'Nuestro oficio es saber cuáles y traerlas hasta ti.'],
  },
  {
    id: '02',
    word: 'PRECIO',
    numerator: 'DOGMA · 02 / 03',
    main: 'Cada marca pasa por un precio que no perdona.',
    sub: ['Pagas la prenda. Nada más.', 'No pagas el margen que otros le inventan.'],
  },
  {
    id: '03',
    word: 'DESPRECIO',
    numerator: 'DOGMA · 03 / 03',
    main: 'Por los márgenes. Por las rebajas falsas. Por el algoritmo.',
    sub: [
      'No subimos el precio para fingir un descuento.',
      'Lo que ves es lo que vale. El primero y el último.',
    ],
  },
];
