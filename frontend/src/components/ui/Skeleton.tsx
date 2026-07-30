interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-200/80 ${className}`}>
      <div className="shimmer absolute inset-0 animate-shimmer" />
    </div>
  );
}

export default Skeleton;
