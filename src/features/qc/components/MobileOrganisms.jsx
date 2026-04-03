import React, { useState } from "react";
import { T } from "../qcConstants";
import { Avatar } from "./Atoms";

export const GlobalTopBar = ({ onOpenSidebar, user, isDark, onToggleTheme, activeModel, onChangeModel }) => (
  <div
    className="flex items-center justify-between px-6"
    style={{
      height: 60,
      background: isDark ? "rgba(13, 17, 23, 0.7)" : "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: `1px solid ${T.border}`,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    }}
  >
    <div className="flex items-center gap-3">
      <button
        onClick={onOpenSidebar}
        style={{ color: T.text, padding: 4 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div style={{ fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: "-0.5px" }}>QC System</div>
    </div>
    <div className="flex items-center gap-3">
      {/* Workspace Selector */}
      <select
        value={activeModel}
        onChange={(e) => onChangeModel(e.target.value)}
        style={{
          background: T.surface2,
          color: T.blue,
          border: `1px solid ${T.blueL}`,
          borderRadius: T.r,
          padding: "2px 4px",
          fontSize: 10,
          fontWeight: 700,
          outline: "none",
        }}
      >
        <option value="all">Semua</option>
        <option value="WM1091SK">WM1091</option>
        <option value="WM891SK">WM891</option>
      </select>

      <Avatar name={user?.name} role={user?.role} avatar={user?.avatar} size={30} />
    </div>
  </div>
);

export const MobileBottomNav = ({ tab, onTabChange, isAdmin }) => {
  const tabs = [
    { key: "dashboard", label: "Dash", icon: "📊" },
    { key: "reports", label: "Laporan", icon: "📋" },
    { key: "matrix", label: "Matrix", icon: "🎨" },
    ...(isAdmin ? [{ key: "users", label: "Users", icon: "👥" }] : []),
  ];

  return (
    <div
      className="flex md:hidden items-center justify-around"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: T.surface,
        borderTop: `1px solid ${T.border}`,
        zIndex: 90,
        paddingBottom: "env(safe-area-inset-bottom)", // iPhone X support
      }}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onTabChange(t.key)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            height: "100%",
            background: "none",
            border: "none",
            color: tab === t.key ? T.blue : T.muted,
          }}
        >
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: T.font }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export const MobileFAB = ({ onNewReport, onOpenScanner, canEdit }) => {
  const [open, setOpen] = useState(false);

  if (!canEdit) return null;

  return (
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 80, // Above bottom nav
        right: 16,
        zIndex: 95,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Secondary Actions (Expandable) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(20px)",
          pointerEvents: open ? "auto" : "none",
          transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        <button
          onClick={() => { setOpen(false); onOpenScanner(); }}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: T.surface,
            border: `1px solid ${T.border}`,
            color: T.blue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: 20,
          }}
        >
          📷
        </button>
      </div>

      {/* Main Main Action */}
      <button
        onClick={() => {
          if (open) {
            setOpen(false);
            onNewReport();
          } else {
            setOpen(true);
          }
        }}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: `linear-gradient(135deg,${T.greenD},${T.green})`,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(35, 134, 54, 0.4)",
          fontSize: 24,
          border: "none",
          transition: "transform 0.2s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
        }}
      >
        {open ? "+" : "📝"}
      </button>
    </div>
  );
};

export const GlobalSidebar = ({ open, onClose, user, isDark, onToggleTheme, onLogout, tab, onTabChange, activeModel, onChangeModel, isAdmin }) => {
  return (
    <>
      {/* Overlay backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
          zIndex: 999,
        }}
      />
      
      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0, bottom: 0, left: 0,
          width: 300,
          background: isDark ? "rgba(13, 17, 23, 0.85)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 1000,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "rgba(0, 0, 0, 0.3) 0px 0px 40px",
          borderRight: `1px solid ${T.border}`,
        }}
      >
        {/* Header */}
        <div style={{ padding: "32px 20px 24px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ marginBottom: 12 }}>
            <Avatar name={user?.name} role={user?.role} avatar={user?.avatar} size={56} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: T.muted }}>@{user?.username} · {user?.role}</div>
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          
          <div style={{ padding: "0 20px 8px", fontSize: 11, fontWeight: 700, color: T.blue, letterSpacing: 1, textTransform: "uppercase" }}>
            Navigasi Utama
          </div>
          {[
            { key: "dashboard", label: "Dashboard QC", icon: "📊" },
            { key: "reports", label: "Laporan Defect", icon: "📋" },
            { key: "matrix", label: "Defect Matrix", icon: "🎨" },
            ...(isAdmin ? [{ key: "users", label: "Manajemen User", icon: "👥" }] : []),
          ].map(t => (
            <div
              key={t.key}
              onClick={() => { onTabChange(t.key); onClose(); }}
              style={{
                padding: "12px 20px",
                margin: "4px 12px",
                borderRadius: T.r2,
                cursor: "pointer",
                background: tab === t.key ? (isDark ? "rgba(47,129,247,0.15)" : "rgba(47,129,247,0.1)") : "transparent",
                color: tab === t.key ? T.blue : T.text,
                fontWeight: tab === t.key ? 700 : 500,
                display: "flex",
                alignItems: "center",
                gap: 14,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (tab !== t.key) e.currentTarget.style.background = T.surface2; }}
              onMouseLeave={(e) => { if (tab !== t.key) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span> 
              <span style={{ fontSize: 15 }}>{t.label}</span>
            </div>
          ))}

          <div style={{ padding: "24px 20px 8px", fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: 1, textTransform: "uppercase" }}>
            Integrations (Soon)
          </div>
          <div style={{ padding: "12px 20px", color: T.muted2, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18, opacity: 0.5 }}>⚙️</span> MES Production
            <span style={{ marginLeft: "auto", fontSize: 10, background: T.border, padding: "2px 6px", borderRadius: 4 }}>LOCKED</span>
          </div>
          <div style={{ padding: "12px 20px", color: T.muted2, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18, opacity: 0.5 }}>📦</span> Inventory WMS
            <span style={{ marginLeft: "auto", fontSize: 10, background: T.border, padding: "2px 6px", borderRadius: 4 }}>LOCKED</span>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", color: T.text, fontWeight: 600 }}>
            {isDark ? "🌙" : "☀️"}
            Dark Mode
            <input 
               type="checkbox" 
               checked={isDark} 
               onChange={onToggleTheme}
               style={{ marginLeft: "auto", width: 44, height: 24, accentColor: T.blue }} 
            />
          </label>
          
          <button 
            onClick={() => { onClose(); onLogout(); }}
            style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", color: T.red, fontWeight: 600, textAlign: "left", padding: "8px 0", cursor: "pointer" }}
          >
            <span style={{ fontSize: 18 }}>🚪</span> Logout
          </button>
        </div>
      </div>
    </>
  );
};
