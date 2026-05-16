import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";
const TOTAL_Q = 40;
const PASS_SCORE = 35; // 35/40 pour réussir
const TIMER_SEC = 30 * 60; // 30 minutes

const CAT_LABELS = {
  danger: { label: "Danger", icon: "⚠️", color: "#e63946" },
  indication: { label: "Indication", icon: "ℹ️", color: "#2563eb" },
  interdiction: { label: "Interdiction", icon: "🚫", color: "#c2410c" },
  code_route: { label: "Code Route", icon: "📋", color: "#7c3aed" },
  conduite: { label: "Conduite", icon: "🚗", color: "#059669" },
  autre: { label: "Autre", icon: "📌", color: "#64748b" },
};

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ── Mini SVG Bar Chart ── */
function BarChart({ data, title }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 360, H = 140, PAD = 30;
  const barW = Math.floor((W - PAD * 2) / data.length) - 6;

  return (
    <div style={{ marginTop: 12 }}>
      {title && <div style={{ fontSize: 13, fontWeight: 700, color: "#1d3557", marginBottom: 6 }}>{title}</div>}
      <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ overflow: "visible" }}>
        {data.map((d, i) => {
          const barH = Math.round(((d.value / max) * H) * 0.85);
          const x = PAD + i * (barW + 6);
          const y = H - barH;
          const pct = Math.round(d.value);
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH}
                rx={4} fill={d.color || "#e63946"} opacity={0.85} />
              <text x={x + barW / 2} y={y - 4} textAnchor="middle"
                fontSize={10} fill="#1d3557" fontWeight={700}>{pct}%</text>
              <text x={x + barW / 2} y={H + 14} textAnchor="middle"
                fontSize={9} fill="#64748b">{d.icon}</text>
            </g>
          );
        })}
        <line x1={PAD - 4} y1={0} x2={PAD - 4} y2={H} stroke="#e2e8f0" strokeWidth={1} />
        <line x1={PAD - 4} y1={H} x2={W - PAD + 4} y2={H} stroke="#e2e8f0" strokeWidth={1} />
      </svg>
    </div>
  );
}

