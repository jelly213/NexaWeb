/**
 * All site copy, FR first-class (Quebec French), EN pair for every string.
 * Drafted by the copy agent 2026-07-20, humanizer-checked.
 */

export type Lang = 'fr' | 'en';
export type L = { fr: string; en: string };

export const copy = {
  hint: { fr: 'Faites défiler', en: 'Scroll' },
  nav: {
    links: [
      { fr: 'Résidences', en: 'Residences' },
      { fr: 'La vie', en: 'Amenities' },
      { fr: 'Le quartier', en: 'Neighbourhood' },
      { fr: 'Galerie', en: 'Gallery' },
      { fr: 'Contact', en: 'Contact' },
    ],
    cta: { fr: 'Planifier une visite', en: 'Book a visit' },
  },
  acts: [
    {
      overline: { fr: 'La ville, autrement', en: 'The city, from another angle' },
      headline: { fr: 'Verso prend forme', en: 'Verso takes shape' },
      sub: { fr: 'Douze étages s’élèvent au-dessus de Griffintown.', en: 'Twelve storeys rise above Griffintown.' },
    },
    {
      overline: { fr: 'L’architecture', en: 'The architecture' },
      headline: { fr: 'Verre, bronze, noyer, pierre', en: 'Glass, bronze, walnut, stone' },
      sub: { fr: 'Des matières choisies pour durer, du hall jusqu’au ciel.', en: 'Materials chosen to last, from the lobby to the sky.' },
    },
    {
      overline: { fr: 'Les résidences', en: 'The residences' },
      headline: { fr: 'Un étage s’ouvre sur chez vous', en: 'One floor opens onto home' },
      sub: { fr: 'Plafonds de neuf pieds, lumière sur trois orientations.', en: 'Nine-foot ceilings, light on three exposures.' },
    },
    {
      overline: { fr: 'Le soir venu', en: 'When evening comes' },
      headline: { fr: 'La soirée commence sur le toit', en: 'The evening begins on the roof' },
      sub: { fr: 'La façade se réchauffe, la terrasse s’éveille, la ville s’allume.', en: 'The façade warms, the terrace stirs, the city lights up.' },
    },
    {
      overline: { fr: 'Occupation printemps 2027', en: 'Occupancy spring 2027' },
      headline: { fr: 'Votre vue vous attend', en: 'Your view is waiting' },
      sub: { fr: '', en: '' },
    },
  ],
  residences: {
    overline: { fr: 'Les résidences', en: 'The residences' },
    intro: {
      fr: 'Quarante-huit résidences, du studio au penthouse, chacune dessinée autour de la lumière.',
      en: 'Forty-eight residences, from studio to penthouse, each drawn around the light.',
    },
    units: [
      {
        name: { fr: 'Studio', en: 'Studio' },
        desc: { fr: 'Un plan ouvert pensé au pouce près, avec le canal en toile de fond.', en: 'An open plan considered to the inch, with the canal as backdrop.' },
        price: { fr: 'À partir de 359 000 $', en: 'From $359,000' },
        size: { fr: '450 pi²', en: '450 sq ft' },
      },
      {
        name: { fr: 'Deux chambres', en: 'Two bedroom' },
        desc: { fr: 'Deux chambres en coin, cuisine en noyer et vues traversantes.', en: 'Two corner bedrooms, a walnut kitchen and views on both sides.' },
        price: { fr: 'À partir de 689 000 $', en: 'From $689,000' },
        size: { fr: '890 pi²', en: '890 sq ft' },
      },
      {
        name: { fr: 'Penthouse', en: 'Penthouse' },
        desc: { fr: 'Le dernier étage pour vous seul : terrasse privée et plafonds de dix pieds.', en: 'The top floor to yourself: private terrace and ten-foot ceilings.' },
        price: { fr: 'À partir de 1 450 000 $', en: 'From $1,450,000' },
        size: { fr: '1 450 pi²', en: '1,450 sq ft' },
      },
    ],
  },
  amenities: {
    overline: { fr: 'La vie', en: 'Amenities' },
    title: { fr: 'La vie à Verso', en: 'Life at Verso' },
    items: [
      { title: { fr: 'Terrasse sur le toit', en: 'Rooftop terrace' }, line: { fr: 'Vue sur le canal, foyers et cuisine extérieure au 12e.', en: 'Canal views, fire tables and an outdoor kitchen on the 12th.' } },
      { title: { fr: 'Salle d’entraînement', en: 'Fitness studio' }, line: { fr: 'Force et cardio, baignés de lumière naturelle.', en: 'Strength and cardio, in full natural light.' } },
      { title: { fr: 'Salon coworking', en: 'Co-working lounge' }, line: { fr: 'Des cabines fermées et le meilleur café de l’immeuble.', en: 'Private booths and the best coffee in the building.' } },
      { title: { fr: 'Cuisine du chef', en: 'Chef’s kitchen' }, line: { fr: 'Recevez à vingt sans pousser les meubles.', en: 'Host twenty without moving the furniture.' } },
      { title: { fr: 'Stationnement avec bornes', en: 'EV parking' }, line: { fr: 'Recharge au garage, prête dès le premier jour.', en: 'Charging in the garage, ready from day one.' } },
      { title: { fr: 'Conciergerie', en: 'Concierge' }, line: { fr: 'Quelqu’un à la porte, sept jours sur sept.', en: 'Someone at the door, seven days a week.' } },
    ],
  },
  neighbourhood: {
    overline: { fr: 'Le quartier', en: 'The neighbourhood' },
    title: { fr: 'Griffintown, à votre porte', en: 'Griffintown, at your door' },
    para: {
      fr: 'Entre le canal de Lachine et le centre-ville, Griffintown a gardé ses briques et trouvé son rythme. Cafés de quartier, galeries, marchés : tout se fait à pied, et le reste à vélo.',
      en: 'Between the Lachine Canal and downtown, Griffintown kept its brick and found its pace. Neighbourhood cafés, galleries, markets: everything is a walk away, and the rest is a bike ride.',
    },
    stats: [
      { value: { fr: '7 min', en: '7 min' }, label: { fr: 'métro Bonaventure', en: 'Bonaventure metro' } },
      { value: { fr: '2 min', en: '2 min' }, label: { fr: 'café le plus proche', en: 'nearest café' } },
      { value: { fr: '3 min', en: '3 min' }, label: { fr: 'parc du canal de Lachine', en: 'Lachine Canal park' } },
      { value: { fr: '6 min', en: '6 min' }, label: { fr: 'centre-ville', en: 'downtown' } },
    ],
  },
  gallery: {
    overline: { fr: 'Galerie', en: 'Gallery' },
    title: { fr: 'Galerie', en: 'Gallery' },
    captions: [
      { fr: 'Le hall, calcaire et bronze', en: 'The lobby, limestone and bronze' },
      { fr: 'Résidence 804, fin d’après-midi', en: 'Residence 804, late afternoon' },
      { fr: 'La terrasse du 12e, à la tombée du jour', en: 'The 12th-floor terrace at dusk' },
      { fr: 'Vue vers le canal, côté sud', en: 'Looking south to the canal' },
    ],
  },
  contact: {
    overline: { fr: 'Contact', en: 'Contact' },
    headline: { fr: 'Planifiez votre visite', en: 'Book your visit' },
    line: { fr: 'Rencontres privées au bureau des ventes, sans engagement.', en: 'Private appointments at the sales gallery, no obligation.' },
    labels: {
      name: { fr: 'Nom complet', en: 'Full name' },
      email: { fr: 'Courriel', en: 'Email' },
      phone: { fr: 'Téléphone', en: 'Phone' },
      unit: { fr: 'Résidence recherchée', en: 'Residence of interest' },
      unitOptions: [
        { fr: 'Studio', en: 'Studio' },
        { fr: 'Deux chambres', en: 'Two bedroom' },
        { fr: 'Penthouse', en: 'Penthouse' },
        { fr: 'Autre', en: 'Other' },
      ],
      submit: { fr: 'Planifier une visite', en: 'Book a visit' },
      success: { fr: 'Merci. Un membre de l’équipe vous écrira d’ici un jour ouvrable.', en: 'Thank you. A member of the team will reach out within one business day.' },
    },
  },
  footer: {
    blurb: { fr: 'Verso, une tour boutique de douze étages entre le canal et le centre-ville.', en: 'Verso, a twelve-storey boutique tower between the canal and downtown.' },
    address: { fr: '376, rue Ottawa, Montréal (Québec) H3C 1S1', en: '376 Ottawa Street, Montreal, QC H3C 1S1' },
    legal: { fr: 'Illustrations à des fins de présentation seulement.', en: 'Renderings for illustration purposes only.' },
  },
  demo: {
    badge: { fr: 'Site démo par NexaWebDev', en: 'Demo site by NexaWebDev' },
    headline: { fr: 'Ce site est une démo', en: 'This site is a demo' },
    line: { fr: 'Verso n’existe pas. NexaWebDev conçoit ce genre de site pour de vraies marques.', en: 'Verso does not exist. NexaWebDev builds sites like this for real brands.' },
    cta: { fr: 'Réserver un appel', en: 'Book a call' },
  },
} as const;

/** Resolve a dot path like "acts.2.headline" to its {fr,en} leaf. */
export function leaf(path: string): L | null {
  let node: unknown = copy;
  for (const part of path.split('.')) {
    if (node === null || typeof node !== 'object') return null;
    node = (node as Record<string, unknown>)[part];
  }
  if (node && typeof node === 'object' && 'fr' in (node as object)) return node as L;
  return null;
}
