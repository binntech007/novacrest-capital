
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminOverview from "@/components/admin/AdminOverview";

type AdminDashboardProps = {
  name: string;
  email: string;
  customerCount: number;
  adminCount: number;
  activeUserCount: number;
};

export default function AdminDashboard({
  name,
  email,
  customerCount,
  adminCount,
  activeUserCount,
}: AdminDashboardProps) {
  return (
    <main className="min-h-screen bg-[#090c13] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <section className="min-w-0 flex-1">
          <AdminHeader name={name} email={email} />

          <AdminOverview
            name={name}
            email={email}
            customerCount={customerCount}
            adminCount={adminCount}
            activeUserCount={activeUserCount}
          />
        </section>
      </div>
    </main>
  );
}
