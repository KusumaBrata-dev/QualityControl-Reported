import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  T,
  PRODUCTS,
  COLOR_HEX,
  genNo,
  drColor,
  mkCp,
  DEFECT_CATS,
} from "../qcConstants";
import {
  Badge,
  Btn,
  KpiCard,
  ProgressBar,
  ColorTag,
  Avatar,
  TextInput,
  SelectInput,
  TextareaInput,
  FieldLabel,
  SectionHeader,
  StatusBadge,
  StationBadge,
  RoleBadge,
  StatMini,
  Card,
  CardHeader,
} from "./Atoms";
import {
  ClockDisplay,
  NavUserChip,
  SNChip,
  CheckpointRow,
  ModalShell,
} from "./Molecules";

/** LoginOrganism — full login screen */
export const LoginOrganism = ({ users, onLogin }) => {
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (!uname || !pass) {
        setError("⚠ Username dan password wajib diisi");
        setLoading(false);
        return;
      }
      const user = users.find((u) => u.username === uname.toLowerCase());
      if (!user) {
        setError("❌ Username tidak ditemukan");
        setLoading(false);
        return;
      }
      if (!user.active) {
        setError("⛔ Akun nonaktif. Hubungi Admin.");
        setLoading(false);
        return;
      }
      if (user.password !== pass) {
        setError("❌ Password salah");
        setPass("");
        setLoading(false);
        return;
      }
      onLogin(user);
    }, 600);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: T.bg,
        backgroundImage: `radial-gradient(ellipse at 20% 30%, rgba(47,129,247,.08) 0%, transparent 55%),
                        radial-gradient(ellipse at 80% 70%, rgba(163,113,247,.06) 0%, transparent 55%)`,
      }}
    >
      <div
        className="qc-login-card"
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: "40px 44px",
          width: "100%",
          maxWidth: 420,
          boxShadow:
            "0 0 0 1px rgba(255,255,255,.04), 0 8px 32px rgba(0,0,0,.5)",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: `linear-gradient(135deg,${T.blueD},${T.blue})`,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              boxShadow: "0 0 16px rgba(47,129,247,.3)",
            }}
          >
            🔬
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              QC Report System
            </div>
            <div
              style={{
                fontSize: 10,
                color: T.muted,
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              WM Series · Quality Control
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          Selamat Datang
        </div>
        <div
          style={{
            fontSize: 13,
            color: T.muted,
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          Masuk untuk mengakses sistem laporan QC
        </div>

        {error && (
          <div
            style={{
              background: "rgba(248,81,73,.1)",
              border: "1px solid rgba(248,81,73,.3)",
              borderRadius: T.r,
              padding: "10px 14px",
              fontSize: 12.5,
              color: T.red,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Username</FieldLabel>
          <TextInput
            value={uname}
            onChange={setUname}
            placeholder="Masukkan username…"
          />
        </div>
        <div style={{ marginBottom: 4 }}>
          <FieldLabel>Password</FieldLabel>
          <TextInput
            value={pass}
            onChange={setPass}
            placeholder="Masukkan password…"
            type="password"
          />
        </div>

        <button
          onClick={handle}
          disabled={loading}
          style={{
            width: "100%",
            background: `linear-gradient(135deg,${T.blueD},${T.blue})`,
            color: "#fff",
            border: "none",
            borderRadius: T.r,
            padding: 12,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: T.font,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 16px rgba(47,129,247,.3)",
            opacity: loading ? 0.8 : 1,
            marginTop: 16,
          }}
        >
          {loading ? "⏳ Memverifikasi…" : "🔐 Masuk"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 11,
            color: T.muted2,
          }}
        >
          QC Report System v3.0
        </div>
      </div>
    </div>
  );
};

/** NavbarOrganism — top navigation */
export const NavbarOrganism = ({
  user,
  tab,
  onTabChange,
  canEdit,
  isAdmin,
  onNewReport,
  onLogout,
}) => (
  <nav
    style={{
      background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}
  >
    <div
      className="qc-nav-inner"
      style={{
        maxWidth: 1500,
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 54,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: `linear-gradient(135deg,${T.blueD},${T.blue})`,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          🔬
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>QC Report System</div>
          <div
            style={{
              fontSize: 9,
              color: T.muted,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
            }}
          >
            WM Series
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="qc-nav-tabs" style={{ display: "flex", gap: 2 }}>
        {[
          { key: "dashboard", label: "📊 Dashboard" },
          { key: "reports", label: "📋 Laporan QC" },
          { key: "matrix", label: "🎨 Defect Compare" },
          ...(isAdmin ? [{ key: "users", label: "👥 Kelola User" }] : []),
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "none",
              background:
                tab === t.key ? "rgba(47,129,247,.15)" : "transparent",
              color: tab === t.key ? T.blue : T.muted,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: T.font,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Right */}
      <div
        className="qc-nav-right"
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <div className="qc-clock">
          <ClockDisplay />
        </div>
        {canEdit && (
          <Btn variant="primary" size="sm" onClick={onNewReport}>
            + Laporan Baru
          </Btn>
        )}
        <NavUserChip user={user} />
        <Btn variant="ghost" size="sm" onClick={onLogout}>
          Logout
        </Btn>
      </div>
    </div>
  </nav>
);

/** DashboardKPIs — 4-card KPI grid + alert */
export const DashboardKPIs = ({ reports, burningInQty }) => {
  const totFail = reports.reduce((a, r) => a + (Number(r.qty_fail) || 0), 0);
  const totPass = reports.reduce((a, r) => a + (Number(r.qty_pass) || 0), 0);
  const totInsp = totPass + totFail;

  // DR = Total Fail / Barang Masuk (if provided). Else fallback to Total Fail / Total Inspected.
  const baseQty = burningInQty > 0 ? burningInQty : totInsp;
  const drRate = baseQty > 0 ? ((totFail / baseQty) * 100).toFixed(2) : "0.00";

  return (
    <>
      {totFail > 0 && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: T.r,
            fontSize: 13,
            background: "rgba(210,153,34,.1)",
            border: "1px solid rgba(210,153,34,.25)",
            color: T.yellow,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          ⚠ Terdapat <strong>{totFail} unit REJECT</strong> pada hari ini –
          perhatikan defect rate!
        </div>
      )}
      <div
        className="qc-kpi-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <KpiCard
          colorKey="blue"
          icon="🔥"
          label="Barang Masuk"
          value={burningInQty || "-"}
        />
        <KpiCard
          colorKey="red"
          icon="🚫"
          label="Total Defect / Reject"
          value={totFail}
        />
        <KpiCard
          colorKey="yellow"
          icon="📉"
          label="Defect Rate %"
          value={`${drRate}%`}
          sub={
            burningInQty ? "Dari Total Barang Masuk" : "Dari Total Diperiksa"
          }
        />
      </div>
    </>
  );
};

/** DashboardCharts — Pie (status) + Bar (defect rate per varian), filterable by date */
export const DashboardCharts = ({ reports, selectedDate, burningInQty }) => {
  const filtered = selectedDate
    ? reports.filter((r) => (r.inspection_date || "").startsWith(selectedDate))
    : reports;

  const passQty = filtered.reduce((a, r) => a + (Number(r.qty_pass) || 0), 0);
  const failQty = filtered.reduce((a, r) => a + (Number(r.qty_fail) || 0), 0);
  // Belum Diperiksa (hanya relevan jika burningInQty dimasukkan)
  const belumDiperiksa =
    burningInQty > 0 ? Math.max(0, burningInQty - (passQty + failQty)) : 0;

  const pieData =
    burningInQty > 0
      ? [
          { name: "Reject", value: failQty },
          { name: "Belum Diperiksa", value: belumDiperiksa },
        ]
      : [
          { name: "Reject", value: failQty },
        ];

  const PIE_COLORS =
    burningInQty > 0 ? [T.red, T.muted2] : [T.red];

  const barData = Object.entries(PRODUCTS).map(([id, prod]) => {
    const rs = filtered.filter((r) => r.product_id === Number(id));
    const pass = rs.reduce((a, r) => Number(a) + (Number(r.qty_pass) || 0), 0);
    const fail = rs.reduce((a, r) => Number(a) + (Number(r.qty_fail) || 0), 0);
    // Use the exact hex code from COLOR_HEX or fallback to a neutral color
    const fill = COLOR_HEX[prod.color] || T.muted2;
    return {
      name: `${prod.model} - ${prod.color}`,
      short: prod.color,
      pass,
      fail,
      fill,
    };
  });

  const ttStyle = {
    background: T.surface2,
    border: `1px solid ${T.border}`,
    borderRadius: T.r,
    color: T.text,
    fontSize: 12,
  };
  const noData = filtered.length === 0;

  return (
    <div
      className="qc-grid-2"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: 16,
        marginBottom: 18,
      }}
    >
      <Card>
        <CardHeader title="Grafik Defect" />
        <div style={{ padding: 20, height: 260 }}>
          {noData && !burningInQty ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: T.muted,
                gap: 8,
              }}
            >
              <div style={{ fontSize: 32 }}>📭</div>
              <div style={{ fontSize: 13 }}>
                Tidak ada data untuk tanggal ini
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={ttStyle} formatter={(v) => [v, "Qty"]} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ color: T.muted, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Grafik Defect (Reject) per Model"
          actions={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: T.blue, fontWeight: 700 }}>
                LIVE SYNC 🟢
              </span>
              <span style={{ fontSize: 11, color: T.muted }}>
                {selectedDate || "Semua data"} ({filtered.length})
              </span>
            </div>
          }
        />
        <div style={{ padding: 20, height: 260 }}>
          {noData ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: T.muted,
                gap: 8,
              }}
            >
              <div style={{ fontSize: 32 }}>📊</div>
              <div style={{ fontSize: 13 }}>
                Tidak ada laporan untuk tanggal ini
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barGap={6}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: T.muted,
                    fontSize: 9,
                    fontWeight: 700,
                    fontFamily: T.font,
                  }}
                  interval={0}
                  hide={false}
                />
                <YAxis tick={{ fill: T.muted, fontSize: 10 }} />
                <Tooltip
                  contentStyle={ttStyle}
                  cursor={{ fill: "rgba(255,255,255,.03)" }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ fontSize: 12 }}
                />
                <Bar
                  dataKey="fail"
                  name="Unit Gagal (Reject)"
                  radius={[4, 4, 0, 0]}
                >
                  {barData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
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
export const ReportTable = ({
  data,
  mini = false,
  canEdit,
  onDetail,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [data.length]);

  if (!data.length)
    return (
      <div style={{ padding: 32, textAlign: "center", color: T.muted }}>
        Tidak ada data
      </div>
    );

  const limit = 10;
  const totalPages = Math.ceil(data.length / limit);
  const currentData = data.slice((page - 1) * limit, page * limit);

  const fullCols = [
    "Report No",
    "Model",
    "Warna",
    "SN",
    "Batch",
    "Tgl Inspeksi",
    "Barang Masuk",
    "Produksi",
    "Fail",
    "Defect%",
    "Stasiun",
    "Status",
    "Aksi",
  ];
  const miniCols = [
    "Report No",
    "Model",
    "Warna",
    "Batch",
    "Tgl Inspeksi",
    "Barang Masuk",
    "Fail",
    "Defect%",
    "Status",
    "Aksi",
  ];
  const numCols = new Set([
    "Barang Masuk",
    "Produksi",
    "Fail",
    "Defect%",
  ]);
  const cols = mini ? miniCols : fullCols;
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {cols.map((c) => (
                <th
                  key={c}
                  style={{
                    padding: "11px 14px",
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: T.muted,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    whiteSpace: "nowrap",
                    textAlign: numCols.has(c) ? "right" : "left",
                    background: T.surface,
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((r) => {
              const rate = r.defect_rate || 0;
              const snCount = (r.serial_numbers || []).length;
              return (
                <tr
                  key={r.id}
                  style={{
                    borderBottom: `1px solid ${T.border2}`,
                    transition: "background .1s",
                  }}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        fontFamily: T.mono,
                        fontSize: 12,
                        color: T.blue,
                      }}
                    >
                      {genNo(r.id, r.created_at)}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <strong>{r.model}</strong>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <ColorTag color={r.color} />
                  </td>
                  {!mini && (
                    <td style={{ padding: "12px 14px" }}>
                      {snCount > 0 ? (
                        <Badge type="fail" style={{ fontSize: 10 }}>
                          📟 {snCount}
                        </Badge>
                      ) : (
                        <span style={{ color: T.muted2, fontSize: 11 }}>–</span>
                      )}
                    </td>
                  )}
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        fontFamily: T.mono,
                        fontSize: 12,
                        color: T.muted,
                      }}
                    >
                      {r.batch_no}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      fontSize: 12,
                      color: T.muted,
                    }}
                  >
                    {(r.inspection_date || "").slice(0, 10)}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      textAlign: "right",
                      fontFamily: T.mono,
                      color: T.blue,
                    }}
                  >
                    {r.qty_burning_in || "-"}
                  </td>
                  {!mini && (
                    <td
                      style={{
                        padding: "12px 14px",
                        textAlign: "right",
                        fontFamily: T.mono,
                      }}
                    >
                      {r.qty_produced}
                    </td>
                  )}
                  <td
                    style={{
                      padding: "12px 14px",
                      textAlign: "right",
                      fontFamily: T.mono,
                      color: T.red,
                    }}
                  >
                    {r.qty_fail}
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    <span
                      style={{
                        fontFamily: T.mono,
                        fontWeight: 700,
                        color: drColor(rate),
                      }}
                    >
                      {rate.toFixed(2)}%
                    </span>
                  </td>
                  {!mini && (
                    <td style={{ padding: "12px 14px" }}>
                      <StationBadge station={r.station} />
                    </td>
                  )}
                  <td style={{ padding: "12px 14px" }}>
                    <StatusBadge status={r.overall_status} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                        <Btn
                          variant="blue_outline"
                          size="xs"
                          onClick={() => onDetail(r.id)}
                        >
                          Detail
                        </Btn>
                      {!mini && canEdit && (
                        <Btn
                          variant="yellow_outline"
                          size="xs"
                          onClick={() => onEdit(r.id)}
                        >
                          Edit
                        </Btn>
                      )}
                      {!mini && canEdit && (
                        <Btn
                          variant="red_outline"
                          size="xs"
                          onClick={() => onDelete(r.id)}
                        >
                          Hapus
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderTop: `1px solid ${T.border}`,
            background: T.surface,
          }}
        >
          <span style={{ fontSize: 12, color: T.muted }}>
            Halaman {page} dari {totalPages}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </Btn>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </Btn>
          </div>
        </div>
      )}
    </>
  );
};

