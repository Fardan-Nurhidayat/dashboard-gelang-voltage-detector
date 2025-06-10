import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
interface TableProps {
  feeds: ThingSpeakFeed[];
}

export default function Tables({ feeds }: TableProps) {
  const users = [
    { id: 0, name: "Vinn" },
    { id: 1, name: "Arfa" },
    { id: 2, name: "Fardan" },
    { id: 3, name: "Farhan" },
    { id: 4, name: "Lutfhi" },
    { id: 5, name: "Rakha" },
    { id: 6, name: "izza" },
    { id: 7, name: "Reza" },
    { id: 8, name: "Josef" },
    { id: 9, name: "Angga" },
  ];
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
  function groupFeedsByUserId(feeds: ThingSpeakFeed[]) {
    return feeds.reduce<Record<string, ThingSpeakFeed>>((acc, feed) => {
      const userId = feed.field5;
      if (!userId) return acc;

      // Simpan entri terbaru untuk user ini
      if (
        !acc[userId] ||
        new Date(feed.created_at) > new Date(acc[userId].created_at)
      ) {
        acc[userId] = feed;
      }

      return acc;
    }, {});
  }
  const groupedFeeds = groupFeedsByUserId(feeds);

  // Transform ke struktur per-user
  const usersWithFeeds = users.map(user => {
    const latestFeed = groupedFeeds[user.id.toString()] || {};
    return {
      name: user.name,
      location:
        latestFeed.field1 && latestFeed.field2
          ? `${latestFeed.field1}, ${latestFeed.field2}`
          : "-",
      bpm: latestFeed.field3 || "-",
      voltage: latestFeed.field4 || "-",
      frequency: latestFeed.field6 ? `${latestFeed.field6} Hz` : "-",
      battery: latestFeed.field7 ? `${latestFeed.field7}%` : "-",
      bpmStatus: latestFeed.field8 || "-",
    };
  });

  return (
    <div className='rounded-lg border bg-white shadow-sm overflow-hidden'>
      <Table>
        <TableCaption className='text-muted-foreground text-sm p-4 text-center'>
          Data statistik dan informasi terkini dari sistem
        </TableCaption>

        <TableHeader className='bg-muted/40'>
          <TableRow className='border-b'>
            <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[120px]'>
              Nama
            </TableHead>
            <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]'>
              Lokasi
            </TableHead>
            <TableHead className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]'>
              BPM
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
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className='divide-y divide-muted/20'>
          {usersWithFeeds.length > 0 ? (
            usersWithFeeds.map((user, index) => (
              <TableRow
                key={index}
                className='hover:bg-muted/20 transition-colors duration-150'>
                <TableCell className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  {user.name}
                </TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <a
                    href={
                      "https://www.google.com/maps/search/?api=1&query=" +
                      user.location
                    }
                    target='_blank'
                    rel={"noopener noreferrer"}>
                    {user.location}
                  </a>
                </TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                  {user.bpm}
                </TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.voltage === "1"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                    {user.voltage === "1" ? "High" : "Low"}
                  </span>
                </TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                  {user.frequency}
                </TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                  {user.battery}
                </TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap text-sm'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.bpmStatus === "1"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                    {user.bpmStatus === "1" ? "Bahaya" : "Normal"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className='px-6 py-8 text-center text-sm text-muted-foreground'>
                Tidak ada data tersedia
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
