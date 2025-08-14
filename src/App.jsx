import React, { useMemo, useState, useEffect } from "react";
import { CheckCircle, Mail, Phone, Download, ClipboardCheck, ChevronRight, ShieldCheck, Sparkles, Quote, MessageCircle, Bot, X, Send } from "lucide-react";

// === Admin visibility flag (Vite env) ===
const SHOW_ADMIN = import.meta.env.VITE_SHOW_ADMIN === 'true';

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
function BrandLogo({ className, svg }){
  if (svg && svg.indexOf('<svg')>=0) {
    return <span className={className} dangerouslySetInnerHTML={{__html: svg}} aria-label="Bizclear logo"/>;
  }
  return <LogoLightCircle className={className}/>;
}

const brand = { sand: "#F4F2EE" };

/** ===============================
 *   CONFIG & DEFAULTS
 *  =============================== */
const DEFAULT_CONFIG = {
  contact: { email: "bizclearconsulting@outlook.com", phone: "+64 21 390 191" },
  brandLogoSVG: "",
  hero: {
    title: "Start with a free pre-assessment QuickScan",
    sub: "Power 25. Core 45. Prime 60. Designed for leaders who want clarity, momentum, and results.",
  },
  packages: [
    { id: "foundation", title: "Foundation Focus", price: "NZD $1,080 + GST", bullets: ["6 × 45‑minute sessions across 12 weeks", "Optional 60‑minute kick‑off", "Email check‑ins (reply within 48h on weekdays)"] },
    { id: "accelerator", title: "Leadership Accelerator", price: "NZD $1,935 + GST", bullets: ["8 × 45‑minute sessions (weekly or fortnightly)", "4 × 25‑minute quick boosters", "Instant messaging between sessions (reply within 24h on weekdays)"], featured: true },
    { id: "retainer", title: "Executive Retainer", price: "NZD $395 + GST / month", bullets: ["Monthly 45‑minute session", "Two 25‑minute boosters each month", "Priority instant messaging (reply within 12–24h on weekdays)", "Optional quarterly 60‑minute calibration (+$245) with QuickScan add‑on"] },
    { id: "intensive", title: "Intensive (One‑off)", price: "NZD $765 + GST", bullets: ["60‑minute discovery + 45‑minute design", "Includes Intro Session + QuickScan", "3 × 25‑minute follow‑ups", "Insight and recommendations pack", "Support window (6 weeks)"] },
    { id: "flexi", title: "Flexi Coaching", price: "From NZD $115 + GST / session", bullets: ["25 or 45‑minute options", "Optional day‑pass for instant messaging", "Same focused approach, no commitment"] },
    { id: "team", title: "Leadership Team Intervention", price: "Tailored programme", bullets: ["Discovery with senior sponsor", "Team QuickScan + targeted diagnostics", "Facilitated sessions and embeds", "Outcome roadmap & cadence", "Contact us to scope"] },
  ],
  testimonials: [
    { quote: "Brendan helped me cut through noise and make two critical decisions in a fortnight. Clarity and momentum in equal measure.", name: "COO, Energy sector", meta: "Executive client" },
    { quote: "Power 25 was a game changer for accountability. The rhythm stuck and our delivery cadence improved within a month.", name: "Tribe Lead, Financial services", meta: "Leadership client" },
    { quote: "The diagnostic plus Core 45 focus is gold. Practical, psychology-backed, and immediately useful.", name: "Head of Product, SaaS", meta: "Product leadership" },
  ],
  valor: { explainer: "VALOR is a development-only baseline across five areas: Value creation, Adaptability, Leadership energy, Outcomes discipline, and Regulation. It is evidence-informed, not a hiring assessment. Reliability and validity are monitored via item analysis and iteration." },
};

/** Growth Pathways (for radar + grouping)
 *  These labels are used by the item bank below. */
const PATHWAYS = [
  "Clarity & Vision",
  "Confidence & Self-Belief",
  "Strengths in Action",
  "Energy & Resilience",
  "Focus & Momentum",
  "Awareness & Courage",
  "Connection & Influence",
  "Pace & Presence",
];

