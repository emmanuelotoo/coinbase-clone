import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { topMovers as staticMovers, getChangeColor, getChangeArrow, formatPrice } from "../../data/exploreData";
import { getCryptoGainers, mapCrypto } from "../../api";

const TopMoversCard = () => {
  const [idx, setIdx] = useState(0);
  const [movers, setMovers] = useState(staticMovers);

  useEffect(() => {
    getCryptoGainers()
      .then((data) => {
        const mapped = data.slice(0, 6).map((c) => {
          const m = mapCrypto(c);
          return { ...m, price: `$${formatPrice(m.price)}` };
        });
        if (mapped.length > 0) setMovers(mapped);
      })
      .catch(() => {});
  }, []);

  const shift = (dir) => {
    setIdx((prev) => {
      const next = prev + dir;
      if (next < 0) return Math.max(movers.length - 2, 0);
      if (next > movers.length - 2) return 0;
      return next;
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
          Top movers
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
      <p className="text-sm text-gray-500 mb-4">24hr change</p>
      <div className="flex gap-3 overflow-hidden">
        {movers.slice(idx, idx + 2).map((m) => (
          <div key={m.ticker} className="flex-1 bg-gray-50 rounded-xl p-4 min-w-0">
            {m.image ? (
              <img src={m.image} alt={m.ticker} className="w-10 h-10 rounded-full mb-3" />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3"
                style={{ backgroundColor: m.color }}
              >
                {m.letter}
              </div>
            )}
            <p className="text-sm font-semibold text-gray-700">{m.ticker}</p>
            <p className={`text-sm font-bold mt-1 ${getChangeColor(m.change)}`}>
              {getChangeArrow(m.change)} {Math.abs(m.change).toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">{m.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopMoversCard;