/** MatrixOrganism — variant comparison grid + stacked bar */
export const MatrixOrganism = ({ reports }) => {
  const groups = [
    {
      model: "WM1091SK",
      variants: [
        { name: "Blue", pid: 1 },
        { name: "Purple", pid: 2 },
      ],
    },
    {
      model: "WM891SK",
      variants: [
        { name: "Aqua", pid: 3 },
        { name: "Pink", pid: 4 },
      ],
    },
  ];
  const stackedData = [1, 2, 3, 4].map((pid) => {
    const rs = reports.filter((r) => r.product_id === pid);
    const prod = PRODUCTS[pid];
    return {
      name: `${prod.model} – ${prod.color}`,
      Fail: rs.filter((r) => r.overall_status === "fail").length,
    };
  });
  const ttStyle = {
    background: T.surface2,
    border: `1px solid ${T.border}`,
    borderRadius: T.r,
    color: T.text,
  };
  return (
    <>
      <div
        className="qc-grid-2"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 18,
        }}
      >
        {groups.map((g) => (
          <Card key={g.model}>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>
                📦 {g.model}
              </div>
              {g.variants.map((v, ci) => {
                const rs = reports.filter((r) => r.product_id === v.pid);
                const p = rs.filter((r) => r.overall_status === "pass").length;
                const f = rs.filter((r) => r.overall_status === "fail").length;
                const avgDR = rs.length
                  ? (
                      rs.reduce((a, r) => a + r.defect_rate, 0) / rs.length
                    ).toFixed(1)
                  : "0.0";
                const tInsp = rs.reduce((a, r) => a + (Number(r.qty_pass) || 0) + (Number(r.qty_fail) || 0), 0);
                const passRate = rs.length
                  ? Math.round((p / rs.length) * 100)
                  : 0;
                const lc = COLOR_HEX[v.name];
                return (
                  <div
                    key={v.name}
                    style={{
                      border: `1px solid ${T.border}`,
                      borderLeft: `3px solid ${lc}`,
                      borderRadius: T.r,
                      padding: 14,
                      marginTop: ci > 0 ? 10 : 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <ColorTag color={v.name} />
                      <span style={{ fontSize: 12, color: T.muted }}>
                        {rs.length} batch
                      </span>
                    </div>
                    <div
                      className="qc-kpi-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <StatMini
                        label="Total Reject"
                        value={f}
                        color={T.red}
                      />
                      <StatMini
                        label="Avg DR"
                        value={`${avgDR}%`}
                        color={drColor(Number(avgDR))}
                      />
                      <StatMini
                        label="Inspected"
                        value={tInsp.toLocaleString()}
                        color={T.blue}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader title="Grafik Defect per Varian" />
        <div style={{ padding: 20, height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stackedData}
              margin={{ top: 4, right: 8, left: 0, bottom: 28 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,.04)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: T.muted, fontSize: 12, fontFamily: T.font }}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fill: T.muted, fontSize: 12 }} />
              <Tooltip contentStyle={ttStyle} />
              <Legend wrapperStyle={{ color: T.muted, fontSize: 12 }} />
              <Bar
                dataKey="Fail"
                name="Total Reject"
                fill={T.red}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
};

/** UserGrid — user management card grid */
export const UserGrid = ({
  users,
  currentUser,
  onEdit,
  onDelete,
  onChangePw,
}) => {
  if (!users.length)
    return (
      <div style={{ textAlign: "center", color: T.muted, padding: 40 }}>
        Belum ada user
      </div>
    );
  return (
    <div
      className="qc-grid-3"
      style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}
    >
      {users.map((u) => {
        const isMe = currentUser && u.id === currentUser.id;
        return (
          <div
            key={u.id}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: T.r2,
              padding: 20,
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              {u.active ? (
                <Badge type="pass">✓ Aktif</Badge>
              ) : (
                <Badge type="fail">⛔ Nonaktif</Badge>
              )}
            </div>
            <Avatar name={u.name} role={u.role} size={42} />
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                marginTop: 10,
                marginBottom: 2,
              }}
            >
              {u.name}
              {isMe && (
                <span style={{ fontSize: 11, color: T.muted }}> (Anda)</span>
              )}
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.muted,
                fontFamily: T.mono,
                marginBottom: 8,
              }}
            >
              @{u.username}
            </div>
            <RoleBadge role={u.role} />
            <div style={{ fontSize: 11, color: T.muted2, marginTop: 6 }}>
              Dibuat:{" "}
              {u.created_at
                ? new Date(u.created_at).toLocaleDateString("id-ID")
                : "–"}
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              <Btn
                variant="blue_outline"
                size="xs"
                onClick={() => onEdit(u.id)}
              >
                ✏️ Edit
              </Btn>
              <Btn
                variant="yellow_outline"
                size="xs"
                onClick={() => onChangePw(u.id, u.name)}
              >
                🔑 Password
              </Btn>
              {!isMe && (
                <Btn
                  variant="red_outline"
                  size="xs"
                  onClick={() => onDelete(u.id)}
                >
                  🗑️
                </Btn>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** DefectPicker — sophisticated modal for selecting defect categories */
export const DefectPicker = ({ open, onClose, onSelect, value, zIndex }) => {
  const [search, setSearch] = useState("");
  const filtered = DEFECT_CATS.filter(
    (d) =>
      d.l.toLowerCase().includes(search.toLowerCase()) ||
      d.v.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (open) setSearch("");
  }, [open]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="🔎 Pilih Kategori Defect"
      maxWidth={600}
      subtitle="Cari atau pilih salah satu jenis kerusakan di bawah ini"
      zIndex={zIndex}
    >
      <div style={{ marginBottom: 20 }}>
        <TextInput
          value={search}
          onChange={setSearch}
          placeholder="Cari nama atau kode defect (contoh: DC01)..."
          style={{
            padding: "12px 16px",
            fontSize: 15,
            borderRadius: 12,
            border: `1px solid ${T.blue}`,
          }}
        />
      </div>

      <div
        className="qc-grid-2"
        style={{
          display: "grid",
          gap: 10,
          maxHeight: 400,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {filtered.map((d) => {
          const isSelected = d.v === value;
          return (
            <div
              key={d.v}
              onClick={() => {
                onSelect(d.v);
                onClose();
              }}
              style={{
                padding: "14px 16px",
                borderRadius: T.r2,
                cursor: "pointer",
                background: isSelected ? T.blueL : T.surface2,
                border: `1px solid ${isSelected ? T.blue : T.border}`,
                transition: "all .2s ease",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: isSelected ? T.blue : T.muted,
                  letterSpacing: 1,
                }}
              >
                {d.v}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: isSelected ? "#fff" : T.text,
                }}
              >
                {d.l.split(/ [–-] /)[1] || d.l}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: 40,
              color: T.muted,
            }}
          >
            Tidak ada kategori defect yang cocok.
          </div>
        )}
      </div>
    </ModalShell>
  );
};

/** ReportFormOrganism — create / edit report modal */
export const ReportFormOrganism = ({
  open,
  onClose,
  editReport,
  onSave,
  showToast,
}) => {
  const empty = () => {
    const localISO = new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000,
    ).toISOString();
    return {
      product_id: "",
      batch_no: "",
      production_date: localISO.split("T")[0],
      inspection_date: localISO.slice(0, 16),
      qty_burning_in: "",
      qty_produced: "",
      qty_pass: "",
      qty_fail: "",
      qty_rework: "",
      defect_cat: "",
      defect_loc: "",
      station: "",
      overall_status: "fail",
      notes: "",
    };
  };

  const [form, setForm] = useState(empty());
  const [snList, setSnList] = useState([]);
  const [snInput, setSnInput] = useState("");
  const [cpState, setCpState] = useState(mkCp());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [imgList, setImgList] = useState([]); // Base64 strings

  useEffect(() => {
    if (!open) return;
    if (editReport) {
      const r = editReport;
      setForm({
        product_id: r.product_id,
        batch_no: r.batch_no,
        production_date: r.production_date,
        inspection_date: r.inspection_date,
        qty_burning_in: r.qty_burning_in || "",
        qty_produced: r.qty_produced,
        qty_inspected: r.qty_inspected,
        qty_pass: r.qty_pass,
        qty_fail: r.qty_fail,
        qty_rework: r.qty_rework,
        defect_cat: r.defect_cat || "",
        defect_loc: r.defect_loc || "",
        station: r.station || "",
        overall_status: r.overall_status,
        notes: r.notes || "",
      });
      setSnList(r.serial_numbers || []);
      setCpState(r.checkpoints || mkCp());
      setImgList(r.images || []);
    } else {
      setForm(empty());
      setSnList([]);
      setCpState(mkCp());
      setImgList([]);
    }
    setSnInput("");
    setPickerOpen(false);
  }, [open, editReport]);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updateCp = (i, key, val) =>
    setCpState((s) =>
      s.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)),
    );
  const addSN = () => {
    const val = snInput.trim().toUpperCase();
    if (!val) return;
    if (snList.includes(val)) {
      showToast("SN sudah ada!", "err");
      return;
    }
    setSnList((s) => [...s, val]);
    setSnInput("");
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (imgList.length + files.length > 5) {
      showToast("Maksimal 5 foto per laporan!", "err");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImgList((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSave = () => {
    if (!form.product_id || !form.batch_no) {
      showToast("Produk dan Batch wajib diisi!", "err");
      return;
    }
    const prod = PRODUCTS[form.product_id];
    const qty_fail = snList.length;
    const qty_inspected = qty_fail;
    const defect_rate = qty_inspected
      ? +((qty_fail / qty_inspected) * 100).toFixed(2)
      : 0;

    onSave({
      ...(editReport
        ? { id: editReport.id, created_at: editReport.created_at }
        : { created_at: new Date().toISOString() }),
      product_id: Number(form.product_id),
      model: prod.model,
      color: prod.color,
      batch_no: form.batch_no,
      production_date: form.production_date,
      inspection_date: form.inspection_date,
      qty_burning_in: Number(form.qty_burning_in) || 0,
      qty_produced: Number(form.qty_produced) || 0,
      qty_inspected,
      qty_pass: 0,
      qty_fail,
      qty_rework: Number(form.qty_rework) || 0,
      defect_rate,
      defect_cat: form.defect_cat,
      defect_loc: form.defect_loc,
      station: form.station,
      overall_status: form.overall_status,
      notes: form.notes,
      serial_numbers: [...snList],
      images: [...imgList],
      checkpoints: cpState.map((c) => ({ ...c })),
    });
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={editReport ? "✏️ Edit Laporan QC" : "+ Laporan QC Baru"}
      maxWidth={840}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Batal
          </Btn>
          <Btn variant="success" onClick={handleSave}>
            💾 Simpan Laporan
          </Btn>
        </>
      }
      modalExtra={
        <DefectPicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          value={form.defect_cat}
          onSelect={(v) => setF("defect_cat", v)}
          zIndex={500}
        />
      }
    >
      <SectionHeader icon="📟" first>
        Serial Number Unit Reject
      </SectionHeader>
      <div
        style={{
          background: "rgba(47,129,247,.06)",
          border: "1px dashed rgba(47,129,247,.3)",
          borderRadius: T.r2,
          padding: 14,
        }}
      >
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: T.blue,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            marginBottom: 8,
          }}
        >
          Scan atau ketik SN unit REJECT
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <TextInput
            value={snInput}
            onChange={setSnInput}
            placeholder="Scan barcode / ketik SN lalu Enter…"
            style={{ flex: 1 }}
          />
          <Btn variant="primary" size="sm" onClick={addSN}>
            + Tambah
          </Btn>
        </div>
        {snList.length > 0 && (
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}
          >
            {snList.map((sn) => (
              <SNChip
                key={sn}
                sn={sn}
                onRemove={() => setSnList((s) => s.filter((x) => x !== sn))}
              />
            ))}
          </div>
        )}
        <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>
          Total:{" "}
          <span style={{ fontWeight: 700, color: T.red }}>{snList.length}</span>{" "}
          SN
        </div>
      </div>

      <SectionHeader icon="📸">Foto Defect</SectionHeader>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <label
          style={{
            width: 100,
            height: 100,
            background: T.bg,
            border: `2px dashed ${T.border}`,
            borderRadius: T.r2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => (e.target.style.borderColor = T.blue)}
          onMouseLeave={(e) => (e.target.style.borderColor = T.border)}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImages}
            style={{ display: "none" }}
          />
          <span style={{ fontSize: 24, marginBottom: 4 }}>📷</span>
          <span style={{ fontSize: 10, color: T.muted }}>Unggah Foto</span>
        </label>
        {imgList.map((img, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              width: 100,
              height: 100,
              borderRadius: T.r2,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
            }}
          >
            <img
              src={img}
              alt="Defect"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              onClick={() => setImgList((prev) => prev.filter((_, idx) => idx !== i))}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "rgba(248,81,73,.8)",
                border: "none",
                color: "#fff",
                fontSize: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>


      <SectionHeader icon="📦">Informasi Produk & Batch</SectionHeader>
      <div
        className="qc-grid-2"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div>
          <FieldLabel>Produk & Warna *</FieldLabel>
          <SelectInput
            value={form.product_id}
            onChange={(v) => setF("product_id", v)}
          >
            <option value="">— Pilih Produk —</option>
            <optgroup label="WM1091SK">
              <option value="1">WM1091SK – Blue</option>
              <option value="2">WM1091SK – Purple</option>
            </optgroup>
            <optgroup label="WM891SK">
              <option value="3">WM891SK – Aqua</option>
              <option value="4">WM891SK – Pink</option>
            </optgroup>
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Batch No *</FieldLabel>
          <TextInput
            value={form.batch_no}
            onChange={(v) => setF("batch_no", v)}
            placeholder="B-WM1091-0001"
          />
        </div>
        <div>
          <FieldLabel>Tanggal & Waktu Inspeksi *</FieldLabel>
          <TextInput
            type="datetime-local"
            value={form.inspection_date}
            onChange={(v) => setF("inspection_date", v)}
          />
        </div>
        <div>
          <FieldLabel>Tanggal Produksi *</FieldLabel>
          <TextInput
            type="date"
            value={form.production_date}
            onChange={(v) => setF("production_date", v)}
          />
        </div>
      </div>

      <SectionHeader icon="🔎">Jenis Defect</SectionHeader>
      <div
        className="qc-grid-2"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
      >
        <div>
          <FieldLabel>Kategori Defect</FieldLabel>
          <div
            onClick={() => setPickerOpen(true)}
            style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: T.r,
              padding: "9px 12px",
              fontSize: 13.5,
              color: form.defect_cat ? T.text : T.muted,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {DEFECT_CATS.find((d) => d.v === form.defect_cat)?.l ||
              "— Pilih Kategori —"}
            <span style={{ fontSize: 10 }}>▼</span>
          </div>
        </div>
        <div>
          <FieldLabel>Lokasi Defect</FieldLabel>
          <TextInput
            value={form.defect_loc}
            onChange={(v) => setF("defect_loc", v)}
            placeholder="Top panel, Door frame…"
          />
        </div>
        <div>
          <FieldLabel>Stasiun *</FieldLabel>
          <SelectInput
            value={form.station}
            onChange={(v) => setF("station", v)}
          >
            <option value="">— Pilih Stasiun —</option>
            <option value="Repair">🔧 Repair</option>
            <option value="QA">🔬 QA</option>
            <option value="Assembly">⚙️ Assembly</option>
          </SelectInput>
        </div>
      </div>

      <SectionHeader icon="📝">Catatan</SectionHeader>
      <TextareaInput
        value={form.notes}
        onChange={(v) => setF("notes", v)}
        placeholder="Catatan tambahan inspeksi…"
      />
    </ModalShell>
  );
};

/** DetailModal — read-only report detail */
export const DetailModal = ({ open, onClose, report, canEdit, onEdit }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!report) return null;
  const rate = report.defect_rate || 0;
  return (
    <>
      <ModalShell
        open={open}
        onClose={onClose}
        title={genNo(report.id, report.created_at)}
        subtitle={`${report.batch_no} · ${(report.inspection_date || "").substring(0, 16)}`}
        maxWidth={880}
        headerExtra={<StatusBadge status={report.overall_status} />}
        footer={
          <>
            <Btn variant="ghost" onClick={onClose}>
              Tutup
            </Btn>
            {canEdit && (
              <Btn
                variant="yellow_outline"
                onClick={() => {
                  onClose();
                  onEdit(report.id);
                }}
              >
                ✏️ Edit
              </Btn>
            )}
          </>
        }
      >
        {/* KPIs & Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 20 }}>
          <div 
            style={{ 
              background: T.surface2, 
              border: `1px solid ${T.border}`, 
              borderRadius: T.r2, 
              padding: 16,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12
            }}
          >
            {[
              { l: "Batch No", v: report.batch_no, icon: "📦" },
              { l: "Inspector", v: report.inspector || "Admin", icon: "👤" },
              { l: "Tgl Inspeksi", v: (report.inspection_date || "").replace("T", " "), icon: "📅" },
              { l: "Tgl Produksi", v: report.production_date, icon: "🏭" },
              { l: "Model", v: report.model, icon: "⚙️" },
              { l: "Warna", v: <ColorTag color={report.color} />, icon: "🎨" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 16, opacity: 0.6 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase" }}>{item.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{item.v}</div>
                </div>
              </div>
            ))}
          </div>

          <div 
            style={{ 
              background: T.surface2, 
              border: `1px solid ${T.border}`, 
              borderRadius: T.r2, 
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, padding: 8 }}>
              <StatusBadge status={report.overall_status} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginBottom: 4 }}>QC PASS RATE</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: rate > 98 ? T.green : rate > 95 ? T.yellow : T.red }}>
              {(100 - rate).toFixed(1)}%
            </div>
            <div style={{ height: 6, background: T.border, borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
               <div style={{ width: `${100 - rate}%`, height: "100%", background: rate > 5 ? T.red : T.green, transition: "width 1s ease" }} />
            </div>
            <div style={{ fontSize: 10, color: T.muted, marginTop: 8 }}>
              Reject Rate: <span style={{ color: T.red, fontWeight: 700 }}>{rate}%</span>
            </div>
          </div>
        </div>

        {/* Qty KPIs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: 12,
            marginBottom: 20
          }}
        >
          {[
            ["Total Diperiksa", report.qty_inspected, T.blue],
            ["Reject", report.qty_fail, T.red],
            ["Rework", report.qty_rework, T.yellow],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: "12px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Defect Details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: 16 }}>
            <SectionHeader icon="🔎" first style={{ marginBottom: 12 }}>Detail Defect</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: T.muted }}>Kategori:</span>
                <span style={{ fontWeight: 600 }}>{DEFECT_CATS.find(d => d.v === report.defect_cat)?.l || report.defect_cat || "–"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: T.muted }}>Lokasi:</span>
                <span style={{ fontWeight: 600 }}>{report.defect_loc || "–"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: T.muted }}>Stasiun:</span>
                <span style={{ fontWeight: 600 }}>{report.station || "–"}</span>
              </div>
            </div>
          </div>
          <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: 16 }}>
            <SectionHeader icon="📝" first style={{ marginBottom: 12 }}>Catatan</SectionHeader>
            <div style={{ fontSize: 13, color: report.notes ? T.text : T.muted, fontStyle: report.notes ? "normal" : "italic" }}>
              {report.notes || "Tidak ada catatan."}
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        {report.images && report.images.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionHeader icon="📸">Foto Defect</SectionHeader>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {report.images.map((img, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: 140, 
                    height: 140, 
                    borderRadius: T.r2, 
                    overflow: "hidden", 
                    border: `1px solid ${T.border}`,
                    cursor: "pointer",
                    transition: "transform .2s"
                  }}
                  onClick={() => setPreviewUrl(img)}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <img src={img} alt="Defect" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SN List */}
        <SectionHeader icon="📟">Serial Numbers ({report.serial_numbers?.length || 0})</SectionHeader>
        <div 
          style={{ 
            background: T.surface2, 
            border: `1px solid ${T.border}`, 
            borderRadius: T.r2, 
            padding: 12,
            display: "flex",
            flexWrap: "wrap",
            gap: 6
          }}
        >
          {report.serial_numbers?.map(sn => (
            <div key={sn} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 8px", fontSize: 12, fontFamily: T.mono }}>
              {sn}
            </div>
          ))}
        </div>
      </ModalShell>

      {/* ── Image Preview Overlay ── */}
      {previewUrl && (
        <div 
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
            zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
            padding: 40, animation: "slideUp 0.3s ease-out"
          }}
          onClick={() => setPreviewUrl(null)}
        >
          <div style={{ position: "absolute", top: 20, right: 20 }}>
            <Btn variant="ghost" style={{ borderRadius: "50%", padding: 12 }} onClick={() => setPreviewUrl(null)}>✕</Btn>
          </div>
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ 
              maxWidth: "100%", maxHeight: "100%", 
              borderRadius: T.r2, boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              border: `2px solid ${T.border}`
            }} 
            onClick={e => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
};


/** UserFormOrganism — create / edit user modal */
export const UserFormOrganism = ({
  open,
  onClose,
  editUser,
  onSave,
  users,
  showToast,
}) => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    role: "operator",
    active: "1",
    password: "",
    password2: "",
  });
  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!open) return;
    editUser
      ? setForm({
          name: editUser.name,
          username: editUser.username,
          role: editUser.role,
          active: editUser.active ? "1" : "0",
          password: "",
          password2: "",
        })
      : setForm({
          name: "",
          username: "",
          role: "operator",
          active: "1",
          password: "",
          password2: "",
        });
  }, [open, editUser]);

  const handleSave = () => {
    if (!form.name || !form.username) {
      showToast("Nama dan Username wajib diisi!", "err");
      return;
    }
    if (!editUser && !form.password) {
      showToast("Password wajib untuk user baru!", "err");
      return;
    }
    if (form.password && form.password !== form.password2) {
      showToast("Konfirmasi password tidak cocok!", "err");
      return;
    }
    if (
      form.password &&
      (form.password.length < 8 ||
        !/[a-zA-Z]/.test(form.password) ||
        !/[0-9]/.test(form.password))
    ) {
      showToast("Password min 8 char dgn huruf & angka!", "err");
      return;
    }
    const dup = users.find(
      (u) =>
        u.username === form.username.toLowerCase() && u.id !== editUser?.id,
    );
    if (dup) {
      showToast("Username sudah digunakan!", "err");
      return;
    }
    onSave({
      ...(editUser || {}),
      name: form.name,
      username: form.username.toLowerCase(),
      role: form.role,
      active: form.active === "1",
      password: form.password || editUser?.password || "",
      created_at: editUser?.created_at || new Date().toISOString(),
    });
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={editUser ? "✏️ Edit User" : "+ Tambah User Baru"}
      maxWidth={480}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Batal
          </Btn>
          <Btn variant="success" onClick={handleSave}>
            💾 Simpan
          </Btn>
        </>
      }
    >
      <SectionHeader first>Informasi Akun</SectionHeader>
      <div
        className="qc-grid-2"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
      >
        <div>
          <FieldLabel>Nama Lengkap *</FieldLabel>
          <TextInput
            value={form.name}
            onChange={(v) => setF("name", v)}
            placeholder="Nama lengkap…"
          />
        </div>
        <div>
          <FieldLabel>Username *</FieldLabel>
          <TextInput
            value={form.username}
            onChange={(v) => setF("username", v)}
            placeholder="tanpa spasi…"
          />
        </div>
        <div>
          <FieldLabel>Role *</FieldLabel>
          <SelectInput value={form.role} onChange={(v) => setF("role", v)}>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <SelectInput value={form.active} onChange={(v) => setF("active", v)}>
            <option value="1">✅ Aktif</option>
            <option value="0">⛔ Nonaktif</option>
          </SelectInput>
        </div>
      </div>
      <SectionHeader>
        {editUser
          ? "Ganti Password (kosongkan jika tidak berubah)"
          : "Password"}
      </SectionHeader>
      <div
        className="qc-grid-2"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
      >
        <div>
          <FieldLabel>Password *</FieldLabel>
          <TextInput
            type="password"
            value={form.password}
            onChange={(v) => setF("password", v)}
            placeholder="Min 8 char huruf & angka…"
          />
        </div>
        <div>
          <FieldLabel>Konfirmasi *</FieldLabel>
          <TextInput
            type="password"
            value={form.password2}
            onChange={(v) => setF("password2", v)}
            placeholder="Ulangi password…"
          />
        </div>
      </div>
      <div
        style={{
          background: T.blueL,
          border: "1px solid rgba(47,129,247,.2)",
          borderRadius: T.r,
          padding: "10px 14px",
          fontSize: 12,
          color: T.blue,
          marginTop: 8,
        }}
      >
        ℹ️ <strong>Admin</strong> = akses penuh + kelola user ·{" "}
        <strong>Operator</strong> = buat & edit laporan ·{" "}
        <strong>Viewer</strong> = hanya lihat
      </div>
    </ModalShell>
  );
};

