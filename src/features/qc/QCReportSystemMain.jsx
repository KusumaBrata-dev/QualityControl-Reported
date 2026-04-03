import React, { useState, useEffect, useCallback, useRef } from "react";
import { T, SEED_REPORTS, SEED_USERS } from "./qcConstants";
import {
  LoginOrganism,
  ReportFormOrganism,
  DetailModal,
  UserFormOrganism,
  ChangePwOrganism,
} from "./components/Organisms";
import { BarcodeScannerOrganism } from "./components/BarcodeScannerOrganism";
import { GlobalTopBar, MobileBottomNav, MobileFAB, GlobalSidebar } from "./components/MobileOrganisms";
import {
  DashboardTemplate,
  ReportsTemplate,
  MatrixTemplate,
  UsersTemplate,
} from "./components/Templates";
import {
  ToastNotif,
  ErrorBoundary,
  ConfirmModal,
} from "./components/Molecules";
import Footer from "../../components/Footer";
import { exportToExcel } from "./utils/exportUtils";
import { parseExcelImport } from "./utils/importUtils";
import { uploadUserAvatar } from "./utils/storageUtils";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

// ════════════════════════════════════════════════════════════════
// 📄 PAGE — App root, manages all state
// ════════════════════════════════════════════════════════════════
export default function QCReportSystemMain() {
  // Core state
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [dailyProd, setDailyProd] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);

  // Initialize user from localStorage if exists
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("qc_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [isDark, setIsDark] = useState(false);
  const [activeModel, setActiveModel] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleTheme = () => setIsDark((d) => !d);

  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem("qc_active_tab") || "dashboard";
    // Non-admins cannot start on the users tab even via localStorage
    const savedUser = (() => {
      try {
        return JSON.parse(localStorage.getItem("qc_auth_user"));
      } catch {
        return null;
      }
    })();
    if (saved === "users" && savedUser?.role !== "admin") return "dashboard";
    return saved;
  });
  useEffect(() => {
    localStorage.setItem("qc_active_tab", tab);
  }, [tab]);

  // Route guard: if somehow a non-admin is on the users tab, redirect to dashboard
  useEffect(() => {
    if (tab === "users" && currentUser && currentUser.role !== "admin") {
      setTab("dashboard");
    }
  }, [tab, currentUser]);

  const [toastState, setToastState] = useState(null);
  const toastTimer = useRef(null);

  // Modal state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editReport, setEditReport] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailReport, setDetailReport] = useState(null);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwTarget, setPwTarget] = useState(null);
  const [confirmAct, setConfirmAct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Self-healing: if users are empty after 2 seconds, seed from constants
    // (This helps the very first initialization)
    const unsubReports = onSnapshot(
      collection(db, "reports"),
      (snap) => {
        const rs = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        setReports(rs);
        setLastSync(new Date());
        console.log(
          `[Firestore] Synced ${rs.length} reports at ${new Date().toLocaleTimeString()}`,
        );
        // Seed if empty and first load
        if (snap.empty) {
          console.log("Seeding reports...");
          SEED_REPORTS.forEach((r) =>
            setDoc(doc(db, "reports", String(r.id)), r),
          );
        }
      },
      (err) => {
        console.error("Reports load fail:", err);
        showToast("Gagal memuat data laporan", "err");
      },
    );

    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snap) => {
        const uList = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        setUsers(uList);
        setLoading(false);

        // Seeding logic: check if collection is empty OR admin is missing
        const hasAdmin = uList.some((u) => u.username === "admin");
        if (snap.empty || !hasAdmin) {
          console.log("Seeding initial users...");
          SEED_USERS.forEach((u) => {
            setDoc(doc(db, "users", String(u.id)), u).catch((e) =>
              console.error("Seed fail:", e),
            );
          });
        }
      },
      (err) => {
        console.error("Critical Users load fail:", err);
        const errMsg = `DB ERROR [${err.code}]: ${err.message}`;
        showToast(errMsg, "err");
        setLoading(false);
      },
    );

    const unsubDaily = onSnapshot(
      collection(db, "daily_production"),
      (snap) => {
        const data = {};
        snap.docs.forEach((d) => {
          data[d.id] = d.data().qty;
        });
        setDailyProd(data);
      },
      (err) => console.error("Daily prod fail:", err),
    );

    return () => {
      unsubReports();
      unsubUsers();
      unsubDaily();
    };
  }, []);

  // Debug: Log users when they change
  useEffect(() => {
    console.log("Loaded users:", users.length, users);
  }, [users]);
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
          .qc-mobile-form { max-width: 100% !important; max-height: 100vh !important; border-radius: 0 !important; border: 0 !important; margin: 0 !important; }
          .qc-mobile-form > div { border-radius: 0 !important; }
        }
      `;
    document.head.appendChild(el);
    return () => {
      const existingEl = document.getElementById(styleId);
      if (existingEl) document.head.removeChild(existingEl);
    };
  }, []);

  // Toast helper — cleanup timer on unmount to prevent setState on unmounted component
  const showToast = useCallback((msg, type = "ok") => {
    setToastState({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(null), 3200);
  }, []);
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  // Smart Alert Logic (Threshold > 5%)
  useEffect(() => {
    console.log("DB instance:", db);

    const test = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        console.log("Firestore OK:", snap.size);
      } catch (e) {
        console.error("Firestore ERROR:", e);
      }
    };

    const dStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    const todayRep = reports.filter((r) =>
      (r.inspection_date || "").startsWith(dStr),
    );

    if (todayRep.length > 0) {
      const tf = todayRep.reduce((a, r) => a + (Number(r.qty_fail) || 0), 0);
      const ti = todayRep.reduce(
        (a, r) => a + (Number(r.qty_inspected) || 0),
        0,
      );
      if (ti > 0) {
        const rate = (tf / ti) * 100;
        if (rate > 5) {
          const key = `qc_alert_${dStr}`;
          if (!localStorage.getItem(key)) {
            if (Notification.permission === "default") {
              Notification.requestPermission().then((perm) => {
                if (perm === "granted") {
                  new Notification("🚨 Peringatan QC!", {
                    body: `Defect Rate hari ini melampaui 5% (${rate.toFixed(1)}%). Segera lakukan pengecekan produksi.`,
                  });
                }
              });
            } else if (Notification.permission === "granted") {
              new Notification("🚨 Peringatan QC!", {
                body: `Defect Rate hari ini melampaui 5% (${rate.toFixed(1)}%). Segera lakukan pengecekan produksi.`,
              });
            }
            showToast(
              `🚨 ALERT: Defect Rate tinggi (${rate.toFixed(1)}%)!`,
              "err",
            );
            localStorage.setItem(key, "true");
          }
        }
      }
    }
  }, [reports, showToast]);

  const canEdit =
    currentUser && ["admin", "operator"].includes(currentUser.role);
  const isAdmin = currentUser?.role === "admin";

  // ── Auth ──────────────────────────────────────────
  const handleLogin = (user) => {
    const { password, ...safeUser } = user;
    setCurrentUser(safeUser);
    localStorage.setItem("qc_auth_user", JSON.stringify(safeUser));
    showToast(`👋 Selamat datang, ${user.name}!`);
  };
  // ── Logging Helper ──────────────────────────────
  const logAction = useCallback(
    async (type, targetId, details = {}) => {
      if (!currentUser) return;
      try {
        await addDoc(collection(db, "audit_logs"), {
          timestamp: serverTimestamp(),
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: type,
          targetId,
          ...details,
        });
      } catch (e) {
        console.error("Audit log failed:", e);
      }
    },
    [currentUser],
  );

  const handleLogout = () => {
    setConfirmAct({
      title: "Logout",
      message: "Yakin ingin logout?",
      onConfirm: () => {
        setCurrentUser(null);
        localStorage.removeItem("qc_auth_user");
        setTab("dashboard");
        setConfirmAct(null);
      },
    });
  };

  // ── Navigation ────────────────────────────────────
  const handleTab = (t) => {
    if (t === "users" && !isAdmin) {
      showToast("Hanya Admin yang bisa akses halaman ini", "err");
      return;
    }
    setTab(t);
  };

  const handleSaveDailyProd = async (dateStr, qty) => {
    if (!canEdit) {
      showToast("Akses ditolak", "err");
      return;
    }
    const numQty = Number(qty);
    if (!numQty) return;
    try {
      const currentQty = dailyProd[dateStr] || 0;
      await setDoc(
        doc(db, "daily_production", dateStr),
        { qty: currentQty + numQty },
        { merge: true },
      );
      showToast(`✅ ${numQty} Unit ditambahkan!`);
    } catch {
      showToast("Gagal menyimpan Barang Masuk!", "err");
    }
  };

  // ── Reports CRUD ──────────────────────────────────
  const handleNewReport = (scannedSn = null) => {
    setEditReport(typeof scannedSn === 'string' ? { serial_numbers: [scannedSn] } : null);
    setFormOpen(true);
  };
  const handleEditReport = (id) => {
    setEditReport(reports.find((r) => String(r.id) === String(id)) || null);
    setFormOpen(true);
  };
  const handleDetail = (id) => {
    setDetailReport(reports.find((r) => String(r.id) === String(id)) || null);
    setDetailOpen(true);
  };
  const handleDeleteReport = (id) => {
    setConfirmAct({
      title: "Hapus Laporan",
      message: "Hapus laporan ini?",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "reports", String(id)));
          logAction("DELETE_REPORT", id);
          showToast("🗑 Laporan dihapus");
        } catch {
          showToast("Gagal menghapus laporan!", "err");
        }
        setConfirmAct(null);
      },
    });
  };
  const handleSaveReport = async (data) => {
    if (saving) return;
    setSaving(true);
    const isEdit = !!data.id;
    const reportId = isEdit ? data.id : doc(collection(db, "reports")).id;

    // Default approval status for new reports
    const reportData = {
      ...data,
      id: reportId,
      updated_at: new Date().toISOString(),
      updated_by: currentUser.name,
    };

    if (!isEdit) {
      reportData.created_by = currentUser.name;
      reportData.approval_status = "pending"; // Start as pending
    }

    try {
      await setDoc(doc(db, "reports", reportId), reportData, { merge: true });
      logAction(isEdit ? "UPDATE_REPORT" : "CREATE_REPORT", reportId);
      showToast(isEdit ? "✅ Laporan diupdate!" : "✅ Laporan tersimpan!");
      setFormOpen(false);
    } catch {
      showToast("Gagal menyimpan laporan!", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleApproveReport = async (id) => {
    try {
      await setDoc(
        doc(db, "reports", String(id)),
        {
          approval_status: "approved",
          updated_at: new Date().toISOString(),
          updated_by: currentUser.name,
        },
        { merge: true },
      );
      logAction("APPROVE_REPORT", id);
      showToast("✅ Laporan berhasil di-approve!");
      setDetailOpen(false);
    } catch {
      showToast("Gagal meng-approve laporan!", "err");
    }
  };

  // ── Users CRUD ──────────────────────────────────
  const handleAddUser = () => {
    setEditUser(null);
    setUserFormOpen(true);
  };
  const handleEditUser = (id) => {
    setEditUser(users.find((u) => u.id === id) || null);
    setUserFormOpen(true);
  };
  const handleDeleteUser = (id) => {
    if (currentUser?.id === id) {
      showToast("Tidak bisa hapus akun sendiri!", "err");
      return;
    }
    const u = users.find((x) => x.id === id);
    setConfirmAct({
      title: "Hapus User",
      message: `Hapus user "${u?.name || id}"?`,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "users", String(id)));
          logAction("DELETE_USER", id, { targetName: u?.name });
          showToast("🗑 User dihapus");
        } catch {
          showToast("Gagal menghapus user!", "err");
        }
        setConfirmAct(null);
      },
    });
  };
  const handleSaveUser = async (data) => {
    if (saving) return;
    setSaving(true);
    const isEdit = !!data.id;
    const id = isEdit
      ? data.id
      : Math.max(0, ...users.map((u) => Number(u.id) || 0)) + 1;
      
    try {
      let avatarUrl = data.avatar || null;
      if (data.avatarFile) {
        showToast("Meng-upload Avatar...", "info");
        const url = await uploadUserAvatar(data.avatarFile, String(id));
        if (url) avatarUrl = url;
      }
      
      const payload = { ...data, id };
      delete payload.avatarFile;
      if (avatarUrl) payload.avatar = avatarUrl;
      await setDoc(
        doc(db, "users", String(id)),
        payload,
        { merge: true },
      );
      logAction(isEdit ? "UPDATE_USER" : "CREATE_USER", id, {
        targetName: data.name,
      });
      if (currentUser?.id === id) {
        const { password, avatarFile, ...safe } = payload;
        setCurrentUser(safe);
        localStorage.setItem("qc_auth_user", JSON.stringify(safe));
      }
      showToast(isEdit ? "✅ User diupdate!" : "✅ User ditambahkan!");
      setUserFormOpen(false);
    } catch {
      showToast("Gagal menyimpan user!", "err");
    } finally {
      setSaving(false);
    }
  };
  const handleChangePw = (id, _name) => {
    setPwTarget(users.find((u) => u.id === id) || null);
    setPwOpen(true);
  };
  const handleSavePw = async (pw) => {
    if (saving) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", String(pwTarget.id)),
        { password: pw },
        { merge: true },
      );
      setPwOpen(false);
      showToast("✅ Password berhasil diubah!");
    } catch {
      showToast("Gagal mengubah password!", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleExportReports = (filteredData) => {
    try {
      exportToExcel(filteredData || reports, "QC_Reports", {
        filterDesc: filteredData ? "Filtered Results" : "All Data",
      });
      showToast("📥 Exporting to Excel...");
    } catch (e) {
      showToast("Gagal export file!", "err");
    }
  };

  const handleImportExcel = async (file) => {
    try {
      showToast("Membaca file Excel...");
      const data = await parseExcelImport(file);
      if (!data.length) {
        showToast("Tidak ada data valid ditemukan di Excel", "err");
        return;
      }

      let maxId = Math.max(0, ...reports.map((r) => Number(r.id) || 0));
      let count = 0;

      showToast(`Mengimport ${data.length} laporan...`);
      const batch = writeBatch(db);

      for (const r of data) {
        maxId++;
        const reportData = {
          ...r,
          id: maxId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: currentUser.name,
          updated_by: currentUser.name,
          approval_status: "pending",
        };
        batch.set(doc(db, "reports", String(maxId)), reportData);
        count++;
      }

      await batch.commit();
      logAction("IMPORT_EXCEL_BATCH", null, { count });
      showToast(`✅ ${count} Laporan berhasil diimport!`);
    } catch (e) {
      console.error("Import error:", e);
      showToast(e.message || "Gagal membaca file Excel!", "err");
    }
  };

  // ── Render ────────────────────────────────────────
  if (!currentUser)
    return (
      <div className="qc-root">
        <LoginOrganism
          users={users}
          onLogin={handleLogin}
          dbStats={{
            count: users.length,
            loading: loading && users.length === 0,
            error: toastState?.type === "err" ? toastState.msg : null,
          }}
        />
      </div>
    );

  if (loading) return <div style={{ minHeight: "100vh", background: T.bg }} />;

  return (
    <div
      className="qc-root"
      style={{
        fontFamily: T.font,
        background: T.bg,
        color: T.text,
        minHeight: "100vh",
      }}
    >
      <GlobalTopBar
        onOpenSidebar={() => setSidebarOpen(true)}
        user={currentUser}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        activeModel={activeModel}
        onChangeModel={setActiveModel}
      />

      <GlobalSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={currentUser}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        tab={tab}
        onTabChange={handleTab}
        activeModel={activeModel}
        onChangeModel={setActiveModel}
        isAdmin={isAdmin}
      />

      <div
        className="qc-p-24"
        style={{ maxWidth: 1500, margin: "0 auto", padding: 24 }}
      >
        <ErrorBoundary>
          {tab === "dashboard" && (
            <DashboardTemplate
              reports={reports}
              canEdit={canEdit}
              dailyProd={dailyProd}
              onSaveDailyProd={handleSaveDailyProd}
              onDetail={handleDetail}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
              onNewReport={handleNewReport}
              onOpenScanner={() => setScannerOpen(true)}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          )}
          {tab === "reports" && (
            <ReportsTemplate
              reports={reports}
              canEdit={canEdit}
              onDetail={handleDetail}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
              onNewReport={handleNewReport}
              onOpenScanner={() => setScannerOpen(true)}
              date={selectedDate}
              onDateChange={setSelectedDate}
              onExport={handleExportReports}
              onImport={handleImportExcel}
            />
          )}
          {tab === "matrix" && (
            <MatrixTemplate
              reports={reports}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          )}
          {tab === "users" && isAdmin && (
            <UsersTemplate
              users={users}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onChangePw={handleChangePw}
            />
          )}
        </ErrorBoundary>
      </div>

      {/* ── Modals ── */}
      <BarcodeScannerOrganism
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={(sn) => {
          setScannerOpen(false);
          handleNewReport(sn);
        }}
      />
      <ReportFormOrganism
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editReport={editReport}
        onSave={handleSaveReport}
        showToast={showToast}
      />
      <DetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        report={detailReport}
        canEdit={canEdit}
        onEdit={handleEditReport}
        isAdmin={isAdmin}
        onApprove={handleApproveReport}
      />
      <UserFormOrganism
        open={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        editUser={editUser}
        onSave={handleSaveUser}
        users={users}
        showToast={showToast}
      />
      <ChangePwOrganism
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        targetUser={pwTarget}
        onSave={handleSavePw}
        showToast={showToast}
      />
      <ConfirmModal
        open={!!confirmAct}
        title={confirmAct?.title}
        message={confirmAct?.message}
        onConfirm={confirmAct?.onConfirm}
        onCancel={() => setConfirmAct(null)}
      />

      {/* ── Toast ── */}
      <ToastNotif toast={toastState} />

      <MobileFAB
        onClick={() => setScannerOpen(true)}
        visible={canEdit}
        isDark={isDark}
      />
      
      <MobileBottomNav
        tab={tab}
        onTabChange={handleTab}
        isAdmin={isAdmin}
        isDark={isDark}
      />
      
      <Footer isDark={isDark} />
    </div>
  );
}
