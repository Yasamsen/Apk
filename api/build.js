export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Gunakan metode POST.' });
  }

  const { GH_TOKEN, GH_OWNER, GH_REPO } = process.env;
  if (!GH_TOKEN || !GH_OWNER || !GH_REPO) {
    return res.status(500).json({ error: 'Konfigurasi server belum lengkap. Periksa Environment Variables di Vercel.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const url = String(body?.url || '').trim();
  const appName = String(body?.appName || '').trim();
  const packageName = String(body?.packageName || '').trim();

  let parsed;
  try { parsed = new URL(url); } catch {
    return res.status(400).json({ error: 'Masukkan URL website yang valid.' });
  }
  if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.username || parsed.password) {
    return res.status(400).json({ error: 'Gunakan URL HTTPS yang valid tanpa username/password.' });
  }
  if (!appName || appName.length > 40 || /[<>\u0000-\u001f]/.test(appName)) {
    return res.status(400).json({ error: 'Nama aplikasi wajib diisi (maksimal 40 karakter).' });
  }
  if (packageName.length > 120 || !/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){1,6}$/.test(packageName)) {
    return res.status(400).json({ error: 'Package ID tidak valid. Contoh: com.namakamu.aplikasi' });
  }

  const api = `https://api.github.com/repos/${encodeURIComponent(GH_OWNER)}/${encodeURIComponent(GH_REPO)}/actions/workflows/build-apk.yml/dispatches`;
  const gh = await fetch(api, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${GH_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'web2apk-starter'
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: { website_url: url, app_name: appName, package_name: packageName }
    })
  });
  if (gh.status !== 204) {
    const detail = await gh.text();
    console.error('GitHub dispatch failed', gh.status, detail.slice(0, 500));
    return res.status(502).json({ error: 'GitHub tidak menerima build. Pastikan nama branch main, workflow sudah diunggah, dan token punya izin Actions: Read and write.' });
  }

  return res.status(202).json({
    ok: true,
    actionsUrl: `https://github.com/${encodeURIComponent(GH_OWNER)}/${encodeURIComponent(GH_REPO)}/actions`,
    dispatchedAt: new Date().toISOString()
  });
}
