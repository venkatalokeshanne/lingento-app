# Lingento - Language Learning App

A modern vocabulary learning application built with Next.js, featuring spaced repetition algorithms and AI-powered pronunciation.

## Features

- 🧠 **Spaced Repetition Learning**: Scientifically-proven method for effective vocabulary retention
- 🎯 **Smart Flashcards**: Adaptive learning system that adjusts to your progress
- 🎙️ **AI Pronunciation**: AWS Polly integration for natural pronunciation
- 📊 **Progress Tracking**: Comprehensive dashboard with learning analytics
- 🌙 **Dark Mode**: Modern UI with light and dark themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

Before running the application, you'll need:

- Node.js 18+ installed
- Firebase project set up
- AWS account with Polly service access

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables in `.env.local`:**
   - Add your Firebase project credentials
   - Add your AWS credentials for Polly service
   - See `SECURITY.md` for detailed setup instructions

⚠️ **Important**: Never commit your `.env.local` file to version control!

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables** (see Environment Setup above)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/context` - React context providers (Auth, Theme)
- `/src/services` - Business logic and external service integrations
- `/src/utils` - Utility functions and helpers

## Security

This project uses environment variables to protect sensitive information. See `SECURITY.md` for:
- Environment variable setup instructions
- Security best practices
- Production deployment guidelines

## Technologies Used

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Text-to-Speech**: AWS Polly
- **Animations**: Framer Motion
- **State Management**: React Context API

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all secrets are in environment variables
5. Submit a pull request

## Deploy on Vercel

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
#   l i n g e n t o - a p p 
 
 