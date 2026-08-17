import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Home, Map as MapIcon, PlusCircle, Leaf, User, Bell, ChevronRight, ChevronLeft,
  MapPin, Camera, Upload, CheckCircle2, Clock, AlertTriangle, TrendingUp, Truck,
  Users, Package, Award, Trophy, ThumbsUp, X, ArrowRight, Sparkles, ShieldCheck,
  BarChart3, Activity, Droplet, Trash2, Lightbulb, Waves, Car, TreePine,
  Construction, HelpCircle, Building2, ChevronDown, Menu, Search, Filter,
  Radio, Zap, Globe2, ArrowUpRight, CircleDot, ScanEye, Layers, Check,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";

/* ============================== DESIGN TOKENS ============================== */
const INK = "#12141C";
const INK_SOFT = "#1B1F2C";
const INK_LINE = "#2A2F40";
const PAPER = "#F6F7FA";
const CARD = "#FFFFFF";
const BORDER = "#E7E9F0";
const ORANGE = "#FF6A2B";
const ORANGE_DEEP = "#D9490F";
const ORANGE_TINT = "#FFF1E8";
const TEAL = "#0E5A5E";
const TEAL_LIGHT = "#13807F";
const TEAL_TINT = "#E7F4F3";
const EMERALD = "#1E9E5A";
const EMERALD_TINT = "#E8F7EF";
const AMBER = "#EDA400";
const AMBER_TINT = "#FEF6E2";
const RED = "#E14653";
const RED_TINT = "#FDEBEC";
const BLUE = "#3568D4";
const BLUE_TINT = "#EAEFFC";
const SLATE = "#22232C";
const MUTED = "#6B7080";
const MUTED_SOFT = "#9498A8";

const SEVERITY_COLOR = { Low: EMERALD, Medium: AMBER, High: ORANGE_DEEP, Critical: RED };
const SEVERITY_TINT = { Low: EMERALD_TINT, Medium: AMBER_TINT, High: ORANGE_TINT, Critical: RED_TINT };

const STATUS_META = {
  submitted: { label: "Submitted", color: EMERALD, order: 0 },
  verified: { label: "Verified", color: BLUE, order: 1 },
  assigned: { label: "Assigned", color: AMBER, order: 2 },
  in_progress: { label: "In Progress", color: ORANGE_DEEP, order: 3 },
  resolved: { label: "Resolved", color: TEAL, order: 4 },
};
const STATUS_ORDER = ["submitted", "verified", "assigned", "in_progress", "resolved"];

const CATEGORIES = [
  { id: "road", label: "Road / Pothole", icon: Construction, dept: "Public Works Department" },
  { id: "water", label: "Water", icon: Droplet, dept: "Water Supply Department" },
  { id: "waste", label: "Waste", icon: Trash2, dept: "Waste Management Department" },
  { id: "streetlight", label: "Streetlight", icon: Lightbulb, dept: "Electrical Department" },
  { id: "drainage", label: "Drainage", icon: Waves, dept: "Public Works Department" },
  { id: "traffic", label: "Traffic / Parking", icon: Car, dept: "Traffic Police Department" },
  { id: "green", label: "Green Cover", icon: TreePine, dept: "Garden & Environment Department" },
  { id: "infra", label: "Public Infrastructure", icon: Building2, dept: "Municipal Works Department" },
  { id: "other", label: "Other", icon: HelpCircle, dept: "General Administration Cell" },
];
const catMeta = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[8];

const AREAS = ["Dharampeth", "Sitabuldi", "Manish Nagar", "Wardha Road", "Sadar", "Hingna", "Wathoda", "Civil Lines"];

/* ============================== MOCK DATA ============================== */
const initialReports = [
  { id: "NP-2026-004821", category: "road", area: "Dharampeth", severity: "High", status: "in_progress", time: "2h ago", upvotes: 7, mine: true, desc: "Deep pothole near the market junction, causing two-wheelers to swerve into traffic." },
  { id: "NP-2026-004790", category: "water", area: "Sitabuldi", severity: "Medium", status: "assigned", time: "5h ago", upvotes: 12, mine: false, desc: "Continuous water leakage from a broken pipe joint along the main road." },
  { id: "NP-2026-004765", category: "waste", area: "Manish Nagar", severity: "Low", status: "resolved", time: "1d ago", upvotes: 4, mine: true, desc: "Garbage left uncollected for three days near the community park gate." },
  { id: "NP-2026-004750", category: "streetlight", area: "Wardha Road", severity: "Medium", status: "verified", time: "1d ago", upvotes: 3, mine: false, desc: "Streetlight flickering and switching off intermittently after 10pm." },
  { id: "NP-2026-004733", category: "drainage", area: "Sadar", severity: "High", status: "submitted", time: "3h ago", upvotes: 9, mine: false, desc: "Drain overflow onto the footpath after light rain, blocking pedestrian movement." },
  { id: "NP-2026-004701", category: "traffic", area: "Civil Lines", severity: "Critical", status: "in_progress", time: "6h ago", upvotes: 15, mine: false, desc: "Faded zebra crossing and missing signal timer near the school crossing." },
  { id: "NP-2026-004690", category: "green", area: "Hingna", severity: "Low", status: "resolved", time: "2d ago", upvotes: 6, mine: false, desc: "Newly planted saplings along the layout road need staking support." },
  { id: "NP-2026-004655", category: "infra", area: "Wathoda", severity: "Medium", status: "assigned", time: "8h ago", upvotes: 5, mine: true, desc: "Broken railing on the pedestrian foot-over-bridge near the bus stop." },
  { id: "NP-2026-004610", category: "road", area: "Sadar", severity: "Medium", status: "verified", time: "12h ago", upvotes: 8, mine: false, desc: "Road surface cracked and uneven after recent utility digging work." },
  { id: "NP-2026-004588", category: "waste", area: "Civil Lines", severity: "High", status: "submitted", time: "1h ago", upvotes: 2, mine: false, desc: "Illegal dumping of construction debris on the vacant plot corner." },
];

const mapPositions = {
  "NP-2026-004821": { x: 32, y: 38 }, "NP-2026-004790": { x: 58, y: 22 },
  "NP-2026-004765": { x: 71, y: 55 }, "NP-2026-004750": { x: 44, y: 64 },
  "NP-2026-004733": { x: 62, y: 44 }, "NP-2026-004701": { x: 22, y: 20 },
  "NP-2026-004690": { x: 80, y: 30 }, "NP-2026-004655": { x: 27, y: 70 },
  "NP-2026-004610": { x: 63, y: 45 }, "NP-2026-004588": { x: 20, y: 22 },
};

const initialTrees = [
  { id: "GN-00124", area: "Wathoda", planted: "15 Jul 2026", verifications: 18, status: "Healthy" },
  { id: "GN-00119", area: "Manish Nagar", planted: "02 Jul 2026", verifications: 11, status: "Healthy" },
  { id: "GN-00104", area: "Hingna", planted: "22 Jun 2026", verifications: 6, status: "Needs Attention" },
  { id: "GN-00098", area: "Dharampeth", planted: "14 Jun 2026", verifications: 3, status: "Damaged" },
];

const areaScores = {
  Dharampeth: { total: 86, roads: 88, clean: 82, water: 91, green: 89, lights: 80 },
  Sitabuldi: { total: 74, roads: 70, clean: 68, water: 80, green: 72, lights: 79 },
  "Manish Nagar": { total: 91, roads: 92, clean: 90, water: 93, green: 88, lights: 92 },
  "Wardha Road": { total: 79, roads: 81, clean: 74, water: 82, green: 77, lights: 80 },
  Sadar: { total: 68, roads: 60, clean: 65, water: 70, green: 71, lights: 74 },
  Hingna: { total: 83, roads: 85, clean: 80, water: 84, green: 86, lights: 80 },
  Wathoda: { total: 77, roads: 76, clean: 73, water: 79, green: 84, lights: 75 },
  "Civil Lines": { total: 88, roads: 90, clean: 86, water: 89, green: 85, lights: 91 },
};

const categoryChartData = [
  { name: "Road", value: 7120 }, { name: "Water", value: 4310 }, { name: "Waste", value: 5240 },
  { name: "Light", value: 2870 }, { name: "Drain", value: 2190 }, { name: "Traffic", value: 1690 },
  { name: "Green", value: 980 }, { name: "Infra", value: 421 },
];
const monthlyChartData = [
  { m: "Mar", reports: 1620 }, { m: "Apr", reports: 1890 }, { m: "May", reports: 2140 },
  { m: "Jun", reports: 2480 }, { m: "Jul", reports: 2960 }, { m: "Aug", reports: 3310 },
];
const areaDensityData = AREAS.map((a) => ({ name: a, value: Math.round(1200 + Math.random() * 2600) }));
const resolutionPie = [
  { name: "Resolved", value: 18430, color: TEAL },
  { name: "In Progress", value: 4281, color: ORANGE_DEEP },
  { name: "Pending Verification", value: 2110, color: MUTED_SOFT },
];

