import { createContext, useContext, useState, type ReactNode } from 'react';
import plumbingImg from '../assets/plumbing-mockup.JPG';
import lawfirmImg from '../assets/lawfirm-mockup.JPG';
import kitchenImg from '../assets/kitchen-mokcup.JPG';
import estheticsImg from '../assets/professional-esthetics.JPG';

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
      'We are the dev team your clients never meet. Drop us a brief, get a custom-coded bilingual (FR/EN) website in 48 hours, and invoice your client at your own rate.',
    'hero.cta1': 'Become a Partner',
    'hero.cta2': 'See How It Works',
    'hero.proof': 'Used by digital agencies across Canada and the US',
    'hero.stat1.value': '48h',
    'hero.stat1.label': 'Turnaround',
    'hero.stat2.value': '$1K',
    'hero.stat2.label': 'Flat Fee',
    'hero.stat3.value': '90+',
    'hero.stat3.label': 'PageSpeed',
    'hero.stat4.value': 'FR/EN',
    'hero.stat4.label': 'Native',

    // Problem
    'problem.badge': 'The Fulfillment Problem',
    'problem.title': 'Your Clients Need Fast Websites.',
    'problem.titleAccent': "Your Team Isn't Set Up to Deliver Them.",
    'problem.left.title': "What's Killing Your Margins",
    'problem.right.title': 'How NexaWebDev Fixes It',

    // HowItWorks
    'hiw.badge': 'The White-Label Partnership',
    'hiw.title': '3 Steps to',
    'hiw.titleAccent': 'Pure Profit',
    'hiw.step1.num': '01',
    'hiw.step1.title': 'You Close the Deal',
    'hiw.step1.desc':
      'Sell the website to your client at $2,500-$5,000+. You own the relationship. Your brand is on the contract. NexaWebDev never comes up.',
    'hiw.step2.num': '02',
    'hiw.step2.title': 'Send Us the Brief',
    'hiw.step2.desc':
      "Share the logo, colors, and copy through a short form. 15 minutes, tops. We ask the right questions so you don't have to chase the client for specs.",
    'hiw.step3.num': '03',
    'hiw.step3.title': 'We Deliver in 48 Hours',
    'hiw.step3.desc':
      'Pay our flat fee starting at $1,000. We hand you a live, bilingual site that scores 90+ on PageSpeed. You deliver it to your client and keep the difference.',
    'hiw.margin.label': 'Your average margin per project',
    'hiw.margin.value': '$1,500-$4,000+',
    'hiw.margin.note': 'Without writing a single line of code.',

    // TechStack
    'stack.badge': 'Our Capabilities',
    'stack.title': 'Built on the Platforms',
    'stack.titleAccent': 'That Actually Perform',
    'stack.sub':
      "We skip the page builders. Every site is custom-coded for speed and SEO.",
    'stack.portfolio.title': 'Recent White-Label Deliveries',
    'stack.portfolio.sub': 'Sold by agencies. Built by us. Your clients never know.',

    // FinalCTA
    'cta.badge': 'Zero Risk to Start',
    'cta.title': 'You Sell One Site This Week.',
    'cta.titleAccent': "We'll Build It.",
    'cta.sub':
      "No retainers, no contracts. Pay when you have a signed deal. The first delivery will prove the model, and your client will never know we were involved.",
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
      "On est l'équipe de dev que vos clients ne rencontreront jamais. Envoyez-nous un brief, recevez un site bilingue (FR/EN) codé sur mesure en 48h, et facturez votre client à votre propre tarif.",
    'hero.cta1': 'Devenir partenaire',
    'hero.cta2': 'Comment ça marche',
    'hero.proof': 'Utilisé par des agences numériques au Canada et aux États-Unis',
    'hero.stat1.value': '48h',
    'hero.stat1.label': 'Livraison',
    'hero.stat2.value': '1 000$',
    'hero.stat2.label': 'Prix fixe',
    'hero.stat3.value': '90+',
    'hero.stat3.label': 'PageSpeed',
    'hero.stat4.value': 'FR/EN',
    'hero.stat4.label': 'Natif',

    // Problem
    'problem.badge': 'Le problème de livraison',
    'problem.title': 'Vos clients ont besoin de sites rapides.',
    'problem.titleAccent': "Votre équipe n'est pas outillée pour ça.",
    'problem.left.title': "Ce qui ronge vos marges",
    'problem.right.title': 'Comment NexaWebDev règle ça',

    // HowItWorks
    'hiw.badge': 'Le partenariat en marque blanche',
    'hiw.title': '3 étapes vers',
    'hiw.titleAccent': 'un profit pur',
    'hiw.step1.num': '01',
    'hiw.step1.title': 'Vous concluez la vente',
    'hiw.step1.desc':
      "Vendez le site à votre client entre 2 500$ et 5 000$+. Vous gérez la relation. Votre marque est sur le contrat. NexaWebDev n'est jamais mentionné.",
    'hiw.step2.num': '02',
    'hiw.step2.title': 'Envoyez-nous le brief',
    'hiw.step2.desc':
      "Partagez le logo, les couleurs et le texte via un court formulaire. 15 minutes, pas plus. On pose les bonnes questions pour que vous n'ayez pas à courir après le client.",
    'hiw.step3.num': '03',
    'hiw.step3.title': 'On livre en 48 heures',
    'hiw.step3.desc':
      "Payez nos frais fixes à partir de 1 000$. On vous remet un site bilingue en ligne qui score 90+ sur PageSpeed. Vous le livrez à votre client et gardez la différence.",
    'hiw.margin.label': 'Votre marge moyenne par projet',
    'hiw.margin.value': '1 500$-4 000$+',
    'hiw.margin.note': "Sans écrire une seule ligne de code.",

    // TechStack
    'stack.badge': 'Nos capacités',
    'stack.title': 'Construit sur les plateformes',
    'stack.titleAccent': 'qui performent vraiment',
    'stack.sub':
      "On ne touche pas aux constructeurs de pages. Chaque site est codé sur mesure pour la vitesse et le SEO.",
    'stack.portfolio.title': 'Livraisons récentes en marque blanche',
    'stack.portfolio.sub': 'Vendus par des agences. Construits par nous. Vos clients ne sauront jamais.',

    // FinalCTA
    'cta.badge': 'Zéro risque pour commencer',
    'cta.title': 'Vous vendez un site cette semaine.',
    'cta.titleAccent': 'On le construit.',
    'cta.sub':
      "Pas de retainers, pas de contrats. Payez quand vous avez une vente signée. La première livraison prouvera le modèle, et votre client ne saura jamais qu'on était là.",
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
    'Bloated GoHighLevel templates that tank Core Web Vitals',
    'Google Translate plugins that embarrass your clients and your brand',
    'Offshore devs who go dark mid-project',
    'WordPress themes that take 3 weeks and 7 revision rounds',
    'Mobile PageSpeed under 50. Your paid campaigns are burning budget on traffic that bounces.',
  ],
  FR: [
    'Templates GoHighLevel surchargés qui détruisent les Core Web Vitals',
    'Plugins Google Translate qui font honte à vos clients et à votre marque',
    'Développeurs offshore qui disparaissent en cours de projet',
    'Thèmes WordPress qui prennent 3 semaines et 7 tours de révisions',
    'PageSpeed mobile sous 50. Vos campagnes payantes brûlent du budget sur du trafic qui repart.',
  ],
};

