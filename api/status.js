export default async function handler(req, res) {
  const { GH_TOKEN, GH_OWNER, GH_REPO } = process.env;
  if (!GH_TOKEN || !GH_OWNER || !GH_REPO) return res.status(500).json({ error: 'Konfigurasi server belum lengkap.' });
  const headers = { Accept: 'application/vnd.github+json', Authorization: `Bearer ${GH_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'web2apk-starter' };
  try {
    const base = `https://api.github.com/repos/${encodeURIComponent(GH_OWNER)}/${encodeURIComponent(GH_REPO)}`;
    const runsResponse = await fetch(`${base}/actions/workflows/build-apk.yml/runs?branch=main&per_page=5`, { headers });
    if (!runsResponse.ok) throw new Error('Tidak bisa membaca status build dari GitHub.');
    const runs = (await runsResponse.json()).workflow_runs || [];
    const after = new URL(req.url, 'https://vercel.invalid').searchParams.get('after');
    const eligible = after ? runs.filter(r => Date.parse(r.created_at) >= Date.parse(after) - 5000) : runs;
    const run = eligible.find(r => r.status === 'in_progress' || r.status === 'queued') || eligible.find(r => r.status === 'completed');
    if (!run) return res.status(200).json({ state: 'waiting', message: 'Menunggu GitHub memulai build…' });
    if (run.status !== 'completed') return res.status(200).json({ state: run.status, message: run.status === 'queued' ? 'Build sedang antre…' : 'APK sedang dibuat…', actionsUrl: run.html_url });
    if (run.conclusion !== 'success') return res.status(200).json({ state: 'failed', message: 'Build gagal. Buka GitHub Actions untuk melihat log.', actionsUrl: run.html_url });
    const artifactsResponse = await fetch(`${base}/actions/runs/${run.id}/artifacts`, { headers });
    if (!artifactsResponse.ok) throw new Error('Tidak bisa membaca hasil build.');
    const artifacts = (await artifactsResponse.json()).artifacts || [];
    const artifact = artifacts.find(a => a.name === 'web2apk-debug-apk' && !a.expired);
    if (!artifact) return res.status(200).json({ state: 'ready-expired', message: 'Build berhasil, tetapi file unduhan sudah kedaluwarsa. Jalankan build lagi.', actionsUrl: run.html_url });
    return res.status(200).json({ state: 'success', message: 'APK siap diunduh.', downloadUrl: '/api/download', actionsUrl: run.html_url, expiresAt: artifact.expires_at });
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Gagal memeriksa status build.' });
  }
}
