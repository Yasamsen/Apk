# Web2APK Gratis — starter project

Starter gratis untuk membuat APK Android WebView dari HP menggunakan:
- Frontend statis di Vercel
- GitHub Actions sebagai build worker
- Android WebView native + Gradle
- APK debug yang dapat dipasang untuk pengujian (min Android 5.0/API 21; target Android 10/API 29)

## Penting
Ini adalah starter/MVP, bukan layanan publik siap skala besar. GitHub Actions memiliki kuota dan artefak build memiliki masa kedaluwarsa. Pengguna harus dapat mengakses repository/Actions artifacts untuk mengambil APK. Jangan mengaktifkan layanan publik tanpa rate limiting dan perlindungan penyalahgunaan.

## Pasang dari HP Android
1. Buat akun GitHub dan buat repository baru (misalnya `web2apk-gratis`).
2. Upload seluruh isi folder ZIP ini ke repository, termasuk folder `.github` dan `api`.
3. Di GitHub, buka **Settings → Actions → General**, pastikan workflow diizinkan berjalan.
4. Buat Personal Access Token (fine-grained) yang hanya punya akses ke repository tersebut dengan permission **Actions: Read and write**. Simpan rahasia token, jangan pernah masukkan ke file frontend.
5. Di Vercel, import repository ini sebagai project.
6. Tambahkan Environment Variables di Vercel:
   - `GH_TOKEN` = token GitHub tadi
   - `GH_OWNER` = username pemilik repository
   - `GH_REPO` = nama repository
7. Deploy / redeploy Vercel.
8. Buka website Vercel, isi URL HTTPS, nama aplikasi, dan package ID. Tekan **Mulai Build**.
9. Buka link GitHub Actions yang ditampilkan. Setelah workflow selesai, buka run terbaru → **Artifacts** → unduh `web2apk-debug-apk.zip`, lalu ekstrak dan pasang APK.

## Batasan versi awal
- Hasilnya adalah debug APK untuk pengujian, bukan rilis Play Store.
- Ikon kustom didukung melalui unggah PNG/JPG atau URL HTTPS PNG/JPG. Gambar diperkecil dan dibuatkan aset launcher untuk semua density Android. Tanpa ikon kustom, ikon bawaan tetap digunakan.
- Splash screen, upload/download dalam WebView, push notification, dan penandatanganan rilis belum disediakan.
- Situs target harus mengizinkan pemuatan di WebView. Beberapa website memblokir iframe bukan masalah di sini, tetapi bisa membatasi login, pembayaran, atau fitur browser.
- Build dijalankan di GitHub Actions; Vercel hanya mengirim permintaan. Tidak membundel Android SDK di Vercel.
- Sebelum dibuka ke publik, tambahkan CAPTCHA/rate limit dan aturan pemakaian yang jelas. Jangan membiarkan orang memakai layanan untuk membangun aplikasi yang menyamar atau melanggar hak pemilik situs.

## Troubleshooting
- `workflow_dispatch` tidak muncul: pastikan file `.github/workflows/build-apk.yml` sudah berada di branch default.
- 401/403: periksa `GH_TOKEN` dan permission Actions: Read and write.
- Build gagal: buka log run di GitHub Actions untuk melihat pesan error.


## Jika APK terunduh tetapi tidak bisa dipasang di Android 10
1. Pastikan yang dipasang adalah `app-debug.apk`, bukan file ZIP artefak. Ekstrak `web2apk-debug-apk.zip` terlebih dahulu.
2. Jika pernah memasang build lama dengan package ID yang sama, hapus aplikasi lama lalu pasang APK baru. APK debug dari build GitHub berbeda dapat ditandatangani dengan kunci debug berbeda sehingga pembaruan langsung ditolak.
3. Buka Pengaturan Android → Aplikasi/Keamanan → Izinkan instalasi aplikasi tidak dikenal untuk aplikasi yang dipakai membuka APK (misalnya Files/Chrome). Nama menu berbeda antarperangkat.
4. Workflow saat ini memakai `minSdk 21` (Android 5.0+) dan `targetSdk 29` (Android 10), serta `compileSdk 35`. Jika tetap gagal, catat pesan lengkap dari pemasang paket atau periksa apakah APK benar-benar selesai diunduh dan diekstrak.


## Ikon aplikasi kustom
- Unggah file PNG/JPG di formulir, atau masukkan URL HTTPS gambar. Jika keduanya diisi, file upload yang dipakai.
- Workflow membuat PNG ikon untuk setiap kepadatan Android dan menghapus ikon vektor bawaan agar tidak menimpa ikon kustom.
- Setelah mengganti workflow di GitHub, jalankan build baru. APK yang sudah terunduh sebelumnya tidak berubah.
- Jika ikon lama masih terlihat di launcher, uninstall APK lama lalu pasang APK baru; beberapa launcher menyimpan cache ikon.