const problemRightItems: Record<Language, string[]> = {
  EN: [
    'Custom-coded sites that score 90+ on Mobile PageSpeed, guaranteed',
    'Native FR/EN URL structure (/fr/ and /en/), not a plugin shortcut',
    'Local North American team. Same timezone. You can actually reach us.',
    '48-hour turnaround, every time. Brief us today, live site by Monday.',
    'Sites that convert local traffic, not just rank for it.',
  ],
  FR: [
    'Sites codés sur mesure avec 90+ sur Mobile PageSpeed, garanti',
    'Architecture URL FR/EN native (/fr/ et /en/), pas un plugin bricolé',
    'Équipe nord-américaine locale. Même fuseau horaire. On est joignables pour de vrai.',
    "Livraison en 48h, à chaque fois. Brief aujourd'hui, site en ligne lundi.",
    'Des sites qui convertissent le trafic local, pas seulement qui le classent.',
  ],
};

const platformItems: Record<Language, { name: string; desc: string; badge: string }[]> = {
  EN: [
    {
      name: 'React / Next.js',
      desc: 'Scores 90+ on PageSpeed. Good fit for local service sites, landing pages, and quote calculators.',
      badge: 'Fastest Option',
    },
    {
      name: 'Shopify',
      desc: 'Native bilingual product catalogs with no translation plugin. Good for agencies with retail or D2C clients.',
      badge: 'E-Commerce',
    },
    {
      name: 'WordPress',
      desc: 'Clean local SEO structure built to rank. Works well for corporate clients who care about organic search.',
      badge: 'SEO Powerhouse',
    },
    {
      name: 'Webflow',
      desc: 'High-end visuals without the speed penalty. Best for premium service brands getting a refresh.',
      badge: 'Premium Design',
    },
  ],
  FR: [
    {
      name: 'React / Next.js',
      desc: "Score 90+ sur PageSpeed. Bon choix pour les sites de services locaux, les pages d'atterrissage et les calculateurs de devis.",
      badge: 'Option la plus rapide',
    },
    {
      name: 'Shopify',
      desc: 'Catalogues bilingues natifs sans plugin de traduction. Bon pour les agences avec des clients en retail ou D2C.',
      badge: 'E-Commerce',
    },
    {
      name: 'WordPress',
      desc: 'Architecture SEO local propre conçue pour classer. Bien adapté aux clients corporate qui misent sur la recherche organique.',
      badge: 'Puissance SEO',
    },
    {
      name: 'Webflow',
      desc: 'Visuels haut de gamme sans pénalité de vitesse. Idéal pour les marques premium en refonte.',
      badge: 'Design premium',
    },
  ],
};

const portfolioItems: Record<Language, { title: string; category: string; image: string; link: string }[]> = {
  EN: [
    { title: 'Emergency Plumbing Co.', category: 'Home Services — React/Next.js', image: plumbingImg, link: 'https://plumbing-mockup.pages.dev/' },
    { title: 'Marchand & Associés', category: 'Law Firm — WordPress', image: lawfirmImg, link: 'https://lawfirm-mockup.pages.dev/' },
    { title: 'Prestige Rénovation', category: 'Kitchen & Bath — Webflow', image: kitchenImg, link: 'https://kitchen-mockup.pages.dev/' },
    { title: 'Professional Esthetics Clinic', category: 'Ecommerce — Shopify', image: estheticsImg, link: 'https://skinsations.ca' },
  ],
  FR: [
    { title: "Services de plomberie d'urgence", category: 'Services à domicile — React/Next.js', image: plumbingImg, link: 'https://plumbing-mockup.pages.dev/' },
    { title: 'Marchand & Associés', category: 'Cabinet juridique — WordPress', image: lawfirmImg, link: 'https://lawfirm-mockup.pages.dev/' },
    { title: 'Prestige Rénovation', category: 'Cuisine & Salle de bain — Webflow', image: kitchenImg, link: 'https://kitchen-mockup.pages.dev/' },
    { title: "Clinique d'esthétique professionnelle", category: 'E-commerce — Shopify', image: estheticsImg, link: 'https://skinsations.ca' },
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
