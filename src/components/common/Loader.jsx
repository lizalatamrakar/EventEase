export default function Loader({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 page-wrapper flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-white/50 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
}
