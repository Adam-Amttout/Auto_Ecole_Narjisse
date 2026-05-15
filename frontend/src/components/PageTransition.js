import React, { useEffect, useState } from "react";

/**
 * PageTransition — kayan chi animation khfifa m3a logo
 * katkhdm hna: fade-in + logo flash lhda ثم ktkhrej smooth
 */
export default function PageTransition({ children, color = "#e63946" }) {
  const [phase, setPhase] = useState("enter"); // "enter" | "done"

  useEffect(() => {
    // Overlay visible 650ms then fades out
    const t1 = setTimeout(() => setPhase("exit"),  650);
    const t2 = setTimeout(() => setPhase("done"),  1050);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {/* ── Transition Overlay ── */}
      {phase !== "done" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 8888,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #1d3557 0%, #0f2744 100%)",
          opacity:    phase === "enter" ? 1 : 0,
          transition: phase === "exit" ? "opacity 0.4s cubic-bezier(0.4,0,0.2,1)" : "none",
          pointerEvents: "none",
        }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@800&display=swap');
            @keyframes pt-logo-pop {
              0%   { transform: scale(0.5) translateY(20px); opacity: 0; }
              60%  { transform: scale(1.12) translateY(-4px); opacity: 1; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes pt-pulse {
              0%, 100% { transform: scale(1);    opacity: 0.6; }
              50%       { transform: scale(1.15); opacity: 0.2; }
            }
            @keyframes pt-text-in {
              0%   { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes pt-bar {
              0%   { width: 0%;  }
              100% { width: 85%; }
            }
          `}</style>

          {/* Pulse ring */}
          <div style={{ position: "relative", marginBottom: 22 }}>
            <div style={{
              position: "absolute", inset: -16,
              borderRadius: "50%",
              background: `rgba(230,57,70,0.2)`,
              animation: "pt-pulse 1.2s ease-in-out infinite",
            }}/>

            {/* Logo box */}
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: `linear-gradient(135deg, ${color}, #c1121f)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
              boxShadow: `0 10px 35px rgba(230,57,70,0.45)`,
              animation: "pt-logo-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
              position: "relative", zIndex: 2,
            }}>
              🚗
            </div>
          </div>

          {/* Brand name */}
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 19, fontWeight: 800,
            color: "white",
            animation: "pt-text-in 0.4s ease 0.2s both",
            marginBottom: 3,
          }}>
            Auto École Narjiss
          </div>

          <div style={{
            fontSize: 10, fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            animation: "pt-text-in 0.4s ease 0.3s both",
            marginBottom: 28,
          }}>
            Marrakech
          </div>

          {/* Progress bar */}
          <div style={{
            width: 160, height: 2.5,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 10, overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              background: `linear-gradient(90deg, ${color}, #ff6b6b)`,
              borderRadius: 10,
              animation: "pt-bar 0.65s ease-out forwards",
            }}/>
          </div>

        </div>
      )}

      {/* ── Page content — fade in after overlay ── */}
      <div style={{
        opacity:    phase === "enter" ? 0 : 1,
        transform:  phase === "enter" ? "translateY(12px)" : "translateY(0)",
        transition: "opacity 0.35s ease 0.55s, transform 0.35s ease 0.55s",
      }}>
        {children}
      </div>
    </>
  );
}
