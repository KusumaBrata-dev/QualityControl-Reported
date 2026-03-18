import React, { useState } from "react";
import { T, genNo } from "../qcConstants";
import { Btn, TextInput, SelectInput, Card, CardHeader } from "./Atoms";
import { FilterField } from "./Molecules";
import { DashboardKPIs, DashboardCharts, ReportTable, MatrixOrganism, UserGrid } from "./Organisms";

/** DashboardTemplate */
export const DashboardTemplate = ({ reports, canEdit, onDetail, onEdit, onDelete, onNewReport }) => (
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
export const ReportsTemplate = ({ reports, canEdit, onDetail, onEdit, onDelete, onNewReport }) => {
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
        <div className="qc-grid-auto" style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1.2fr 1.2fr 1.2fr auto", gap: 10, alignItems: "end" }}>
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
export const MatrixTemplate = ({ reports }) => <MatrixOrganism reports={reports} />;

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
