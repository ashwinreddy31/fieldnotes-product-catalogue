import { FormEvent, useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, type EnquiryInput, type Product } from "./api";

function App() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    api.categories().then(setCategories).catch((error: Error) => setCategoryError(error.message));
  }, []);

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Fieldnotes home">
          <span className="brand-mark" aria-hidden="true">f.</span>
          <span>fieldnotes<span className="brand-period">.</span></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link to="/">Discover</Link>
          <div className="category-nav">
            <span>Shop</span>
            <div className="category-menu">
              {categories.map((category) => (
                <Link key={category} to={`/category/${encodeURIComponent(category)}`}>
                  {prettyCategory(category)}
                </Link>
              ))}
              {categoryError && <span className="nav-error" role="status">{categoryError}</span>}
            </div>
          </div>
          <Link to="/enquiry">Get in touch</Link>
        </nav>
        <SearchBox />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <Link className="brand footer-brand" to="/"><span className="brand-mark">f.</span><span>fieldnotes.</span></Link>
        <p>Good things, thoughtfully found.</p>
        <span>© {new Date().getFullYear()} Fieldnotes</span>
      </footer>
    </div>
  );
}

function SearchBox() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <form className="search-form" role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor="site-search">Search products</label>
      <input
        id="site-search"
        data-testid="search-input"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search finds..."
      />
      <button type="submit" data-testid="search-submit" aria-label="Search products">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
      </button>
    </form>
  );
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.featured()
      .then(setProducts)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> A little more considered</p>
          <h1>Everyday things,<br /><em>exceptionally</em> found.</h1>
          <p className="hero-description">A thoughtful edit of the pieces that make life feel a little more like yours.</p>
          <a className="button button-dark" href="#featured">Explore the edit <span aria-hidden="true">↘</span></a>
        </div>
        <div className="hero-art" aria-label="Curated home and lifestyle collection">
          <div className="art-sun" />
          <div className="art-shape art-shape-back" />
          <div className="art-shape art-shape-front" />
          <div className="art-caption"><span>THE DAILY EDIT</span><span>№ 01 — 05</span></div>
          <div className="art-stamp">GOOD<br />FINDS<br /><span>ONLY</span></div>
        </div>
        <div className="hero-index"><span>SCROLL TO DISCOVER</span><span className="index-line" /><span>01 / 04</span></div>
      </section>
      <section className="featured-section content-width" id="featured">
        <div className="section-heading">
          <div><p className="eyebrow">THE SHORTLIST</p><h2>Five worth knowing.</h2></div>
          <p>Chosen for the details.<br />Loved for the everyday.</p>
        </div>
        {loading && <Loading label="Finding your next favourite..." />}
        {error && <ErrorNotice message={error} />}
        {!loading && !error && <ProductGrid products={products} testId="featured-products" />}
      </section>
      <section className="quote-band">
        <span aria-hidden="true">“</span>
        <p>Buy less, choose well, make it last.</p>
        <span className="quote-attribution">A BETTER WAY TO FIND YOUR NEXT FAVOURITE</span>
      </section>
    </>
  );
}

function CategoryPage() {
  const { category = "" } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.products(undefined, category)
      .then(setProducts)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [category]);

  const ranked = [...products].sort((a, b) => b.rating.rate - a.rating.rate);
  const topRated = ranked.slice(0, Math.min(3, ranked.length));
  const topIds = new Set(topRated.map((product) => product.id));
  const additional = products.filter((product) => !topIds.has(product.id));

  return (
    <section className="listing-page content-width">
      <Breadcrumbs current={prettyCategory(category)} />
      <div className="listing-heading">
        <p className="eyebrow">THE COLLECTION</p>
        <h1>{prettyCategory(category)}<span className="brand-period">.</span></h1>
        <p>A considered collection of little things with a lot to love.</p>
      </div>
      {loading && <Loading label="Gathering the collection..." />}
      {error && <ErrorNotice message={error} />}
      {!loading && !error && products.length === 0 && <EmptyState message="Nothing in this collection yet." />}
      {!loading && !error && products.length > 0 && (
        <>
          <ProductSection title="The most-loved" subtitle="Top rated by the people who found them first." products={topRated} testId="top-rated-products" />
          {additional.length > 0 && <ProductSection title="More to discover" subtitle="A few more good things to meet." products={additional} testId="additional-products" />}
        </>
      )}
    </section>
  );
}

function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.products(query)
      .then(setProducts)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <section className="listing-page content-width">
      <Breadcrumbs current="Search" />
      <div className="listing-heading">
        <p className="eyebrow">A GOOD PLACE TO START</p>
        <h1>Search<span className="brand-period">.</span></h1>
        <p>{query ? <>Showing matches for <strong>“{query}”</strong></> : "Find something you’ll love."}</p>
      </div>
      {loading && <Loading label="Looking for your find..." />}
      {error && <ErrorNotice message={error} />}
      {!loading && !error && products.length === 0 && <EmptyState message={query ? `No finds for “${query}”. Try another search.` : "Type a search above to get started."} />}
      {!loading && !error && products.length > 0 && <ProductGrid products={products} testId="search-results" />}
    </section>
  );
}

