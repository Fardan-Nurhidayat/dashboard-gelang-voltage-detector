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

  // ✅ Tambah loading state
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = currentUser?.id?.toString() || null;

  const fetchApi = async () => {
    const feedsUrl = "https://api.thingspeak.com/channels/2922736/feeds.json";

    try {
      const response = await fetch(feedsUrl);
      const responseJson = await response.json();

      // Simpan data baru dari API ke IndexedDB
      await saveChannelAndFeeds(responseJson);

      const savedChannel = await getChannel();
      let filteredFeeds = [];

      if (currentUser.is_admin === 1) {
        // Admin: ambil semua feeds
        filteredFeeds = await getAllFeeds();
      } else {
        // User biasa: ambil feeds berdasarkan userId
        filteredFeeds = await getFeeds(userId);
      }

      setChannel({
        length: filteredFeeds.length,
        channel: savedChannel,
        feeds: filteredFeeds,
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  // Load data dari IndexedDB saat komponen mount
  const loadSavedData = async () => {
    try {
      const savedChannel = await getChannel();
      const savedFeeds = await getFeeds(userId); // Filter berdasarkan userId

      if (savedChannel && savedFeeds.length > 0) {
        setChannel({
          length: savedFeeds.length,
          channel: savedChannel,
          feeds: savedFeeds,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  };

  // Enhanced function to transform feeds to chart data with better date handling
  const transformFeedsToChartData = (
    feeds: ThingSpeakFeed[],
    userId: string | null
  ): { date: string; bpm: number }[] => {
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
    loadSavedData();
    fetchApi();

    const interval = setInterval(() => {
      fetchApi();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (channel.feeds.length > 0 && userId) {
      const transformed = transformFeedsToChartData(channel.feeds, userId);
      setChartData(transformed);
    }
  }, [channel.feeds, userId]);

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 px-10 md:gap-6 md:py-6'>
              {isLoading ? (
                <p className='text-center'>Loading data...</p>
              ) : channel.feeds.length === 0 ? (
                <p className='text-center'>No data available</p>
              ) : currentUser.is_admin === 1 ? (
                // 🔽 Admin melihat Tabel
                <Tables feeds={channel.feeds} />
              ) : (
                // 🔽 User biasa melihat Chart dan SectionCards
                <>
                  <SectionCards feeds={channel.feeds} />
                  <ChartAreaInteractive chartData={chartData} />
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
