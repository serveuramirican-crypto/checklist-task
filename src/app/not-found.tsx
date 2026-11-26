import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#090c10] p-4 text-center font-pixel text-xs text-amber-300">
      <h2 className="text-base text-red-400">404 - LOST IN THE WASTELAND</h2>
      <p className="text-[10px] text-slate-400">This survival sector does not exist.</p>
      <Link
        href="/"
        className="pixel-btn mt-2 border-amber-400 bg-amber-500/20 px-3 py-1.5 text-amber-200"
      >
        RETURN TO CAMP
      </Link>
    </div>
  );
}
