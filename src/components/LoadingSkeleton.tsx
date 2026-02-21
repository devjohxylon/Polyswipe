"use client";

export default function LoadingSkeleton() {
  return (
    <div className="absolute inset-4 rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]">
      <div className="h-full flex flex-col justify-between p-6">
        {/* Top */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 rounded-full animate-shimmer" />
          <div className="h-6 w-16 rounded-full animate-shimmer" />
        </div>

        {/* Middle */}
        <div className="space-y-3 py-8">
          <div className="h-8 w-full rounded-lg animate-shimmer" />
          <div className="h-8 w-3/4 mx-auto rounded-lg animate-shimmer" />
          <div className="h-8 w-1/2 mx-auto rounded-lg animate-shimmer" />
        </div>

        {/* Bottom */}
        <div className="space-y-4">
          <div className="h-3 w-full rounded-full animate-shimmer" />
          <div className="flex justify-between">
            <div className="h-5 w-24 rounded animate-shimmer" />
            <div className="h-5 w-24 rounded animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
