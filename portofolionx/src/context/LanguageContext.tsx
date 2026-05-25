import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'EN' | 'FR';

const translations = {
  EN: {
    // Navbar
    'nav.howItWorks': 'How It Works',
    'nav.stack': 'Our Stack',
    'nav.cta': 'Book a Call →',

    // Hero
    'hero.badge': 'White-Label Web Development for Growth Agencies',
    'hero.headline1': 'Scale Your Agency',
    'hero.headline2': 'Without Touching a Line of Code.',
    'hero.sub':
      'We are your invisible backend dev team. We white-label blazing-fast, natively bilingual (FR/EN) service websites delivered in 48 hours. You close the deal. We build it. You pocket the margin.',
    'hero.cta1': 'Become a Partner',
    'hero.cta2': 'See How It Works',
    'hero.proof': 'Trusted by digital agencies across Canada & the US',
    'hero.stat1.value': '48h',
    'hero.stat1.label': 'Turnaround',
    'hero.stat2.value': '$1K',
    'hero.stat2.label': 'Flat Fee',
    'hero.stat3.value': '90+',
    'hero.stat3.label': 'PageSpeed',
    'hero.stat4.value': 'FR/EN',
    'hero.stat4.label': 'Native',

    // Problem
    'problem.badge': 'The Agency Dilemma',
    'problem.title': 'Your Clients Need Lightning-Fast Websites.',
    'problem.titleAccent': "Your Team Isn't Built to Deliver Them.",
    'problem.left.title': 'The Headaches Killing Your Margins',
    'problem.right.title': 'The NexaWebDev Advantage',

    // HowItWorks
    'hiw.badge': 'The White-Label Partnership',
    'hiw.title': '3 Steps to',
    'hiw.titleAccent': 'Pure Profit',
    'hiw.step1.num': '01',
    'hiw.step1.title': 'You Close the Deal',
    'hiw.step1.desc':
      'Sell the website to your client for $2,500–$5,000+. You handle the relationship. Your brand is on the contract. NexaWebDev never appears in the picture.',
    'hiw.step2.num': '02',
    'hiw.step2.title': 'Send Us the Brief',
    'hiw.step2.desc':
      "Share the logo, brand colors, and basic copy via a simple form. 15 minutes of your time — maximum. We ask the right questions so you don't have to.",
    'hiw.step3.num': '03',
    'hiw.step3.title': 'We Deliver in 48 Hours',
    'hiw.step3.desc':
      'Pay our flat fulfillment fee starting at $1,000. We hand you a live, blazing-fast, fully bilingual website. You deliver it to your client and pocket the difference.',
    'hiw.margin.label': 'Your average margin per project',
    'hiw.margin.value': '$1,500 – $4,000+',
    'hiw.margin.note': 'Without writing a single line of code.',

    // TechStack
    'stack.badge': 'Our Capabilities',
    'stack.title': 'Built on the Platforms',
    'stack.titleAccent': 'That Actually Perform',
    'stack.sub':
      "We don't touch page builders. Every site we build is optimized from the ground up for speed, SEO, and conversion.",
    'stack.portfolio.title': 'Recent White-Label Deliveries',
    'stack.portfolio.sub': 'Sold by agencies. Built by us. Your clients never know.',

    // FinalCTA
    'cta.badge': 'Zero Risk to Start',
    'cta.title': 'You Sell One Site This Week.',
    'cta.titleAccent': "We'll Build It.",
    'cta.sub':
      'No retainers. No contracts. No ongoing commitment. Pay only when you have a closed deal. Our first delivery will speak for itself — and your client will never know we existed.',
    'cta.btn': 'Book Your Free Discovery Call',
    'cta.risk1': 'No monthly fees or retainers',
    'cta.risk2': 'No exclusivity agreements',
    'cta.risk3': 'No commitment beyond the project',
    'cta.risk4': 'Your brand. Your client. Your margin.',

    // Footer
    'footer.tagline': 'Your invisible dev team. Your full margin.',
    'footer.nav.howItWorks': 'How It Works',
    'footer.nav.stack': 'Our Stack',
    'footer.nav.partner': 'Become a Partner',
    'footer.contact': 'contact@nexawebdev.com',
    'footer.copyright': '© 2025 NexaWebDev. All rights reserved.',
    'footer.legal': 'Built for agencies. Invisible by design.',
  },
  FR: {
    // Navbar
    'nav.howItWorks': 'Comment ça marche',
    'nav.stack': 'Notre stack',
    'nav.cta': 'Réserver un appel →',

    // Hero
    'hero.badge': 'Développement web en marque blanche pour agences de croissance',
    'hero.headline1': 'Développez votre agence',
    'hero.headline2': 'sans écrire une seule ligne de code.',
    'hero.sub':
      "Nous sommes votre équipe de développement invisible. On crée des sites ultra-rapides, nativement bilingues (FR/EN) livrés en 48h. Vous concluez la vente. On construit. Vous gardez la marge.",
    'hero.cta1': 'Devenir partenaire',
    'hero.cta2': 'Comment ça marche',
    'hero.proof': 'Approuvé par des agences numériques au Canada et aux États-Unis',
    'hero.stat1.value': '48h',
    'hero.stat1.label': 'Livraison',
    'hero.stat2.value': '1 000$',
    'hero.stat2.label': 'Prix fixe',
    'hero.stat3.value': '90+',
    'hero.stat3.label': 'PageSpeed',
    'hero.stat4.value': 'FR/EN',
    'hero.stat4.label': 'Natif',

    // Problem
    'problem.badge': 'Le dilemme des agences',
    'problem.title': 'Vos clients ont besoin de sites ultra-rapides.',
    'problem.titleAccent': "Votre équipe n'est pas faite pour ça.",
    'problem.left.title': 'Les maux de tête qui tuent vos marges',
    'problem.right.title': "L'avantage NexaWebDev",

    // HowItWorks
    'hiw.badge': 'Le partenariat en marque blanche',
    'hiw.title': '3 étapes vers',
    'hiw.titleAccent': 'un profit pur',
    'hiw.step1.num': '01',
    'hiw.step1.title': 'Vous concluez la vente',
    'hiw.step1.desc':
      "Vendez le site à votre client entre 2 500$ et 5 000$+. Vous gérez la relation. Votre marque est sur le contrat. NexaWebDev n'apparaît jamais dans l'image.",
    'hiw.step2.num': '02',
    'hiw.step2.title': 'Envoyez-nous le brief',
    'hiw.step2.desc':
      "Partagez le logo, les couleurs de marque et le texte de base via un formulaire simple. 15 minutes de votre temps — maximum. On pose les bonnes questions pour vous.",
    'hiw.step3.num': '03',
    'hiw.step3.title': 'On livre en 48 heures',
    'hiw.step3.desc':
      "Payez nos frais fixes à partir de 1 000$. On vous remet un site bilingue ultra-rapide et en ligne. Vous le livrez à votre client et empochez la différence.",
    'hiw.margin.label': 'Votre marge moyenne par projet',
    'hiw.margin.value': '1 500$ – 4 000$+',
    'hiw.margin.note': "Sans écrire une seule ligne de code.",

    // TechStack
    'stack.badge': 'Nos capacités',
    'stack.title': 'Construit sur les plateformes',
    'stack.titleAccent': 'qui performent vraiment',
    'stack.sub':
      "On ne touche pas aux constructeurs de pages. Chaque site qu'on construit est optimisé de zéro pour la vitesse, le SEO et la conversion.",
    'stack.portfolio.title': 'Livraisons récentes en marque blanche',
    'stack.portfolio.sub': 'Vendus par des agences. Construits par nous. Vos clients ne sauront jamais.',

    // FinalCTA
    'cta.badge': 'Zéro risque pour commencer',
    'cta.title': 'Vous vendez un site cette semaine.',
    'cta.titleAccent': 'On le construit.',
    'cta.sub':
      "Pas de retainers. Pas de contrats. Pas d'engagement continu. Payez seulement quand vous avez une vente conclue. Notre première livraison parlera d'elle-même — et votre client ne saura jamais qu'on a existé.",
    'cta.btn': 'Réserver votre appel découverte gratuit',
    'cta.risk1': 'Aucuns frais mensuels ni retainers',
    'cta.risk2': "Aucun accord d'exclusivité",
    'cta.risk3': 'Aucun engagement au-delà du projet',
    'cta.risk4': 'Votre marque. Votre client. Votre marge.',

    // Footer
    'footer.tagline': 'Votre équipe de dev invisible. Votre marge complète.',
    'footer.nav.howItWorks': 'Comment ça marche',
    'footer.nav.stack': 'Notre stack',
    'footer.nav.partner': 'Devenir partenaire',
    'footer.contact': 'contact@nexawebdev.com',
    'footer.copyright': '© 2025 NexaWebDev. Tous droits réservés.',
    'footer.legal': 'Conçu pour les agences. Invisible par design.',
  },
} as const;

