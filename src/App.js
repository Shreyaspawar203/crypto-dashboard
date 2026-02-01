import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import * as ss from 'simple-statistics';

// --- SKELETON LOADER FOR INITIAL LOAD ---
const SkeletonCard = () => (
  <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl h-48">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-10 h-10 rounded-full animate-shimmer"></div>
      <div className="space-y-2">
        <div className="w-24 h-4 rounded animate-shimmer"></div>
        <div className="w-12 h-3 rounded animate-shimmer"></div>
      </div>
    </div>
    <div className="w-32 h-8 rounded animate-shimmer mb-4"></div>
    <div className="w-16 h-4 rounded animate-shimmer"></div>
  </div>
);

// --- COMPONENT: INTELLIGENCE CHART & DETAILED STATS ---
const CoinIntelligence = ({ coin }) => {
  const [chartData, setChartData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=7&interval=daily`
        );
        
        const formattedData = response.data.prices.map(price => ({
          date: new Date(price[0]).toLocaleDateString(),
          price: price[1]
        }));
        
        setChartData(formattedData);

        // AI Logic: Linear Regression Prediction
        const points = formattedData.map((d, i) => [i, d.price]);
        const regressionModel = ss.linearRegression(points);
        const nextDayIndex = formattedData.length;
        const predictedPrice = ss.linearRegressionLine(regressionModel)(nextDayIndex);
        setPrediction(predictedPrice.toFixed(2));

        setLoading(false);
      } catch (error) {
        console.error("Data error:", error);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [coin.id]);

  if (loading) return <div className="h-64 flex items-center justify-center text-slate-500 animate-pulse font-mono uppercase text-xs">Analyzing Market Intelligence...</div>;

  return (
    <div className="space-y-6">
      {/* AI FORECAST SECTION */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">AI Trend Forecast (24h)</p>
            <p className="text-white font-mono text-xl">${Number(prediction).toLocaleString()}</p>
          </div>
          <span className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded-full animate-pulse font-bold">ML Active</span>
        </div>
        <p className="text-[9px] text-slate-500 mt-2 italic font-sans">*Calculated via linear regression analysis of 7-day volatility patterns.</p>
      </div>

      {/* TREND CHART */}
      <div className="h-48 w-full bg-slate-800/30 rounded-xl p-2 border border-slate-700/30">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#3b82f6' }}
            />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ASSET DETAILS GRID */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-4 bg-slate-800/50 rounded-2xl flex flex-col justify-center border border-slate-700/30">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Market Cap Rank</span>
          <span className="text-white font-bold text-lg">#{coin.market_cap_rank}</span>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-2xl flex flex-col justify-center border border-slate-700/30">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Market Cap (USD)</span>
          <span className="text-white font-bold text-lg">${(coin.market_cap / 1e9).toFixed(2)}B</span>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-2xl flex flex-col justify-center border border-slate-700/30">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">24h High</span>
          <span className="text-emerald-400 font-mono font-bold">${coin.high_24h?.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-2xl flex flex-col justify-center border border-slate-700/30">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">24h Low</span>
          <span className="text-rose-400 font-mono font-bold">${coin.low_24h?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('cryptoWatchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1');
        setCoins(res.data);
        setTimeout(() => setLoading(false), 1200);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchData();
  }, []);

  const toggleFav = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  useEffect(() => localStorage.setItem('cryptoWatchlist', JSON.stringify(favorites)), [favorites]);

  const filtered = coins.filter(c => {
    const mSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase());
    return showWatchlistOnly ? (mSearch && favorites.includes(c.id)) : mSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-4xl font-black text-white italic tracking-tighter">CRYPTO<span className="text-blue-500">STATS</span></h1>
          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={() => setShowWatchlistOnly(!showWatchlistOnly)} className={`px-6 py-3 rounded-xl font-bold transition-all ${showWatchlistOnly ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-white border border-slate-700'}`}>
              {showWatchlistOnly ? '★ Watchlist' : '☆ Watchlist'}
            </button>
            <input type="text" placeholder="Search assets..." className="p-3 rounded-xl bg-slate-800 border border-slate-700 outline-none w-full md:w-64 focus:ring-2 focus:ring-blue-500 text-white" onChange={(e) => setSearch(e.target.value)} />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(coin => (
              <div key={coin.id} onClick={() => setSelectedCoin(coin)} className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer relative group shadow-lg hover:-translate-y-1">
                <button onClick={(e) => toggleFav(e, coin.id)} className="absolute top-4 right-4 text-2xl transition-transform active:scale-150">{favorites.includes(coin.id) ? '⭐' : '☆'}</button>
                <img src={coin.image} alt="" className="w-10 h-10 mb-4" />
                <h3 className="font-bold text-lg leading-none">{coin.name}</h3>
                <span className="text-slate-500 text-xs uppercase font-bold">{coin.symbol}</span>
                <p className="text-2xl font-mono text-white mt-3 mb-2">${coin.current_price.toLocaleString()}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded ${coin.price_change_percentage_24h > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {coin.price_change_percentage_24h > 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INTELLIGENCE MODAL */}
      {selectedCoin && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setSelectedCoin(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">✕</button>
            <div className="flex items-center gap-4 mb-8">
              <img src={selectedCoin.image} alt="" className="w-16 h-16 drop-shadow-xl" />
              <div>
                <h2 className="text-3xl font-bold text-white leading-none">{selectedCoin.name}</h2>
                <p className="text-blue-500 uppercase text-xs font-bold mt-2 tracking-widest">Market Analysis & Intelligence</p>
              </div>
            </div>

            {/* CHART & NEW DETAILED STATS SECTION */}
            <CoinIntelligence coin={selectedCoin} />

            <button onClick={() => setSelectedCoin(null)} className="w-full mt-10 bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
              Close Intelligence View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;