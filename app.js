const form = document.querySelector('#buildForm');
const button = document.querySelector('#submit');
const statusBox = document.querySelector('#status');
let pollTimer = null;
let currentBuildAfter = null;

function showStatus(message, actionsUrl, downloadUrl) {
  statusBox.replaceChildren();
  const p = document.createElement('p');
  p.textContent = message;
  statusBox.append(p);
  if (downloadUrl) {
    const download = document.createElement('a');
    download.href = downloadUrl;
    download.className = 'download-button';
    download.textContent = '⬇ Download APK';
    download.setAttribute('download', 'Web2APK-Android.zip');
    statusBox.append(download);
    const note = document.createElement('p');
    note.className = 'hint';
    note.textContent = 'File unduhan berbentuk ZIP. Ekstrak ZIP, lalu pasang app-debug.apk.';
    statusBox.append(note);
  }
  if (actionsUrl) {
    const a = document.createElement('a');
    a.href = actionsUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Lihat detail build di GitHub Actions ↗';
    statusBox.append(a);
  }
}

async function readApiResponse(response, endpoint) {
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  const raw = await response.text();
  try { return JSON.parse(raw); } catch {
    const preview = raw.replace(/\s+/g, ' ').slice(0, 180);
    if (response.status === 404 || /the page could not be found|not found/i.test(preview)) {
      throw new Error(`Endpoint ${endpoint} tidak ditemukan (HTTP ${response.status}). Pastikan folder api/ dan vercel.json berada di root repository, lalu redeploy Vercel. Respons: ${preview}`);
    }
    throw new Error(`Server ${endpoint} tidak mengirim JSON (HTTP ${response.status}, ${contentType || 'tipe konten tidak diketahui'}). Respons: ${preview || '(kosong)'}`);
  }
}

async function checkBuild() {
  try {
    const response = await fetch('/api/status' + (currentBuildAfter ? '?after=' + encodeURIComponent(currentBuildAfter) : ''), { cache: 'no-store' });
    const data = await readApiResponse(response, '/api/status');
    if (!response.ok) throw new Error(data.error || 'Gagal memeriksa status build.');
    showStatus(data.message || 'Memeriksa status build…', data.actionsUrl, data.state === 'success' ? data.downloadUrl : null);
    if (['success', 'failed', 'ready-expired'].includes(data.state)) {
      if (pollTimer) clearInterval(pollTimer);
      button.disabled = false;
    }
  } catch (error) {
    showStatus(error.message || 'Belum bisa memeriksa status build. Coba lagi sebentar.');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (pollTimer) clearInterval(pollTimer);
  button.disabled = true;
  statusBox.hidden = false;
  showStatus('Mengirim permintaan build…');
  try {
    const payload = {
      url: document.querySelector('#url').value.trim(),
      appName: document.querySelector('#appName').value.trim(),
      packageName: document.querySelector('#packageName').value.trim(),
      iconUrl: document.querySelector('#iconUrl').value.trim(),
      iconData: await readAndShrinkIcon(document.querySelector('#iconFile').files[0])
    };
    if (payload.iconData && payload.iconUrl) payload.iconUrl = '';
    const response = await fetch('/api/build', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await readApiResponse(response, '/api/build');
    if (!response.ok) throw new Error(data.error || 'Permintaan gagal.');
    currentBuildAfter = data.dispatchedAt || new Date().toISOString();
    showStatus('Permintaan build berhasil. APK sedang dibuat; halaman ini akan memunculkan tombol download setelah selesai.', data.actionsUrl);
    pollTimer = setInterval(checkBuild, 8000);
    setTimeout(checkBuild, 2500);
  } catch (error) {
    showStatus(error.message || 'Terjadi kesalahan.');
    button.disabled = false;
  }
});


async function readAndShrinkIcon(file) {
  if (!file) return '';
  if (!['image/png', 'image/jpeg'].includes(file.type)) throw new Error('Ikon harus berupa PNG atau JPG.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Ukuran ikon asli maksimal 5 MB.');
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal membaca file ikon.'));
    reader.readAsDataURL(file);
  });
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('File ikon tidak bisa dibaca sebagai gambar.'));
    img.src = dataUrl;
  });
  const canvas = document.createElement('canvas');
  canvas.width = 96; canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 96, 96);
  const scale = Math.min(96 / image.width, 96 / image.height);
  const w = Math.max(1, Math.round(image.width * scale));
  const h = Math.max(1, Math.round(image.height * scale));
  ctx.drawImage(image, Math.round((96 - w) / 2), Math.round((96 - h) / 2), w, h);
  const compact = canvas.toDataURL('image/jpeg', 0.72);
  if (compact.length > 45000) throw new Error('Ikon masih terlalu besar setelah diperkecil. Coba gambar yang lebih sederhana.');
  return compact;
}
