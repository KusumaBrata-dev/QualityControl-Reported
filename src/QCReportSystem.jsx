import { useState, useEffect, useRef, useCallback } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const T = {
  bg: "#0D1117", surface: "#161B22", surface2: "#1C2330",
  border: "#30363D", border2: "#21262D",
  text: "#E6EDF3", muted: "#7D8590", muted2: "#484F58",
  blue: "#2F81F7", blueD: "#1C5FAD", blueL: "#1C2D3F",
  green: "#3FB950", greenD: "#238636", greenL: "#1A2E21",
  red: "#F85149", redD: "#B91C1C", redL: "#2D1B1B",
  yellow: "#D29922", yellowL: "#2D2200",
  purple: "#A371F7", purpleL: "#221A3E",
  aqua: "#39D2EE", aquaL: "#0D2535",
  pink: "#FF7EB3", pinkL: "#2D1525",
  orange: "#F0883E",
  r: "8px", r2: "12px",
  font: "'Outfit', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & SEED DATA
// ═══════════════════════════════════════════════════════════════
const PRODUCTS = {
  1: { model: "WM1091SK", color: "Blue" },
  2: { model: "WM1091SK", color: "Purple" },
  3: { model: "WM891SK",  color: "Aqua" },
  4: { model: "WM891SK",  color: "Pink" },
};
const COLOR_HEX = { Blue: T.blue, Purple: T.purple, Aqua: T.aqua, Pink: T.pink };
const COLOR_BGL = { Blue: T.blueL, Purple: T.purpleL, Aqua: T.aquaL, Pink: T.pinkL };
const ROLE_GRAD = {
  admin:    "linear-gradient(135deg,#B45309,#F0883E)",
  operator: "linear-gradient(135deg,#1C5FAD,#2F81F7)",
  viewer:   "linear-gradient(135deg,#196127,#3FB950)",
};
const CHECKPOINTS = [
  "Visual Inspection – Body Panel", "Dimensional Check – Door Frame",
  "Electrical Safety Test",         "Water Leak Test",
  "Drum Balance Test",              "Label Placement Check",
  "Color Matching",                 "Function Test – All Modes",
];
const INSPECTORS = [
  { v: "Ahmad Kusuma|EMP-001",   l: "Ahmad Kusuma (EMP-001)"   },
  { v: "Siti Rahayu|EMP-002",    l: "Siti Rahayu (EMP-002)"    },
  { v: "Budi Santoso|EMP-003",   l: "Budi Santoso (EMP-003)"   },
  { v: "Lena Dewi|EMP-004",      l: "Lena Dewi (EMP-004)"      },
  { v: "Hendra Tanjung|EMP-005", l: "Hendra Tanjung (EMP-005)" },
];
const DEFECT_CATS = [
  { v: "Surface Scratch",     l: "DC01 – Surface Scratch"     },
  { v: "Color Inconsistency", l: "DC02 – Color Inconsistency" },
  { v: "Dimensional Defect",  l: "DC03 – Dimensional Defect"  },
  { v: "Assembly Error",      l: "DC04 – Assembly Error"      },
  { v: "Electrical Fault",    l: "DC05 – Electrical Fault"    },
  { v: "Crack/Fracture",      l: "DC06 – Crack/Fracture"      },
  { v: "Missing Component",   l: "DC07 – Missing Component"   },
  { v: "Label/Print Error",   l: "DC08 – Label/Print Error"   },
];

const mkCp = (result = "pass") =>
  CHECKPOINTS.map(c => ({ name: c, result, value: "" }));

const SEED_USERS = [
  { id:1, name:"Admin QC",       username:"admin",    role:"admin",    password:"admin123", active:true,  created_at:"2025-01-01T00:00:00Z" },
  { id:2, name:"Ahmad Operator", username:"ahmad",    role:"operator", password:"operator", active:true,  created_at:"2025-01-02T00:00:00Z" },
  { id:3, name:"Viewer Only",    username:"viewer",   role:"viewer",   password:"viewer",   active:true,  created_at:"2025-01-03T00:00:00Z" },
];

const SEED_REPORTS = [
  { id:1, product_id:1, model:"WM1091SK", color:"Blue",   batch_no:"B-WM1091-0001", production_date:"2025-03-01", inspection_date:"2025-03-01T08:30", inspector:"Ahmad Kusuma",   inspector_id:"EMP-001", shift:"A", qty_produced:200, qty_inspected:200, qty_pass:196, qty_fail:4,  qty_rework:2,  defect_rate:2.00,  defect_cat:"Surface Scratch",    defect_loc:"Top panel",     station:"QA",       overall_status:"fail", notes:"Minor surface scratches on 4 units",     serial_numbers:["SN-BL-20001","SN-BL-20002","SN-BL-20003","SN-BL-20004"], images:[], checkpoints:mkCp(),       created_at:"2025-03-01T08:30:00Z" },
  { id:2, product_id:1, model:"WM1091SK", color:"Blue",   batch_no:"B-WM1091-0002", production_date:"2025-03-01", inspection_date:"2025-03-01T13:00", inspector:"Siti Rahayu",    inspector_id:"EMP-002", shift:"B", qty_produced:200, qty_inspected:200, qty_pass:193, qty_fail:7,  qty_rework:5,  defect_rate:3.50,  defect_cat:"Color Inconsistency", defect_loc:"Side panel",    station:"Repair",   overall_status:"fail", notes:"Color inconsistency detected",            serial_numbers:["SN-BL-20101","SN-BL-20102"], images:[], checkpoints:mkCp(),       created_at:"2025-03-01T13:00:00Z" },
  { id:3, product_id:2, model:"WM1091SK", color:"Purple", batch_no:"B-WM1091P-001", production_date:"2025-03-01", inspection_date:"2025-03-01T09:15", inspector:"Budi Santoso",   inspector_id:"EMP-003", shift:"A", qty_produced:150, qty_inspected:150, qty_pass:148, qty_fail:2,  qty_rework:2,  defect_rate:1.33,  defect_cat:"",                    defect_loc:"",              station:"QA",       overall_status:"pass", notes:"OK",                                      serial_numbers:[],                             images:[], checkpoints:mkCp(),       created_at:"2025-03-01T09:15:00Z" },
  { id:4, product_id:2, model:"WM1091SK", color:"Purple", batch_no:"B-WM1091P-002", production_date:"2025-03-01", inspection_date:"2025-03-01T14:30", inspector:"Lena Dewi",      inspector_id:"EMP-004", shift:"B", qty_produced:150, qty_inspected:150, qty_pass:115, qty_fail:35, qty_rework:10, defect_rate:23.33, defect_cat:"Dimensional Defect",  defect_loc:"Door frame",    station:"Repair",   overall_status:"fail", notes:"Dimensional defect – stop production",    serial_numbers:["SN-PU-10001","SN-PU-10002"], images:[], checkpoints:mkCp("fail"), created_at:"2025-03-01T14:30:00Z" },
  { id:5, product_id:3, model:"WM891SK",  color:"Aqua",   batch_no:"B-WM891A-001",  production_date:"2025-03-01", inspection_date:"2025-03-01T08:00", inspector:"Hendra Tanjung", inspector_id:"EMP-005", shift:"A", qty_produced:300, qty_inspected:300, qty_pass:298, qty_fail:2,  qty_rework:2,  defect_rate:0.67,  defect_cat:"Surface Scratch",    defect_loc:"Front panel",   station:"Assembly", overall_status:"pass", notes:"Excellent quality",                       serial_numbers:["SN-AQ-30001"],               images:[], checkpoints:mkCp(),       created_at:"2025-03-01T08:00:00Z" },
  { id:6, product_id:4, model:"WM891SK",  color:"Pink",   batch_no:"B-WM891P-001",  production_date:"2025-03-01", inspection_date:"2025-03-01T09:00", inspector:"Ahmad Kusuma",   inspector_id:"EMP-001", shift:"A", qty_produced:300, qty_inspected:300, qty_pass:291, qty_fail:9,  qty_rework:7,  defect_rate:3.00,  defect_cat:"Assembly Error",      defect_loc:"Drum assembly", station:"Assembly", overall_status:"fail", notes:"Assembly check required",                 serial_numbers:["SN-PK-40001"],               images:[], checkpoints:mkCp(),       created_at:"2025-03-01T09:00:00Z" },
  { id:7, product_id:3, model:"WM891SK",  color:"Aqua",   batch_no:"B-WM891A-002",  production_date:"2025-03-02", inspection_date:"2025-03-02T08:00", inspector:"Siti Rahayu",    inspector_id:"EMP-002", shift:"A", qty_produced:300, qty_inspected:300, qty_pass:300, qty_fail:0,  qty_rework:0,  defect_rate:0.00,  defect_cat:"",                    defect_loc:"",              station:"QA",       overall_status:"pass", notes:"Perfect batch",                           serial_numbers:[],                             images:[], checkpoints:mkCp(),       created_at:"2025-03-02T08:00:00Z" },
  { id:8, product_id:4, model:"WM891SK",  color:"Pink",   batch_no:"B-WM891P-002",  production_date:"2025-03-02", inspection_date:"2025-03-02T10:00", inspector:"Budi Santoso",   inspector_id:"EMP-003", shift:"B", qty_produced:300, qty_inspected:300, qty_pass:285, qty_fail:15, qty_rework:8,  defect_rate:5.00,  defect_cat:"Color Inconsistency", defect_loc:"Front panel",   station:"Repair",   overall_status:"fail", notes:"Pink dye variation",                      serial_numbers:["SN-PK-40101"],               images:[], checkpoints:mkCp(),       created_at:"2025-03-02T10:00:00Z" },
];

// Helpers
const genNo   = id => "QC-" + new Date().getFullYear() + "-" + String(id).padStart(4, "0");
const drColor = r  => r > 5 ? T.red : r > 2 ? T.yellow : T.green;


// ════════════════════════════════════════════════════════════════
// ⚛ ATOMS — smallest indivisible UI units
// ════════════════════════════════════════════════════════════════

/** Badge — colored label chip */
const Badge = ({ type = "viewer", children }) => {
  const map = {
    pass:     { bg: T.greenL,                    color: T.green,  border: "rgba(63,185,80,.2)"   },
    fail:     { bg: T.redL,                      color: T.red,    border: "rgba(248,81,73,.2)"   },
    repair:   { bg: "rgba(240,136,62,.1)",        color: T.orange, border: "rgba(240,136,62,.2)" },
    qa:       { bg: T.purpleL,                   color: T.purple, border: "rgba(163,113,247,.2)" },
    assembly: { bg: T.greenL,                    color: T.green,  border: "rgba(63,185,80,.2)"   },
    admin:    { bg: "rgba(240,136,62,.1)",        color: T.orange, border: "transparent"         },
    operator: { bg: T.blueL,                     color: T.blue,   border: "transparent"         },
    viewer:   { bg: T.greenL,                    color: T.green,  border: "transparent"         },
  };
  const s = map[type] || map.viewer;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{children}</span>
  );
};

