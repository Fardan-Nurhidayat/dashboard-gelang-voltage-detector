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
interface FrequencyStatusCardProps {
  frequency: string | undefined; // field6
  statusCode: string | undefined; // field4
}

export function FrequencyStatusCard({
  frequency,
  statusCode,
}: FrequencyStatusCardProps) {
  // Validasi dan parsing frekuensi
  const isValidFrequency = frequency && !isNaN(Number(frequency));
  const freqValue = isValidFrequency ? Number(frequency) : null;
  // Mapping status berdasarkan field8
  const getStatusBadge = () => {
    if (!statusCode) return { label: "Tidak Tersedia", variant: "outline" };
    if (statusCode === "0") return { label: "Low", variant: "default" };
    if (statusCode === "1") return { label: "High", variant: "destructive" };
    return { label: "Unknown", variant: "secondary" };
  };

  const { label: statusLabel } = getStatusBadge();

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardDescription>Frekuensi & Status</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
          {freqValue ? `${freqValue} Hz` : "N/A"}
        </CardTitle>
        <CardAction>
          <Badge variant={"outline"}>
            {statusLabel === "Low" && "🟢"}
            {statusLabel === "High" && "🔴"}
            {statusLabel === "Unknown" && "⚪"}
            {statusLabel}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {freqValue !== null ? (
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>
              Frekuensi tercatat:{" "}
              <span className='font-medium'>{freqValue} Hz</span>
            </p>
            <div className='mt-2 flex items-center gap-2'>
              <span className='text-sm font-medium'>Status:</span>
              <Badge
                variant={"outline"}
                className='text-xs'>
                {statusLabel}
              </Badge>
            </div>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>
            Data frekuensi tidak tersedia
          </p>
        )}
      </CardContent>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>
          {statusLabel === "Low" && "🟢 Frekuensi stabil dalam rentang normal"}
          {statusLabel === "High" && "🔴 Perlu perhatian, frekuensi tinggi"}
          {statusLabel === "Tidak Tersedia" && "⚪ Data status tidak ditemukan"}
        </div>
        <div className='text-muted-foreground'>
          Data terakhir diupdate realtime setiap 30 detik
        </div>
      </CardFooter>
    </Card>
  );
}
