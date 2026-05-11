import { experienceLogos } from "@/lib/landing-content";

const tickerLogos = [...experienceLogos, ...experienceLogos];

export function ExperienceTicker() {
  return (
    <section className="experience-band border-b bg-background">
      <div className="container-page py-8 sm:py-10">
        <div className="grid gap-5 lg:grid-cols-[0.46fr_1fr] lg:items-center">
          <div>
            <p className="section-label text-primary">Our experience</p>
            <h2 className="mt-2 max-w-xl text-xl font-semibold leading-snug text-pretty sm:text-2xl">
              Years of operational, technical, and domain expertise, with workflows and intelligence baked in.
            </h2>
          </div>
          <div className="experience-ticker" tabIndex={0} aria-label="Company experience logos">
            <div className="experience-ticker-track">
              {tickerLogos.map((logo, index) => {
                const duplicate = index >= experienceLogos.length;

                return (
                  <div key={`${logo.label}-${index}`} className="experience-logo-tile" aria-hidden={duplicate}>
                    <img src={logo.path} alt={duplicate ? "" : logo.label} loading="lazy" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
