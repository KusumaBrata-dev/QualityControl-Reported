import React from "react";
import { T, COLOR_HEX, COLOR_BGL, ROLE_GRAD } from "../qcConstants";

/** Badge — colored label chip */
export const Badge = ({ type = "viewer", style, children }) => {
  const map = {
    pass:     { bg: T.greenL,                     color: T.green,  border: "rgba(63,185,80,.2)"   },
    fail:     { bg: T.redL,                       color: T.red,    border: "rgba(248,81,73,.2)"   },
    repair:   { bg: "rgba(240,136,62,.1)",        color: T.orange, border: "rgba(240,136,62,.2)" },
    qa:       { bg: T.purpleL,                    color: T.purple, border: "rgba(163,113,247,.2)" },
    assembly: { bg: T.greenL,                     color: T.green,  border: "rgba(63,185,80,.2)"   },
    admin:    { bg: "rgba(240,136,62,.1)",        color: T.orange, border: "transparent"         },
    operator: { bg: T.blueL,                      color: T.blue,   border: "transparent"         },
    viewer:   { bg: T.greenL,                     color: T.green,  border: "transparent"         },
  };
  const s = map[type] || map.viewer;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      ...style
    }}>{children}</span>
  );
};

/** Btn — interactive button with variant + size */
export const Btn = ({ variant = "primary", size = "md", onClick, disabled, children, style = {} }) => {
  const vmap = {
    primary:       { bg: T.blue,                     color: "#fff",   border: T.blueD,  shadow: "0 2px 8px rgba(47,129,247,.3)"  },
    success:       { bg: T.greenD,                   color: "#fff",   border: "#196127",shadow: "0 2px 8px rgba(63,185,80,.2)"   },
    danger:        { bg: T.redD,                     color: "#fff",   border: "#8b0000",shadow: "none"                           },
    ghost:         { bg: T.surface2,                 color: T.muted,  border: T.border, shadow: "none"                           },
    blue_outline:  { bg: T.blueL,                    color: T.blue,   border: T.blue,   shadow: "none"                           },
    red_outline:   { bg: T.redL,                     color: T.red,    border: T.red,    shadow: "none"                           },
    yellow_outline:{ bg: "rgba(210,153,34,.1)",      color: T.yellow, border: T.yellow, shadow: "none"                           },
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
export const KpiCard = ({ colorKey, icon, label, value, sub }) => {
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
export const ProgressBar = ({ value, color = T.green }) => (
  <div style={{ height: 5, background: T.border, borderRadius: 4, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${Math.min(value, 100)}%`, background: color, borderRadius: 4, transition: "width 1s" }} />
  </div>
);

/** ColorTag — product color chip with dot */
export const ColorTag = ({ color }) => {
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
export const Avatar = ({ name, role, size = 26 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.44, fontWeight: 700, color: "#fff",
    background: ROLE_GRAD[role] || ROLE_GRAD.viewer, flexShrink: 0,
  }}>{(name || "?").charAt(0).toUpperCase()}</div>
);

/** TextInput */
export const TextInput = ({ value, onChange, placeholder, type = "text", style = {} }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "9px 12px", fontSize: 13.5, fontFamily: type === "number" ? T.mono : T.font, color: T.text, outline: "none", ...style }} />
);

/** SelectInput */
export const SelectInput = ({ value, onChange, children, style = {} }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "9px 12px", fontSize: 13.5, fontFamily: T.font, color: T.text, outline: "none", ...style }}>
    {children}
  </select>
);

/** TextareaInput */
export const TextareaInput = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r, padding: "9px 12px", fontSize: 13.5, fontFamily: T.font, color: T.text, outline: "none", resize: "vertical" }} />
);

/** FieldLabel — form field label */
export const FieldLabel = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{children}</div>
);

/** SectionHeader — section divider inside modal */
export const SectionHeader = ({ icon, children, first = false }) => (
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
export const StatusBadge = ({ status }) => (
  <Badge type={status}>{status === "pass" ? "✓ PASS" : "✕ FAIL"}</Badge>
);

/** StationBadge — Repair / QA / Assembly */
export const StationBadge = ({ station }) => {
  if (!station) return <span style={{ color: T.muted2, fontSize: 11 }}>–</span>;
  const typeMap = { Repair: "repair", QA: "qa", Assembly: "assembly" };
  const iconMap = { Repair: "🔧", QA: "🔬", Assembly: "⚙️" };
  return <Badge type={typeMap[station] || "viewer"}>{iconMap[station] || ""} {station}</Badge>;
};

/** RoleBadge — admin / operator / viewer */
export const RoleBadge = ({ role }) => {
  const lbl = { admin: "Admin", operator: "Operator", viewer: "Viewer" };
  return <Badge type={role}>{lbl[role] || role}</Badge>;
};

/** StatMini — compact stat box */
export const StatMini = ({ label, value, color = T.text }) => (
  <div style={{ background: T.bg, border: `1px solid ${T.border2}`, borderRadius: T.r, padding: 10, textAlign: "center" }}>
    <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: T.mono, color }}>{value}</div>
  </div>
);

/** Card */
export const Card = ({ children, style = {} }) => (
  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r2, overflow: "hidden", ...style }}>{children}</div>
);

/** CardHeader */
export const CardHeader = ({ title, actions }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
    <span style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "1.2px" }}>{title}</span>
    {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
  </div>
);
