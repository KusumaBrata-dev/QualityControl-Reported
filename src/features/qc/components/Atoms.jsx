import React from "react";
import { T, COLOR_HEX, COLOR_BGL, ROLE_GRAD } from "../qcConstants";

/** Badge — colored label chip */
export const Badge = ({ type = "viewer", style, children }) => {
  const map = {
    fail: { bg: T.redL, color: T.red, border: "rgba(248,81,73,.2)" },
    pass: { bg: T.greenL, color: T.green, border: "transparent" },
    repair: {
      bg: "rgba(240,136,62,.1)",
      color: T.orange,
      border: "rgba(240,136,62,.2)",
    },
    qa: { bg: T.purpleL, color: T.purple, border: "rgba(163,113,247,.2)" },
    assembly: { bg: T.greenL, color: T.green, border: "rgba(63,185,80,.2)" },
    admin: {
      bg: "rgba(240,136,62,.1)",
      color: T.orange,
      border: "transparent",
    },
    operator: { bg: T.blueL, color: T.blue, border: "transparent" },
    viewer: { bg: T.greenL, color: T.green, border: "transparent" },
  };
  const s = map[type] || map.viewer;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Btn — interactive button with variant + size */
export const Btn = ({
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  children,
  style = {},
}) => {
  const vmap = {
    primary: {
      bg: T.blue,
      color: "#fff",
      border: T.blueD,
      shadow: "0 2px 8px rgba(47,129,247,.3)",
    },
    success: {
      bg: T.greenD,
      color: "#fff",
      border: "#196127",
      shadow: "0 2px 8px rgba(63,185,80,.2)",
    },
    danger: { bg: T.redD, color: "#fff", border: "#8b0000", shadow: "none" },
    red: { bg: T.redD, color: "#fff", border: "#8b0000", shadow: "none" }, // alias
    ghost: { bg: T.surface2, color: T.muted, border: T.border, shadow: "none" },
    blue_outline: {
      bg: T.blueL,
      color: T.blue,
      border: T.blue,
      shadow: "none",
    },
    red_outline: { bg: T.redL, color: T.red, border: T.red, shadow: "none" },
    yellow_outline: {
      bg: "rgba(210,153,34,.1)",
      color: T.yellow,
      border: T.yellow,
      shadow: "none",
    },
    excel: { bg: "#196127", color: "#fff", border: "#0d4a1e", shadow: "none" },
    word: { bg: "#1C3A6E", color: "#fff", border: "#142850", shadow: "none" },
  };
  const smap = {
    xs: { padding: "3px 9px", fontSize: 11, borderRadius: 6 },
    sm: { padding: "5px 12px", fontSize: 12, borderRadius: T.r },
    md: { padding: "8px 16px", fontSize: 13, borderRadius: T.r },
  };
  const v = vmap[variant] || vmap.primary;
  const s = smap[size] || smap.md;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: T.font,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        opacity: disabled ? 0.6 : 1,
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        boxShadow: v.shadow,
        transition: "filter .15s, transform .1s",
        ...s,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

/** KpiCard — metric display tile */
export const KpiCard = ({ colorKey, icon, label, value, sub }) => {
  const cmap = {
    blue: {
      accent: `linear-gradient(90deg,${T.blueD},${T.blue})`,
      val: T.blue,
    },
    green: {
      accent: `linear-gradient(90deg,${T.greenD},${T.green})`,
      val: T.green,
    },
    yellow: {
      accent: `linear-gradient(90deg,${T.yellow},#f5a623)`,
      val: T.yellow,
    },
    red: { accent: `linear-gradient(90deg,${T.redD},${T.red})`, val: T.red },
  };
  const c = cmap[colorKey] || cmap.blue;
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.r2,
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: c.accent,
        }}
      />
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: T.muted,
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          fontFamily: T.mono,
          lineHeight: 1,
          marginBottom: 4,
          color: c.val,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 500, color: T.muted }}>
        {sub}
      </div>
    </div>
  );
};

