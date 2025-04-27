import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { date } from "zod";

import { useEffect, useState } from "react";
// import data from "../src/app/dashboard/data.json";

export default function Page() {
  const [bpm, setBpm] = useState([]);
  const fetchApi = async () => {
    const url = "https://api.thingspeak.com/channels/2922736/fields/3.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // console.log(response);
      const data = await response.json();
      return setBpm(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // fetchApi();

    const interval = setInterval(() => {
      fetchApi();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              <SectionCards bpm={bpm} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
