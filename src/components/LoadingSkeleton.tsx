"use client";

export default function LoadingSkeleton() {
  return (
    <div className="absolute inset-3 sm:inset-4 rounded-[28px] overflow-hidden card-glass">
      <div className="absolute inset-0 card-glass-inner rounded-[28px] pointer-events-none" />
      <div className="relative h-full flex flex-col justify-between p-5 sm:p-6">
        {/* Top */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl animate-shimmer" />
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded-md animate-shimmer" />
              <div className="h-2.5 w-16 rounded-md animate-shimmer" />
            </div>
          </div>
          <div className="h-6 w-14 rounded-full animate-shimmer" />
        </div>

        {/* Middle */}
        <div className="space-y-3 py-8">
          <div className="h-7 w-full rounded-lg animate-shimmer" />
          <div className="h-7 w-4/5 mx-auto rounded-lg animate-shimmer" />
          <div className="h-7 w-3/5 mx-auto rounded-lg animate-shimmer" />
        </div>

        {/* Bottom */}
        <div className="space-y-3">
          <div className="flex gap-2.5">
            <div className="flex-1 h-20 rounded-2xl animate-shimmer" />
            <div className="flex-1 h-20 rounded-2xl animate-shimmer" />
          </div>
          <div className="h-1.5 w-full rounded-full animate-shimmer" />
          <div className="flex justify-between">
            <div className="h-4 w-24 rounded animate-shimmer" />
            <div className="h-4 w-32 rounded animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