const initialNotifications = [
  { id: 1, text: "Your pothole report NP-2026-004821 has been assigned.", time: "10m ago", read: false },
  { id: 2, text: "Your reported issue NP-2026-004765 has been marked resolved.", time: "1h ago", read: false },
  { id: 3, text: "12 citizens confirmed the water leakage you reported.", time: "3h ago", read: false },
  { id: 4, text: "A sapling near you needs community verification.", time: "1d ago", read: true },
];

/* ============================== SMALL UI HELPERS ============================== */
function IconCircle({ Icon, bg, color, size = 44, iconSize = 20 }) {
  return (
    <div style={{ width: size, height: size, background: bg, color }} className="rounded-full flex items-center justify-center shrink-0">
      <Icon size={iconSize} strokeWidth={2.2} />
    </div>
  );
}

function SeverityPill({ level }) {
  return (
    <span
      style={{ background: SEVERITY_TINT[level], color: SEVERITY_COLOR[level] }}
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
    >
      {level}
    </span>
  );
}

function StatusChip({ status }) {
  const meta = STATUS_META[status];
  return (
    <span style={{ background: meta.color + "1A", color: meta.color }} className="text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
      <span style={{ background: meta.color }} className="w-1.5 h-1.5 rounded-full" />
      {meta.label}
    </span>
  );
}

function SectionEyebrow({ children, color = ORANGE }) {
  return (
    <div style={{ color }} className="text-xs font-bold uppercase tracking-[0.16em] flex items-center gap-2 mb-2">
      <span style={{ background: color }} className="w-4 h-[2px] rounded-full" />
      {children}
    </div>
  );
}

function PulseLine({ color = ORANGE, height = 40, animate = true }) {
  return (
    <svg viewBox="0 0 400 60" width="100%" height={height} preserveAspectRatio="none">
      <polyline
        points="0,30 60,30 80,30 95,8 110,52 125,30 150,30 175,30 190,14 205,46 220,30 260,30 400,30"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={animate ? { strokeDasharray: 900, strokeDashoffset: 900, animation: "pulseDraw 3.2s ease-in-out infinite" } : {}}
      />
    </svg>
  );
}

