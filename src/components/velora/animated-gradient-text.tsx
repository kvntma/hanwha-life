import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Keep the animation while rendering a solid foreground colour. */
  solid?: boolean;
}

export function AnimatedGradientText({
  className,
  children,
  solid = false,
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      data-slot="animated-gradient-text"
      className={cn(
        "motion-safe:animate-gradient inline-block bg-gradient-to-r from-brand-from via-brand-via to-brand-to bg-[length:300%_auto] bg-clip-text",
        solid ? "text-black dark:text-white" : "text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
