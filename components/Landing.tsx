"use client";
import { useEffect, useState, type ReactNode, type ComponentType } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Download,
  Sparkles,
  Star,
  Shield,
  Users,
  Trophy,
  Rocket,
  Zap,
  Play,
} from "lucide-react";
import Image from "next/image";

// Brand palette merged with logo-inspired gradient accents
const brand = {
  bg: "#0B0A10", // deep space
  surface: "#141320",
  primary: "#8B8AB2", // lavender base
  secondary: "#89AEBF", // teal support
  accent: "#F24BA2", // pink accent for text/icons
  accentFrom: "#FF7A18", // logo orange
  accentVia: "#FF3D81", // logo pink
  accentTo: "#A270FF", // logo violet
};
// Highest to lowest
const RANKS = [
  "Apex Ascendant",
  "Peakbound",
  "Crestwarden",
  "High Climber",
  "Navigator",
  "Pathfinder",
  "Trail Setter",
  "Wayfarer",
  "Valeborn",
];
function rankClass(name: string) {
  switch (name) {
    case "Valeborn":
      return "border border-sky-400/40 text-sky-200 bg-sky-600/10";
    case "Wayfarer":
      return "border border-cyan-400/40 text-cyan-200 bg-cyan-600/10";
    case "Trail Setter":
      return "border border-emerald-400/40 text-emerald-200 bg-emerald-600/10";
    case "Pathfinder":
      return "border border-lime-400/40 text-lime-200 bg-lime-700/10";
    case "Navigator":
      return "border border-amber-400/40 text-amber-200 bg-amber-700/10";
    case "High Climber":
      return "border border-orange-500/60 text-orange-200 bg-orange-900/20";
    case "Crestwarden":
      return "border border-fuchsia-400/40 text-fuchsia-200 bg-fuchsia-700/10";
    case "Peakbound":
      return "border border-white/50 text-white bg-white/10 backdrop-blur-sm shadow-[0_0_24px_rgba(255,255,255,0.25)]";
    case "Apex Ascendant":
      return "relative overflow-hidden border border-rose-500/50 text-rose-100 bg-gradient-to-r from-red-900 via-rose-700 to-red-900 shadow-[0_0_24px_rgba(244,63,94,0.45)]";
    default:
      return "border border-white/15 text-white/85 bg-white/5";
  }
}

function cx(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

function NeonBackdrop() {
  const [starsBg, setStarsBg] = useState<string | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const svg = starsSvg();
      setStarsBg(`url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`);
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,rgba(155,140,248,0.28),_transparent_55%),radial-gradient(ellipse_at_bottom,rgba(14,85,110,0.25),_transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-50"
        style={starsBg ? { backgroundImage: starsBg } : undefined}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 [perspective:800px]">
        <div className="absolute inset-0 origin-bottom [transform:rotateX(70deg)] bg-[linear-gradient(transparent_0_23%,rgba(162,112,255,0.25)_24%),linear-gradient(90deg,transparent_0_23%,rgba(255,61,129,0.22)_24%)] bg-[size:3rem_3rem] [mask-image:linear-gradient(to_top,rgba(0,0,0,0.9),transparent_70%)]" />
      </div>
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)",
          backgroundSize: "100% 3px",
        }}
      />
      <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_0_200px_rgba(0,0,0,0.7)]" />
    </div>
  );
}

