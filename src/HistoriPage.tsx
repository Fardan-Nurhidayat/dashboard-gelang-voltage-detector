import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getFeeds, getDetailUser } from "@/utils/IndexDB"; // Sesuaikan path import
import { ChartAreaInteractive } from "@/components/chart-area-interactive"; // Import komponen chart
import { SectionCards } from "./components/section-cards";
interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1?: string | null; // Lokasi bagian 1
  field2?: string | null; // Lokasi bagian 2
  field3?: string | null; // BPM
  field4?: string | null; // Voltage
  field5?: string | null; // User ID
  field6?: string | null; // Frequency
  field7?: string | null; // Battery
  field8?: string | null; // BPM Status
  field9?: string | null;
}

interface User {
  id: string;
  name: string;
}

interface ChartData {
  date: string;
  bpm: number;
}

export default function HistoriPage() {
  const { userId } = useParams(); // Ambil userId dari URL
  const [user, setUser] = useState<User | null>(null);
  const [feeds, setFeeds] = useState<ThingSpeakFeed[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function untuk transform feeds ke chart data
  const transformFeedsToChartData = (
    feeds: ThingSpeakFeed[],
    userId: string | undefined
  ): ChartData[] => {
    if (!userId) return [];

    return feeds
      .filter(feed => feed.field3 && feed.field5 === userId) // Filter berdasarkan field5 dan field3
      .map(feed => {
        // Parse the created_at timestamp
        const createdAt = new Date(feed.created_at);

        return {
          date: createdAt.toISOString(), // Keep full ISO timestamp for accurate filtering and grouping
          bpm: Number(feed.field3),
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          setError("User ID tidak ditemukan");
          return;
        }

        // Fetch user detail terlebih dahulu
        const userDetail = await getDetailUser(userId);
        if (!userDetail) {
          setError("User tidak ditemukan");
          return;
        }
        setUser(userDetail);

        // Fetch feeds berdasarkan userId
        const userFeeds = await getFeeds(userId);

        // Sort feeds by created_at descending (terbaru dulu) untuk table
        const sortedFeeds = userFeeds.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setFeeds(sortedFeeds);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal mengambil data histori");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // useEffect untuk update chart data ketika feeds atau userId berubah
  useEffect(() => {
    if (feeds.length > 0 && userId) {
      const transformed = transformFeedsToChartData(feeds, userId);
      setChartData(transformed);
    }
  }, [feeds, userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status: string | null | undefined) => {
    if (status === "1") {
      return "bg-red-100 text-red-800";
    }
    return "bg-green-100 text-green-800";
  };

  const getVoltageColor = (voltage: string | null | undefined) => {
    if (voltage === "1") {
      return "bg-red-100 text-red-800";
    }
    return "bg-green-100 text-green-800";
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          <div className='p-6'>
            <div className='text-center py-8'>
              <div className='animate-pulse'>
                <div className='h-4 bg-gray-300 rounded w-1/4 mx-auto mb-4'></div>
                <div className='h-32 bg-gray-300 rounded'></div>
              </div>
              <p className='mt-4 text-muted-foreground'>
                Memuat data histori...
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          <div className='p-6'>
            <div className='text-center py-8'>
              <p className='text-red-600'>{error}</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='p-6'>
          <div className='mb-6'>
            <h1 className='text-2xl font-bold'>
              Histori Data : {user?.name || "Loading..."}
            </h1>
            <p className='text-muted-foreground'>
              Total {feeds.length} data histori ditemukan
            </p>
          </div>
          <div className='flex flex-1 flex-col'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-4 py-4 px-10 md:gap-6 md:py-6'>
                <SectionCards feeds={feeds} />
              </div>
            </div>
          </div>
          {/* Chart Section */}
          {chartData.length > 0 && (
            <div className='mb-6'>
              <div className='rounded-lg border bg-white shadow-sm p-6'>
                <h2 className='text-lg font-semibold mb-4'>Grafik BPM</h2>
                <ChartAreaInteractive chartData={chartData} />
              </div>
            </div>
          )}

          <div className='rounded-lg border bg-white shadow-sm overflow-hidden'>
            <Table>
              <TableHeader className='bg-muted/40'>
                <TableRow className='border-b'>
                  <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[180px]'>
                    Waktu
                  </TableHead>
                  <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]'>
                    BPM
                  </TableHead>
                  <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]'>
                    Lokasi
                  </TableHead>
                  <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]'>
                    Voltage
                  </TableHead>
                  <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]'>
                    Frekuensi
                  </TableHead>
                  <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]'>
                    Baterai
                  </TableHead>
                  <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]'>
                    Status BPM
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className='divide-y divide-muted/20'>
                {feeds.length > 0 ? (
                  feeds.map((feed, index) => (
                    <TableRow
                      key={index}
                      className='hover:bg-muted/20 transition-colors duration-150'>
                      <TableCell className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        {formatDate(feed.created_at)}
                      </TableCell>
                      <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                        {feed.field3 || "-"}
                      </TableCell>
                      <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                        {feed.field1 && feed.field2 ? (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${feed.field1}, ${feed.field2}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'>
                            {`${feed.field1}, ${feed.field2}`}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                        {feed.field4 ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVoltageColor(
                              feed.field4
                            )}`}>
                            {feed.field4 === "1" ? "High" : "Low"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                        {feed.field6 ? `${feed.field6} Hz` : "-"}
                      </TableCell>
                      <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                        {feed.field7 ? `${feed.field7}%` : "-"}
                      </TableCell>
                      <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                        {feed.field8 ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              feed.field8
                            )}`}>
                            {feed.field8 === "1" ? "Bahaya" : "Normal"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className='px-6 py-8 text-center text-sm text-muted-foreground'>
                      Tidak ada data histori untuk User ID {userId}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
