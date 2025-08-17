# ⚡ Zapp – Build Apps with Low-Code

📌 Versi: **1.0.0**

ZApp adalah aplikasi **low-code** yang dirancang untuk membantu Anda membangun aplikasi lain dengan cepat, efisien, dan tanpa kerumitan teknis berlebih.  
Dengan ZApp, Anda bisa fokus pada ide dan logika bisnis, sementara hal teknis ditangani otomatis oleh sistem.

---

## 🚀 Fitur Utama
- ✨ **Low-code builder** – buat aplikasi lebih cepat tanpa harus menulis kode panjang.
- ⚡ **Powered by Rsbuild** – proses build dan preview super cepat.
- 🎨 **Material UI & Emotion** – desain modern dengan dukungan styling fleksibel.
- 📊 **Komponen interaktif** – chart, date-picker, tree-view, dan tabel siap pakai.
- 🌍 **Internasionalisasi (i18n)** – mudah menambahkan banyak bahasa dengan `i18next`.
- 📦 **Ekspor Data** – dukungan ekspor ke CSV & PDF.
- 📝 **Rich Text Editor** – integrasi editor teks (SunEditor).
- 🛠️ **Linting & Formatting** – menjaga kualitas kode tetap konsisten dengan **Biome**.
- 🔗 **React Router & React Query** – manajemen state & routing modern.

---

## 📦 Setup

Install dependencies:

```bash
pnpm install
```

---

## 🛠️ Perintah yang Tersedia

Berikut adalah daftar script yang dapat dijalankan melalui `package.json`:

| Script      | Perintah                   | Deskripsi                                                                 |
|-------------|----------------------------|---------------------------------------------------------------------------|
| `dev`       | `pnpm dev`                 | Menjalankan server pengembangan dengan **Rsbuild**.                       |
| `build`     | `pnpm build`               | Build aplikasi untuk produksi.                                            |
| `preview`   | `pnpm preview`             | Menjalankan preview lokal dari hasil build produksi.                      |
| `lint`      | `pnpm lint`                | Mengecek & memperbaiki kode dengan **ESLint**.                            |
| `check`     | `pnpm check`               | Mengecek & memperbaiki format kode menggunakan **Biome**.                 |

---

## 🚦 Cara Penggunaan

Jalankan server pengembangan:
```bash
pnpm dev
```

Build untuk produksi:
```bash
pnpm build
```

Preview hasil build:
```bash
pnpm preview
```

Cek & format kode:
```bash
pnpm check
```

---

## 📚 Teknologi yang Digunakan

- **Framework Build**: [Rsbuild](https://rsbuild.dev/)
- **UI & Styling**: [Material UI](https://mui.com/), [Emotion](https://emotion.sh/), [@fontsource/roboto](https://fontsource.org/)
- **Komponen UI Tambahan**: Charts, Date Pickers, Tree View, Tables, File Input
- **Editor**: [SunEditor](https://github.com/JiHong88/SunEditor) + React wrapper
- **Data & State**: [React Query](https://tanstack.com/query), [Axios](https://axios-http.com/)
- **Internasionalisasi**: [i18next](https://www.i18next.com/)
- **Ekspor Data**: `export-to-csv`, `jspdf`, `jspdf-autotable`
- **Utils**: `uuid`, `dayjs`, `crypto-js`, `prop-types`
- **Dev Tools**: ESLint, Biome, dotenv-webpack

---

## 📖 Roadmap

- [ ] Tambah integrasi drag & drop komponen.
- [ ] Dukungan ekspor multi-platform.
- [ ] Template aplikasi siap pakai.
- [ ] Mode kolaborasi real-time.
- [ ] Plugin marketplace untuk ekstensi fitur.

---

## 📜 Lisensi

Proyek ini bersifat **private** dan tidak untuk distribusi publik.
