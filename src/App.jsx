import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  CheckCircle, Mail, Phone, ChevronRight, ShieldCheck, Sparkles, Quote, Bot, X, Send, FileText
} from "lucide-react";

// === Admin visibility flag (Vite env) ===
const SHOW_ADMIN = import.meta.env.VITE_SHOW_ADMIN === "true";

function LogoLightCircle({ className }) {
  return (
    <svg className={className} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-label="Bizclear logo">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="32" fill="url(#g)" />
      <circle cx="48" cy="48" r="22" fill="white" opacity="0.85" />
      <circle cx="48" cy="48" r="12" fill="#e0f2fe" />
    </svg>
  );
}
function BrandLogo({ className, svg }) {
  if (svg && svg.indexOf("<svg") >= 0) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} aria-label="Bizclear logo" />;
  }
  return <LogoLightCircle className={className} />;
}

const brand = { sand: "#F4F2EE" };

const DEFAULT_CONFIG = {
  contact: { email: "bizclearconsulting@outlook.com", phone: "+64 21 390 191" },
  brandLogoSVG: "",
  hero: {
    title: "Start with a free Self Check‑in (quick, useful, human)",
    sub: "Power 25. Core 45. Prime 60. Designed for leaders who want clarity, momentum, and results.",
  },
  packages: [
    {
      id: "foundation",
      title: "Foundation Focus",
      why: "Build momentum with a steady rhythm and clear next steps.",
      price: "NZD $1,080 + GST",
      bullets: ["6 x Core 45 across 12 weeks", "Optional Prime 60 kick‑off", "Email support (responses within 48h, weekdays)"],
    },
    {
      id: "accelerator",
      title: "Leadership Accelerator",
      why: "Step change within a quarter: tighter cadence + fast feedback.",
      price: "NZD $1,935 + GST",
      bullets: ["8 x Core 45 (weekly or fortnightly)", "4 x Power 25 banked", "Instant messaging support (responses within 24h, weekdays)"],
      featured: true,
    },
    {
      id: "retainer",
      title: "Executive Retainer",
      why: "Stay sharp year‑round with lightweight, always‑on support.",
      price: "NZD $395 + GST / month",
      bullets: ["Monthly Core 45", "Two Power 25 / month", "Priority messaging (responses within 12–24h, weekdays)", "Optional quarterly Prime 60 calibration (+$245) with Self Check‑in add‑on"],
    },
    {
      id: "intensive",
      title: "Intensive (One‑off)",
      why: "Tackle a knotty decision or design a plan in one focused session.",
      price: "NZD $765 + GST",
      bullets: ["2‑hour Discover & Build your Plan", "Includes Intro Session + Self Check‑in", "3 x Power 25 follow‑ups", "Insight and recommendations pack", "Messaging support (6‑week window)"],
    },
    {
      id: "flexi",
      title: "Flexi Coaching",
      why: "Pay‑as‑you‑go for occasional check‑ins when you need them.",
      price: "From NZD $115 + GST / session",
      bullets: ["Power 25 or Core 45", "Optional day‑pass messaging add‑on", "Same focused approach, no commitment"],
    },
    {
      id: "team",
      title: "Leadership Team Intervention",
      why: "For teams that need alignment, clarity and delivery rhythm.",
      price: "Tailored programme",
      bullets: ["Discovery with senior sponsor", "Self Check‑in + targeted diagnostics", "Facilitated sessions and embeds", "Outcome roadmap & cadence", "Contact us to scope"],
    },
  ],
  testimonials: [
    { quote: "Brendan helped me cut through noise and make two critical decisions in a fortnight. Clarity and momentum in equal measure.", name: "COO, Energy sector", meta: "Executive client" },
    { quote: "Power 25 was a game changer for accountability. The rhythm stuck and our delivery cadence improved within a month.", name: "Tribe Lead, Financial services", meta: "Leadership client" },
    { quote: "The diagnostic plus Core 45 focus is gold. Practical, psychology‑backed, and immediately useful.", name: "Head of Product, SaaS", meta: "Product leadership" },
  ],
  valor: {
    explainer:
      "VALOR is a development‑only baseline across five areas: Value creation, Adaptability, Leadership energy, Outcomes discipline, and Regulation. It is evidence‑informed, not a hiring assessment. Reliability and validity are monitored via item analysis and iteration.",
  },
};

