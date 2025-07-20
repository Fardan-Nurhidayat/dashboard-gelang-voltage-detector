import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

import {
  saveChannelAndFeeds,
  getChannel,
  getFeeds,
  getAllFeeds,
} from "@/utils/IndexDB";
import { ChartAreaInteractive } from "./components/chart-area-interactive";

import Tables from "./components/tables";

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

interface ThingSpeakChannel {
  id: number;
  name: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  field7?: string;
  field8?: string;
  field9?: string;
}

interface ThingSpeakData {
  length: number;
  channel: ThingSpeakChannel;
  feeds: ThingSpeakFeed[];
}

export default function DashboardPage() {
  const [channel, setChannel] = useState<ThingSpeakData>({
    length: 0,
    channel: {
      id: 0,
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      field1: "",
      field2: "",
      field3: "",
      field4: "",
      field5: "",
      field6: "",
      field7: "",
      field8: "",
      field9: "",
    },
    feeds: [],
  });

  const [chartData, setChartData] = useState<{ date: string; bpm: number }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = currentUser?.id?.toString() || null;

  const fetchApi = async () => {
    const feedsUrl =
      "https://api.thingspeak.com/channels/2922736/feeds.json?results=100";

    try {
      const response = await fetch(feedsUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseJson = await response.json();
      // Simpan data baru dari API ke IndexedDB
      await saveChannelAndFeeds(responseJson);

      // Setelah menyimpan, ambil data yang sudah disimpan
      await loadDataFromIndexedDB();
    } catch (error) {
      console.error("Error fetching data from API:", error);
      setError("Failed to fetch data from server");
      setIsLoading(false);
    }
  };

  // Load data dari IndexedDB dengan error handling yang lebih baik
  const loadDataFromIndexedDB = async () => {
    try {
      const savedChannel = await getChannel();
      let filteredFeeds = [];

      if (currentUser.is_admin === 1) {
        // Admin: ambil semua feeds
        filteredFeeds = await getAllFeeds();
      } else {
        // User biasa: ambil feeds berdasarkan userId
        filteredFeeds = await getFeeds(userId);
      }

      if (savedChannel) {
        setChannel({
          length: filteredFeeds.length,
          channel: savedChannel,
          feeds: filteredFeeds,
        });
      }

      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error loading data from IndexedDB:", error);
      // Jika IndexedDB error, coba fetch dari API sebagai fallback
      if (!channel.feeds.length) {
        console.log("IndexedDB error, trying to fetch from API...");
        await fetchApi();
      } else {
        setError("Failed to load data");
        setIsLoading(false);
      }
    }
  };

  // Enhanced function to transform feeds to chart data with better date handling
  const transformFeedsToChartData = (
    feeds: ThingSpeakFeed[],
    userId: string | null
  ): { date: string; bpm: number }[] => {
    if (!userId) return [];

    return feeds
      .filter(feed => feed.field3 && feed.field5 === userId)
      .map(feed => {
        const createdAt = new Date(feed.created_at);
        return {
          date: createdAt.toISOString(),
          bpm: Number(feed.field3),
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Initialize data on component mount
  const initializeData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Coba load dari IndexedDB dulu
      await loadDataFromIndexedDB();

      // Jika berhasil dan ada data, tidak perlu fetch API lagi
      // Jika tidak ada data atau error, fetchApi sudah dipanggil di loadDataFromIndexedDB
    } catch (error) {
      console.error("Error initializing data:", error);
      // Jika semua gagal, coba fetch dari API langsung
      await fetchApi();
    }
  };

  useEffect(() => {
    initializeData();

    // Set interval untuk update data secara berkala
    const interval = setInterval(() => {
      fetchApi();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (channel.feeds.length > 0 && userId) {
      const transformed = transformFeedsToChartData(channel.feeds, userId);
      setChartData(transformed);
    }
  }, [channel.feeds, userId]);

  // Loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          <div className='flex flex-1 flex-col'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-4 py-4 px-10 md:gap-6 md:py-6'>
                <div className='text-center'>
                  <p>Loading data...</p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Error state
  if (error && channel.feeds.length === 0) {
    return (
      <SidebarProvider>
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          <div className='flex flex-1 flex-col'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <div className='flex flex-col gap-4 py-4 px-10 md:gap-6 md:py-6'>
                <div className='text-center'>
                  <p className='text-red-500'>{error}</p>
                  <button
                    onClick={initializeData}
                    className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                    Retry
                  </button>
                </div>
              </div>
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
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 px-10 md:gap-6 md:py-6'>
              {channel.feeds.length === 0 ? (
                <p className='text-center'>No data available</p>
              ) : currentUser.is_admin === 1 ? (
                // Admin melihat Tabel
                <Tables feeds={channel.feeds} />
              ) : (
                // User biasa melihat Chart dan SectionCards
                <>
                  <SectionCards feeds={channel.feeds} />
                  <div className='mb-6'>
                    <div className='rounded-lg border bg-white shadow-sm p-6'>
                      <h2 className='text-lg font-semibold'>Grafik BPM</h2>
                      <p className='text-sm text-muted-foreground mb-4'>
                        Info: Rentang aman detak jantung (BPM) setiap orang
                        berbeda, terutama dipengaruhi oleh berat badan, dengan
                        perbedaan rata-rata sekitar 23%.
                        <ul className='list-disc pl-5'>
                          <li>
                            <strong>Normal</strong>: 68–70 BPM
                          </li>
                          <li>
                            <strong>Overweight</strong>: 84–85 BPM
                          </li>
                        </ul>
                        Jika terjadi{" "}
                        <strong>
                          penurunan drastis detak jantung hingga sekitar 30%
                          dari nilai rata-rata harian
                        </strong>
                        , hal ini dapat menandakan adanya gangguan pada fungsi
                        jantung dan perlu mendapat perhatian medis.
                      </p>
                      <ChartAreaInteractive chartData={chartData} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
