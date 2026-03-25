import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { T, PRODUCTS, COLOR_HEX, genNo, drColor, mkCp, DEFECT_CATS, INSPECTORS } from "../qcConstants";
import { Badge, Btn, KpiCard, ProgressBar, ColorTag, Avatar, TextInput, SelectInput, TextareaInput, FieldLabel, SectionHeader, StatusBadge, StationBadge, RoleBadge, StatMini, Card, CardHeader } from "./Atoms";
import { ClockDisplay, NavUserChip, SNChip, CheckpointRow, ModalShell } from "./Molecules";

/** LoginOrganism — full login screen */
export const LoginOrganism = ({ users, onLogin }) => {
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
      <div className="qc-login-card" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "40px 44px", width: "100%", maxWidth: 420, boxShadow: "0 0 0 1px rgba(255,255,255,.04), 0 8px 32px rgba(0,0,0,.5)" }}>
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
export const NavbarOrganism = ({ user, tab, onTabChange, canEdit, isAdmin, onNewReport, onLogout }) => (
  <nav style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100 }}>
    <div className="qc-nav-inner" style={{ maxWidth: 1500, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 54 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: `linear-gradient(135deg,${T.blueD},${T.blue})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔬</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>QC Report System</div>
          <div style={{ fontSize: 9, color: T.muted, letterSpacing: "1.8px", textTransform: "uppercase" }}>WM Series</div>
        </div>
      </div>
      {/* Tabs */}
      <div className="qc-nav-tabs" style={{ display: "flex", gap: 2 }}>
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
      <div className="qc-nav-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="qc-clock"><ClockDisplay /></div>
        {canEdit && <Btn variant="primary" size="sm" onClick={onNewReport}>+ Laporan Baru</Btn>}
        <NavUserChip user={user} />
        <Btn variant="ghost" size="sm" onClick={onLogout}>Logout</Btn>
      </div>
    </div>
  </nav>
);

/** DashboardKPIs — 4-card KPI grid + alert */
export const DashboardKPIs = ({ reports }) => {
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
      <div className="qc-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <KpiCard colorKey="blue"   icon="📋" label="Total Laporan"   value={reports.length}          sub="Semua batch"               />
        <KpiCard colorKey="green"  icon="🔍" label="Total Inspected" value={total.toLocaleString()}  sub="Unit diperiksa"            />
        <KpiCard colorKey="yellow" icon="📉" label="Avg Defect Rate" value={`${avgDR}%`}             sub="Target < 3%"               />
        <KpiCard colorKey="red"    icon="🚫" label="Batch Fail"      value={fail}                    sub={`R:${stR} QA:${stQ} A:${stA}`} />
      </div>
    </>
  );
};

/** DashboardCharts — Pie (status) + Bar (defect rate per varian), filterable by date */
export const DashboardCharts = ({ reports, selectedDate, onDateChange }) => {
  const filtered = selectedDate ? reports.filter(r => (r.inspection_date || "").startsWith(selectedDate)) : reports;
  const pass = filtered.filter(r => r.overall_status === "pass").length;
  const fail = filtered.filter(r => r.overall_status === "fail").length;
  const pieData = [{ name: "Pass", value: pass }, { name: "Fail", value: fail }];
  const barData = [1, 2, 3, 4].map(pid => {
    const rs   = filtered.filter(r => r.product_id === pid);
    const prod = PRODUCTS[pid];
    return { name: `${prod.model} – ${prod.color}`, value: rs.length ? +(rs.reduce((a, r) => a + r.defect_rate, 0) / rs.length).toFixed(2) : 0, fill: COLOR_HEX[prod.color] };
  });
  const PIE_COLORS = [T.green, T.red];
  const ttStyle = { background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.r, color: T.text };
  const noData = filtered.length === 0;
  return (
    <div className="qc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 18 }}>
      <Card>
        <CardHeader title="Status Batch" actions={
          <input
            type="date" value={selectedDate || ""}
            onChange={e => onDateChange(e.target.value)}
            style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.r, color: T.muted, fontSize: 12, padding: "4px 8px", outline: "none", cursor: "pointer" }}
          />
        } />
        <div style={{ padding: 20, height: 260 }}>
          {noData ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: T.muted, gap: 8 }}>
              <div style={{ fontSize: 32 }}>📭</div>
              <div style={{ fontSize: 13 }}>Tidak ada data untuk tanggal ini</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={ttStyle} />
                <Legend wrapperStyle={{ color: T.muted, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
      <Card>
        <CardHeader title="Defect Rate Harian per Varian (%)" actions={
          <span style={{ fontSize: 11, color: T.muted }}>{selectedDate || "Semua tanggal"}</span>
        } />
        <div style={{ padding: 20, height: 260 }}>
          {noData ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: T.muted, gap: 8 }}>
              <div style={{ fontSize: 32 }}>📊</div>
              <div style={{ fontSize: 13 }}>Tidak ada laporan untuk tanggal ini</div>
            </div>
          ) : (
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
          )}
        </div>
      </Card>
    </div>
  );
};

/** ReportTable — full / mini mode */
export const ReportTable = ({ data, mini = false, canEdit, onDetail, onEdit, onDelete }) => {
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
export const MatrixOrganism = ({ reports }) => {
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
      <div className="qc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
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
                    <div className="qc-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
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
export const UserGrid = ({ users, currentUser, onEdit, onDelete, onChangePw }) => {
  if (!users.length) return <div style={{ textAlign: "center", color: T.muted, padding: 40 }}>Belum ada user</div>;
  return (
    <div className="qc-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
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
export const ReportFormOrganism = ({ open, onClose, editReport, onSave, showToast }) => {
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
      <div className="qc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
      <div className="qc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
      <div className="qc-grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
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
      <div className="qc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
export const DetailModal = ({ open, onClose, report, canEdit, onEdit }) => {
  if (!report) return null;
  const rate     = report.defect_rate || 0;
  const passRate = report.qty_inspected ? (report.qty_pass / report.qty_inspected * 100).toFixed(1) : 0;
  return (
    <ModalShell open={open} onClose={onClose} title={genNo(report.id)} subtitle={`${report.batch_no} · ${(report.inspection_date || "").substring(0, 16)}`}
      maxWidth={880}
      headerExtra={<StatusBadge status={report.overall_status} />}
      footer={<><Btn variant="ghost" onClick={onClose}>Tutup</Btn>{canEdit && <Btn variant="yellow_outline" onClick={() => { onClose(); onEdit(report.id); }}>✏️ Edit</Btn>}</>}>

      {/* Info grid */}
      <div className="qc-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
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
      <div className="qc-grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }}>
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
        <div className="qc-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
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
export const UserFormOrganism = ({ open, onClose, editUser, onSave, users, showToast }) => {
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
      <div className="qc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
      <div className="qc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
export const ChangePwOrganism = ({ open, onClose, targetUser, onSave, showToast }) => {
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
