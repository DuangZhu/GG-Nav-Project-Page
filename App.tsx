import {
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import {
  benchmarkResults,
  navItems,
  siteConfig,
  videos,
  type VideoEntry,
} from "./site";

type IconName =
  | "arrow"
  | "check"
  | "code"
  | "copy"
  | "eye"
  | "file"
  | "ground"
  | "menu"
  | "message"
  | "pause"
  | "play"
  | "route"
  | "spark"
  | "x";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    code: (
      <>
        <path d="m8 9-3 3 3 3" />
        <path d="m16 9 3 3-3 3" />
        <path d="m14 5-4 14" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h6" />
      </>
    ),
    ground: (
      <>
        <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    message: (
      <>
        <path d="M21 14a4 4 0 0 1-4 4H9l-5 3v-5a5 5 0 0 1-1-3V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        <path d="M8 10h8M8 14h5" />
      </>
    ),
    pause: (
      <>
        <path d="M9 5v14M15 5v14" />
      </>
    ),
    play: <path d="m9 6 9 6-9 6Z" />,
    route: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h2a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.4 4.1L17 9l-3.6 1.9L12 15l-1.4-4.1L7 9l3.6-1.9Z" />
        <path d="m5 15 .7 2.1L8 18.3l-2.3 1.2L5 22l-.7-2.5L2 18.3l2.3-1.2Z" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  );
}

