export const LOCALE_OPTIONS = [
  { id: 'en-US', label: 'English (US)', locale: 'en-US', currency: 'USD' },
  { id: 'en-GB', label: 'English (UK)', locale: 'en-GB', currency: 'GBP' },
  { id: 'en-IN', label: 'English (IN)', locale: 'en-IN', currency: 'INR' },
  { id: 'fr-FR', label: 'Français', locale: 'fr-FR', currency: 'EUR' },
];

export const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'INR'];

export const FX_DEFAULT_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.2,
};

export function getDefaultLocale() {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'en-US';
}

export function getDefaultCurrency(locale) {
  const match = LOCALE_OPTIONS.find((opt) => opt.locale === locale);
  return match ? match.currency : 'USD';
}

function convertAmount(amount, fromCurrency, toCurrency, rates = FX_DEFAULT_RATES) {
  if (!amount || !fromCurrency || !toCurrency || fromCurrency === toCurrency) {
    return amount;
  }
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  if (!fromRate || !toRate) return amount;
  const usd = amount / fromRate;
  return usd * toRate;
}

export function formatCurrency(amount, fromCurrency, toCurrency, locale, rates) {
  if (amount === null || amount === undefined) return '';
  const value = convertAmount(amount, fromCurrency, toCurrency, rates);
  try {
    return new Intl.NumberFormat(locale || 'en-US', {
      style: 'currency',
      currency: toCurrency || fromCurrency || 'USD',
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)}`;
  }
}

export function formatDate(dateInput, locale) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  try {
    return new Intl.DateTimeFormat(locale || 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return date.toDateString();
  }
}

export function mapCountryToLocaleCurrency(countryCode) {
  if (!countryCode) return null;
  const code = countryCode.toUpperCase();
  if (code === 'IN') return { locale: 'en-IN', currency: 'INR' };
  if (code === 'GB') return { locale: 'en-GB', currency: 'GBP' };
  if (code === 'US') return { locale: 'en-US', currency: 'USD' };
  if (code === 'FR') return { locale: 'fr-FR', currency: 'EUR' };
  return null;
}

const MESSAGES = {
  'en': {
    nav_tours: 'Tours',
    nav_itineraries: 'Itineraries',
    nav_why_ai: 'Why AI',
    nav_about: 'About',
    nav_contact: 'Contact',
    nav_login: 'Login',
    nav_profile: 'Profile',
    nav_logout: 'Log Out',
    home_hero_title_1: 'Travel',
    home_hero_title_2: 'reimagined',
    home_hero_sub_1: 'AI-powered itineraries tailored to you.',
    home_hero_sub_2: 'Plan smarter. Travel better.',
    home_cta_try_ai: 'Try AI Planning',
    home_cta_explore_tours: 'Explore all tours',
    home_cta_get_started: 'Get started',
    planner_title: 'Orbito AI Assistant',
    planner_hint: 'No prompt required. Pick your city + dates, or add a quick preference below.',
    planner_prompt_label: 'Customize your trip (optional)',
    planner_prompt_placeholder: 'e.g., family-friendly, budget, food-focused, relaxed pace',
    planner_generate_button: 'Generate AI Itinerary',
    planner_generating: 'Generating...',
    planner_add_activity: 'Add Activity',
    planner_quick_add_placeholder: 'Quick add activity (e.g., Brunch, Museum visit)',
    planner_add_button: 'Add',
    auth_login: 'Login',
    auth_signup: 'Sign Up',
    auth_signin: 'Sign in',
    auth_create_account: 'Create Account',
    auth_email: 'Email address',
    auth_password: 'Password',
    auth_full_name: 'Full Name',
    auth_country_optional: 'Country (Optional)',
    auth_welcome_title: 'Welcome to your next adventure',
    auth_welcome_sub: 'Plan, book, and manage your trips in one place',
    tours_title: 'Discover Amazing Tours & Activities',
    tours_subtitle: 'Book experiences from top providers worldwide',
    tours_search_placeholder: 'Search destination...',
    tours_search_button: 'Search',
    tours_filters_button: 'Show Filters',
    tours_found: 'Found',
    tours_label: 'tours',
    account_trips_count: 'Trips',
    account_favs_count: 'Favorites',
    account_no_trips_title: 'No trips yet',
    account_no_trips_desc: 'Start planning your first adventure!',
    account_create_first_trip: 'Create Your First Trip',
    account_no_favs_title: 'No favorites yet',
    account_no_favs_desc: 'Start exploring and save your favorite places!',
    account_explore_destinations: 'Explore Destinations',
    account_activities_label: 'activities',
    footer_company: 'Company',
    footer_support: 'Support',
    footer_discover: 'Discover',
    footer_about: 'About Us',
    footer_careers: 'Careers',
    footer_blog: 'Blog',
    footer_help: 'Help Center',
    footer_contact: 'Contact Us',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_refunds: 'Refund Policy',
    footer_supplier_terms: 'Supplier Terms',
    footer_destinations: 'Popular Destinations',
    footer_itineraries: 'Featured Itineraries',
    footer_guides: 'Travel Guides',
    footer_articles: 'Travel Articles',
    footer_list_business: 'Register Your Business',
    footer_secure: 'Secure Payments',
    footer_reviews: 'Verified Reviews',
    cookie_text: 'We use cookies to improve your experience and analyze site performance. You can accept all cookies or continue with essential cookies only.',
    cookie_essential: 'Essential Only',
    cookie_accept: 'Accept All',
    tours_sort_rating: 'Highest Rated',
    tours_sort_low: 'Price: Low to High',
    tours_sort_high: 'Price: High to Low',
    tours_sort_popular: 'Most Popular',
    tours_no_results_title: 'No tours found',
    tours_no_results_desc: 'Try adjusting your filters or search for a different destination',
    tours_clear_filters: 'Clear All Filters',
    tours_from: 'From',
    tours_per_person: 'per person',
    tourdetail_from: 'From',
    tourdetail_per_adult: 'per adult',
    tourdetail_select_date: 'Select Date',
    tourdetail_pick_date: 'Pick a date',
    tourdetail_adults: 'Adults',
    tourdetail_children: 'Children',
    tourdetail_full_name: 'Full Name',
    tourdetail_email: 'Email',
    tourdetail_phone_optional: 'Phone (Optional)',
    tourdetail_special_optional: 'Special Requirements (Optional)',
    tourdetail_total: 'Total',
    tourdetail_book_now: 'Book Now',
    account_profile_settings: 'Profile Settings',
    account_my_trips: 'My Trips',
    account_favorites: 'Favorites',
    account_profile_tab: 'Profile',
    account_trips_short: 'Trips',
    account_favs_short: 'Favs',
  },
  'fr': {
    nav_tours: 'Tours',
    nav_itineraries: 'Itinéraires',
    nav_why_ai: "Pourquoi l’IA",
    nav_about: 'À propos',
    nav_contact: 'Contact',
    nav_login: 'Se connecter',
    nav_profile: 'Profil',
    nav_logout: 'Se déconnecter',
    home_hero_title_1: 'Voyager',
    home_hero_title_2: 'réinventé',
    home_hero_sub_1: 'Des itinéraires IA pensés pour vous.',
    home_hero_sub_2: 'Planifiez mieux. Voyagez mieux.',
    home_cta_try_ai: 'Essayer l’IA',
    home_cta_explore_tours: 'Voir les tours',
    home_cta_get_started: 'Commencer',
    planner_title: 'Assistant IA Orbito',
    planner_hint: 'Aucun prompt requis. Choisissez votre ville + dates, ou ajoutez une préférence ci-dessous.',
    planner_prompt_label: 'Personnalisez votre voyage (optionnel)',
    planner_prompt_placeholder: 'ex. famille, petit budget, gastronomie, rythme tranquille',
    planner_generate_button: 'Générer un itinéraire IA',
    planner_generating: 'Génération...',
    planner_add_activity: 'Ajouter une activité',
    planner_quick_add_placeholder: 'Ajout rapide (ex. brunch, musée)',
    planner_add_button: 'Ajouter',
    auth_login: 'Se connecter',
    auth_signup: 'S’inscrire',
    auth_signin: 'Se connecter',
    auth_create_account: 'Créer un compte',
    auth_email: 'Adresse e‑mail',
    auth_password: 'Mot de passe',
    auth_full_name: 'Nom complet',
    auth_country_optional: 'Pays (optionnel)',
    auth_welcome_title: 'Bienvenue dans votre prochaine aventure',
    auth_welcome_sub: 'Planifiez, réservez et gérez vos voyages en un seul endroit',
    tours_title: 'Découvrez des tours et activités',
    tours_subtitle: 'Réservez des expériences des meilleurs partenaires',
    tours_search_placeholder: 'Rechercher une destination...',
    tours_search_button: 'Rechercher',
    tours_filters_button: 'Afficher les filtres',
    tours_found: 'Trouvé',
    tours_label: 'tours',
    account_trips_count: 'Voyages',
    account_favs_count: 'Favoris',
    account_no_trips_title: 'Aucun voyage',
    account_no_trips_desc: 'Commencez à planifier votre première aventure !',
    account_create_first_trip: 'Créer votre premier voyage',
    account_no_favs_title: 'Aucun favori',
    account_no_favs_desc: 'Explorez et enregistrez vos lieux préférés !',
    account_explore_destinations: 'Explorer les destinations',
    account_activities_label: 'activités',
    footer_company: 'Entreprise',
    footer_support: 'Support',
    footer_discover: 'Découvrir',
    footer_about: 'À propos',
    footer_careers: 'Carrières',
    footer_blog: 'Blog',
    footer_help: 'Centre d’aide',
    footer_contact: 'Contact',
    footer_privacy: 'Politique de confidentialité',
    footer_terms: 'Conditions d’utilisation',
    footer_refunds: 'Politique de remboursement',
    footer_supplier_terms: 'Conditions fournisseurs',
    footer_destinations: 'Destinations populaires',
    footer_itineraries: 'Itinéraires en vedette',
    footer_guides: 'Guides de voyage',
    footer_articles: 'Articles de voyage',
    footer_list_business: 'Enregistrez votre entreprise',
    footer_secure: 'Paiements sécurisés',
    footer_reviews: 'Avis vérifiés',
    cookie_text: 'Nous utilisons des cookies pour améliorer votre expérience et analyser la performance du site. Vous pouvez accepter tous les cookies ou continuer avec les cookies essentiels uniquement.',
    cookie_essential: 'Essentiels seuls',
    cookie_accept: 'Tout accepter',
    tours_sort_rating: 'Mieux notés',
    tours_sort_low: 'Prix : du plus bas au plus haut',
    tours_sort_high: 'Prix : du plus haut au plus bas',
    tours_sort_popular: 'Les plus populaires',
    tours_no_results_title: 'Aucun tour trouvé',
    tours_no_results_desc: 'Essayez d’ajuster vos filtres ou recherchez une autre destination',
    tours_clear_filters: 'Effacer les filtres',
    tours_from: 'À partir de',
    tours_per_person: 'par personne',
    tourdetail_from: 'À partir de',
    tourdetail_per_adult: 'par adulte',
    tourdetail_select_date: 'Choisir une date',
    tourdetail_pick_date: 'Choisir une date',
    tourdetail_adults: 'Adultes',
    tourdetail_children: 'Enfants',
    tourdetail_full_name: 'Nom complet',
    tourdetail_email: 'E‑mail',
    tourdetail_phone_optional: 'Téléphone (optionnel)',
    tourdetail_special_optional: 'Demandes spéciales (optionnel)',
    tourdetail_total: 'Total',
    tourdetail_book_now: 'Réserver',
    account_profile_settings: 'Paramètres du profil',
    account_my_trips: 'Mes voyages',
    account_favorites: 'Favoris',
    account_profile_tab: 'Profil',
    account_trips_short: 'Voyages',
    account_favs_short: 'Favoris',
  }
};

export function t(key, locale) {
  const lang = (locale || 'en-US').split('-')[0];
  const bucket = MESSAGES[lang] || MESSAGES.en;
  return bucket[key] || MESSAGES.en[key] || key;
}
