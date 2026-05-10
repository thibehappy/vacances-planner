"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { PROFILES } from "./components/Avatars";

const ModelViewer = dynamic(() => import("./components/ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[280px] sm:h-[350px] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  ),
});

// ─── Types & Constants ──────────────────────────────────────

type Status = "unknown" | "available" | "maybe" | "unavailable";
type Data = Record<string, Record<string, Status>>;

const STATUS_CYCLE: Status[] = ["unknown", "available", "maybe", "unavailable"];

const STATUS_CONFIG: Record<
  Status,
  { label: string; bg: string; text: string; dot: string }
> = {
  available: {
    label: "Dispo",
    bg: "#bbf7d0",
    text: "#166534",
    dot: "#22c55e",
  },
  unavailable: {
    label: "Pas dispo",
    bg: "#fecaca",
    text: "#dc2626",
    dot: "#ef4444",
  },
  maybe: {
    label: "Si vraiment",
    bg: "#fef08a",
    text: "#a16207",
    dot: "#eab308",
  },
  unknown: {
    label: "Sais pas",
    bg: "#f3f4f6",
    text: "#9ca3af",
    dot: "#d1d5db",
  },
};

const MOIS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// ─── Date Utilities ─────────────────────────────────────────

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface MonthData {
  month: number;
  year: number;
  label: string;
  dates: Date[];
}

function generateMonths(): MonthData[] {
  const allDates: Date[] = [];
  const d = new Date(2026, 4, 25);
  const end = new Date(2026, 7, 30);
  while (d <= end) {
    allDates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }

  const groups: MonthData[] = [];
  let currentMonth = -1;
  for (const date of allDates) {
    const m = date.getMonth();
    if (m !== currentMonth) {
      currentMonth = m;
      groups.push({
        month: m,
        year: date.getFullYear(),
        label: `${MOIS[m]} ${date.getFullYear()}`,
        dates: [],
      });
    }
    groups[groups.length - 1].dates.push(date);
  }
  return groups;
}

