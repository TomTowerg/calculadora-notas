import { useState } from "react";
import {
  BookOpen, BarChart2, User, CheckCircle2, Clock, ChevronRight,
  ChevronDown, Plus, X, Star, TrendingUp, Award, GraduationCap,
  Settings, Bell, BookMarked, Check, AlertTriangle, ChevronUp,
} from "lucide-react";

type Page = "ramos" | "resumen" | "perfil";

interface Evaluacion {
  nombre: string;
  categoria: string;
  ponderacion: number;
  nota: number | null;
}

interface Ramo {
  name: string;
  code: string;
  credits: number;
  color: string;
  aprobMin: number;
  npWeight: number;
  examenWeight: number;
  evaluaciones: Evaluacion[];
}

const ramosData: Ramo[] = [
  {
    name: "Optimización",
    code: "MAT401",
    credits: 5,
    color: "#3b82f6",
    aprobMin: 4.0,
    npWeight: 60,
    examenWeight: 40,
    evaluaciones: [
      { nombre: "Prueba 1", categoria: "Prueba", ponderacion: 25, nota: 2.8 },
      { nombre: "Prueba 2", categoria: "Prueba", ponderacion: 25, nota: 5.0 },
      { nombre: "Prueba 3", categoria: "Prueba", ponderacion: 25, nota: 5.7 },
      { nombre: "Control 1", categoria: "Control", ponderacion: 2.5, nota: 6.5 },
      { nombre: "Control 2", categoria: "Control", ponderacion: 2.5, nota: 6.0 },
      { nombre: "Control 3", categoria: "Control", ponderacion: 2.5, nota: 5.3 },
      { nombre: "Control 4", categoria: "Control", ponderacion: 2.5, nota: null },
      { nombre: "Proyecto", categoria: "Proyecto", ponderacion: 15, nota: null },
    ],
  },
  {
    name: "Física Mecánica",
    code: "FIS201",
    credits: 5,
    color: "#8b5cf6",
    aprobMin: 4.0,
    npWeight: 60,
    examenWeight: 40,
    evaluaciones: [
      { nombre: "Solemne 1", categoria: "Solemne", ponderacion: 35, nota: 6.5 },
      { nombre: "Laboratorio", categoria: "Lab", ponderacion: 25, nota: 5.8 },
      { nombre: "Solemne 2", categoria: "Solemne", ponderacion: 40, nota: null },
    ],
  },
  {
    name: "Programación Avanzada",
    code: "INF302",
    credits: 3,
    color: "#10b981",
    aprobMin: 4.0,
    npWeight: 70,
    examenWeight: 30,
    evaluaciones: [
      { nombre: "Proyecto 1", categoria: "Proyecto", ponderacion: 40, nota: 6.8 },
      { nombre: "Proyecto 2", categoria: "Proyecto", ponderacion: 40, nota: 6.5 },
      { nombre: "Participación", categoria: "Otro", ponderacion: 20, nota: 7.0 },
    ],
  },
  {
    name: "Economía General",
    code: "ECO110",
    credits: 3,
    color: "#f59e0b",
    aprobMin: 4.0,
    npWeight: 60,
    examenWeight: 40,
    evaluaciones: [
      { nombre: "Prueba 1", categoria: "Prueba", ponderacion: 25, nota: 4.5 },
      { nombre: "Prueba 2", categoria: "Prueba", ponderacion: 25, nota: 5.2 },
      { nombre: "Trabajo", categoria: "Proyecto", ponderacion: 20, nota: 5.0 },
      { nombre: "Examen Final", categoria: "Examen", ponderacion: 30, nota: null },
    ],
  },
];

function calcNP(ramo: Ramo): { np: number; pctEvaluado: number; pendientes: number } {
  const withNote = ramo.evaluaciones.filter(e => e.nota !== null);
  const pctTotal = withNote.reduce((s, e) => s + e.ponderacion, 0);
  if (pctTotal === 0) return { np: 0, pctEvaluado: 0, pendientes: ramo.evaluaciones.length };
  const weighted = withNote.reduce((s, e) => s + (e.nota! * e.ponderacion), 0);
  const np = weighted / pctTotal;
  const pendientes = ramo.evaluaciones.filter(e => e.nota === null).length;
  const totalPct = ramo.evaluaciones.reduce((s, e) => s + e.ponderacion, 0);
  return { np: Math.round(np * 100) / 100, pctEvaluado: Math.round((pctTotal / totalPct) * 100), pendientes };
}