type StringKey = keyof typeof translations.EN;

const problemLeftItems: Record<Language, string[]> = {
  EN: [
    'Bloated GoHighLevel templates destroying Core Web Vitals',
    'Google Translate plugins that embarrass your clients — and your brand',
    'Offshore devs who go dark mid-project',
    'WordPress themes that take 3 weeks and 7 revision rounds',
    'Mobile PageSpeed under 50 — your SEO campaigns are bleeding out',
  ],
  FR: [
    'Templates GoHighLevel boursouflés qui détruisent les Core Web Vitals',
    'Plugins Google Translate qui font honte à vos clients — et à votre marque',
    'Développeurs offshore qui disparaissent en cours de projet',
    'Thèmes WordPress qui prennent 3 semaines et 7 tours de révisions',
    'PageSpeed mobile sous 50 — vos campagnes SEO saignent à blanc',
  ],
};

const problemRightItems: Record<Language, string[]> = {
  EN: [
    'Custom-coded sites scoring 90+ on Mobile PageSpeed — guaranteed',
    'Native FR/EN URL architecture (/fr/ and /en/) — not a plugin hack',
    'Local North American team. Same timezone. Real Slack communication.',
    '48-hour delivery, every time. Brief us today, site live by Monday.',
    'We make your local SEO campaigns actually convert — not just rank.',
  ],
  FR: [
    'Sites en code natif avec 90+ sur Mobile PageSpeed — garanti',
    'Architecture URL FR/EN native (/fr/ et /en/) — pas un plugin bricolé',
    'Équipe nord-américaine locale. Même fuseau horaire. Communication Slack réelle.',
    "Livraison en 48h, à chaque fois. Brief aujourd'hui, site en ligne lundi.",
    'On fait réellement convertir vos campagnes SEO local — pas juste classer.',
  ],
};

