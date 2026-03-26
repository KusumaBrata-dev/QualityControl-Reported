import React, { useState, useEffect } from "react";
import { T } from "../qcConstants";
import { Avatar, RoleBadge, StatusBadge, SelectInput, TextInput, FieldLabel, Btn } from "./Atoms";

/** ClockDisplay — live date/time */
export const ClockDisplay = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const iv = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(iv); }, []);
  return (
    <div style={{ fontFamily: T.mono, fontSize: 11.5, color: T.muted, background: T.bg, border: `1px solid ${T.border}`, padding: "4px 10px", borderRadius: 20 }}>
      {now.toLocaleDateString("id-ID")} <span style={{ color: T.blue }}>{now.toLocaleTimeString("id-ID")}</span>
    </div>
  );
};

/** NavUserChip — avatar + name + role in nav */
export const NavUserChip = ({ user }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px", borderRadius: 20, border: `1px solid ${T.border}`, background: T.surface2 }}>
    <Avatar name={user.name} role={user.role} size={26} />
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 700 }}>{user.name}</div>
      <RoleBadge role={user.role} />
    </div>
  </div>
);

/** SNChip — serial number chip with optional remove */
export const SNChip = ({ sn, onRemove }) => (
  <span style={{ background: T.redL, color: T.red, border: "1px solid rgba(248,81,73,.2)", padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontFamily: T.mono, display: "inline-flex", alignItems: "center", gap: 5 }}>
    📟 {sn}
    {onRemove && <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: T.red, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>}
  </span>
);

/** CheckpointRow — single QC checkpoint (read / edit) */
export const CheckpointRow = ({ cp, index, onChange, readOnly }) => (
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
export const ToastNotif = ({ toast }) => {
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
export const FilterField = ({ label, children }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

/** ModalShell — reusable modal overlay + card */
export const ModalShell = ({ open, onClose, title, subtitle, maxWidth = 840, headerExtra, footer, children }) => {
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

/** ErrorBoundary — catches errors in child component tree */
export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("ErrorBoundary caught:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center", color: T.red }}>
          <h2>Oops, terjadi kesalahan.</h2>
          <pre style={{ fontSize: 11, background: "rgba(248,81,73,.1)", padding: 10, borderRadius: T.r, marginTop: 10, textAlign: "left", overflowX: "auto" }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <Btn variant="ghost" onClick={() => this.setState({ hasError: false })} style={{ marginTop: 20 }}>Coba Lagi</Btn>
        </div>
      );
    }
    return this.props.children;
  }
}

/** ConfirmModal — custom confirmation instead of window.confirm */
export const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmText = "Ya, Lanjutkan", confirmVariant = "red" }) => {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onCancel()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, width: "100%", maxWidth: 400, padding: 24, boxShadow: "0 16px 40px rgba(0,0,0,.5)" }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: T.text }}>{title || "Konfirmasi"}</div>
        <div style={{ fontSize: 14, color: T.muted, marginBottom: 24 }}>{message}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Btn variant="ghost" onClick={onCancel}>Batal</Btn>
          <Btn variant={confirmVariant} onClick={onConfirm}>{confirmText}</Btn>
        </div>
      </div>
    </div>
  );
};
