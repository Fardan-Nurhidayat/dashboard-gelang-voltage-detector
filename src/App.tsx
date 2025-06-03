import { AppSidebar } from "@/components/app-sidebar";
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { date } from "zod";

import { useEffect, useState } from "react";
// import data from "../src/app/dashboard/data.json";

import { saveChannelAndFeeds, getChannel, getFeeds } from "@/utils/IndexDB";
import { ChartAreaInteractive } from "./components/chart-area-interactive";

export default function Page() {
  const [bpm, setBpm] = useState<ThingSpeakData>({
    length: 0,
    channel: {
      id: 0,
      name: "",
    },
    feeds: [],
  });
  const [chartData, setChartData] = useState<{ date: string; bpm: number }[]>(
    []
  );

  const fetchApi = async () => {
    const url = "https://api.thingspeak.com/channels/2922736/fields/3.json";
    try {
      const response = await fetch(url);
      const responseJson = await response.json();

      await saveChannelAndFeeds(responseJson); // simpan ke IndexedDB

      const savedChannel = await getChannel();
      const savedFeeds = await getFeeds();

      // isi state bpm langsung
      setBpm({
        length: savedFeeds.length,
        channel: savedChannel,
        feeds: savedFeeds,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const transformFeedsToChartData = (
    feeds: ThingSpeakFeed[]
  ): { date: string; bpm: number }[] => {
    return feeds
      .filter(feed => feed.field3) // pastikan ada data BPM
      .map(feed => ({
        date: new Date(feed.created_at).toISOString().split("T")[0],
        bpm: Number(feed.field3),
      }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchApi();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const transformed = transformFeedsToChartData(bpm.feeds);
    setChartData(transformed);
  }, [bpm.feeds]);

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              {bpm.feeds.length === 0 ? (
                <p className='text-center'>Loading data...</p>
              ) : (
                <SectionCards bpm={bpm} />
              )}
            </div>
            <div className='p-5'>
              <ChartAreaInteractive chartData={chartData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
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
