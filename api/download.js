import { inflateRawSync } from 'node:zlib';

// GitHub selalu membungkus artifact dalam ZIP. Fungsi ini membuka ZIP itu di server
// (tanpa library tambahan) dan mengambil file .apk di dalamnya.
function extractApk(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Format artifact tidak dikenali.');
  const total = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let n = 0; n < total; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    if (name.toLowerCase().endsWith('.apk')) {
      const lNameLen = buf.readUInt16LE(localOffset + 26);
      const lExtraLen = buf.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + lNameLen + lExtraLen;
      const data = buf.subarray(start, start + compSize);
      if (method === 0) return data;
      if (method === 8) return inflateRawSync(data);
      throw new Error('Metode kompresi ZIP tidak didukung.');
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error('File APK tidak ditemukan di dalam hasil build.');
}

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
    const zipBuffer = Buffer.from(await downloadResponse.arrayBuffer());
    const apk = extractApk(zipBuffer);

    const requested = new URL(req.url, 'https://vercel.invalid').searchParams.get('name') || '';
    const safe = requested.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
    const filename = `${safe || 'Web2APK-Android'}.apk`;

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', String(apk.length));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(apk);
  } catch (error) {
    return res.status(502).send(error.message || 'Gagal mengunduh APK.');
  }
}
