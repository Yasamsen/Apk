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

async function checkBuild() {
  try {
    const response = await fetch('/api/status' + (currentBuildAfter ? '?after=' + encodeURIComponent(currentBuildAfter) : ''), { cache: 'no-store' });
    const data = await response.json();
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
      packageName: document.querySelector('#packageName').value.trim()
    };
    const response = await fetch('/api/build', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await response.json();
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