function starsSvg() {
  const stars = Array.from({ length: 400 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 0.9 + 0.2,
    o: Math.random() * 0.9 + 0.1,
  }))
    .map(
      (s) =>
        `<circle cx="${s.x}%" cy="${s.y}%" r="${s.r}" fill="white" opacity="${s.o}"/>`
    )
    .join("");
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>${stars}</svg>`;
}

function easeOutQuad(x: number) {
  // Stronger easing to accentuate leftward curve
  return 1 - Math.pow(1 - x, 3);
}

// Variants to orchestrate bottom-to-top fade for ranks
const rankContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 1.1,
      staggerChildren: 0.12,
      staggerDirection: -1, // last child first (lowest rank)
    },
  },
} as const;

const rankItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

function RankList() {
  const [maxOffset, setMaxOffset] = useState(160);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      let v = 140;
      if (w >= 1536) v = 360; // 2xl (lighter)
      else if (w >= 1280) v = 320; // xl (lighter)
      else if (w >= 1024) v = 270; // lg (lighter)
      else if (w >= 768) v = 200; // md (lighter)
      else v = 140; // sm and below (lighter)
      setMaxOffset(v);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-10"
      variants={rankContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {RANKS.map((r, i) => {
        const t = i / (RANKS.length - 1);
        const top = 6 + 88 * t; // keep a bit of padding top/bottom
        const offset = Math.round(easeOutQuad(t) * maxOffset);
        const apexNudge = Math.round(maxOffset * 0.12); // move Apex slightly left to align over Peakbound
        const transform =
          r === "Apex Ascendant"
            ? `translate(calc(-50% - ${offset}px - ${apexNudge}px), -50%)`
            : `translate(calc(-${offset}px), -50%)`;
        return (
          <motion.div
            key={r}
            style={{
              position: "absolute",
              top: `${top}%`,
              left: "50%",
              transform,
            }}
            variants={rankItem}
            className={cx(
              "relative rounded-full px-3 py-1.5 text-xs sm:text-sm",
              rankClass(r),
              i <= 2
                ? "shadow-[0_0_22px_rgba(162,112,255,0.25)] ring-1 ring-white/20"
                : "shadow-[0_6px_18px_-8px_rgba(162,112,255,0.20)] ring-1 ring-white/10"
            )}
          >
            <span className="relative z-10 inline-flex items-center gap-1">
              {r}
              {r === "Apex Ascendant" && <Sparkles className="size-3" />}
            </span>
            {r === "Apex Ascendant" && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1 w-1/3 bg-gradient-to-r from-white/10 to-transparent"
                animate={{ x: ["-20%", "140%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function SevenColumns({
  compact = false,
  pulse = false,
}: {
  compact?: boolean;
  pulse?: boolean;
}) {
  const heights = [12, 18, 28, 36, 48, 64, 84];
  return (
    <div
      className={cx(
        "grid grid-cols-7 gap-1 sm:gap-2 items-end",
        compact ? "h-16" : "h-20 sm:h-28 md:h-40"
      )}
    >
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0.2, opacity: 0.6 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
            delay: i * 0.06,
          }}
          className="relative rounded-sm sm:rounded bg-gradient-to-t from-[color:var(--accent-from,theme(colors.orange.500))]/60 via-[color:var(--accent-via,theme(colors.pink.500))]/70 to-[color:var(--accent-to,theme(colors.violet.500))]/90 shadow-[0_10px_30px_-8px_rgba(162,112,255,0.45),0_0_0_1px_rgba(255,61,129,0.35)]"
          style={{ height: `${h}%` }}
        >
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[rgba(255,122,24,0.9)] blur-[1px]" />
          {pulse && (
            <motion.div
              className="absolute inset-0 rounded-sm sm:rounded border border-[rgba(255,61,129,0.55)]"
              animate={{ opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.05 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function Marquee({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex gap-8 py-3 text-sm sm:text-base text-white/70"
        animate={{ x: [0, -600] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((t, idx) => (
          <div key={idx} className="inline-flex items-center gap-2">
            <Star className="size-4" />
            <span className="break-words">{t}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function GlitchText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("relative select-none", className)}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 translate-x-[1px] translate-y-[-1px] text-[--accent] opacity-70 blur-[0.4px]"
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 -translate-x-[1px] translate-y-[1px] text-[--secondary] opacity-60 blur-[0.4px]"
      >
        {children}
      </span>
    </div>
  );
}

function CRTCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative rounded-2xl p-5 sm:p-8 bg-[--surface]/70 ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_-16px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 [background:linear-gradient(rgba(255,255,255,0.04),rgba(0,0,0,0.06))] rounded-2xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)`,
          backgroundSize: "100% 3px",
        }}
      />
      {children}
    </div>
  );
}

function PhoneMock() {
  const { scrollYProgress } = useScroll();
  const rot = useTransform(scrollYProgress, [0, 1], [0, 8]);
  return (
    <motion.div
      style={{ rotate: rot }}
      className="relative w-[200px] sm:w-[260px] md:w-[300px] aspect-[9/19] rounded-[2.5rem] border border-white/10 bg-black overflow-hidden shadow-[0_40px_120px_-20px_rgba(155,140,248,0.4)]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-8 rounded-b-2xl bg-black/60" />
      <div className="absolute inset-3 rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/ascendappscreenshot.jpg"
          className="h-full w-full object-cover"
        >
          <source src="/apppreview.mp4" type="video/mp4" />
        </video>
      </div>
    </motion.div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <CRTCard>
      <div className="flex items-start gap-4">
        <div className="rounded-xl p-2 bg-white/5 ring-1 ring-white/10">
          <Icon className="size-6 text-[--accent]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white/90">{title}</h3>
          <p className="text-white/70 mt-1 leading-relaxed break-words">
            {body}
          </p>
        </div>
      </div>
    </CRTCard>
  );
}

function CTAButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href="#download"
        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-[--accent-from] via-[--accent-via] to-[--accent-to] text-white font-semibold px-5 py-3 hover:brightness-110 transition shadow-[0_8px_24px_rgba(255,61,129,0.35)] w-full sm:w-auto justify-center"
      >
        <Download className="size-5" /> Get the app
        <ArrowRight className="size-5 group-hover:translate-x-0.5 transition" />
      </a>
      <a
        href="#trailer"
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 text-white/90 px-5 py-3 hover:bg-white/5 transition w-full sm:w-auto justify-center"
      >
        <Play className="size-5" /> Watch trailer
      </a>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 flex items-start gap-3"
      >
        <span className="mt-1">
          <Zap className="size-4 text-[--accent]" />
        </span>
        <span className="font-medium text-white/90">{q}</span>
        <span className="ml-auto text-[--secondary]">{open ? "-" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-5 text-white/70"
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AscendLanding() {
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--bg", brand.bg);
    r.setProperty("--surface", brand.surface);
    r.setProperty("--primary", brand.primary);
    r.setProperty("--secondary", brand.secondary);
    r.setProperty("--accent", brand.accent);
    r.setProperty("--accent-from", brand.accentFrom);
    r.setProperty("--accent-via", brand.accentVia);
    r.setProperty("--accent-to", brand.accentTo);
  }, []);

  return (
    <main
      className="min-h-dvh text-white"
      style={{
        background: `radial-gradient(1200px_800px_at_70%_-10%, rgba(162,112,255,0.25), transparent), radial-gradient(800px_600px_at_10%_10%, rgba(255,61,129,0.18), transparent), ${brand.bg}`,
      }}
    >
      <NeonBackdrop />

      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <div className="size-10 rounded-md bg-gradient-to-tr from-[--accent-from] via-[--accent-via] to-[--accent-to] shadow-[0_0_22px_rgba(255,61,129,0.9)] flex items-center justify-center overflow-hidden">
                <Image
                  src="/ascendlogo.png"
                  alt="Ascend logo"
                  width={44}
                  height={44}
                  priority
                  className="h-[44px] w-[44px] object-contain"
                />
                <span className="sr-only">Ascend</span>
              </div>
              <span className="font-semibold tracking-wide">ASCEND</span>
            </a>
          </div>
          <nav className="ml-auto hidden sm:flex items-center gap-6 text-white/80">
            <a href="#how" className="hover:text-white">
              How it works
            </a>
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
            <a href="#download" className="hover:text-white">
              Download
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 sm:pt-24 pb-12">
        <div className="grid md:grid-cols-2 items-center gap-8 md:gap-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Sparkles className="size-3" /> Built for real-life progress
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-black leading-tight">
              <GlitchText>Level up your real life</GlitchText>
            </h1>
            <p className="mt-3 text-white/75 max-w-prose">
              Improve your life across the 7 Columns of Life. Post progress,
              earn XP, and grow with a your Inner Circle that keeps you
              accountable.
            </p>
            <div className="mt-6">
              <CTAButtons />
            </div>
            <div className="mt-6">
              <Marquee
                items={[
                  "3 posts/day",
                  "Inner Circle - 5 friends",
                  "Photo proof",
                  "Global Leaderboard",
                  "Weekly/All-Time ranks",
                ]}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <PhoneMock />
          </div>
        </div>

        <div className="mt-12 sm:mt-14">
          <h2 className="text-center text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            <GlitchText className="[text-shadow:0_0_24px_rgba(255,61,129,0.45)]">
              7 Columns of Life
            </GlitchText>
          </h2>
          <div className="mt-5 sm:mt-6">
            <SevenColumns />
            <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs md:text-sm text-white/80 leading-tight">
              {[
                "Knowledge",
                "Fitness",
                "Wealth",
                "Social",
                "Career",
                "Inner Balance",
                "Environment",
              ].map((label) => (
                <div key={label} className="px-1">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ranks showcase */}
      <section
        id="ranks"
        className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12"
      >
        <motion.h2
          className="text-center text-2xl sm:text-4xl font-extrabold tracking-tight"
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <GlitchText className="[text-shadow:0_0_24px_rgba(255,61,129,0.35)]">
            {RANKS.length} Ranks to show Progress
          </GlitchText>
        </motion.h2>
        {/* Removed redundant caption */}
        <div className="mt-6 sm:mt-8 relative min-h-[520px] sm:min-h-[620px] md:min-h-[720px]">
          {/* Background mountain image (only behind ranks) */}
          <motion.div
            aria-hidden
            className="absolute inset-0 -z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <Image
              src="/Mountain.png"
              alt=""
              fill
              priority={false}
              className="object-cover object-top opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/60" />
          </motion.div>
          <RankList />
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16"
      >
        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
          <Feature
            icon={Rocket}
            title="Three posts a day"
            body="Share up to 3 proof‑of‑action posts with a photo."
          />
          <Feature
            icon={Users}
            title="Your inner circle"
            body="Invite up to five friends. See progress, keep each other accountable and keep score on leaderboards."
          />
          <Feature
            icon={Shield}
            title="Earn XP & rank up for progressing in Real Life"
            body="Everyone starts at LVL 0 here. Ascend is about becoming better, not being good. Earn XP and see how you Rank Worldwide! Here you have a chance to become the most Productive Person in the World!"
          />
        </div>
      </section>

      {/* Features grid */}
      <section
        id="features"
        className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <Feature
            icon={Rocket}
            title="Global/Friend Leaderboards"
            body="See how you rank among friends and globally, with weekly and all‑time views."
          />
          <Feature
            icon={Trophy}
            title="Streaks & XP"
            body="Consistency is key! And thus unlocks multipliers. Watch your columns climb over time."
          />
          <Feature
            icon={Users}
            title="Profile overview"
            body="Name, handle, avatar, three goals, circle and global rank, and XP per column."
          />
        </div>
      </section>

      {/* Trailer / Showcase */}
      <section
        id="trailer"
        className="relative mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16"
      >
        <CRTCard>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="aspect-video rounded-xl overflow-hidden ring-1 ring-white/10 bg-black/60 flex items-center justify-center">
              <div className="text-white/60 text-sm">
                teaser video coming soon!
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">
                See columns climb in real time
              </h3>
              <p className="text-white/70 mt-2">
                Short demo of logging, XP gain, and the seven‑pillar dashboard.
                No ads. No doomscroll loop. Just action to reward.
              </p>
              <div className="mt-4">
                <CTAButtons />
              </div>
            </div>
          </div>
        </CRTCard>
      </section>

      {/* Download */}
      <section
        id="download"
        className="relative mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16"
      >
        <CRTCard>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="grow">
              <h3 className="text-2xl font-semibold">Get Ascend</h3>
              <p className="text-white/70 mt-2">
                iOS TestFlight and Android Beta are rolling out soon!. Once they
                do you can join and help here!
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 rounded-xl bg-[--primary] text-white font-semibold px-4 py-2"
                  href="#"
                >
                  iOS TestFlight
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-xl bg-[--secondary] text-white font-semibold px-4 py-2"
                  href="#"
                >
                  Android Beta
                </a>
                <a
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2"
                  href="https://discord.gg/q39YJXgbfQ"
                >
                  Join Discord
                </a>
              </div>
            </div>
            <SevenColumns compact />
          </div>
        </CRTCard>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="relative mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16"
      >
        <div className="grid gap-4">
          <FAQItem
            q="Whats the Point?"
            a="Ascend Gamifies real-life progress across 7 key areas. Build habits, stay accountable with friends, and climb the ranks together."
          />
          <FAQItem
            q="Why only five friends?"
            a="Small parties create accountability and motivation without turning it into a popularity contest."
          />
          <FAQItem
            q="Do I need ratings from others?"
            a="Not necessarily. Photo proof is the main way to validate posts, but friends can give encouragement and feedback."
          />
          <FAQItem
            q="Is there a Subscription or Ads?"
            a="Nope! 0 Ads, 0 Subscriptions. We believe in empowering real-life progress without force-feeding you trash to make 3 cents exta."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 text-sm text-white/60 flex flex-wrap items-center gap-4">
          <div>© {new Date().getFullYear()} Ascend</div>
          <div className="ml-auto flex items-center gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="mailto:contact@ascendapp.eu" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
