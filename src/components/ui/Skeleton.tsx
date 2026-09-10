import { cn } from '../../lib/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn('rounded-lg skeleton-shimmer', className)}
    aria-hidden="true"
  />
);
