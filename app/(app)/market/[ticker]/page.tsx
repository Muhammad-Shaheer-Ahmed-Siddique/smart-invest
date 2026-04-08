import { StockDetailClient } from '@/components/market/StockDetailClient';

export default async function StockPage(props: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await props.params;
  return <StockDetailClient ticker={ticker.toUpperCase()} />;
}
