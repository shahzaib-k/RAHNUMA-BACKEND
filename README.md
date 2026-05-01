# Rahnuma Backend

This is the backend service for the Rahnuma platform. It is built with Node.js and Express, handles API endpoints, database operations using MongoDB, and integrates deeply with the Google Gemini API for AI-assisted features (like the Resume Generator).

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB Database or Atlas Cluster
- Google Gemini API Key

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the `./backend` directory. Use the provided `.env.example` as a template:
   ```bash
   cp .env.example .env
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## Development

The backend typically runs concurrently with the frontend process. Ensure your `.env` is properly populated before testing the AI routes or Database connectivity.
