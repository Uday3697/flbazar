"use client";

import { useState } from "react";
import { dashboardInputClass } from "@/components/panel/panel-styles";

const MAX_LINKS = 5;

export function MultiDownloadUrlFields() {
  const [count, setCount] = useState(1);

  return (
    <div className="md:col-span-2 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Download links (optional parts)</p>
        {count < MAX_LINKS ? (
          <button
            type="button"
            onClick={() => setCount((value) => Math.min(MAX_LINKS, value + 1))}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            + Add link
          </button>
        ) : null}
      </div>
      <p className="text-xs text-slate-500">
        For large sample packs split into parts — add up to {MAX_LINKS} URLs. Part 1 is required if you use multiple links.
      </p>
      {Array.from({ length: count }, (_, index) => (
        <input
          key={index}
          name={`downloadUrl${index + 1}`}
          placeholder={`Download URL part ${index + 1}${index === 0 ? " (required if using parts)" : " (optional)"}`}
          className={dashboardInputClass}
        />
      ))}
    </div>
  );
}
