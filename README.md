# ApiKu — Flutter Native

Aplikasi Flutter native (bukan WebView) untuk katalog endpoint API YasamDev.

## Build APK dengan GitHub Actions

1. Unggah seluruh isi folder proyek ini ke root repository GitHub. Pastikan `pubspec.yaml`, folder `lib/`, dan folder `.github/workflows/` berada di root repository.
2. Commit file `.github/workflows/build-apk.yml` ke branch `main` atau `master`.
3. Buka tab **Actions**, pilih **Build ApiKu APK**, lalu tekan **Run workflow**. Workflow juga berjalan otomatis setiap ada push ke `main` atau `master`.
4. Setelah build sukses, buka run yang bertanda centang hijau dan unduh artifact **ApiKu-release-APK** di bagian Artifacts.
5. Ekstrak ZIP artifact untuk mendapatkan `app-release.apk`.

Workflow memasang Java 17 dan Flutter stable, membuat file platform Android jika scaffold belum lengkap, mengambil dependensi, lalu membangun APK release.

## Catatan

- Proyek ini adalah starter native Flutter, bukan salinan lengkap website dalam WebView.
- Tester generik saat ini mengirim request GET; endpoint yang memerlukan POST atau parameter khusus mungkin perlu penyesuaian.
- APK belum diverifikasi melalui build GitHub Actions dalam paket ini. Jalankan workflow untuk membangun dan memeriksa hasilnya.