/** ProgressBar — animated fill bar */
export const ProgressBar = ({ value, color = T.green }) => (
  <div
    style={{
      height: 5,
      background: T.border,
      borderRadius: 4,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${Math.min(value, 100)}%`,
        background: color,
        borderRadius: 4,
        transition: "width 1s",
      }}
    />
  </div>
);

/** ColorTag — product color chip with dot */
export const ColorTag = ({ color }) => {
  const hex = COLOR_HEX[color] || "#999";
  const bg = COLOR_BGL[color] || T.surface2;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        background: bg,
        color: hex,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: hex,
          display: "inline-block",
        }}
      />
      {color}
    </span>
  );
};

export const Avatar = ({ name, role, avatar, size = 26 }) => {
  const safeName = (name || "?").trim();
  const seed = encodeURIComponent(safeName.toLowerCase());
  const dicebearUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
  
  // Use the provided custom avatar URL, otherwise fallback to DiceBear
  const finalImage = avatar || dicebearUrl;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        backgroundColor: ROLE_GRAD[role] || ROLE_GRAD.viewer,
        backgroundImage: `url('${finalImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: `1px solid rgba(255,255,255,0.1)`,
      }}
    />
  );
};

/** TextInput */
export const TextInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  style = {},
  onKeyDown,
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    style={{
      width: "100%",
      background: T.bg,
      border: `1px solid ${T.border}`,
      borderRadius: T.r,
      padding: "9px 12px",
      fontSize: 13.5,
      fontFamily: type === "number" ? T.mono : T.font,
      color: T.text,
      outline: "none",
      ...style,
    }}
  />
);

/** SelectInput */
export const SelectInput = ({ value, onChange, children, style = {} }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      width: "100%",
      background: T.bg,
      border: `1px solid ${T.border}`,
      borderRadius: T.r,
      padding: "9px 12px",
      fontSize: 13.5,
      fontFamily: T.font,
      color: T.text,
      outline: "none",
      ...style,
    }}
  >
    {children}
  </select>
);

/** TextareaInput */
export const TextareaInput = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: "100%",
      background: T.bg,
      border: `1px solid ${T.border}`,
      borderRadius: T.r,
      padding: "9px 12px",
      fontSize: 13.5,
      fontFamily: T.font,
      color: T.text,
      outline: "none",
      resize: "vertical",
    }}
  />
);

/** FieldLabel — form field label */
export const FieldLabel = ({ children }) => (
  <div
    style={{
      fontSize: 10.5,
      fontWeight: 600,
      color: T.muted,
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: 6,
    }}
  >
    {children}
  </div>
);

/** SectionHeader — section divider inside modal */
export const SectionHeader = ({ icon, children, first = false }) => (
  <div
    style={{
      fontSize: 10,
      fontWeight: 700,
      color: T.blue,
      textTransform: "uppercase",
      letterSpacing: "2px",
      paddingBottom: 10,
      borderBottom: `1px solid ${T.blueL}`,
      marginBottom: 16,
      marginTop: first ? 0 : 22,
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    {icon && <span>{icon}</span>}
    {children}
  </div>
);

/** StatusBadge — pass/fail */
export const StatusBadge = ({ status }) => {
  if (status === "pass" || status === "approved")
    return <Badge type="pass">✓ PASS</Badge>;
  return <Badge type="fail">✕ REJECT</Badge>;
};

/** StationBadge — Repair / QA / Assembly */
export const StationBadge = ({ station }) => {
  if (!station) return <span style={{ color: T.muted2, fontSize: 11 }}>–</span>;
  const typeMap = { Repair: "repair", QA: "qa", Assembly: "assembly" };
  const iconMap = { Repair: "🔧", QA: "🔬", Assembly: "⚙️" };
  return (
    <Badge type={typeMap[station] || "viewer"}>
      {iconMap[station] || ""} {station}
    </Badge>
  );
};

/** RoleBadge — admin / operator / viewer */
export const RoleBadge = ({ role }) => {
  const lbl = { admin: "Admin", operator: "Operator", viewer: "Viewer" };
  return <Badge type={role}>{lbl[role] || role}</Badge>;
};

/** StatMini — compact stat box */
export const StatMini = ({ label, value, color = T.text }) => (
  <div
    style={{
      background: T.bg,
      border: `1px solid ${T.border2}`,
      borderRadius: T.r,
      padding: 10,
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: 9,
        color: T.muted,
        textTransform: "uppercase",
        letterSpacing: "1px",
        marginBottom: 2,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: T.mono, color }}>
      {value}
    </div>
  </div>
);

/** Card */
export const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.r2,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

/** CardHeader */
export const CardHeader = ({ title, actions }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      borderBottom: `1px solid ${T.border}`,
    }}
  >
    <span
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: T.muted,
        textTransform: "uppercase",
        letterSpacing: "1.2px",
      }}
    >
      {title}
    </span>
    {actions && (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {actions}
      </div>
    )}
  </div>
);