function SectionIntro({
  eyebrow,
  title,
  children,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-intro section-intro--${align}`} data-reveal>
      <p className="section-eyebrow">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      <div className="section-lead">{children}</div>
    </div>
  );
}

function VideoPlayer({
  entry,
  featured = false,
}: {
  entry: VideoEntry;
  featured?: boolean;
}) {
  const [sourceState, setSourceState] = useState<
    "checking" | "available" | "missing"
  >("checking");
  const statusId = useId();

  useEffect(() => {
    const controller = new AbortController();

    fetch(entry.src, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        const contentType = response.headers.get("content-type") ?? "";
        setSourceState(
          response.ok && !contentType.includes("text/html")
            ? "available"
            : "missing",
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSourceState("missing");
      });

    return () => controller.abort();
  }, [entry.src]);

  const fileName = entry.src.split("/").at(-1);

  return (
    <div
      className={`video-player ${featured ? "video-player--featured" : ""}`}
      aria-describedby={statusId}
    >
      {sourceState === "available" ? (
        <video
          controls
          playsInline
          preload="metadata"
          onError={() => setSourceState("missing")}
        >
          <source src={entry.src} type="video/mp4" />
          {entry.captions ? (
            <track
              default
              kind="captions"
              label="English"
              src={entry.captions}
              srcLang="en"
            />
          ) : null}
          Your browser does not support HTML video.
        </video>
      ) : (
        <div className="video-placeholder">
          <img
            alt=""
            aria-hidden="true"
            loading={featured ? "eager" : "lazy"}
            src={entry.poster}
            style={{ objectPosition: entry.posterPosition }}
          />
          <div className="video-placeholder__shade" />
          <div className="video-placeholder__scan" />
          <div className="video-placeholder__content">
            <span className="video-placeholder__icon">
              {sourceState === "checking" ? (
                <span className="loading-ring" />
              ) : (
                <Icon name="play" size={24} />
              )}
            </span>
            <p>
              {sourceState === "checking"
                ? "Checking video source"
                : "Video slot ready"}
            </p>
            <code>public/videos/{fileName}</code>
          </div>
          <div className="video-corners" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      )}
      <span className="sr-only" id={statusId} aria-live="polite">
        {sourceState === "available"
          ? `${entry.title} video is available.`
          : `${entry.title} video placeholder. Add ${fileName} to the public videos folder.`}
      </span>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!window.location.hash) return;

    const revealAndScroll = () => {
      const target = document.querySelector<HTMLElement>(window.location.hash);
      if (!target) return;
      if (target instanceof HTMLDetailsElement) target.open = true;
      if (target.matches("[data-reveal]")) target.classList.add("is-visible");
      target
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((element) => element.classList.add("is-visible"));
      target.scrollIntoView({ block: "start", behavior: "auto" });
    };

    const frame = window.requestAnimationFrame(revealAndScroll);
    const timer = window.setTimeout(revealAndScroll, 180);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  const copyCitation = async () => {
    await navigator.clipboard.writeText(siteConfig.bibtex);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="topbar">
        <a
          aria-label="GG-Nav home"
          className="brand"
          href="#overview"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand__wordmark">
            <strong>GG</strong>
            <span>-Nav</span>
          </span>
        </a>

        <nav
          aria-label="Primary navigation"
          className={menuOpen ? "nav nav--open" : "nav"}
        >
          {navItems.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="topbar__actions">
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            <Icon name={menuOpen ? "x" : "menu"} />
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="overview">
          <div className="hero__ambient hero__ambient--one" />
          <div className="hero__ambient hero__ambient--two" />
          <div className="container hero__grid">
            <div className="hero__copy" data-reveal>
              <p className="hero__eyebrow">
                <span className="live-dot" />
                Goal-oriented grounding for embodied navigation
              </p>
              <h1>
                <span>GG-Nav:</span> Goal-oriented Grounding Chain-of-Thought
                Elicits Reasoning in Navigation Foundation Models
              </h1>
              <p className="hero__description">{siteConfig.description}</p>

              <div className="authors" aria-label="Authors">
                {siteConfig.authors.map((author, index) => (
                  <span className="author" key={author.name}>
                    {author.name}
                    <sup>
                      {author.affiliations.join(",")}
                      {author.mark}
                    </sup>
                    {index < siteConfig.authors.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
              <div className="affiliations">
                {siteConfig.affiliations.map((affiliation, index) => (
                  <span key={affiliation}>
                    <sup>{index + 1}</sup>
                    {affiliation}
                  </span>
                ))}
              </div>

              <div className="hero__actions">
                <a
                  className="button button--primary"
                  href={siteConfig.paperUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon name="file" />
                  Read paper
                  <Icon name="arrow" />
                </a>
                <a
                  className="button button--secondary"
                  href={siteConfig.codeUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon name="code" />
                  Code
                </a>
                <a className="button button--ghost" href="#method">
                  <Icon name="play" />
                  Watch video
                </a>
                <a
                  className="button button--ghost"
                  href="#citation"
                >
                  Cite
                </a>
              </div>

              <div className="hero__meta">
                <span>
                  <Icon name="ground" size={15} />
                  Explicit grounding
                </span>
                <span>
                  <Icon name="eye" size={15} />
                  Streaming evidence
                </span>
                <span>
                  <Icon name="message" size={15} />
                  Active dialogue
                </span>
              </div>
            </div>

            <div className="hero-visual" aria-label="GG-Nav visual overview">
              <svg
                aria-hidden="true"
                className="hero-route"
                viewBox="0 0 620 650"
              >
                <path
                  className="hero-route__shadow"
                  d="M70 485 C75 370 180 405 210 305 S332 162 415 231 S565 205 550 78"
                />
                <path
                  className="hero-route__line"
                  d="M70 485 C75 370 180 405 210 305 S332 162 415 231 S565 205 550 78"
                />
                <circle cx="70" cy="485" r="8" />
                <circle className="route-pulse" cx="550" cy="78" r="10" />
              </svg>

              <div className="observation-card observation-card--past">
                <span className="observation-card__label">FRAME · t−1</span>
                <div className="synthetic-room">
                  <span className="synthetic-room__wall" />
                  <span className="synthetic-room__plant synthetic-room__plant--one" />
                  <span className="synthetic-room__plant synthetic-room__plant--two" />
                  <span className="ground-box ground-box--one">
                    <i>plant_0</i>
                  </span>
                </div>
                <span className="observation-card__status">
                  <Icon name="eye" size={14} /> evidence retained
                </span>
              </div>

              <div className="observation-card observation-card--now">
                <span className="observation-card__label">CURRENT · t</span>
                <div className="synthetic-room synthetic-room--current">
                  <span className="synthetic-room__wall" />
                  <span className="synthetic-room__plant synthetic-room__plant--one" />
                  <span className="synthetic-room__plant synthetic-room__plant--two" />
                  <span className="ground-box ground-box--one">
                    <i>plant_0</i>
                  </span>
                  <span className="ground-box ground-box--two">
                    <i>plant_3</i>
                  </span>
                </div>
                <span className="observation-card__status observation-card__status--active">
                  <span className="live-dot" /> 2 instances grounded
                </span>
              </div>

              <div className="decision-chip decision-chip--evidence">
                <span>Observation → Evidence</span>
                <strong>Tracked plant_0</strong>
              </div>
              <div className="overview-actions" aria-label="Possible grounded actions">
                <div className="decision-chip decision-chip--action">
                  <span>Evidence to Action</span>
                </div>
                <div className="decision-chip decision-chip--talk">
                  <span>&lt;talk&gt;</span>
                  <strong>
                    <Icon name="message" size={15} /> Which one?
                  </strong>
                </div>
                <div className="decision-chip decision-chip--move">
                  <span>&lt;move&gt;</span>
                  <svg className="overview-move-route" viewBox="0 0 92 28" aria-hidden="true">
                    <path d="M4 22 C24 22 24 8 45 8 S66 20 82 10" />
                    <path d="m76 6 8 3-5 7" />
                    <circle cx="5" cy="22" r="3" />
                  </svg>
                </div>
              </div>

              <div className="mascot-stage">
                <span className="mascot-stage__halo" />
                <img
                  alt="GG-Nav mascot peeking into the navigation scene"
                  src={siteConfig.mascotUrl}
                />
              </div>

            </div>
          </div>

          <a className="scroll-cue" href="#motivation">
            <span>Explore the project</span>
            <i />
          </a>
        </section>

        <section className="section motivation-section" id="motivation">
          <div className="container motivation-grid">
            <div>
              <SectionIntro
                eyebrow="The motivation"
                title="The robot has already seen the target. Why does it still fail to reach it?"
              >
                <p>
                  Once a target is observed, the robot must continuously track it, navigate toward it, and stop nearby. However, end-to-end action generation alone may fail to preserve critical evidence across time, leading to unreliable decisions.
                </p>
              </SectionIntro>
              <div className="motivation-insight" data-reveal>
                <Icon name="spark" size={24} />
                <p>
                  We need a mechanism that extracts key evidence from streaming
                  observations and carries it forward to support action decisions.
                </p>
              </div>
            </div>

            <div className="failure-orbit" data-reveal>
              <div className="failure-orbit__ring">
                <div className="failure-orbit__center">
                  <strong>68%</strong>
                  <span>of failures</span>
                </div>
              </div>
              <div className="failure-stat failure-stat--seen">
                <p>
                  Target appears in observations,
                  <br />but the robot still fails to reach it.
                </p>
              </div>
              <svg aria-hidden="true" viewBox="0 0 620 520">
                <path d="M318 76 C453 80 525 153 540 251" />
              </svg>
            </div>
          </div>
        </section>

        <section className="section method-section" id="method">
          <div className="container">
            <h2 className="method-title" data-reveal>
              How GG-Nav reasons from observation to action
            </h2>
            <div className="feature-video method-video" data-reveal>
              <VideoPlayer entry={videos[0]} featured />
            </div>
          </div>
        </section>

        <section className="section results-section" id="results">
          <div className="container">
            <SectionIntro
              eyebrow="Experiments"
              title="Two Tasks in Three Benchmarks"
            >
              <p>
                GG-Nav consistently improves both ObjectNav and interactive
                instance-goal navigation, with gains that trace directly back to
                stronger evidence retention and explicit localization.
              </p>
            </SectionIntro>

            <div className="benchmark-grid">
              {benchmarkResults.map((result) => (
                <article
                  className={`benchmark-card benchmark-card--${result.accent}`}
                  data-reveal
                  key={result.benchmark}
                >
                  <div className="benchmark-card__top">
                    <span className="result-keyword">{result.benchmark} &mdash; {result.task}</span>
                  </div>
                  <div className="benchmark-card__score">
                    <strong>{result.score}</strong>
                    <span>{result.unit}</span>
                  </div>
                  <span className="benchmark-card__line" />
                </article>
              ))}
            </div>

          </div>
        </section>

        <section className="section demo-section" id="demos">
          <div className="container">
            <SectionIntro
              align="center"
              eyebrow="Real-world demos"
              title={<>Four Exploration Settings<br />with Increasing Difficulty</>}
            >
              <p>
                From Category-Level Navigation to Ambiguous Long-Horizon Instance Navigation
              </p>
            </SectionIntro>

            <div className="demo-grid">
              {videos.slice(1).map((video, index) => (
                <article className="demo-card" data-reveal key={video.id}>
                  <div className="demo-card__heading">
                    <h3>Case {index + 1}: {video.title}</h3>
                  </div>
                  <VideoPlayer entry={video} />
                  <div className="demo-card__body">
                    <p>{video.description}</p>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        <section className="section paper-section" id="contact">
          <div className="container">
            <SectionIntro
              eyebrow="Citing & contact"
              title="Cite GG-Nav"
            >
              <p>
                If you find our work useful, please consider citing it.
              </p>
            </SectionIntro>

            <div className="citation-contact" data-reveal>
              <div className="citation-block" id="citation">
                <pre>{siteConfig.bibtex}</pre>
                <button onClick={copyCitation} type="button">
                  <Icon name={copied ? "check" : "copy"} />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <a className="contact-card" href="mailto:zhushh9@zju.edu.cn">
                <span>Contact</span>
                <strong>zhushh9@zju.edu.cn</strong>
                <Icon name="arrow" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__route" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="container footer__inner">
          <div className="footer__brand">
            <img alt="" src={siteConfig.mascotUrl} />
            <div>
              <strong>GG-Nav</strong>
              <span>Goal-oriented Grounding for Navigation</span>
            </div>
          </div>
          <p>
            Zhejiang University · Shanghai AI Laboratory
            <br />
            Preprint, 2026
          </p>
          <div className="footer__links">
            <a href="mailto:zhushh9@zju.edu.cn">Email</a>
            <a href="#overview">Back to top</a>
            <a href={siteConfig.paperUrl} rel="noreferrer" target="_blank">
              Paper
            </a>
            <a href={siteConfig.codeUrl} rel="noreferrer" target="_blank">
              Code
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
