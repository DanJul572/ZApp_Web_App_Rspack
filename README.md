# ⚡ Zapp – Build Apps with Low-Code

ZApp adalah aplikasi **low-code** yang dirancang untuk membantu Anda membangun aplikasi lain dengan cepat, efisien, dan tanpa kerumitan teknis berlebih.  
Dengan ZApp, Anda bisa fokus pada ide dan logika bisnis, sementara hal teknis ditangani otomatis oleh sistem.

---

## 🚀 Fitur Utama
- ✨ **Low-code builder** – buat aplikasi lebih cepat tanpa harus menulis kode panjang.
- ⚡ **Powered by Rsbuild** – proses build dan preview super cepat.
- 🛠️ **Linting & Formatting** – menjaga kualitas kode tetap konsisten.

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
| `dev`       | `pnpm dev`                 | Menjalankan server pengembangan.                                          |
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

Linting kode:
```bash
pnpm lint
```

Cek & format kode:
```bash
pnpm check
```

---

## 📖 Roadmap

- [ ] Tambah integrasi drag & drop komponen.
- [ ] Dukungan ekspor multi-platform.
- [ ] Template aplikasi siap pakai.  
