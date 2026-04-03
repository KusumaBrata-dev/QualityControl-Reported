import React, { useState, useRef } from "react";
import { T } from "../qcConstants";
import { Avatar } from "./Atoms";

// ── Self Profile Panel ─────────────────────────────────────────────
export const SelfProfilePanel = ({ user, isAdmin, onAvatarSave, onChangePw, onClose, canChangePhoto = true, canChangePassword = true }) => {
  const fileRef = useRef(null);
  const [previewing, setPreviewing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isSuperUser = isAdmin || user?.username === "hikmat";

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewing(url);
    setUploading(true);
    await onAvatarSave(user, file);
    setUploading(false);
    setPreviewing(null);
    onClose();
  };

  const avatarSrc = previewing || user?.avatar;

  return (
    <div style={{
      position: "fixed",
      top: 68, right: 12,
      width: 280,
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      boxShadow: "0 16px 48px rgba(0,0,0,0.45)",
      zIndex: 9000,
      overflow: "hidden",
      animation: "fadeInDown 0.2s ease",
    }}>
      {/* Header strip */}
      <div style={{
        background: "linear-gradient(135deg, #1C5FAD, #A371F7)",
        padding: "18px 16px 32px",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 10, right: 10,
          background: "rgba(255,255,255,0.15)", border: "none",
          borderRadius: 6, color: "#fff", width: 24, height: 24,
          cursor: "pointer", fontSize: 14, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>✕</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Clickable avatar */}
          <div style={{ position: "relative", cursor: "pointer" }}
            onClick={() => fileRef.current?.click()}>
            {avatarSrc
              ? <img src={avatarSrc} alt="avatar" style={{
                  width: 52, height: 52, borderRadius: "50%",
                  objectFit: "cover", border: "2px solid rgba(255,255,255,0.6)",
                  opacity: uploading ? 0.5 : 1,
                }} />
              : <Avatar name={user?.name} role={user?.role} size={52} />}
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: 18, height: 18, borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10,
            }}>📷</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "#fff", fontSize: 15 }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>@{user?.username} · {user?.role}</div>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      </div>

      {/* Body */}
      <div style={{ padding: "0 0 8px" }}>
        {/* Ganti Foto */}
        {canChangePhoto && (
        <button onClick={() => fileRef.current?.click()} style={{
          width: "100%", padding: "13px 16px",
          display: "flex", alignItems: "center", gap: 12,
          background: "none", border: "none", borderBottom: `1px solid ${T.border}`,
          color: T.text, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(47,129,247,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>📷</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Ganti Foto Profil</div>
            <div style={{ fontSize: 11, color: T.muted }}>Upload foto baru dari galeri</div>
          </div>
        </button>
        )}

        {/* Ganti Password */}
        {canChangePassword && (
        <button onClick={() => { onChangePw(user); onClose(); }} style={{
          width: "100%", padding: "13px 16px",
          display: "flex", alignItems: "center", gap: 12,
          background: "none", border: "none", borderBottom: `1px solid ${T.border}`,
          color: T.text, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(163,113,247,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🔑</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Ganti Password</div>
            <div style={{ fontSize: 11, color: T.muted }}>Ubah kata sandi akun Anda</div>
          </div>
        </button>
        )}

        {!canChangePhoto && !canChangePassword && !isAdmin && (
          <div style={{ padding: "16px", textAlign: "center", color: T.muted, fontSize: 12 }}>
            🔒 Tidak ada izin yang tersedia
          </div>
        )}

        {/* Super user badge */}
        {isSuperUser && (
          <div style={{
            margin: "8px 12px",
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(163,113,247,0.1)",
            border: "1px solid rgba(163,113,247,0.2)",
            fontSize: 11,
            color: "#A371F7",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            👑 <span>Akses <strong>Super User</strong> — dapat mengelola semua akun</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const GlobalTopBar = ({ onOpenSidebar, user, isDark, onToggleTheme, activeModel, onChangeModel, onAvatarSave, onChangePw, isAdmin, canChangePhoto, canChangePassword }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
  <>
  <div
    className="flex items-center justify-between px-4"
    style={{
      height: 60,
      background: isDark ? "rgba(13, 17, 23, 0.85)" : "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: `1px solid ${T.border}`,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: isDark
        ? "0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.3)"
        : "0 1px 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.06)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Hamburger */}
      <button
        onClick={onOpenSidebar}
        style={{
          color: T.muted,
          padding: "6px",
          borderRadius: 8,
          border: "none",
          background: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          transition: "color 0.2s",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Logo + Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Logo icon */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "linear-gradient(135deg, #1C5FAD 0%, #2F81F7 50%, #A371F7 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 10px rgba(47,129,247,0.4)",
          flexShrink: 0,
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
            <path d="M11 8v6M8 11h6"/>
          </svg>
        </div>

        {/* Brand name */}
        <div>
          <div style={{
            fontSize: 14,
            fontWeight: 800,
            color: T.text,
            letterSpacing: "-0.4px",
            lineHeight: 1.1,
          }}>
            QC System
          </div>
          <div style={{
            fontSize: 9,
            color: T.muted,
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            Report · Monitor
          </div>
        </div>
      </div>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {/* Workspace Selector */}
      <select
        value={activeModel}
        onChange={(e) => onChangeModel(e.target.value)}
        style={{
          background: T.surface2,
          color: T.blue,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          padding: "3px 8px",
          fontSize: 10,
          fontWeight: 700,
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="all">Semua</option>
        <option value="WM1091SK">WM1091</option>
        <option value="WM891SK">WM891</option>
      </select>

      {/* Clickable Avatar → opens profile panel */}
      <button
        onClick={() => setProfileOpen(p => !p)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: 0, borderRadius: "50%",
          outline: profileOpen ? `2px solid ${T.blue}` : "none",
          outlineOffset: 2,
          transition: "outline 0.15s",
        }}
        title="Kelola Profil Saya"
      >
        <Avatar name={user?.name} role={user?.role} avatar={user?.avatar} size={32} />
      </button>
    </div>
  </div>

  {/* Profile Panel Overlay backdrop */}
  {profileOpen && (
    <div
      onClick={() => setProfileOpen(false)}
      style={{
        position: "fixed", inset: 0, zIndex: 8999,
        background: "rgba(0,0,0,0.2)",
      }}
    />
  )}

  {/* Profile Panel */}
  {profileOpen && (
    <SelfProfilePanel
      user={user}
      isAdmin={isAdmin}
      onAvatarSave={onAvatarSave}
      onChangePw={onChangePw}
      onClose={() => setProfileOpen(false)}
      canChangePhoto={canChangePhoto}
      canChangePassword={canChangePassword}
    />
  )}
  </>
  );
};


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

export const MobileFAB = ({ onNewReport, onOpenScanner, canEdit, canScanBarcode }) => {
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
        {canScanBarcode && (
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
        )}
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
