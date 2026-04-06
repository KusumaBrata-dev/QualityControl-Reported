import React, { useState } from "react";
import { T, genNo } from "../qcConstants";
import { DEFECT_CATS } from "../../../firebase";
import {
  Btn,
  TextInput,
  SelectInput,
  Card,
  CardHeader,
  DatePicker,
} from "./Atoms";
import { FilterField } from "./Molecules";
import {
  DashboardKPIs,
  DashboardCharts,
  ReportTable,
  MatrixOrganism,
  UserGrid,
} from "./Organisms";

/** DashboardTemplate */
export const DashboardTemplate = ({
  reports,
  canEdit,
  dailyProd,
  isDark = true,
  onSaveDailyProd,
  onDetail,
  onEdit,
  onDelete,
  onNewReport,
  onOpenScanner,
  selectedDate,
  onDateChange,
}) => {
  const [burningInQty, setBurningInQty] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [filterOpen, setFilterOpen] = React.useState(false);

  const serverQty = dailyProd[selectedDate] || 0;

  const categoryFilteredReports = selectedCategory
    ? reports.filter((r) => r.defect_cat === selectedCategory)
    : reports;

  const todayReports = categoryFilteredReports.filter((r) => {
    if (!selectedDate) return true;
    const rDate = String(r.inspection_date || "").slice(0, 10);
    const sDate = String(selectedDate).slice(0, 10);
    return rDate === sDate;
  });

  const activeDates = Array.from(
    new Set([
      ...reports.map((r) => r.inspection_date?.slice(0, 10)),
      ...Object.keys(dailyProd).filter((k) => dailyProd[k] > 0),
    ]),
  )
    .filter(Boolean)
    .sort()
    .reverse();

  const totFail = todayReports.reduce(
    (a, r) => a + (Number(r.qty_fail) || 0),
    0,
  );
  const totalReports = todayReports.length;

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* ── Mobile Hero Header ── */}
      <div
        className="anim-fade-up"
        style={{
          borderRadius: 16,
          padding: "20px 16px 16px",
          marginBottom: 14,
          position: "relative",
          overflow: "hidden",
          border: isDark
            ? "1px solid rgba(47,129,247,0.18)"
            : "1px solid rgba(47,129,247,0.25)",
          background: isDark
            ? "linear-gradient(135deg, #0D1117 0%, #1C2330 60%, #1a1f35 100%)"
            : "linear-gradient(135deg, #EBF4FF 0%, #F0F7FF 60%, #F5EEFF 100%)",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "-10%",
            width: 250,
            height: 250,
            background: `radial-gradient(circle, ${isDark ? "rgba(47,129,247,0.12)" : "rgba(47,129,247,0.08)"} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* Scan line animation */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(47,129,247,0.5), transparent)",
            animation: "scanLine 3s linear infinite",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Top row: status badge + date */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: totFail > 0 ? "#F85149" : "#3FB950",
                  animation: "pulseRing 2s infinite",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: totFail > 0 ? "#F85149" : "#3FB950",
                  fontFamily: "'IBM Plex Mono', monospace",
                  letterSpacing: 1,
                }}
              >
                {totFail > 0 ? `⚠ ${totFail} DEFECT` : "✓ ALL CLEAR"}
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                color: isDark ? "rgba(125,133,144,0.8)" : "rgba(80,90,110,0.8)",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {selectedDate || "ALL DATES"}
            </span>
          </div>

          {/* Main stats row */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: isDark ? "rgba(125,133,144,0.7)" : "rgba(60,80,110,0.7)",
                marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>
                Total Laporan
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: isDark ? "#E6EDF3" : "#1c2a3a",
                lineHeight: 1, fontFamily: "'IBM Plex Mono', monospace" }}>
                {String(totalReports).padStart(2, "0")}
              </div>
            </div>
          </div>


          {/* Filter toggle button */}
          <button
            onClick={() => setFilterOpen((f) => !f)}
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(47,129,247,0.12)",
              border: "1px solid rgba(47,129,247,0.25)",
              borderRadius: 20,
              padding: "5px 12px",
              color: "#2F81F7",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            {filterOpen ? "Tutup Filter" : "Filter & Input"}
            <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.7 }}>
              {filterOpen ? "▲" : "▼"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Floating Filter Panel ── */}
      <div style={{ position: "relative" }}>
      {filterOpen && (
        <div
          className="anim-scale-in"
          style={{
            position: "absolute",
            top: 8,
            left: 0,
            right: 0,
            zIndex: 200,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          }}
        >
          {/* Section: Filter Tanggal & Kategori */}
          <div style={{ padding: "12px 14px" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.muted,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 10,
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              📅 Filter Data
            </div>

            {/* Date picker — full width row */}
            <div style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  color: T.muted,
                  fontWeight: 600,
                  marginBottom: 5,
                }}
              >
                Tanggal:
              </div>
              <DatePicker
                value={selectedDate}
                onChange={onDateChange}
                activeDates={activeDates}
              />
            </div>

            {/* Category selector — full width row */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: T.muted,
                  fontWeight: 600,
                  marginBottom: 5,
                }}
              >
                Kategori Defect:
              </div>
              <SelectInput
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e)}
                style={{ width: "100%", fontSize: 12 }}
              >
                <option value="">Semua Kategori</option>
                {DEFECT_CATS.map((c) => (
                  <option key={c.v} value={c.v}>
                    {c.v}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>

          {/* Section: Input Barang Masuk — visually separated */}
          {canEdit && (
            <div
              style={{
                borderTop: `2px dashed ${T.border}`,
                padding: "12px 14px",
                background: T.surface2,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 10,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                📦 Input Barang Masuk
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <TextInput
                  type="number"
                  value={burningInQty}
                  onChange={setBurningInQty}
                  placeholder="Masukkan jumlah qty..."
                  style={{ flex: 1, fontSize: 13 }}
                />
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onSaveDailyProd(selectedDate, burningInQty);
                    setBurningInQty("");
                    setFilterOpen(false);
                  }}
                >
                  💾 Simpan
                </Btn>
              </div>
              <div style={{ fontSize: 10, color: T.muted2, marginTop: 5 }}>
                Untuk tanggal:{" "}
                <strong style={{ color: T.blue }}>
                  {selectedDate || "belum dipilih"}
                </strong>
              </div>
            </div>
          )}
        </div>
      )}
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ marginTop: filterOpen ? 14 : 0, transition: "margin-top 0.3s" }}>
      <DashboardKPIs reports={todayReports} burningInQty={serverQty} />


      {/* ── Charts ── */}
      <DashboardCharts
        reports={categoryFilteredReports}
        selectedDate={selectedDate}
        burningInQty={serverQty}
      />

      {/* ── Recent Reports Card ── */}
      <Card>
        <CardHeader
          title={`📋 Laporan — ${selectedDate || "Semua Tanggal"}`}
          actions={
            canEdit && (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn variant="blue_outline" size="sm" onClick={onOpenScanner}>
                  📷
                </Btn>
                <Btn variant="primary" size="sm" onClick={onNewReport}>
                  + Baru
                </Btn>
              </div>
            )
          }
        />
        {todayReports.length === 0 ? (
          <div
            className="anim-fade-up"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "36px 24px",
              color: T.muted,
              gap: 10,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: T.surface2,
                border: `1px dashed ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                opacity: 0.6,
              }}
            >
              📋
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>
              Belum ada laporan
            </div>
            <div style={{ fontSize: 12, textAlign: "center" }}>
              Laporan pada{" "}
              <strong style={{ color: T.blue }}>{selectedDate}</strong> akan
              muncul di sini
            </div>
            {canEdit && (
              <Btn
                variant="primary"
                size="sm"
                onClick={onNewReport}
                style={{ marginTop: 4 }}
              >
                + Buat Laporan Baru
              </Btn>
            )}
          </div>
        ) : (
          <ReportTable
            data={todayReports}
            mini
            canEdit={canEdit}
            onDetail={onDetail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </Card>
      </div>
    </div>
  );
};


