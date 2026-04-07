# Panduan Kontribusi (Contributing Guide)

Terima kasih telah tertarik untuk berkontribusi pada **Kawanua Indo Digital App**! Kami sangat menghargai bantuan Anda dalam membuat proyek ini menjadi lebih baik.

Dokumen ini berisi panduan untuk membantu Anda memulai proses kontribusi, mulai dari melaporkan masalah hingga mengirimkan kode.

---

## 🚀 Memulai

### Melaporkan Bug atau Masalah

Jika Anda menemukan bug, silakan buka [GitHub Issue](https://github.com/KawanuaDev/app-kawanua/issues) dan berikan informasi berikut:

- Judul yang jelas dan deskriptif.
- Langkah-langkah untuk mereproduksi masalah tersebut.
- Hasil yang diharapkan vs hasil yang sebenarnya terjadi.
- Informasi lingkungan (browser, OS, versi node).
- Screenshot (jika relevan).

### Mengusulkan Fitur Baru

Kami sangat terbuka untuk ide-ide baru! Untuk mengusulkan fitur:

- Periksa daftar issue untuk memastikan ide tersebut belum pernah diusulkan.
- Buka issue baru dengan label `enhancement` atau `feature request`.
- Jelaskan mengapa fitur ini berguna dan bagaimana cara kerjanya.

---

## 🛠️ Langkah-langkah Pengembangan

1. **Fork Repositori**: Klik tombol 'Fork' di pojok kanan atas halaman repositori ini.
2. **Klon Repositori**:
   ```bash
   git clone https://github.com/username-anda/app-kawanua.git
   cd app-kawanua
   ```
3. **Instal Dependensi**: Kami menggunakan `pnpm` sebagai package manager.
   ```bash
   pnpm install
   ```
4. **Buat Branch Baru**: Gunakan nama branch yang mengikuti format `tipe/nama-singkat`.
   ```bash
   git checkout -b feat/fitur-keren
   # atau
   git checkout -b feature/fitur-keren
   # atau
   git checkout -b fix/perbaikan-bug
   ```
5. **Lakukan Perubahan**: Implementasikan kode Anda. Pastikan untuk mengikuti gaya kode yang ada.
6. **Jalankan Verifikasi**: Sebelum melakukan commit, pastikan kode Anda lolos pengecekan:
   ```bash
   pnpm lint   # Cek kesalahan penulisan kode
   pnpm test   # Jalankan unit test
   ```

---

## 📝 Panduan Pesan Commit (Conventional Commits)

Proyek ini mengikuti spesifikasi [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Hal ini membantu kita dalam membuat log perubahan (changelog) yang rapi dan terotomatisasi.

### Format Standar:

```text
<type>(<scope>): <description>

[body]

[footer(s)]
```

### Tipe-tipe Commit (`<type>`):

- **feat**: Menambahkan fitur baru ke dalam kode (berkaitan dengan `MINOR` di Semantic Versioning).
- **fix**: Memperbaiki bug (berkaitan dengan `PATCH` di Semantic Versioning).
- **docs**: Perubahan pada dokumentasi saja.
- **style**: Perubahan yang tidak mempengaruhi makna kode (white-space, formatting, missing semi-colons, dll).
- **refactor**: Perubahan kode yang tidak memperbaiki bug maupun menambah fitur.
- **perf**: Perubahan kode yang meningkatkan performa.
- **test**: Menambah atau memperbaiki test yang sudah ada.
- **build**: Perubahan yang mempengaruhi sistem build atau dependensi eksternal (contoh: gulp, broccoli, npm).
- **ci**: Perubahan pada file konfigurasi dan skrip CI (contoh: GitHub Actions, Travis, CircleCI).
- **chore**: Perubahan lain yang tidak memodifikasi file `src` atau file test.
- **revert**: Membatalkan (revert) commit sebelumnya.

### Scope (`<scope>`):

Opsional, digunakan untuk memberikan konteks pada lokasi perubahan (misal: `ui`, `api`, `auth`, `password-checker`).

### Contoh Commit:

- `feat(ui): tambahkan komponen button baru`
- `fix(security): cegah brute force pada login`
- `docs: perbarui panduan instalasi di README`
- `feat!: rombak total sistem navigasi` (Menggunakan `!` untuk menandakan **Breaking Change**)

---

## 📤 Mengirim Pull Request (PR)

1. **Push ke GitHub**:
   ```bash
   git push origin branch-anda
   ```
2. **Buat Pull Request**: Buka repositori asli dan Anda akan melihat saran untuk membuat PR.
3. **Deskripsi PR**: Jelaskan apa yang Anda lakukan, masalah apa yang diselesaikan (sebutkan nomor issue jika ada, misal: `Fixes #123`), dan lampirkan screenshot jika ada perubahan UI.
4. **Tinjauan Kode**: Tim kami akan meninjau PR Anda. Kami mungkin meminta beberapa perubahan sebelum menyetujuinya.
5. **Merge**: Setelah disetujui, PR Anda akan digabungkan ke branch utama!

---

Terima kasih telah menjadi bagian dari komunitas Kawanua! 🚀