/** Btn — interactive button with variant + size */
const Btn = ({ variant = "primary", size = "md", onClick, disabled, children, style = {} }) => {
  const vmap = {
    primary:       { bg: T.blue,                     color: "#fff",   border: T.blueD,  shadow: "0 2px 8px rgba(47,129,247,.3)"  },
    success:       { bg: T.greenD,                   color: "#fff",   border: "#196127",shadow: "0 2px 8px rgba(63,185,80,.2)"   },
    danger:        { bg: T.redD,                     color: "#fff",   border: "#8b0000",shadow: "none"                           },
    ghost:         { bg: T.surface2,                 color: T.muted,  border: T.border, shadow: "none"                           },
    blue_outline:  { bg: T.blueL,                    color: T.blue,   border: T.blue,   shadow: "none"                           },
    red_outline:   { bg: T.redL,                     color: T.red,    border: T.red,    shadow: "none"                           },
    yellow_outline:{ bg: "rgba(210,153,34,.1)",       color: T.yellow, border: T.yellow, shadow: "none"                           },
    excel:         { bg: "#196127",                  color: "#fff",   border: "#0d4a1e",shadow: "none"                           },
    word:          { bg: "#1C3A6E",                  color: "#fff",   border: "#142850",shadow: "none"                           },
  };
  const smap = {
    xs: { padding: "3px 9px",   fontSize: 11, borderRadius: 6    },
    sm: { padding: "5px 12px",  fontSize: 12, borderRadius: T.r  },
    md: { padding: "8px 16px",  fontSize: 13, borderRadius: T.r  },
  };
  const v = vmap[variant] || vmap.primary;
  const s = smap[size]    || smap.md;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: T.font, fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      whiteSpace: "nowrap", opacity: disabled ? 0.6 : 1,
      background: v.bg, color: v.color,
      border: `1px solid ${v.border}`,
      boxShadow: v.shadow,
      transition: "filter .15s, transform .1s",
      ...s, ...style,
    }}>{children}</button>
  );
};

/** KpiCard — metric display tile */
const KpiCard = ({ colorKey, icon, label, value, sub }) => {
  const cmap = {
    blue:   { accent: `linear-gradient(90deg,${T.blueD},${T.blue})`,   val: T.blue   },
    green:  { accent: `linear-gradient(90deg,${T.greenD},${T.green})`, val: T.green  },
    yellow: { accent: `linear-gradient(90deg,${T.yellow},#f5a623)`,    val: T.yellow },
    red:    { accent: `linear-gradient(90deg,${T.redD},${T.red})`,     val: T.red    },
  };
  const c = cmap[colorKey] || cmap.blue;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c.accent }} />
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, fontFamily: T.mono, lineHeight: 1, marginBottom: 4, color: c.val }}>{value}</div>
      <div style={{ fontSize: 11.5, fontWeight: 500, color: T.muted }}>{sub}</div>
    </div>
  );
};

