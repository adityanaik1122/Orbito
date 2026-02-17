#!/bin/bash

# Groq Setup Script
# This script helps you set up Groq AI for your Orbito backend

echo "🚀 Orbito - Groq AI Setup"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🔑 Next Steps:"
echo "1. Get your Groq API key from: https://console.groq.com/keys"
echo "2. Open backend/.env and add: GROQ_API_KEY=your_key_here"
echo "3. Run: npm start (or npm run dev for development)"
echo ""
echo "📚 For detailed instructions, see: GROQ_SETUP.md"
echo ""
