
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Gunakan metode POST."
    });
  }

  try {
    const { GH_TOKEN, GH_OWNER, GH_REPO } = process.env;

    if (!GH_TOKEN || !GH_OWNER || !GH_REPO) {
      return res.status(500).json({
        error: "Konfigurasi Environment Variables belum lengkap."
      });
    }

    // Membaca data formulir
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    // Fallback jika Vercel tidak menyediakan req.body
    if (!body && req[Symbol.asyncIterator]) {
      let raw = "";
      for await (const chunk of req) {
        raw += chunk.toString();
        if (raw.length > 10000) {
          return res.status(413).json({
            error: "Data formulir terlalu besar."
          });
        }
      }

      try {
        body = JSON.parse(raw);
      } catch {
        body = {};
      }
    }

    body = body || {};

    const url = String(body.url || "").trim();
    const appName = String(body.appName || "").trim();
    const packageName = String(body.packageName || "").trim();

    // Validasi URL
    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({
        error: "Masukkan URL website yang valid."
      });
    }

    if (
      parsedUrl.protocol !== "https:" ||
      !parsedUrl.hostname ||
      parsedUrl.username ||
      parsedUrl.password
    ) {
      return res.status(400).json({
        error: "Gunakan URL HTTPS yang valid."
      });
    }

    // Validasi nama aplikasi
    if (
      !appName ||
      appName.length > 40 ||
      /[<>\u0000-\u001f]/.test(appName)
    ) {
      return res.status(400).json({
        error: "Nama aplikasi wajib diisi, maksimal 40 karakter."
      });
    }

    // Validasi package ID
    if (
      packageName.length > 120 ||
      !/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){1,6}$/.test(packageName)
    ) {
      return res.status(400).json({
        error: "Package ID tidak valid. Contoh: com.sera.aplikasi"
      });
    }

    // Memulai workflow GitHub Actions
    const api =
      `https://api.github.com/repos/${encodeURIComponent(GH_OWNER)}/${encodeURIComponent(GH_REPO)}/actions/workflows/build-apk.yml/dispatches`;

    const response = await fetch(api, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${GH_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        "User-Agent": "web2apk-starter"
      },
      body: JSON.stringify({
        ref: "main",
        inputs: {
          website_url: url,
          app_name: appName,
          package_name: packageName
        }
      })
    });

    if (response.status !== 204) {
      console.error(
        "GitHub dispatch failed:",
        response.status
      );

      return res.status(502).json({
        error:
          "Build gagal dikirim ke GitHub. Periksa token, izin Actions, nama repository, branch main, dan workflow."
      });
    }

    return res.status(202).json({
      ok: true,
      message: "Build APK berhasil dimulai.",
      actionsUrl:
        `https://github.com/${encodeURIComponent(GH_OWNER)}/${encodeURIComponent(GH_REPO)}/actions`
    });
  } catch (error) {
    console.error("Build API error:", error);

    return res.status(500).json({
      error: "Terjadi kesalahan server. Silakan coba lagi."
    });
  }
}