/** Universal 32-item question bank (4 per pathway) */
const ITEM_BANK = [
  // Clarity & Vision
  { id: "cv1", module: "Clarity & Vision", text: "I can clearly picture what I want the next chapter of my life to look like." },
  { id: "cv2", module: "Clarity & Vision", text: "I have a sense of purpose that guides my daily actions." },
  { id: "cv3", module: "Clarity & Vision", text: "I regularly set and review meaningful goals." },
  { id: "cv4", module: "Clarity & Vision", text: "I feel excited about the direction I’m heading in." },
  // Confidence & Self-Belief
  { id: "cs1", module: "Confidence & Self-Belief", text: "I trust my ability to handle challenges that come my way." },
  { id: "cs2", module: "Confidence & Self-Belief", text: "I can share my views without second-guessing myself." },
  { id: "cs3", module: "Confidence & Self-Belief", text: "I feel comfortable making important decisions." },
  { id: "cs4", module: "Confidence & Self-Belief", text: "I believe my contribution matters in any setting." },
  // Strengths in Action
  { id: "sa1", module: "Strengths in Action", text: "I know what I’m naturally good at." },
  { id: "sa2", module: "Strengths in Action", text: "I get to use my strengths in most situations." },
  { id: "sa3", module: "Strengths in Action", text: "Others recognise and appreciate my talents." },
  { id: "sa4", module: "Strengths in Action", text: "I can easily recall examples of when I’ve done my best work." },
  // Energy & Resilience
  { id: "er1", module: "Energy & Resilience", text: "I manage my energy well across the week." },
  { id: "er2", module: "Energy & Resilience", text: "I bounce back quickly from setbacks." },
  { id: "er3", module: "Energy & Resilience", text: "I make time for rest and renewal without guilt." },
  { id: "er4", module: "Energy & Resilience", text: "I feel able to adapt when plans change." },
  // Focus & Momentum
  { id: "fm1", module: "Focus & Momentum", text: "I’m good at identifying what matters most right now." },
  { id: "fm2", module: "Focus & Momentum", text: "I make steady progress towards my goals." },
  { id: "fm3", module: "Focus & Momentum", text: "I avoid getting distracted by less important things." },
  { id: "fm4", module: "Focus & Momentum", text: "I feel a sense of achievement at the end of most weeks." },
  // Awareness & Courage
  { id: "ac1", module: "Awareness & Courage", text: "I understand how my actions affect others." },
  { id: "ac2", module: "Awareness & Courage", text: "I seek honest feedback and act on it." },
  { id: "ac3", module: "Awareness & Courage", text: "I’m willing to step into uncomfortable situations for growth." },
  { id: "ac4", module: "Awareness & Courage", text: "I can recognise and work through my own blind spots." },
  // Connection & Influence
  { id: "ci1", module: "Connection & Influence", text: "I build trust easily with new people." },
  { id: "ci2", module: "Connection & Influence", text: "I can express myself clearly in conversations." },
  { id: "ci3", module: "Connection & Influence", text: "I know how to inspire or motivate others." },
  { id: "ci4", module: "Connection & Influence", text: "I feel confident in influencing outcomes that matter to me." },
  // Pace & Presence
  { id: "pp1", module: "Pace & Presence", text: "I can slow down and be fully present when needed." },
  { id: "pp2", module: "Pace & Presence", text: "I avoid rushing decisions unnecessarily." },
  { id: "pp3", module: "Pace & Presence", text: "I notice and appreciate the small wins." },
  { id: "pp4", module: "Pace & Presence", text: "I maintain a healthy rhythm between action and reflection." },
];

/** Report snippets (friendly & invitational) */
const PATHWAY_SUMMARIES = {
  "Clarity & Vision":
    "You might be ready for a clearer sense of direction. Together, we’ll explore what matters most and shape a future you’re excited to step into.",
  "Confidence & Self-Belief":
    "Confidence grows with small wins and moments of trust in yourself. We’ll focus on your voice, decisions, and genuine strengths.",
  "Strengths in Action":
    "Reconnecting to what you’re naturally good at can unlock energy and progress. Let’s put your strengths where they’ll have the most impact.",
  "Energy & Resilience":
    "Your energy sets the tone for everything else. We’ll protect recovery, build simple resets, and help you bounce back stronger.",
  "Focus & Momentum":
    "Clarity plus steady action builds momentum. We’ll prioritise what matters and create a rhythm you can rely on.",
  "Awareness & Courage":
    "Seeing yourself clearly increases your range. We’ll work with feedback, blind spots, and brave steps that grow your confidence.",
  "Connection & Influence":
    "Influence is about trust and clarity. We’ll refine how you connect, express ideas, and shape outcomes that matter.",
  "Pace & Presence":
    "Slowing down can speed you up. We’ll design a rhythm that suits your life—so you can be present and enjoy the journey.",
};

/** ===============================
 *   PERSISTENT CONFIG STATE
 *  =============================== */
function useConfig() {
  const KEY = "bizclear_cfg_v1";
  const [config, setConfigState] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign({}, DEFAULT_CONFIG, JSON.parse(raw)) : DEFAULT_CONFIG;
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  });
  function setConfig(next) {
    setConfigState(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) {}
  }
  function resetConfig() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    setConfigState(DEFAULT_CONFIG);
  }
  return { config, setConfig, resetConfig };
}

/** ===============================
 *   ADMIN PANEL (gated by env)
 *  =============================== */