function Card({ children, className = "", style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: CARD, border: `1px solid ${BORDER}`, ...style }}
      className={`rounded-2xl shadow-sm ${onClick ? "cursor-pointer transition hover:shadow-md" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, icon: Icon, full, color = ORANGE, textColor = "#fff", disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ background: disabled ? MUTED_SOFT : color, color: textColor }}
      className={`rounded-xl font-semibold px-5 py-3 flex items-center justify-center gap-2 transition active:scale-[0.98] ${full ? "w-full" : ""} ${disabled ? "cursor-not-allowed" : "hover:brightness-95"}`}
    >
      {children} {Icon && <Icon size={18} />}
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon, full, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{ border: `1.5px solid ${BORDER}`, color: SLATE, ...style }}
      className={`rounded-xl font-semibold px-5 py-3 flex items-center justify-center gap-2 transition hover:bg-gray-50 ${full ? "w-full" : ""}`}
    >
      {children} {Icon && <Icon size={18} />}
    </button>
  );
}

function DemoTag({ children = "Demo data" }) {
  return (
    <span style={{ background: "#111", color: "#fff" }} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md opacity-70">
      {children}
    </span>
  );
}

/* ============================== APP SHELL NAV ============================== */
const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "map", label: "Map", icon: MapIcon },
  { id: "report", label: "Report", icon: PlusCircle },
  { id: "green", label: "Green", icon: Leaf },
  { id: "profile", label: "Profile", icon: User },
];

function BottomNav({ screen, go }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40" style={{ background: CARD, borderTop: `1px solid ${BORDER}` }}>
      <div className="flex justify-around items-center py-2">
        {NAV_ITEMS.map((n) => {
          const active = screen === n.id;
          const isReport = n.id === "report";
          return (
            <button key={n.id} onClick={() => go(n.id)} className="flex flex-col items-center gap-1 px-3 py-1">
              {isReport ? (
                <div style={{ background: ORANGE }} className="w-11 h-11 rounded-full flex items-center justify-center -mt-5 shadow-lg shadow-orange-200">
                  <n.icon size={22} color="#fff" />
                </div>
              ) : (
                <n.icon size={21} color={active ? ORANGE : MUTED_SOFT} strokeWidth={active ? 2.4 : 2} />
              )}
              <span style={{ color: active ? ORANGE : MUTED_SOFT }} className="text-[10px] font-semibold">{n.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({ screen, go, role, notifCount }) {
  const extra = [
    { id: "track", label: "Track Reports", icon: Clock },
    { id: "business", label: "Business Pulse", icon: TrendingUp },
    { id: "transparency", label: "Transparency", icon: BarChart3 },
    { id: "areascore", label: "Area Score", icon: Activity },
    { id: "about", label: "Why NagPulse", icon: Sparkles },
  ];
  if (role === "admin") extra.push({ id: "admin", label: "Authority Console", icon: ShieldCheck });
  return (
    <div className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 py-6 px-4" style={{ background: INK, color: "#fff" }}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <div style={{ background: ORANGE }} className="w-9 h-9 rounded-xl flex items-center justify-center">
          <Activity size={18} color="#fff" />
        </div>
        <div>
          <div className="font-black text-lg leading-none tracking-tight">NagPulse</div>
          <div style={{ color: MUTED_SOFT }} className="text-[10px] tracking-wide">Smarter Nagpur</div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map((n) => {
          const active = screen === n.id;
          return (
            <button
              key={n.id} onClick={() => go(n.id)}
              style={{ background: active ? "rgba(255,106,43,0.16)" : "transparent", color: active ? ORANGE : "#C7CAD6" }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-white/5 relative"
            >
              <n.icon size={18} />{n.label}
              {n.id === "home" && notifCount > 0 && (
                <span style={{ background: RED }} className="ml-auto w-2 h-2 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      <div style={{ borderColor: INK_LINE }} className="border-t my-4" />
      <div className="flex flex-col gap-1">
        {extra.map((n) => {
          const active = screen === n.id;
          return (
            <button
              key={n.id} onClick={() => go(n.id)}
              style={{ background: active ? "rgba(255,106,43,0.16)" : "transparent", color: active ? ORANGE : "#9498A8" }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition hover:bg-white/5"
            >
              <n.icon size={16} />{n.label}
            </button>
          );
        })}
      </div>
      <div className="mt-auto px-3 py-3 rounded-xl" style={{ background: INK_SOFT }}>
        <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: MUTED_SOFT }}>Prototype build</div>
        <div className="text-xs" style={{ color: "#C7CAD6" }}>Viksit Nagpur Hackathon · Open Innovation Track</div>
      </div>
    </div>
  );
}

function Header({ title, subtitle, notifCount, onBell, onMenu }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-2 md:hidden mb-1">
          <div style={{ background: ORANGE }} className="w-6 h-6 rounded-md flex items-center justify-center">
            <Activity size={13} color="#fff" />
          </div>
          <span className="font-black text-sm tracking-tight" style={{ color: SLATE }}>NagPulse</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: SLATE }}>{title}</h1>
        {subtitle && <p style={{ color: MUTED }} className="text-sm mt-0.5">{subtitle}</p>}
      </div>
      <button onClick={onBell} className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <Bell size={18} color={SLATE} />
        {notifCount > 0 && (
          <span style={{ background: RED }} className="absolute -top-1 -right-1 text-[10px] text-white font-bold w-4 h-4 rounded-full flex items-center justify-center">{notifCount}</span>
        )}
      </button>
    </div>
  );
}

function NotificationsPanel({ items, onClose, onRead }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full overflow-y-auto p-5" style={{ background: CARD }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black" style={{ color: SLATE }}>Notifications</h2>
          <button onClick={onClose}><X size={20} color={MUTED} /></button>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((n) => (
            <button key={n.id} onClick={() => onRead(n.id)} className="text-left p-3 rounded-xl flex gap-3 items-start" style={{ background: n.read ? PAPER : ORANGE_TINT }}>
              <div className="mt-0.5">
                <span style={{ background: n.read ? MUTED_SOFT : ORANGE }} className="w-2 h-2 rounded-full block" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: SLATE }}>{n.text}</p>
                <p className="text-xs mt-1" style={{ color: MUTED }}>{n.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== LANDING PAGE ============================== */
function Landing({ onEnter, onExplore }) {
  return (
    <div style={{ background: INK, minHeight: "100vh" }} className="text-white">
      <style>{`
        @keyframes pulseDraw { 0% { stroke-dashoffset: 900; } 55% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -900; } }
        @keyframes floatSlow { 0%,100% { transform: translateY(0px);} 50% { transform: translateY(-10px);} }
        @keyframes pingSlow { 0% { transform: scale(0.9); opacity: .9;} 70% { transform: scale(2.1); opacity: 0;} 100% { opacity: 0;} }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{ background: ORANGE }} className="w-9 h-9 rounded-xl flex items-center justify-center">
            <Activity size={18} color="#fff" />
          </div>
          <span className="font-black text-lg tracking-tight">NagPulse</span>
        </div>
        <button onClick={onEnter} style={{ border: "1.5px solid rgba(255,255,255,0.25)" }} className="text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/10 transition">
          Sign in
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span style={{ background: "rgba(255,106,43,0.15)", color: ORANGE }} className="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
              Viksit Nagpur Hackathon · Open Innovation
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-[1.02] tracking-tight mb-5">
            Every Citizen.<br /> One Pulse.<br />
            <span style={{ color: ORANGE }}>A Smarter Nagpur.</span>
          </h1>
          <p style={{ color: "#B9BCC9" }} className="text-lg max-w-md mb-3">Report. Connect. Track. Transform.</p>
          <p style={{ color: "#8A8EA0" }} className="text-sm max-w-md mb-8 leading-relaxed">
            NagPulse is a citizen-powered urban intelligence platform connecting residents, local government departments, MSMEs and communities across Nagpur.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <PrimaryButton onClick={onEnter} icon={ArrowRight}>Report an Issue</PrimaryButton>
            <GhostButton onClick={onExplore} icon={MapIcon} style={{ border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff" }}>Explore Nagpur</GhostButton>
          </div>
          <div className="grid grid-cols-4 gap-4 max-w-lg">
            {[["24K+", "Reports"], ["18K+", "Resolved"], ["12K+", "Green Actions"], ["85%", "Participation"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-xl md:text-2xl font-black" style={{ color: ORANGE }}>{n}</div>
                <div className="text-[11px]" style={{ color: "#8A8EA0" }}>{l}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-3" style={{ color: "#5D6072" }}>* Prototype / demo statistics for hackathon presentation.</p>
        </div>

        <div className="relative h-[420px] hidden md:block">
          <div style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,106,43,0.16), transparent 65%)" }} className="absolute inset-0" />
          <svg viewBox="0 0 400 400" className="w-full h-full relative">
            <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="200" cy="200" r="105" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {[
              [200, 200, 6, ORANGE], [120, 140, 4, TEAL_LIGHT], [280, 150, 4, EMERALD],
              [90, 260, 3.5, "#fff"], [310, 260, 4, TEAL_LIGHT], [230, 90, 3.5, EMERALD],
              [150, 310, 3.5, ORANGE], [320, 190, 3, "#fff"],
            ].map(([cx, cy, r, c], i) => (
              <g key={i}>
                <line x1="200" y1="200" x2={cx} y2={cy} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                <circle cx={cx} cy={cy} r={r} fill={c} style={{ animation: `floatSlow ${3 + i * 0.3}s ease-in-out infinite` }} />
              </g>
            ))}
            <circle cx="200" cy="200" r="8" fill={ORANGE} opacity="0.5" style={{ animation: "pingSlow 2.4s ease-out infinite", transformOrigin: "200px 200px" }} />
          </svg>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
            <PulseLine color={ORANGE} height={34} />
            <p className="text-[11px] mt-1" style={{ color: "#8A8EA0" }}>Live civic signal — connected across Nagpur</p>
          </div>
        </div>
      </div>

      {/* Problem / Solution */}
      <div style={{ background: PAPER }} className="text-slate-900 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <SectionEyebrow color={ORANGE}>The Problem</SectionEyebrow>
          <p className="text-xl md:text-2xl font-bold leading-snug mb-8" style={{ color: SLATE }}>
            Urban problems are often noticed by citizens first — but fragmented reporting, duplicate complaints, lack of transparency, and limited community participation slow down effective action.
          </p>
          <SectionEyebrow color={TEAL}>The Solution</SectionEyebrow>
          <p className="text-xl md:text-2xl font-bold leading-snug" style={{ color: SLATE }}>
            NagPulse creates a single citizen-powered urban intelligence platform where problems are reported, verified, routed, tracked and analyzed — end to end.
          </p>
        </div>
      </div>

      {/* Journey */}
      <div className="py-16 md:py-20" style={{ background: INK }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionEyebrow color={ORANGE}>From Complaint to City Intelligence</SectionEyebrow>
          <h2 className="text-3xl font-black mb-10 tracking-tight">How one report becomes a smarter city</h2>
          <JourneyFlow />
        </div>
      </div>

      {/* USP */}
      <div className="py-16 md:py-20" style={{ background: "#0D0F16" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionEyebrow color={EMERALD}>Why NagPulse</SectionEyebrow>
          <h2 className="text-3xl font-black mb-10 tracking-tight">Citizen → Data → Action → Impact</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { t: "Crowdsourced", d: "Citizens become active participants in urban development.", icon: Users },
              { t: "AI-Assisted", d: "AI helps classify and verify civic issues from photos.", icon: ScanEye },
              { t: "Location Intelligence", d: "Reports are automatically connected to their geography.", icon: MapPin },
              { t: "Transparent", d: "Citizens can track the progress of their reports end to end.", icon: Layers },
              { t: "Community Verified", d: "Multiple citizens can confirm the same issue.", icon: ThumbsUp },
              { t: "Sustainable", d: "Green Nagpur tracks community-driven environmental effort.", icon: Leaf },
            ].map((u) => (
              <div key={u.t} className="p-5 rounded-2xl" style={{ background: INK_SOFT, border: `1px solid ${INK_LINE}` }}>
                <IconCircle Icon={u.icon} bg="rgba(255,106,43,0.14)" color={ORANGE} />
                <h3 className="font-bold mt-4 mb-1.5">{u.t}</h3>
                <p className="text-sm" style={{ color: "#9498A8" }}>{u.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future */}
      <div style={{ background: PAPER }} className="py-14 text-center">
        <SectionEyebrow color={TEAL}><span className="mx-auto">Future Expansion</span></SectionEyebrow>
        <p className="text-2xl font-black" style={{ color: SLATE }}>Designed for Nagpur today.</p>
        <p className="text-2xl font-black mb-8" style={{ color: TEAL }}>Scalable to Smart Cities tomorrow.</p>
        <div className="flex justify-center gap-3">
          <PrimaryButton onClick={onEnter} icon={ArrowRight}>Get Started</PrimaryButton>
        </div>
        <p className="text-xs mt-8" style={{ color: MUTED_SOFT }}>NagPulse is an independent hackathon prototype and is not officially operated by NMC or any government department.</p>
      </div>
    </div>
  );
}

function JourneyFlow() {
  const steps = [
    "Citizen Reports", "Location + Photo + Community Data", "AI Classification", "Duplicate Detection",
    "Department Routing", "Resolution Tracking", "Citizen Verification", "Aggregated Urban Insights", "Better Urban Planning",
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: INK_SOFT, border: `1px solid ${INK_LINE}` }}>
          <div style={{ background: i === steps.length - 1 ? EMERALD : ORANGE, color: "#fff" }} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
            {i + 1}
          </div>
          <p className="text-sm font-semibold" style={{ color: "#E7E9F0" }}>{s}</p>
        </div>
      ))}
    </div>
  );
}

