import { cn } from '@/lib/utils';

interface MovingBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds for one lap of the border */
  duration?: number;
  /** Length of the travelling light, in px */
  size?: number;
  /** Corner radius of the border path, in px */
  radius?: number;
  children: React.ReactNode;
}

/**
 * Container with a light that laps its border, driven by `offset-path`.
 * Zero dependencies — one keyframe does the whole thing.
 */
export function MovingBorder({
  duration = 4,
  size = 90,
  radius = 12,
  children,
  className,
  style,
  ...props
}: MovingBorderProps) {
  return (
    <div
      {...props}
      data-slot="moving-border"
      style={
        {
          '--mb-duration': `${duration}s`,
          '--mb-size': `${size}px`,
          '--mb-radius': `${radius}px`,
          borderRadius: radius,
          ...style,
        } as React.CSSProperties
      }
      className={cn('relative overflow-hidden bg-background p-px', className)}
    >
      {/* Under reduced motion the light is replaced by a static glow on two
          opposite corners, showing through the same 1px gap. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 motion-reduce:bg-[linear-gradient(135deg,var(--brand-via),transparent_35%,transparent_65%,var(--brand-via))]"
      >
        <span
          className="absolute aspect-square w-(--mb-size) bg-[radial-gradient(circle,var(--brand-via),transparent_65%)] motion-safe:animate-moving-border motion-reduce:hidden"
          style={{
            offsetPath: 'rect(0 auto auto 0 round var(--mb-radius))',
          }}
        />
      </span>
      <div className="relative z-10 h-full w-full rounded-[inherit] border bg-background">
        {children}
      </div>
    </div>
  );
}
