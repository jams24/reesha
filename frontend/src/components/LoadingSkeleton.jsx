export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-neutral-200" />
      <div className="mt-3 h-3 bg-neutral-200 w-3/4" />
      <div className="mt-2 h-3 bg-neutral-200 w-1/3" />
    </div>
  );
}
