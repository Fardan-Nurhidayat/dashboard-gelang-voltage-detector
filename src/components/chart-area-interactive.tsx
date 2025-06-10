"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartConfig = {
  bpm: {
    label: "BPM",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  chartData,
}: {
  chartData: { date: string; bpm: number }[];
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("24h");
    }
  }, [isMobile]);

  // Function to group data by day and get the latest entry for each day
  const groupDataByDay = (data: { date: string; bpm: number }[]) => {
    const grouped = data.reduce((acc, item) => {
      // Extract date part only (YYYY-MM-DD) from ISO string
      const dateKey = new Date(item.date).toISOString().split("T")[0];

      if (
        !acc[dateKey] ||
        new Date(item.date) > new Date(acc[dateKey].originalDate)
      ) {
        acc[dateKey] = {
          date: dateKey, // Use date only for chart display
          bpm: item.bpm,
          originalDate: item.date, // Keep original timestamp for comparison
        };
      }

      return acc;
    }, {} as Record<string, { date: string; bpm: number; originalDate: string }>);

    // Return only date and bpm, sorted by date
    return Object.values(grouped)
      .map(({ date, bpm }) => ({ date, bpm }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const filteredData = React.useMemo(() => {
    const now = new Date();
    let startDate: Date;

    // Calculate start date based on time range
    switch (timeRange) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Filter data based on time range
    const filtered = chartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });

    // For 24h view, don't group by day - show all data points
    if (timeRange === "24h") {
      return filtered.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    // For 7d and 30d views, group by day and get latest entry for each day
    return groupDataByDay(filtered);
  }, [chartData, timeRange]);

  const getTimeRangeDescription = () => {
    switch (timeRange) {
      case "24h":
        return "Last 24 hours";
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      default:
        return "Last 30 days";
    }
  };

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Total BPM</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            {getTimeRangeDescription()}{" "}
            {timeRange !== "24h" ? "(Latest reading per day)" : ""}
          </span>
          <span className='@[540px]/card:hidden'>
            {getTimeRangeDescription()}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={setTimeRange}
            variant='outline'
            className='hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex'>
            <ToggleGroupItem value='30d'>Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value='7d'>Last 7 days</ToggleGroupItem>
            <ToggleGroupItem value='24h'>Last 24 hours</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={setTimeRange}>
            <SelectTrigger
              className='flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden'
              size='sm'
              aria-label='Select a value'>
              <SelectValue placeholder='Last 30 days' />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem
                value='30d'
                className='rounded-lg'>
                Last 30 days
              </SelectItem>
              <SelectItem
                value='7d'
                className='rounded-lg'>
                Last 7 days
              </SelectItem>
              <SelectItem
                value='24h'
                className='rounded-lg'>
                Last 24 hours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient
                id='fillBpm'
                x1='0'
                y1='0'
                x2='0'
                y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-bpm)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-bpm)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                if (timeRange === "24h") {
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    const date = new Date(value);
                    if (timeRange === "24h") {
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    }
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='bpm'
              type='natural'
              fill='url(#fillBpm)'
              stroke='var(--color-bpm)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
