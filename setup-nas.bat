@echo off
echo Mencoba menyambung (Username: produksi)...

echo Membersihkan sesi lama...
net use \\10.0.0.8\home /delete /y >nul 2>&1

echo Menyambungkan ke \\10.0.0.8\home...
net use \\10.0.0.8\home "Zyr3xuser" /user:"produksi" /persistent:yes

echo.
echo Selesai. Status Error: %errorlevel%
if %errorlevel% equ 0 (
    echo ===========================================
    echo [BERHASIL] Koneksi ke NAS AKTIF!
    echo ===========================================
) else (
    echo [GAGAL] Koneksi masih ditolak. Periksa kembali password Zyr3xuser
)
pause
