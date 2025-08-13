import React, { useMemo, useState, useEffect } from "react";
import { CheckCircle, Mail, Phone, Download, ClipboardCheck, ChevronRight, ShieldCheck, Sparkles, Quote, MessageCircle, Bot, X, Send } from "lucide-react";

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

const DEFAULT_CONFIG = {
  contact: { email: "bizclearconsulting@outlook.com", phone: "+64 21 390 191" },
  brandLogoSVG: "",
  hero: {
    title: "Start with a free pre-assessment QuickScan",
    sub: "Power 25. Core 45. Prime 60. Designed for leaders who want clarity, momentum, and results.",
  },
  sessionKey: "Session key: Power 25 = 25 min • Core 45 = 45 min • Prime 60 = 60 min",
  packages: [
    { id: "foundation", title: "Foundation Focus", price: "NZD $1,080 + GST", bullets: ["6 x Core 45 across 12 weeks", "Optional Prime 60 kick-off", "Email check-ins (48 hr weekdays)"] },
    { id: "accelerator", title: "Leadership Accelerator", price: "NZD $1,935 + GST", bullets: ["8 x Core 45 (weekly or fortnightly)", "4 x Power 25 banked", "Discord check-ins (24 hr weekdays)"], featured: true },
    { id: "retainer", title: "Executive Retainer", price: "NZD $395 + GST / month", bullets: ["Monthly Core 45", "Two Power 25 / month", "Priority Discord (12-24 hr)", "Optional quarterly Prime 60 calibration (+$245) with QuickScan add-on"] },
    { id: "intensive", title: "Intensive (One-off)", price: "NZD $765 + GST", bullets: ["Prime 60 discovery + Core 45 design", "Includes Intro Session + QuickScan", "3 x Power 25 follow-ups", "Insight and recommendations pack", "Discord support (6-week window)"] },
    { id: "flexi", title: "Flexi Coaching", price: "From NZD $115 + GST / session", bullets: ["Power 25 or Core 45", "Optional Discord day-pass add-on", "Same focused approach, no commitment"] },
    { id: "team", title: "Leadership Team Intervention", price: "Tailored programme", bullets: ["Discovery with senior sponsor", "Team QuickScan + targeted diagnostics", "Facilitated sessions and embeds", "Outcome roadmap & cadence", "Contact us to scope"] },
  ],
  testimonials: [
    { quote: "Brendan helped me cut through noise and make two critical decisions in a fortnight. Clarity and momentum in equal measure.", name: "COO, Energy sector", meta: "Executive client" },
    { quote: "Power 25 was a game changer for accountability. The rhythm stuck and our delivery cadence improved within a month.", name: "Tribe Lead, Financial services", meta: "Leadership client" },
    { quote: "The diagnostic plus Core 45 focus is gold. Practical, psychology-backed, and immediately useful.", name: "Head of Product, SaaS", meta: "Product leadership" },
  ],
  valor: { explainer: "VALOR is a development-only baseline across five areas: Value creation, Adaptability, Leadership energy, Outcomes discipline, and Regulation. It is evidence-informed, not a hiring assessment. Reliability and validity are monitored via item analysis and iteration." },
};

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

function AdminPanel(props){
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
        <div className="mt-2 w[email protected](92vw,720px) max-h-[70vh] overflow-auto rounded-2xl border bg-white shadow-xl p-4 text-sm">
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
            <label className="block md:col-span-2">Session key<input className="mt-1 w-full border rounded p-2" value={cfg.sessionKey} onChange={e=>update("sessionKey", e.target.value)} /></label>
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
            <div className="font-medium mt-4">Testimonials (JSON array)</div>
            <textarea className="mt-1 w-full border rounded p-2" rows={6} value={JSON.stringify(cfg.testimonials, null, 2)} onChange={e=>{ try{ var t=JSON.parse(e.target.value); setCfg(Object.assign({}, cfg, { testimonials: t })); }catch(err){ /* ignore */ } }} />
          </div>
        </div>
      )}
    </div>
  );
}

