import React, { useState, useCallback } from "react";
import axios from "axios";
import "./QuizQCM.css";

const API = "http://127.0.0.1:8000/api";
const PASS_RATIO = 0.75; // 75% = 9/12 to pass

const LABELS = { a: "A", b: "B", c: "C", d: "D" };

export default function QuizQCM() {
  const [state, setState] = useState("idle"); // idle | loading | quiz | results
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { qId: 'a'|'b'|'c'|'d' }
  const [selected, setSelected] = useState(null); // answer chosen for current Q
  const [revealed, setRevealed] = useState(false); // show correct after click
  const [error, setError] = useState("");

  const startQuiz = useCallback(async () => {
    setState("loading");
    setError("");
    setAnswers({});
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    try {
      const res = await axios.get(`${API}/qcm/questions?categorie=code_route&limit=12`);
      setQuestions(res.data);
      setState("quiz");
    } catch {
      setError("Impossible de charger les questions. Réessayez.");
      setState("idle");
    }
  }, []);

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
      setState("results");
    }
  };

  // ── RESULTS CALC ─────────────────────────────────────────────────────────
  const score = questions.filter(q => answers[q.id] === q.correct_answer).length;
  const total = questions.length;
  const pct   = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = score >= Math.ceil(total * PASS_RATIO);

  // ── IDLE SCREEN ───────────────────────────────────────────────────────────
  if (state === "idle" || state === "loading") return (
    <div className="qcm-card">
      <div className="qcm-idle-icon">📋</div>
      <h2 className="qcm-idle-title">Quiz – Code de la Route</h2>
      <p className="qcm-idle-desc">
        Testez vos connaissances avec <strong>12 questions</strong> tirées aléatoirement.<br/>
        Score minimum pour valider : <strong>9/12 (75%)</strong>
      </p>
      <div className="qcm-idle-stats">
        <div className="qcm-stat"><span>12</span><small>Questions</small></div>
        <div className="qcm-stat"><span>9/12</span><small>Pour réussir</small></div>
        <div className="qcm-stat"><span>75%</span><small>Seuil de réussite</small></div>
      </div>
      {error && <p className="qcm-error">⚠️ {error}</p>}
      <button
        className="qcm-start-btn"
        onClick={startQuiz}
        disabled={state === "loading"}
      >
        {state === "loading" ? "⏳ Chargement..." : "🚀 Commencer le Quiz"}
      </button>
    </div>
  );

  // ── QUIZ SCREEN ───────────────────────────────────────────────────────────
  if (state === "quiz") {
    const q = questions[current];
    const progressPct = Math.round(((current + (revealed ? 1 : 0)) / total) * 100);

    return (
      <div className="qcm-card">
        {/* Header */}
        <div className="qcm-header">
          <span className="qcm-counter">Question {current + 1} / {total}</span>
          <div className="qcm-progress-track">
            <div className="qcm-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="qcm-question-box">
          <p className="qcm-question-text">{q.question}</p>
        </div>

        {/* Options */}
        <div className="qcm-options">
          {["a", "b", "c", "d"].map(opt => {
            let cls = "qcm-opt";
            if (revealed) {
              if (opt === q.correct_answer) cls += " correct";
              else if (opt === selected) cls += " wrong";
              else cls += " dimmed";
            } else if (selected === opt) {
              cls += " selected";
            }
            return (
              <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
                <span className="qcm-opt-label">{LABELS[opt]}</span>
                <span className="qcm-opt-text">{q[`option_${opt}`]}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation after answer */}
        {revealed && q.explication && (
          <div className={`qcm-explication ${selected === q.correct_answer ? "ok" : "ko"}`}>
            <strong>{selected === q.correct_answer ? "✅ Bonne réponse !" : "❌ Mauvaise réponse."}</strong>
            <p>{q.explication}</p>
          </div>
        )}

        {/* Next */}
        {revealed && (
          <button className="qcm-next-btn" onClick={handleNext}>
            {current + 1 < total ? "Question suivante →" : "Voir mes résultats 🏁"}
          </button>
        )}
      </div>
    );
  }

  // ── RESULTS SCREEN ────────────────────────────────────────────────────────
  if (state === "results") return (
    <div className="qcm-card qcm-results-card">
      {/* Score circle */}
      <div className={`qcm-score-circle ${passed ? "pass" : "fail"}`}>
        <span className="qcm-score-num">{score}<small>/{total}</small></span>
        <span className="qcm-score-pct">{pct}%</span>
      </div>

      <div className={`qcm-verdict ${passed ? "pass" : "fail"}`}>
        {passed ? "🎉 REÇU !" : "😞 AJOURNÉ"}
      </div>
      <p className="qcm-verdict-sub">
        {passed
          ? "Félicitations ! Vous avez validé le quiz Code de la Route."
          : `Il vous faut au moins ${Math.ceil(total * PASS_RATIO)} bonnes réponses. Réessayez !`}
      </p>

      {/* Answer review */}
      <div className="qcm-review">
        <h3 className="qcm-review-title">📝 Révision des réponses</h3>
        {questions.map((q, i) => {
          const userAns = answers[q.id];
          const correct = userAns === q.correct_answer;
          return (
            <div key={q.id} className={`qcm-review-item ${correct ? "ok" : "ko"}`}>
              <div className="qcm-review-q">
                <span className="qcm-review-num">{i + 1}</span>
                <span className="qcm-review-text">{q.question}</span>
                <span className={`qcm-review-badge ${correct ? "ok" : "ko"}`}>
                  {correct ? "✓" : "✗"}
                </span>
              </div>
              {!correct && (
                <div className="qcm-review-ans">
                  <span className="wrong-ans">Votre réponse : <strong>{LABELS[userAns]} – {q[`option_${userAns}`]}</strong></span>
                  <span className="right-ans">Bonne réponse : <strong>{LABELS[q.correct_answer]} – {q[`option_${q.correct_answer}`]}</strong></span>
                  {q.explication && <span className="expl-ans">💡 {q.explication}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="qcm-start-btn" onClick={startQuiz}>
        🔄 Refaire le Quiz
      </button>
    </div>
  );

  return null;
}
