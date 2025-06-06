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

interface BatteryCardProps {
  batteryLevel: string | undefined;
}

export function BatteryCard({ batteryLevel }: BatteryCardProps) {
  // Parsing dan validasi nilai baterai
  const isValidBattery = batteryLevel && !isNaN(Number(batteryLevel));
  const batteryPercent = isValidBattery ? Number(batteryLevel) : 0;

  // Menentukan status baterai berdasarkan persentase
  const getBatteryStatus = () => {
    if (!isValidBattery)
      return { status: "Tidak Tersedia", color: "text-muted-foreground" };
    if (batteryPercent >= 80)
      return { status: "Penuh", color: "text-green-500" };
    if (batteryPercent >= 50)
      return { status: "Normal", color: "text-blue-500" };
    if (batteryPercent >= 20)
      return { status: "Rendah", color: "text-yellow-500" };
    return { status: "Kritis", color: "text-red-500" };
  };

  const { status, color } = getBatteryStatus();

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardDescription>Status Baterai</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
          {isValidBattery ? `${batteryPercent}%` : "N/A"}
        </CardTitle>
        <CardAction>
          <Badge
            variant='outline'
            className={`bg-gradient-to-r from-yellow-400 to-orange-500`}>
            🔋 {status}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isValidBattery ? (
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Level Baterai</span>
              <span className={color}>{status}</span>
            </div>
            <div className='h-2 w-full rounded-full bg-secondary'>
              <div
                className={`h-full rounded-full ${color.replace("text", "bg")}`}
                style={{ width: `${Math.min(batteryPercent, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>
            Data baterai tidak tersedia
          </p>
        )}
      </CardContent>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>
          {status === "Kritis" && "⚠️ Segera isi ulang baterai"}
          {status === "Rendah" && "🔋 Persiapan pengisian ulang"}
          {status === "Normal" && "🔋 Baterai dalam kondisi normal"}
          {status === "Penuh" && "⚡ Baterai terisi penuh"}
        </div>
        <div className='text-muted-foreground'>
          Data terakhir diupdate realtime setiap 30 detik
        </div>
      </CardFooter>
    </Card>
  );
}
