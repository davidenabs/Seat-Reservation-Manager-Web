export default function AdBanner() {
  return (
    <div className="w-[340px] shrink-0 sticky top-28 max-md:hidden">
      <div className="rounded-lg overflow-hidden shadow-2xl shadow-[#E8593C]/10 transition-transform hover:scale-[1.02] duration-500">
        <img src="/home-ads.svg" alt="Advertisement" className="w-full h-auto" />
      </div>
    </div>
  );
}
