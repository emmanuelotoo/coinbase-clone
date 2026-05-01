const API_BASE = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Auth
export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (name, email, password) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const getProfile = () => request("/user/profile");

export const logout = () => {
  localStorage.removeItem("token");
};

// Crypto
export const getCryptos = () => request("/crypto");
export const getCryptoGainers = () => request("/crypto/gainers");
export const getCryptoNew = () => request("/crypto/new");

// Map API crypto object to the shape UI components expect
const SYMBOL_COLORS = {
  BTC: "#F7931A", ETH: "#627EEA", USDT: "#26A17B", BNB: "#F3BA2F",
  XRP: "#346AA9", USDC: "#2775CA", SOL: "#000000", TRX: "#FF0013",
  DOGE: "#C3A634", ADA: "#0033AD", LINK: "#2A5ADA", AVAX: "#E84142",
  SHIB: "#FFA409", DOT: "#E6007A", BCH: "#8DC351", UNI: "#FF007A",
  LTC: "#345D9D", XLM: "#14B6E7", ATOM: "#2E3148", POL: "#8247E5",
};

const SYMBOL_LETTERS = {
  BTC: "₿", ETH: "Ξ", USDT: "₮", USDC: "$",
};

function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 60%, 45%)`;
}

export function mapCrypto(c) {
  const sym = (c.symbol || "").toUpperCase();
  return {
    id: c._id || sym.toLowerCase(),
    name: c.name,
    ticker: sym,
    price: c.price,
    change: c.change24h ?? 0,
    image: c.image || null,
    color: SYMBOL_COLORS[sym] || hashColor(sym),
    letter: SYMBOL_LETTERS[sym] || sym.charAt(0) || "?",
    createdAt: c.createdAt,
  };
}