function buildGrid(dates: Date[]): (Date | null)[][] {
  if (!dates.length) return [];
  const firstDow = (dates[0].getDay() + 6) % 7;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (const d of dates) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

const MONTHS = generateMonths();
const ALL_DATES = MONTHS.flatMap((m) => m.dates);

// ─── Main Component ─────────────────────────────────────────

export default function Home() {
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [data, setData] = useState<Data>({});
  const [mounted, setMounted] = useState(false);
  const [brushColor, setBrushColor] = useState<Status | null>(null);
  const [activeTab, setActiveTab] = useState<"mine" | "group">("mine");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vacances-planner-name");
    if (saved) setUserName(saved);
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/availability");
      if (res.ok) setData(await res.json());
    } catch {
      /* offline */
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 4000);
    return () => clearInterval(id);
  }, [fetchData]);

  const registerUser = async (name: string) => {
    try {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      fetchData();
    } catch {
      /* offline */
    }
  };

  const handleJoin = async () => {
    const name = nameInput.trim();
    if (!name) return;
    setUserName(name);
    localStorage.setItem("vacances-planner-name", name);
    await registerUser(name);
  };

  const handleLeave = () => {
    setUserName("");
    setNameInput("");
    localStorage.removeItem("vacances-planner-name");
  };

  const handleDeleteData = async () => {
    if (!userName) return;
    try {
      await fetch("/api/availability", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName }),
      });
      handleLeave();
      fetchData();
    } catch {
      /* offline */
    }
  };

  const updateStatus = async (dateStr: string, status: Status) => {
    setData((prev) => ({
      ...prev,
      [userName]: { ...(prev[userName] || {}), [dateStr]: status },
    }));
    try {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, date: dateStr, status }),
      });
    } catch {
      /* offline */
    }
  };

  const handleCellClick = (date: Date) => {
    if (!userName) return;
    const key = dateKey(date);
    if (brushColor) {
      updateStatus(key, brushColor);
    } else {
      const current = data[userName]?.[key] || "unknown";
      const nextIdx = (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length;
      updateStatus(key, STATUS_CYCLE[nextIdx]);
    }
  };

  const handleSetAll = async (status: Status) => {
    if (!userName) return;
    const updates: Record<string, Status> = {};
    for (const d of ALL_DATES) {
      updates[dateKey(d)] = status;
    }
    setData((prev) => ({
      ...prev,
      [userName]: { ...(prev[userName] || {}), ...updates },
    }));
    for (const d of ALL_DATES) {
      fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, date: dateKey(d), status }),
      }).catch(() => {});
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!mounted) return null;

  // ─── Profile Selection Screen ─────────────────────────────

  const selectProfile = async (name: string) => {
    setUserName(name);
    localStorage.setItem("vacances-planner-name", name);
    await registerUser(name);
  };

  if (!userName) {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-800">
          🏖️ Vacances 2026
        </h1>
        <p className="text-gray-500 mt-2 mb-8">Qui es-tu ?</p>

        {/* Profile Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-2xl w-full">
          {PROFILES.map(({ name, tagline, Avatar, color }) => (
            <button
              key={name}
              onClick={() => selectProfile(name)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white shadow-sm hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-transparent group"
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-4 transition-all"
                style={{ "--tw-ring-color": color } as React.CSSProperties}
              >
                <Avatar />
              </div>
              <span className="font-semibold text-gray-800 text-sm">
                {name}
              </span>
              <span className="text-[11px] text-gray-400 leading-tight">
                {tagline}
              </span>
            </button>
          ))}
        </div>

        {/* 3D Model - small decorative */}
        <div className="mt-10 w-full max-w-2xl mx-auto">
          <ModelViewer />
        </div>
      </div>
    );
  }

  // ─── Calendar View ──────────────────────────────────────

  const participants = Object.keys(data);
  const others = participants.filter((p) => p !== userName);
  const myProfile = PROFILES.find((p) => p.name === userName);
  const MyAvatar = myProfile?.Avatar;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🏖️</span> Vacances 2026
          </h1>
          <div className="flex items-center gap-2">
            {MyAvatar && (
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-100">
                <MyAvatar />
              </div>
            )}
            <span className="text-sm font-semibold text-gray-800 hidden sm:inline">
              {userName}
            </span>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={handleLeave}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Changer
              </button>
              <button
                onClick={handleDeleteData}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Participants */}
        {participants.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Participants ({participants.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <span
                  key={p}
                  className={`px-3 py-1 rounded-full text-sm ${
                    p === userName
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {p}
                  {p === userName && " (toi)"}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tab Switcher + Save Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("mine")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "mine"
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mes dispos
            </button>
            <button
              onClick={() => setActiveTab("group")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "group"
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Vue du groupe
            </button>
          </div>
          <button
            onClick={handleSave}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              saved
                ? "bg-green-500 text-white scale-105"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {saved ? "Enregistré !" : "Enregistrer"}
          </button>
        </div>

        {/* ─── Tab: Mes dispos ─────────────────────────────── */}
        {activeTab === "mine" && (
          <>
            {/* Legend + Brush selector */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-wrap gap-x-3 gap-y-2 items-center justify-center text-sm">
                {STATUS_CYCLE.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setBrushColor(brushColor === s ? null : s)
                    }
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      brushColor === s
                        ? "ring-2 ring-indigo-500 ring-offset-2 scale-105 shadow-sm"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-md border border-gray-200"
                      style={{ backgroundColor: STATUS_CONFIG[s].bg }}
                    />
                    <span className="text-gray-600">
                      {STATUS_CONFIG[s].label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                {brushColor
                  ? `Mode pinceau : ${STATUS_CONFIG[brushColor].label} — clique sur les jours pour appliquer`
                  : "Clique sur une couleur pour activer le pinceau, ou clique un jour pour cycler"}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500 mb-2 text-center">
                Remplissage rapide :
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleSetAll("available")}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    backgroundColor: STATUS_CONFIG.available.bg,
                    color: STATUS_CONFIG.available.text,
                  }}
                >
                  Tout dispo
                </button>
                <button
                  onClick={() => handleSetAll("unavailable")}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    backgroundColor: STATUS_CONFIG.unavailable.bg,
                    color: STATUS_CONFIG.unavailable.text,
                  }}
                >
                  Tout indispo
                </button>
                <button
                  onClick={() => handleSetAll("unknown")}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    backgroundColor: STATUS_CONFIG.unknown.bg,
                    color: STATUS_CONFIG.unknown.text,
                  }}
                >
                  Tout effacer
                </button>
              </div>
            </div>

            {/* Calendar Months */}
            {MONTHS.map((monthData) => {
              const grid = buildGrid(monthData.dates);
              return (
                <div
                  key={monthData.label}
                  className="bg-white rounded-xl shadow-sm p-4"
                >
                  <h2 className="text-lg font-bold text-gray-800 mb-3">
                    {monthData.label}
                  </h2>

                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {JOURS.map((j) => (
                      <div
                        key={j}
                        className="text-center text-xs font-semibold text-gray-400 py-1"
                      >
                        {j}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {grid.flat().map((date, idx) => {
                      if (!date) {
                        return <div key={`e-${idx}`} className="h-10" />;
                      }

                      const key = dateKey(date);
                      const myStatus = (data[userName]?.[key] ||
                        "unknown") as Status;
                      const cfg = STATUS_CONFIG[myStatus];
                      const isWeekend =
                        date.getDay() === 0 || date.getDay() === 6;

                      return (
                        <div
                          key={key}
                          onClick={() => handleCellClick(date)}
                          className="relative h-10 rounded-lg cursor-pointer border-2 border-transparent hover:border-indigo-400 transition-all select-none"
                          style={{ backgroundColor: cfg.bg }}
                          title={buildTooltip(date, data, participants)}
                        >
                          <span
                            className={`absolute inset-0 flex items-center justify-center text-sm font-semibold ${isWeekend ? "underline" : ""}`}
                            style={{ color: cfg.text }}
                          >
                            {date.getDate()}
                          </span>

                          {others.length > 0 && (
                            <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-[2px]">
                              {others.map((p) => {
                                const s = (data[p]?.[key] ||
                                  "unknown") as Status;
                                return (
                                  <div
                                    key={p}
                                    className="rounded-full"
                                    style={{
                                      width: 5,
                                      height: 5,
                                      backgroundColor:
                                        STATUS_CONFIG[s].dot,
                                      opacity:
                                        s === "unknown" ? 0.3 : 1,
                                    }}
                                  />
                                );
                              })}
                            </div>
                          )}

                          {participants.length > 1 &&
                            (() => {
                              const avail = participants.filter(
                                (p) =>
                                  data[p]?.[key] === "available"
                              ).length;
                              if (avail === 0) return null;
                              return (
                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                                  {avail}
                                </div>
                              );
                            })()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ─── Tab: Vue du groupe ──────────────────────────── */}
        {activeTab === "group" && (
          <>
            {/* Legend (read-only) */}
            <div className="bg-white rounded-xl shadow-sm p-3">
              <div className="flex flex-wrap gap-x-5 gap-y-1 items-center justify-center text-sm">
                {STATUS_CYCLE.map((s) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: STATUS_CONFIG[s].dot }}
                    />
                    <span className="text-gray-500 text-xs">
                      {STATUS_CONFIG[s].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {participants.length < 2 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
                En attente d&apos;autres participants...
              </div>
            ) : (
              <>
                {MONTHS.map((monthData) => (
                  <div
                    key={monthData.label}
                    className="bg-white rounded-xl shadow-sm p-4"
                  >
                    <h2 className="text-lg font-bold text-gray-800 mb-3">
                      {monthData.label}
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="sticky left-0 bg-white z-10 text-left pr-3 py-1 text-xs text-gray-400 font-medium min-w-[80px]" />
                            {monthData.dates.map((d) => {
                              const isWe =
                                d.getDay() === 0 ||
                                d.getDay() === 6;
                              return (
                                <th
                                  key={dateKey(d)}
                                  className={`px-0 py-1 text-[10px] text-center min-w-[24px] font-normal ${isWe ? "text-gray-600 font-semibold" : "text-gray-400"}`}
                                >
                                  {d.getDate()}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((p) => (
                            <tr key={p}>
                              <td className="sticky left-0 bg-white z-10 pr-3 py-0.5 text-xs text-gray-600 font-medium whitespace-nowrap">
                                {p}
                                {p === userName
                                  ? " (toi)"
                                  : ""}
                              </td>
                              {monthData.dates.map((d) => {
                                const s = (data[
                                  p
                                ]?.[dateKey(d)] ||
                                  "unknown") as Status;
                                return (
                                  <td
                                    key={dateKey(d)}
                                    className="px-0 py-0.5"
                                  >
                                    <div
                                      className="w-[20px] h-[20px] rounded-sm mx-auto"
                                      style={{
                                        backgroundColor:
                                          STATUS_CONFIG[s]
                                            .dot,
                                        opacity:
                                          s === "unknown"
                                            ? 0.15
                                            : 1,
                                      }}
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                <BestPeriods
                  data={data}
                  participants={participants}
                />
              </>
            )}
          </>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 pb-8">
          Vacances Planner 2026 &mdash; Les dispos se mettent a jour
          automatiquement
        </p>
      </main>
    </div>
  );
}

// ─── Tooltip builder ──────────────────────────────────────

function buildTooltip(
  date: Date,
  data: Data,
  participants: string[]
): string {
  const key = dateKey(date);
  const lines = [
    `${date.getDate()} ${MOIS[date.getMonth()]} ${date.getFullYear()}`,
    "",
  ];
  for (const p of participants) {
    const s = (data[p]?.[key] || "unknown") as Status;
    const icon =
      s === "available"
        ? "[v]"
        : s === "unavailable"
          ? "[x]"
          : s === "maybe"
            ? "[~]"
            : "[?]";
    lines.push(`${icon} ${p}: ${STATUS_CONFIG[s].label}`);
  }
  return lines.join("\n");
}

// ─── Best Periods Component ───────────────────────────────

function BestPeriods({
  data,
  participants,
}: {
  data: Data;
  participants: string[];
}) {
  const dayScores = ALL_DATES.map((d) => {
    const key = dateKey(d);
    const available = participants.filter(
      (p) => data[p]?.[key] === "available"
    ).length;
    const maybe = participants.filter(
      (p) => data[p]?.[key] === "maybe"
    ).length;
    return { date: d, available, maybe, score: available + maybe * 0.5 };
  });

  interface Period {
    start: Date;
    end: Date;
    avgScore: number;
    minAvailable: number;
    days: number;
  }

  const periods: Period[] = [];

  for (let len = 14; len >= 3; len--) {
    for (let i = 0; i <= dayScores.length - len; i++) {
      const slice = dayScores.slice(i, i + len);
      const avgScore = slice.reduce((s, d) => s + d.score, 0) / len;
      const minAvailable = Math.min(...slice.map((d) => d.available));
      if (minAvailable >= 1 && avgScore >= 1) {
        periods.push({
          start: slice[0].date,
          end: slice[slice.length - 1].date,
          avgScore,
          minAvailable,
          days: len,
        });
      }
    }
  }

  periods.sort((a, b) => b.avgScore - a.avgScore || b.days - a.days);

  const best: Period[] = [];
  for (const p of periods) {
    if (best.length >= 3) break;
    const overlaps = best.some(
      (b) => p.start <= b.end && p.end >= b.start
    );
    if (!overlaps) best.push(p);
  }

  if (best.length === 0) return null;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        Meilleures periodes
      </h2>
      <div className="space-y-2">
        {best.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100"
          >
            <span className="text-2xl">{medals[i]}</span>
            <div>
              <span className="font-semibold text-gray-800">
                {r.start.getDate()} {MOIS[r.start.getMonth()]} &mdash;{" "}
                {r.end.getDate()} {MOIS[r.end.getMonth()]}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                ({r.days} jours, min. {r.minAvailable} dispo
                {r.minAvailable > 1 ? "s" : ""})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