function gradeColor(g: number): string {
  if (g >= 5.5) return "#10b981";
  if (g >= 4.0) return "#f59e0b";
  return "#ef4444";
}

function catColor(cat: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    Prueba: { bg: "rgba(59,130,246,0.18)", text: "#60a5fa" },
    Control: { bg: "rgba(139,92,246,0.18)", text: "#a78bfa" },
    Proyecto: { bg: "rgba(16,185,129,0.18)", text: "#34d399" },
    Solemne: { bg: "rgba(239,68,68,0.18)", text: "#f87171" },
    Lab: { bg: "rgba(245,158,11,0.18)", text: "#fbbf24" },
    Examen: { bg: "rgba(239,68,68,0.18)", text: "#f87171" },
    Otro: { bg: "rgba(255,255,255,0.1)", text: "rgba(200,200,230,0.6)" },
  };
  return map[cat] ?? map["Otro"];
}

/* ── RAMO SWITCHER POPUP ── */
function RamoSwitcher({
  ramos, activeIdx, onSelect, onClose, onAdd,
}: {
  ramos: Ramo[]; activeIdx: number;
  onSelect: (i: number) => void; onClose: () => void; onAdd: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl p-5 pb-8"
        style={{
          background: "rgba(18,18,35,0.92)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderBottom: "none",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.2)" }} />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Mis Ramos</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
            <X className="w-4 h-4" style={{ color: "rgba(200,200,230,0.7)" }} />
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {ramos.map((r, i) => {
            const { np } = calcNP(r);
            const active = i === activeIdx;
            return (
              <button
                key={i}
                onClick={() => { onSelect(i); onClose(); }}
                className="flex items-center justify-between rounded-2xl p-4 text-left transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: active ? `${r.color}20` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${active ? `${r.color}40` : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${r.color}25` }}>
                    <BookOpen className="w-4 h-4" style={{ color: r.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.name}</p>
                    <p className="text-xs" style={{ color: "rgba(200,200,230,0.5)" }}>{r.code} · {r.credits} créditos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold" style={{ color: gradeColor(np) }}>{np > 0 ? np.toFixed(1) : "—"}</span>
                  {active && <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 transition-all duration-200 active:scale-[0.98]"
          style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
        >
          <Plus className="w-4 h-4" style={{ color: "#818cf8" }} />
          <span className="text-sm font-semibold" style={{ color: "#818cf8" }}>Agregar Ramo</span>
        </button>
      </div>
    </div>
  );
}

/* ── RAMOS PAGE ── */
function RamosPage({ ramos, activeIdx, showSwitcher, setShowSwitcher }: {
  ramos: Ramo[];
  activeIdx: number;
  showSwitcher: boolean;
  setShowSwitcher: (v: boolean) => void;
}) {
  const [localActiveIdx, setLocalActiveIdx] = useState(activeIdx);
  const [showConfig, setShowConfig] = useState(false);
  const ramo = ramos[localActiveIdx];
  const { np, pctEvaluado, pendientes } = calcNP(ramo);
  const totalPct = ramo.evaluaciones.reduce((s, e) => s + e.ponderacion, 0);
  const isEximido = np >= ramo.aprobMin;
  const notaFinal = isEximido ? np : np;

  return (
    <div className="flex flex-col gap-4 relative">
      {/* NP resultado card */}
      <div
        className="rounded-3xl p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${ramo.color}28 0%, rgba(0,0,0,0) 100%)`,
          border: `1px solid ${ramo.color}30`,
        }}
      >
        <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full" style={{ background: `${ramo.color}10` }} />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(200,200,230,0.5)" }}>Nota de Presentación</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold" style={{ color: gradeColor(np) }}>{np > 0 ? np.toFixed(2) : "—"}</span>
            </div>
            <p className="text-xs mt-1" style={{ color: "rgba(200,200,230,0.5)" }}>{pctEvaluado}% del ramo evaluado · {pendientes} pendiente{pendientes !== 1 ? "s" : ""}</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${isEximido ? "" : ""}`}
              style={{
                background: isEximido ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                border: `1px solid ${isEximido ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
              }}>
              {isEximido
                ? <Check className="w-3 h-3" style={{ color: "#10b981" }} />
                : <AlertTriangle className="w-3 h-3" style={{ color: "#f59e0b" }} />}
              <span className="text-xs font-semibold" style={{ color: isEximido ? "#10b981" : "#f59e0b" }}>
                {isEximido ? "Eximido" : "No eximido"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${pctEvaluado}%`, background: `linear-gradient(90deg, ${ramo.color}, ${gradeColor(np)})` }} />
        </div>
        <div className="flex justify-between text-xs" style={{ color: "rgba(200,200,230,0.35)" }}>
          <span>0%</span><span>{pctEvaluado}% rendido</span><span>100%</span>
        </div>
      </div>

      {/* Evaluaciones */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(200,200,230,0.5)" }}>Evaluaciones</p>
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: totalPct === 100 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
              color: totalPct === 100 ? "#10b981" : "#f59e0b",
            }}>
            {totalPct}%
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {ramo.evaluaciones.map((ev, i) => {
            const cat = catColor(ev.categoria);
            return (
              <div key={i} className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{ev.nombre}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.text }}>
                          {ev.categoria}
                        </span>
                        <span className="text-xs" style={{ color: "rgba(200,200,230,0.4)" }}>{ev.ponderacion}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    {ev.nota !== null
                      ? <span className="text-xl font-bold" style={{ color: gradeColor(ev.nota) }}>{ev.nota.toFixed(1)}</span>
                      : <span className="text-sm font-medium px-3 py-1 rounded-full"
                          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(200,200,230,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          —
                        </span>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Agregar evaluación */}
        <button className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 mt-2 transition-all duration-200 active:scale-[0.98]"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)" }}>
          <Plus className="w-4 h-4" style={{ color: "rgba(200,200,230,0.4)" }} />
          <span className="text-sm font-medium" style={{ color: "rgba(200,200,230,0.4)" }}>Agregar evaluación</span>
        </button>
      </div>

      {/* Configuración del ramo — colapsable */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          onClick={() => setShowConfig(s => !s)}
          className="w-full flex items-center justify-between px-4 py-3.5"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" style={{ color: "rgba(200,200,230,0.5)" }} />
            <span className="text-sm font-semibold text-white">Configuración del ramo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "rgba(200,200,230,0.4)" }}>Aprob {ramo.aprobMin} · NP {ramo.npWeight}% · Ex {ramo.examenWeight}%</span>
            {showConfig ? <ChevronUp className="w-4 h-4" style={{ color: "rgba(200,200,230,0.4)" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "rgba(200,200,230,0.4)" }} />}
          </div>
        </button>
        {showConfig && (
          <div className="px-4 py-4 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { label: "Nota mínima de aprobación", value: `${ramo.aprobMin}` },
              { label: "Peso nota de presentación", value: `${ramo.npWeight}%` },
              { label: "Peso examen", value: `${ramo.examenWeight}%` },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(200,200,230,0.5)" }}>{item.label}</span>
                <span className="text-xs font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nota final breakdown */}
      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(200,200,230,0.5)" }}>Nota Final</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-xs mb-1" style={{ color: "rgba(200,200,230,0.4)" }}>NP · {ramo.npWeight}%</p>
            <p className="text-xl font-bold" style={{ color: gradeColor(np) }}>{np > 0 ? np.toFixed(2) : "—"}</p>
          </div>
          <div className="text-white font-bold text-lg">+</div>
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-xs mb-1" style={{ color: "rgba(200,200,230,0.4)" }}>Examen · {ramo.examenWeight}%</p>
            <p className="text-xl font-bold" style={{ color: "rgba(200,200,230,0.35)" }}>E</p>
          </div>
          <div className="text-white font-bold text-lg">=</div>
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: isEximido ? "rgba(16,185,129,0.12)" : "rgba(59,130,246,0.12)", border: `1px solid ${isEximido ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.2)"}` }}>
            <p className="text-xs mb-1" style={{ color: "rgba(200,200,230,0.4)" }}>{isEximido ? "Eximido" : "NF"}</p>
            <p className="text-xl font-bold" style={{ color: isEximido ? "#10b981" : "#60a5fa" }}>{notaFinal > 0 ? notaFinal.toFixed(2) : "—"}</p>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showSwitcher && (
        <RamoSwitcher
          ramos={ramos}
          activeIdx={localActiveIdx}
          onSelect={setLocalActiveIdx}
          onClose={() => setShowSwitcher(false)}
          onAdd={() => setShowSwitcher(false)}
        />
      )}
    </div>
  );
}

/* ── RESUMEN PAGE ── */
function ResumenPage({ ramos }: { ramos: Ramo[] }) {
  const promedioGeneral = ramos.reduce((s, r) => s + calcNP(r).np, 0) / ramos.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(59,130,246,0.15) 100%)", border: "1px solid rgba(99,102,241,0.25)" }}>
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full" style={{ background: "rgba(99,102,241,0.12)" }} />
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(200,200,230,0.6)" }}>Promedio General</p>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold" style={{ color: gradeColor(promedioGeneral) }}>{promedioGeneral.toFixed(2)}</span>
        </div>
        <p className="text-xs mt-2" style={{ color: "rgba(200,200,230,0.5)" }}>{ramos.length} ramos · Semestre 1-2025</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(200,200,230,0.5)" }}>Estado por Ramo</p>
        <div className="flex flex-col gap-2">
          {ramos.map((r, i) => {
            const { np, pctEvaluado } = calcNP(r);
            return (
              <div key={i} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{r.name}</p>
                    <p className="text-xs" style={{ color: "rgba(200,200,230,0.45)" }}>{r.code}</p>
                  </div>
                  <span className="text-xl font-bold" style={{ color: gradeColor(np) }}>{np > 0 ? np.toFixed(1) : "—"}</span>
                </div>
                <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-1 rounded-full" style={{ width: `${pctEvaluado}%`, background: r.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(200,200,230,0.5)" }}>Estadísticas</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Créditos acumulados", value: "72", icon: Star, color: "#f59e0b" },
            { label: "Semestres cursados", value: "4", icon: TrendingUp, color: "#3b82f6" },
            { label: "Ramos aprobados", value: "18", icon: Award, color: "#10b981" },
            { label: "Promedio histórico", value: "5.6", icon: BarChart2, color: "#8b5cf6" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}22` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(200,200,230,0.5)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PERFIL PAGE ── */
function PerfilPage() {
  const opciones = [
    { icon: Bell, label: "Notificaciones", sub: "Evaluaciones y recordatorios" },
    { icon: BookMarked, label: "Mis Metas", sub: "Nota objetivo por ramo" },
    { icon: GraduationCap, label: "Plan de Estudios", sub: "Malla curricular 2023" },
    { icon: Settings, label: "Configuración", sub: "Cuenta y preferencias" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(59,130,246,0.12) 100%)", border: "1px solid rgba(139,92,246,0.25)" }}>
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full" style={{ background: "rgba(139,92,246,0.1)" }} />
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
              SG
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "#10b981", border: "2px solid #0d0d1a" }}>
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sebastián García</h2>
            <p className="text-sm" style={{ color: "rgba(200,200,230,0.6)" }}>Ingeniería Civil Informática</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(200,200,230,0.4)" }}>Universidad de Chile · 4° año</p>
          </div>
        </div>
        <div className="flex gap-6 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {[{ label: "Promedio", value: "5.6" }, { label: "Créditos", value: "72" }, { label: "Semestres", value: "7" }].map((s, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-lg font-bold text-white">{s.value}</span>
              <span className="text-xs" style={{ color: "rgba(200,200,230,0.5)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(200,200,230,0.5)" }}>Opciones</p>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {opciones.map((o, i) => (
            <button key={i} className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-all duration-150 active:opacity-70"
              style={{ background: "rgba(255,255,255,0.04)", borderBottom: i < opciones.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)" }}>
                  <o.icon className="w-4 h-4" style={{ color: "#6366f1" }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{o.label}</p>
                  <p className="text-xs" style={{ color: "rgba(200,200,230,0.45)" }}>{o.sub}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: "rgba(200,200,230,0.3)" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function App() {
  const [page, setPage] = useState<Page>("ramos");
  const [saved, setSaved] = useState(true);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const navItems: { id: Page; icon: typeof BookOpen; label: string }[] = [
    { id: "ramos", icon: BookOpen, label: "Ramos" },
    { id: "resumen", icon: BarChart2, label: "Resumen" },
    { id: "perfil", icon: User, label: "Perfil" },
  ];

  const titles: Record<Page, string> = {
    ramos: "Calculadora",
    resumen: "Resumen",
    perfil: "Perfil",
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "linear-gradient(160deg, #0d0d2b 0%, #0a0a1a 40%, #0f0a1e 100%)", fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", top: "-10%", left: "-10%" }} />
        <div className="absolute w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", bottom: "10%", right: "-5%" }} />
      </div>

      {/* Phone shell */}
      <div
        className="relative flex flex-col"
        style={{
          width: "min(390px, 100vw)",
          height: "min(844px, 100vh)",
          background: "rgba(13,13,26,0.9)",
          backdropFilter: "blur(40px)",
          borderRadius: "clamp(0px, 3vw, 48px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 flex-shrink-0">
          <span className="text-white text-xs font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3">
              {[2, 3, 4, 3].map((h, i) => (
                <div key={i} className="w-1 rounded-sm" style={{ height: h * 3, background: i < 3 ? "white" : "rgba(255,255,255,0.3)" }} />
              ))}
            </div>
            <div className="rounded-sm" style={{ width: 22, height: 11, border: "1px solid rgba(255,255,255,0.4)", padding: 2, display: "flex", alignItems: "center" }}>
              <div className="rounded-sm h-full" style={{ width: "80%", background: "#10b981" }} />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Hola, Sebastián 👋</p>
              <p className="text-xs" style={{ color: "rgba(200,200,230,0.5)" }}>Semestre 1 · 2025</p>
            </div>
          </div>
          <button
            onClick={() => setSaved(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200"
            style={{
              background: saved ? "rgba(16,185,129,0.14)" : "rgba(245,158,11,0.14)",
              border: `1px solid ${saved ? "rgba(16,185,129,0.28)" : "rgba(245,158,11,0.28)"}`,
            }}
          >
            {saved
              ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
              : <Clock className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />}
            <span className="text-xs font-semibold" style={{ color: saved ? "#10b981" : "#f59e0b" }}>
              {saved ? "Guardado" : "Local"}
            </span>
          </button>
        </div>

        {/* Page title */}
        <div className="px-5 pt-4 pb-2 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white">{titles[page]}</h1>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 pb-4" style={{ scrollbarWidth: "none" }}>
          {page === "ramos" && <RamosPage ramos={ramosData} activeIdx={0} showSwitcher={showSwitcher} setShowSwitcher={setShowSwitcher} />}
          {page === "resumen" && <ResumenPage ramos={ramosData} />}
          {page === "perfil" && <PerfilPage />}
        </div>

        {/* Bottom nav — liquid glass */}
        <div className="flex-shrink-0 flex justify-center pb-6 pt-3 px-6">
          <div
            className="flex items-center gap-2 p-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            {navItems.map((item) => {
              const active = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "ramos" && page === "ramos") {
                      setShowSwitcher(true);
                    } else {
                      setPage(item.id);
                    }
                  }}
                  className="relative flex items-center transition-all duration-300"
                  style={{
                    padding: active ? "10px 20px" : "10px 16px",
                    borderRadius: 999,
                    background: active ? "rgba(99,102,241,0.85)" : "transparent",
                    boxShadow: active ? "0 4px 16px rgba(99,102,241,0.35)" : "none",
                    gap: 7,
                  }}
                >
                  <item.icon style={{ width: 20, height: 20, color: active ? "#fff" : "rgba(200,200,230,0.45)" }} />
                  {active && <span className="text-xs font-semibold text-white whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
