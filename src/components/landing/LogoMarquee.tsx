const brands = ["Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn"];

function LogoPill({ name }: { name: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="liquid-glass flex h-6 w-6 items-center justify-center rounded-lg text-xs font-semibold text-foreground/90">
        {name[0]}
      </span>
      <span className="text-base font-semibold text-foreground">{name}</span>
    </div>
  );
}

export function LogoMarquee() {
  return (
    <div className="mx-auto w-full max-w-5xl px-8 pb-10">
      <div className="flex flex-col items-center gap-12 md:flex-row">
        <p className="shrink-0 text-sm leading-tight text-foreground/50">
          Trusted by finance teams
          <br />
          across the globe
        </p>

        <div className="marquee-mask relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee gap-16">
            {[...brands, ...brands].map((name, i) => (
              <LogoPill key={`${name}-${i}`} name={name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