/** DatePicker — custom calendar with data-dot indicators */
export const DatePicker = ({ value, onChange, activeDates = [] }) => {
  const activeSet = new Set(activeDates);
  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(() => {
    const d = value ? new Date(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstDow = new Date(view.year, view.month, 1).getDay();
  const monthLabel = new Date(view.year, view.month).toLocaleDateString(
    "id-ID",
    { month: "long", year: "numeric" },
  );
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const prevMonth = () =>
    setView((v) =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { ...v, month: v.month - 1 },
    );
  const nextMonth = () =>
    setView((v) =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { ...v, month: v.month + 1 },
    );

  const pickDate = (day) => {
    const ds = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(ds);
    setOpen(false);
  };

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const displayLabel = value
    ? value.slice(5).replace("-", "/") + "/" + value.slice(0, 4)
    : "Pilih Tanggal";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: T.surface2,
          border: `1px solid ${open ? T.blue : T.border}`,
          borderRadius: T.r,
          color: T.text,
          fontSize: 13,
          padding: "8px 12px",
          cursor: "pointer",
          fontFamily: T.font,
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
        }}
      >
        📅 {displayLabel}
        <span style={{ marginLeft: "auto", color: T.muted, fontSize: 11 }}>
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 9999,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: T.r2,
            boxShadow: "0 8px 32px rgba(0,0,0,.4)",
            padding: 12,
            minWidth: 260,
          }}
        >
          {/* Month nav */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <button
              onClick={prevMonth}
              style={{
                background: "none",
                border: "none",
                color: T.muted,
                cursor: "pointer",
                fontSize: 16,
                padding: "2px 6px",
              }}
            >
              ‹
            </button>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>
              {monthLabel}
            </span>
            <button
              onClick={nextMonth}
              style={{
                background: "none",
                border: "none",
                color: T.muted,
                cursor: "pointer",
                fontSize: 16,
                padding: "2px 6px",
              }}
            >
              ›
            </button>
          </div>
          {/* Day headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 2,
              marginBottom: 4,
            }}
          >
            {days.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  color: T.muted2,
                  padding: "2px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>
          {/* Date cells */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 2,
            }}
          >
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} />;
              const ds = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = ds === value;
              const isToday = ds === todayStr;
              const hasData = activeSet.has(ds);
              return (
                <div
                  key={ds}
                  onClick={() => pickDate(day)}
                  style={{
                    textAlign: "center",
                    padding: "5px 2px",
                    borderRadius: T.r,
                    cursor: "pointer",
                    background: isSelected
                      ? T.blue
                      : isToday
                        ? T.blueL
                        : "none",
                    color: isSelected ? "#fff" : isToday ? T.blue : T.text,
                    fontWeight: isSelected || isToday ? 700 : 400,
                    fontSize: 12,
                    position: "relative",
                    transition: "background .1s",
                  }}
                >
                  {day}
                  {hasData && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: isSelected ? "#fff" : T.blue,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* Today button */}
          <div
            style={{
              textAlign: "right",
              marginTop: 8,
              borderTop: `1px solid ${T.border}`,
              paddingTop: 8,
            }}
          >
            <button
              onClick={() => {
                onChange(todayStr);
                setOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: T.blue,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: T.font,
              }}
            >
              Hari Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
