// Same heading style (font, size, colour) on every section
export default function SectionHeading({ title, subtitle, align = "center" }) {
  return (
    <div className={align === "center" ? "mx-auto mb-10 max-w-2xl text-center" : "mb-8"}>
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