// --- items (neutral, human, broad) ---
const ITEM_BANK = [
  // Direction & Momentum
  { id: "dm1", text: "I have a simple picture of what good looks like for the next few months.", module: "Direction & Momentum" },
  { id: "dm2", text: "I’m acting on one or two meaningful priorities each week.", module: "Direction & Momentum" },
  // Energy & Recovery
  { id: "en1", text: "My energy is mostly steady across a typical week.", module: "Energy & Recovery" },
  { id: "en2", text: "I finish most days with some gas in the tank for life outside work.", module: "Energy & Recovery" },
  // Confidence & Voice
  { id: "cv1", text: "I speak up when it matters and feel heard.", module: "Confidence & Voice" },
  { id: "cv2", text: "I can ask for help or push back without over‑thinking it.", module: "Confidence & Voice" },
  // Focus & Flow
  { id: "ff1", text: "I protect time for deep work and limit busywork.", module: "Focus & Flow" },
  { id: "ff2", text: "Notifications and meetings are tamed enough to get real work done.", module: "Focus & Flow" },
  // Connection & Influence
  { id: "ci1", text: "I can bring people with me on decisions that matter.", module: "Connection & Influence" },
  { id: "ci2", text: "Key relationships get enough care and attention.", module: "Connection & Influence" },
  // Self‑awareness & Growth
  { id: "sg1", text: "I know my strengths and use them deliberately.", module: "Self‑awareness & Growth" },
  { id: "sg2", text: "I notice patterns (good and bad) and course‑correct quickly.", module: "Self‑awareness & Growth" },
  // Pace & Presence
  { id: "pp1", text: "I can slow down enough to think clearly when it counts.", module: "Pace & Presence" },
  { id: "pp2", text: "I notice small wins and let them land.", module: "Pace & Presence" },
];

const MODULE_ORDER = [
  "Direction & Momentum",
  "Energy & Recovery",
  "Confidence & Voice",
  "Focus & Flow",
  "Connection & Influence",
  "Self‑awareness & Growth",
  "Pace & Presence",
];