/* ============================== LOGIN ============================== */
function Login({ onLogin, onBack }) {
  const options = [
    { id: "citizen", label: "Continue as Citizen", d: "Report issues, track progress, join Green Nagpur.", icon: User, color: ORANGE },
    { id: "business", label: "Continue as Business", d: "View local urban and market insight dashboards.", icon: TrendingUp, color: TEAL },
    { id: "admin", label: "Department / Admin Demo", d: "Preview the authority-side console.", icon: ShieldCheck, color: EMERALD },
  ];
  return (
    <div style={{ background: INK, minHeight: "100vh" }} className="flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="flex items-center gap-1 text-sm mb-8" style={{ color: "#8A8EA0" }}>
          <ChevronLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2 mb-3">
          <div style={{ background: ORANGE }} className="w-10 h-10 rounded-xl flex items-center justify-center">
            <Activity size={20} color="#fff" />
          </div>
          <span className="font-black text-xl text-white tracking-tight">NagPulse</span>
        </div>
        <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
        <p style={{ color: "#8A8EA0" }} className="text-sm mb-8">Choose how you'd like to explore the prototype. Authentication is simulated for this demo.</p>
        <div className="flex flex-col gap-3">
          {options.map((o) => (
            <button key={o.id} onClick={() => onLogin(o.id)} className="text-left p-4 rounded-2xl flex items-center gap-4 transition hover:brightness-110" style={{ background: INK_SOFT, border: `1px solid ${INK_LINE}` }}>
              <IconCircle Icon={o.icon} bg={o.color + "22"} color={o.color} size={46} />
              <div className="flex-1">
                <div className="font-bold text-white text-sm">{o.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "#8A8EA0" }}>{o.d}</div>
              </div>
              <ChevronRight size={18} color="#8A8EA0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== HOME DASHBOARD ============================== */
function Home({ go, reports, myScore, notifCount, onBell }) {
  const cards = [
    { id: "report", t: "Report an Issue", d: "See a problem? Report it in seconds.", icon: PlusCircle, color: ORANGE, tint: ORANGE_TINT },
    { id: "track", t: "Track My Reports", d: "Follow your complaints from submission to resolution.", icon: Clock, color: BLUE, tint: BLUE_TINT },
    { id: "map", t: "Nearby Issues", d: "See reported problems around you.", icon: MapIcon, color: TEAL, tint: TEAL_TINT },
    { id: "green", t: "Green Nagpur", d: "Track trees, saplings and green spaces.", icon: Leaf, color: EMERALD, tint: EMERALD_TINT },
    { id: "business", t: "Local Business Pulse", d: "Explore useful local urban & business insights.", icon: TrendingUp, color: AMBER, tint: AMBER_TINT },
  ];
  const recent = reports.slice(0, 3);
  return (
    <div className="pb-24 md:pb-10">
      <Header title="Namaste 👋" subtitle="Feel the city. Report the change." notifCount={notifCount} onBell={onBell} />

      <Card className="p-5 mb-6" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0A3E41 100%)`, border: "none" }}>
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-80 mb-1">NagPulse Score · Dharampeth</div>
            <div className="text-4xl font-black">86<span className="text-lg opacity-70">/100</span></div>
            <div className="text-xs opacity-80 mt-1">Your local area is in good civic health</div>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center relative">
            <svg viewBox="0 0 60 60" className="w-16 h-16 -rotate-90">
              <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
              <circle cx="30" cy="30" r="26" fill="none" stroke={ORANGE} strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - 0.86)} />
            </svg>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {cards.map((c) => (
          <Card key={c.id} onClick={() => go(c.id)} className="p-4 flex items-center gap-4">
            <IconCircle Icon={c.icon} bg={c.tint} color={c.color} size={50} iconSize={22} />
            <div className="flex-1">
              <div className="font-bold text-sm" style={{ color: SLATE }}>{c.t}</div>
              <div className="text-xs mt-0.5" style={{ color: MUTED }}>{c.d}</div>
            </div>
            <ChevronRight size={18} color={MUTED_SOFT} />
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-sm" style={{ color: SLATE }}>Recent activity near you</h2>
        <button onClick={() => go("map")} className="text-xs font-semibold" style={{ color: ORANGE }}>View map</button>
      </div>
      <div className="flex flex-col gap-2">
        {recent.map((r) => (
          <Card key={r.id} className="p-3 flex items-center gap-3">
            <IconCircle Icon={catMeta(r.category).icon} bg={PAPER} color={SLATE} size={38} iconSize={17} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: SLATE }}>{catMeta(r.category).label} · {r.area}</div>
              <div className="text-xs" style={{ color: MUTED }}>{r.time}</div>
            </div>
            <StatusChip status={r.status} />
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================== REPORT FLOW ============================== */
function ReportFlow({ onSubmit, go, existingReports }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [desc, setDesc] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [photo, setPhoto] = useState(false);
  const [area] = useState(AREAS[0]);
  const [showDup, setShowDup] = useState(false);
  const [dupResolved, setDupResolved] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [newId, setNewId] = useState(null);

  const duplicate = useMemo(() => existingReports.find((r) => r.category === category && r.area === area && r.status !== "resolved"), [category, area, existingReports]);

  function handlePhoto() {
    setPhoto(true);
    setTimeout(() => {
      const guesses = {
        road: { label: "Possible pothole detected", conf: 92, sev: "High" },
        water: { label: "Possible water leakage detected", conf: 88, sev: "Medium" },
        waste: { label: "Possible waste accumulation detected", conf: 90, sev: "Medium" },
        streetlight: { label: "Possible non-functional streetlight detected", conf: 85, sev: "Low" },
        drainage: { label: "Possible drain blockage detected", conf: 87, sev: "High" },
        traffic: { label: "Possible traffic hazard detected", conf: 81, sev: "Medium" },
        green: { label: "Possible sapling damage detected", conf: 79, sev: "Low" },
        infra: { label: "Possible infrastructure damage detected", conf: 84, sev: "Medium" },
        other: { label: "Issue image received", conf: 70, sev: "Low" },
      };
      const g = guesses[category] || guesses.other;
      setAiResult(g);
      setSeverity(g.sev);
    }, 900);
  }

  function goToDetails() { setStep(2); }
  function continueFromDetails() {
    if (duplicate && !dupResolved) { setShowDup(true); return; }
    finalizeSubmit();
  }
  function finalizeSubmit() {
    const id = `NP-2026-${String(Math.floor(100000 + Math.random() * 899999)).slice(0, 6)}`;
    setNewId(id);
    onSubmit({ id, category, area, severity, desc: desc || "No additional details provided.", status: "submitted", time: "Just now", upvotes: 1, mine: true });
    setStep(3);
  }
  function confirmExisting() {
    onSubmit({ confirmOnly: true, id: duplicate.id });
    setDupResolved(true); setShowDup(false);
    const id = duplicate.id; setNewId(id); setStep(3);
  }

  return (
    <div className="pb-24 md:pb-10 max-w-2xl">
      <Header title="Report an Issue" subtitle={`Step ${step} of 3`} notifCount={0} onBell={() => {}} />

      {/* progress */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="h-1.5 flex-1 rounded-full" style={{ background: s <= step ? ORANGE : BORDER }} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: SLATE }}>What kind of issue are you seeing?</p>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCategory(c.id); goToDetails(); }}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition hover:shadow-md"
                style={{ background: category === c.id ? ORANGE_TINT : CARD, border: `1.5px solid ${category === c.id ? ORANGE : BORDER}` }}
              >
                <IconCircle Icon={c.icon} bg={ORANGE_TINT} color={ORANGE_DEEP} size={42} iconSize={19} />
                <span className="text-xs font-semibold text-center leading-tight" style={{ color: SLATE }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && category && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <IconCircle Icon={catMeta(category).icon} bg={ORANGE_TINT} color={ORANGE_DEEP} size={36} iconSize={16} />
            <div>
              <div className="text-sm font-bold" style={{ color: SLATE }}>{catMeta(category).label}</div>
              <div className="text-xs" style={{ color: MUTED }}>Routes to {catMeta(category).dept}</div>
            </div>
            <button onClick={() => setStep(1)} className="ml-auto text-xs font-semibold" style={{ color: ORANGE }}>Change</button>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: SLATE }}>Add a photo</p>
            <div className="flex gap-3">
              <button onClick={handlePhoto} className="flex-1 flex flex-col items-center gap-2 p-5 rounded-xl" style={{ border: `1.5px dashed ${BORDER}` }}>
                <Camera size={22} color={MUTED} /><span className="text-xs font-medium" style={{ color: MUTED }}>Capture photo</span>
              </button>
              <button onClick={handlePhoto} className="flex-1 flex flex-col items-center gap-2 p-5 rounded-xl" style={{ border: `1.5px dashed ${BORDER}` }}>
                <Upload size={22} color={MUTED} /><span className="text-xs font-medium" style={{ color: MUTED }}>Upload photo</span>
              </button>
            </div>
            {photo && !aiResult && (
              <div className="mt-3 flex items-center gap-2 text-xs font-medium" style={{ color: MUTED }}>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${ORANGE} transparent ${ORANGE} ${ORANGE}` }} />
                Analyzing image…
              </div>
            )}
            {aiResult && (
              <div className="mt-3 p-4 rounded-xl" style={{ background: TEAL_TINT, border: `1px solid ${TEAL_LIGHT}33` }}>
                <div className="flex items-center gap-2 mb-2">
                  <ScanEye size={16} color={TEAL} />
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: TEAL }}>AI Prototype Feature</span>
                </div>
                <p className="text-sm font-bold" style={{ color: SLATE }}>{aiResult.label}</p>
                <div className="flex gap-4 mt-2 text-xs" style={{ color: MUTED }}>
                  <span>Confidence: <b style={{ color: SLATE }}>{aiResult.conf}%</b></span>
                  <span>Category: <b style={{ color: SLATE }}>{catMeta(category).label}</b></span>
                  <span>Severity: <b style={{ color: SLATE }}>{aiResult.sev}</b></span>
                </div>
                <p className="text-[11px] mt-2 italic" style={{ color: MUTED_SOFT }}>Demo classification only — not a real government verification system.</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: SLATE }}>Short description</p>
            <textarea
              value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Describe what you noticed..."
              className="w-full p-3 rounded-xl text-sm outline-none" style={{ border: `1.5px solid ${BORDER}`, color: SLATE }}
            />
          </div>

          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: SLATE }}>Location</p>
            <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: EMERALD_TINT }}>
              <MapPin size={16} color={EMERALD} />
              <span className="text-sm font-medium" style={{ color: SLATE }}>Location automatically detected</span>
            </div>
            <div className="mt-2 h-28 rounded-xl relative overflow-hidden" style={{ background: PAPER, border: `1px solid ${BORDER}` }}>
              <MiniMapPreview area={area} />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: SLATE }}>Severity</p>
            <div className="grid grid-cols-4 gap-2">
              {["Low", "Medium", "High", "Critical"].map((s) => (
                <button
                  key={s} onClick={() => setSeverity(s)}
                  style={{ background: severity === s ? SEVERITY_COLOR[s] : SEVERITY_TINT[s], color: severity === s ? "#fff" : SEVERITY_COLOR[s] }}
                  className="py-2 rounded-lg text-xs font-bold transition"
                >{s}</button>
              ))}
            </div>
          </div>

          <PrimaryButton onClick={continueFromDetails} icon={ArrowRight} full>Review & Submit</PrimaryButton>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center text-center py-6">
          <div style={{ background: EMERALD_TINT }} className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} color={EMERALD} />
          </div>
          <h2 className="text-xl font-black mb-1" style={{ color: SLATE }}>{dupResolved ? "Thanks for confirming!" : "Report submitted successfully!"}</h2>
          <p className="text-sm mb-6" style={{ color: MUTED }}>{dupResolved ? "You've strengthened an existing community report." : "Your report is now visible to the responsible department."}</p>

          <Card className="p-5 w-full text-left">
            <div className="text-xs uppercase tracking-wide mb-1" style={{ color: MUTED }}>Complaint ID</div>
            <div className="text-lg font-black mb-4" style={{ color: ORANGE_DEEP }}>{newId}</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs" style={{ color: MUTED }}>Category</div><div className="font-semibold" style={{ color: SLATE }}>{catMeta(category).label}</div></div>
              <div><div className="text-xs" style={{ color: MUTED }}>Location</div><div className="font-semibold" style={{ color: SLATE }}>{area}, Nagpur</div></div>
              <div><div className="text-xs" style={{ color: MUTED }}>Date / Time</div><div className="font-semibold" style={{ color: SLATE }}>17 Aug 2026, Just now</div></div>
              <div><div className="text-xs" style={{ color: MUTED }}>Assigned Dept.</div><div className="font-semibold" style={{ color: SLATE }}>{catMeta(category).dept}</div></div>
            </div>
            <div className="mt-4"><StatusChip status="submitted" /></div>
          </Card>

          <div className="flex gap-3 w-full mt-6">
            <GhostButton full onClick={() => go("track")}>Track Reports</GhostButton>
            <PrimaryButton full onClick={() => go("home")}>Back Home</PrimaryButton>
          </div>
        </div>
      )}

      {showDup && duplicate && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-4">
          <Card className="p-5 w-full max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} color={AMBER} />
              <h3 className="font-bold text-sm" style={{ color: SLATE }}>We found a similar issue nearby</h3>
            </div>
            <p className="text-sm mb-3" style={{ color: MUTED }}>A {catMeta(duplicate.category).label.toLowerCase()} report already exists in {duplicate.area}, with {duplicate.upvotes} citizen confirmations.</p>
            <Card className="p-3 mb-4 flex items-center gap-3" style={{ background: PAPER }}>
              <IconCircle Icon={catMeta(duplicate.category).icon} bg={CARD} color={SLATE} size={36} iconSize={16} />
              <div className="flex-1">
                <div className="text-xs font-bold" style={{ color: SLATE }}>{duplicate.id}</div>
                <div className="text-[11px]" style={{ color: MUTED }}>{duplicate.time} · {duplicate.upvotes} confirmations</div>
              </div>
              <StatusChip status={duplicate.status} />
            </Card>
            <div className="flex flex-col gap-2">
              <PrimaryButton full onClick={confirmExisting} icon={ThumbsUp}>Confirm Existing Report</PrimaryButton>
              <GhostButton full onClick={() => { setShowDup(false); setDupResolved(true); finalizeSubmit(); }}>Create New Report Anyway</GhostButton>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function MiniMapPreview({ area }) {
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 300 110" className="w-full h-full">
        <defs>
          <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={BORDER} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="300" height="110" fill="url(#grid2)" />
        <path d="M0,60 C80,20 220,100 300,50" stroke={MUTED_SOFT} strokeWidth="3" fill="none" opacity="0.5" />
      </svg>
      <div className="absolute" style={{ left: "50%", top: "48%", transform: "translate(-50%,-50%)" }}>
        <span className="relative flex h-3 w-3">
          <span style={{ background: ORANGE }} className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" />
          <span style={{ background: ORANGE }} className="relative inline-flex rounded-full h-3 w-3 border-2 border-white" />
        </span>
      </div>
      <span className="absolute bottom-1.5 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: CARD, color: SLATE, border: `1px solid ${BORDER}` }}>{area}, Nagpur</span>
    </div>
  );
}

