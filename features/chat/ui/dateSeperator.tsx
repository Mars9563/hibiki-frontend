export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <div className="flex-1 h-px bg-[#2e2e33]" />
      <span className="pixel-font text-[0.6rem] text-[#666] tracking-widest uppercase shrink-0">
        {date}
      </span>
      <div className="flex-1 h-px bg-[#2e2e33]" />
    </div>
  );
}