/** ChangePwOrganism — change password for target user */
export const ChangePwOrganism = ({
  open,
  onClose,
  targetUser,
  onSave,
  showToast,
}) => {
  const [pw, setPw] = useState("");
  const [conf, setConf] = useState("");
  useEffect(() => {
    if (open) {
      setPw("");
      setConf("");
    }
  }, [open]);
  const handle = () => {
    if (!pw || pw.length < 8 || !/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) {
      showToast("Password min 8 char dgn huruf & angka!", "err");
      return;
    }
    if (pw !== conf) {
      showToast("Konfirmasi tidak cocok!", "err");
      return;
    }
    onSave(pw);
  };
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="🔑 Ganti Password"
      maxWidth={480}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Batal
          </Btn>
          <Btn variant="primary" onClick={handle}>
            🔑 Simpan Password
          </Btn>
        </>
      }
    >
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>
        Mengganti password untuk:{" "}
        <strong style={{ color: T.text }}>{targetUser?.name}</strong>
      </div>
      <div style={{ marginBottom: 12 }}>
        <FieldLabel>Password Baru *</FieldLabel>
        <TextInput
          type="password"
          value={pw}
          onChange={setPw}
          placeholder="Min 8 char huruf & angka…"
        />
      </div>
      <div>
        <FieldLabel>Konfirmasi *</FieldLabel>
        <TextInput
          type="password"
          value={conf}
          onChange={setConf}
          placeholder="Ulangi password baru…"
        />
      </div>
    </ModalShell>
  );
};
