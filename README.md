# 💸 Spendwise — Personal Expense Tracker

A clean, fast and private expense tracker built with **Next.js**, **React**, **TypeScript** and **Tailwind CSS**.
Track income and expenses, set monthly budgets per category and see exactly where your money goes. All data stays in your browser.

## ✨ Features

- **Monthly dashboard**: income, expenses, balance and savings rate, plus a comparison with last month
- **6-month trend chart**: income vs. expenses (custom SVG, no chart library). Click a month to open it
- **Spending by category**: donut chart with percentages
- **Budgets**: set a limit per category, with progress bars that turn amber at 80% and red when you go over
- **Transactions**: add, delete, search and filter by type or category, grouped by day
- **Multi-currency display**: PKR, USD, EUR, GBP, INR, AED
- **CSV export** for the selected month
- **Persistent** with `localStorage`, plus demo data on first visit
- **Responsive** layout and automatic **dark mode**

## 🛠️ Tech Stack

| Area      | Tech                                          |
| --------- | --------------------------------------------- |
| Framework | Next.js (App Router), React                   |
| Language  | TypeScript                                    |
| Styling   | Tailwind CSS                                  |
| State     | `useSyncExternalStore` + `localStorage`       |
| Charts    | Hand-built SVG components                     |
| Tooling   | ESLint, npm                                   |
| Hosting   | Vercel                                        |

## 🚀 Getting Started

```bash
git clone https://github.com/AroojDogar/spendwise.git
cd spendwise
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint               |

## 📁 Project Structure

```
src/
├── app/                 # Layout, page and global styles
├── components/          # Dashboard, charts, form, list, budgets
└── lib/
    ├── store.ts         # External store persisted to localStorage
    ├── categories.ts    # Category names, colors and emojis
    ├── demo.ts          # Deterministic demo data generator
    ├── format.ts        # Currency and date helpers
    └── csv.ts           # CSV export
```

## ☁️ Deploy

Deploy it on [Vercel](https://vercel.com/new): import the GitHub repo and click **Deploy**. No environment variables are needed.

## 📄 License

MIT
