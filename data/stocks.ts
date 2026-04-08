import type { Stock } from '@/types';
import { MAX_PRICE_HISTORY } from '@/lib/constants';

function makeHistory(basePrice: number, count: number) {
  const history = [];
  let price = basePrice;
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    const change = price * (Math.random() * 0.02 - 0.01);
    const open = price;
    price = Math.max(price + change, basePrice * 0.5);
    const high = Math.max(open, price) * (1 + Math.random() * 0.005);
    const low = Math.min(open, price) * (1 - Math.random() * 0.005);
    history.push({
      timestamp: now - i * 2000,
      price,
      open,
      high,
      low,
      close: price,
      volume: Math.floor(Math.random() * 1_000_000 + 500_000),
    });
  }
  return history;
}

export const SEED_STOCKS: Stock[] = [
  // Technology
  {
    ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology',
    currentPrice: 178.50, openPrice: 177.20, previousClose: 177.20,
    priceHistory: makeHistory(178.50, MAX_PRICE_HISTORY),
    volatility: 0.012, trend: 0.0002,
    volume: 0, marketCap: '$2.8T',
    initialPrice: 178.50,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
  },
  {
    ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology',
    currentPrice: 375.00, openPrice: 373.50, previousClose: 373.50,
    priceHistory: makeHistory(375.00, MAX_PRICE_HISTORY),
    volatility: 0.011, trend: 0.0003,
    volume: 0, marketCap: '$2.8T',
    initialPrice: 375.00,
    description: 'Microsoft develops and supports software, services, devices, and solutions across productivity, cloud, and gaming.',
  },
  {
    ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology',
    currentPrice: 140.20, openPrice: 139.80, previousClose: 139.80,
    priceHistory: makeHistory(140.20, MAX_PRICE_HISTORY),
    volatility: 0.013, trend: 0.0002,
    volume: 0, marketCap: '$1.75T',
    initialPrice: 140.20,
    description: 'Alphabet is a multinational technology conglomerate holding company and parent of Google.',
  },
  {
    ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology',
    currentPrice: 495.00, openPrice: 490.00, previousClose: 490.00,
    priceHistory: makeHistory(495.00, MAX_PRICE_HISTORY),
    volatility: 0.028, trend: 0.0008,
    volume: 0, marketCap: '$1.2T',
    initialPrice: 495.00,
    description: 'NVIDIA designs GPUs for gaming and professional markets, and SoCs for mobile and automotive applications. Leader in AI computing.',
  },
  {
    ticker: 'META', name: 'Meta Platforms', sector: 'Technology',
    currentPrice: 480.00, openPrice: 477.50, previousClose: 477.50,
    priceHistory: makeHistory(480.00, MAX_PRICE_HISTORY),
    volatility: 0.018, trend: 0.0004,
    volume: 0, marketCap: '$1.2T',
    initialPrice: 480.00,
    description: 'Meta operates social media platforms including Facebook, Instagram, and WhatsApp, and invests in the metaverse.',
  },
  // Finance
  {
    ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Finance',
    currentPrice: 195.00, openPrice: 194.00, previousClose: 194.00,
    priceHistory: makeHistory(195.00, MAX_PRICE_HISTORY),
    volatility: 0.010, trend: 0.0001,
    volume: 0, marketCap: '$561B',
    initialPrice: 195.00,
    description: 'JPMorgan Chase is a global financial services firm and the largest U.S. bank by assets.',
  },
  {
    ticker: 'BAC', name: 'Bank of America', sector: 'Finance',
    currentPrice: 35.50, openPrice: 35.20, previousClose: 35.20,
    priceHistory: makeHistory(35.50, MAX_PRICE_HISTORY),
    volatility: 0.012, trend: 0.0001,
    volume: 0, marketCap: '$275B',
    initialPrice: 35.50,
    description: 'Bank of America provides banking, investment, asset management, and other financial and risk management products.',
  },
  {
    ticker: 'GS', name: 'Goldman Sachs', sector: 'Finance',
    currentPrice: 430.00, openPrice: 427.00, previousClose: 427.00,
    priceHistory: makeHistory(430.00, MAX_PRICE_HISTORY),
    volatility: 0.014, trend: 0.0002,
    volume: 0, marketCap: '$139B',
    initialPrice: 430.00,
    description: 'Goldman Sachs is a leading global investment banking, securities and investment management firm.',
  },
  // Healthcare
  {
    ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare',
    currentPrice: 155.00, openPrice: 154.50, previousClose: 154.50,
    priceHistory: makeHistory(155.00, MAX_PRICE_HISTORY),
    volatility: 0.008, trend: 0.0001,
    volume: 0, marketCap: '$373B',
    initialPrice: 155.00,
    description: 'Johnson & Johnson researches, develops, manufactures, and sells healthcare products across pharmaceuticals and MedTech.',
  },
  {
    ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare',
    currentPrice: 28.50, openPrice: 28.20, previousClose: 28.20,
    priceHistory: makeHistory(28.50, MAX_PRICE_HISTORY),
    volatility: 0.015, trend: -0.0001,
    volume: 0, marketCap: '$161B',
    initialPrice: 28.50,
    description: 'Pfizer is a biopharmaceutical company that develops, manufactures, and sells prescription medicines and vaccines.',
  },
  {
    ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare',
    currentPrice: 520.00, openPrice: 518.00, previousClose: 518.00,
    priceHistory: makeHistory(520.00, MAX_PRICE_HISTORY),
    volatility: 0.009, trend: 0.0003,
    volume: 0, marketCap: '$479B',
    initialPrice: 520.00,
    description: 'UnitedHealth Group is a diversified health care company offering health benefits and services.',
  },
  // Energy
  {
    ticker: 'XOM', name: 'Exxon Mobil', sector: 'Energy',
    currentPrice: 105.00, openPrice: 104.50, previousClose: 104.50,
    priceHistory: makeHistory(105.00, MAX_PRICE_HISTORY),
    volatility: 0.013, trend: 0.0001,
    volume: 0, marketCap: '$420B',
    initialPrice: 105.00,
    description: 'ExxonMobil is one of the world\'s largest publicly traded oil and gas companies.',
  },
  {
    ticker: 'CVX', name: 'Chevron Corp.', sector: 'Energy',
    currentPrice: 155.00, openPrice: 154.00, previousClose: 154.00,
    priceHistory: makeHistory(155.00, MAX_PRICE_HISTORY),
    volatility: 0.012, trend: 0.0001,
    volume: 0, marketCap: '$290B',
    initialPrice: 155.00,
    description: 'Chevron is a multinational energy corporation engaged in hydrocarbon exploration, production, and refining.',
  },
  // Consumer
  {
    ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer',
    currentPrice: 185.00, openPrice: 183.50, previousClose: 183.50,
    priceHistory: makeHistory(185.00, MAX_PRICE_HISTORY),
    volatility: 0.016, trend: 0.0004,
    volume: 0, marketCap: '$1.9T',
    initialPrice: 185.00,
    description: 'Amazon is a global technology and e-commerce company offering cloud computing, digital streaming, and AI.',
  },
  {
    ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer',
    currentPrice: 175.00, openPrice: 173.00, previousClose: 173.00,
    priceHistory: makeHistory(175.00, MAX_PRICE_HISTORY),
    volatility: 0.035, trend: 0.0003,
    volume: 0, marketCap: '$557B',
    initialPrice: 175.00,
    description: 'Tesla designs and manufactures electric vehicles, energy storage systems, and solar products.',
  },
  {
    ticker: 'NKE', name: 'Nike Inc.', sector: 'Consumer',
    currentPrice: 92.00, openPrice: 91.50, previousClose: 91.50,
    priceHistory: makeHistory(92.00, MAX_PRICE_HISTORY),
    volatility: 0.011, trend: 0.0001,
    volume: 0, marketCap: '$138B',
    initialPrice: 92.00,
    description: 'Nike designs, develops, markets, and sells athletic footwear, apparel, equipment, and accessories.',
  },
  // Industrial
  {
    ticker: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrial',
    currentPrice: 325.00, openPrice: 323.00, previousClose: 323.00,
    priceHistory: makeHistory(325.00, MAX_PRICE_HISTORY),
    volatility: 0.012, trend: 0.0002,
    volume: 0, marketCap: '$160B',
    initialPrice: 325.00,
    description: 'Caterpillar manufactures construction and mining equipment, diesel and natural gas engines, and industrial turbines.',
  },
  {
    ticker: 'BA', name: 'Boeing Co.', sector: 'Industrial',
    currentPrice: 205.00, openPrice: 203.00, previousClose: 203.00,
    priceHistory: makeHistory(205.00, MAX_PRICE_HISTORY),
    volatility: 0.020, trend: -0.0001,
    volume: 0, marketCap: '$122B',
    initialPrice: 205.00,
    description: 'Boeing is a multinational aerospace and defense corporation that manufactures commercial jetliners, military aircraft, and spacecraft.',
  },
  // Utilities
  {
    ticker: 'NEE', name: 'NextEra Energy', sector: 'Utilities',
    currentPrice: 58.00, openPrice: 57.80, previousClose: 57.80,
    priceHistory: makeHistory(58.00, MAX_PRICE_HISTORY),
    volatility: 0.007, trend: 0.0001,
    volume: 0, marketCap: '$118B',
    initialPrice: 58.00,
    description: 'NextEra Energy is a clean energy company and the world\'s largest producer of wind and solar energy.',
  },
  // Materials
  {
    ticker: 'LIN', name: 'Linde plc', sector: 'Materials',
    currentPrice: 415.00, openPrice: 413.00, previousClose: 413.00,
    priceHistory: makeHistory(415.00, MAX_PRICE_HISTORY),
    volatility: 0.009, trend: 0.0002,
    volume: 0, marketCap: '$200B',
    initialPrice: 415.00,
    description: 'Linde is a global industrial gases and engineering company supplying gases and related services to various industries.',
  },
];