function clamp(n, min, max){ if(min===undefined) min=1; if(max===undefined) max=5; return Math.max(min, Math.min(max, n)); }
function toCSV(rows){ function esc(s){ return '"' + String(s).replace(/"/g,'""') + '"'; } return rows.map(r=>r.map(esc).join(',')).join('\n'); }

const ITEM_BANK = [
  { id: "ps1", text: "In my team, I can raise a concern without negative consequences.", module: "Psychological Safety" },
  { id: "ps2", text: "Hard questions are welcomed and handled constructively in my team.", module: "Psychological Safety" },
  { id: "jdr1", text: "In my role, I have the autonomy I need to deliver agreed outcomes.", module: "JD-R" },
  { id: "jdr2", text: "My workload is sustainable most weeks.", module: "JD-R" },
  { id: "jdr3", text: "I receive timely feedback that helps me improve in my role.", module: "JD-R" },
  { id: "go1", text: "I can name the top three outcomes for this quarter for my area of responsibility.", module: "Outcomes" },
  { id: "go2", text: "We regularly review progress against leading indicators for those outcomes.", module: "Outcomes" },
  { id: "ds1", text: "I document key decisions and share them with the right people within 24 hours.", module: "Decision Style" },
  { id: "ds2", text: "We involve the right people at the right time to make decisions.", module: "Decision Style" },
  { id: "en1", text: "I deliberately schedule recovery blocks every week.", module: "Energy & Recovery" },
  { id: "en2", text: "Most days I finish with usable energy for life outside work.", module: "Energy & Recovery" },
  { id: "fd1", text: "I can do deep work with minimal interruptions in my typical week.", module: "Focus & Distraction" },
  { id: "fd2", text: "Notifications and meetings are well managed in my context.", module: "Focus & Distraction" },
  { id: "rc1", text: "My role, decision rights, and accountabilities are clear to me and others.", module: "Role Clarity" },
  { id: "rc2", text: "I have the authority and resources to match my responsibilities.", module: "Role Clarity" },
  { id: "sa1", text: "Key stakeholders share a consistent definition of success for my area.", module: "Stakeholder Alignment" },
  { id: "sa2", text: "Trust is strong enough to address misalignment quickly.", module: "Stakeholder Alignment" },
  { id: "tf1", text: "We limit work in progress to maintain flow in our team.", module: "Team Flow" },
  { id: "tf2", text: "Our cadence (planning and reviews) enables reliable delivery.", module: "Team Flow" },
  { id: "le1", text: "I feel energized by the goals I am pursuing right now.", module: "Leadership Energy" },
  { id: "le2", text: "I recover quickly from setbacks and keep momentum.", module: "Leadership Energy" },
  { id: "saw1", text: "I know my top strengths and where I can overuse them.", module: "Self Awareness" },
  { id: "saw2", text: "I can name two derailers and how I manage them in practice.", module: "Self Awareness" },
  { id: "saw3", text: "I routinely seek feedback on my impact and adjust.", module: "Self Awareness" },
];

const MODULE_ORDER = [
  "Psychological Safety","JD-R","Outcomes","Decision Style","Role Clarity","Stakeholder Alignment","Team Flow","Focus & Distraction","Energy & Recovery","Leadership Energy","Self Awareness",
];

const AUDIENCE_LABELS = {
  smb: "Founder / Small business or startup",
  enterprise: "Enterprise leader",
  personal: "Independent / Creator",
};

const AUDIENCE_WEIGHTS = {
  smb: { "Outcomes": 2, "Decision Style": 1.5, "Stakeholder Alignment": 1.2, "Focus & Distraction": 1.5, "Leadership Energy": 1.2 },
  enterprise: { "Psychological Safety": 1.5, "Stakeholder Alignment": 1.7, "Role Clarity": 1.5, "Team Flow": 1.5, "JD-R": 1.3 },
  personal: { "Self Awareness": 2, "Leadership Energy": 1.6, "Outcomes": 1.3, "Focus & Distraction": 1.6 },
};

function useItemsFor(audience, take){
  if (take === undefined) take = 24;
  return useMemo(function(){
    var weights = AUDIENCE_WEIGHTS[audience] || {};
    var byModule = {};
    ITEM_BANK.forEach(function(it){ (byModule[it.module] = byModule[it.module] || []).push(it); });
    var order = MODULE_ORDER.slice().sort(function(a,b){ return (weights[b] || 1) - (weights[a] || 1); });
    var picked = [];
    while (picked.length < take) {
      for (var oi=0; oi<order.length; oi++) {
        var mod = order[oi];
        var pool = byModule[mod] || [];
        var next = pool.shift();
        byModule[mod] = pool;
        if (next) picked.push(next);
        if (picked.length >= take) break;
      }
      var totalLeft = 0; Object.keys(byModule).forEach(function(k){ totalLeft += (byModule[k] || []).length; });
      if (totalLeft === 0) break;
    }
    return picked.slice(0, take);
  }, [audience, take]);
}

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

export default function App(){
  const { config: cfg, setConfig, resetConfig } = useConfig();
  const [audience, setAudience] = useState("smb");
  const [questionCount, setQuestionCount] = useState(24);
  const items = useItemsFor(audience, questionCount);
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

  const completion = Math.round(100 * ((Object.keys(answers).length / items.length) || 0));

  const moduleScores = useMemo(function(){
    var buckets = {};
    for(var i=0;i<items.length;i++){
      var it = items[i];
      var val = answers[it.id];
      if (val) {
        var v = clamp(val,1,5);
        var mod = it.module;
        buckets[mod] = buckets[mod] || [];
        buckets[mod].push(it.reverse ? (6 - v) : v);
      }
    }
    return MODULE_ORDER.map(function(m){
      var arr = buckets[m] || [];
      var mean = arr.length ? arr.reduce(function(a,b){return a+b;},0)/arr.length : NaN;
      return { module: m, mean: mean };
    });
  },[answers,items]);

  const recommendations = useMemo(function(){
    function hasLow(mod, thr){
      for (var i=0;i<moduleScores.length;i++){
        var mm = moduleScores[i];
        if (mm.module===mod && !isNaN(mm.mean) && mm.mean<thr) return true;
      }
      return false;
    }
    var lows = moduleScores.filter(function(m){ return !isNaN(m.mean) && m.mean<3.0; }).map(function(m){ return m.module; });
    var veryLows = moduleScores.filter(function(m){ return !isNaN(m.mean) && m.mean<2.5; }).map(function(m){ return m.module; });
    var needsVALOR = hasLow("Outcomes",3) || hasLow("Leadership Energy",3);
    var suggestPersonality = hasLow("Self Awareness",3.2);
    var merged = {};
    veryLows.concat(lows).forEach(function(x){ merged[x]=1; });
    var highlight = Object.keys(merged).slice(0,5);
    return { suggestVALOR: needsVALOR, highlight: highlight, suggestPersonality: suggestPersonality };
  },[moduleScores]);

  function handleSetAnswer(id, val){ setAnswers(function(a){ var next=Object.assign({}, a); next[id]=val; return next; }); }

  function makeSummaryText(){
    var ms = moduleScores.filter(function(m){return !isNaN(m.mean);}).map(function(m){return m.module+': '+m.mean.toFixed(2);}).join('; ');
    var highlights = recommendations.highlight.length ? recommendations.highlight.join(', ') : 'None';
    var pkgLine = 'Selected package: ' + PKG_LABELS[selectedPkg || 'accelerator'];
    return (
      'QuickScan v1.0 (audience: ' + AUDIENCE_LABELS[audience] + ', questions: ' + items.length + ')\n' +
      pkgLine + '\nName: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nOrg/Role: ' + org + ' / ' + role + '\nCompletion: ' + completion + '%\n\n' +
      'Module means: ' + ms + '\nFocus candidates: ' + highlights + '\n' +
      'Suggest VALOR© core: ' + (recommendations.suggestVALOR? 'Yes':'No') + '\n' +
      'Suggest personality/self-awareness add-on: ' + (recommendations.suggestPersonality? 'Yes':'No') + '\n' +
      'Notes: ' + notes
    );
  }

  function buildCSV(){
    var header=["id","item","module","score(1-5)"];
    var rows=[header].concat(items.map(function(it){ return [it.id,it.text,it.module, answers[it.id]? String(answers[it.id]): ""]; }));
    return toCSV(rows);
  }
  function downloadCSV(){ var blob=new Blob([buildCSV()],{type:"text/csv;charset=utf-8;"}); var url=URL.createObjectURL(blob); var a=document.createElement("a"); a.href=url; a.download='Bizclear_QuickScan_'+(name||'anonymous')+'.csv'; a.click(); URL.revokeObjectURL(url); }
  async function copySummary(){ await navigator.clipboard.writeText(makeSummaryText()); alert("Summary copied to clipboard."); }
  function submitMailto(){ var to=cfg.contact.email; var subject=encodeURIComponent('QuickScan Submission - '+(name||'Anonymous')); var body=encodeURIComponent(makeSummaryText()); var cc = email? '&cc='+encodeURIComponent(email): ''; window.location.href='mailto:'+to+'?subject='+subject+cc+'&body='+body; setSubmitted(true); }

  return (
    <div className="min-h-screen text-[15px] text-slate-900" style={{ background: `linear-gradient(180deg, ${brand.sand} 0%, #ffffff 45%)` }}>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><BrandLogo className="w-8 h-8" svg={cfg.brandLogoSVG}/><span className="font-semibold tracking-tight text-slate-800">Bizclear Coaching</span></div>
          <nav className="hidden md:flex items-center gap-6 text-slate-700">
            <a href="#packages" className="hover:text-slate-900">Packages</a>
            <a href="#diagnostics" className="hover:text-slate-900">Diagnostics</a>
            <a href="#results" className="hover:text-slate-900">Results</a>
            <a href="#quickscan" className="hover:text-slate-900">QuickScan</a>
            <a href="#about" className="hover:text-slate-900">About</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
            <a href="#assistant" className="hover:text-slate-900">Assistant</a>
          </nav>
          <a href="#quickscan" className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-sky-700 text-white hover:bg-sky-800 transition"><Sparkles className="w-4 h-4"/> Start QuickScan</a>
        </div>
      </header>

      <section className="bg-gradient-to-br from-sky-900 to-sky-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 grid md:grid-cols-1 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">{cfg.hero.title}</h1>
            <p className="mt-4 text-white/90">{cfg.hero.sub}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#quickscan" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white text-sky-900 font-medium hover:bg-slate-100">Start QuickScan <ChevronRight className="w-4 h-4"/></a>
              <a href="#assistant" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-sky-800/70 hover:bg-sky-800"><Bot className="w-4 h-4"/> Try Bizclear Assistant</a>
            </div>
            <div className="mt-8 grid sm:grid-cols-3 gap-3 text-sky-50">
              <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-4"><div className="text-sm font-semibold">1 · QuickScan</div><div className="text-sm opacity-90">3–5 minutes, evidence-informed items.</div></div>
              <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-4"><div className="text-sm font-semibold">2 · Intro Session (20 min)</div><div className="text-sm opacity-90">Discuss results and shape next steps.</div></div>
              <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-4"><div className="text-sm font-semibold">3 · Your next step</div><div className="text-sm opacity-90">Pick a package or tailored intervention.</div></div>
            </div>
            <div className="mt-6 text-sm text-white/80">NZPB Reg. 90-07630 - Auckland, NZ - <a className="underline decoration-white/40 underline-offset-4" href="tel:+6421390191">+64 21 390 191</a></div>
          </div>
        </div>
      </section>

      <Packages selectedPkg={selectedPkg} setSelectedPkg={setSelectedPkg}/>
      <Diagnostics/>
      <Results/>
      <QuickScan/>
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
      <AdminPanel cfg={cfg} setCfg={setConfig} reset={resetConfig}/>
    </div>
  );
}

function Packages({ selectedPkg, setSelectedPkg }){
  return (
    <section id="packages" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-semibold">1:1 Coaching Packages</h2>
      <p className="text-slate-600 mt-1">Short, focused sessions that convert insight to action.</p>
      <div className="mt-2 text-xs text-slate-500"><span className="font-medium text-slate-700">{DEFAULT_CONFIG.sessionKey}</span></div>
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
            <div className="font-medium">QuickScan v1.0 <span className="text-slate-500">(16-36 items)</span></div>
            <p className="text-slate-600 mt-1">Evidence-informed triage that determines whether <strong>VALOR© Core</strong> or Bespoke Modules are needed for your <strong>Prime 60</strong> and plan.</p>
          </div>
          <div>
            <div className="font-medium">VALOR© Core or Bespoke Modules</div>
            <p className="text-slate-600 mt-1">VALOR provides a broad capability baseline; Bespoke Modules target specific drivers like Psychological Safety, JD-R, Role Clarity, Team Flow, and more.</p>
          </div>
        </div>
        <details className="mt-4 rounded-xl bg-white p-4 border text-sm"><summary className="cursor-pointer font-medium text-slate-800">What is VALOR©?</summary><p className="mt-2 text-slate-600">{DEFAULT_CONFIG.valor.explainer}</p></details>
        <p className="mt-4 text-[13.5px] text-slate-500 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Developmental use only (not for hiring or ratings). Reliability/validity monitored via item analysis and iteration; method notes supplied in plain English.</p>
      </div>
    </section>
  );
}

function Results(){
  return (
    <section id="results" className="mx-auto max-w-6xl px-4 py-12">
      <h3 className="text-2xl font-semibold">Client results and notes</h3>
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

function QuickScan(){
  const [audience, setAudience] = useState("smb");
  const [questionCount, setQuestionCount] = useState(24);
  const items = useItemsFor(audience, questionCount);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const completion = Math.round(100 * ((Object.keys(answers).length / items.length) || 0));

  const moduleScores = useMemo(function(){
    var buckets = {};
    for(var i=0;i<items.length;i++){
      var it = items[i];
      var val = answers[it.id];
      if (val) {
        var v = Math.max(1, Math.min(5, val));
        var mod = it.module;
        buckets[mod] = buckets[mod] || [];
        buckets[mod].push(v);
      }
    }
    return MODULE_ORDER.map(function(m){
      var arr = buckets[m] || [];
      var mean = arr.length ? arr.reduce(function(a,b){return a+b;},0)/arr.length : NaN;
      return { module: m, mean: mean };
    });
  },[answers,items]);

  const recommendations = useMemo(function(){
    var lows = moduleScores.filter(function(m){ return !isNaN(m.mean) && m.mean<3.0; }).map(function(m){ return m.module; });
    var veryLows = moduleScores.filter(function(m){ return !isNaN(m.mean) && m.mean<2.5; }).map(function(m){ return m.module; });
    var merged = {}; veryLows.concat(lows).forEach(function(x){ merged[x]=1; });
    var highlight = Object.keys(merged).slice(0,5);
    var needsVALOR = ["Outcomes", "Leadership Energy"].some(function(k){ return moduleScores.find(function(m){ return m.module===k && m.mean<3; }); });
    return { suggestVALOR: needsVALOR, highlight: highlight };
  },[moduleScores]);

  function makeSummaryText(){
    var ms = moduleScores.filter(function(m){return !isNaN(m.mean);}).map(function(m){return m.module+': '+m.mean.toFixed(2);}).join('; ');
    var highlights = recommendations.highlight.length ? recommendations.highlight.join(', ') : 'None';
    return (
      'QuickScan v1.0 (audience: ' + AUDIENCE_LABELS[audience] + ', questions: ' + items.length + ')\n' +
      'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nOrg/Role: ' + org + ' / ' + role + '\nCompletion: ' + completion + '%\n\n' +
      'Module means: ' + ms + '\nFocus candidates: ' + highlights + '\n' +
      'Notes: ' + notes
    );
  }
  function toCSV(rows){ function esc(s){ return '\"' + String(s).replace(/\"/g,'\"\"') + '\"'; } return rows.map(r=>r.map(esc).join(',')).join('\n'); }
  function buildCSV(){ var header=["id","item","module","score(1-5)"]; var rows=[header].concat(items.map(function(it){ return [it.id,it.text,it.module, answers[it.id]? String(answers[it.id]): ""]; })); return toCSV(rows); }
  function downloadCSV(){ var blob=new Blob([buildCSV()],{type:"text/csv;charset=utf-8;"}); var url=URL.createObjectURL(blob); var a=document.createElement("a"); a.href=url; a.download='Bizclear_QuickScan_'+(name||'anonymous')+'.csv'; a.click(); URL.revokeObjectURL(url); }
  async function copySummary(){ await navigator.clipboard.writeText(makeSummaryText()); alert("Summary copied to clipboard."); }
  function submitMailto(){ var subject=encodeURIComponent('QuickScan Submission - '+(name||'Anonymous')); var body=encodeURIComponent(makeSummaryText()); var cc = email? '&cc='+encodeURIComponent(email): ''; window.location.href='mailto:'+DEFAULT_CONFIG.contact.email+'?subject='+subject+cc+'&body='+body; setSubmitted(true); }
  function handleSetAnswer(id, val){ setAnswers(a=>({ ...a, [id]: val })); }

  return (
    <section id="quickscan" className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold">QuickScan v1.0</h3>
          <p className="text-slate-600">Choose your context so we tailor the items. 1–5 agreement scale.</p>
        </div>
        <div className="text-sm flex items-center gap-2">
          <label className="text-slate-700">I am a</label>
          <select value={audience} onChange={e=>setAudience(e.target.value)} className="rounded-lg border px-2 py-1">
            <option value="smb">Founder / Small business or startup</option>
            <option value="enterprise">Enterprise leader</option>
            <option value="personal">Independent / Creator</option>
          </select>
          <span className="ml-3 text-slate-500">Questions</span>
          <select value={questionCount} onChange={e=>setQuestionCount(Number(e.target.value))} className="rounded-lg border px-2 py-1">
            <option value={16}>16</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
          </select>
        </div>
      </div>
      <div id="intro" className="mt-6 grid md:grid-cols-2 gap-4">
        <input value={name} onChange={e=>setName(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Full name (required)" aria-label="Full name" required/>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Email (required)" type="email" aria-label="Email" required/>
        <input value={phone} onChange={e=>setPhone(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Phone" type="tel" aria-label="Phone"/>
        <input value={org} onChange={e=>setOrg(e.target.value)} className="rounded-xl border px-4 py-3" placeholder="Organisation" aria-label="Organisation"/>
        <input value={role} onChange={e=>setRole(e.target.value)} className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Role / Title" aria-label="Role"/>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between"><div className="text-sm text-slate-600">Completion: <span className="font-medium text-slate-800">{completion}%</span></div><div className="text-xs text-slate-500">Scale: 1 Strongly Disagree – 5 Strongly Agree</div></div>
        <div className="mt-4 space-y-4">
          {items.map((it, idx)=> (
            <div key={it.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] tracking-wide uppercase text-slate-500">{it.module}</div>
                  <div className="font-medium text-slate-900">{idx+1}. {it.text}</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(n=> (
                    <button key={n} onClick={()=>handleSetAnswer(it.id, n)} className={`w-9 h-9 rounded-lg border text-sm font-medium ${answers[it.id]===n? 'bg-sky-700 text-white border-sky-700':'bg-white hover:bg-slate-50'}`} aria-label={`Select ${n} for item ${idx+1}`}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6"><textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full rounded-2xl border px-4 py-3" rows={4} placeholder="Optional context or goals for the Intro Session"/></div>
      <ModuleSummary items={items} answers={answers} recommendations={recommendations} submitted={submitted} setSubmitted={setSubmitted} makeSummaryText={makeSummaryText} buildCSV={buildCSV} copySummary={copySummary} downloadCSV={downloadCSV} submitMailto={submitMailto} />
    </section>
  )
}

function ModuleSummary({ items, answers, recommendations, submitted, setSubmitted, makeSummaryText, buildCSV, copySummary, downloadCSV, submitMailto }){
  const moduleScores = useMemo(function(){
    var buckets = {};
    for(var i=0;i<items.length;i++){
      var it = items[i];
      var val = answers[it.id];
      if (val) {
        var v = Math.max(1, Math.min(5, val));
        var mod = it.module;
        buckets[mod] = buckets[mod] || [];
        buckets[mod].push(v);
      }
    }
    return MODULE_ORDER.map(function(m){
      var arr = buckets[m] || [];
      var mean = arr.length ? arr.reduce(function(a,b){return a+b;},0)/arr.length : NaN;
      return { module: m, mean: mean };
    });
  },[answers,items]);

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border bg-white p-6"><div className="text-sm font-semibold text-sky-800 mb-2">Module means</div><ul className="space-y-1 text-sm">{moduleScores.map(m=> (<li key={m.module} className="flex items-center justify-between"><span className="text-slate-600">{m.module}</span><span className="font-medium text-slate-900">{isNaN(m.mean)? '-' : m.mean.toFixed(2)}</span></li>))}</ul></div>
      <div className="rounded-2xl border bg-white p-6">
        <div className="text-sm font-semibold text-sky-800 mb-2">Recommended next steps</div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 text-sky-700"/> Use results to shape your Prime 60 and ongoing Core 45 plan.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 text-sky-700"/> Focus candidates: <span className="font-medium">{recommendations.highlight.length? recommendations.highlight.join(', ') : 'None detected'}</span></li>
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 text-sky-700"/> {recommendations.suggestVALOR ? <span>Include <strong>VALOR© Core</strong> baseline.</span> : <span>VALOR© Core optional based on goals.</span>}</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={copySummary} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-black"><ClipboardCheck className="w-4 h-4"/> Copy summary</button>
          <button onClick={downloadCSV} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border hover:bg-slate-50"><Download className="w-4 h-4"/> Download CSV</button>
          <button onClick={submitMailto} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-sky-700 text-white hover:bg-sky-800"><Mail className="w-4 h-4"/> Send to Bizclear (cc me)</button>
        </div>
        {submitted && <p className="mt-2 text-xs text-slate-500">A new email draft should have opened. If not, use "Copy summary" and paste manually.</p>}
      </div>
    </div>
  );
}

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
          <div className="text-xs text-slate-600 mt-2">Discord/Email touchpoints per package.</div>
        </div>
      </div>
    </section>
  );
}
