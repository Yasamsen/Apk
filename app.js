const form = document.querySelector('#buildForm');
const button = document.querySelector('#submit');
const statusBox = document.querySelector('#status');
let pollTimer = null;
let currentBuildAfter = null;

let currentAppName = '';
const STEPS = ['Terkirim', 'Antre', 'Membangun', 'Siap'];
const STATE_STEP = { sending: 0, waiting: 1, queued: 1, in_progress: 2, success: 4 };

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatExpiry(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function buildStepper(active, failed) {
  const list = el('ol', 'stepper');
  STEPS.forEach((label, i) => {
    const li = el('li');
    if (i < active) li.className = 'done';
    else if (i === active) li.className = failed ? 'failed' : 'current';
    li.append(el('span', 'dot', i < active ? '✓' : String(i + 1)), el('span', 'lbl', label));
    list.append(li);
  });
  return list;
}

function showStatus(message, actionsUrl, downloadUrl, state = 'sending', expiresAt = '') {
  statusBox.replaceChildren();
  statusBox.className = 'status';

  // Selesai: tampilkan kartu unduhan APK
  if (downloadUrl) {
    statusBox.classList.add('ready');
    statusBox.append(buildStepper(4, false));
    const card = el('div', 'apk-card');
    card.append(el('div', 'apk-icon', 'APK'));
    const info = el('div', 'apk-info');
    const fileName = (currentAppName || 'Web2APK-Android') + '.apk';
    info.append(el('strong', '', fileName), el('span', 'meta', 'Siap dipasang di Android 5.0 ke atas'));
    card.append(info);
    statusBox.append(card);

    const download = el('a', 'download-button', '⬇ Download APK');
    download.href = downloadUrl + (currentAppName ? '?name=' + encodeURIComponent(currentAppName) : '');
    download.setAttribute('download', fileName);
    statusBox.append(download);

    const until = formatExpiry(expiresAt);
    if (until) statusBox.append(el('p', 'hint center', 'Tersedia sampai ' + until + '. Setelah itu, jalankan build lagi.'));

    const guide = el('details', 'guide');
    guide.open = true;
    guide.append(el('summary', '', 'Cara memasang'));
    const ol = el('ol');
    [
      'Ketuk Download APK, lalu buka file yang terunduh.',
      'Jika diminta, izinkan "Instal aplikasi tidak dikenal" untuk browser/Files yang dipakai.',
      'Ketuk Instal. Jika pernah memasang versi lama dengan package ID sama, hapus dulu aplikasi lama.'
    ].forEach(t => ol.append(el('li', '', t)));
    guide.append(ol);
    statusBox.append(guide);
  } else {
    // Sedang proses / gagal / error
    const failed = ['failed', 'ready-expired', 'error'].includes(state);
    const active = failed ? (state === 'ready-expired' ? 3 : 2) : (STATE_STEP[state] ?? 0);
    if (failed) statusBox.classList.add('error');
    statusBox.append(buildStepper(active, failed));
    statusBox.append(el('p', 'msg', message));
    if (!failed && state !== 'success') statusBox.append(el('div', 'bar'));
  }

  if (actionsUrl) {
    const a = el('a', 'detail-link', 'Lihat detail build di GitHub Actions ↗');
    a.href = actionsUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
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
    showStatus(data.message || 'Memeriksa status build…', data.actionsUrl, data.state === 'success' ? data.downloadUrl : null, data.state, data.expiresAt);
    if (['success', 'failed', 'ready-expired'].includes(data.state)) {
      if (pollTimer) clearInterval(pollTimer);
      button.disabled = false;
    }
  } catch (error) {
    showStatus(error.message || 'Belum bisa memeriksa status build. Coba lagi sebentar.', null, null, 'error');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (pollTimer) clearInterval(pollTimer);
  button.disabled = true;
  statusBox.hidden = false;
  showStatus('Mengirim permintaan build…', null, null, 'sending');
  try {
    currentAppName = document.querySelector('#appName').value.trim().replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
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
    showStatus('Permintaan diterima. Tombol download APK akan muncul otomatis di sini setelah build selesai (biasanya beberapa menit).', data.actionsUrl, null, 'waiting');
    pollTimer = setInterval(checkBuild, 8000);
    setTimeout(checkBuild, 2500);
  } catch (error) {
    showStatus(error.message || 'Terjadi kesalahan.', null, null, 'error');
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
