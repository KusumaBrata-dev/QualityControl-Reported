import React, { useState } from "react";
import { T, genNo } from "../qcConstants";
import { Btn, TextInput, SelectInput, Card, CardHeader, DatePicker } from "./Atoms";
import { FilterField } from "./Molecules";
import { DashboardKPIs, DashboardCharts, ReportTable, MatrixOrganism, UserGrid } from "./Organisms";

/** DashboardTemplate */
export const DashboardTemplate = ({ reports, canEdit, dailyProd, onSaveDailyProd, onDetail, onEdit, onDelete, onNewReport, selectedDate, onDateChange }) => {
  const [burningInQty, setBurningInQty] = React.useState("");

  const serverQty = dailyProd[selectedDate] || 0;
  const todayReports = reports.filter(r => {
    if (!selectedDate) return true;
    const rDate = String(r.inspection_date || "").slice(0, 10);
    const sDate = String(selectedDate).slice(0, 10);
    return rDate === sDate;
  });
  const activeDates = Array.from(new Set([...reports.map(r => r.inspection_date?.slice(0,10)), ...Object.keys(dailyProd).filter(k => dailyProd[k] > 0)])).filter(Boolean).sort().reverse();

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: T.surface, padding: "12px 16px", borderRadius: T.r2, border: `1px solid ${T.border}`, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: T.muted }}>Filter Hari:</span>
            <DatePicker value={selectedDate} onChange={onDateChange} activeDates={activeDates} />
          </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: T.muted }}>Barang Masuk:</span>
          <TextInput type="number" value={burningInQty} onChange={setBurningInQty} placeholder="+ Tambah Qty..." style={{ width: 125 }} />
          {canEdit && <Btn variant="primary" size="sm" onClick={() => { onSaveDailyProd(selectedDate, burningInQty); setBurningInQty(""); }}>Simpan</Btn>}
        </div>
      </div>

      <DashboardKPIs reports={todayReports} burningInQty={serverQty} />
      <DashboardCharts reports={reports} selectedDate={selectedDate} burningInQty={serverQty} />
      <Card>
        <CardHeader
          title={`Laporan QC Terbaru — ${selectedDate || "Semua Tanggal"}`}
          actions={canEdit && <Btn variant="primary" size="sm" onClick={onNewReport}>+ Laporan Baru</Btn>}
        />
        {todayReports.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", color: T.muted, gap: 12 }}>
            <div style={{ fontSize: 42, opacity: 0.5 }}>📋</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Belum ada laporan pada tanggal ini</div>
            <div style={{ fontSize: 13 }}>Laporan QC yang dibuat pada tanggal <strong style={{ color: T.text }}>{selectedDate}</strong> akan muncul di sini.</div>
            {canEdit && <Btn variant="primary" size="sm" onClick={onNewReport} style={{ marginTop: 4 }}>+ Buat Laporan Baru</Btn>}
          </div>
        ) : (
          <ReportTable data={todayReports} mini canEdit={canEdit} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
        )}
      </Card>
    </div>
  );
};

/** ReportsTemplate — with filter bar */
export const ReportsTemplate = ({ reports, canEdit, onDetail, onEdit, onDelete, onNewReport, date, onDateChange }) => {
  const [search, setSearch] = useState("");
  const [model,  setModel]  = useState("");
  const [color,  setColor]  = useState("");
  const [status, setStatus] = useState("");

  const colorOpts = model === "WM1091SK" ? ["Blue","Purple"] : model === "WM891SK" ? ["Aqua","Pink"] : ["Blue","Purple","Aqua","Pink"];

  const filtered = reports.filter(r => {
    if (model  && r.model !== model)                    return false;
    if (color  && r.color !== color)                    return false;
    if (status && r.overall_status !== status)          return false;
    if (date   && !r.inspection_date.startsWith(date)) return false;
    if (search) {
      const sns = (r.serial_numbers || []).join(" ");
      const s = `${genNo(r.id, r.created_at)} ${r.batch_no} ${r.model} ${r.color} ${sns}`.toLowerCase();
      if (!s.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const reset = () => { setSearch(""); setModel(""); setColor(""); setStatus(""); setDate(todayStr); };

  return (
    <div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.r2, padding: "16px 20px", marginBottom: 16 }}>
        <div className="qc-grid-auto" style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1.2fr auto", gap: 10, alignItems: "end" }}>
          <FilterField label="🔍 Cari"><TextInput value={search} onChange={setSearch} placeholder="Batch / Report No / SN…" /></FilterField>
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
              <option value="fail">❌ Reject</option>
            </SelectInput>
          </FilterField>
          <FilterField label="Tanggal"><TextInput type="date" value={date} onChange={onDateChange} /></FilterField>
          <Btn variant="ghost" size="sm" onClick={() => { reset(); onDateChange(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)); }}>Reset</Btn>
        </div>
        <div className="qc-flex-col-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
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
export const MatrixTemplate = ({ reports, selectedDate, onDateChange }) => {

  const filtered = selectedDate ? reports.filter(r => (r.inspection_date || "").startsWith(selectedDate)) : reports;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: T.surface, padding: "8px 16px", borderRadius: T.r2, border: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 13, color: T.muted }}>Filter Hari:</span>
          <input type="date" value={selectedDate || ""} onChange={e => onDateChange(e.target.value)} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.r, color: T.text, fontSize: 13, padding: "6px 10px", outline: "none", cursor: "pointer" }} />
          <Btn variant="ghost" size="sm" onClick={() => onDateChange("")}>Semua Data</Btn>
        </div>
      </div>
      <MatrixOrganism reports={filtered} />
    </div>
  );
};

/** UsersTemplate */
export const UsersTemplate = ({ users, currentUser, onAddUser, onEdit, onDelete, onChangePw }) => (
  <div>
    <div className="qc-flex-col-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>👥 Kelola Akun User</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Tambah, edit, dan hapus akun pengguna</div>
      </div>
      <Btn variant="primary" onClick={onAddUser}>+ Tambah User</Btn>
    </div>
    <UserGrid users={users} currentUser={currentUser} onEdit={onEdit} onDelete={onDelete} onChangePw={onChangePw} />
  </div>
);
