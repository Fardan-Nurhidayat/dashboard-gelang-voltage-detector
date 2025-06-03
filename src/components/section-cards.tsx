import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1?: string | null;
  field2?: string | null;
  field3?: string | null;
  // tambahkan fields lain sesuai kebutuhan
}

interface ThingSpeakChannel {
  id: number;
  name: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  field1?: string;
  field2?: string;
  field3?: string;
  // tambahkan fields lain sesuai kebutuhan
}
interface ThingSpeakData {
  length: number;
  channel: ThingSpeakChannel;
  feeds: ThingSpeakFeed[];
}
export function SectionCards({ bpm }: { bpm: ThingSpeakData }) {
  const bpmValues = bpm.feeds
    .map(feed => Number(feed.field3))
    .filter(val => !isNaN(val)); // hilangkan null/undefined/NaN

  const latestBpm = bpmValues[bpmValues.length - 1] ?? 0;
  const averageBpm =
    bpmValues.length > 0
      ? (bpmValues.reduce((a, b) => a + b, 0) / bpmValues.length).toFixed(2)
      : 0;
  const maxBpm = Math.max(...bpmValues);
  const minBpm = Math.min(...bpmValues);
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>BPM Realtime</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {latestBpm}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>⏱️ Live Update</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Stabil dalam periode pemantauan
          </div>
          <div className='text-muted-foreground'>
            Data terakhir diupdate realtime setiap 5 detik
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>BPM Rata-rata</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {averageBpm}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>📊 Rata-rata</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='flex gap-2 font-medium'>
            Stabil dalam periode pemantauan
          </div>
          <div className='text-muted-foreground'>
            Menggambarkan kondisi umum detak jantung
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>BPM Tertinggi</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {maxBpm}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>⚠️ Waspada</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Stabil dalam periode pemantauan
          </div>
          <div className='text-muted-foreground'>
            BPM tertinggi tercatat dalam periode ini
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>BPM Terendah</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {minBpm}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>🧘 Low BPM </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Stabil dalam periode pemantauan
          </div>
          <div className='text-muted-foreground'>
            BPM terendah dapat mengindikasikan istirahat
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
