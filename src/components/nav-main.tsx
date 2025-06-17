import { IconDashboard } from "@tabler/icons-react";
import { CalendarPlus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {  Link } from "react-router";

export function NavMain() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.is_admin;

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        {/* Dashboard selalu tampil */}
        <SidebarMenu>
          <Link to='/dashboard'>
            <SidebarMenuItem className='flex items-center gap-2'>
              <SidebarMenuButton
                tooltip='Dashboard'
                className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer'>
                <IconDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>

        {/* Histori hanya ditampilkan jika is_admin === 0 */}
        {isAdmin === 0 && (
          <SidebarMenu>
            <SidebarMenuItem className='flex items-center gap-2'>
              <Link to={`/histori-data/${user.id}`}>
                {" "}
                {/* Bisa diganti sesuai ID pengguna aktif */}
                <SidebarMenuButton
                  tooltip='Histori'
                  className='bg-secondary text-secondary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer'>
                  <CalendarPlus />
                  <span>History</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
