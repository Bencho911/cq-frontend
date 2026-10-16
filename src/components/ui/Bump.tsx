import { useState } from 'react';
import { cn } from '../../lib/cn';

interface BumpProps {
  value: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Da un pequeño salto cuando `value` sube (p. ej. al agregar al carrito).
 * No salta al montar ni cuando el valor baja.
 */
export function Bump({ value, className, children }: BumpProps) {
  const [prev, setPrev] = useState(value);
  const [bumps, setBumps] = useState(0);
  if (value !== prev) {
    setPrev(value);
    if (value > prev) setBumps(bumps + 1);
  }
  return (
    <span key={bumps} className={cn('inline-block', bumps > 0 && 'bump', className)}>
      {children}
    </span>
  );
}
