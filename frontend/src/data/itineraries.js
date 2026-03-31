export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop';

export const itineraries = [
  {
    id: 'london-royal-3d',
    title: 'Royal London & Palaces',
    city: 'London',
    country: 'United Kingdom',
    duration: '3 Days',
    rating: 4.8,
    reviews: 234,
    price: 'Free',
    tags: ['History', 'Royal', 'Sightseeing'],
    styles: ['luxury', 'culture'],
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600&auto=format&fit=crop',
    summary: 'Palaces, royal parks, and iconic landmarks with time for afternoon tea.',
    highlights: ['Buckingham Palace', 'Westminster Abbey', 'St. James’s Park', 'Thames Riverside'],
    days: [
      {
        day: 1,
        title: 'Westminster Icons',
        theme: 'Royal & Classic',
        items: [
          { time: '09:00', name: 'Westminster Abbey', note: 'Arrive early to beat crowds', duration: '1.5h' },
          { time: '11:00', name: 'Parliament & Big Ben', note: 'Photostop + river walk', duration: '1h' },
          { time: '13:00', name: 'Lunch at St. James’s Market', note: 'Local favorites', duration: '1h' },
          { time: '15:00', name: 'Buckingham Palace', note: 'Guards area & gates', duration: '1.5h' },
          { time: '17:00', name: 'St. James’s Park stroll', note: 'Golden hour views', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Royal Museums & Streets',
        theme: 'Culture & Heritage',
        items: [
          { time: '10:00', name: 'Victoria & Albert Museum', note: 'Top galleries', duration: '2h' },
          { time: '12:30', name: 'Kensington Gardens', note: 'Relaxed walk', duration: '1h' },
          { time: '14:00', name: 'Notting Hill', note: 'Colorful streets', duration: '1.5h' },
          { time: '16:00', name: 'Afternoon tea', note: 'Classic London treat', duration: '1.5h' }
        ]
      },
      {
        day: 3,
        title: 'Riverside & Skyline',
        theme: 'Views & Markets',
        items: [
          { time: '09:30', name: 'Tower of London (exterior)', note: 'Photo stop', duration: '45m' },
          { time: '10:30', name: 'Tower Bridge walkway', note: 'Great views', duration: '1h' },
          { time: '12:00', name: 'Borough Market', note: 'Street food lunch', duration: '1.5h' },
          { time: '14:30', name: 'Tate Modern', note: 'Free collection', duration: '1.5h' },
          { time: '17:00', name: 'South Bank sunset', note: 'Riverside stroll', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'paris-romance-3d',
    title: 'Romantic Paris Getaway',
    city: 'Paris',
    country: 'France',
    duration: '3 Days',
    rating: 4.9,
    reviews: 520,
    price: '€50',
    tags: ['Romance', 'Views', 'Food'],
    styles: ['luxury', 'foodie'],
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop',
    summary: 'Eiffel at sunset, Seine strolls, and café-hopping in Montmartre.',
    highlights: ['Eiffel Tower', 'Louvre', 'Montmartre', 'Seine Cruise'],
    days: [
      {
        day: 1,
        title: 'Seine & Eiffel',
        theme: 'Icons & River',
        items: [
          { time: '09:30', name: 'Trocadéro viewpoint', note: 'Best Eiffel photos', duration: '45m' },
          { time: '10:30', name: 'Eiffel Tower area', note: 'Picnic on Champ de Mars', duration: '2h' },
          { time: '13:00', name: 'Lunch in Rue Cler', note: 'Market street', duration: '1.5h' },
          { time: '17:30', name: 'Seine sunset cruise', note: 'Golden hour', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Louvre & Le Marais',
        theme: 'Art & Neighborhoods',
        items: [
          { time: '09:00', name: 'Louvre Museum', note: 'Focus on highlights', duration: '2.5h' },
          { time: '12:00', name: 'Tuileries Garden', note: 'Cafe break', duration: '1h' },
          { time: '14:00', name: 'Le Marais', note: 'Boutiques + pastries', duration: '2h' },
          { time: '17:00', name: 'Place des Vosges', note: 'Relax and people-watch', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Montmartre & Views',
        theme: 'Romantic Streets',
        items: [
          { time: '09:30', name: 'Sacré-Cœur', note: 'Panoramic city view', duration: '1h' },
          { time: '11:00', name: 'Montmartre walk', note: 'Artists’ square', duration: '2h' },
          { time: '13:30', name: 'Bistro lunch', note: 'Classic Parisian meal', duration: '1.5h' },
          { time: '16:00', name: 'Galeries Lafayette rooftop', note: 'Free skyline spot', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'amsterdam-canals-3d',
    title: 'Amsterdam Canals & Museums',
    city: 'Amsterdam',
    country: 'Netherlands',
    duration: '3 Days',
    rating: 4.8,
    reviews: 402,
    price: '€65',
    tags: ['Canals', 'Museums', 'Bike'],
    styles: ['budget', 'culture'],
    heroImage: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1600&auto=format&fit=crop',
    summary: 'Bike the canals, Van Gogh Museum, and a relaxed Jordaan evening.',
    highlights: ['Van Gogh Museum', 'Canal Cruise', 'Jordaan'],
    days: [
      {
        day: 1,
        title: 'Museum Quarter',
        theme: 'Art & Parks',
        items: [
          { time: '09:30', name: 'Van Gogh Museum', note: 'Pre-booked time slot', duration: '2h' },
          { time: '12:00', name: 'Vondelpark', note: 'Chill stroll', duration: '1h' },
          { time: '13:30', name: 'Food halls lunch', note: 'Local bites', duration: '1h' },
          { time: '15:00', name: 'Rijksmuseum exterior', note: 'Photo spot', duration: '45m' }
        ]
      },
      {
        day: 2,
        title: 'Canals & Jordaan',
        theme: 'Water & Neighborhoods',
        items: [
          { time: '10:00', name: 'Canal cruise', note: 'Classic highlights', duration: '1.5h' },
          { time: '12:00', name: 'Jordaan walk', note: 'Coffee + boutiques', duration: '2h' },
          { time: '15:00', name: 'Anne Frank House area', note: 'Exterior + memorial', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Local Amsterdam',
        theme: 'Markets & Bikes',
        items: [
          { time: '09:30', name: 'Albert Cuyp Market', note: 'Street food', duration: '1.5h' },
          { time: '12:00', name: 'Bike along Amstel', note: 'Scenic route', duration: '2h' },
          { time: '16:00', name: 'Brouwerij t IJ', note: 'Windmill brewery', duration: '1.5h' }
        ]
      }
    ]
  },
  {
    id: 'nyc-classics-4d',
    title: 'NYC Classics in 4 Days',
    city: 'New York',
    country: 'USA',
    duration: '4 Days',
    rating: 4.9,
    reviews: 350,
    price: '$50',
    tags: ['City', 'Views', 'Culture'],
    styles: ['culture', 'adventure'],
    heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1600&auto=format&fit=crop',
    summary: 'Central Park, Brooklyn Bridge, and skyline views from Top of the Rock.',
    highlights: ['Central Park', 'Brooklyn Bridge', 'Times Square'],
    days: [
      {
        day: 1,
        title: 'Midtown Icons',
        theme: 'Skylines',
        items: [
          { time: '09:00', name: 'Times Square', note: 'Early photos', duration: '45m' },
          { time: '10:00', name: 'Bryant Park & Library', note: 'Quick stop', duration: '1h' },
          { time: '12:00', name: 'Lunch in Koreatown', note: 'Great food', duration: '1h' },
          { time: '15:00', name: 'Top of the Rock', note: 'Skyline view', duration: '1.5h' }
        ]
      },
      {
        day: 2,
        title: 'Central Park & Museums',
        theme: 'Nature & Art',
        items: [
          { time: '09:30', name: 'Central Park loop', note: 'Strawberry Fields', duration: '2h' },
          { time: '12:00', name: 'Met Museum', note: 'Highlights only', duration: '2h' },
          { time: '15:30', name: 'Upper East Side cafe', note: 'Relax', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Downtown & Brooklyn',
        theme: 'Neighborhoods',
        items: [
          { time: '09:30', name: '9/11 Memorial', note: 'Quiet visit', duration: '1h' },
          { time: '11:00', name: 'Wall Street walk', note: 'Charging Bull', duration: '1h' },
          { time: '13:00', name: 'Brooklyn Bridge', note: 'Walk across', duration: '1.5h' },
          { time: '16:00', name: 'DUMBO', note: 'Waterfront views', duration: '1.5h' }
        ]
      },
      {
        day: 4,
        title: 'Local Food & Views',
        theme: 'Culture & Food',
        items: [
          { time: '10:00', name: 'Chelsea Market', note: 'Food crawl', duration: '1.5h' },
          { time: '12:00', name: 'High Line', note: 'Elevated park', duration: '1.5h' },
          { time: '15:00', name: 'Greenwich Village', note: 'Cafe stroll', duration: '2h' }
        ]
      }
    ]
  },
  {
    id: 'tokyo-modern-5d',
    title: 'Tokyo Traditional & Modern',
    city: 'Tokyo',
    country: 'Japan',
    duration: '5 Days',
    rating: 4.9,
    reviews: 560,
    price: '¥5000',
    tags: ['History', 'Technology', 'Food'],
    styles: ['foodie', 'adventure'],
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop',
    summary: 'Shrines in Asakusa, Shibuya nights, and the best ramen spots.',
    highlights: ['Senso-ji', 'Shibuya', 'Tsukiji Outer Market'],
    days: [
      {
        day: 1,
        title: 'Asakusa & Old Tokyo',
        theme: 'Temples',
        items: [
          { time: '09:00', name: 'Senso-ji Temple', note: 'Early calm vibes', duration: '1.5h' },
          { time: '11:00', name: 'Nakamise Street', note: 'Snacks + souvenirs', duration: '1h' },
          { time: '13:00', name: 'Sumida River walk', note: 'Skytree views', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Shibuya & Harajuku',
        theme: 'Modern Tokyo',
        items: [
          { time: '10:00', name: 'Meiji Shrine', note: 'Forest walk', duration: '1.5h' },
          { time: '12:00', name: 'Takeshita Street', note: 'Trendy snacks', duration: '1h' },
          { time: '16:00', name: 'Shibuya Crossing', note: 'Iconic photos', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Tsukiji & Ginza',
        theme: 'Food & Shopping',
        items: [
          { time: '09:00', name: 'Tsukiji Outer Market', note: 'Sushi breakfast', duration: '1.5h' },
          { time: '11:30', name: 'Ginza stroll', note: 'Luxury shops', duration: '2h' },
          { time: '15:00', name: 'Hibiya Park', note: 'Short break', duration: '1h' }
        ]
      },
      {
        day: 4,
        title: 'Odaiba Bay',
        theme: 'Views & Tech',
        items: [
          { time: '10:00', name: 'teamLab Planets', note: 'Book in advance', duration: '2h' },
          { time: '13:00', name: 'Odaiba seaside', note: 'Rainbow Bridge views', duration: '1.5h' },
          { time: '16:00', name: 'DiverCity Tokyo', note: 'Gundam statue', duration: '1h' }
        ]
      },
      {
        day: 5,
        title: 'Neighborhood Choice',
        theme: 'Flexible',
        items: [
          { time: '10:00', name: 'Choose: Shimokitazawa or Nakameguro', note: 'Cafes & canals', duration: '2.5h' },
          { time: '14:00', name: 'Ramen of the day', note: 'Local favorite', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'dubai-skyline-3d',
    title: 'Dubai Skyline & Desert Escape',
    city: 'Dubai',
    country: 'UAE',
    duration: '3 Days',
    rating: 4.7,
    reviews: 290,
    price: 'AED 220',
    tags: ['Desert', 'Luxury', 'Modern'],
    styles: ['luxury', 'adventure'],
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
    summary: 'Burj Khalifa views, dhow cruise, and a golden desert safari.',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Marina'],
    days: [
      {
        day: 1,
        title: 'Downtown Dubai',
        theme: 'Skyline',
        items: [
          { time: '10:00', name: 'Dubai Mall', note: 'Aquarium area', duration: '1.5h' },
          { time: '12:00', name: 'Burj Khalifa', note: 'At The Top tickets', duration: '1.5h' },
          { time: '18:30', name: 'Dubai Fountain show', note: 'Best at night', duration: '45m' }
        ]
      },
      {
        day: 2,
        title: 'Desert Adventure',
        theme: 'Adventure',
        items: [
          { time: '15:00', name: 'Desert safari pickup', note: 'Dune bashing', duration: '4h' },
          { time: '19:30', name: 'Camp dinner', note: 'Live shows', duration: '2h' }
        ]
      },
      {
        day: 3,
        title: 'Marina & Old Dubai',
        theme: 'Contrast',
        items: [
          { time: '10:00', name: 'Dubai Marina walk', note: 'Morning light', duration: '1.5h' },
          { time: '12:30', name: 'JBR beach time', note: 'Relax', duration: '2h' },
          { time: '16:30', name: 'Al Fahidi & Souks', note: 'Old Dubai feel', duration: '2h' }
        ]
      }
    ]
  },
  {
    id: 'rome-ancient-3d',
    title: 'Ancient Rome Exploration',
    city: 'Rome',
    country: 'Italy',
    duration: '3 Days',
    rating: 4.9,
    reviews: 650,
    price: '€60',
    tags: ['History', 'Ancient', 'Walking'],
    styles: ['culture', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1600&auto=format&fit=crop',
    summary: 'Colosseum, Vatican highlights, and a Trastevere food crawl.',
    highlights: ['Colosseum', 'Vatican Museums', 'Trastevere'],
    days: [
      {
        day: 1,
        title: 'Ancient Icons',
        theme: 'History',
        items: [
          { time: '09:00', name: 'Colosseum', note: 'Book early slot', duration: '2h' },
          { time: '11:30', name: 'Roman Forum', note: 'Walk the ruins', duration: '1.5h' },
          { time: '14:00', name: 'Piazza Venezia', note: 'Coffee break', duration: '45m' },
          { time: '16:00', name: 'Capitoline Hill', note: 'Sunset views', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Vatican & River',
        theme: 'Art & Faith',
        items: [
          { time: '09:00', name: 'Vatican Museums', note: 'Sistine Chapel', duration: '2.5h' },
          { time: '12:30', name: 'St. Peter’s Basilica', note: 'Dome optional', duration: '1.5h' },
          { time: '16:00', name: 'Tiber riverside', note: 'Golden hour stroll', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Neighborhood Rome',
        theme: 'Local',
        items: [
          { time: '10:00', name: 'Trastevere lanes', note: 'Morning walk', duration: '1.5h' },
          { time: '12:00', name: 'Campo de’ Fiori', note: 'Market lunch', duration: '1.5h' },
          { time: '16:00', name: 'Piazza Navona', note: 'Street artists', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'barcelona-gaudi-3d',
    title: 'Barcelona Gaudi & Beaches',
    city: 'Barcelona',
    country: 'Spain',
    duration: '3 Days',
    rating: 4.8,
    reviews: 410,
    price: '€75',
    tags: ['Architecture', 'Beach', 'Food'],
    styles: ['foodie', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1600&auto=format&fit=crop',
    summary: 'Sagrada Família, tapas nights, and a breezy Barceloneta day.',
    highlights: ['Sagrada Família', 'Park Güell', 'Barceloneta'],
    days: [
      {
        day: 1,
        title: 'Gaudí Highlights',
        theme: 'Architecture',
        items: [
          { time: '09:30', name: 'Sagrada Família', note: 'Pre-booked entry', duration: '2h' },
          { time: '12:00', name: 'Passeig de Gràcia', note: 'Casa Batlló exterior', duration: '1h' },
          { time: '14:00', name: 'Tapas lunch', note: 'Local favorites', duration: '1.5h' }
        ]
      },
      {
        day: 2,
        title: 'Park Güell & Old Town',
        theme: 'Culture',
        items: [
          { time: '10:00', name: 'Park Güell', note: 'Morning light', duration: '1.5h' },
          { time: '12:30', name: 'Gothic Quarter', note: 'Hidden lanes', duration: '2h' },
          { time: '16:00', name: 'Cathedral square', note: 'People-watching', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Sea & Sunset',
        theme: 'Relax',
        items: [
          { time: '10:00', name: 'Barceloneta beach', note: 'Chill morning', duration: '2h' },
          { time: '13:00', name: 'Seafood lunch', note: 'Beachfront', duration: '1.5h' },
          { time: '18:00', name: 'Bunkers del Carmel', note: 'Sunset views', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'prague-castles-2d',
    title: 'Prague Castles & Beer Halls',
    city: 'Prague',
    country: 'Czech Republic',
    duration: '2 Days',
    rating: 4.7,
    reviews: 221,
    price: '€40',
    tags: ['Castles', 'Nightlife', 'Views'],
    styles: ['budget', 'culture'],
    heroImage: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1600&auto=format&fit=crop',
    summary: 'Old Town charm, castle vistas, and a relaxed brewery evening.',
    highlights: ['Charles Bridge', 'Prague Castle', 'Old Town Square'],
    days: [
      {
        day: 1,
        title: 'Old Town',
        theme: 'History',
        items: [
          { time: '09:00', name: 'Old Town Square', note: 'Astronomical clock', duration: '1h' },
          { time: '10:30', name: 'Charles Bridge', note: 'Morning photos', duration: '1h' },
          { time: '12:00', name: 'Czech lunch', note: 'Local tavern', duration: '1.5h' },
          { time: '16:00', name: 'Beer hall', note: 'Evening vibes', duration: '2h' }
        ]
      },
      {
        day: 2,
        title: 'Castle District',
        theme: 'Views',
        items: [
          { time: '09:30', name: 'Prague Castle', note: 'Cathedral + grounds', duration: '2.5h' },
          { time: '13:00', name: 'Lesser Town stroll', note: 'Hidden streets', duration: '2h' },
          { time: '17:00', name: 'Letná viewpoint', note: 'Sunset', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'edinburgh-stories-2d',
    title: 'Edinburgh Old Town Stories',
    city: 'Edinburgh',
    country: 'United Kingdom',
    duration: '2 Days',
    rating: 4.8,
    reviews: 195,
    price: '£35',
    tags: ['History', 'Walking', 'Views'],
    styles: ['culture', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=1600&auto=format&fit=crop',
    summary: 'Royal Mile strolls, castle visit, and Arthur’s Seat sunrise.',
    highlights: ['Edinburgh Castle', 'Royal Mile', 'Arthur’s Seat'],
    days: [
      {
        day: 1,
        title: 'Royal Mile',
        theme: 'History',
        items: [
          { time: '09:30', name: 'Edinburgh Castle', note: 'Opening slot', duration: '2h' },
          { time: '12:00', name: 'Royal Mile walk', note: 'Street performers', duration: '2h' },
          { time: '16:00', name: 'Calton Hill', note: 'Sunset views', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Nature & Cafes',
        theme: 'Relax',
        items: [
          { time: '07:30', name: 'Arthur’s Seat', note: 'Sunrise hike', duration: '2h' },
          { time: '11:00', name: 'New Town cafes', note: 'Brunch', duration: '1.5h' },
          { time: '15:00', name: 'Dean Village', note: 'Quiet stroll', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'lisbon-sunsets-3d',
    title: 'Lisbon Sunsets & Tiles',
    city: 'Lisbon',
    country: 'Portugal',
    duration: '3 Days',
    rating: 4.7,
    reviews: 210,
    price: '€55',
    tags: ['Views', 'Food', 'Trams'],
    styles: ['budget', 'foodie'],
    heroImage: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=1600&auto=format&fit=crop',
    summary: 'Tram rides, pastel de nata, and riverfront sunsets.',
    highlights: ['Alfama', 'Belém', 'Miradouros'],
    days: [
      {
        day: 1,
        title: 'Alfama & Old Town',
        theme: 'Culture',
        items: [
          { time: '10:00', name: 'Alfama lanes', note: 'Walk + photos', duration: '2h' },
          { time: '12:30', name: 'Lunch in Alfama', note: 'Local tavern', duration: '1.5h' },
          { time: '17:00', name: 'Miradouro sunset', note: 'Best views', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Belém Day',
        theme: 'Icons',
        items: [
          { time: '10:00', name: 'Belém Tower', note: 'Early visit', duration: '1h' },
          { time: '11:30', name: 'Jerónimos Monastery', note: 'Quick highlights', duration: '1.5h' },
          { time: '13:30', name: 'Pasteis de Belém', note: 'Must-try', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Riverfront & Night',
        theme: 'Relax',
        items: [
          { time: '10:00', name: 'LX Factory', note: 'Shops + cafes', duration: '2h' },
          { time: '16:00', name: 'Time Out Market', note: 'Food hall', duration: '1.5h' },
          { time: '20:00', name: 'Fado night', note: 'Live music', duration: '2h' }
        ]
      }
    ]
  },
  {
    id: 'vienna-classic-2d',
    title: 'Vienna Classical & Coffee',
    city: 'Vienna',
    country: 'Austria',
    duration: '2 Days',
    rating: 4.8,
    reviews: 190,
    price: '€70',
    tags: ['Music', 'Cafes', 'Culture'],
    styles: ['culture', 'luxury'],
    heroImage: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=1600&auto=format&fit=crop',
    summary: 'Palaces, classical music, and legendary coffee houses.',
    highlights: ['Schönbrunn', 'Ringstrasse', 'Vienna State Opera'],
    days: [
      {
        day: 1,
        title: 'Imperial Vienna',
        theme: 'Royal',
        items: [
          { time: '09:30', name: 'Schönbrunn Palace', note: 'Grand tour', duration: '2.5h' },
          { time: '13:00', name: 'Palace gardens', note: 'Relaxed walk', duration: '1h' },
          { time: '17:00', name: 'Coffee house', note: 'Sacher torte', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Ringstrasse & Opera',
        theme: 'Culture',
        items: [
          { time: '10:00', name: 'Ringstrasse walk', note: 'City highlights', duration: '2h' },
          { time: '13:00', name: 'St. Stephen’s Cathedral', note: 'Quick visit', duration: '1h' },
          { time: '19:00', name: 'Opera or concert', note: 'Evening show', duration: '2h' }
        ]
      }
    ]
  },
  {
    id: 'athens-myths-2d',
    title: 'Athens Myths & Markets',
    city: 'Athens',
    country: 'Greece',
    duration: '2 Days',
    rating: 4.7,
    reviews: 180,
    price: '€45',
    tags: ['History', 'Markets', 'Views'],
    styles: ['culture', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1600&auto=format&fit=crop',
    summary: 'Acropolis mornings and lively market streets by night.',
    highlights: ['Acropolis', 'Plaka', 'Monastiraki'],
    days: [
      {
        day: 1,
        title: 'Acropolis Day',
        theme: 'Ancient',
        items: [
          { time: '08:30', name: 'Acropolis', note: 'Beat the heat', duration: '2h' },
          { time: '11:00', name: 'Acropolis Museum', note: 'Top exhibits', duration: '1.5h' },
          { time: '14:00', name: 'Plaka lunch', note: 'Classic tavern', duration: '1.5h' }
        ]
      },
      {
        day: 2,
        title: 'Markets & Views',
        theme: 'Local',
        items: [
          { time: '10:00', name: 'Monastiraki market', note: 'Souvenirs', duration: '1.5h' },
          { time: '12:30', name: 'Syntagma Square', note: 'Change of guard', duration: '1h' },
          { time: '18:00', name: 'Lycabettus Hill', note: 'Sunset view', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'istanbul-bosphorus-3d',
    title: 'Istanbul Bazaar & Bosphorus',
    city: 'Istanbul',
    country: 'Turkey',
    duration: '3 Days',
    rating: 4.8,
    reviews: 240,
    price: '₺350',
    tags: ['Bazaars', 'History', 'Views'],
    styles: ['foodie', 'culture'],
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1600&auto=format&fit=crop',
    summary: 'Mosques, markets, and a Bosphorus cruise at sunset.',
    highlights: ['Hagia Sophia', 'Grand Bazaar', 'Bosphorus'],
    days: [
      {
        day: 1,
        title: 'Historic Core',
        theme: 'Culture',
        items: [
          { time: '09:30', name: 'Hagia Sophia', note: 'Morning visit', duration: '1.5h' },
          { time: '11:30', name: 'Blue Mosque', note: 'Short walk', duration: '1h' },
          { time: '13:00', name: 'Sultanahmet lunch', note: 'Kebab classics', duration: '1.5h' }
        ]
      },
      {
        day: 2,
        title: 'Bazaars & Spice',
        theme: 'Markets',
        items: [
          { time: '10:00', name: 'Grand Bazaar', note: 'Shop + explore', duration: '2h' },
          { time: '12:30', name: 'Spice Bazaar', note: 'Tea + sweets', duration: '1.5h' },
          { time: '18:00', name: 'Bosphorus cruise', note: 'Golden hour', duration: '1.5h' }
        ]
      },
      {
        day: 3,
        title: 'Neighborhood Vibes',
        theme: 'Local',
        items: [
          { time: '10:00', name: 'Galata Tower', note: 'City views', duration: '1h' },
          { time: '12:00', name: 'Istiklal Street', note: 'Cafe crawl', duration: '2h' },
          { time: '16:00', name: 'Karaköy waterfront', note: 'Sunset stroll', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'marrakech-colors-2d',
    title: 'Marrakech Souks & Riads',
    city: 'Marrakech',
    country: 'Morocco',
    duration: '2 Days',
    rating: 4.7,
    reviews: 165,
    price: 'MAD 520',
    tags: ['Souks', 'Culture', 'Spice'],
    styles: ['budget', 'foodie'],
    heroImage: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1600&auto=format&fit=crop',
    summary: 'Vibrant souks, rooftop teas, and sunset in the medina.',
    highlights: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Souks'],
    days: [
      {
        day: 1,
        title: 'Medina Core',
        theme: 'Markets',
        items: [
          { time: '10:00', name: 'Jemaa el-Fnaa', note: 'Morning calm', duration: '1h' },
          { time: '11:00', name: 'Souks', note: 'Shopping + photos', duration: '2h' },
          { time: '18:00', name: 'Rooftop sunset', note: 'Mint tea', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Gardens & Food',
        theme: 'Relax',
        items: [
          { time: '10:00', name: 'Majorelle Garden', note: 'Early entry', duration: '1.5h' },
          { time: '12:30', name: 'Local lunch', note: 'Tagine time', duration: '1.5h' },
          { time: '16:00', name: 'Bahia Palace', note: 'Historic stop', duration: '1.5h' }
        ]
      }
    ]
  },
  {
    id: 'cape-town-coast-3d',
    title: 'Cape Town Coast & Peaks',
    city: 'Cape Town',
    country: 'South Africa',
    duration: '3 Days',
    rating: 4.8,
    reviews: 210,
    price: 'R 1200',
    tags: ['Coast', 'Views', 'Wine'],
    styles: ['adventure', 'foodie'],
    heroImage: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1600&auto=format&fit=crop',
    summary: 'Table Mountain views, penguins, and coastal drives.',
    highlights: ['Table Mountain', 'Camps Bay', 'Cape Point'],
    days: [
      {
        day: 1,
        title: 'City & Mountain',
        theme: 'Views',
        items: [
          { time: '09:00', name: 'Table Mountain', note: 'Cable car', duration: '2h' },
          { time: '12:00', name: 'V&A Waterfront', note: 'Lunch + shops', duration: '2h' },
          { time: '17:00', name: 'Camps Bay', note: 'Sunset', duration: '1.5h' }
        ]
      },
      {
        day: 2,
        title: 'Cape Peninsula',
        theme: 'Adventure',
        items: [
          { time: '09:00', name: 'Chapman’s Peak Drive', note: 'Scenic route', duration: '2h' },
          { time: '12:00', name: 'Cape Point', note: 'Hike + photos', duration: '2h' },
          { time: '15:00', name: 'Boulders Beach', note: 'Penguins', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Winelands',
        theme: 'Foodie',
        items: [
          { time: '10:00', name: 'Stellenbosch tasting', note: 'Wine estates', duration: '3h' },
          { time: '15:00', name: 'Franschhoek town', note: 'Cafe stroll', duration: '2h' }
        ]
      }
    ]
  },
  {
    id: 'sydney-harbour-3d',
    title: 'Sydney Harbour & Beaches',
    city: 'Sydney',
    country: 'Australia',
    duration: '3 Days',
    rating: 4.8,
    reviews: 230,
    price: 'A$120',
    tags: ['Harbour', 'Beaches', 'Views'],
    styles: ['adventure', 'luxury'],
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1600&auto=format&fit=crop',
    summary: 'Opera House icons, Bondi walks, and harbor sunsets.',
    highlights: ['Opera House', 'Harbour Bridge', 'Bondi'],
    days: [
      {
        day: 1,
        title: 'Harbour Icons',
        theme: 'Views',
        items: [
          { time: '09:00', name: 'Opera House', note: 'Guided tour', duration: '1.5h' },
          { time: '11:00', name: 'Circular Quay', note: 'Ferry views', duration: '1h' },
          { time: '16:00', name: 'Harbour sunset', note: 'Opera Bar', duration: '1.5h' }
        ]
      },
      {
        day: 2,
        title: 'Beach Day',
        theme: 'Relax',
        items: [
          { time: '09:30', name: 'Bondi to Coogee walk', note: 'Scenic trail', duration: '2h' },
          { time: '12:30', name: 'Bondi lunch', note: 'Cafe stop', duration: '1.5h' },
          { time: '16:00', name: 'Icebergs pool', note: 'Photo stop', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Culture & Markets',
        theme: 'Local',
        items: [
          { time: '10:00', name: 'The Rocks market', note: 'Weekend only', duration: '1.5h' },
          { time: '13:00', name: 'Art Gallery NSW', note: 'Highlights', duration: '2h' },
          { time: '17:00', name: 'Barangaroo stroll', note: 'City views', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'melbourne-lanes-2d',
    title: 'Melbourne Lanes & Coffee',
    city: 'Melbourne',
    country: 'Australia',
    duration: '2 Days',
    rating: 4.7,
    reviews: 160,
    price: 'A$90',
    tags: ['Street Art', 'Coffee', 'Culture'],
    styles: ['foodie', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?q=80&w=1600&auto=format&fit=crop',
    summary: 'Hidden lanes, art-filled alleys, and coffee perfection.',
    highlights: ['Hosier Lane', 'Queen Vic Market', 'Yarra River'],
    days: [
      {
        day: 1,
        title: 'Laneways',
        theme: 'Art',
        items: [
          { time: '09:30', name: 'Hosier Lane', note: 'Street art', duration: '1h' },
          { time: '11:00', name: 'CBD cafes', note: 'Coffee crawl', duration: '2h' },
          { time: '15:00', name: 'Royal Botanic Gardens', note: 'Relax', duration: '1.5h' }
        ]
      },
      {
        day: 2,
        title: 'Markets & River',
        theme: 'Local',
        items: [
          { time: '09:00', name: 'Queen Victoria Market', note: 'Breakfast + browse', duration: '2h' },
          { time: '13:00', name: 'Yarra River walk', note: 'Southbank', duration: '1.5h' },
          { time: '18:00', name: 'Rooftop bar', note: 'City lights', duration: '1.5h' }
        ]
      }
    ]
  },
  {
    id: 'auckland-harbour-2d',
    title: 'Auckland Harbours & Islands',
    city: 'Auckland',
    country: 'New Zealand',
    duration: '2 Days',
    rating: 4.6,
    reviews: 120,
    price: 'NZ$110',
    tags: ['Harbour', 'Islands', 'Views'],
    styles: ['adventure', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1600&auto=format&fit=crop',
    summary: 'Skyline viewpoints and ferry hops to nearby islands.',
    highlights: ['Sky Tower', 'Waiheke Island', 'Viaduct'],
    days: [
      {
        day: 1,
        title: 'City Views',
        theme: 'Views',
        items: [
          { time: '10:00', name: 'Sky Tower', note: 'Panorama', duration: '1.5h' },
          { time: '12:00', name: 'Viaduct Harbour', note: 'Lunch', duration: '1.5h' },
          { time: '16:00', name: 'Mount Eden', note: 'Sunset', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Island Day',
        theme: 'Adventure',
        items: [
          { time: '09:00', name: 'Ferry to Waiheke', note: 'Wine + beaches', duration: '6h' },
          { time: '18:00', name: 'Harbour stroll', note: 'Evening walk', duration: '1h' }
        ]
      }
    ]
  },
  {
    id: 'singapore-skyline-2d',
    title: 'Singapore Skyline & Gardens',
    city: 'Singapore',
    country: 'Singapore',
    duration: '2 Days',
    rating: 4.8,
    reviews: 260,
    price: 'S$90',
    tags: ['Skyline', 'Gardens', 'Food'],
    styles: ['foodie', 'luxury'],
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop',
    summary: 'Skyline lights, hawker centers, and futuristic gardens.',
    highlights: ['Marina Bay', 'Gardens by the Bay', 'Hawker Food'],
    days: [
      {
        day: 1,
        title: 'Marina Bay',
        theme: 'Modern',
        items: [
          { time: '10:00', name: 'Merlion Park', note: 'Photo stop', duration: '45m' },
          { time: '12:00', name: 'Marina Bay Sands', note: 'Shopping + views', duration: '2h' },
          { time: '19:00', name: 'Light show', note: 'Evening spectacle', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Gardens & Food',
        theme: 'Foodie',
        items: [
          { time: '10:00', name: 'Gardens by the Bay', note: 'Cloud Forest', duration: '2h' },
          { time: '13:00', name: 'Satay by the Bay', note: 'Lunch', duration: '1.5h' },
          { time: '18:00', name: 'Chinatown hawkers', note: 'Dinner', duration: '2h' }
        ]
      }
    ]
  },
  {
    id: 'bangkok-temples-3d',
    title: 'Bangkok Temples & Street Food',
    city: 'Bangkok',
    country: 'Thailand',
    duration: '3 Days',
    rating: 4.7,
    reviews: 300,
    price: '฿1200',
    tags: ['Temples', 'Street Food', 'Markets'],
    styles: ['foodie', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1600&auto=format&fit=crop',
    summary: 'Golden temples, floating markets, and the best street eats.',
    highlights: ['Wat Arun', 'Chatuchak', 'Chinatown'],
    days: [
      {
        day: 1,
        title: 'Riverside Temples',
        theme: 'Culture',
        items: [
          { time: '09:00', name: 'Wat Pho', note: 'Reclining Buddha', duration: '1.5h' },
          { time: '11:00', name: 'Wat Arun', note: 'River crossing', duration: '1.5h' },
          { time: '18:00', name: 'Asiatique', note: 'Night market', duration: '2h' }
        ]
      },
      {
        day: 2,
        title: 'Markets',
        theme: 'Local',
        items: [
          { time: '09:00', name: 'Floating market', note: 'Morning tour', duration: '3h' },
          { time: '14:00', name: 'Chatuchak', note: 'Weekend only', duration: '3h' }
        ]
      },
      {
        day: 3,
        title: 'Food & Nightlife',
        theme: 'Foodie',
        items: [
          { time: '11:00', name: 'Chinatown walk', note: 'Street food', duration: '2h' },
          { time: '18:00', name: 'Rooftop bar', note: 'City views', duration: '1.5h' }
        ]
      }
    ]
  },
  {
    id: 'bali-beach-3d',
    title: 'Bali Beaches & Temples',
    city: 'Bali',
    country: 'Indonesia',
    duration: '3 Days',
    rating: 4.8,
    reviews: 340,
    price: 'IDR 1.2M',
    tags: ['Beaches', 'Temples', 'Relax'],
    styles: ['adventure', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1600&auto=format&fit=crop',
    summary: 'Sunrise temples, coastal sunsets, and jungle vibes.',
    highlights: ['Uluwatu', 'Ubud', 'Rice Terraces'],
    days: [
      {
        day: 1,
        title: 'Uluwatu Coast',
        theme: 'Views',
        items: [
          { time: '10:00', name: 'Uluwatu Temple', note: 'Cliff views', duration: '2h' },
          { time: '15:00', name: 'Padang Padang Beach', note: 'Swim time', duration: '2h' },
          { time: '18:00', name: 'Kecak dance', note: 'Sunset show', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Ubud Day',
        theme: 'Nature',
        items: [
          { time: '09:00', name: 'Tegallalang Rice Terraces', note: 'Photo stop', duration: '1.5h' },
          { time: '11:30', name: 'Ubud market', note: 'Local crafts', duration: '1.5h' },
          { time: '15:00', name: 'Sacred Monkey Forest', note: 'Afternoon visit', duration: '1.5h' }
        ]
      },
      {
        day: 3,
        title: 'Relax & Spa',
        theme: 'Wellness',
        items: [
          { time: '10:00', name: 'Balinese massage', note: 'Spa time', duration: '2h' },
          { time: '13:00', name: 'Beach club', note: 'Chill afternoon', duration: '3h' }
        ]
      }
    ]
  },
  {
    id: 'seoul-modern-3d',
    title: 'Seoul Modern & Traditional',
    city: 'Seoul',
    country: 'South Korea',
    duration: '3 Days',
    rating: 4.7,
    reviews: 230,
    price: '₩140,000',
    tags: ['Palaces', 'Markets', 'Food'],
    styles: ['foodie', 'culture'],
    heroImage: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1600&auto=format&fit=crop',
    summary: 'Royal palaces by day and neon markets by night.',
    highlights: ['Gyeongbokgung', 'Myeongdong', 'Bukchon Hanok'],
    days: [
      {
        day: 1,
        title: 'Royal Seoul',
        theme: 'Culture',
        items: [
          { time: '10:00', name: 'Gyeongbokgung Palace', note: 'Guard change', duration: '2h' },
          { time: '12:30', name: 'Bukchon Hanok Village', note: 'Historic lanes', duration: '1.5h' },
          { time: '16:00', name: 'Insadong', note: 'Tea houses', duration: '1.5h' }
        ]
      },
      {
        day: 2,
        title: 'Markets & Street Food',
        theme: 'Foodie',
        items: [
          { time: '10:00', name: 'Gwangjang Market', note: 'Bindaetteok', duration: '2h' },
          { time: '14:00', name: 'Myeongdong', note: 'Shopping + snacks', duration: '3h' }
        ]
      },
      {
        day: 3,
        title: 'Modern Seoul',
        theme: 'City',
        items: [
          { time: '10:00', name: 'COEX & Starfield', note: 'Library stop', duration: '2h' },
          { time: '18:00', name: 'N Seoul Tower', note: 'Night views', duration: '1.5h' }
        ]
      }
    ]
  },
  {
    id: 'hongkong-skyline-2d',
    title: 'Hong Kong Skyline & Food',
    city: 'Hong Kong',
    country: 'China',
    duration: '2 Days',
    rating: 4.7,
    reviews: 210,
    price: 'HK$500',
    tags: ['Skyline', 'Food', 'Markets'],
    styles: ['foodie', 'adventure'],
    heroImage: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=1600&auto=format&fit=crop',
    summary: 'Peak viewpoints, neon nights, and iconic dim sum.',
    highlights: ['Victoria Peak', 'Star Ferry', 'Temple Street'],
    days: [
      {
        day: 1,
        title: 'Harbour & Peak',
        theme: 'Views',
        items: [
          { time: '10:00', name: 'Star Ferry', note: 'Classic ride', duration: '1h' },
          { time: '12:00', name: 'Central & SoHo', note: 'Lunch', duration: '2h' },
          { time: '17:00', name: 'Victoria Peak', note: 'Sunset', duration: '2h' }
        ]
      },
      {
        day: 2,
        title: 'Markets & Food',
        theme: 'Foodie',
        items: [
          { time: '10:00', name: 'Mong Kok', note: 'Markets', duration: '2h' },
          { time: '13:00', name: 'Dim sum lunch', note: 'Local favorite', duration: '1.5h' },
          { time: '19:00', name: 'Temple Street', note: 'Night market', duration: '2h' }
        ]
      }
    ]
  },
  {
    id: 'mexico-city-flavors-3d',
    title: 'Mexico City Flavors & Art',
    city: 'Mexico City',
    country: 'Mexico',
    duration: '3 Days',
    rating: 4.7,
    reviews: 190,
    price: 'MX$900',
    tags: ['Food', 'Art', 'Markets'],
    styles: ['foodie', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=1600&auto=format&fit=crop',
    summary: 'Tacos, murals, and leafy parks with a local vibe.',
    highlights: ['Centro Histórico', 'Coyoacán', 'Chapultepec'],
    days: [
      {
        day: 1,
        title: 'Historic Center',
        theme: 'Culture',
        items: [
          { time: '09:00', name: 'Zócalo & Cathedral', note: 'Morning walk', duration: '1.5h' },
          { time: '11:00', name: 'Templo Mayor', note: 'Museum visit', duration: '1.5h' },
          { time: '14:00', name: 'Street tacos', note: 'Local spot', duration: '1h' }
        ]
      },
      {
        day: 2,
        title: 'Coyoacán',
        theme: 'Art',
        items: [
          { time: '10:00', name: 'Frida Kahlo Museum', note: 'Book ahead', duration: '1.5h' },
          { time: '12:00', name: 'Coyoacán plaza', note: 'Market snacks', duration: '1.5h' },
          { time: '16:00', name: 'Xochimilco', note: 'Boat ride', duration: '2h' }
        ]
      },
      {
        day: 3,
        title: 'Parks & Views',
        theme: 'Relax',
        items: [
          { time: '10:00', name: 'Chapultepec Park', note: 'Museum + lake', duration: '2.5h' },
          { time: '14:00', name: 'Polanco lunch', note: 'Trendy cafes', duration: '1.5h' }
        ]
      }
    ]
  },
  {
    id: 'rio-beach-3d',
    title: 'Rio Beaches & Peaks',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    duration: '3 Days',
    rating: 4.7,
    reviews: 175,
    price: 'R$350',
    tags: ['Beaches', 'Views', 'Music'],
    styles: ['adventure', 'budget'],
    heroImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1600&auto=format&fit=crop',
    summary: 'Sunrise views, samba nights, and iconic beaches.',
    highlights: ['Christ the Redeemer', 'Copacabana', 'Sugarloaf'],
    days: [
      {
        day: 1,
        title: 'Iconic Rio',
        theme: 'Views',
        items: [
          { time: '09:00', name: 'Christ the Redeemer', note: 'Morning slot', duration: '2h' },
          { time: '12:00', name: 'Santa Teresa', note: 'Art + cafes', duration: '2h' },
          { time: '18:00', name: 'Samba night', note: 'Live music', duration: '2h' }
        ]
      },
      {
        day: 2,
        title: 'Beaches Day',
        theme: 'Relax',
        items: [
          { time: '10:00', name: 'Copacabana', note: 'Morning swim', duration: '2h' },
          { time: '13:00', name: 'Ipanema', note: 'Beach lunch', duration: '2h' },
          { time: '17:00', name: 'Arpoador sunset', note: 'Classic view', duration: '1h' }
        ]
      },
      {
        day: 3,
        title: 'Sugarloaf & Bay',
        theme: 'Adventure',
        items: [
          { time: '10:00', name: 'Sugarloaf cable car', note: 'City views', duration: '2h' },
          { time: '13:00', name: 'Urca neighborhood', note: 'Lunch', duration: '1.5h' },
          { time: '16:00', name: 'Botanical Garden', note: 'Relax', duration: '1.5h' }
        ]
      }
    ]
  }
];

export const getItineraryById = (id) => itineraries.find((itinerary) => itinerary.id === id);

export const getItinerariesByCity = (city) => {
  if (!city || city === 'All') {
    return itineraries;
  }
  return itineraries.filter((itinerary) => itinerary.city === city);
};
