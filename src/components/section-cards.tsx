import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LocationCard } from "./location-card";
import { BatteryCard } from "./battery-card";
import { FrequencyStatusCard } from "./frequency-status-card";
interface SectionCardsProps {
  feeds: ThingSpeakFeed[];
}
interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1?: string | null;
  field2?: string | null;
  field3?: string | null;
  field4?: string | null;
  field5?: string | null;
  field6?: string | null;
  field7?: string | null;
  field8?: string | null;
  field9?: string | null;
}

export function SectionCards({ feeds }: SectionCardsProps) {
  const lastFeeds = feeds[feeds.length - 1];
  const latitude = lastFeeds?.field1 ?? "N/A";
  const longitude = lastFeeds?.field2 ?? "N/A";
  const battery = lastFeeds?.field7 ?? "N/A";
  const frequency = lastFeeds?.field6 ?? "N/A";
  const status = lastFeeds?.field4 ?? "N/A";
  const bpmValues = feeds.map(feed => Number(feed.field3));

  const latestBpm = bpmValues[bpmValues.length - 1] ?? 0;

  const averageBpm =
    bpmValues.length > 0
      ? (bpmValues.reduce((a, b) => a + b, 0) / bpmValues.length).toFixed(2)
      : 0;
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>BPM Realtime</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {latestBpm}
          </CardTitle>
          <CardAction>
            <Badge
              variant='outline'
              className='flex items-center gap-1'>
              {latestBpm < 60 ? (
                <>🩷 Detak Jantung Rendah</>
              ) : latestBpm >= 170 ? (
                <>⚠️ Detak Jantung Tinggi</>
              ) : (
                <>🧘 Normal Range</>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          {latestBpm < 60 ? (
            <div className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                Detak jantung berada di bawah batas normal ( Kurang dari 60
                BPM).
              </p>
            </div>
          ) : latestBpm >= 170 ? (
            <div className='space-y-3'>
              <p className='text-sm text-muted-foreground'>
                Detak jantung sangat tinggi ( Lebih dari 170 BPM).
                <span className='block mt-1 font-medium text-red-600 dark:text-red-400'>
                  Mungkin disebut Takikardia.
                </span>
              </p>
              <div className='p-3 rounded-md bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm'>
                <strong>Segera lakukan:</strong> Istirahat, hindari aktivitas
                berat.
                <br />
                <span className='text-xs mt-1 block'>
                  Jika tidak stabil, cari pertolongan medis segera.
                </span>
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                Detak jantung dalam rentang normal.
              </p>
              <div className='p-3 rounded-md bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm'>
                <strong>Stabil:</strong> Kondisi detak jantung baik dan
                terkontrol.
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='flex items-center gap-2'>
            <span className='inline-block size-2 rounded-full bg-green-500'></span>
            <span className='font-medium'>Live Update</span>
          </div>
          <div className='text-muted-foreground text-sm'>
            Data terakhir diupdate setiap 15 detik
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
      <LocationCard
        latitude={latitude}
        longitude={longitude}
      />
      <BatteryCard batteryLevel={battery} />
      <FrequencyStatusCard
        frequency={frequency}
        statusCode={status}
      />
    </div>
  );
}
