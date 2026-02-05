export const attractions = [
  // London
  { 
    id: 'big-ben', 
    title: 'Big Ben & Palace of Westminster', 
    location: 'London', 
    coordinates: [51.5007, -0.1246],
    rating: 4.9, 
    reviews: 4520, 
    price: 'Free', 
    tags: ['Landmark', 'History'], 
    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1000&auto=format&fit=crop', 
    description: 'Iconic clock tower and parliament building.',
    estTime: '1-2 hours',
    openingHours: '24/7 (External)'
  },
  { 
    id: 'tower-of-london', 
    title: 'Tower of London', 
    location: 'London', 
    coordinates: [51.5081, -0.0759],
    rating: 4.7, 
    reviews: 3240, 
    price: '£33.60', 
    tags: ['History', 'Royal'], 
    image: 'https://images.unsplash.com/photo-1532203521082-25a27f28154c?q=80&w=1000&auto=format&fit=crop', 
    description: 'Historic castle and home of the Crown Jewels.',
    estTime: '3-4 hours',
    openingHours: '09:00 - 17:30'
  },
  { 
    id: 'british-museum', 
    title: 'The British Museum', 
    location: 'London', 
    coordinates: [51.5194, -0.1270],
    rating: 4.8, 
    reviews: 5100, 
    price: 'Free', 
    tags: ['Museum', 'History'], 
    image: 'https://images.unsplash.com/photo-1564603956692-0b8159670863?q=80&w=1000&auto=format&fit=crop', 
    description: 'Dedicated to human history, art and culture.',
    estTime: '3-5 hours',
    openingHours: '10:00 - 17:00'
  },
  // Paris
  {
    id: 'eiffel-tower',
    title: 'Eiffel Tower',
    location: 'Paris',
    coordinates: [48.8584, 2.2945],
    rating: 4.8, 
    reviews: 5000,
    price: '€26.00',
    tags: ['Landmark', 'Views'],
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce7859?q=80&w=1000&auto=format&fit=crop',
    description: 'The symbol of Paris and France.',
    estTime: '2-3 hours',
    openingHours: '09:30 - 22:45'
  },
  {
    id: 'louvre',
    title: 'Louvre Museum',
    location: 'Paris',
    coordinates: [48.8606, 2.3376],
    rating: 4.7,
    reviews: 4500,
    price: '€17.00',
    tags: ['Museum', 'Art'],
    image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?q=80&w=1000&auto=format&fit=crop',
    description: 'World\'s largest art museum.',
    estTime: '3-5 hours',
    openingHours: '09:00 - 18:00'
  },
  // Amsterdam
  {
    id: 'rijksmuseum',
    title: 'Rijksmuseum',
    location: 'Amsterdam',
    coordinates: [52.3600, 4.8852],
    rating: 4.8,
    reviews: 3200,
    price: '€22.50',
    tags: ['Museum', 'Art'],
    image: 'https://images.unsplash.com/photo-1583344669888-c89e27c1524e?q=80&w=1000&auto=format&fit=crop',
    description: 'Dutch national museum dedicated to arts and history.',
    estTime: '2-4 hours',
    openingHours: '09:00 - 17:00'
  },
  // Dubai
  {
    id: 'burj-khalifa',
    title: 'Burj Khalifa',
    location: 'Dubai',
    coordinates: [25.1972, 55.2744],
    rating: 4.9,
    reviews: 4100,
    price: 'AED 169',
    tags: ['Landmark', 'Views'],
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=1000&auto=format&fit=crop',
    description: 'The world\'s tallest building.',
    estTime: '2-3 hours',
    openingHours: '08:30 - 23:00'
  },
  // Prague
  {
    id: 'charles-bridge',
    title: 'Charles Bridge',
    location: 'Prague',
    coordinates: [50.0865, 14.4114],
    rating: 4.8,
    reviews: 3800,
    price: 'Free',
    tags: ['Landmark', 'History'],
    image: 'https://images.unsplash.com/photo-1541849546-216549242520?q=80&w=1000&auto=format&fit=crop',
    description: 'Historic bridge crossing the Vltava river.',
    estTime: '0.5-1 hour',
    openingHours: '24/7'
  },
  // Edinburgh
  { 
    id: 'edinburgh-castle', 
    title: 'Edinburgh Castle', 
    location: 'Edinburgh', 
    coordinates: [55.9486, -3.1999],
    rating: 4.8, 
    reviews: 3500, 
    price: '£19.50', 
    tags: ['Castle', 'History'], 
    image: 'https://images.unsplash.com/photo-1585012521990-21b9268d8934?q=80&w=1000&auto=format&fit=crop', 
    description: 'Historic fortress dominating the skyline of Edinburgh.',
    estTime: '2-3 hours',
    openingHours: '09:30 - 17:00'
  },
  // Barcelona
  {
    id: 'sagrada-familia',
    title: 'La Sagrada Familia',
    location: 'Barcelona',
    coordinates: [41.4036, 2.1744],
    rating: 4.9,
    reviews: 5200,
    price: '€26.00',
    tags: ['Landmark', 'Architecture'],
    image: 'https://images.unsplash.com/photo-1558642084-fd07fae5282e?q=80&w=1000&auto=format&fit=crop',
    description: 'Famous unfinished Roman Catholic minor basilica.',
    estTime: '1-2 hours',
    openingHours: '09:00 - 18:00'
  },
  // Rome
  {
    id: 'colosseum',
    title: 'Colosseum',
    location: 'Rome',
    coordinates: [41.8902, 12.4922],
    rating: 4.8,
    reviews: 6000,
    price: '€16.00',
    tags: ['History', 'Landmark'],
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop',
    description: 'The largest ancient amphitheatre ever built.',
    estTime: '2-3 hours',
    openingHours: '08:30 - 19:00'
  },
  // New York
  {
    id: 'statue-of-liberty',
    title: 'Statue of Liberty',
    location: 'New York',
    coordinates: [40.6892, -74.0445],
    rating: 4.8,
    reviews: 7000,
    price: '$25.00',
    tags: ['Landmark', 'History'],
    image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?q=80&w=1000&auto=format&fit=crop',
    description: 'A colossal neoclassical sculpture on Liberty Island.',
    estTime: '3-4 hours',
    openingHours: '08:30 - 16:00'
  },
  {
    id: 'central-park',
    title: 'Central Park',
    location: 'New York',
    coordinates: [40.7851, -73.9683],
    rating: 4.9,
    reviews: 8200,
    price: 'Free',
    tags: ['Nature', 'Relax'],
    image: 'https://images.unsplash.com/photo-1512413158498-5c4d293d9b09?q=80&w=1000&auto=format&fit=crop',
    description: 'Urban park in New York City.',
    estTime: '1-3 hours',
    openingHours: '06:00 - 01:00'
  },
  // Tokyo
  {
    id: 'senso-ji',
    title: 'Senso-ji Temple',
    location: 'Tokyo',
    coordinates: [35.7148, 139.7967],
    rating: 4.8,
    reviews: 6500,
    price: 'Free',
    tags: ['Culture', 'History'],
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1000&auto=format&fit=crop',
    description: 'Ancient Buddhist temple located in Asakusa.',
    estTime: '1-2 hours',
    openingHours: '06:00 - 17:00'
  },
  {
    id: 'tokyo-tower',
    title: 'Tokyo Tower',
    location: 'Tokyo',
    coordinates: [35.6586, 139.7454],
    rating: 4.6,
    reviews: 4200,
    price: '¥1,200',
    tags: ['Landmark', 'Views'],
    image: 'https://images.unsplash.com/photo-1532326264639-6643666f8349?q=80&w=1000&auto=format&fit=crop',
    description: 'Communications and observation tower in the Shiba-koen district.',
    estTime: '1-2 hours',
    openingHours: '09:00 - 23:00'
  }
];

export const attractionTypes = [
  { name: 'History', icon: 'Landmark' },
  { name: 'Food', icon: 'Utensils' },
  { name: 'Culture', icon: 'Palette' },
  { name: 'Museums', icon: 'GalleryVertical' },
  { name: 'Views', icon: 'Mountain' },
  { name: 'Shopping', icon: 'ShoppingBag' }
];