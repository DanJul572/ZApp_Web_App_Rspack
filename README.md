# ⚡ Zapp – Build Apps with Low-Code

📌 **Version:** 1.0.16

**Zapp** is a **low-code application builder** designed to help you create apps quickly, efficiently, and without complex technical overhead.  
Focus on your ideas and business logic — Zapp handles the technical side automatically.

---

## 🚀 Key Features

- ✨ **Low-code Builder** – Create applications faster without writing long code.
- ⚡ **Powered by Rsbuild** – Super-fast build and preview process.
- 🎨 **Material UI & Emotion** – Modern design with flexible styling.
- 📊 **Interactive Components** – Charts, date pickers, tree views, and tables ready to use.
- 🌍 **Internationalization (i18n)** – Easily support multiple languages using `i18next`.
- 📦 **Data Export** – Export data to **CSV** or **PDF** formats.
- 📝 **Rich Text Editor** – Integrated with **Editor.js** for flexible text editing.
- 🛠️ **Linting & Formatting** – Keep your code clean and consistent with **Biome**.
- 🔗 **React Router & React Query** – Modern state management and routing.
- 💾 **Secure Utilities** – Built-in support for encryption and unique IDs using `crypto-js` and `uuid`.

---

## 📦 Setup

Install dependencies:

```bash
pnpm install
```

---

## 🛠️ Available Scripts

The following scripts can be run from `package.json`:

| Script      | Command           | Description                                                          |
|--------------|------------------|----------------------------------------------------------------------|
| `dev`        | `pnpm dev`       | Run the development server using **Rsbuild**.                        |
| `build`      | `pnpm build`     | Build the application for production.                                |
| `preview`    | `pnpm preview`   | Run a local preview of the production build.                         |
| `lint`       | `pnpm lint`      | Check and fix code formatting using **Biome**.                       |
| `format`     | `pnpm format`    | Automatically format code using **Biome**.                           |
| `prepare`    | `pnpm prepare`   | Initialize **Husky** for Git hooks.                                  |

---

## 🚦 Usage

Start the development server:
```bash
pnpm dev
```

Build for production:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

Check and format code:
```bash
pnpm lint
```

---

## 📚 Tech Stack

- **Build Framework:** [Rsbuild](https://rsbuild.dev/)
- **UI & Styling:** [Material UI](https://mui.com/), [Emotion](https://emotion.sh/), [@fontsource/inter](https://fontsource.org/)
- **UI Components:** Charts, Date Pickers, Tree View, Tables, File Input
- **Editor:** [Editor.js](https://editorjs.io/)
- **Data & State:** [React Query](https://tanstack.com/query), [Axios](https://axios-http.com/)
- **Internationalization:** [i18next](https://www.i18next.com/)
- **Data Export:** `export-to-csv`, `jspdf`, `jspdf-autotable`
- **Utilities:** `uuid`, `dayjs`, `crypto-js`, `prop-types`
- **Development Tools:** `Biome`, `Husky`

---

## 📖 Roadmap

- [ ] Add drag & drop component integration.  
- [ ] Multi-platform export support.  
- [ ] Ready-to-use app templates.  
- [ ] Real-time collaboration mode.  
- [ ] Plugin marketplace for feature extensions.  

---

## 📜 License

This project is **private** and not intended for public distribution.
