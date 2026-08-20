// src/components/events/EventCardSkeleton.jsx
export default function EventCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden" aria-hidden="true">
      {/* Image placeholder */}
      <div className="h-48 skeleton rounded-t-2xl" />
      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 skeleton rounded-full w-3/4" />
        <div className="h-4 skeleton rounded-full w-1/2" />
        {/* Meta */}
        <div className="space-y-2 pt-1">
          <div className="h-3 skeleton rounded-full w-2/3" />
          <div className="h-3 skeleton rounded-full w-1/2" />
        </div>
        {/* Footer */}
        <div className="flex justify-between pt-1">
          <div className="h-3 skeleton rounded-full w-1/4" />
          <div className="h-3 skeleton rounded-full w-1/6" />
        </div>
      </div>
    </div>
  );
}
