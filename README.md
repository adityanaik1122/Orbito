# Orbito - AI-Powered Travel Itinerary Planner

A modern travel planning platform that uses AI to create personalized itineraries with bookable tours, real prices, and instant confirmation.

## 🚀 Features

- **AI Itinerary Generation** - Describe your trip in plain English, AI creates a detailed day-by-day plan
- **Tour Booking Integration** - Browse and book tours from multiple providers (Premium Tours, Viator, GetYourGuide)
- **Advanced Filtering** - Filter tours by price, duration, and category
- **Interactive Maps** - Visualize your itinerary on an interactive map
- **PDF Export** - Download your itinerary as a multi-page PDF
- **User Authentication** - Secure login with Supabase Auth
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS + Radix UI components
- React Router for navigation
- Leaflet/Mapbox for maps
- html2canvas + jsPDF for PDF export

### Backend
- Node.js + Express
- Supabase (PostgreSQL + Auth)
- Groq AI for itinerary generation
- RESTful API architecture

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Groq API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
node server.js
```

Backend runs on http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Frontend runs on http://localhost:3000

## 🔑 Environment Variables

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

## 📚 Documentation

Detailed documentation is available in the `/docs` folder:

- [Tour Filtering System](docs/TOUR_FILTERING_SYSTEM.md)
- [PDF Export Fix](docs/PDF_EXPORT_FIX.md)
- [Database Setup](docs/SUPABASE_SETUP.md)
- [AI Integration](docs/GROQ_SETUP.md)
- [Testing Guide](docs/TESTING_TOUR_FILTERS.md)

[View all documentation →](docs/README.md)

## 🚦 Quick Start

1. Clone the repository
2. Set up backend and frontend (see Installation above)
3. Create a Supabase project and run the SQL migrations
4. Get a Groq API key from https://console.groq.com
5. Start both servers
6. Visit http://localhost:3000

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
node server.js
```

### Test the AI Assistant
1. Go to http://localhost:3000/plan
2. Type: "5 days in London with museums and food tours"
3. AI will generate a detailed itinerary

## 📱 Features Overview

### AI Itinerary Builder
- Natural language input
- Automatic destination extraction
- Date range parsing
- Activity suggestions based on preferences

### Tour Marketplace
- Browse tours from multiple providers
- Advanced filtering (price, duration, category)
- Real-time availability
- Instant booking confirmation

### Itinerary Management
- Save and edit itineraries
- Share with friends
- Export to PDF
- Print-friendly view

## 🔐 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS)
- JWT authentication
- HTTPS in production
- API rate limiting

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Your choice)
- Railway
- Render
- Heroku
- AWS/GCP/Azure

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Groq for AI capabilities
- Supabase for backend infrastructure
- Radix UI for accessible components
- Tailwind CSS for styling

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@orbitotrip.com
- Website: https://www.orbitotrip.com

---

Built with ❤️ by the Orbito Team
