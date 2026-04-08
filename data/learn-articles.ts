import type { Article } from '@/types';

export const ARTICLES: Article[] = [
  {
    slug: 'what-is-a-stock',
    title: 'What Is a Stock?',
    category: 'Fundamentals',
    readingTimeMinutes: 4,
    difficulty: 'Beginner',
    summary: 'Learn the basics: what stocks are, why companies issue them, and how they work.',
    publishedAt: '2024-01-15',
    tags: ['stocks', 'basics', 'equity'],
    content: `
## What Is a Stock?

A **stock** (also called equity or a share) represents ownership in a company. When you buy a stock, you're purchasing a small piece of that company — making you a **shareholder**.

### Why Do Companies Issue Stocks?

Companies issue stocks to raise money. Instead of taking out a bank loan, a company can sell shares of itself to the public. This is called an **Initial Public Offering (IPO)**. The company gets cash to grow, and investors get ownership.

### How Do Stocks Make Money?

There are two main ways:

1. **Capital Appreciation** — The stock price rises above what you paid. When you sell, you pocket the difference.
2. **Dividends** — Some companies share profits directly with shareholders through regular cash payments.

### Stock vs. Bond

| | Stock | Bond |
|---|---|---|
| You own | A piece of the company | Debt owed to you |
| Risk | Higher | Lower |
| Upside | Unlimited | Fixed interest |

### Key Takeaway

Stocks let you participate in a company's growth. With higher potential rewards come higher risks — stock prices can fall as well as rise.
    `,
  },
  {
    slug: 'understanding-market-cap',
    title: 'Understanding Market Capitalization',
    category: 'Fundamentals',
    readingTimeMinutes: 3,
    difficulty: 'Beginner',
    summary: 'Market cap tells you the total value of a company. Here\'s how to read it.',
    publishedAt: '2024-01-22',
    tags: ['market cap', 'valuation', 'fundamentals'],
    content: `
## Understanding Market Capitalization

**Market capitalization** (or "market cap") is the total market value of a company's outstanding shares. It's calculated simply:

> **Market Cap = Share Price × Total Shares Outstanding**

### Market Cap Categories

| Category | Market Cap | Examples |
|---|---|---|
| Mega Cap | > $200B | Apple, Microsoft |
| Large Cap | $10B–$200B | Nike, JPMorgan |
| Mid Cap | $2B–$10B | Many growth companies |
| Small Cap | $300M–$2B | Emerging businesses |
| Micro Cap | < $300M | Very early-stage |

### Why Market Cap Matters

- **Risk gauge**: Small-cap stocks tend to be more volatile
- **Index inclusion**: Major indices like the S&P 500 require a minimum market cap
- **Comparison**: Use market cap to compare companies in the same sector

### Common Mistake

Don't confuse market cap with the company's revenue or profit. A company could have a $1 trillion market cap but generate $100B in revenue — that's a very high valuation multiple.
    `,
  },
  {
    slug: 'how-to-read-candlestick-charts',
    title: 'How to Read Candlestick Charts',
    category: 'Technical Analysis',
    readingTimeMinutes: 6,
    difficulty: 'Intermediate',
    summary: 'Candlestick charts pack four data points into one visual. Learn how to decode them.',
    publishedAt: '2024-02-01',
    tags: ['charts', 'candlestick', 'OHLCV', 'technical analysis'],
    content: `
## How to Read Candlestick Charts

Every candlestick represents a **time period** (1 minute, 1 hour, 1 day, etc.) and contains four pieces of information: **Open, High, Low, Close** (OHLCV).

### Anatomy of a Candlestick

\`\`\`
     High ─── │
               │  ← Upper shadow (wick)
         ┌─────┐
         │     │  ← Body (Open to Close)
         └─────┘
               │  ← Lower shadow (wick)
     Low  ─── │
\`\`\`

- **Green/White body**: Close > Open (price went UP)
- **Red/Black body**: Close < Open (price went DOWN)
- **Wicks**: Show extreme prices within the period

### Common Patterns

**Doji**: Open ≈ Close — indecision, potential reversal
**Hammer**: Small body, long lower wick — potential bullish reversal
**Shooting Star**: Small body, long upper wick — potential bearish reversal
**Engulfing**: Large candle completely "engulfs" the previous one — strong reversal signal

### Practical Tip

No single candle predicts the future with certainty. Always look at **context** — what happened before, where you are in a trend, and what the volume looks like.
    `,
  },
  {
    slug: 'moving-averages-explained',
    title: 'Moving Averages Explained',
    category: 'Technical Analysis',
    readingTimeMinutes: 5,
    difficulty: 'Intermediate',
    summary: 'The 50-day and 200-day moving averages are among the most watched indicators on Wall Street.',
    publishedAt: '2024-02-12',
    tags: ['moving average', 'SMA', 'EMA', 'trend'],
    content: `
## Moving Averages Explained

A **moving average (MA)** smooths out price data to show the overall trend direction, cutting through day-to-day noise.

### Simple Moving Average (SMA)

Add the closing prices over N days and divide by N. The "50-day SMA" is the average of the last 50 closing prices.

### Exponential Moving Average (EMA)

Gives more weight to recent prices, making it more responsive to new information. Traders often prefer the EMA for short-term signals.

### How Traders Use Moving Averages

1. **Trend direction**: Price above MA = uptrend, price below MA = downtrend
2. **Support/Resistance**: MAs often act as dynamic support or resistance
3. **Crossovers**:
   - *Golden Cross*: 50-day MA crosses above 200-day MA → bullish signal
   - *Death Cross*: 50-day MA crosses below 200-day MA → bearish signal

### Limitations

Moving averages are **lagging indicators** — they're based on past data. They work best in trending markets and can give false signals in choppy, sideways markets.
    `,
  },
  {
    slug: 'position-sizing-and-risk',
    title: 'Position Sizing & Risk Management',
    category: 'Risk Management',
    readingTimeMinutes: 5,
    difficulty: 'Intermediate',
    summary: 'How much should you invest in a single stock? Learn the 1% rule and position sizing basics.',
    publishedAt: '2024-02-20',
    tags: ['risk management', 'position sizing', 'diversification'],
    content: `
## Position Sizing & Risk Management

Even the best stock pick can hurt your portfolio if you bet too much on it. Position sizing is how you decide how much capital to allocate to each trade.

### The 1% Rule

Many traders risk no more than **1–2% of their total portfolio** on any single trade. If your portfolio is $100,000, you'd risk at most $1,000–$2,000 per position.

This doesn't mean you invest $1,000 — it means your maximum *loss* per trade is $1,000.

### Why Diversification Matters

| # of Stocks | If one drops 50% | Portfolio impact |
|---|---|---|
| 1 | All of it | −50% |
| 5 | 20% of portfolio | −10% |
| 20 | 5% of portfolio | −2.5% |

### Kelly Criterion (Advanced)

A formula to calculate optimal position size based on your edge and win rate:

> **f = (bp − q) / b**
> where b = odds, p = probability of win, q = probability of loss

In practice, most traders use a *fractional Kelly* (e.g., ½ Kelly) to reduce volatility.

### Key Takeaway

Never bet everything on one position — no matter how confident you feel. Preserving capital is the #1 priority.
    `,
  },
  {
    slug: 'stop-loss-orders',
    title: 'Stop-Loss Orders: Your Safety Net',
    category: 'Risk Management',
    readingTimeMinutes: 4,
    difficulty: 'Beginner',
    summary: 'A stop-loss order automatically exits your position if the price drops too far. Here\'s how to set one.',
    publishedAt: '2024-02-28',
    tags: ['stop loss', 'orders', 'risk management'],
    content: `
## Stop-Loss Orders: Your Safety Net

A **stop-loss** is an order to automatically sell a stock if its price falls to a specified level. It's one of the most important tools in a trader's kit.

### How It Works

You buy AAPL at $180. You set a stop-loss at $162 (10% below). If the price drops to $162, your shares are sold automatically — capping your loss at 10%.

### Types of Stop-Loss

- **Fixed stop-loss**: Set at a specific dollar price
- **Trailing stop-loss**: Follows the price upward, triggers only if the price reverses by X%
- **Percentage-based**: Always X% below your entry

### Where to Set Your Stop

Common approaches:
1. **Percentage-based**: 5–10% below entry
2. **ATR-based**: Below recent average true range (volatility)
3. **Technical level**: Below a key support level

### The Downside

A stop-loss doesn't guarantee the exact price in fast-moving markets (slippage). In extreme volatility, you may be filled at a much worse price.
    `,
  },
  {
    slug: 'value-vs-growth-investing',
    title: 'Value vs. Growth Investing',
    category: 'Strategy',
    readingTimeMinutes: 5,
    difficulty: 'Intermediate',
    summary: 'Two dominant investment philosophies — and how to think about which fits your style.',
    publishedAt: '2024-03-05',
    tags: ['value investing', 'growth investing', 'strategy', 'P/E ratio'],
    content: `
## Value vs. Growth Investing

These are the two most famous investment philosophies. Understanding them helps you think like a professional investor.

### Value Investing (Warren Buffett style)

Value investors look for stocks trading **below their intrinsic value** — companies the market has overlooked or unfairly punished.

**Key metrics**: P/E ratio, P/B ratio, dividend yield, free cash flow
**Famous practitioners**: Warren Buffett, Benjamin Graham
**Mindset**: Buy a dollar for 50 cents. Be greedy when others are fearful.

### Growth Investing

Growth investors seek companies with **above-average revenue or earnings growth**, even if the stock is "expensive" by traditional metrics. They pay a premium for future potential.

**Key metrics**: Revenue growth rate, total addressable market (TAM), gross margins
**Famous practitioners**: Peter Lynch, Cathie Wood
**Mindset**: Find the next Amazon before it becomes Amazon.

### Comparison

| | Value | Growth |
|---|---|---|
| P/E Ratio | Low | High |
| Dividends | Common | Rare |
| Risk | Lower | Higher |
| Time horizon | Long | Long |

### Which Is Better?

Neither dominates consistently. Value outperforms in some decades; growth in others. Many successful investors blend both approaches.
    `,
  },
  {
    slug: 'dollar-cost-averaging',
    title: 'Dollar-Cost Averaging',
    category: 'Strategy',
    readingTimeMinutes: 3,
    difficulty: 'Beginner',
    summary: 'Investing a fixed amount regularly — regardless of price — can reduce your risk over time.',
    publishedAt: '2024-03-12',
    tags: ['DCA', 'dollar cost averaging', 'strategy', 'long-term investing'],
    content: `
## Dollar-Cost Averaging (DCA)

**Dollar-cost averaging** means investing a fixed dollar amount at regular intervals (weekly, monthly) regardless of the stock price. This simple discipline has powerful effects.

### How It Works

You invest $500 in an index fund every month for 12 months. Some months the price is high, some low. Over time, you automatically buy more shares when prices are cheap and fewer when they're expensive — lowering your average cost.

### Example

| Month | Price | $500 buys |
|---|---|---|
| Jan | $50 | 10 shares |
| Feb | $40 | 12.5 shares |
| Mar | $60 | 8.3 shares |
| **Avg** | $50 | Avg cost: $46 |

You bought more when it was cheap — your average cost ($46) is lower than the average price ($50).

### Why DCA Works

- **Removes emotion**: No need to time the market
- **Reduces regret**: If the price falls right after you invest, your next purchase is cheaper
- **Works over time**: Consistent saving + compound growth = wealth

### Limitations

In a bull market, lump-sum investing often beats DCA. But for most retail investors, the discipline and risk reduction of DCA is worth the trade-off.
    `,
  },
  {
    slug: 'pe-ratio-explained',
    title: 'P/E Ratio Explained',
    category: 'Glossary',
    readingTimeMinutes: 3,
    difficulty: 'Beginner',
    summary: 'The price-to-earnings ratio is one of the most widely used stock valuation metrics.',
    publishedAt: '2024-03-18',
    tags: ['P/E ratio', 'valuation', 'glossary', 'earnings'],
    content: `
## P/E Ratio (Price-to-Earnings)

The **P/E ratio** compares a stock's price to its earnings per share (EPS). It tells you how much investors are willing to pay for every $1 of the company's profit.

> **P/E = Stock Price / Earnings Per Share (EPS)**

### Example

If a stock is priced at $100 and its EPS is $5:
P/E = 100 / 5 = **20x**
Investors are paying $20 for every $1 of earnings.

### What's a Good P/E?

There's no universal answer. Context matters:

- **S&P 500 historical average**: ~15–20x
- **High-growth tech stocks**: 30–100x (investors pay for future earnings)
- **Mature, stable companies**: 10–15x
- **P/E < 0**: Company is losing money

### Forward P/E

Uses *expected* future earnings instead of historical. More relevant for fast-growing companies.

### Limitations

- Doesn't account for debt levels
- Useless for companies with no earnings
- Varies significantly by industry — always compare companies in the same sector
    `,
  },
  {
    slug: 'what-is-eps',
    title: 'What Is EPS (Earnings Per Share)?',
    category: 'Glossary',
    readingTimeMinutes: 2,
    difficulty: 'Beginner',
    summary: 'EPS is the portion of a company\'s profit allocated to each share. It\'s a key measure of profitability.',
    publishedAt: '2024-03-20',
    tags: ['EPS', 'earnings', 'profitability', 'glossary'],
    content: `
## Earnings Per Share (EPS)

**EPS** measures how much profit a company generates *per outstanding share*.

> **EPS = Net Profit / Total Shares Outstanding**

### Example

A company earns $10 million in net profit and has 5 million shares outstanding:
EPS = 10M / 5M = **$2.00**

Each share "earned" $2 of profit for the company.

### Why It Matters

- Foundation for the P/E ratio
- Higher EPS generally → more valuable stock
- EPS *growth* is what markets pay attention to most

### Basic vs. Diluted EPS

- **Basic EPS**: Uses current shares outstanding
- **Diluted EPS**: Accounts for stock options, warrants, and convertible debt that *could* become shares. Always more conservative and more accurate.

### EPS Beat vs. Miss

When a company reports quarterly earnings, analysts have consensus estimates. If actual EPS beats the estimate, stocks typically rise. A "miss" often causes a sell-off — even if absolute earnings were still positive.
    `,
  },
  {
    slug: 'what-is-volatility',
    title: 'What Is Volatility?',
    category: 'Glossary',
    readingTimeMinutes: 3,
    difficulty: 'Beginner',
    summary: 'Volatility measures how much a stock\'s price moves. High volatility = higher risk and higher reward.',
    publishedAt: '2024-03-25',
    tags: ['volatility', 'VIX', 'risk', 'standard deviation', 'glossary'],
    content: `
## What Is Volatility?

**Volatility** measures how much and how quickly a stock's price moves. A highly volatile stock can swing dramatically up or down in a short time. A low-volatility stock is more stable and predictable.

### Measuring Volatility

- **Standard Deviation**: Statistical measure of price dispersion around the average
- **Beta**: Compares a stock's volatility to the overall market. Beta of 1 = moves like the market. Beta of 2 = twice as volatile.
- **VIX**: The "Fear Index" — measures expected volatility of the S&P 500 over the next 30 days

### High vs. Low Volatility Stocks

| Type | Examples | Characteristics |
|---|---|---|
| High volatility | TSLA, NVDA, small caps | Big swings, more risk + reward |
| Low volatility | JNJ, NEE, utilities | Stable, predictable |

### Implied vs. Historical Volatility

- **Historical volatility**: Based on past price movements
- **Implied volatility (IV)**: Derived from options prices — what the market *expects* future volatility to be

### Key Takeaway

Higher volatility = higher potential returns AND higher risk. Match your stock picks to your risk tolerance.
    `,
  },
  {
    slug: 'what-is-diversification',
    title: 'What Is Diversification?',
    category: 'Fundamentals',
    readingTimeMinutes: 3,
    difficulty: 'Beginner',
    summary: 'Don\'t put all your eggs in one basket — diversification is the cornerstone of portfolio management.',
    publishedAt: '2024-01-30',
    tags: ['diversification', 'portfolio', 'risk', 'fundamentals'],
    content: `
## What Is Diversification?

**Diversification** is the practice of spreading investments across multiple assets, sectors, or geographies to reduce risk. The idea: if one investment performs badly, others can offset the losses.

> "Don't put all your eggs in one basket."

### Types of Diversification

1. **By sector**: Technology, Healthcare, Energy, Finance, etc.
2. **By asset class**: Stocks, bonds, real estate, commodities
3. **By geography**: U.S., Europe, Asia, emerging markets
4. **By company size**: Large-cap, mid-cap, small-cap

### Correlation Matters

Diversification works best when your holdings are **negatively correlated** or **uncorrelated** — they don't all move together.

For example: Tech stocks and gold often move in opposite directions during market stress.

### How Much Is Enough?

Research suggests that holding **15–20 stocks** across different sectors captures most of the risk-reduction benefits. Beyond that, extra diversification has diminishing returns.

### The Tradeoff

Diversification reduces risk but also caps your upside. A concentrated bet on the right stock can massively outperform — but it's also riskier. Most long-term investors prioritize diversification over concentration.
    `,
  },
];
