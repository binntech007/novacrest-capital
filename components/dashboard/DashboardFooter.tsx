
export default function DashboardFooter() {
  return (
    <footer className="flex flex-col justify-between gap-2 border-t border-white/8 pt-5 text-xs text-slate-500 sm:flex-row">
      <p>© {new Date().getFullYear()} Novacrest Capital.</p>
      <p>Account overview and customer services.</p>
    </footer>
  );
}