function AdminPanel(props){
  if (import.meta.env.VITE_SHOW_ADMIN !== 'true') return null;
  const { cfg, setCfg, reset } = props;
  const [open, setOpen] = useState(false);
  useEffect(function(){ if (location.hash.indexOf("admin") >= 0) setOpen(true); },[]);
  function update(path, value){
    var copy = JSON.parse(JSON.stringify(cfg));
    var keys = path.split(".");
    var ref = copy;
    for (var i=0;i<keys.length-1;i++){ ref = ref[keys[i]]; }
    ref[keys[keys.length-1]] = value;
    setCfg(copy);
  }
  return (
    <div className="fixed bottom-5 left-5 z-50">
      <button onClick={()=>setOpen(!open)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border bg-white hover:bg-slate-50 text-sm">CMS</button>
      {open && (
        <div className="mt-2 w-[min(92vw,720px)] max-h-[70vh] overflow-auto rounded-2xl border bg-white shadow-xl p-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Admin Panel</div>
            <div className="flex items-center gap-2">
              <button onClick={function(){reset();}} className="px-2 py-1 border rounded">Reset</button>
              <button onClick={()=>setOpen(false)} className="px-2 py-1 border rounded">Close</button>
            </div>
          </div>
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            <label className="block">Hero title<textarea className="mt-1 w-full border rounded p-2" rows={2} value={cfg.hero.title} onChange={e=>update("hero.title", e.target.value)} /></label>
            <label className="block">Hero sub<textarea className="mt-1 w-full border rounded p-2" rows={2} value={cfg.hero.sub} onChange={e=>update("hero.sub", e.target.value)} /></label>
            <label className="block">Contact email<input className="mt-1 w-full border rounded p-2" value={cfg.contact.email} onChange={e=>update("contact.email", e.target.value)} /></label>
            <label className="block">Contact phone<input className="mt-1 w-full border rounded p-2" value={cfg.contact.phone} onChange={e=>update("contact.phone", e.target.value)} /></label>
            <label className="block md:col-span-2">VALOR explainer<textarea className="mt-1 w-full border rounded p-2" rows={3} value={cfg.valor.explainer} onChange={e=>update("valor.explainer", e.target.value)} /></label>
          </div>
          <div className="mt-4">
            <div className="font-medium">Packages</div>
            {cfg.packages.map((p, i)=> (
              <div key={p.id} className="mt-2 border rounded p-2">
                <div className="flex items-center gap-2">
                  <input className="border rounded px-2 py-1 w-44" value={p.title} onChange={e=>{ var v=e.target.value; var arr=[...cfg.packages]; arr[i]=Object.assign({}, p, {title:v}); setCfg(Object.assign({}, cfg, {packages:arr})); }} />
                  <input className="border rounded px-2 py-1 flex-1" value={p.price} onChange={e=>{ var v=e.target.value; var arr=[...cfg.packages]; arr[i]=Object.assign({}, p, {price:v}); setCfg(Object.assign({}, cfg, {packages:arr})); }} />
                  <label className="text-xs ml-2"><input type="checkbox" className="mr-1" checked={!!p.featured} onChange={e=>{ var arr=[...cfg.packages]; arr[i]=Object.assign({}, p, {featured:e.target.checked}); setCfg(Object.assign({}, cfg, {packages:arr})); }} />Featured</label>
                </div>
                <textarea className="mt-2 w-full border rounded p-2 text-xs" rows={2} value={p.bullets.join("\n")} onChange={e=>{ var arr=[...cfg.packages]; arr[i]=Object.assign({}, p, {bullets:e.target.value.split(/\n+/)}); setCfg(Object.assign({}, cfg, {packages:arr})); }} />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="font-medium">Brand logo (paste inline SVG)</div>
            <textarea className="mt-1 w-full border rounded p-2" rows={6} placeholder="Paste your <svg>…</svg> here to use your official Bizclear logo" value={cfg.brandLogoSVG} onChange={e=>setCfg(Object.assign({}, cfg, { brandLogoSVG: e.target.value }))} />
          </div>
        </div>
      )}
    </div>
  );
}

/** ===============================
 *   SMALL UTILS
 *  =============================== */
function clamp(n, min=1, max=5){ return Math.max(min, Math.min(max, n)); }
function toCSV(rows){ function esc(s){ return '"' + String(s).replace(/"/g,'""') + '"'; } return rows.map(r=>r.map(esc).join(',')).join('\n'); }

/** ===============================
 *   SIMPLE RADAR CHART (SVG)
 *  =============================== */
function RadarChart({ labels, values, max=5 }){
  const size = 320; const center = size/2; const radius = size*0.38;
  const angleStep = (Math.PI * 2) / labels.length;

  function polarToXY(r, angle){ return [center + r*Math.sin(angle), center - r*Math.cos(angle)]; }

  // Axes + grid
  const rings = [1,2,3,4,5];
  const axes = labels.map((_, i) => {
    const [x, y] = polarToXY(radius, i*angleStep);
    return <line key={'ax'+i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />;
  });
  const grid = rings.map((r,i)=>{
    const path = labels.map((_, idx)=>{
      const [x,y] = polarToXY((r/max)*radius, idx*angleStep);
      return `${idx===0?'M':'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
    return <path key={'rg'+i} d={path} fill="none" stroke="rgba(0,0,0,0.06)" />;
  });

  // Data polygon
  const polyPath = labels.map((_, i)=>{
    const val = clamp(values[i] || 0, 0, max);
    const [x,y] = polarToXY((val/max)*radius, i*angleStep);
    return `${i===0?'M':'L'} ${x} ${y}`;
  }).join(' ') + ' Z';

  // Label positions
  const labelEls = labels.map((lbl, i)=>{
    const [x,y] = polarToXY(radius+18, i*angleStep);
    return (
      <text key={'lb'+i} x={x} y={y} textAnchor={Math.sin(i*angleStep)>0.1?'start': (Math.sin(i*angleStep)<-0.1?'end':'middle')} dominantBaseline="middle" className="text-[11px] fill-slate-700">
        {lbl}
      </text>
    );
  });

  return (
    <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Your Growth Map">
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0ea5e9" stopOpacity="0.28"/>
          <stop offset="1" stopColor="#0369a1" stopOpacity="0.28"/>
        </linearGradient>
      </defs>
      {grid}
      {axes}
      <path d={polyPath} fill="url(#radarFill)" stroke="#0369a1" strokeWidth="2" />
      {labelEls}
    </svg>
  );
}

/** ===============================
 *   CHAT WIDGET (unchanged)
 *  =============================== */
function ChatWidget(){
  var MAX_TURNS = 3; var storageKey = "bizclear_chat_turns"; var today = new Date().toISOString().slice(0, 10);
  var [open, setOpen] = useState(false); var [input, setInput] = useState("");
  useEffect(function(){
    function openIfAssistant(){ if (location.hash.indexOf('assistant')>=0) setOpen(true); }
    openIfAssistant();
    window.addEventListener('hashchange', openIfAssistant);
    return function(){ window.removeEventListener('hashchange', openIfAssistant); };
  },[]);
  var [messages, setMessages] = useState([
    { role: "assistant", text: "Hi - I'm Bizclear Assist (beta). You have 3 free interactions today. Ask a leadership, delivery, or focus question and I'll share a short coaching tip. For deeper work, request an Intro Session." },
  ]);
  function getTurns(){ try{ var raw=localStorage.getItem(storageKey); if(!raw) return 0; var d=JSON.parse(raw); return d.date===today? (d.used||0):0; }catch(e){ return 0; } }
  function setTurns(u){ localStorage.setItem(storageKey, JSON.stringify({ date: today, used: u })); }
  var turnsLeft = Math.max(0, MAX_TURNS - getTurns());
  async function respond(t){ var s=t.toLowerCase();
    if(s.indexOf("block")>=0||s.indexOf("stuck")>=0) return "Quick steer: name the blocker, choose the smallest next step, and timebox a Power 25 to clear it.";
    if(s.indexOf("team")>=0||s.indexOf("conflict")>=0) return "Try a 4P check-in: purpose, progress, problem, plan. If safety feels low, start with wins and clarify one decision.";
    if(s.indexOf("focus")>=0||s.indexOf("overwhelm")>=0||s.indexOf("priorit")>=0) return "Use a 3x3 focus: three outcomes, three metrics, three next actions. Protect one 90-minute deep work block.";
    if(s.indexOf("stakeholder")>=0||s.indexOf("alignment")>=0) return "Draft a one-pager: context, goal, decision needed, options with pros/cons, recommendation. Share within 24 hours.";
    return "Let's define success, constraints, and the smallest meaningful win this week. Request an Intro Session if helpful."; }
  async function onSend(){ if(!input.trim()) return; if(turnsLeft<=0){ setMessages(function(m){ return m.concat([{role:"assistant",text:"You've used your free interactions for today. Request a complimentary Intro Session to go further."}]); }); setInput(""); return; }
    var u=input.trim(); setMessages(function(m){ return m.concat([{role:"user",text:u}]); }); setInput(""); setTurns(MAX_TURNS-(turnsLeft-1)); var r=await respond(u); setMessages(function(m){ return m.concat([{role:"assistant",text:r}]); }); }
  return (
    <>
      <button onClick={()=>setOpen(!open)} className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full px-4 py-3 shadow-lg bg-sky-700 text-white hover:bg-sky-800">
        <Bot className="w-4 h-4"/> {open?"Close":"Coaching tip (free)"} <span className="text-white/80 text-xs">({turnsLeft} left)</span>
      </button>
      {open&&(
        <div className="fixed bottom-20 right-5 z-50 w-[min(92vw,380px)] rounded-2xl border bg-white shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4"/><span className="font-medium">Bizclear Assist</span><span className="text-white/70 text-xs ml-2">beta</span></div>
            <button onClick={()=>setOpen(false)} aria-label="Close" className="opacity-80 hover:opacity-100"><X className="w-4 h-4"/></button>
          </div>
          <div className="p-3 max-h-[50vh] overflow-auto space-y-2 text-[14px]">
            {messages.map((m,i)=>(<div key={i} className={m.role==="assistant"?"text-slate-800":"text-slate-900"}><div className={`rounded-2xl px-3 py-2 inline-block ${m.role==="assistant"?"bg-slate-100":"bg-sky-50 border border-sky-100"}`}>{m.text}</div></div>))}
          </div>
          <div className="px-3 pb-3">
            <div className="text-[11px] text-slate-500 mb-1">Free demo: 3 messages per day. Developmental guidance only.</div>
            <div className="flex items-center gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") onSend(); }} className="flex-1 rounded-xl border px-3 py-2" placeholder="Ask a quick question..."/>
              <button onClick={onSend} className="rounded-xl px-3 py-2 bg-sky-700 text-white hover:bg-sky-800"><Send className="w-4 h-4"/></button>
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
  intensive: "Intensive (One-off)",
  flexi: "Flexi Coaching",
  team: "Leadership Team Intervention",
};

/** ===============================
 *   APP
 *  =============================== */
export default function App(){
  const { config: cfg, setConfig, resetConfig } = useConfig();
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("accelerator");

  useEffect(function(){
    try{
      console.assert(PKG_LABELS.team === "Leadership Team Intervention", "PKG_LABELS.team missing or wrong");
      var csv = toCSV([["a","b"],["1","2"]]);
      console.assert(csv.indexOf("\n")>=0 && csv.split("\n").length===3, "CSV newline/join failure");
      console.assert("VALOR©".indexOf("©")>=0, "VALOR symbol not present");
    }catch(e){}
  },[]);

  function handleSetAnswer(id, val){ setAnswers(a=>({ ...a, [id]: val })); }

  return (
    <div className="min-h-screen text-[15px] text-slate-900" style={{ background: `linear-gradient(180deg, ${brand.sand} 0%, #ffffff 45%)` }}>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><BrandLogo className="w-8 h-8" svg={cfg.brandLogoSVG}/><span className="font-semibold tracking-tight text-slate-800">Bizclear Coaching</span></div>
          <nav className="hidden md:flex items-center gap-6 text-slate-700">
            <a href="#packages" className="hover:text-slate-900">Packages</a>
            <a href="#diagnostics" className="hover:text-slate-900">Diagnostics</a>
            <a href="#testimonials" className="hover:text-slate-900">Testimonials</a>
            <a href="#quickscan" className="hover:text-slate-900">QuickScan</a>
            <a href="#about" className="hover:text-slate-900">About</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
          </nav>
          <a href="#quickscan" className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-sky-700 text-white hover:bg-sky-800 transition"><Sparkles className="w-4 h-4"/> Start QuickScan</a>
        </div>
      </header>

      <section className="bg-gradient-to-br from-sky-900 to-sky-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">Bizclear Coaching</h1>
          <p className="mt-2 text-white/90 text-[15px] md:text-base">
            {cfg.hero.title}
          </p>
          <p className="mt-1 text-white/80 text-sm">
            {cfg.hero.sub}
          </p>

          {/* Primary CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="mailto:bizclearconsulting@outlook.com?subject=Intro%20Session%20Request"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white text-sky-900 font-medium hover:bg-slate-100">
              Book an Intro Session <ChevronRight className="w-4 h-4"/>
            </a>
            <a href="tel:+6421390191"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-sky-800/80 hover:bg-sky-800">
              <Phone className="w-4 h-4"/> Call +64&nbsp;21&nbsp;390&nbsp;191
            </a>
            <a href="#quickscan"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 border border-white/30 bg-white/10 hover:bg-white/20">
              Take the Quick Assessment <ChevronRight className="w-4 h-4"/>
            </a>
          </div>

          <div className="mt-6 text-sm text-white/80">
            Auckland, NZ · NZPB Reg. 90-07630 · <a className="underline decoration-white/40 underline-offset-4" href="tel:+6421390191">+64 21 390 191</a>
          </div>
        </div>
      </section>

      <Packages selectedPkg={selectedPkg} setSelectedPkg={setSelectedPkg}/>
      <Diagnostics/>
      <Testimonials/>
      <QuickScan
        answers={answers}
        onSetAnswer={handleSetAnswer}
        name={name} setName={setName}
        email={email} setEmail={setEmail}
        phone={phone} setPhone={setPhone}
        org={org} setOrg={setOrg}
        role={role} setRole={setRole}
        notes={notes} setNotes={setNotes}
        submitted={submitted} setSubmitted={setSubmitted}
      />
      <Contact cfg={cfg}/>
      <ChatWidget/>
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2"><BrandLogo className="w-6 h-6" svg={DEFAULT_CONFIG.brandLogoSVG}/> <span>© {new Date().getFullYear()} Bizclear Ltd. All rights reserved.</span></div>
            <div className="text-[12.5px]">Developmental use only. Not a clinical or hiring instrument. Privacy respecting: minimal note retention; documents shared on request.</div>
          </div>
        </div>
      </footer>

      {SHOW_ADMIN && <AdminPanel cfg={cfg} setCfg={setConfig} reset={resetConfig}/>}
    </div>
  );
}

/** ===============================
 *   PACKAGES / DIAGNOSTICS / TESTIMONIALS
 *  =============================== */
function Packages({ selectedPkg, setSelectedPkg }){
  return (
    <section id="packages" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-semibold">Leadership Coaching Packages</h2>
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEFAULT_CONFIG.packages.map(card => (
          <button key={card.id} onClick={()=>setSelectedPkg(card.id)} className={`relative text-left rounded-2xl border bg-white p-6 shadow-sm hover:shadow transition focus:outline-none ${selectedPkg===card.id? 'ring-2 ring-sky-700 border-sky-700' : card.featured? 'ring-1 ring-sky-200' : ''}`} aria-pressed={selectedPkg===card.id}>
            {card.featured && <span className="absolute -top-2 right-3 rounded-full bg-sky-700 text-white text-[11px] px-2 py-0.5">Most popular</span>}
            <div className="text-sky-800 text-sm font-semibold">{card.title}</div>
            <div className="mt-1 text-lg font-semibold">{card.price}</div>
            {card.featured && <div className="mt-1 inline-flex items-center rounded-full bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 text-[11px]">Most popular</div>}
            <ul className="mt-3 space-y-2 text-sm">{card.bullets.map((b,i)=>(<li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 text-sky-700"/> {b}</li>))}</ul>
            <div className="mt-4 text-xs text-slate-500">Click to {selectedPkg===card.id? 'confirm selection' : 'select package'}</div>
            {selectedPkg===card.id && (
              card.id==='team' ? (
                <a href="#contact" className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-sky-700 text-white hover:bg-sky-800">Enquire about team coaching <ChevronRight className="w-4 h-4"/></a>
              ) : (
                <a href="#quickscan" className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-sky-700 text-white hover:bg-sky-800">Start QuickScan <ChevronRight className="w-4 h-4"/></a>
              )
            )}
          </button>
        ))}
      </div>
      {selectedPkg && (
        <div className="mt-6">
          <a href={selectedPkg==='team'? '#contact':'#quickscan'} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-sky-700 text-white hover:bg-sky-800">{selectedPkg==='team'? 'Enquire about team coaching' : `Start QuickScan`} <ChevronRight className="w-4 h-4"/></a>
          <div className="text-xs text-slate-500 mt-2">We’ll use your selection to set up an Intro Session and confirm details.</div>
        </div>
      )}
    </section>
  );
}

function Diagnostics(){
  return (
    <section id="diagnostics" className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl bg-slate-50 border p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-semibold">Personalised diagnostics (used before or alongside Intro Session)</h3>
        <div className="mt-3 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-medium">Intro Session <span className="text-slate-500">(complimentary)</span></div>
            <p className="text-slate-600 mt-1">A focused 20-minute conversation to unpack your QuickScan results and outline options.</p>
          </div>
          <div>
            <div className="font-medium">QuickScan v1.0 <span className="text-slate-500">(32 items)</span></div>
            <p className="text-slate-600 mt-1">Evidence‑informed self check‑in across eight Growth Pathways to shape your Prime 60 and plan.</p>
          </div>
          <div>
            <div className="font-medium">VALOR© Core or Bespoke Modules</div>
            <p className="text-slate-600 mt-1">VALOR provides a broad capability baseline; Bespoke Modules target specific drivers like trust, focus, energy, and more.</p>
          </div>
        </div>
        <details className="mt-4 rounded-xl bg-white p-4 border text-sm"><summary className="cursor-pointer font-medium text-slate-800">What is VALOR©?</summary><p className="mt-2 text-slate-600">{DEFAULT_CONFIG.valor.explainer}</p></details>
        <p className="mt-4 text-[13.5px] text-slate-500 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Developmental use only (not for hiring or ratings). Reliability/validity monitored via item analysis and iteration; method notes supplied in plain English.</p>
      </div>
    </section>
  );
}

function Testimonials(){
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-12">
      <h3 className="text-2xl font-semibold">Testimonials</h3>
      <p className="text-slate-600">Selected quotes from leaders I have coached (shared with consent; some names anonymised).</p>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {DEFAULT_CONFIG.testimonials.map((t, idx)=> (
          <figure key={idx} className="rounded-2xl border bg-white p-6 shadow-sm">
            <Quote className="w-5 h-5 text-sky-700"/>
            <blockquote className="mt-3 text-slate-800">"{t.quote}"</blockquote>
            <figcaption className="mt-3 text-sm text-slate-600">- <span className="font-medium text-slate-800">{t.name}</span> <span className="text-slate-500">· {t.meta}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/** ===============================
 *   QUICKSCAN (new universal)
 *  =============================== */
function QuickScan(props){
  const { answers, onSetAnswer, name, setName, email, setEmail, phone, setPhone, org, setOrg, role, setRole, notes, setNotes, submitted, setSubmitted } = props;

  // derived
  const items = ITEM_BANK;
  const completion = Math.round(100 * ((Object.keys(answers).length / items.length) || 0));

  const moduleScores = useMemo(function(){
    const buckets = {};
    items.forEach(it => {
      const v = answers[it.id];
      if (!v) return;
      (buckets[it.module] = buckets[it.module] || []).push(clamp(v,1,5));
    });
    return PATHWAYS.map(m => {
      const arr = buckets[m] || [];
      const mean = arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : NaN;
      return { module: m, mean };
    });
  },[answers, items]);

  const ordered = [...moduleScores].sort((a,b)=> (isNaN(a.mean)? 999:a.mean) - (isNaN(b.mean)? 999:b.mean));
  const primary = ordered[0]?.module;
  const secondary = ordered[1]?.module;

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  function makeSummaryText(){
    const ms = moduleScores.filter(m=>!isNaN(m.mean)).map(m=>`${m.module}: ${m.mean.toFixed(2)}`).join('; ');
    const lows = ordered.slice(0,3).filter(m=>!isNaN(m.mean)).map(m=>m.module).join(', ') || 'None';
    return (
      'QuickScan – Growth Pathways (32 items)\n' +
      'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nOrg/Role: ' + org + ' / ' + role + '\nCompletion: ' + completion + '%\n\n' +
      'Pathway means: ' + ms + '\nFocus candidates: ' + lows + '\n' +
      'Notes: ' + notes
    );
  }
  function buildCSV(){
    const header=["id","item","pathway","score(1-5)"];
    const rows=[header].concat(items.map(it => [it.id, it.text, it.module, answers[it.id]? String(answers[it.id]): ""]));
    return toCSV(rows);
  }
  function downloadCSV(){ const blob=new Blob([buildCSV()],{type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download='Bizclear_QuickScan_'+(name||'anonymous')+'.csv'; a.click(); URL.revokeObjectURL(url); }
  async function copySummary(){ await navigator.clipboard.writeText(makeSummaryText()); alert("Summary copied to clipboard."); }
  function submitMailto(){
    const subject=encodeURIComponent('QuickScan Results - '+(name||'Anonymous'));
    const body=encodeURIComponent(makeSummaryText());
    const cc = email? '&cc='+encodeURIComponent(email): '';
    window.location.href='mailto:'+DEFAULT_CONFIG.contact.email+'?subject='+subject+cc+'&body='+body;
    setSubmitted(true);
  }

  function handleSubmit(){
    setLoading(true);
    setReady(false);
    setTimeout(()=>{ setLoading(false); setReady(true); }, 1600);
  }

  return (
    <section id="quickscan" className="mx-auto max-w-6xl px-4 py-12">
      {/* Warm, separated wrapper */}
      <div className="rounded-3xl border bg-amber-50/70 p-6 md:p-8 shadow-[0_8px_24px_rgba(2,6,23,0.06)]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">QuickScan — a 3–5 minute self check‑in</h3>
            <p className="text-slate-700 mt-1">Eight Growth Pathways. Simple 1–5 scale. There are no wrong answers — this is about where you are right now.</p>
            <div className="mt-2 text-xs font-semibold text-slate-700">
              Scale: <span className="font-bold">1 = Low</span> / <span className="font-bold">5 = High</span>
            </div>
          </div>
          {/* Optional decorative image slot (can remove or replace src) */}
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop" alt="" className="rounded-2xl w-full md:w-64 h-28 object-cover hidden md:block"/>
        </div>

        {/* Contact fields */}
        <div id="intro" className="mt-6 grid md:grid-cols-2 gap-4">
          <input value={name} onChange={e=>setName(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Full name (required)" aria-label="Full name" required/>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Email (required)" type="email" aria-label="Email" required/>
          <input value={phone} onChange={e=>setPhone(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Phone" type="tel" aria-label="Phone"/>
          <input value={org} onChange={e=>setOrg(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Organisation (optional)" aria-label="Organisation"/>
          <input value={role} onChange={e=>setRole(e.target.value)} className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Role / Context (optional)" aria-label="Role or context"/>
        </div>

        {/* Progress & scale */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-700">Completion: <span className="font-medium text-slate-900">{completion}%</span></div>
          <div className="text-xs text-slate-600">1 = Low · 5 = High</div>
        </div>

        {/* Items */}
        <div className="mt-4 space-y-4">
          {items.map((it, idx)=> (
            <div key={it.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] tracking-wide uppercase text-slate-500">{it.module}</div>
                  <div className="font-medium text-slate-900">{idx+1}. {it.text}</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(n=> (
                    <button key={n} onClick={()=>onSetAnswer(it.id, n)} className={`w-9 h-9 rounded-lg border text-sm font-bold ${answers[it.id]===n? 'bg-sky-700 text-white border-sky-700':'bg-white hover:bg-slate-50'}`} aria-label={`Select ${n} for item ${idx+1}`}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="mt-6"><textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full rounded-2xl border px-4 py-3" rows={4} placeholder="Optional context or goals for the Intro Session"/></div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-slate-900 text-white hover:bg-black"><ClipboardCheck className="w-4 h-4"/> See my results</button>
          <button onClick={copySummary} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 border hover:bg-slate-50"><Download className="w-4 h-4"/> Copy summary</button>
          <button onClick={downloadCSV} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 border hover:bg-slate-50"><Download className="w-4 h-4"/> Download CSV</button>
          <button onClick={submitMailto} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-sky-700 text-white hover:bg-sky-800"><Mail className="w-4 h-4"/> Email results (cc me)</button>
        </div>

        {/* Loading / Ready states */}
        {loading && (
          <div className="mt-6 rounded-2xl border bg-white p-6">
            <div className="text-slate-800 font-medium">Analysing your responses…</div>
            <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-sky-600 animate-[progress_1.6s_ease-in-out_infinite] rounded-full" style={{ width: '45%' }} />
            </div>
            <style>{`@keyframes progress { 0%{transform:translateX(-60%)} 50%{transform:translateX(0)} 100%{transform:translateX(140%)} }`}</style>
          </div>
        )}

        {ready && (
          <ResultsPanel moduleScores={moduleScores} primary={primary} secondary={secondary} />
        )}
      </div>
    </section>
  );
}

function ResultsPanel({ moduleScores, primary, secondary }){
  const labels = PATHWAYS;
  const values = labels.map(lbl => {
    const m = moduleScores.find(x=>x.module===lbl);
    return isNaN(m?.mean) ? 0 : Number(m.mean.toFixed(2));
    });
  const top = moduleScores.slice().sort((a,b)=> (isNaN(a.mean)?999:a.mean)-(isNaN(b.mean)?999:b.mean)).slice(0,3).filter(m=>!isNaN(m.mean));

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border bg-white p-6">
        <div className="text-sm font-semibold text-sky-800">Your Growth Map</div>
        <div className="text-xs text-slate-600">Higher = stronger right now · Lower = room to grow</div>
        <div className="mt-2"><RadarChart labels={labels} values={values} max={5}/></div>
        <ul className="mt-2 text-sm text-slate-700">
          {moduleScores.map(m=>(
            <li key={m.module} className="flex items-center justify-between border-t first:border-t-0 py-1">
              <span>{m.module}</span><span className="font-medium">{isNaN(m.mean)? '-' : m.mean.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border bg-white p-6">
        <div className="text-sm font-semibold text-sky-800">Your suggested starting points</div>
        <p className="text-slate-600 mt-1">Here are the pathways that may give you the best return on focus right now.</p>
        <div className="mt-4 space-y-4">
          {top.map((m,i)=>(
            <div key={m.module} className="rounded-xl border bg-amber-50/80 p-4">
              <div className="text-slate-800 font-semibold">{i===0 ? 'Primary' : i===1 ? 'Secondary' : 'Also consider'}: {m.module}</div>
              <p className="text-slate-700 mt-1">{PATHWAY_SUMMARIES[m.module]}</p>
            </div>
          ))}
        </div>
        <a href="mailto:bizclearconsulting@outlook.com?subject=Intro%20Session%20Request"
           className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-3 bg-sky-700 text-white hover:bg-sky-800">
          Book an Intro Session <ChevronRight className="w-4 h-4"/>
        </a>
        <p className="text-xs text-slate-500 mt-2">We’ll review your QuickScan together and agree simple next steps.</p>
      </div>
    </div>
  );
}

/** ===============================
 *   CONTACT
 *  =============================== */
function Contact({ cfg }){
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
      <h3 className="text-2xl font-semibold">Contact</h3>
      <div className="mt-4 rounded-2xl border bg-white p-6 grid md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <p className="text-slate-600">Prefer to talk first? Request a complimentary <strong>Intro Session</strong> or send a note. I’ll reply within one working day.</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <a href={"mailto:"+cfg.contact.email} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 bg-sky-700 text-white hover:bg-sky-800"><Mail className="w-4 h-4"/> {cfg.contact.email}</a>
            <a href="tel:+6421390191" className="inline-flex items-center gap-2 rounded-xl px-4 py-3 border hover:bg-slate-50"><Phone className="w-4 h-4"/> +64 21 390 191</a>
          </div>
        </div>
        <div className="rounded-2xl border bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-800">NZPB 90-07630</div>
          <div className="text-xs text-slate-600 mt-1">Auckland, NZ</div>
          <div className="text-xs text-slate-600 mt-2">Instant messaging / email touchpoints per package.</div>
        </div>
      </div>
    </section>
  );
}