/** ProgressBar — animated fill bar */
const ProgressBar = ({ value, color = T.green }) => (
  <div style={{ height: 5, background: T.border, borderRadius: 4, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${Math.min(value, 100)}%`, background: color, borderRadius: 4, transition: "width 1s" }} />
  </div>
);

/** ColorTag — product color chip with dot */
const ColorTag = ({ color }) => {
  const hex = COLOR_HEX[color] || "#999";
  const bg  = COLOR_BGL[color] || T.surface2;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color: hex }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: hex, display: "inline-block" }} />
      {color}
    </span>
  );
};

/** Avatar — initials circle with role-based gradient */
const Avatar = ({ name, role, size = 26 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.44, fontWeight: 700, color: "#fff",
    background: ROLE_GRAD[role] || ROLE_GRAD.viewer, flexShrink: 0,
  }}>{(name || "?").charAt(0).toUpperCase()}</div>
);

/** TextInput */
const TextInput = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "9px 12px", fontSize: 13.5, fontFamily: type === "number" ? T.mono : T.font, color: T.text, outline: "none", ...style }} />
);

/** SelectInput */
const SelectInput = ({ value, onChange, children, style = {} }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "9px 12px", fontSize: 13.5, fontFamily: T.font, color: T.text, outline: "none", ...style }}>
    {children}
  </select>
);

/** TextareaInput */
const TextareaInput = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "9px 12px", fontSize: 13.5, fontFamily: T.font, color: T.text, outline: "none", resize: "vertical" }} />
);

/** FieldLabel — form field label */
const FieldLabel = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{children}</div>
);

/** SectionHeader — section divider inside modal */
const SectionHeader = ({ icon, children, first = false }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: "2px",
    paddingBottom: 10, borderBottom: `1px solid ${T.blueL}`,
    marginBottom: 16, marginTop: first ? 0 : 22,
    display: "flex", alignItems: "center", gap: 6,
  }}>
    {icon && <span>{icon}</span>}{children}
  </div>
);

/** StatusBadge — pass/fail */
const StatusBadge = ({ status }) => (
  <Badge type={status}>{status === "pass" ? "✓ PASS" : "✕ FAIL"}</Badge>
);

/** StationBadge — Repair / QA / Assembly */
const StationBadge = ({ station }) => {
  if (!station) return <span style={{ color: T.muted2, fontSize: 11 }}>–</span>;
  const typeMap = { Repair: "repair", QA: "qa", Assembly: "assembly" };
  const iconMap = { Repair: "🔧", QA: "🔬", Assembly: "⚙️" };
  return <Badge type={typeMap[station] || "viewer"}>{iconMap[station] || ""} {station}</Badge>;
};

/** RoleBadge — admin / operator / viewer */
const RoleBadge = ({ role }) => {
  const lbl = { admin: "Admin", operator: "Operator", viewer: "Viewer" };
  return <Badge type={role}>{lbl[role] || role}</Badge>;
};

/** StatMini — compact stat box */
const StatMini = ({ label, value, color = T.text }) => (
  <div style={{ background: T.bg, border: `1px solid ${T.border2}`, borderRadius: T.r, padding: 10, textAlign: "center" }}>
    <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: T.mono, color }}>{value}</div>
  </div>
);

/** Card */
const Card = ({ children, style = {} }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r2, overflow: "hidden", ...style }}>{children}</div>
);

/** CardHeader */
const CardHeader = ({ title, actions }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
    <span style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px" }}>{title}</span>
    {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
  </div>
);


// ════════════════════════════════════════════════════════════════
// 🧬 MOLECULES — composed from atoms
// ════════════════════════════════════════════════════════════════

/** ClockDisplay — live date/time */
const ClockDisplay = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const iv = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(iv); }, []);
  return (
    <div style={{ fontFamily: T.mono, fontSize: 11.5, color: T.muted, background: T.bg, border: `1px solid ${T.border}`, padding: "4px 10px", borderRadius: 20 }}>
      {now.toLocaleDateString("id-ID")} <span style={{ color: T.blue }}>{now.toLocaleTimeString("id-ID")}</span>
    </div>
  );
};

/** NavUserChip — avatar + name + role in nav */
const NavUserChip = ({ user }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px", borderRadius: 20, border: `1px solid ${T.border}`, background: T.surface2 }}>
    <Avatar name={user.name} role={user.role} size={26} />
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 700 }}>{user.name}</div>
      <RoleBadge role={user.role} />
    </div>
  </div>
);

/** SNChip — serial number chip with optional remove */
const SNChip = ({ sn, onRemove }) => (
  <span style={{ background: T.redL, color: T.red, border: "1px solid rgba(248,81,73,.2)", padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontFamily: T.mono, display: "inline-flex", alignItems: "center", gap: 5 }}>
    📟 {sn}
    {onRemove && <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: T.red, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>}
  </span>
);

/** CheckpointRow — single QC checkpoint (read / edit) */
const CheckpointRow = ({ cp, index, onChange, readOnly }) => (
  <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${T.border2}`, alignItems: "center", background: index % 2 === 0 ? "transparent" : "rgba(255,255,255,.02)" }}>
    <span style={{ fontSize: 13 }}>{cp.name}</span>
    {readOnly ? (
      <>
        <span style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>{cp.value || ""}</span>
        <StatusBadge status={cp.result === "na" ? "pass" : cp.result} />
      </>
    ) : (
      <>
        <SelectInput value={cp.result} onChange={v => onChange(index, "result", v)} style={{ padding: "5px 8px", fontSize: 12 }}>
          <option value="pass">✓ Pass</option>
          <option value="fail">✕ Fail</option>
          <option value="na">N/A</option>
        </SelectInput>
        <TextInput value={cp.value} onChange={v => onChange(index, "value", v)} placeholder="Nilai" style={{ padding: "5px 8px", fontSize: 12 }} />
      </>
    )}
  </div>
);

/** ToastNotif — floating notification */
const ToastNotif = ({ toast }) => {
  if (!toast) return null;
  const ok = toast.type === "ok";
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      padding: "12px 20px", borderRadius: T.r, fontSize: 13, fontWeight: 600,
      background: ok ? "#196127" : T.redD,
      color: ok ? "#acf2bd" : "#ffa0a0",
      border: `1px solid ${ok ? "#2ea043" : T.red}`,
      boxShadow: "0 4px 16px rgba(0,0,0,.4)",
      display: "flex", alignItems: "center", gap: 8,
      maxWidth: 360, animation: "slideUp .3s ease",
    }}>{toast.msg}</div>
  );
};

/** FilterField — label + input wrapper */
const FilterField = ({ label, children }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

/** ModalShell — reusable modal overlay + card */
const ModalShell = ({ open, onClose, title, subtitle, maxWidth = 840, headerExtra, footer, children }) => {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, width: "100%", maxWidth, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, background: T.surface, zIndex: 2 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>{subtitle}</div>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {headerExtra}
            <Btn variant="ghost" size="sm" onClick={onClose}>✕ Tutup</Btn>
          </div>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
        {footer && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: `1px solid ${T.border}`, position: "sticky", bottom: 0, background: T.surface }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};


// ════════════════════════════════════════════════════════════════
// 🦠 ORGANISMS — complex domain-specific sections
// ════════════════════════════════════════════════════════════════

/** LoginOrganism — full login screen */
const LoginOrganism = ({ users, onLogin }) => {
  const [uname,   setUname]   = useState("");
  const [pass,    setPass]    = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setError(""); setLoading(true);
    setTimeout(() => {
      if (!uname || !pass) { setError("⚠ Username dan password wajib diisi"); setLoading(false); return; }
      const user = users.find(u => u.username === uname.toLowerCase());
      if (!user)        { setError("❌ Username tidak ditemukan");        setLoading(false); return; }
      if (!user.active) { setError("⛔ Akun nonaktif. Hubungi Admin."); setLoading(false); return; }
      if (user.password !== pass) { setError("❌ Password salah"); setPass(""); setLoading(false); return; }
      onLogin(user);
    }, 600);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: T.bg,
      backgroundImage: `radial-gradient(ellipse at 20% 30%, rgba(47,129,247,.08) 0%, transparent 55%),
                        radial-gradient(ellipse at 80% 70%, rgba(163,113,247,.06) 0%, transparent 55%)`,
    }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "40px 44px", width: "100%", maxWidth: 420, boxShadow: "0 0 0 1px rgba(255,255,255,.04), 0 8px 32px rgba(0,0,0,.5)" }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, justifyContent: "center" }}>
          <div style={{ width: 44, height: 44, background: `linear-gradient(135deg,${T.blueD},${T.blue})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 0 16px rgba(47,129,247,.3)" }}>🔬</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>QC Report System</div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: "2px", textTransform: "uppercase" }}>WM Series · Quality Control</div>
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>Selamat Datang</div>
        <div style={{ fontSize: 13, color: T.muted, textAlign: "center", marginBottom: 28 }}>Masuk untuk mengakses sistem laporan QC</div>

        {error && <div style={{ background: "rgba(248,81,73,.1)", border: "1px solid rgba(248,81,73,.3)", borderRadius: T.r, padding: "10px 14px", fontSize: 12.5, color: T.red, marginBottom: 16, textAlign: "center" }}>{error}</div>}

        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Username</FieldLabel>
          <TextInput value={uname} onChange={setUname} placeholder="Masukkan username…" />
        </div>
        <div style={{ marginBottom: 4 }}>
          <FieldLabel>Password</FieldLabel>
          <TextInput value={pass} onChange={setPass} placeholder="Masukkan password…" type="password" />
        </div>

        <button onClick={handle} disabled={loading} style={{ width: "100%", background: `linear-gradient(135deg,${T.blueD},${T.blue})`, color: "#fff", border: "none", borderRadius: T.r, padding: 12, fontSize: 15, fontWeight: 700, fontFamily: T.font, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(47,129,247,.3)", opacity: loading ? 0.8 : 1, marginTop: 16 }}>
          {loading ? "⏳ Memverifikasi…" : "🔐 Masuk"}
        </button>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: T.muted2 }}>QC Report System v3.0 · React Edition</div>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10.5, color: T.muted2 }}>Demo: admin / admin123 &nbsp;·&nbsp; ahmad / operator &nbsp;·&nbsp; viewer / viewer</div>
      </div>
    </div>
  );
};

/** NavbarOrganism — top navigation */
const NavbarOrganism = ({ user, tab, onTabChange, canEdit, isAdmin, onNewReport, onLogout }) => (
  <nav style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100 }}>
    <div style={{ maxWidth: 1500, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: `linear-gradient(135deg,${T.blueD},${T.blue})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔬</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>QC Report System</div>
          <div style={{ fontSize: 9, color: T.muted, letterSpacing: "1.8px", textTransform: "uppercase" }}>WM Series</div>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 2 }}>
        {[
          { key: "dashboard", label: "📊 Dashboard" },
          { key: "reports",   label: "📋 Laporan QC" },
          { key: "matrix",    label: "🎨 Model Matrix" },
          ...(isAdmin ? [{ key: "users", label: "👥 Kelola User" }] : []),
        ].map(t => (
          <button key={t.key} onClick={() => onTabChange(t.key)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: tab === t.key ? "rgba(47,129,247,.15)" : "transparent", color: tab === t.key ? T.blue : T.muted, fontSize: 13, fontWeight: 600, fontFamily: T.font, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>{t.label}</button>
        ))}
      </div>
      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ClockDisplay />
        {canEdit && <Btn variant="primary" size="sm" onClick={onNewReport}>+ Laporan Baru</Btn>}
        <NavUserChip user={user} />
        <Btn variant="ghost" size="sm" onClick={onLogout}>Logout</Btn>
      </div>
    </div>
  </nav>
);

