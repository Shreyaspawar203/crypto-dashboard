CryptoInsight Dashboard
A professional-grade, real-time Cryptocurrency tracking application built with React and Tailwind CSS. This project fetches live market data from the CoinGecko API to provide users with up-to-date pricing, market trends, and detailed asset analytics.

🚀 Live Demo
[Insert Your Vercel/Netlify Link Here]

✨ Features
Real-time Market Data: Fetches the top 50 cryptocurrencies by market capitalization dynamically.

Instant Search Filtering: Optimized client-side search to find assets by name or symbol without additional API overhead.

Dynamic Asset Details: Integrated a custom modal system to view detailed metrics (High/Low 24h, Volume, Market Rank).

Responsive UI/UX: A fully mobile-responsive "Glassmorphism" design using Tailwind CSS.

Visual Indicators: Color-coded price movement indicators (Green for growth, Red for decline).

🛠️ Tech Stack & Architecture
Category               Technology                 Purpose
Frontend               React.js                   Component-based UI architecture
Styling                Tailwind CSS v3            Utility-first responsive design
API Client             Axios                      Handling asynchronous HTTP requests
State Management       React Hooks                Managing UI state (useState) and side effects 
Data Source            CoinGecko API              Real-time financial market data

📦 Installation & Setup
Clone the repository:

Bash

git clone https://github.com/yourusername/crypto-dashboard.git
Install dependencies:

Bash

npm install
Start the development server:

Bash

npm start
The app will run at http://localhost:3000.

🧠 CS Logic & Implementation Details
As part of a 3rd-year CS assignment, this project implements several core concepts:

Asynchronous Programming: Utilizes async/await patterns to handle non-blocking API calls.

Conditional Rendering: Implements logical operators to manage "Loading" states and "Modal" visibility.

Array Methods: Uses .filter() and .map() for efficient data manipulation and rendering.

Data Normalization: Employs .toLocaleString() to handle international currency formatting.