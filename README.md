---

# 🧱 m4stack

A modern, full-stack starter template built with the latest tech to kickstart your web application projects — available on [npm](https://www.npmjs.com/package/m4stack).

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Validation:** [Zod](https://zod.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Email:** [Resend](https://resend.com/)
- **HTTP Requests:** [Axios](https://axios-http.com/)

---

## 📦 Installation

Install via npm:

```bash
npx m4stack my-app
cd my-app
npm install
```

---

## 🛠️ Features

- 🔐 Auth-ready with NextAuth.js
- 🎨 Preconfigured TailwindCSS setup
- ⚙️ Type-safe backend with Prisma & Zod
- ✉️ Email integration using Resend
- 🌐 API calls simplified with Axios
- 📁 Clean project structure for scalability
- ✅ Fully TypeScript-enabled

---

## 🧑‍💻 Getting Started

1. **Clone the project (if using manually):**

   ```bash
   git clone https://github.com/yourusername/m4stack.git
   cd m4stack
   ```

2. **Set up environment variables:**

   Create a `.env` file using `.env.example` as reference.

3. **Generate Prisma schema, Migrate then Seed initial data:**

   ```bash
   npm run gen
   npm run migrate
   npm run seed
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Push your changes to GitHub and start building!**

---

## 📂 Project Structure

```
/app          → App directory with route handlers (Next.js 13+)
/components   → Reusable UI components
/lib          → Helper utilities and libs
/app/api    → API routes (if needed)
/prisma       → Prisma schema & migrations & Prisma Client
/public       → Static files
/styles       → Tailwind CSS configs
/types        → Custom TypeScript types
/utils        → Utility functions
/services     → Auth, Email, and other service integrations
```

---

## 🔧 Customization

- Configure authentication providers via `services/auth.ts`
- Extend your Prisma schema in `/prisma/schema.prisma`
- Customize your UI in `/components` and Tailwind config

---

## 🧪 Lint & Format

```bash
npm run lint    # Lint code using ESLint
npm run format  # Format code using Prettier
```

---

## 📦 Publish Template

This repo is available on [npm](https://www.npmjs.com/package/m4stack). To use it:

```bash
npx m4stack your-app-name
```

---

## 🤝 Contributing

Pull requests are welcome! If you have ideas for improvements or fixes, feel free to open an issue or PR.

---