/* ── Score Evolution Line Chart ── */
function LineChart({ history }) {
  if (!history || history.length < 2) return null;
  const W = 360, H = 100, PAD = 24;
  const scores = history.map(h => (h.score / h.total) * 100);
  const max = 100, min = 0;
  const points = scores.map((s, i) => {
    const x = PAD + (i / (scores.length - 1)) * (W - PAD * 2);
    const y = H - ((s - min) / (max - min)) * H;
    return { x, y, s };
  });
  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");
  const areaPath = `M${points[0].x},${H} ` + points.map(p => `L${p.x},${p.y}`).join(" ") + ` L${points[points.length - 1].x},${H} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e63946" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#e63946" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 35/40 = 87.5% line */}
      {(() => {
        const passY = H - (87.5 / 100) * H;
        return <line x1={PAD} y1={passY} x2={W - PAD} y2={passY}
          stroke="#15803d" strokeWidth={1} strokeDasharray="4,3" />;
      })()}
      <path d={areaPath} fill="url(#lineGrad)" />
      <polyline points={polyline} fill="none" stroke="#e63946" strokeWidth={2.5} strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={p.s >= 87.5 ? "#15803d" : "#e63946"} stroke="white" strokeWidth={1.5} />
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={9} fill="#1d3557" fontWeight={700}>
            {Math.round(p.s)}%
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function ExamenBlanc({ clientId, onBack }) {
  const [phase, setPhase] = useState("intro"); // intro | loading | exam | results | history
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const [startTime, setStartTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [examStats, setExamStats] = useState(null);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef(null);

  /* ── Load history on mount ── */
  useEffect(() => {
    if (!clientId) return;
    axios.get(`${API}/exam/results?client_id=${clientId}`).then(r => setHistory(r.data || [])).catch(() => {});
    axios.get(`${API}/exam/stats?client_id=${clientId}`).then(r => setExamStats(r.data)).catch(() => {});
  }, [clientId]);

  /* ── Timer ── */
  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); finishExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startExam = async () => {
    setPhase("loading");
    try {
      const res = await axios.get(`${API}/exam/questions`);
      setQuestions(res.data);
      setAnswers({});
      setCurrent(0);
      setSelected(null);
      setRevealed(false);
      setTimeLeft(TIMER_SEC);
      setStartTime(Date.now());
      setPhase("exam");
    } catch {
      setPhase("intro");
      alert("Erreur de chargement des questions. Réessayez.");
    }
  };

  const handleSelect = (opt) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    setAnswers(prev => ({ ...prev, [questions[current].id]: opt }));
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(i => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      clearInterval(timerRef.current);
      finishExam();
    }
  };

  const finishExam = useCallback(async () => {
    clearInterval(timerRef.current);
    setPhase("results");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Save result when reaching results phase ── */
  useEffect(() => {
    if (phase !== "results" || !clientId || questions.length === 0) return;
    const score = questions.filter(q => answers[q.id] === q.correct_answer).length;
    const duree = startTime ? Math.round((Date.now() - startTime) / 1000) : null;

    // Detail by category
    const detail = {};
    questions.forEach(q => {
      const cat = q.categorie || "autre";
      if (!detail[cat]) detail[cat] = { score: 0, total: 0 };
      detail[cat].total++;
      if (answers[q.id] === q.correct_answer) detail[cat].score++;
    });

    const payload = {
      client_id: clientId, score, total: questions.length,
      duree_secondes: duree, reussi: score >= PASS_SCORE,
      detail_categories: detail,
    };

    setSaving(true);
    axios.post(`${API}/exam/results`, payload)
      .then(() => {
        // refresh history
        axios.get(`${API}/exam/results?client_id=${clientId}`).then(r => setHistory(r.data || []));
        axios.get(`${API}/exam/stats?client_id=${clientId}`).then(r => setExamStats(r.data));
      })
      .catch(() => {})
      .finally(() => setSaving(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ── Computed results ── */
  const score = questions.filter(q => answers[q.id] === q.correct_answer).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = score >= PASS_SCORE;
  const timerPct = (timeLeft / TIMER_SEC) * 100;
  const timerColor = timeLeft < 300 ? "#e63946" : timeLeft < 600 ? "#d97706" : "#15803d";

  /* ── Category breakdown for results ── */
  const catBreakdown = {};
  questions.forEach(q => {
    const cat = q.categorie || "autre";
    if (!catBreakdown[cat]) catBreakdown[cat] = { score: 0, total: 0 };
    catBreakdown[cat].total++;
    if (answers[q.id] === q.correct_answer) catBreakdown[cat].score++;
  });

  const chartData = Object.entries(catBreakdown).map(([cat, d]) => ({
    label: CAT_LABELS[cat]?.label || cat,
    icon: CAT_LABELS[cat]?.icon || "📌",
    color: CAT_LABELS[cat]?.color || "#64748b",
    value: d.total > 0 ? Math.round((d.score / d.total) * 100) : 0,
  }));

  const statsChartData = examStats?.category_avg
    ? Object.entries(examStats.category_avg).map(([cat, avg]) => ({
        label: CAT_LABELS[cat]?.label || cat,
        icon: CAT_LABELS[cat]?.icon || "📌",
        color: CAT_LABELS[cat]?.color || "#64748b",
        value: avg,
      }))
    : [];

  /* ════════ RENDER ════════ */

  const S = { // shared inline styles
    card: { background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,.07)", marginBottom: 16 },
    title: { fontSize: 20, fontWeight: 800, color: "#1d3557", marginBottom: 4 },
    sub: { fontSize: 13, color: "#64748b", marginBottom: 20 },
    btnPrimary: { background: "linear-gradient(135deg,#e63946,#c1121f)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" },
    btnSecondary: { background: "#f1f5f9", color: "#1d3557", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  };

  /* ── INTRO ── */
  if (phase === "intro" || phase === "loading") return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ ...S.btnSecondary, padding: "8px 14px" }}>← Retour</button>
        <h2 style={{ ...S.title, marginBottom: 0 }}>🚦 Examen Blanc</h2>
      </div>

      {/* Exam card */}
      <div style={S.card}>
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>📋</div>
          <div style={{ ...S.title, fontSize: 22, textAlign: "center" }}>Simulateur d'Examen Officiel</div>
          <p style={{ ...S.sub, textAlign: "center" }}>Préparez-vous comme pour le vrai examen du code de la route</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, margin: "20px 0" }}>
            {[
              { icon: "❓", val: "40", lbl: "Questions" },
              { icon: "⏱️", val: "30min", lbl: "Durée" },
              { icon: "🎯", val: "35/40", lbl: "Pour réussir" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 22 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1d3557" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{s.lbl}</div>
              </div>
            ))}
          </div>
          <button style={S.btnPrimary} onClick={startExam} disabled={phase === "loading"}>
            {phase === "loading" ? "⏳ Chargement des questions..." : "🚀 Commencer l'Examen"}
          </button>
        </div>
      </div>

      {/* Stats card */}
      {examStats && examStats.total_exams > 0 && (
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1d3557", marginBottom: 14 }}>📊 Vos Statistiques</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Examens passés", val: examStats.total_exams, color: "#2563eb" },
              { label: "Meilleur score", val: `${examStats.best_score}/40`, color: "#059669" },
              { label: "Moyenne", val: `${examStats.avg_score}/40`, color: "#7c3aed" },
              { label: "Réussis", val: `${examStats.reussis}/${examStats.total_exams}`, color: "#e63946" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{s.label}</div>
              </div>
            ))}
          </div>
          {statsChartData.length > 0 && <BarChart data={statsChartData} title="🎯 Moyenne par catégorie (tous examens)" />}
        </div>
      )}

      {/* History chart */}
      {history.length >= 2 && (
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1d3557", marginBottom: 8 }}>📈 Évolution de votre niveau</div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>
            <span style={{ color: "#15803d" }}>— — —</span> Ligne de réussite (87.5%)
          </div>
          <LineChart history={[...history].reverse()} />
        </div>
      )}
    </div>
  );

  /* ── EXAM ── */
  if (phase === "exam") {
    const q = questions[current];
    const OPTS = ["a", "b", "c", "d"];
    const LABS = { a: "A", b: "B", c: "C", d: "D" };
    const progress = Math.round(((current + (revealed ? 1 : 0)) / questions.length) * 100);

    return (
      <div>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1d3557" }}>
            Question {current + 1} / {questions.length}
          </div>
          <div style={{
            fontSize: 18, fontWeight: 800,
            color: timerColor, fontFamily: "monospace",
            background: timeLeft < 300 ? "#fee2e2" : "#f0fdf4",
            padding: "6px 14px", borderRadius: 10,
          }}>
            ⏱️ {formatTime(timeLeft)}
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {questions.filter(q2 => answers[q2.id] === q2.correct_answer).length} ✅
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: "#e2e8f0", borderRadius: 10, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#e63946,#c1121f)", borderRadius: 10, transition: "width .3s" }} />
        </div>
        {/* Timer bar */}
        <div style={{ height: 3, background: "#e2e8f0", borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${timerPct}%`, background: timerColor, borderRadius: 10, transition: "width 1s linear" }} />
        </div>

        {/* Category badge */}
        {q.categorie && CAT_LABELS[q.categorie] && (
          <div style={{ display: "inline-block", background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginBottom: 12 }}>
            {CAT_LABELS[q.categorie].icon} {CAT_LABELS[q.categorie].label}
          </div>
        )}

        {/* Question */}
        <div style={{ ...S.card, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#1d3557", margin: 0, lineHeight: 1.6 }}>{q.question}</p>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {OPTS.map(opt => {
            let bg = "#fff", border = "2px solid #e2e8f0", color = "#1d3557";
            if (revealed) {
              if (opt === q.correct_answer) { bg = "#f0fdf4"; border = "2px solid #15803d"; color = "#15803d"; }
              else if (opt === selected) { bg = "#fee2e2"; border = "2px solid #e63946"; color = "#e63946"; }
              else { bg = "#f8fafc"; color = "#94a3b8"; }
            } else if (selected === opt) { bg = "#eff6ff"; border = "2px solid #2563eb"; color = "#2563eb"; }
            return (
              <button key={opt} onClick={() => handleSelect(opt)} disabled={revealed}
                style={{ display: "flex", alignItems: "center", gap: 12, background: bg, border, borderRadius: 12, padding: "13px 16px", cursor: revealed ? "default" : "pointer", transition: "all .2s", textAlign: "left" }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: revealed && opt === q.correct_answer ? "#15803d" : revealed && opt === selected ? "#e63946" : "#f1f5f9", color: revealed && (opt === q.correct_answer || opt === selected) ? "#fff" : color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{LABS[opt]}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color }}>{q[`option_${opt}`]}</span>
                {revealed && opt === q.correct_answer && <span style={{ marginLeft: "auto", fontSize: 16 }}>✅</span>}
                {revealed && opt === selected && opt !== q.correct_answer && <span style={{ marginLeft: "auto", fontSize: 16 }}>❌</span>}
              </button>
            );
          })}
        </div>

        {/* Explication */}
        {revealed && q.explication && (
          <div style={{ margin: "14px 0", padding: "12px 16px", background: selected === q.correct_answer ? "#f0fdf4" : "#fff7ed", borderRadius: 12, border: `1px solid ${selected === q.correct_answer ? "#bbf7d0" : "#fed7aa"}`, fontSize: 13, color: "#475569" }}>
            💡 {q.explication}
          </div>
        )}

        {/* Next */}
        {revealed && (
          <button style={{ ...S.btnPrimary, marginTop: 8 }} onClick={handleNext}>
            {current + 1 < questions.length ? `Question suivante → (${current + 2}/${questions.length})` : "🏁 Voir mes résultats"}
          </button>
        )}
      </div>
    );
  }

  /* ── RESULTS ── */
  if (phase === "results") {
    const duree = startTime ? Math.round((Date.now() - startTime) / 1000) : null;
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setPhase("intro")} style={{ ...S.btnSecondary, padding: "8px 14px" }}>← Retour</button>
          <h2 style={{ ...S.title, marginBottom: 0 }}>Résultats de l'Examen</h2>
        </div>

        {/* Score */}
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{
            width: 120, height: 120, borderRadius: "50%", margin: "0 auto 16px",
            background: passed ? "linear-gradient(135deg,#22c55e,#15803d)" : "linear-gradient(135deg,#f87171,#e63946)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            boxShadow: `0 8px 32px ${passed ? "rgba(21,128,61,.3)" : "rgba(230,57,70,.3)"}`,
          }}>
            <span style={{ fontSize: 30, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.8)" }}>/ {questions.length}</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: passed ? "#15803d" : "#e63946", marginBottom: 4 }}>
            {passed ? "🎉 REÇU !" : "😞 AJOURNÉ"}
          </div>
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 12 }}>
            {pct}% • {passed ? "Félicitations !" : `Il vous fallait ${PASS_SCORE}/40 — encore ${PASS_SCORE - score} point${PASS_SCORE - score > 1 ? "s" : ""}`}
          </div>
          {duree && (
            <div style={{ fontSize: 12, color: "#94a3b8" }}>⏱️ Durée : {formatTime(duree)}</div>
          )}
          {saving && <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>⏳ Sauvegarde en cours…</div>}
        </div>

        {/* Category breakdown chart */}
        {chartData.length > 0 && (
          <div style={S.card}>
            <BarChart data={chartData} title="📊 Résultats par catégorie" />
          </div>
        )}

        {/* History chart */}
        {history.length >= 1 && (
          <div style={S.card}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1d3557", marginBottom: 4 }}>📈 Évolution de votre niveau</div>
            <LineChart history={[...history].reverse()} />
          </div>
        )}

        {/* Category details */}
        <div style={S.card}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1d3557", marginBottom: 12 }}>🎯 Détail par catégorie</div>
          {Object.entries(catBreakdown).map(([cat, d]) => {
            const catPct = d.total > 0 ? Math.round((d.score / d.total) * 100) : 0;
            const cc = CAT_LABELS[cat] || { label: cat, icon: "📌", color: "#64748b" };
            return (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: "#1d3557" }}>{cc.icon} {cc.label}</span>
                  <span style={{ color: catPct >= 75 ? "#15803d" : "#e63946", fontWeight: 700 }}>{d.score}/{d.total}</span>
                </div>
                <div style={{ height: 7, background: "#e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${catPct}%`, background: cc.color, borderRadius: 10 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button style={S.btnPrimary} onClick={startExam}>🔄 Recommencer</button>
          <button style={{ ...S.btnSecondary, flex: "0 0 auto" }} onClick={() => setPhase("intro")}>📊 Stats</button>
        </div>
      </div>
    );
  }

  return null;
}