/** DashboardKPIs — 4-card KPI grid + alert */
const DashboardKPIs = ({ reports }) => {
  const pass  = reports.filter(r => r.overall_status === "pass").length;
  const fail  = reports.filter(r => r.overall_status === "fail").length;
  const total = reports.reduce((a, r) => a + r.qty_inspected, 0);
  const avgDR = reports.length ? (reports.reduce((a, r) => a + r.defect_rate, 0) / reports.length).toFixed(2) : "0.00";
  const stR   = reports.filter(r => r.station === "Repair").length;
  const stQ   = reports.filter(r => r.station === "QA").length;
  const stA   = reports.filter(r => r.station === "Assembly").length;
  return (
    <>
      {fail > 0 && (
        <div style={{ padding: "12px 16px", borderRadius: T.r, fontSize: 13, background: "rgba(210,153,34,.1)", border: "1px solid rgba(210,153,34,.25)", color: T.yellow, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          ⚠ Terdapat <strong>{fail} batch FAIL</strong> – segera lakukan tindakan korektif!
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <KpiCard colorKey="blue"   icon="📋" label="Total Laporan"   value={reports.length}          sub="Semua batch"               />
        <KpiCard colorKey="green"  icon="🔍" label="Total Inspected" value={total.toLocaleString()}  sub="Unit diperiksa"            />
        <KpiCard colorKey="yellow" icon="📉" label="Avg Defect Rate" value={`${avgDR}%`}             sub="Target < 3%"               />
        <KpiCard colorKey="red"    icon="🚫" label="Batch Fail"      value={fail}                    sub={`R:${stR} QA:${stQ} A:${stA}`} />
      </div>
    </>
  );
};

/** DashboardCharts — Pie (status) + Bar (defect rate) */
const DashboardCharts = ({ reports }) => {
  const pass = reports.filter(r => r.overall_status === "pass").length;
  const fail = reports.filter(r => r.overall_status === "fail").length;
  const pieData = [{ name: "Pass", value: pass }, { name: "Fail", value: fail }];
  const barData = [1, 2, 3, 4].map(pid => {
    const rs   = reports.filter(r => r.product_id === pid);
    const prod = PRODUCTS[pid];
    return { name: `${prod.model} – ${prod.color}`, value: rs.length ? +(rs.reduce((a, r) => a + r.defect_rate, 0) / rs.length).toFixed(2) : 0, fill: COLOR_HEX[prod.color] };
  });
  const PIE_COLORS = [T.green, T.red];
  const ttStyle = { background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.r, color: T.text };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 18 }}>
      <Card>
        <CardHeader title="Status Batch" />
        <div style={{ padding: 20, height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={ttStyle} />
              <Legend wrapperStyle={{ color: T.muted, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <CardHeader title="Defect Rate per Varian (%)" />
        <div style={{ padding: 20, height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
              <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 11, fontFamily: T.font }} angle={-15} textAnchor="end" />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={v => [`${v}%`, "Avg Defect Rate"]} contentStyle={ttStyle} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

/** ReportTable — full / mini mode */
const ReportTable = ({ data, mini = false, canEdit, onDetail, onEdit, onDelete }) => {
  if (!data.length) return <div style={{ padding: 32, textAlign: "center", color: T.muted }}>Tidak ada data</div>;
  const fullCols  = ["Report No","Model","Warna","Batch","Tgl Inspeksi","Inspector","Produksi","Diperiksa","Pass","Fail","Defect%","Stasiun","SN","Status","Aksi"];
  const miniCols  = ["Report No","Model","Warna","Batch","Tgl Inspeksi","Inspector","Diperiksa","Pass","Fail","Defect%","Status","Aksi"];
  const numCols   = new Set(["Produksi","Diperiksa","Pass","Fail","Defect%"]);
  const cols      = mini ? miniCols : fullCols;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {cols.map(c => <th key={c} style={{ padding: "11px 14px", fontSize: 10.5, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap", textAlign: numCols.has(c) ? "right" : "left", background: T.surface }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(r => {
            const rate    = r.defect_rate || 0;
            const snCount = (r.serial_numbers || []).length;
            return (
              <tr key={r.id} style={{ borderBottom: `1px solid ${T.border2}`, transition: "background .1s" }}>
                <td style={{ padding: "12px 14px" }}><span style={{ fontFamily: T.mono, fontSize: 12, color: T.blue }}>{genNo(r.id)}</span></td>
                <td style={{ padding: "12px 14px" }}><strong>{r.model}</strong></td>
                <td style={{ padding: "12px 14px" }}><ColorTag color={r.color} /></td>
                <td style={{ padding: "12px 14px" }}><span style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>{r.batch_no}</span></td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: T.muted }}>{(r.inspection_date || "").slice(0, 10)}</td>
                <td style={{ padding: "12px 14px" }}>{r.inspector}</td>
                {!mini && <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: T.mono }}>{r.qty_produced}</td>}
                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: T.mono }}>{r.qty_inspected}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: T.mono, color: T.green }}>{r.qty_pass}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: T.mono, color: T.red }}>{r.qty_fail}</td>
                <td style={{ padding: "12px 14px", textAlign: "right" }}><span style={{ fontFamily: T.mono, fontWeight: 700, color: drColor(rate) }}>{rate.toFixed(2)}%</span></td>
                {!mini && <td style={{ padding: "12px 14px" }}><StationBadge station={r.station} /></td>}
                {!mini && <td style={{ padding: "12px 14px" }}>{snCount > 0 ? <Badge type="fail" style={{ fontSize: 10 }}>📟 {snCount}</Badge> : <span style={{ color: T.muted2, fontSize: 11 }}>–</span>}</td>}
                <td style={{ padding: "12px 14px" }}><StatusBadge status={r.overall_status} /></td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <Btn variant="blue_outline" size="xs" onClick={() => onDetail(r.id)}>Detail</Btn>
                    {!mini && canEdit && <Btn variant="yellow_outline" size="xs" onClick={() => onEdit(r.id)}>Edit</Btn>}
                    {!mini && canEdit && <Btn variant="red_outline"    size="xs" onClick={() => onDelete(r.id)}>Hapus</Btn>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/** MatrixOrganism — variant comparison grid + stacked bar */
const MatrixOrganism = ({ reports }) => {
  const groups = [
    { model: "WM1091SK", variants: [{ name: "Blue", pid: 1 }, { name: "Purple", pid: 2 }] },
    { model: "WM891SK",  variants: [{ name: "Aqua",  pid: 3 }, { name: "Pink",   pid: 4 }] },
  ];
  const stackedData = [1, 2, 3, 4].map(pid => {
    const rs   = reports.filter(r => r.product_id === pid);
    const prod = PRODUCTS[pid];
    return { name: `${prod.model} – ${prod.color}`, Pass: rs.filter(r => r.overall_status === "pass").length, Fail: rs.filter(r => r.overall_status === "fail").length };
  });
  const ttStyle = { background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.r, color: T.text };
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
        {groups.map(g => (
          <Card key={g.model}>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>📦 {g.model}</div>
              {g.variants.map((v, ci) => {
                const rs      = reports.filter(r => r.product_id === v.pid);
                const p       = rs.filter(r => r.overall_status === "pass").length;
                const f       = rs.filter(r => r.overall_status === "fail").length;
                const avgDR   = rs.length ? (rs.reduce((a, r) => a + r.defect_rate, 0) / rs.length).toFixed(1) : "0.0";
                const tInsp   = rs.reduce((a, r) => a + r.qty_inspected, 0);
                const passRate = rs.length ? Math.round(p / rs.length * 100) : 0;
                const lc      = COLOR_HEX[v.name];
                return (
                  <div key={v.name} style={{ border: `1px solid ${T.border}`, borderLeft: `3px solid ${lc}`, borderRadius: T.r, padding: 14, marginTop: ci > 0 ? 10 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <ColorTag color={v.name} />
                      <span style={{ fontSize: 12, color: T.muted }}>{rs.length} batch</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
                      <StatMini label="Pass" value={p} color={T.green} />
                      <StatMini label="Fail" value={f} color={T.red} />
                      <StatMini label="Avg DR" value={`${avgDR}%`} color={drColor(Number(avgDR))} />
                      <StatMini label="Inspected" value={tInsp.toLocaleString()} color={T.blue} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted, marginBottom: 5 }}>
                      <span>Pass Rate</span><span style={{ fontWeight: 700 }}>{passRate}%</span>
                    </div>
                    <ProgressBar value={passRate} color={lc} />
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader title="Perbandingan Pass / Fail per Varian" />
        <div style={{ padding: 20, height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData} margin={{ top: 4, right: 8, left: 0, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
              <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 12, fontFamily: T.font }} angle={-15} textAnchor="end" />
              <YAxis tick={{ fill: T.muted, fontSize: 12 }} />
              <Tooltip contentStyle={ttStyle} />
              <Legend wrapperStyle={{ color: T.muted, fontSize: 12 }} />
              <Bar dataKey="Pass" stackId="a" fill={T.green} />
              <Bar dataKey="Fail" stackId="a" fill={T.red} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
};

/** UserGrid — user management card grid */
const UserGrid = ({ users, currentUser, onEdit, onDelete, onChangePw }) => {
  if (!users.length) return <div style={{ textAlign: "center", color: T.muted, padding: 40 }}>Belum ada user</div>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
      {users.map(u => {
        const isMe = currentUser && u.id === currentUser.id;
        return (
          <div key={u.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: 20, position: "relative" }}>
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              {u.active ? <Badge type="pass">✓ Aktif</Badge> : <Badge type="fail">⛔ Nonaktif</Badge>}
            </div>
            <Avatar name={u.name} role={u.role} size={42} />
            <div style={{ fontSize: 14, fontWeight: 800, marginTop: 10, marginBottom: 2 }}>
              {u.name}{isMe && <span style={{ fontSize: 11, color: T.muted }}> (Anda)</span>}
            </div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: T.mono, marginBottom: 8 }}>@{u.username}</div>
            <RoleBadge role={u.role} />
            <div style={{ fontSize: 11, color: T.muted2, marginTop: 6 }}>
              Dibuat: {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "–"}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
              <Btn variant="blue_outline"   size="xs" onClick={() => onEdit(u.id)}>✏️ Edit</Btn>
              <Btn variant="yellow_outline" size="xs" onClick={() => onChangePw(u.id, u.name)}>🔑 Password</Btn>
              {!isMe && <Btn variant="red_outline" size="xs" onClick={() => onDelete(u.id)}>🗑️</Btn>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** ReportFormOrganism — create / edit report modal */
const ReportFormOrganism = ({ open, onClose, editReport, onSave, showToast }) => {
  const empty = () => ({
    product_id: "", batch_no: "",
    production_date: new Date().toISOString().split("T")[0],
    inspection_date: new Date().toISOString().slice(0, 16),
    inspector: "", shift: "A",
    qty_produced: "", qty_inspected: "", qty_pass: "", qty_fail: "", qty_rework: "",
    defect_cat: "", defect_loc: "", station: "", overall_status: "pass", notes: "",
  });

  const [form,    setForm]    = useState(empty());
  const [snList,  setSnList]  = useState([]);
  const [snInput, setSnInput] = useState("");
  const [cpState, setCpState] = useState(mkCp());

  useEffect(() => {
    if (!open) return;
    if (editReport) {
      const r = editReport;
      setForm({
        product_id: r.product_id, batch_no: r.batch_no,
        production_date: r.production_date, inspection_date: r.inspection_date,
        inspector: `${r.inspector}|${r.inspector_id}`, shift: r.shift,
        qty_produced: r.qty_produced, qty_inspected: r.qty_inspected,
        qty_pass: r.qty_pass, qty_fail: r.qty_fail, qty_rework: r.qty_rework,
        defect_cat: r.defect_cat || "", defect_loc: r.defect_loc || "",
        station: r.station || "", overall_status: r.overall_status, notes: r.notes || "",
      });
      setSnList(r.serial_numbers || []);
      setCpState(r.checkpoints || mkCp());
    } else {
      setForm(empty());
      setSnList([]);
      setCpState(mkCp());
    }
    setSnInput("");
  }, [open, editReport]);

  const setF      = (k, v)        => setForm(f => ({ ...f, [k]: v }));
  const updateCp  = (i, key, val) => setCpState(s => s.map((c, idx) => idx === i ? { ...c, [key]: val } : c));
  const addSN     = () => {
    const val = snInput.trim().toUpperCase();
    if (!val) return;
    if (snList.includes(val)) { showToast("SN sudah ada!", "err"); return; }
    setSnList(s => [...s, val]); setSnInput("");
  };

  const handleSave = () => {
    if (!form.product_id || !form.batch_no || !form.inspector) { showToast("Produk, Batch, dan Inspector wajib diisi!", "err"); return; }
    const [inspName, inspId] = form.inspector.split("|");
    const prod          = PRODUCTS[form.product_id];
    const qty_inspected = Number(form.qty_inspected) || 0;
    const qty_fail      = Number(form.qty_fail)      || 0;
    const defect_rate   = qty_inspected ? +(qty_fail / qty_inspected * 100).toFixed(2) : 0;
    onSave({
      ...(editReport ? { id: editReport.id, created_at: editReport.created_at } : { created_at: new Date().toISOString() }),
      product_id: Number(form.product_id), model: prod.model, color: prod.color,
      batch_no: form.batch_no, production_date: form.production_date,
      inspection_date: form.inspection_date, inspector: inspName, inspector_id: inspId,
      shift: form.shift,
      qty_produced: Number(form.qty_produced) || 0, qty_inspected,
      qty_pass: Number(form.qty_pass) || 0, qty_fail,
      qty_rework: Number(form.qty_rework) || 0, defect_rate,
      defect_cat: form.defect_cat, defect_loc: form.defect_loc,
      station: form.station, overall_status: form.overall_status,
      notes: form.notes, serial_numbers: [...snList], images: [],
      checkpoints: cpState.map(c => ({ ...c })),
    });
  };

  return (
    <ModalShell open={open} onClose={onClose} title={editReport ? "✏️ Edit Laporan QC" : "+ Laporan QC Baru"} maxWidth={840}
      footer={<><Btn variant="ghost" onClick={onClose}>Batal</Btn><Btn variant="success" onClick={handleSave}>💾 Simpan Laporan</Btn></>}>

      <SectionHeader icon="📦" first>Informasi Produk</SectionHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><FieldLabel>Produk & Warna *</FieldLabel>
          <SelectInput value={form.product_id} onChange={v => setF("product_id", v)}>
            <option value="">— Pilih Produk —</option>
            <optgroup label="WM1091SK"><option value="1">WM1091SK – Blue</option><option value="2">WM1091SK – Purple</option></optgroup>
            <optgroup label="WM891SK"><option value="3">WM891SK – Aqua</option><option value="4">WM891SK – Pink</option></optgroup>
          </SelectInput>
        </div>
        <div><FieldLabel>Batch No *</FieldLabel><TextInput value={form.batch_no} onChange={v => setF("batch_no", v)} placeholder="B-WM1091-0001" /></div>
        <div><FieldLabel>Tanggal Produksi *</FieldLabel><TextInput type="date" value={form.production_date} onChange={v => setF("production_date", v)} /></div>
        <div><FieldLabel>Tanggal & Waktu Inspeksi *</FieldLabel><TextInput type="datetime-local" value={form.inspection_date} onChange={v => setF("inspection_date", v)} /></div>
      </div>

      <SectionHeader icon="👷">Inspector</SectionHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><FieldLabel>Inspector *</FieldLabel>
          <SelectInput value={form.inspector} onChange={v => setF("inspector", v)}>
            <option value="">— Pilih Inspector —</option>
            {INSPECTORS.map(i => <option key={i.v} value={i.v}>{i.l}</option>)}
          </SelectInput>
        </div>
        <div><FieldLabel>Shift</FieldLabel>
          <SelectInput value={form.shift} onChange={v => setF("shift", v)}>
            <option value="A">Shift A (06:00–14:00)</option>
            <option value="B">Shift B (14:00–22:00)</option>
            <option value="C">Shift C (22:00–06:00)</option>
          </SelectInput>
        </div>
      </div>

      <SectionHeader icon="🔢">Data Kuantitas</SectionHeader>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
        {[["Diproduksi","qty_produced"],["Diperiksa","qty_inspected"],["Pass","qty_pass"],["Fail / Reject","qty_fail"],["Rework","qty_rework"]].map(([lbl, key]) => (
          <div key={key}><FieldLabel>{lbl}</FieldLabel><TextInput type="number" value={form[key]} onChange={v => setF(key, v)} placeholder="0" style={{ fontFamily: T.mono }} /></div>
        ))}
      </div>

      <SectionHeader icon="📟">Serial Number Unit Reject</SectionHeader>
      <div style={{ background: "rgba(47,129,247,.06)", border: "1px dashed rgba(47,129,247,.3)", borderRadius: T.r2, padding: 14 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>Scan atau ketik SN unit REJECT</div>
        <div style={{ display: "flex", gap: 8 }}>
          <TextInput value={snInput} onChange={setSnInput} placeholder="Scan barcode / ketik SN lalu Enter…" style={{ flex: 1 }} />
          <Btn variant="primary" size="sm" onClick={addSN}>+ Tambah</Btn>
        </div>
        {snList.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>{snList.map(sn => <SNChip key={sn} sn={sn} onRemove={() => setSnList(s => s.filter(x => x !== sn))} />)}</div>}
        <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>Total: <span style={{ fontWeight: 700, color: T.red }}>{snList.length}</span> SN</div>
      </div>

      <SectionHeader icon="🔎">Jenis Defect</SectionHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><FieldLabel>Kategori Defect</FieldLabel>
          <SelectInput value={form.defect_cat} onChange={v => setF("defect_cat", v)}>
            <option value="">— Pilih Kategori —</option>
            {DEFECT_CATS.map(d => <option key={d.v} value={d.v}>{d.l}</option>)}
          </SelectInput>
        </div>
        <div><FieldLabel>Lokasi Defect</FieldLabel><TextInput value={form.defect_loc} onChange={v => setF("defect_loc", v)} placeholder="Top panel, Door frame…" /></div>
        <div><FieldLabel>Stasiun *</FieldLabel>
          <SelectInput value={form.station} onChange={v => setF("station", v)}>
            <option value="">— Pilih Stasiun —</option>
            <option value="Repair">🔧 Repair</option>
            <option value="QA">🔬 QA</option>
            <option value="Assembly">⚙️ Assembly</option>
          </SelectInput>
        </div>
        <div><FieldLabel>Overall Status *</FieldLabel>
          <SelectInput value={form.overall_status} onChange={v => setF("overall_status", v)}>
            <option value="pass">✅ PASS</option>
            <option value="fail">❌ FAIL</option>
          </SelectInput>
        </div>
      </div>

      <SectionHeader icon="📝">Catatan</SectionHeader>
      <TextareaInput value={form.notes} onChange={v => setF("notes", v)} placeholder="Catatan tambahan inspeksi…" />

      <SectionHeader icon="☑">Checkpoint QC</SectionHeader>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: T.r2, overflow: "hidden" }}>
        {cpState.map((cp, i) => <CheckpointRow key={i} cp={cp} index={i} onChange={updateCp} readOnly={false} />)}
      </div>
    </ModalShell>
  );
};

/** DetailModal — read-only report detail */
const DetailModal = ({ open, onClose, report, canEdit, onEdit }) => {
  if (!report) return null;
  const rate     = report.defect_rate || 0;
  const passRate = report.qty_inspected ? (report.qty_pass / report.qty_inspected * 100).toFixed(1) : 0;
  return (
    <ModalShell open={open} onClose={onClose} title={genNo(report.id)} subtitle={`${report.batch_no} · ${(report.inspection_date || "").substring(0, 16)}`}
      maxWidth={880}
      headerExtra={<StatusBadge status={report.overall_status} />}
      footer={<><Btn variant="ghost" onClick={onClose}>Tutup</Btn>{canEdit && <Btn variant="yellow_outline" onClick={() => { onClose(); onEdit(report.id); }}>✏️ Edit</Btn>}</>}>

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
        {[["Model",report.model],["Warna",<ColorTag color={report.color} />],["Inspector",report.inspector],
          ["Shift",`Shift ${report.shift}`],["Tgl Produksi",report.production_date],["Tgl Inspeksi",(report.inspection_date||"").substring(0,16)]
        ].map(([l, v]) => (
          <div key={l} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "11px 14px" }}>
            <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{l}</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Qty KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }}>
        {[["Produksi",report.qty_produced,T.text],["Diperiksa",report.qty_inspected,T.blue],
          ["Pass",report.qty_pass,T.green],["Fail",report.qty_fail,T.red],["Rework",report.qty_rework,T.yellow]
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 9.5, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: T.mono, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Pass Rate bar */}
      <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "12px 14px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 7 }}>
          <span style={{ color: T.muted }}>Pass Rate</span>
          <span style={{ fontWeight: 700, fontFamily: T.mono, color: drColor(rate) }}>{passRate}% <span style={{ color: T.muted }}>(Defect: {rate}%)</span></span>
        </div>
        <ProgressBar value={Number(passRate)} color={report.overall_status === "pass" ? T.green : T.red} />
      </div>

      {/* Defect info */}
      {report.defect_cat && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[["Jenis Defect",report.defect_cat],["Lokasi",report.defect_loc||"–"],["Stasiun",report.station||"–"]].map(([l, v]) => (
            <div key={l} style={{ background: T.redL, border: "1px solid rgba(248,81,73,.15)", borderRadius: T.r, padding: "11px 14px" }}>
              <div style={{ fontSize: 10, color: T.red, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{l}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: T.red }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* Serial Numbers */}
      {(report.serial_numbers || []).length > 0 && (
        <>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>Serial Number Reject ({report.serial_numbers.length})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {report.serial_numbers.map(sn => <SNChip key={sn} sn={sn} />)}
          </div>
        </>
      )}

      {/* Checkpoints */}
      <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>Checkpoint QC</div>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: T.r2, overflow: "hidden", marginBottom: 16 }}>
        {(report.checkpoints || mkCp()).map((cp, i) => <CheckpointRow key={i} cp={cp} index={i} readOnly />)}
      </div>

      {/* Notes */}
      {report.notes && (
        <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Catatan</div>
          <div style={{ fontSize: 13 }}>{report.notes}</div>
        </div>
      )}
    </ModalShell>
  );
};

/** UserFormOrganism — create / edit user modal */
const UserFormOrganism = ({ open, onClose, editUser, onSave, users, showToast }) => {
  const [form, setForm] = useState({ name: "", username: "", role: "operator", active: "1", password: "", password2: "" });
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!open) return;
    editUser
      ? setForm({ name: editUser.name, username: editUser.username, role: editUser.role, active: editUser.active ? "1" : "0", password: "", password2: "" })
      : setForm({ name: "", username: "", role: "operator", active: "1", password: "", password2: "" });
  }, [open, editUser]);

  const handleSave = () => {
    if (!form.name || !form.username) { showToast("Nama dan Username wajib diisi!", "err"); return; }
    if (!editUser && !form.password)  { showToast("Password wajib untuk user baru!", "err"); return; }
    if (form.password && form.password !== form.password2) { showToast("Konfirmasi password tidak cocok!", "err"); return; }
    if (form.password && form.password.length < 4)         { showToast("Password minimal 4 karakter!", "err"); return; }
    const dup = users.find(u => u.username === form.username.toLowerCase() && u.id !== editUser?.id);
    if (dup) { showToast("Username sudah digunakan!", "err"); return; }
    onSave({
      ...(editUser || {}),
      name: form.name, username: form.username.toLowerCase(),
      role: form.role, active: form.active === "1",
      password: form.password || editUser?.password || "",
      created_at: editUser?.created_at || new Date().toISOString(),
    });
  };

  return (
    <ModalShell open={open} onClose={onClose} title={editUser ? "✏️ Edit User" : "+ Tambah User Baru"} maxWidth={480}
      footer={<><Btn variant="ghost" onClick={onClose}>Batal</Btn><Btn variant="success" onClick={handleSave}>💾 Simpan</Btn></>}>
      <SectionHeader first>Informasi Akun</SectionHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><FieldLabel>Nama Lengkap *</FieldLabel><TextInput value={form.name} onChange={v => setF("name", v)} placeholder="Nama lengkap…" /></div>
        <div><FieldLabel>Username *</FieldLabel><TextInput value={form.username} onChange={v => setF("username", v)} placeholder="tanpa spasi…" /></div>
        <div><FieldLabel>Role *</FieldLabel>
          <SelectInput value={form.role} onChange={v => setF("role", v)}>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </SelectInput>
        </div>
        <div><FieldLabel>Status</FieldLabel>
          <SelectInput value={form.active} onChange={v => setF("active", v)}>
            <option value="1">✅ Aktif</option>
            <option value="0">⛔ Nonaktif</option>
          </SelectInput>
        </div>
      </div>
      <SectionHeader>{editUser ? "Ganti Password (kosongkan jika tidak berubah)" : "Password"}</SectionHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><FieldLabel>Password *</FieldLabel><TextInput type="password" value={form.password} onChange={v => setF("password", v)} placeholder="Min 4 karakter…" /></div>
        <div><FieldLabel>Konfirmasi *</FieldLabel><TextInput type="password" value={form.password2} onChange={v => setF("password2", v)} placeholder="Ulangi password…" /></div>
      </div>
      <div style={{ background: T.blueL, border: "1px solid rgba(47,129,247,.2)", borderRadius: T.r, padding: "10px 14px", fontSize: 12, color: T.blue, marginTop: 8 }}>
        ℹ️ <strong>Admin</strong> = akses penuh + kelola user · <strong>Operator</strong> = buat & edit laporan · <strong>Viewer</strong> = hanya lihat
      </div>
    </ModalShell>
  );
};

/** ChangePwOrganism — change password for target user */
const ChangePwOrganism = ({ open, onClose, targetUser, onSave, showToast }) => {
  const [pw,   setPw]   = useState("");
  const [conf, setConf] = useState("");
  useEffect(() => { if (open) { setPw(""); setConf(""); } }, [open]);
  const handle = () => {
    if (!pw || pw.length < 4) { showToast("Password minimal 4 karakter!", "err"); return; }
    if (pw !== conf)           { showToast("Konfirmasi tidak cocok!", "err");        return; }
    onSave(pw);
  };
  return (
    <ModalShell open={open} onClose={onClose} title="🔑 Ganti Password" maxWidth={480}
      footer={<><Btn variant="ghost" onClick={onClose}>Batal</Btn><Btn variant="primary" onClick={handle}>🔑 Simpan Password</Btn></>}>
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>Mengganti password untuk: <strong style={{ color: T.text }}>{targetUser?.name}</strong></div>
      <div style={{ marginBottom: 12 }}><FieldLabel>Password Baru *</FieldLabel><TextInput type="password" value={pw} onChange={setPw} placeholder="Min 4 karakter…" /></div>
      <div><FieldLabel>Konfirmasi *</FieldLabel><TextInput type="password" value={conf} onChange={setConf} placeholder="Ulangi password baru…" /></div>
    </ModalShell>
  );
};


// ════════════════════════════════════════════════════════════════
// 📐 TEMPLATES — page layouts
// ════════════════════════════════════════════════════════════════

/** DashboardTemplate */
const DashboardTemplate = ({ reports, canEdit, onDetail, onEdit, onDelete, onNewReport }) => (
  <div>
    <DashboardKPIs reports={reports} />
    <DashboardCharts reports={reports} />
    <Card>
      <CardHeader title="Laporan QC Terbaru" actions={canEdit && <Btn variant="primary" size="sm" onClick={onNewReport}>+ Laporan Baru</Btn>} />
      <ReportTable data={reports.slice(0, 8)} mini canEdit={canEdit} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
    </Card>
  </div>
);

/** ReportsTemplate — with filter bar */
const ReportsTemplate = ({ reports, canEdit, onDetail, onEdit, onDelete, onNewReport }) => {
  const [search, setSearch] = useState("");
  const [model,  setModel]  = useState("");
  const [color,  setColor]  = useState("");
  const [status, setStatus] = useState("");
  const [date,   setDate]   = useState("");

  const colorOpts = model === "WM1091SK" ? ["Blue","Purple"] : model === "WM891SK" ? ["Aqua","Pink"] : ["Blue","Purple","Aqua","Pink"];

  const filtered = reports.filter(r => {
    if (model  && r.model !== model)                    return false;
    if (color  && r.color !== color)                    return false;
    if (status && r.overall_status !== status)          return false;
    if (date   && !r.inspection_date.startsWith(date)) return false;
    if (search) {
      const s = `${genNo(r.id)} ${r.batch_no} ${r.inspector} ${r.model} ${r.color}`.toLowerCase();
      if (!s.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const reset = () => { setSearch(""); setModel(""); setColor(""); setStatus(""); setDate(""); };

  return (
    <div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1.2fr auto", gap: 10, alignItems: "end" }}>
          <FilterField label="🔍 Cari"><TextInput value={search} onChange={setSearch} placeholder="Batch / Inspector / Report No…" /></FilterField>
          <FilterField label="Model">
            <SelectInput value={model} onChange={v => { setModel(v); setColor(""); }}>
              <option value="">Semua Model</option>
              <option>WM1091SK</option><option>WM891SK</option>
            </SelectInput>
          </FilterField>
          <FilterField label="Warna">
            <SelectInput value={color} onChange={setColor}>
              <option value="">Semua Warna</option>
              {colorOpts.map(c => <option key={c}>{c}</option>)}
            </SelectInput>
          </FilterField>
          <FilterField label="Status">
            <SelectInput value={status} onChange={setStatus}>
              <option value="">Semua</option>
              <option value="pass">✅ Pass</option>
              <option value="fail">❌ Fail</option>
            </SelectInput>
          </FilterField>
          <FilterField label="Tanggal"><TextInput type="date" value={date} onChange={setDate} /></FilterField>
          <Btn variant="ghost" size="sm" onClick={reset}>Reset</Btn>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 12, color: T.muted }}>Menampilkan {filtered.length} dari {reports.length} laporan</span>
          {canEdit && <Btn variant="primary" size="sm" onClick={onNewReport}>+ Laporan Baru</Btn>}
        </div>
      </div>
      <Card>
        <ReportTable data={filtered} mini={false} canEdit={canEdit} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
      </Card>
    </div>
  );
};

/** MatrixTemplate */
const MatrixTemplate = ({ reports }) => <MatrixOrganism reports={reports} />;

/** UsersTemplate */
const UsersTemplate = ({ users, currentUser, onAddUser, onEdit, onDelete, onChangePw }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>👥 Kelola Akun User</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Tambah, edit, dan hapus akun pengguna</div>
      </div>
      <Btn variant="primary" onClick={onAddUser}>+ Tambah User</Btn>
    </div>
    <UserGrid users={users} currentUser={currentUser} onEdit={onEdit} onDelete={onDelete} onChangePw={onChangePw} />
  </div>
);


// ════════════════════════════════════════════════════════════════
// 📄 PAGE — App root, manages all state
// ════════════════════════════════════════════════════════════════
export default function App() {
  // Core state
  const [reports,     setReports]     = useState(SEED_REPORTS);
  const [users,       setUsers]       = useState(SEED_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [tab,         setTab]         = useState("dashboard");
  const [toastState,  setToastState]  = useState(null);
  const toastTimer = useRef(null);

  // Modal state
  const [formOpen,     setFormOpen]     = useState(false);
  const [editReport,   setEditReport]   = useState(null);
  const [detailOpen,   setDetailOpen]   = useState(false);
  const [detailReport, setDetailReport] = useState(null);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editUser,     setEditUser]     = useState(null);
  const [pwOpen,       setPwOpen]       = useState(false);
  const [pwTarget,     setPwTarget]     = useState(null);
  const [nextId,       setNextId]       = useState(SEED_REPORTS.length + 1);
  const [nextUid,      setNextUid]      = useState(SEED_USERS.length  + 1);

  // Inject global CSS once
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Outfit', sans-serif; background: ${T.bg}; color: ${T.text}; min-height: 100vh; font-size: 14px; line-height: 1.5; }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: ${T.bg}; }
      ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      input:focus, select:focus, textarea:focus { border-color: ${T.blue} !important; box-shadow: 0 0 0 3px rgba(47,129,247,.1) !important; outline: none !important; }
      input::placeholder, textarea::placeholder { color: ${T.muted2}; }
      select option { background: ${T.surface2}; }
      button:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
      button:active:not(:disabled) { transform: none !important; }
      tbody tr:hover td { background: ${T.surface2}; }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Toast helper
  const showToast = useCallback((msg, type = "ok") => {
    setToastState({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(null), 3200);
  }, []);

  const canEdit = currentUser && ["admin","operator"].includes(currentUser.role);
  const isAdmin = currentUser?.role === "admin";

  // ── Auth ──────────────────────────────────────────
  const handleLogin  = user => { setCurrentUser(user); showToast(`👋 Selamat datang, ${user.name}!`); };
  const handleLogout = ()   => { if (!window.confirm("Yakin ingin logout?")) return; setCurrentUser(null); setTab("dashboard"); };

  // ── Navigation ────────────────────────────────────
  const handleTab = t => {
    if (t === "users" && !isAdmin) { showToast("Hanya Admin yang bisa akses halaman ini", "err"); return; }
    setTab(t);
  };

  // ── Reports CRUD ──────────────────────────────────
  const handleNewReport    = ()  => { setEditReport(null); setFormOpen(true); };
  const handleEditReport   = id  => { setEditReport(reports.find(r => r.id === id) || null); setFormOpen(true); };
  const handleDetail       = id  => { setDetailReport(reports.find(r => r.id === id) || null); setDetailOpen(true); };
  const handleDeleteReport = id  => {
    if (!window.confirm("Hapus laporan ini?")) return;
    setReports(rs => rs.filter(r => r.id !== id));
    showToast("🗑 Laporan dihapus");
  };
  const handleSaveReport = data => {
    if (data.id) {
      setReports(rs => rs.map(r => r.id === data.id ? data : r));
      showToast("✅ Laporan diupdate!");
    } else {
      setReports(rs => [...rs, { ...data, id: nextId }]);
      setNextId(n => n + 1);
      showToast("✅ Laporan tersimpan!");
    }
    setFormOpen(false);
  };

  // ── Users CRUD ────────────────────────────────────
  const handleAddUser    = ()       => { setEditUser(null); setUserFormOpen(true); };
  const handleEditUser   = id       => { setEditUser(users.find(u => u.id === id) || null); setUserFormOpen(true); };
  const handleDeleteUser = id       => {
    if (currentUser?.id === id) { showToast("Tidak bisa hapus akun sendiri!", "err"); return; }
    const u = users.find(x => x.id === id);
    if (!window.confirm(`Hapus user "${u?.name || id}"?`)) return;
    setUsers(us => us.filter(u => u.id !== id));
    showToast("🗑 User dihapus");
  };
  const handleSaveUser = data => {
    if (data.id) {
      setUsers(us => us.map(u => u.id === data.id ? data : u));
      if (currentUser?.id === data.id) setCurrentUser(data);
      showToast("✅ User diupdate!");
    } else {
      setUsers(us => [...us, { ...data, id: nextUid }]);
      setNextUid(n => n + 1);
      showToast("✅ User ditambahkan!");
    }
    setUserFormOpen(false);
  };
  const handleChangePw = (id, name) => { setPwTarget(users.find(u => u.id === id) || null); setPwOpen(true); };
  const handleSavePw   = pw          => {
    setUsers(us => us.map(u => u.id === pwTarget.id ? { ...u, password: pw } : u));
    setPwOpen(false);
    showToast("✅ Password berhasil diubah!");
  };

  // ── Render ────────────────────────────────────────
  if (!currentUser) return <LoginOrganism users={users} onLogin={handleLogin} />;

  return (
    <div style={{ fontFamily: T.font, background: T.bg, color: T.text, minHeight: "100vh" }}>
      <NavbarOrganism
        user={currentUser} tab={tab} onTabChange={handleTab}
        canEdit={canEdit} isAdmin={isAdmin}
        onNewReport={handleNewReport} onLogout={handleLogout}
      />

      <div style={{ maxWidth: 1500, margin: "0 auto", padding: 24 }}>
        {tab === "dashboard" && (
          <DashboardTemplate reports={reports} canEdit={canEdit}
            onDetail={handleDetail} onEdit={handleEditReport} onDelete={handleDeleteReport}
            onNewReport={handleNewReport} />
        )}
        {tab === "reports" && (
          <ReportsTemplate reports={reports} canEdit={canEdit}
            onDetail={handleDetail} onEdit={handleEditReport} onDelete={handleDeleteReport}
            onNewReport={handleNewReport} />
        )}
        {tab === "matrix" && <MatrixTemplate reports={reports} />}
        {tab === "users" && isAdmin && (
          <UsersTemplate users={users} currentUser={currentUser}
            onAddUser={handleAddUser} onEdit={handleEditUser}
            onDelete={handleDeleteUser} onChangePw={handleChangePw} />
        )}
      </div>

      {/* ── Modals ── */}
      <ReportFormOrganism
        open={formOpen} onClose={() => setFormOpen(false)}
        editReport={editReport} onSave={handleSaveReport} showToast={showToast}
      />
      <DetailModal
        open={detailOpen} onClose={() => setDetailOpen(false)}
        report={detailReport} canEdit={canEdit} onEdit={handleEditReport}
      />
      <UserFormOrganism
        open={userFormOpen} onClose={() => setUserFormOpen(false)}
        editUser={editUser} onSave={handleSaveUser} users={users} showToast={showToast}
      />
      <ChangePwOrganism
        open={pwOpen} onClose={() => setPwOpen(false)}
        targetUser={pwTarget} onSave={handleSavePw} showToast={showToast}
      />

      {/* ── Toast ── */}
      <ToastNotif toast={toastState} />
    </div>
  );
}
