import { useRef, useState } from 'react';
import { cn } from '../../lib/cn';

interface CodeInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  /** Oculta los dígitos (PIN). */
  secret?: boolean;
  label: string;
  autoFocus?: boolean;
  /** `one-time-code` permite que iOS/Android ofrezcan el código del SMS. */
  autoComplete?: string;
}

/**
 * Código de N dígitos con un solo input real (se puede pegar el código
 * completo y el teclado ofrece el SMS); las casillas son solo visuales.
 */
export function CodeInput({ length, value, onChange, secret, label, autoFocus, autoComplete = 'one-time-code' }: CodeInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, length - 1);

  return (
    <div className="relative" onClick={() => ref.current?.focus()}>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, length))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={length}
        aria-label={label}
        className="absolute inset-0 h-full w-full opacity-0"
        style={{ fontSize: 16 }}
      />
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }} aria-hidden>
        {Array.from({ length }).map((_, i) => {
          const digit = value[i];
          return (
            <span
              key={i}
              className={cn(
                'num grid h-[60px] place-items-center rounded-md border-[1.5px] text-[26px] text-ink transition-colors',
                digit ? 'border-ink bg-white' : 'border-transparent bg-cream-deep',
                focused && i === active && !digit && 'border-ink',
              )}
            >
              {digit ? (secret ? <span className="h-3 w-3 rounded-full bg-ink" /> : digit) : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}
