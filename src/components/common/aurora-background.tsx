export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="motion-safe:animate-aurora-1 absolute -top-1/4 left-[10%] size-[36rem] rounded-full bg-primary/30 blur-[110px] will-change-transform" />
      <div className="motion-safe:animate-aurora-2 absolute top-[5%] right-[5%] size-[32rem] rounded-full bg-tertiary/25 blur-[120px] will-change-transform" />
      <div className="motion-safe:animate-aurora-3 absolute -bottom-1/4 left-[35%] size-[34rem] rounded-full bg-accent/40 blur-[130px] will-change-transform" />
    </div>
  );
}
