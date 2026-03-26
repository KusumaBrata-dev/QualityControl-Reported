import React, { useState, useEffect, useCallback, useRef } from "react";
import { T, SEED_REPORTS, SEED_USERS } from "./qcConstants";
import { LoginOrganism, NavbarOrganism, ReportFormOrganism, DetailModal, UserFormOrganism, ChangePwOrganism } from "./components/Organisms";
import { DashboardTemplate, ReportsTemplate, MatrixTemplate, UsersTemplate } from "./components/Templates";
import { ToastNotif, ErrorBoundary, ConfirmModal } from "./components/Molecules";
import { db } from "../../firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";


// ════════════════════════════════════════════════════════════════
// 📄 PAGE — App root, manages all state
// ════════════════════════════════════════════════════════════════
export default function QCReportSystemMain() {
  // Core state
  const [reports, setReports] = useState([]);
  const [users,   setUsers]   = useState([]);
  const [dailyProd, setDailyProd] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Initialize user from localStorage if exists
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("qc_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch(e) { return null; }
  });
  
  const [tab,         setTab]         = useState("dashboard");
  const [toastState,  setToastState]  = useState(null);
  const toastTimer = useRef(null);

  // Modal state
  const [formOpen,     setFormOpen]     = useState(false);
  const [editReport,   setEditReport]   = useState(null);
  const [detailOpen,   setDetailOpen]   = useState(false);
  const [detailReport, setDetailReport] = useState(null);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editUser,     setEditUser]     = useState(null);
  const [pwOpen,       setPwOpen]       = useState(false);
  const [pwTarget,     setPwTarget]     = useState(null);
  const [confirmAct,   setConfirmAct]   = useState(null);
  
  const [nextId,       setNextId]       = useState(SEED_REPORTS.length + 1);
  const [nextUid,      setNextUid]      = useState(SEED_USERS.length  + 1);

  useEffect(() => {
    const unsubReports = onSnapshot(collection(db, "reports"), snap => {
      setReports(snap.docs.map(d => ({ ...d.data(), id: Number(d.id) })));
      setLoading(false);
    });

    const unsubUsers = onSnapshot(collection(db, "users"), snap => {
      setUsers(snap.docs.map(d => ({ ...d.data(), id: Number(d.id) })));
    });

    const unsubDaily = onSnapshot(collection(db, "daily_production"), snap => {
      const data = {};
      snap.docs.forEach(d => { data[d.id] = d.data().qty; });
      setDailyProd(data);
    });

    return () => {
      unsubReports();
      unsubUsers();
      unsubDaily();
    };
  }, []);
  // Inject global CSS once
  useEffect(() => {
    const styleId = "qc-reports-global-styles";
    if (document.getElementById(styleId)) return;

    const el = document.createElement("style");
    el.id = styleId;
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;600&display=swap');
      .qc-root *, .qc-root *::before, .qc-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
      .qc-root { font-family: 'Outfit', sans-serif; background: ${T.bg}; color: ${T.text}; min-height: 100vh; font-size: 14px; line-height: 1.5; }
      .qc-root ::-webkit-scrollbar { width: 5px; height: 5px; }
      .qc-root ::-webkit-scrollbar-track { background: ${T.bg}; }
      .qc-root ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      .qc-root input:focus, .qc-root select:focus, .qc-root textarea:focus { border-color: ${T.blue} !important; box-shadow: 0 0 0 3px rgba(47,129,247,.1) !important; outline: none !important; }
      .qc-root input::placeholder, .qc-root textarea::placeholder { color: ${T.muted2}; }
      .qc-root select option { background: ${T.surface2}; }
      .qc-root button:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
      .qc-root button:active:not(:disabled) { transform: none !important; }
      .qc-root tbody tr:hover td { background: ${T.surface2}; }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

      /* Responsive CSS */
      @media (max-width: 900px) {
        .qc-nav-inner { height: auto !important; flex-wrap: wrap; justify-content: space-between; padding: 12px 16px !important; gap: 12px; }
        .qc-nav-tabs { order: 3; width: 100%; justify-content: center; margin-top: 4px; }
        .qc-nav-right { order: 2; flex-wrap: wrap; justify-content: flex-end; }
        .qc-clock { display: none !important; } /* Hide clock on mobile to save space */
      }
      @media (max-width: 768px) {
        .qc-grid-2, .qc-grid-3 { grid-template-columns: 1fr !important; }
        .qc-kpi-grid { grid-template-columns: 1fr 1fr !important; }
        .qc-grid-5 { grid-template-columns: repeat(2, 1fr) !important; }
        .qc-grid-auto { grid-template-columns: 1fr !important; }
        .qc-flex-col-mobile { flex-direction: column !important; align-items: stretch !important; gap: 12px; }
        .qc-p-24 { padding: 16px !important; }
      }
      @media (max-width: 480px) {
        .qc-kpi-grid, .qc-grid-5 { grid-template-columns: 1fr !important; }
        .qc-login-card { padding: 32px 24px !important; width: auto !important; margin: 16px !important; }
      }
    `;
    document.head.appendChild(el);
    return () => {
      const existingEl = document.getElementById(styleId);
      if (existingEl) document.head.removeChild(existingEl);
    };
  }, []);

  // Toast helper
  const showToast = useCallback((msg, type = "ok") => {
    setToastState({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(null), 3200);
  }, []);

  const canEdit = currentUser && ["admin","operator"].includes(currentUser.role);
  const isAdmin = currentUser?.role === "admin";

  // ── Auth ──────────────────────────────────────────
  const handleLogin  = user => { 
    setCurrentUser(user); 
    const { password, ...safeUser } = user;
    localStorage.setItem("qc_auth_user", JSON.stringify(safeUser));
    showToast(`👋 Selamat datang, ${user.name}!`); 
  };
  const handleLogout = ()   => { 
    setConfirmAct({ title: "Logout", message: "Yakin ingin logout?", onConfirm: () => {
      setCurrentUser(null); 
      localStorage.removeItem("qc_auth_user");
      setTab("dashboard"); 
      setConfirmAct(null);
    }});
  };

  // ── Navigation ────────────────────────────────────
  const handleTab = t => {
    if (t === "users" && !isAdmin) { showToast("Hanya Admin yang bisa akses halaman ini", "err"); return; }
    setTab(t);
  };

  const handleSaveDailyProd = async (dateStr, qty) => {
    if (!canEdit) { showToast("Akses ditolak", "err"); return; }
    const numQty = Number(qty);
    if (!numQty) return;
    try {
      const currentQty = dailyProd[dateStr] || 0;
      await setDoc(doc(db, "daily_production", dateStr), { qty: currentQty + numQty }, { merge: true });
      showToast(`✅ ${numQty} Unit ditambahkan!`);
    } catch { showToast("Gagal menyimpan Barang Masuk!", "err"); }
  };

  // ── Reports CRUD ──────────────────────────────────
  const handleNewReport    = ()  => { setEditReport(null); setFormOpen(true); };
  const handleEditReport   = id  => { setEditReport(reports.find(r => r.id === id) || null); setFormOpen(true); };
  const handleDetail       = id  => { setDetailReport(reports.find(r => r.id === id) || null); setDetailOpen(true); };
  const handleDeleteReport = id  => {
    setConfirmAct({ title: "Hapus Laporan", message: "Hapus laporan ini?", onConfirm: async () => {
      try {
        await deleteDoc(doc(db, "reports", String(id)));
        showToast("🗑 Laporan dihapus");
      } catch { showToast("Gagal menghapus laporan!", "err"); }
      setConfirmAct(null);
    }});
  };
  const handleSaveReport = async data => {
    const isEdit = !!data.id;
    const id = isEdit ? data.id : nextId;
    try {
      await setDoc(doc(db, "reports", String(id)), { ...data, id }, { merge: true });
      if (!isEdit) setNextId(n => n + 1);
      showToast(isEdit ? "✅ Laporan diupdate!" : "✅ Laporan tersimpan!");
    } catch { showToast("Gagal menyimpan laporan!", "err"); }
    setFormOpen(false);
  };

  // ── Users CRUD ──────────────────────────────────
  const handleAddUser    = ()  => { setEditUser(null); setUserFormOpen(true); };
  const handleEditUser   = id  => { setEditUser(users.find(u => u.id === id) || null); setUserFormOpen(true); };
  const handleDeleteUser = id  => {
    if (currentUser?.id === id) { showToast("Tidak bisa hapus akun sendiri!", "err"); return; }
    const u = users.find(x => x.id === id);
    setConfirmAct({ title: "Hapus User", message: `Hapus user "${u?.name || id}"?`, onConfirm: async () => {
      try {
        await deleteDoc(doc(db, "users", String(id)));
        showToast("🗑 User dihapus");
      } catch { showToast("Gagal menghapus user!", "err"); }
      setConfirmAct(null);
    }});
  };
  const handleSaveUser = async data => {
    const isEdit = !!data.id;
    const id = isEdit ? data.id : nextUid;
    try {
      await setDoc(doc(db, "users", String(id)), { ...data, id }, { merge: true });
      if (!isEdit) setNextUid(n => n + 1);
      if (currentUser?.id === id) {
        const { password, ...safe } = { ...data, id };
        setCurrentUser(safe);
        localStorage.setItem("qc_auth_user", JSON.stringify(safe));
      }
      showToast(isEdit ? "✅ User diupdate!" : "✅ User ditambahkan!");
    } catch { showToast("Gagal menyimpan user!", "err"); }
    setUserFormOpen(false);
  };
  const handleChangePw = (id, _name) => { setPwTarget(users.find(u => u.id === id) || null); setPwOpen(true); };
  const handleSavePw   = async pw => {
    try {
      await setDoc(doc(db, "users", String(pwTarget.id)), { password: pw }, { merge: true });
      setPwOpen(false);
      showToast("✅ Password berhasil diubah!");
    } catch { showToast("Gagal mengubah password!", "err"); }
  };

  // ── Render ────────────────────────────────────────
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.bg, color: T.muted, fontSize: 14 }}>
      ⏳ Memuat data...
    </div>
  );

  if (!currentUser) return (
    <div className="qc-root">
      <LoginOrganism users={users} onLogin={handleLogin} />
    </div>
  );

  return (
    <div className="qc-root" style={{ fontFamily: T.font, background: T.bg, color: T.text, minHeight: "100vh" }}>
      <NavbarOrganism
        user={currentUser} tab={tab} onTabChange={handleTab}
        canEdit={canEdit} isAdmin={isAdmin}
        onNewReport={handleNewReport} onLogout={handleLogout}
      />

      <div className="qc-p-24" style={{ maxWidth: 1500, margin: "0 auto", padding: 24 }}>
        <ErrorBoundary>
          {tab === "dashboard" && (
            <DashboardTemplate reports={reports} canEdit={canEdit} dailyProd={dailyProd} onSaveDailyProd={handleSaveDailyProd}
            onDetail={handleDetail} onEdit={handleEditReport} onDelete={handleDeleteReport}
            onNewReport={handleNewReport} />
          )}
          {tab === "reports" && (
            <ReportsTemplate reports={reports} canEdit={canEdit}
              onDetail={handleDetail} onEdit={handleEditReport} onDelete={handleDeleteReport}
              onNewReport={handleNewReport} />
          )}
          {tab === "matrix" && <MatrixTemplate reports={reports} />}
          {tab === "users" && isAdmin && (
            <UsersTemplate users={users} currentUser={currentUser}
              onAddUser={handleAddUser} onEdit={handleEditUser}
              onDelete={handleDeleteUser} onChangePw={handleChangePw} />
          )}
        </ErrorBoundary>
      </div>

      {/* ── Modals ── */}
      <ReportFormOrganism
        open={formOpen} onClose={() => setFormOpen(false)}
        editReport={editReport} onSave={handleSaveReport} showToast={showToast}
      />
      <DetailModal
        open={detailOpen} onClose={() => setDetailOpen(false)}
        report={detailReport} canEdit={canEdit} onEdit={handleEditReport}
      />
      <UserFormOrganism
        open={userFormOpen} onClose={() => setUserFormOpen(false)}
        editUser={editUser} onSave={handleSaveUser} users={users} showToast={showToast}
      />
      <ChangePwOrganism
        open={pwOpen} onClose={() => setPwOpen(false)}
        targetUser={pwTarget} onSave={handleSavePw} showToast={showToast}
      />
      <ConfirmModal 
        open={!!confirmAct} title={confirmAct?.title} message={confirmAct?.message} 
        onConfirm={confirmAct?.onConfirm} onCancel={() => setConfirmAct(null)} 
      />

      {/* ── Toast ── */}
      <ToastNotif toast={toastState} />
    </div>
  );
}
