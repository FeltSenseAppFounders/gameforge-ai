import { Sidebar, TopBar } from "@/features/dashboard";
import { MobileSidebarProvider } from "@/features/dashboard/MobileSidebarProvider";
import { MobileSidebarDrawer } from "@/features/dashboard/MobileSidebarDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileSidebarProvider>
      <div className="flex min-h-screen bg-surface-dark">
        <Sidebar />
        <MobileSidebarDrawer />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </MobileSidebarProvider>
  );
}