function toCSV(rows) {
  function esc(s) {
    return '"' + String(s).replace(/"/g, '""') + '"';
  }
  return rows.map((r) => r.map(esc).join(",")).join("\n");
}

function AdminPanel(props) {
  if (!SHOW_ADMIN) return null;
  const { cfg, setCfg, reset } = props;
  const [open, setOpen] = useState(false);
  useEffect(function () {
    if (location.hash.indexOf("admin") >= 0) setOpen(true);
  }, []);
  function update(path, value) {
    var copy = JSON.parse(JSON.stringify(cfg));
    var keys = path.split(".");
    var ref = copy;
    for (var i = 0; i < keys.length - 1; i++) {
      ref = ref[keys[i]];
    }
    ref[keys[keys.length - 1]] = value;
    setCfg(copy);
  }
  return (
    <div className="fixed bottom-5 left-5 z-50">
      <button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border bg-white hover:bg-slate-50 text-sm">
        CMS
      </button>
      {open && (
        <div className="mt-2 w-[min(92vw,720px)] max-h-[70vh] overflow-auto rounded-2xl border bg-white shadow-xl p-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Admin Panel</div>
            <div className="flex items-center gap-2">
              <button onClick={function () { reset(); }} className="px-2 py-1 border rounded">Reset</button>
              <button onClick={() => setOpen(false)} className="px-2 py-1 border rounded">Close</button>
            </div>
          </div>
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <label className="block">Hero title<textarea className="mt-1 w-full border rounded p-2" rows={2} value={cfg.hero.title} onChange={e => update("hero.title", e.target.value)} /></label>
            <label className="block">Hero sub<textarea className="mt-1 w-full border rounded p-2" rows={2} value={cfg.hero.sub} onChange={e => update("hero.sub", e.target.value)} /></label>
            <label className="block">Contact email<input className="mt-1 w-full border rounded p-2" value={cfg.contact.email} onChange={e => update("contact.email", e.target.value)} /></label>
            <label className="block">Contact phone<input className="mt-1 w-full border rounded p-2" value={cfg.contact.phone} onChange={e => update("contact.phone", e.target.value)} /></label>
            <label className="block md:col-span-2">VALOR explainer<textarea className="mt-1 w-full border rounded p-2" rows={3} value={cfg.valor.explainer} onChange={e => update("valor.explainer", e.target.value)} /></label>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatWidget() {
  const MAX_TURNS = 3; const storageKey = "bizclear_chat_turns"; const today = new Date().toISOString().slice(0, 10);
  const [open, setOpen] = useState(false); const [input, setInput] = useState("");
  useEffect(function () {
    function openIfAssistant() { if (location.hash.indexOf("assistant") >= 0) setOpen(true); }
    openIfAssistant(); window.addEventListener("hashchange", openIfAssistant);
    return function () { window.removeEventListener("hashchange", openIfAssistant); };
  }, []);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi - I'm Bizclear Assist (beta). You have 3 free interactions today. Ask a leadership, delivery, or focus question and I'll share a short coaching tip. For deeper work, request an Intro Session." }]);
  function getTurns() { try { const raw = localStorage.getItem(storageKey); if (!raw) return 0; const d = JSON.parse(raw); return d.date === today ? (d.used || 0) : 0; } catch (e) { return 0; } }
  function setTurns(u) { localStorage.setItem(storageKey, JSON.stringify({ date: today, used: u })); }
  const turnsLeft = Math.max(0, MAX_TURNS - getTurns());
  async function respond(t) {
    const s = t.toLowerCase();
    if (s.includes("block") || s.includes("stuck")) return "Quick steer: name the blocker, choose the smallest next step, and timebox a Power 25 to clear it.";
    if (s.includes("team") || s.includes("conflict")) return "Try a 4P check‑in: purpose, progress, problem, plan. If safety feels low, start with wins and clarify one decision.";
    if (s.includes("focus") || s.includes("overwhelm") || s.includes("priorit")) return "Use a 3x3 focus: three outcomes, three metrics, three next actions. Protect one 90‑minute deep work block.";
    if (s.includes("stakeholder") || s.includes("alignment")) return "Draft a one‑pager: context, goal, decision needed, options with pros/cons, recommendation. Share within 24 hours.";
    return "Let's define success, constraints, and the smallest meaningful win this week. Request an Intro Session if helpful.";
  }
  async function onSend() {
    if (!input.trim()) return; if (turnsLeft <= 0) { setMessages(m => m.concat([{ role: "assistant", text: "You've used your free interactions for today. Request a complimentary Intro Session to go further." }])); setInput(""); return; }
    const u = input.trim(); setMessages(m => m.concat([{ role: "user", text: u }])); setInput(""); setTurns(MAX_TURNS - (turnsLeft - 1)); const r = await respond(u); setMessages(m => m.concat([{ role: "assistant", text: r }])); }
  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full px-4 py-3 shadow-lg bg-sky-700 text-white hover:bg-sky-800">
        <Bot className="w-4 h-4" /> {open ? "Close" : "Coaching tip (free)"} <span className="text-white/80 text-xs">({turnsLeft} left)</span>
      </button>
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[min(92vw,380px)] rounded-2xl border bg-white shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="font-medium">Bizclear Assist</span><span className="text-white/70 text-xs ml-2">beta</span></div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="opacity-80 hover:opacity-100"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-3 max-h-[50vh] overflow-auto space-y-2 text-[14px]">
            {messages.map((m, i) => (<div key={i}><div className={`rounded-2xl px-3 py-2 inline-block ${m.role === "assistant" ? "bg-slate-100" : "bg-sky-50 border border-sky-100"}`}>{m.text}</div></div>))}
          </div>
          <div className="px-3 pb-3">
            <div className="text-[11px] text-slate-500 mb-1">Free demo: 3 messages per day. Developmental guidance only.</div>
            <div className="flex items-center gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") onSend(); }} className="flex-1 rounded-xl border px-3 py-2" placeholder="Ask a quick question..." />
              <button onClick={onSend} className="rounded-xl px-3 py-2 bg-sky-700 text-white hover:bg-sky-800"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const PKG_LABELS = {
  foundation: "Foundation Focus",
  accelerator: "Leadership Accelerator",
  retainer: "Executive Retainer",
  intensive: "Intensive (One‑off)",
  flexi: "Flexi Coaching",
  team: "Leadership Team Intervention",
};

export default function App() {
  const [cfg, setCfg] = useState(DEFAULT_CONFIG);
  const resetConfig = () => setCfg(DEFAULT_CONFIG);

  return (
    <div className="min-h-screen text-[15px] text-slate-900" style={{ background: `linear-gradient(180deg, ${brand.sand} 0%, #ffffff 45%)` }}>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><BrandLogo className="w-8 h-8" svg={cfg.brandLogoSVG} /><span className="font-semibold tracking-tight text-slate-800">Bizclear Coaching</span></div>
          <nav className="hidden md:flex items-center gap-6 text-slate-700">
            <a href="#packages" className="hover:text-slate-900">Packages</a>
            <a href="#diagnostics" className="hover:text-slate-900">Diagnostics</a>
            <a href="#testimonials" className="hover:text-slate-900">Testimonials</a>
            <a href="#checkin" className="hover:text-slate-900">Self Check‑in</a>
            <a href="#about" className="hover:text-slate-900">About</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
          </nav>
          <a href="#checkin" className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-sky-700 text-white hover:bg-sky-800 transition"><Sparkles className="w-4 h-4" /> Start Check‑in</a>
        </div>
      </header>

      <section className="bg-gradient-to-br from-sky-900 to-sky-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">Bizclear Coaching</h1>
          <p className="mt-2 text-white/90 text-[15px] md:text-base">{cfg.hero.title}</p>
          <p className="mt-1 text-white/80 text-sm">{cfg.hero.sub}</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href={`mailto:${cfg.contact.email}?subject=Intro%20Session%20Request`} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white text-sky-900 font-medium hover:bg-slate-100">
              Book an Intro Session <ChevronRight className="w-4 h-4" />
            </a>
            <a href="tel:+6421390191" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-sky-800/80 hover:bg-sky-800">
              <Phone className="w-4 h-4" /> Call +64&nbsp;21&nbsp;390&nbsp;191
            </a>
            <a href="#checkin" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 border border-white/30 bg-white/10 hover:bg-white/20">
              Take the Self Check‑in <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-6 text-sm text-white/80">
            Auckland, NZ · NZPB Reg. 90-07630 · <a className="underline decoration-white/40 underline-offset-4" href="tel:+6421390191">+64 21 390 191</a>
          </div>
        </div>
      </section>

      <Packages />
      <Diagnostics />
      <Testimonials />
      <CheckIn cfg={cfg} />
      <Contact cfg={cfg} />
      <ChatWidget />
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2"><BrandLogo className="w-6 h-6" svg={DEFAULT_CONFIG.brandLogoSVG} /> <span>© {new Date().getFullYear()} Bizclear Ltd. All rights reserved.</span></div>
            <div className="text-[12.5px]">Developmental use only. Not a clinical or hiring instrument. Privacy respecting: minimal note retention; documents shared on request.</div>
          </div>
        </div>
      </footer>

      {SHOW_ADMIN && <AdminPanel cfg={cfg} setCfg={setCfg} reset={resetConfig} />}

      {/* print styles */}
      <style>{`
        @media print {
          nav, header, footer, .no-print { display:none !important; }
          #resultsPrint { page-break-inside: avoid; }
          body { background: #fff; }
        }
      `}</style>
    </div>
  );
}

/* ---------------- Packages ----------------- */
function Packages() {
  const [selectedPkg, setSelectedPkg] = useState("accelerator");
  return (
    <section id="packages" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-semibold">Leadership Coaching Packages</h2>
      <p className="text-slate-600 mt-1">Short, focused sessions that convert insight to action.</p>
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEFAULT_CONFIG.packages.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelectedPkg(card.id)}
            className={`relative text-left rounded-2xl border bg-white p-6 shadow-sm hover:shadow transition focus:outline-none ${selectedPkg === card.id ? "ring-2 ring-sky-700 border-sky-700" : card.featured ? "ring-1 ring-sky-200" : ""}`}
            aria-pressed={selectedPkg === card.id}
          >
            {card.featured && <span className="absolute -top-2 right-3 rounded-full bg-sky-700 text-white text-[11px] px-2 py-0.5">Most popular</span>}
            <div className="text-sky-800 text-sm font-semibold">{card.title}</div>
            <div className="text-[13px] text-slate-600 mt-0.5">{card.why}</div>
            <div className="mt-2 text-lg font-semibold">{card.price}</div>
            <ul className="mt-3 space-y-2 text-sm">
              {card.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-sky-700" /> {b}
                </li>
              ))}
            </ul>
            {selectedPkg === card.id && (
              <a href={card.id === "team" ? "#contact" : "#checkin"} className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-sky-700 text-white hover:bg-sky-800">
                {card.id === "team" ? "Enquire about team coaching" : "Start Self Check‑in"} <ChevronRight className="w-4 h-4" />
              </a>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

/* --------------- Diagnostics --------------- */
function Diagnostics() {
  return (
    <section id="diagnostics" className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl bg-slate-50 border p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-semibold">Personalised diagnostics (used before or alongside Intro Session)</h3>
        <div className="mt-3 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-medium">Intro Session <span className="text-slate-500">(complimentary)</span></div>
            <p className="text-slate-600 mt-1">A focused 20‑minute conversation to unpack your results and outline options.</p>
          </div>
          <div>
            <div className="font-medium">Self Check‑in <span className="text-slate-500">(16–32 items)</span></div>
            <p className="text-slate-600 mt-1">A quick needs‑map to guide your Prime 60 and ongoing plan.</p>
          </div>
          <div>
            <div className="font-medium">VALOR© Core or Bespoke Modules</div>
            <p className="text-slate-600 mt-1">VALOR provides a broad capability baseline; Bespoke Modules target specific drivers like Focus & Flow, Confidence & Voice, Connection & Influence, and more.</p>
          </div>
        </div>
        <details className="mt-4 rounded-xl bg-white p-4 border text-sm"><summary className="cursor-pointer font-medium text-slate-800">What is VALOR©?</summary><p className="mt-2 text-slate-600">{DEFAULT_CONFIG.valor.explainer}</p></details>
        <p className="mt-4 text-[13.5px] text-slate-500 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Developmental use only (not for hiring or ratings). Reliability/validity monitored via item analysis and iteration; method notes supplied in plain English.</p>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ------------- */
function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-12">
      <h3 className="text-2xl font-semibold">Testimonials</h3>
      <p className="text-slate-600">Selected quotes from leaders I have coached (shared with consent; some names anonymised).</p>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {DEFAULT_CONFIG.testimonials.map((t, idx) => (
          <figure key={idx} className="rounded-2xl border bg-white p-6 shadow-sm">
            <Quote className="w-5 h-5 text-sky-700" />
            <blockquote className="mt-3 text-slate-800">"{t.quote}"</blockquote>
            <figcaption className="mt-3 text-sm text-slate-600">- <span className="font-medium text-slate-800">{t.name}</span> <span className="text-slate-500">· {t.meta}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ----------------- Check‑in ---------------- */
function CheckIn({ cfg }) {
  const items = useMemo(() => ITEM_BANK.slice(0, 32), []);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [showResults, setShowResults] = useState(false);

  const firstUnansweredRef = useRef(null);
  const resultsTopRef = useRef(null);

  const completion = Math.round(100 * ((Object.keys(answers).length / items.length) || 0));
  const ready = completion === 100 && !!name.trim() && !!email.trim();

  const moduleScores = useMemo(() => {
    const buckets = {};
    for (let it of items) {
      const v = answers[it.id];
      if (v) {
        (buckets[it.module] = buckets[it.module] || []).push(Math.max(1, Math.min(5, v)));
      }
    }
    return MODULE_ORDER.map((m) => {
      const arr = buckets[m] || [];
      const mean = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN;
      return { module: m, mean };
    });
  }, [answers, items]);

  function handleSetAnswer(id, val, idx) {
    setAnswers((a) => ({ ...a, [id]: val }));
    // record first unanswered for bounce‑back
    const unansweredIndex = items.findIndex((q) => !answers[q.id] && q.id !== id);
    if (unansweredIndex >= 0) firstUnansweredRef.current = `q_${items[unansweredIndex].id}`;
  }

  function findFirstMissing() {
    if (!name.trim()) return "name";
    if (!email.trim()) return "email";
    for (let q of items) if (!answers[q.id]) return `q_${q.id}`;
    return null;
  }

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function requireComplete(orDo) {
    const miss = findFirstMissing();
    if (miss) {
      scrollTo(miss);
      // brief highlight
      try {
        const el = document.getElementById(miss);
        el.classList.add("ring-2", "ring-rose-500");
        setTimeout(() => el.classList.remove("ring-2", "ring-rose-500"), 800);
      } catch {}
      return;
    }
    orDo?.();
  }

  function buildCSV() {
    const header = ["id", "item", "module", "score(1-5)"];
    const rows = [header].concat(items.map((it, i) => [it.id, it.text, it.module, answers[it.id] ? String(answers[it.id]) : ""]));
    return toCSV(rows);
  }

  function makeSummaryText() {
    const ms = moduleScores.filter((m) => !isNaN(m.mean)).map((m) => `${m.module}: ${m.mean.toFixed(2)}`).join("; ");
    return (
      `Self Check‑in (questions: ${items.length})\n` +
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nOrg/Role: ${org} / ${role}\nCompletion: ${completion}%\n\n` +
      `Module means: ${ms}\nNotes: ${notes}`
    );
  }

  function emailIntro() {
    requireComplete(() => {
      const subject = encodeURIComponent(`Self Check‑in – ${name || "Anonymous"}`);
      const body = encodeURIComponent(
        makeSummaryText() +
        `\n\n---\nRaw responses (CSV):\n` +
        buildCSV()
      );
      window.location.href = `mailto:${cfg.contact.email}?subject=${subject}&body=${body}`;
    });
  }

  function savePDF() {
    requireComplete(() => {
      setShowResults(true);
      setTimeout(() => {
        window.print();
      }, 180);
    });
  }

  return (
    <section id="checkin" className="mx-auto max-w-6xl px-4 py-12 bg-[#fff7ea]">
      <div className="rounded-3xl border bg-white p-6 md:p-8">
        <h3 className="text-2xl font-semibold">Self Check‑in Assessment</h3>
        <p className="text-slate-600">A quick, human sense‑check. 1–5 agreement scale. <span className="font-medium">1 = low</span>, <span className="font-medium">5 = high</span>.</p>

        <div id="intro" className="mt-6 grid md:grid-cols-2 gap-4">
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Full name (required)" aria-label="Full name" required />
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Email (required)" type="email" aria-label="Email" required />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Phone" type="tel" aria-label="Phone" />
          <input value={org} onChange={(e) => setOrg(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Organisation" aria-label="Organisation" />
          <input value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Role / Title" aria-label="Role" />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">Completion: <span className="font-medium text-slate-800">{completion}%</span></div>
            <div className="text-xs text-slate-500">Scale: <strong>1 low</strong> – <strong>5 high</strong></div>
          </div>

          <div className="mt-4 space-y-4">
            {items.map((it, idx) => (
              <div key={it.id} id={`q_${it.id}`} className="rounded-2xl border bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[12.5px] tracking-wide uppercase text-slate-500">{it.module}</div>
                    <div className="font-medium text-slate-900">{idx + 1}. {it.text}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => handleSetAnswer(it.id, n, idx)}
                        className={`w-9 h-9 rounded-lg border text-sm font-semibold ${answers[it.id] === n ? "bg-sky-700 text-white border-sky-700" : "bg-white hover:bg-slate-50"}`}
                        aria-label={`Select ${n} for item ${idx + 1}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-2xl border px-4 py-3" rows={4} placeholder="Optional context or goals for the Intro Session" />
        </div>

        {/* Primary CTA directly under questions */}
        <div className="mt-6 flex flex-wrap gap-3">
          {!ready ? (
            <button
              type="button"
              onClick={() => requireComplete(() => {})}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-slate-200 text-slate-700 cursor-not-allowed"
              title="Finish required fields to continue"
            >
              <FileText className="w-4 h-4" /> Assessment in progress
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setShowResults(true); setTimeout(() => resultsTopRef.current?.scrollIntoView({ behavior: "smooth" }), 50); }}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-slate-900 text-white hover:bg-black"
            >
              <FileText className="w-4 h-4" /> See my results
            </button>
          )}

          <button type="button" onClick={savePDF} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 border hover:bg-slate-50">
            <FileText className="w-4 h-4" /> Save PDF
          </button>

          <button type="button" onClick={emailIntro} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-sky-700 text-white hover:bg-sky-800">
            <Mail className="w-4 h-4" /> Book Intro (email)
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div id="resultsPrint" className="mt-10">
            <div ref={resultsTopRef} />
            <h4 className="text-xl font-semibold">Your results</h4>
            <p className="text-slate-600">Higher = stronger right now · Lower = room to grow</p>

            <div className="mt-4 grid md:grid-cols-2 gap-6">
              <RadarChart scores={moduleScores} />
              <SuggestedStarts scores={moduleScores} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function RadarChart({ scores }) {
  // normalize to 0..1
  const vals = scores.map((s) => (isNaN(s.mean) ? 0 : (s.mean - 1) / 4));
  const cx = 160, cy = 160, r = 120;
  const N = scores.length;
  function pt(i, scale = 1) {
    const ang = (-Math.PI / 2) + (i * 2 * Math.PI / N);
    return [cx + Math.cos(ang) * r * scale, cy + Math.sin(ang) * r * scale];
  }
  const axes = scores.map((_, i) => [ [cx, cy], pt(i) ]);
  const poly = vals.map((v, i) => {
    const [x, y] = pt(i, v);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="text-sm font-semibold text-sky-800 mb-2">Your Growth Map</div>
      <svg width="100%" height="340" viewBox="0 0 320 320">
        {/* rings */}
        {[0.25, 0.5, 0.75, 1].map((t, i) => (
          <circle key={i} cx={cx} cy={cy} r={r * t} fill="none" stroke="#e2e8f0" />
        ))}
        {/* axes */}
        {axes.map(([[x1, y1], [x2, y2]], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" />
        ))}
        {/* polygon */}
        <polygon points={poly} fill="#0369a1" opacity="0.15" stroke="#0369a1" strokeWidth="2" />
        {/* labels */}
        {scores.map((s, i) => {
          const [lx, ly] = pt(i, 1.15);
          const lines = s.module.split(" & ").length > 1 ? s.module.split(" & ") : [s.module];
          return (
            <text key={i} x={lx} y={ly} fontSize="10" textAnchor="middle" fill="#0f172a">
              {lines.map((ln, j) => (
                <tspan key={j} x={lx} dy={j === 0 ? 0 : 12}>{ln}</tspan>
              ))}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function SuggestedStarts({ scores }) {
  const lows = scores.filter((m) => !isNaN(m.mean)).sort((a, b) => a.mean - b.mean).slice(0, 3);
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="text-sm font-semibold text-sky-800 mb-2">Your suggested starting points</div>
      <ul className="space-y-2 text-sm">
        {lows.length === 0 && <li className="text-slate-600">Answer at least a few items to see suggestions.</li>}
        {lows.map((m) => (
          <li key={m.module} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 text-sky-700" />
            <span>
              <span className="font-medium">{m.module}</span>: try one tiny experiment this week that nudges this forward. We’ll turn wins into a simple plan in your Intro Session.
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------- Contact ----------------- */
function Contact({ cfg }) {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
      <h3 className="text-2xl font-semibold">Contact</h3>
      <div className="mt-4 rounded-2xl border bg-white p-6 grid md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <p className="text-slate-600">Prefer to talk first? Request a complimentary <strong>Intro Session</strong> or send a note. I’ll reply within one working day.</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <a href={"mailto:" + cfg.contact.email} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 bg-sky-700 text-white hover:bg-sky-800"><Mail className="w-4 h-4" /> {cfg.contact.email}</a>
            <a href="tel:+6421390191" className="inline-flex items-center gap-2 rounded-xl px-4 py-3 border hover:bg-slate-50"><Phone className="w-4 h-4" /> +64 21 390 191</a>
          </div>
        </div>
        <div className="rounded-2xl border bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-800">NZPB 90-07630</div>
          <div className="text-xs text-slate-600 mt-1">Auckland, NZ</div>
          <div className="text-xs text-slate-600 mt-2">Messaging/Email response times per package.</div>
        </div>
      </div>
    </section>
  );
}
