export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Gunakan metode GET.' }); }
  const { GH_TOKEN, GH_OWNER, GH_REPO } = process.env;
  if (!GH_TOKEN || !GH_OWNER || !GH_REPO) return res.status(500).send('Konfigurasi server belum lengkap.');
  const headers = { Accept: 'application/vnd.github+json', Authorization: `Bearer ${GH_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'web2apk-starter' };
  try {
    const base = `https://api.github.com/repos/${encodeURIComponent(GH_OWNER)}/${encodeURIComponent(GH_REPO)}`;
    const runsResponse = await fetch(`${base}/actions/workflows/build-apk.yml/runs?branch=main&per_page=10`, { headers });
    if (!runsResponse.ok) throw new Error('Gagal membaca build GitHub.');
    const runs = (await runsResponse.json()).workflow_runs || [];
    const run = runs.find(r => r.status === 'completed' && r.conclusion === 'success');
    if (!run) return res.status(404).send('APK belum siap. Jalankan build terlebih dahulu.');
    const artifactsResponse = await fetch(`${base}/actions/runs/${run.id}/artifacts`, { headers });
    if (!artifactsResponse.ok) throw new Error('Gagal membaca artifact.');
    const artifacts = (await artifactsResponse.json()).artifacts || [];
    const artifact = artifacts.find(a => a.name === 'web2apk-debug-apk' && !a.expired);
    if (!artifact) return res.status(404).send('File APK belum tersedia atau sudah kedaluwarsa. Jalankan build lagi.');
    const downloadResponse = await fetch(artifact.archive_download_url, { headers });
    if (!downloadResponse.ok) throw new Error('GitHub gagal mengunduh artifact.');
    const buffer = Buffer.from(await downloadResponse.arrayBuffer());
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="Web2APK-Android.zip"');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(502).send(error.message || 'Gagal mengunduh APK.');
  }
}