/* ============================== TRACK REPORTS ============================== */
function TrackReports({ reports }) {
  const mine = reports.filter((r) => r.mine);
  const [openId, setOpenId] = useState(mine[0]?.id || null);
  return (
    <div className="pb-24 md:pb-10">
      <Header title="Track My Reports" subtitle="Follow your complaints from submission to resolution." notifCount={0} onBell={() => {}} />
      {mine.length === 0 && <Card className="p-6 text-center text-sm" style={{ color: MUTED }}>You haven't submitted any reports yet.</Card>}
      <div className="flex flex-col gap-3">
        {mine.map((r) => {
          const open = openId === r.id;
          const activeIdx = STATUS_ORDER.indexOf(r.status);
          return (
            <Card key={r.id} className="p-4">
              <button onClick={() => setOpenId(open ? null : r.id)} className="w-full flex items-center gap-3 text-left">
                <IconCircle Icon={catMeta(r.category).icon} bg={PAPER} color={SLATE} size={42} iconSize={18} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: SLATE }}>{r.id}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{catMeta(r.category).label} · {r.area}</div>
                </div>
                <StatusChip status={r.status} />
                <ChevronDown size={16} color={MUTED_SOFT} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>
              {open && (
                <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between mb-4">
                    {STATUS_ORDER.map((s, i) => (
                      <div key={s} className="flex-1 flex flex-col items-center relative">
                        {i > 0 && <div className="absolute top-3 right-1/2 w-full h-0.5" style={{ background: i <= activeIdx ? STATUS_META[s].color : BORDER, zIndex: 0 }} />}
                        <div className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: i <= activeIdx ? STATUS_META[s].color : BORDER }}>
                          {i <= activeIdx && <Check size={13} color="#fff" />}
                        </div>
                        <span className="text-[9px] mt-1 font-semibold text-center" style={{ color: i <= activeIdx ? SLATE : MUTED_SOFT }}>{STATUS_META[s].label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm mb-3" style={{ color: MUTED }}>{r.desc}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span style={{ color: MUTED }}>Severity: </span><SeverityPill level={r.severity} /></div>
                    <div><span style={{ color: MUTED }}>Department: </span><span className="font-semibold" style={{ color: SLATE }}>{catMeta(r.category).dept}</span></div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold mb-3" style={{ color: SLATE }}>Smart routing, visually</p>
        <Card className="p-5 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max text-xs font-semibold">
            {["Citizen", "NagPulse AI", "Relevant Department", "Resolution", "Citizen Verification"].map((s, i, arr) => (
              <React.Fragment key={s}>
                <div className="px-3 py-2 rounded-lg" style={{ background: PAPER, color: SLATE }}>{s}</div>
                {i < arr.length - 1 && <ArrowRight size={14} color={MUTED_SOFT} />}
              </React.Fragment>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== COMMUNITY MAP ============================== */
function CommunityMap({ reports, onUpvote }) {
  const [selected, setSelected] = useState(reports[0]?.id || null);
  const sel = reports.find((r) => r.id === selected);
  const markerColor = (r) => (r.status === "resolved" ? EMERALD : r.severity === "Critical" ? RED : r.severity === "High" ? ORANGE_DEEP : AMBER);

  return (
    <div className="pb-24 md:pb-10">
      <Header title="Nearby Issues" subtitle="See reported problems around you." notifCount={0} onBell={() => {}} />
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 p-0 overflow-hidden relative" style={{ height: 440 }}>
          <div className="absolute inset-0" style={{ background: PAPER }}>
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="mapgrid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#E2E5EF" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#mapgrid)" />
              <path d="M0,30 Q30,10 55,25 T100,20" stroke="#D7DBE6" strokeWidth="1.2" fill="none" />
              <path d="M0,70 Q40,55 60,72 T100,65" stroke="#D7DBE6" strokeWidth="1.2" fill="none" />
              <path d="M20,0 L30,100" stroke="#D7DBE6" strokeWidth="1" fill="none" />
              <path d="M75,0 L68,100" stroke="#D7DBE6" strokeWidth="1" fill="none" />
            </svg>
          </div>
          {reports.map((r) => {
            const pos = mapPositions[r.id] || { x: 50, y: 50 };
            const active = selected === r.id;
            return (
              <button
                key={r.id} onClick={() => setSelected(r.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition"
                style={{ left: pos.x + "%", top: pos.y + "%", zIndex: active ? 20 : 10 }}
              >
                <span className="relative flex" style={{ width: active ? 22 : 16, height: active ? 22 : 16 }}>
                  {active && <span style={{ background: markerColor(r) }} className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" />}
                  <span style={{ background: markerColor(r), borderColor: "#fff" }} className="relative inline-flex rounded-full h-full w-full border-2 shadow" />
                </span>
              </button>
            );
          })}
          <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] font-semibold px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.92)", border: `1px solid ${BORDER}` }}>
            <span className="flex items-center gap-1"><span style={{ background: RED }} className="w-2 h-2 rounded-full" />Critical</span>
            <span className="flex items-center gap-1"><span style={{ background: ORANGE_DEEP }} className="w-2 h-2 rounded-full" />High</span>
            <span className="flex items-center gap-1"><span style={{ background: AMBER }} className="w-2 h-2 rounded-full" />Medium</span>
            <span className="flex items-center gap-1"><span style={{ background: EMERALD }} className="w-2 h-2 rounded-full" />Resolved</span>
          </div>
        </Card>

        {sel && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconCircle Icon={catMeta(sel.category).icon} bg={PAPER} color={SLATE} size={40} iconSize={18} />
              <div>
                <div className="font-bold text-sm" style={{ color: SLATE }}>{catMeta(sel.category).label} Report</div>
                <div className="text-xs" style={{ color: MUTED }}>{sel.id}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm mb-4">
              <div className="flex justify-between"><span style={{ color: MUTED }}>Location</span><span className="font-semibold" style={{ color: SLATE }}>{sel.area}, Nagpur</span></div>
              <div className="flex justify-between"><span style={{ color: MUTED }}>Reported</span><span className="font-semibold" style={{ color: SLATE }}>{sel.time}</span></div>
              <div className="flex justify-between items-center"><span style={{ color: MUTED }}>Status</span><StatusChip status={sel.status} /></div>
              <div className="flex justify-between items-center"><span style={{ color: MUTED }}>Severity</span><SeverityPill level={sel.severity} /></div>
              <div className="flex justify-between"><span style={{ color: MUTED }}>Reports from citizens</span><span className="font-semibold" style={{ color: SLATE }}>{sel.upvotes}</span></div>
            </div>
            <p className="text-xs mb-4" style={{ color: MUTED }}>{sel.desc}</p>
            <PrimaryButton full icon={ThumbsUp} onClick={() => onUpvote(sel.id)}>Upvote / Confirm Issue</PrimaryButton>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ============================== GREEN NAGPUR ============================== */
function GreenNagpur({ trees, onRegister, stats }) {
  const [showForm, setShowForm] = useState(false);
  const [area, setArea] = useState(AREAS[0]);
  return (
    <div className="pb-24 md:pb-10">
      <Header title="Green Nagpur" subtitle="Track trees, saplings and green spaces." notifCount={0} onBell={() => {}} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          ["Saplings Registered", stats.total, EMERALD],
          ["Healthy", stats.healthy, TEAL],
          ["Needs Attention", stats.attention, AMBER],
          ["Reported Damaged", stats.damaged, RED],
        ].map(([l, v, c]) => (
          <Card key={l} className="p-4">
            <div className="text-xl font-black" style={{ color: c }}>{v.toLocaleString()}</div>
            <div className="text-xs mt-1" style={{ color: MUTED }}>{l}</div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold" style={{ color: SLATE }}>Registered saplings & trees</p>
        <PrimaryButton onClick={() => setShowForm(true)} color={EMERALD} icon={Leaf}>Register a Sapling</PrimaryButton>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {trees.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold flex items-center gap-1.5" style={{ color: SLATE }}><Leaf size={15} color={EMERALD} />Sapling {t.id}</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: t.status === "Healthy" ? EMERALD_TINT : t.status === "Needs Attention" ? AMBER_TINT : RED_TINT,
                  color: t.status === "Healthy" ? EMERALD : t.status === "Needs Attention" ? AMBER : RED,
                }}
              >{t.status}</span>
            </div>
            <div className="text-xs flex flex-col gap-1" style={{ color: MUTED }}>
              <span className="flex items-center gap-1.5"><MapPin size={12} /> {t.area}, Nagpur</span>
              <span className="flex items-center gap-1.5"><Clock size={12} /> Planted {t.planted}</span>
              <span className="flex items-center gap-1.5"><ThumbsUp size={12} /> {t.verifications} community verifications</span>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-4">
          <Card className="p-5 w-full max-w-sm">
            <h3 className="font-bold text-sm mb-4" style={{ color: SLATE }}>Register a new sapling</h3>
            <div className="flex flex-col gap-3 mb-4">
              <button className="p-4 rounded-xl flex flex-col items-center gap-1" style={{ border: `1.5px dashed ${BORDER}` }}>
                <Camera size={20} color={MUTED} /><span className="text-xs" style={{ color: MUTED }}>Add photo of the sapling</span>
              </button>
              <div>
                <label className="text-xs font-semibold" style={{ color: SLATE }}>Location</label>
                <select value={area} onChange={(e) => setArea(e.target.value)} className="w-full mt-1 p-2.5 rounded-lg text-sm" style={{ border: `1.5px solid ${BORDER}` }}>
                  {AREAS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <GhostButton full onClick={() => setShowForm(false)}>Cancel</GhostButton>
              <PrimaryButton full color={EMERALD} onClick={() => { onRegister(area); setShowForm(false); }}>Register</PrimaryButton>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ============================== BUSINESS PULSE ============================== */
function BusinessPulse() {
  return (
    <div className="pb-24 md:pb-10">
      <Header title="Local Business Pulse" subtitle="Explore useful local urban & business insights." notifCount={0} onBell={() => {}} />
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold" style={{ color: SLATE }}>Nagpur Business Pulse</h2>
        <DemoTag />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          ["Market Activity", "+12%", TrendingUp, EMERALD],
          ["Transport Accessibility", "78%", Truck, TEAL],
          ["Estimated Footfall", "24.5K", Users, BLUE],
          ["Supply Availability", "Good", Package, AMBER],
        ].map(([l, v, Icon, c]) => (
          <Card key={l} className="p-4">
            <IconCircle Icon={Icon} bg={c + "1A"} color={c} size={38} iconSize={17} />
            <div className="text-lg font-black mt-3" style={{ color: SLATE }}>{v}</div>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>{l}</div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: SLATE }}>Footfall by area (weekly avg.)</p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={areaDensityData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: MUTED }} interval={0} angle={-35} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10, fill: MUTED }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={AMBER} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: SLATE }}>Civic issues near commercial zones</p>
          <div className="flex flex-col gap-2 mt-2">
            {[["Sitabuldi", 6, "Water"], ["Sadar", 4, "Waste"], ["Civil Lines", 3, "Traffic"], ["Dharampeth", 2, "Road"]].map(([a, n, c]) => (
              <div key={a} className="flex items-center justify-between text-sm p-2.5 rounded-lg" style={{ background: PAPER }}>
                <span className="font-medium" style={{ color: SLATE }}>{a}</span>
                <span style={{ color: MUTED }}>{n} open {c.toLowerCase()} issues</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-3 italic" style={{ color: MUTED_SOFT }}>Helps MSMEs plan deliveries and site visits around known trouble spots.</p>
        </Card>
      </div>
      <p className="text-[11px] mt-4" style={{ color: MUTED_SOFT }}>All figures on this page are illustrative demo data for the hackathon prototype.</p>
    </div>
  );
}

/* ============================== PROFILE / GAMIFICATION ============================== */
function Profile({ points, reportsCount, resolvedCount, confirmCount, treesCount }) {
  const badges = [
    { t: "Civic Champion", icon: Trophy, earned: reportsCount >= 5, color: ORANGE },
    { t: "Green Guardian", icon: Leaf, earned: treesCount >= 3, color: EMERALD },
    { t: "Local Observer", icon: MapPin, earned: confirmCount >= 10, color: BLUE },
    { t: "Community Contributor", icon: Users, earned: true, color: TEAL },
  ];
  return (
    <div className="pb-24 md:pb-10">
      <Header title="My Impact" subtitle="Your civic participation, in one place." notifCount={0} onBell={() => {}} />

      <Card className="p-5 mb-6" style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_DEEP} 100%)`, border: "none" }}>
        <div className="text-white">
          <div className="text-xs uppercase tracking-wider opacity-85 mb-1">Total civic points</div>
          <div className="text-4xl font-black">{points.toLocaleString()}</div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[["Reports Submitted", reportsCount], ["Issues Resolved", resolvedCount], ["Community Confirmations", confirmCount], ["Trees Registered", treesCount]].map(([l, v]) => (
          <Card key={l} className="p-4">
            <div className="text-xl font-black" style={{ color: SLATE }}>{v}</div>
            <div className="text-xs mt-1" style={{ color: MUTED }}>{l}</div>
          </Card>
        ))}
      </div>

      <p className="text-sm font-semibold mb-3" style={{ color: SLATE }}>Badges</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {badges.map((b) => (
          <Card key={b.t} className="p-4 flex flex-col items-center text-center" style={{ opacity: b.earned ? 1 : 0.45 }}>
            <IconCircle Icon={b.icon} bg={b.color + "1A"} color={b.color} size={44} />
            <div className="text-xs font-bold mt-3" style={{ color: SLATE }}>{b.t}</div>
            <div className="text-[10px] mt-0.5" style={{ color: MUTED }}>{b.earned ? "Earned" : "Locked"}</div>
          </Card>
        ))}
      </div>

      <p className="text-sm font-semibold mb-3" style={{ color: SLATE }}>How you earn points</p>
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between"><span style={{ color: MUTED }}>Report verified</span><span className="font-bold" style={{ color: SLATE }}>+10</span></div>
          <div className="flex justify-between"><span style={{ color: MUTED }}>Issue resolved</span><span className="font-bold" style={{ color: SLATE }}>+25</span></div>
          <div className="flex justify-between"><span style={{ color: MUTED }}>Tree registered</span><span className="font-bold" style={{ color: SLATE }}>+20</span></div>
          <div className="flex justify-between"><span style={{ color: MUTED }}>Community confirmation</span><span className="font-bold" style={{ color: SLATE }}>+5</span></div>
        </div>
      </Card>
      <p className="text-xs mt-4" style={{ color: MUTED }}>Points recognize real civic participation — reporting, verifying and improving your neighborhood together.</p>
    </div>
  );
}

/* ============================== TRANSPARENCY DASHBOARD ============================== */
function Transparency() {
  return (
    <div className="pb-24 md:pb-10">
      <Header title="Nagpur Civic Pulse" subtitle="Public transparency dashboard." notifCount={0} onBell={() => {}} />
      <DemoTag />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {[["Total Reports", "24,821", SLATE], ["Resolved", "18,430", TEAL], ["In Progress", "4,281", ORANGE_DEEP], ["Pending Verification", "2,110", MUTED]].map(([l, v, c]) => (
          <Card key={l} className="p-4">
            <div className="text-xl font-black" style={{ color: c }}>{v}</div>
            <div className="text-xs mt-1" style={{ color: MUTED }}>{l}</div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: SLATE }}>Issues by category</p>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={categoryChartData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: MUTED }} />
                <YAxis tick={{ fontSize: 10, fill: MUTED }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={ORANGE} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: SLATE }}>Resolution rate</p>
          <div style={{ width: "100%", height: 220 }} className="flex items-center justify-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={resolutionPie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {resolutionPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 text-[11px] mt-1">
            {resolutionPie.map((e) => (
              <span key={e.name} className="flex items-center gap-1"><span style={{ background: e.color }} className="w-2 h-2 rounded-full" />{e.name}</span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: SLATE }}>Monthly reports trend</p>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: MUTED }} />
                <YAxis tick={{ fontSize: 10, fill: MUTED }} />
                <Tooltip />
                <Line type="monotone" dataKey="reports" stroke={TEAL} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: SLATE }}>Issue density by area</p>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={areaDensityData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: MUTED }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: MUTED }} width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill={BLUE} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <p className="text-sm font-bold mb-3" style={{ color: SLATE }}>Most reported issues</p>
        <div className="flex flex-col gap-2">
          {[["Road / Pothole damage", "7,120"], ["Waste management delays", "5,240"], ["Water supply leakage", "4,310"], ["Non-functional streetlights", "2,870"]].map(([l, v], i) => (
            <div key={l} className="flex items-center gap-3 text-sm">
              <span className="w-5 font-black" style={{ color: MUTED_SOFT }}>{i + 1}</span>
              <span className="flex-1" style={{ color: SLATE }}>{l}</span>
              <span className="font-bold" style={{ color: ORANGE_DEEP }}>{v}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: MUTED }}>Average resolution time: <b style={{ color: SLATE }}>4.6 days</b></p>
      </Card>
    </div>
  );
}

/* ============================== AREA SCORE ============================== */
function AreaScore() {
  const [area, setArea] = useState("Dharampeth");
  const s = areaScores[area];
  const rows = [["Roads", s.roads], ["Cleanliness", s.clean], ["Water", s.water], ["Green Cover", s.green], ["Streetlights", s.lights]];
  return (
    <div className="pb-24 md:pb-10 max-w-2xl">
      <Header title="NagPulse Area Score" subtitle="A prototype composite score based on demo civic data." notifCount={0} onBell={() => {}} />
      <select value={area} onChange={(e) => setArea(e.target.value)} className="mb-5 p-2.5 rounded-lg text-sm font-semibold" style={{ border: `1.5px solid ${BORDER}`, color: SLATE }}>
        {AREAS.map((a) => <option key={a}>{a}</option>)}
      </select>

      <Card className="p-6 mb-5" style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0A3E41 100%)`, border: "none" }}>
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-sm opacity-85">{area}</div>
            <div className="text-4xl font-black mt-1">{s.total}<span className="text-lg opacity-70">/100</span></div>
          </div>
          <Activity size={40} opacity={0.5} />
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col gap-4">
          {rows.map(([l, v]) => (
            <div key={l}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold" style={{ color: SLATE }}>{l}</span>
                <span className="font-bold" style={{ color: v >= 80 ? EMERALD : v >= 60 ? AMBER : RED }}>{v}</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: PAPER }}>
                <div className="h-2 rounded-full" style={{ width: v + "%", background: v >= 80 ? EMERALD : v >= 60 ? AMBER : RED }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <p className="text-xs mt-3" style={{ color: MUTED_SOFT }}>Score composed from road condition, waste management, water issues, streetlights, green cover, public infrastructure and community feedback signals. Demo data — illustrative only.</p>
    </div>
  );
}

/* ============================== ABOUT / USP PAGE ============================== */
function About() {
  return (
    <div className="pb-24 md:pb-10">
      <Header title="Why NagPulse" subtitle="Citizen → Data → Action → Impact" notifCount={0} onBell={() => {}} />
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { t: "Crowdsourced", d: "Citizens become active participants in urban development.", icon: Users },
          { t: "AI-Assisted", d: "AI helps classify and verify civic issues.", icon: ScanEye },
          { t: "Location Intelligence", d: "Reports are automatically connected to their geographical location.", icon: MapPin },
          { t: "Transparent", d: "Citizens can track the progress of their reports.", icon: Layers },
          { t: "Community Verified", d: "Multiple citizens can confirm the same issue.", icon: ThumbsUp },
          { t: "Sustainable", d: "Green Nagpur tracks community-driven environmental efforts.", icon: Leaf },
        ].map((u) => (
          <Card key={u.t} className="p-5">
            <IconCircle Icon={u.icon} bg={ORANGE_TINT} color={ORANGE_DEEP} />
            <h3 className="font-bold mt-4 mb-1.5 text-sm" style={{ color: SLATE }}>{u.t}</h3>
            <p className="text-xs" style={{ color: MUTED }}>{u.d}</p>
          </Card>
        ))}
      </div>
      <p className="text-sm font-semibold mb-3" style={{ color: SLATE }}>From complaint to city intelligence</p>
      <Card className="p-5 mb-8" style={{ background: INK, border: "none" }}>
        <JourneyFlow />
      </Card>
      <Card className="p-6 text-center" style={{ background: PAPER }}>
        <SectionEyebrow color={TEAL}><span className="mx-auto">Future Expansion</span></SectionEyebrow>
        <p className="text-lg font-black" style={{ color: SLATE }}>Designed for Nagpur today. Scalable to Smart Cities tomorrow.</p>
      </Card>
    </div>
  );
}

/* ============================== ADMIN CONSOLE ============================== */
function Admin({ reports }) {
  const [filter, setFilter] = useState("All");
  const filtered = reports.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Critical") return r.severity === "Critical";
    if (filter === "Pending") return r.status === "submitted" || r.status === "verified";
    if (filter === "In Progress") return r.status === "assigned" || r.status === "in_progress";
    if (filter === "Resolved") return r.status === "resolved";
    return true;
  });
  const cols = [
    { key: "submitted", label: "Submitted" }, { key: "verified", label: "Verified" },
    { key: "assigned", label: "Assigned" }, { key: "in_progress", label: "In Progress" }, { key: "resolved", label: "Resolved" },
  ];
  const avgRes = "4.6 days";
  return (
    <div className="pb-24 md:pb-10">
      <Header title="Authority Console" subtitle="Demo view for departments & administrators." notifCount={0} onBell={() => {}} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[["Incoming Reports", reports.length], ["Priority Issues", reports.filter((r) => r.severity === "Critical" || r.severity === "High").length], ["Avg. Resolution Time", avgRes], ["Community Verifications", reports.reduce((a, r) => a + r.upvotes, 0)]].map(([l, v]) => (
          <Card key={l} className="p-4">
            <div className="text-xl font-black" style={{ color: SLATE }}>{v}</div>
            <div className="text-xs mt-1" style={{ color: MUTED }}>{l}</div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        {["All", "Critical", "Pending", "In Progress", "Resolved"].map((f) => (
          <button
            key={f} onClick={() => setFilter(f)}
            style={{ background: filter === f ? SLATE : CARD, color: filter === f ? "#fff" : SLATE, border: `1px solid ${filter === f ? SLATE : BORDER}` }}
            className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
          >{f}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-3 overflow-x-auto">
        {cols.map((c) => (
          <div key={c.key} className="min-w-[220px]">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: MUTED }}>{c.label}</span>
              <span className="text-xs font-bold" style={{ color: STATUS_META[c.key].color }}>{filtered.filter((r) => r.status === c.key).length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {filtered.filter((r) => r.status === c.key).map((r) => (
                <Card key={r.id} className="p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold" style={{ color: SLATE }}>{r.id}</span>
                    <SeverityPill level={r.severity} />
                  </div>
                  <div className="text-xs" style={{ color: MUTED }}>{catMeta(r.category).label} · {r.area}</div>
                  <div className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: MUTED_SOFT }}><ThumbsUp size={11} />{r.upvotes} confirmations</div>
                </Card>
              ))}
              {filtered.filter((r) => r.status === c.key).length === 0 && (
                <div className="text-[11px] text-center py-4 rounded-xl" style={{ color: MUTED_SOFT, border: `1px dashed ${BORDER}` }}>No reports</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold mb-3" style={{ color: SLATE }}>Complaint map — area-wise issue density</p>
        <Card className="p-4">
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={areaDensityData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: MUTED }} interval={0} angle={-35} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10, fill: MUTED }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={SLATE} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== ROOT APP ============================== */
export default function NagPulseApp() {
  const [phase, setPhase] = useState("landing"); // landing | login | app
  const [role, setRole] = useState(null);
  const [screen, setScreen] = useState("home");
  const [reports, setReports] = useState(initialReports);
  const [trees, setTrees] = useState(initialTrees);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotif, setShowNotif] = useState(false);
  const [points, setPoints] = useState(415);

  const notifCount = notifications.filter((n) => !n.read).length;

  function handleLogin(r) {
    setRole(r);
    setPhase("app");
    setScreen(r === "admin" ? "admin" : "home");
  }

  function go(id) { setScreen(id); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function handleSubmitReport(payload) {
    if (payload.confirmOnly) {
      setReports((prev) => prev.map((r) => (r.id === payload.id ? { ...r, upvotes: r.upvotes + 1 } : r)));
      setPoints((p) => p + 5);
      setNotifications((prev) => [{ id: Date.now(), text: `You confirmed report ${payload.id}. Thanks for verifying!`, time: "Just now", read: false }, ...prev]);
      return;
    }
    setReports((prev) => [{ ...payload }, ...prev]);
    setPoints((p) => p + 10);
    setNotifications((prev) => [{ id: Date.now(), text: `Your report ${payload.id} has been submitted and is under review.`, time: "Just now", read: false }, ...prev]);
  }

  function handleUpvote(id) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r)));
    setPoints((p) => p + 5);
  }

  function handleRegisterTree(area) {
    const id = `GN-${String(Math.floor(10000 + Math.random() * 89999)).slice(0, 5)}`;
    setTrees((prev) => [{ id, area, planted: "17 Aug 2026", verifications: 0, status: "Healthy" }, ...prev]);
    setPoints((p) => p + 20);
    setNotifications((prev) => [{ id: Date.now(), text: `Sapling ${id} registered in ${area}. Thank you for greening Nagpur!`, time: "Just now", read: false }, ...prev]);
  }

  function markRead(id) { setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))); }

  const greenStats = useMemo(() => {
    const total = 12480 + trees.length - initialTrees.length;
    const healthy = trees.filter((t) => t.status === "Healthy").length;
    const attention = trees.filter((t) => t.status === "Needs Attention").length;
    const damaged = trees.filter((t) => t.status === "Damaged").length;
    return {
      total,
      healthy: 10920 + (healthy - initialTrees.filter((t) => t.status === "Healthy").length),
      attention: 1060,
      damaged: 500,
    };
  }, [trees]);

  const myReports = reports.filter((r) => r.mine);
  const resolvedCount = myReports.filter((r) => r.status === "resolved").length;

  if (phase === "landing") return <Landing onEnter={() => setPhase("login")} onExplore={() => { setPhase("login"); }} />;
  if (phase === "login") return <Login onLogin={handleLogin} onBack={() => setPhase("landing")} />;

  return (
    <div style={{ background: PAPER, minHeight: "100vh" }} className="flex">
      <style>{`
        @keyframes pulseDraw { 0% { stroke-dashoffset: 900; } 55% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -900; } }
      `}</style>
      <Sidebar screen={screen} go={go} role={role} notifCount={notifCount} />
      <div className="flex-1 min-w-0 px-4 md:px-8 pt-6">
        <div className="max-w-6xl mx-auto">
          {screen === "home" && <Home go={go} reports={reports} notifCount={notifCount} onBell={() => setShowNotif(true)} />}
          {screen === "report" && <ReportFlow onSubmit={handleSubmitReport} go={go} existingReports={reports} />}
          {screen === "track" && <TrackReports reports={reports} />}
          {screen === "map" && <CommunityMap reports={reports} onUpvote={handleUpvote} />}
          {screen === "green" && <GreenNagpur trees={trees} onRegister={handleRegisterTree} stats={greenStats} />}
          {screen === "business" && <BusinessPulse />}
          {screen === "profile" && <Profile points={points} reportsCount={myReports.length} resolvedCount={resolvedCount} confirmCount={24} treesCount={trees.length - initialTrees.length + 5} />}
          {screen === "transparency" && <Transparency />}
          {screen === "areascore" && <AreaScore />}
          {screen === "about" && <About />}
          {screen === "admin" && <Admin reports={reports} />}
        </div>
      </div>
      <BottomNav screen={screen} go={go} />
      {showNotif && <NotificationsPanel items={notifications} onClose={() => setShowNotif(false)} onRead={markRead} />}
    </div>
  );
}
