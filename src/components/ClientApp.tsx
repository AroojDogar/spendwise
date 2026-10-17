"use client";

import dynamic from "next/dynamic";

// The dashboard reads localStorage and today's date, so render it only in the browser
// to avoid hydration mismatches with the statically generated HTML.
const Dashboard = dynamic(() => import("./Dashboard"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6 px-4 py-10 sm:px-6">
      <div className="h-10 w-48 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  ),
});

export default function ClientApp() {
  return <Dashboard />;
}
