
import { LogOut } from "lucide-react";
import { signOut } from "@/auth";

type AdminHeaderProps = {
  name: string;
  email: string;
};

export default function AdminHeader({
  name,
  email,
}: AdminHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-[#101621] px-5 py-5 sm:px-8">
      <div>
        <p className="text-sm text-slate-400">
          Novacrest Capital / Administration
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">
          Dashboard Overview
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-slate-400">{email}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/15 font-bold text-violet-300">
          {name.charAt(0).toUpperCase()}
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            aria-label="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:border-red-500/40 hover:text-red-300"
          >
            <LogOut size={19} />
          </button>
        </form>
      </div>
    </header>
  );
}