function ProductPage() {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.product(id)
      .then(setProduct)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <section className="content-width page-state"><Loading label="Opening the details..." /></section>;
  if (error) return <section className="content-width page-state"><ErrorNotice message={error} /></section>;
  if (!product) return <section className="content-width page-state"><EmptyState message="We couldn't find that product." /></section>;

  return (
    <section className="product-detail content-width">
      <Breadcrumbs current={product.title} />
      <div className="product-detail-grid">
        <div className="product-detail-image"><img src={product.image} alt={product.title} /></div>
        <div className="product-detail-copy">
          <p className="eyebrow">{prettyCategory(product.category)}</p>
          <h1 data-testid="product-title">{product.title}</h1>
          <div className="detail-rating"><span aria-label={`${product.rating.rate} out of 5 stars`}>★ {product.rating.rate}</span><span>{product.rating.count} reviews</span></div>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          <a className="button button-dark" href="#product-enquiry">Ask us about this find <span aria-hidden="true">↘</span></a>
          <div className="product-promises"><span>Thoughtfully picked</span><span>Made for everyday</span></div>
        </div>
      </div>
      <div className="detail-enquiry" id="product-enquiry">
        <div><p className="eyebrow">LET'S TALK DETAILS</p><h2>Curious about this one?</h2><p>Send us a note and our team will be in touch.</p></div>
        <EnquiryForm productTitle={product.title} />
      </div>
    </section>
  );
}

function EnquiryPage() {
  return (
    <section className="enquiry-page content-width">
      <Breadcrumbs current="Get in touch" />
      <div className="enquiry-layout">
        <div className="enquiry-intro">
          <p className="eyebrow">WE'RE ALL EARS</p>
          <h1>Good finds.<br /><em>Good conversations.</em></h1>
          <p>Have a question, a thought, or just want to say hello? Leave us a note and we’ll get back to you.</p>
          <div className="contact-note"><span className="contact-dot" /> Usually back within one working day</div>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}

function EnquiryForm({ productTitle }: { productTitle?: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!form.email.trim()) nextErrors.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (!form.phone.trim()) nextErrors.phone = "Please enter your phone number.";
    if (!form.message.trim()) nextErrors.message = "Please tell us a little more.";
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    try {
      const enquiry: EnquiryInput = { ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), message: form.message.trim(), productTitle };
      await api.submitEnquiry(enquiry);
      setStatus("success");
    } catch (reason) {
      setStatus("error");
      setSubmitError(reason instanceof Error ? reason.message : "Your message couldn't be sent. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="thank-you" role="status" data-testid="enquiry-success">
        <span className="thank-you-icon" aria-hidden="true">✓</span>
        <p className="eyebrow">MESSAGE RECEIVED</p>
        <h2>Thank you, {form.name.trim()}.</h2>
        <p>Your note is safely with us. We’ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={submit} noValidate data-testid="enquiry-form">
      <div className="form-grid">
        <FormField id="enquiry-name" label="Your name" value={form.name} onChange={(value) => updateField("name", value)} error={errors.name} autoComplete="name" />
        <FormField id="enquiry-email" label="Email address" type="email" value={form.email} onChange={(value) => updateField("email", value)} error={errors.email} autoComplete="email" />
        <FormField id="enquiry-phone" label="Phone number" type="tel" value={form.phone} onChange={(value) => updateField("phone", value)} error={errors.phone} autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="enquiry-message">Your message <span>*</span></label>
        <textarea id="enquiry-message" data-testid="enquiry-message" value={form.message} onChange={(event) => updateField("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "enquiry-message-error" : undefined} rows={5} />
        {errors.message && <span className="field-error" id="enquiry-message-error">{errors.message}</span>}
      </div>
      {submitError && <p className="form-submit-error" role="alert">{submitError}</p>}
      <button className="button button-dark submit-button" type="submit" disabled={status === "sending"} data-testid="enquiry-submit">
        {status === "sending" ? "Sending your note..." : "Send your note"} <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}

function FormField({ id, label, type = "text", value, onChange, error, autoComplete }: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id}>{label} <span>*</span></label>
      <input id={id} type={type} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} data-testid={id} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </div>
  );
}

function ProductSection({ title, subtitle, products, testId }: { title: string; subtitle: string; products: Product[]; testId: string }) {
  return (
    <div className="product-section">
      <div className="product-section-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><span>{products.length.toString().padStart(2, "0")} FINDS</span></div>
      <ProductGrid products={products} testId={testId} />
    </div>
  );
}

function ProductGrid({ products, testId }: { products: Product[]; testId: string }) {
  if (products.length === 0) return <EmptyState message="No products to show just yet." />;
  return (
    <div className="product-grid" data-testid={testId}>
      {products.map((product, index) => (
        <article className="product-card" key={product.id} data-testid="product-card">
          <Link to={`/product/${product.id}`} className="product-card-link" aria-label={`View ${product.title}`}>
            <div className="product-image-wrap">
              <span className="product-number">{String(index + 1).padStart(2, "0")}</span>
              <img src={product.image} alt={product.title} loading="lazy" />
              <span className="product-view">Meet the find <span aria-hidden="true">↗</span></span>
            </div>
            <div className="product-card-meta"><span>{prettyCategory(product.category)}</span><span className="card-rating">★ {product.rating.rate}</span></div>
            <h3>{product.title}</h3>
            <p className="product-price">{formatPrice(product.price)}</p>
          </Link>
        </article>
      ))}
    </div>
  );
}

function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{current}</span>
    </nav>
  );
}

function Loading({ label }: { label: string }) {
  return <div className="loading-state" role="status" data-testid="loading"><span className="loader" />{label}</div>;
}

function ErrorNotice({ message }: { message: string }) {
  return <div className="error-notice" role="alert" data-testid="api-error"><span aria-hidden="true">!</span><p>{message}</p></div>;
}

function EmptyState({ message }: { message: string }) {
  return <div className="empty-state" data-testid="empty-state">{message}</div>;
}

function NotFound() {
  return <section className="page-state content-width"><p className="eyebrow">OFF THE MAP</p><h1>That find got away.</h1><p>Let's take you back to the good stuff.</p><Link className="button button-dark" to="/">Back to the edit</Link></section>;
}

function prettyCategory(category: string) {
  return category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toLocaleUpperCase());
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export default App;
