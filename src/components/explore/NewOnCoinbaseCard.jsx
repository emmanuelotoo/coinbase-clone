import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { newOnCoinbase as staticNew } from "../../data/exploreData";
import { getCryptoNew, mapCrypto } from "../../api";

const NewOnCoinbaseCard = () => {
  const [idx, setIdx] = useState(0);
  const [items, setItems] = useState(staticNew);

  useEffect(() => {
    getCryptoNew()
      .then((data) => {
        const mapped = data.slice(0, 6).map((c) => {
          const m = mapCrypto(c);
          const d = c.createdAt ? new Date(c.createdAt) : null;
          const date = d
            ? `Added ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
            : "";
          return { ...m, date };
        });
        if (mapped.length > 0) setItems(mapped);
      })
      .catch(() => {});
  }, []);

  const shift = (dir) => {
    setIdx((prev) => {
      const next = prev + dir;
      if (next < 0) return Math.max(items.length - 2, 0);
      if (next > items.length - 2) return 0;
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          New on Coinbase
        </h3>
        <div className="flex gap-2">
          <button onClick={() => shift(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button onClick={() => shift(1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex gap-3 overflow-hidden">
        {items.slice(idx, idx + 2).map((n) => (
          <div key={n.ticker} className="flex-1 bg-gray-50 rounded-xl p-4 min-w-0">
            {n.image ? (
              <img src={n.image} alt={n.ticker} className="w-10 h-10 rounded-full mb-3" />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3"
                style={{ backgroundColor: n.color }}
              >
                {n.letter}
              </div>
            )}
            <p className="text-xs text-gray-500 uppercase">{n.ticker}</p>
            <p className="text-sm font-bold text-gray-900">{n.name}</p>
            <p className="text-xs text-gray-400 mt-1">{n.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewOnCoinbaseCard;
