import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
interface FrequencyStatusCardProps {
  statusCode: string | undefined; // field4
}

export function FrequencyStatusCard({
  statusCode,
}: FrequencyStatusCardProps) {
  // Validasi dan parsing frekuensi
  // const isValidFrequency = frequency && !isNaN(Number(frequency));
  // const freqValue = isValidFrequency ? Number(frequency) : null;
  // Mapping status berdasarkan field8
  const getStatusBadge = () => {
    if (!statusCode) return { label: "Tidak Tersedia", variant: "outline" };
    if (statusCode === "0") return { label: "Normal", variant: "default" };
    if (statusCode === "1") return { label: "High", variant: "destructive" };
    return { label: "Unknown", variant: "secondary" };
  };

  const { label: statusLabel } = getStatusBadge();

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardDescription>Status Deteksi Tegangan</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
          {statusLabel}
        </CardTitle>
        <CardAction>
          <Badge variant={"outline"}>
            {statusLabel === "Normal" && "🟢"}
            {statusLabel === "High" && "🔴"}
            {statusLabel === "Unknown" && "⚪"}
            {statusLabel}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>
          {statusLabel === "Normal" && "🟢 Status deteksi normal"}
          {statusLabel === "High" && "🔴 Status deteksi bahaya"}
          {statusLabel === "Tidak Tersedia" && "⚪ Data status tidak ditemukan"}
        </div>
        <div className='text-muted-foreground'>
          Data terakhir diupdate realtime setiap 15 detik
        </div>
      </CardFooter>
    </Card>
  );
}
