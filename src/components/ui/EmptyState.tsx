import type { LucideIcon } from 'lucide-react';

/** Estado vacío: una ilustración de marca o un ícono de línea, sin círculo. */
export function EmptyState({
  icon: Icon,
  image,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  /** Ilustración corporativa (tiene prioridad sobre `icon`). */
  image?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      {image ? (
        <img src={image} alt="" aria-hidden className="mb-1 h-[120px] w-auto object-contain" />
      ) : Icon ? (
        <Icon size={36} strokeWidth={1.5} className="text-muted" aria-hidden />
      ) : null}
      <h3 className="font-display text-[22px] font-extrabold text-ink">{title}</h3>
      {description && <p className="max-w-[290px] text-[15px] leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
