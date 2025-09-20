import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/../components/Dashboard/sidebar"
import { DynamicNavbar } from "@/../components/Dashboard/DynamicNavbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DynamicNavbar />
        <div className="flex flex-1 flex-col gap-4 p-2 md:p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
