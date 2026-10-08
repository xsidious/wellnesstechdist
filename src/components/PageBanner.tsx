export function PageBanner({
  kicker,
  title,
  lede,
  image,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  image: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-banner">
      <div className="wrap page-banner-grid">
        <div className="stack">
          <span className="kicker">{kicker}</span>
          <h1>{title}</h1>
          <p className="lede">{lede}</p>
          {children}
        </div>
        <img className="banner-photo" src={image} alt="" />
      </div>
    </section>
  );
}
