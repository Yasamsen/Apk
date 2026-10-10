# ApiKu — Flutter native starter

Proyek ini mengubah katalog API dari repository ApiKu menjadi UI Flutter native (bukan WebView).

## Status
- Katalog endpoint: diambil dari metadata 53 file endpoint JavaScript yang ada di ZIP.
- UI native: beranda, pencarian, filter kategori, dokumentasi ringkas, halaman detail dan tester request GET.
- Backend: `https://api.yasamdev.web.id`.
- **Belum berupa APK terkompilasi.** Lingkungan pembuat proyek ini tidak memiliki Flutter/Android SDK, jadi APK perlu dibangun dengan Flutter SDK.

## Build APK
1. Instal Flutter SDK dan Android Studio (Android SDK).
2. Dari folder proyek jalankan:
   ```sh
   flutter create . --platforms=android
   flutter pub get
   flutter build apk --release
   ```
3. APK hasil build: `build/app/outputs/flutter-apk/app-release.apk`

Jika menjalankan `flutter create .`, pilih/pertahankan konfigurasi Android default Flutter. Pastikan `android/app/src/main/AndroidManifest.xml` tetap memiliki izin `android.permission.INTERNET` dan label aplikasi `ApiKu`.

## Catatan penting
- Tester yang disediakan sekarang mengirim request GET. Beberapa endpoint sumber bertipe POST atau membutuhkan parameter khusus; tester generik perlu disesuaikan sebelum semua endpoint dapat dicoba dengan benar.
- Katalog dokumentasi dihasilkan dari metadata endpoint, bukan hasil pengujian semua API.
- Semua fitur API memerlukan internet dan server backend yang aktif.