/** ReportsTemplate — with filter bar */
export const ReportsTemplate = ({
  reports,
  canEdit,
  onDetail,
  onEdit,
  onDelete,
  onNewReport,
  onOpenScanner,
  date,
  onDateChange,
  onExport,
  onImport,
}) => {
  const [search, setSearch] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [status, setStatus] = useState("");

  const colorOpts =
    model.startsWith("WM1091")
      ? ["Blue", "Purple"]
      : model.startsWith("WM891")
        ? ["Aqua", "Pink"]
        : ["Blue", "Purple", "Aqua", "Pink"];

  const filtered = reports.filter((r) => {
    if (model && !r.model?.startsWith(model)) return false;
    if (color && r.color !== color) return false;
    if (status && r.overall_status !== status) return false;
    if (date && !r.inspection_date.startsWith(date)) return false;
    if (search) {
      const sns = (r.serial_numbers || []).join(" ");
      const s =
        `${genNo(r.id, r.created_at)} ${r.batch_no} ${r.model} ${r.color} ${sns}`.toLowerCase();
      if (!s.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  const reset = () => {
    setSearch("");
    setModel("");
    setColor("");
    setStatus("");
    onDateChange(todayStr);
  };

  return (
    <div>
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: T.r2,
          padding: "12px 14px",
          marginBottom: 14,
        }}
      >
        {/* 2-col grid on mobile, 6-col on desktop */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
        }}>
          {/* Search — full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <FilterField label="🔍 Cari">
              <TextInput
                value={search}
                onChange={setSearch}
                placeholder="Batch / Report No / SN…"
              />
            </FilterField>
          </div>
          <FilterField label="Model">
            <SelectInput
              value={model}
              onChange={(v) => {
                setModel(v);
                setColor("");
              }}
            >
              <option value="">Semua Model</option>
              <option>WM1091</option>
              <option>WM891</option>
            </SelectInput>
          </FilterField>
          <FilterField label="Warna">
            <SelectInput value={color} onChange={setColor}>
              <option value="">Semua Warna</option>
              {colorOpts.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectInput>
          </FilterField>
          <FilterField label="Status">
            <SelectInput value={status} onChange={setStatus}>
              <option value="">Semua</option>
              <option value="fail">❌ Reject</option>
            </SelectInput>
          </FilterField>
          <FilterField label="Tanggal">
            <TextInput type="date" value={date} onChange={onDateChange} />
          </FilterField>
          {/* Reset full width */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Btn variant="ghost" size="sm" onClick={reset} style={{ width: "100%" }}>
              🔄 Reset Filter
            </Btn>
          </div>
        </div>
        {/* ── Info row ── */}
        <div style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${T.border}`,
          fontSize: 12,
          color: T.muted,
        }}>
          Menampilkan <strong style={{ color: T.text }}>{filtered.length}</strong> dari{" "}
          <strong style={{ color: T.text }}>{reports.length}</strong> laporan
        </div>

        {/* ── Action buttons ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
          marginTop: 8,
        }}>
          {/* hidden import file input */}
          {canEdit && (
            <input
              type="file" accept=".xlsx"
              style={{ display: "none" }} id="excel-import"
              onChange={(e) => {
                if (e.target.files?.length > 0) { onImport(e.target.files[0]); e.target.value = ""; }
              }}
            />
          )}

          {/* Export */}
          <button onClick={() => onExport(filtered)} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "8px 12px", background: "transparent",
            border: `1px solid ${T.border}`, borderRadius: 8,
            color: T.blue, fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: T.font, whiteSpace: "nowrap",
          }}>
            📥 Export
          </button>

          {canEdit && (
            <>
              {/* Import */}
              <button onClick={() => document.getElementById("excel-import")?.click()} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "8px 12px", background: "transparent",
                border: `1px solid ${T.border}`, borderRadius: 8,
                color: T.blue, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: T.font, whiteSpace: "nowrap",
              }}>
                📤 Import
              </button>

              {/* + Laporan Baru */}
              <button onClick={onNewReport} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "8px 14px", marginLeft: "auto",
                background: `linear-gradient(135deg, ${T.blueD}, ${T.blue})`,
                border: "none", borderRadius: 8,
                color: "#fff", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: T.font, whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(47,129,247,0.35)",
              }}>
                + Laporan Baru
              </button>
            </>
          )}
        </div>
      </div>
      <Card>
        <ReportTable
          data={filtered}
          mini={false}
          canEdit={canEdit}
          onDetail={onDetail}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    </div>
  );
};

/** MatrixTemplate */
export const MatrixTemplate = ({ reports, selectedDate, onDateChange }) => {
  const filtered = selectedDate
    ? reports.filter((r) => (r.inspection_date || "").startsWith(selectedDate))
    : reports;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: T.surface,
            padding: "8px 16px",
            borderRadius: T.r2,
            border: `1px solid ${T.border}`,
          }}
        >
          <span style={{ fontSize: 13, color: T.muted }}>Filter Hari:</span>
          <input
            type="date"
            value={selectedDate || ""}
            onChange={(e) => onDateChange(e.target.value)}
            style={{
              background: T.surface2,
              border: `1px solid ${T.border}`,
              borderRadius: T.r,
              color: T.text,
              fontSize: 13,
              padding: "6px 10px",
              outline: "none",
              cursor: "pointer",
            }}
          />
          <Btn variant="ghost" size="sm" onClick={() => onDateChange("")}>
            Semua Data
          </Btn>
        </div>
      </div>
      <MatrixOrganism reports={filtered} />
    </div>
  );
};

/** UsersTemplate */
export const UsersTemplate = ({
  users,
  currentUser,
  onAddUser,
  onEdit,
  onDelete,
  onChangePw,
}) => (
  <div>
    <div
      className="qc-flex-col-mobile"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>👥 Kelola Akun User</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
          Tambah, edit, dan hapus akun pengguna
        </div>
      </div>
      <Btn variant="primary" onClick={onAddUser}>
        + Tambah User
      </Btn>
    </div>
    <UserGrid
      users={users}
      currentUser={currentUser}
      onEdit={onEdit}
      onDelete={onDelete}
      onChangePw={onChangePw}
    />
  </div>
);
