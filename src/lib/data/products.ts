import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    slug: 'culto-01-hoodie',
    name: 'CULTO 01 / HOODIE',
    edition: '001 / 080',
    numbered: { total: 80, available: 7 },
    price: { amount: 280, currency: 'EUR' },
    shortDescriptor: 'ALGODÓN COMPACTO · 480 GSM · PORTUGAL',
    editorial:
      'CULTO 01 no se compra. Se inicia.\n\nAlgodón compactado a 480 gramos hasta el límite donde el tejido empieza a pensar por sí mismo. La capucha tiene la profundidad exacta para que la cara desaparezca cuando hace falta. El interior está cepillado tres veces — la tercera no añade calor, añade decisión.\n\nCosido en Portugal por una fábrica que lleva treinta años haciendo lo mismo y treinta perdiendo el sueño por que salga mejor.\n\nPara gente que llega tarde a propósito.',
    technical: {
      material: '100% algodón compacto orgánico, GOTS',
      weight: '480 g/m²',
      origin: 'Vila Nova de Famalicão, Portugal',
      tailoring: 'Triple costura en hombros y bajos. Cordón de capucha en tubo metálico oxidado.',
    },
    care: [
      'Lavar a 30°. Volver del revés.',
      'No usar suavizante. El algodón se acuerda.',
      'Secar al aire. Si lo planchas, planchas mal.',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    soldoutSizes: ['XS'],
    colors: [
      { name: 'Gris', hex: '#9ca3af' },
      { name: 'Negro', hex: '#15151a' },
    ],
    category: 'Sudaderas',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1400&q=82',
        alt: 'CULTO 01 frente',
        type: 'front',
      },
      {
        src: 'https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=1400&q=82',
        alt: 'CULTO 01 espalda',
        type: 'back',
      },
      {
        src: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1400&q=82',
        alt: 'CULTO 01 detalle',
        type: 'detail',
      },
      {
        src: 'https://images.unsplash.com/photo-1556217477-d325251ece38?w=1400&q=82',
        alt: 'CULTO 01 lifestyle',
        type: 'lifestyle',
      },
    ],
    drop: '01',
    status: 'available',
    accent: 'acid',
  },
  {
    slug: 'dogma-tee',
    name: 'DOGMA / T-SHIRT',
    edition: '002 / 200',
    numbered: { total: 200, available: 138 },
    price: { amount: 95, currency: 'EUR' },
    shortDescriptor: 'ALGODÓN PIMA · 220 GSM · SERIGRAFÍA MANUAL',
    editorial:
      'Una camiseta no debería costar 95 €. Una buena, sí.\n\nPima peruano, 220 gramos, hilatura Z para que el cuello no se vencer hacia adelante en seis meses. La serigrafía es manual — tinta de agua, una sola pasada, y el dibujo desaparece a medias después del décimo lavado a propósito.\n\nLlevas la prenda. Después la llevas más. Después no la llevas igual.\n\nEso te lo cobramos solo una vez.',
    technical: {
      material: '100% algodón Pima peruano',
      weight: '220 g/m²',
      origin: 'Tejido en Perú, serigrafía y confección en Sevilla',
      tailoring: 'Costura tubular sin lateral, ribete reforzado en cuello.',
    },
    care: [
      'Lavar del revés. Agua fría.',
      'No centrifugado largo.',
      'El gráfico se desvanece con uso — está calculado así.',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Hueso', hex: '#f5f1e8' },
      { name: 'Negro', hex: '#15151a' },
    ],
    category: 'Camisetas',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1400&q=82',
        alt: 'DOGMA TEE frente',
        type: 'front',
      },
      {
        src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1400&q=82',
        alt: 'DOGMA TEE espalda',
        type: 'back',
      },
      {
        src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1400&q=82',
        alt: 'DOGMA TEE detalle',
        type: 'detail',
      },
    ],
    drop: '01',
    status: 'available',
  },
  {
    slug: 'asfalto-cargo',
    name: 'ASFALTO / CARGO',
    edition: '003 / 060',
    numbered: { total: 60, available: 23 },
    price: { amount: 340, currency: 'EUR' },
    shortDescriptor: 'GABARDINA DOBLE PASADA · TINTE PIEDRA · BREMEN',
    editorial:
      'Un cargo es un pantalón con memoria. La memoria, aquí, son ocho bolsillos contados — ni uno más para no convertirlo en disfraz.\n\nGabardina de algodón con doble pasada, tinte piedra teñido en pieza. Le pasa al pantalón lo que les pasa a los buenos abrigos: arruga, pero arruga bien. Después de un mes ya no es tu cargo. Es tuyo y nada más.\n\nHecho en Bremen, donde aprendieron a coser ropa de trabajo cuando todo el norte de Europa se equivocaba de pantalón.',
    technical: {
      material: '100% algodón gabardina, peso 380 g/m²',
      weight: '380 g/m²',
      origin: 'Tejido y confección en Bremen, Alemania',
      tailoring:
        'Ocho bolsillos funcionales. Cremallera YKK Excella níquel mate. Cinturón interior elástico.',
    },
    care: [
      'Lavar a 30°.',
      'Plancha a vapor del revés.',
      'El color pierde un 7% en el primer lavado. Es deliberado.',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Piedra', hex: '#8a857a' },
      { name: 'Oliva', hex: '#4b5320' },
    ],
    category: 'Pantalones',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1517438476312-10d79c5f25d8?w=1400&q=82',
        alt: 'ASFALTO frente',
        type: 'front',
      },
      {
        src: 'https://images.unsplash.com/photo-1473966968600-fa801b3a8612?w=1400&q=82',
        alt: 'ASFALTO detalle',
        type: 'detail',
      },
    ],
    drop: '01',
    status: 'available',
  },
  {
    slug: 'sigilo-jacket',
    name: 'SIGILO / JACKET',
    edition: '004 / 040',
    numbered: { total: 40, available: 4 },
    price: { amount: 720, currency: 'EUR' },
    shortDescriptor: 'NYLON RIPSTOP · COSTURA SELLADA · ITALIA',
    editorial:
      'La idea era hacer un cortavientos que no pareciera deporte.\n\nNylon ripstop de 60 deniers, exterior teñido en frío para que mantenga su negro real. Las costuras están selladas por dentro con una cinta termofundida que tarda tres minutos por costura — la chaqueta entera, dos horas. El cierre es una cremallera AquaGuard YKK, central, sin tirador visible.\n\nNo tiene capucha. No tiene cordones. No tiene logo.\n\nCuarenta unidades. La que falte es problema tuyo.',
    technical: {
      material: 'Nylon ripstop 60D / 320 T',
      origin: 'Como, Italia',
      tailoring:
        'Costura sellada con cinta termofundida. Cremallera AquaGuard. Forrado en mesh. Acabado DWR sin PFC.',
    },
    care: [
      'Lavar a mano o ciclo delicado 30°.',
      'No usar lejía nunca.',
      'Reaplicar DWR cada 18 meses (recomendamos Grangers).',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    soldoutSizes: ['S', 'XL'],
    colors: [{ name: 'Negro', hex: '#15151a' }],
    category: 'Chaquetas',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1400&q=82',
        alt: 'SIGILO frente',
        type: 'front',
      },
      {
        src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1400&q=82',
        alt: 'SIGILO espalda',
        type: 'back',
      },
      {
        src: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1400&q=82',
        alt: 'SIGILO detalle',
        type: 'detail',
      },
    ],
    drop: '01',
    status: 'available',
    accent: 'magenta',
  },
  {
    slug: 'oxido-bag',
    name: 'ÓXIDO / TOTE',
    edition: '005 / 120',
    numbered: { total: 120, available: 67 },
    price: { amount: 180, currency: 'EUR' },
    shortDescriptor: 'LONA ENCERADA · ASA REFORZADA · BARCELONA',
    editorial:
      'Un tote no es una bolsa. Es una declaración perezosa.\n\nÓXIDO está hecho de lona de algodón encerada en frío — el tipo de lona que se usaba para velas de barco antes de que el mundo descubriera el nylon. El asa va doblada cinco veces y rematada con remache de cobre que se oxidará con el sudor. Esa oxidación es lo que le da el nombre, y es lo que la convierte en tuya con el tiempo.\n\nSin logo. El número de serie está estampado a presión en el interior del bolsillo.',
    technical: {
      material: 'Lona de algodón 18 oz encerada en frío',
      origin: 'Confección manual en Barcelona',
      tailoring: 'Remaches de cobre crudo, asa de 70 cm reforzada. Capacidad 18 L.',
    },
    care: [
      'No lavar. Frotar con paño húmedo.',
      'El óxido del cobre es la pátina. Si lo limpias, lo estropeas.',
    ],
    sizes: ['UNICA'],
    colors: [{ name: 'Crudo', hex: '#c9b896' }],
    category: 'Accesorios',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1400&q=82',
        alt: 'ÓXIDO frente',
        type: 'front',
      },
      {
        src: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1400&q=82',
        alt: 'ÓXIDO detalle remache',
        type: 'detail',
      },
    ],
    drop: '01',
    status: 'available',
  },
  {
    slug: 'neon-balaclava',
    name: 'NEÓN / BALACLAVA',
    edition: '006 / 100',
    numbered: { total: 100, available: 0 },
    price: { amount: 110, currency: 'EUR' },
    shortDescriptor: 'MERINO 18.5µ · NEÓN INTERIOR · ESCOCIA',
    editorial:
      'Las balaclavas dejaron de servir cuando se convirtieron en accesorio. NEÓN sirve.\n\nLana merino de 18.5 micras (la fina, la que pica cero) tejida en Galashiels, Escocia. El interior está hilado con un hilo neón verde ácido que solo se ve cuando la giras del revés.\n\nHay dos formas de llevarla: bien o muy bien. Las dos quedan.',
    technical: {
      material: '100% merino extrafino 18.5µ',
      origin: 'Tejido Galashiels, Escocia. Cosido en Sevilla.',
      tailoring: 'Hilo neón en el interior. Visible al girar la prenda.',
    },
    care: ['Lavar a mano con champú neutro.', 'Secar plana sobre toalla.', 'Nunca centrifugado.'],
    sizes: ['UNICA'],
    colors: [
      { name: 'Negro', hex: '#15151a' },
      { name: 'Ácido', hex: '#ccff00' },
    ],
    category: 'Accesorios',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1400&q=82',
        alt: 'NEÓN frente',
        type: 'front',
      },
      {
        src: 'https://images.unsplash.com/photo-1599751449128-eb7249c3d6b1?w=1400&q=82',
        alt: 'NEÓN interior',
        type: 'detail',
      },
    ],
    drop: '01',
    status: 'soldout',
    accent: 'acid',
  },
  {
    slug: 'monolito-boot',
    name: 'MONOLITO / BOOT',
    edition: '007 / 050',
    numbered: { total: 50, available: 18 },
    price: { amount: 590, currency: 'EUR' },
    shortDescriptor: 'PIEL FLOR · SUELA VIBRAM · NORTE DE ITALIA',
    editorial:
      'Una bota tarda años en ponerse bien. MONOLITO empieza tarde a propósito.\n\nPiel de flor curtida vegetal en Toscana, suela Vibram Cristy en color asfalto, talón reforzado con un alma de poliuretano que no aplasta a la quinta caminata. El cosido es Goodyear — sí, se puede recambiar la suela cuando la gastes.\n\nLos primeros quince días te van a doler. Después, dejarán de doler nunca más.',
    technical: {
      material: 'Piel flor 2.0 mm, curtición vegetal',
      origin: 'Marche, Italia',
      tailoring: 'Suela Vibram Cristy asfalto. Cosido Goodyear welt.',
    },
    care: [
      'Cepillar tras cada uso.',
      'Hidratar cada 2 meses con grasa de pie de buey o crema neutra.',
      'Secar lejos de fuente de calor directa.',
    ],
    sizes: ['39', '40', '41', '42', '43', '44', '45', '46'],
    colors: [
      { name: 'Cuero', hex: '#6b4226' },
      { name: 'Asfalto', hex: '#2a2a2e' },
    ],
    category: 'Calzado',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?w=1400&q=82',
        alt: 'MONOLITO lateral',
        type: 'front',
      },
      {
        src: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=1400&q=82',
        alt: 'MONOLITO suela',
        type: 'detail',
      },
    ],
    drop: '01',
    status: 'available',
  },
  {
    slug: 'kerosene-pant',
    name: 'KEROSENO / PANT',
    edition: '008 / 080',
    numbered: { total: 80, available: 31 },
    price: { amount: 260, currency: 'EUR' },
    shortDescriptor: 'LANA FRESCA · FORMAL DESTRUIDO · PORTUGAL',
    editorial:
      'Un pantalón formal solo es bueno cuando te lo puedes poner mal.\n\nKEROSENO es lana fresca de 270 g — la pinza es alta, el bajo está cortado a 1 cm sobre el suelo, sin dobladillo cosido. La caída es de pantalón de tres mil euros, el comportamiento no.\n\nTe lo puedes poner con bota o con zapatilla. Sentado o tirado. A las dos de la tarde o a las cuatro de la mañana. Da igual: él no se rompe primero.',
    technical: {
      material: '100% lana fresca Super 110s',
      weight: '270 g/m²',
      origin: 'Trofa, Portugal',
      tailoring: 'Pinza profunda, bolsillo lateral italiano, bajo sin dobladillo.',
    },
    care: [
      'Limpieza en seco.',
      'Colgar con percha de hombros anchos.',
      'Si arruga, vaporiza. Nunca planchar directo.',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Antracita', hex: '#2a2a2e' }],
    category: 'Pantalones',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1473966968600-fa801b3a8612?w=1400&q=82',
        alt: 'KEROSENO frente',
        type: 'front',
      },
      {
        src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1400&q=82',
        alt: 'KEROSENO bajo',
        type: 'detail',
      },
    ],
    drop: '01',
    status: 'available',
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);
