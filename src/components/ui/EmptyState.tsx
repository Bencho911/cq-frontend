import type { LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-deep text-muted">
        <Icon size={28} strokeWidth={1.75} aria-hidden />
      </div>
      <h3 className="text-[16px] font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-[280px] text-[13px] leading-relaxed text-muted">{description}</p>}
      {action}
    </div>
  );
}
