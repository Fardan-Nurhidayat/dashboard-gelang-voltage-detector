import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface LocationCardProps {
  latitude: string;
  longitude: string;
}

export function LocationCard({ latitude, longitude }: LocationCardProps) {
  const hasLocation = latitude != "0.00000" && longitude != "0.00000";
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardDescription>Lokasi Terakhir</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
          {hasLocation ? "Koordinat GPS" : "Tidak Tersedia"}
        </CardTitle>
        <CardAction>
          <Badge variant='outline'>📍 GPS</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {hasLocation ? (
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Latitude: {latitude}</p>
            <p className='text-sm font-medium'>Longitude: {longitude}</p>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>Lokasi tidak tersedia</p>
        )}
      </CardContent>
      <CardFooter>
        <a
          href={
            "https://www.google.com/maps/search/?api=1&query=" +
            latitude +
            "," +
            longitude
          }
          target='_blank'
          rel={"noopener noreferrer"}
          className='text-muted-foreground text-sm'>
          <Badge
            variant='outline'
            className='p-2'>
            Go To Map
          </Badge>
        </a>
      </CardFooter>
    </Card>
  );
}