const platformItems: Record<Language, { name: string; desc: string; badge: string }[]> = {
  EN: [
    {
      name: 'React / Next.js',
      desc: 'Maximum performance. 90+ PageSpeed guaranteed. Ideal for local service sites, landing pages, and custom quote calculators.',
      badge: 'Fastest Option',
    },
    {
      name: 'Shopify',
      desc: 'Flawless e-commerce with native bilingual product catalogs. Ideal for agencies serving retail and D2C clients.',
      badge: 'E-Commerce',
    },
    {
      name: 'WordPress',
      desc: 'High-trust corporate sites with clean local SEO architecture. Built to rank. Built to convert.',
      badge: 'SEO Powerhouse',
    },
    {
      name: 'Webflow',
      desc: 'Designer-grade visuals with zero compromises on speed. Best for premium service businesses and rebrands.',
      badge: 'Premium Design',
    },
  ],
  FR: [
    {
      name: 'React / Next.js',
      desc: "Performance maximale. 90+ PageSpeed garanti. Idéal pour les sites de services locaux, les pages d'atterrissage et les calculateurs de devis personnalisés.",
      badge: 'Option la plus rapide',
    },
    {
      name: 'Shopify',
      desc: 'Commerce en ligne impeccable avec des catalogues bilingues natifs. Idéal pour les agences servant des clients en retail et D2C.',
      badge: 'E-Commerce',
    },
    {
      name: 'WordPress',
      desc: 'Sites corporatifs de haute confiance avec une architecture SEO local propre. Conçu pour classer. Conçu pour convertir.',
      badge: 'Puissance SEO',
    },
    {
      name: 'Webflow',
      desc: 'Visuels de qualité design sans compromis sur la vitesse. Idéal pour les entreprises de services premium et les refontes de marque.',
      badge: 'Design premium',
    },
  ],
};

const portfolioItems: Record<Language, { title: string; category: string; image: string; link: string }[]> = {
  EN: [
    { title: 'Emergency Plumbing Co.', category: 'Home Services — React/Next.js', image: '' , link: '' },
    { title: 'Elite HVAC Solutions', category: 'HVAC — WordPress', image: '', link: '' },
    { title: 'Premier Remodeling Group', category: 'Remodeling — Webflow', image: '', link: '' },
    { title: 'Professional Esthetics Clinic', category: 'Ecommerce — Shopify', image: '/src/assets/professional-esthetics.jpg', link: 'https://skinsations.ca' },
  ],
  FR: [
    { title: "Services de plomberie d'urgence", category: 'Services à domicile — React/Next.js', image: '', link: '' },
    { title: 'Solutions HVAC Élite', category: 'HVAC — WordPress', image: '', link: '' },
    { title: 'Groupe de rénovation Premier', category: 'Rénovation — Webflow', image: '', link: '' },
    { title: "Clinique d'esthétique professionnelle", category: 'E-commerce — Shopify', image: '/src/assets/professional-esthetics.jpg', link: 'https://skinsations.ca' },
  ],
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: StringKey) => string;
  tProblemLeft: () => string[];
  tProblemRight: () => string[];
  tPlatformItems: () => { name: string; desc: string; badge: string }[];
  tPortfolioItems: () => { title: string; category: string; image: string; link: string }[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');

  const toggleLanguage = () => setLanguage(prev => (prev === 'EN' ? 'FR' : 'EN'));

  const t = (key: StringKey): string => translations[language][key];

  const tProblemLeft = () => problemLeftItems[language];
  const tProblemRight = () => problemRightItems[language];
  const tPlatformItems = () => platformItems[language];
  const tPortfolioItems = () => portfolioItems[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, tProblemLeft, tProblemRight, tPlatformItems, tPortfolioItems }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
