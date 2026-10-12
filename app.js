const form = document.querySelector('#buildForm');
const button = document.querySelector('#submit');
const statusBox = document.querySelector('#status');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  button.disabled = true;
  statusBox.hidden = false;
  statusBox.textContent = 'Mengirim permintaan build…';
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
    statusBox.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = 'Permintaan build berhasil dikirim.';
    const p = document.createElement('p');
    p.textContent = 'Buka GitHub Actions untuk melihat progres. Setelah selesai, buka run terbaru → Artifacts → web2apk-debug-apk.zip.';
    const a = document.createElement('a');
    a.href = data.actionsUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Buka GitHub Actions ↗';
    statusBox.append(title, p, a);
  } catch (error) {
    statusBox.textContent = error.message || 'Terjadi kesalahan.';
  } finally {
    button.disabled = false;
  }
});
