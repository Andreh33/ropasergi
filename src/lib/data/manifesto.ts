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
        'Ocho prendas. Una al mes hasta marzo. Después, otra cosa.',
        'Cada una con un número de serie sobre el cuello interior. Cada una con un papel doblado dentro del bolsillo trasero — el manuscrito de quien la pensó.',
        'No tendremos rebajas. No haremos remontes. No volveremos a producir lo que se agote.',
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
    word: 'DESEO',
    numerator: 'DOGMA · 01 / 03',
    main: 'Diseñamos lo que no necesitas, por eso lo querrás.',
    sub: [
      'Una prenda útil cumple su función y se olvida.',
      'Una prenda necesaria cumple la tuya y la recuerdas.',
    ],
  },
  {
    id: '02',
    word: 'DISCIPLINA',
    numerator: 'DOGMA · 02 / 03',
    main: 'Cada costura ha sido revisada por una mano que aún no perdona.',
    sub: [
      'Pagas la prenda dos veces. Una al comprarla.',
      'La otra cada vez que aguanta lo que no debería.',
    ],
  },
  {
    id: '03',
    word: 'DESPRECIO',
    numerator: 'DOGMA · 03 / 03',
    main: 'Por las tendencias. Por la tibieza. Por el algoritmo.',
    sub: [
      'No diseñamos para gustarle a quien todavía no nos conoce.',
      'Diseñamos para que tú no necesites enseñarlo.',
    ],
  },
];
