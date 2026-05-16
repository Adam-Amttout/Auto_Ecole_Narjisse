import os

path = r'c:\Users\ORIGINAL SHOP\Auto_Ecole_Narjisse\frontend\src\pages\Dashboard.js'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add recharts import
if 'import { LineChart' not in content:
    content = content.replace(
        'import { useNavigate } from "react-router-dom";',
        'import { useNavigate } from "react-router-dom";\nimport { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";'
    )

# 2. Add state variables for Search and Modal
if 'const [globalSearch, setGlobalSearch]' not in content:
    content = content.replace(
        'const [sidebarOpen, setSidebarOpen] = useState(false);',
        'const [sidebarOpen, setSidebarOpen] = useState(false);\n  const [globalSearch, setGlobalSearch] = useState("");\n  const [showClientDetails, setShowClientDetails] = useState(null);\n  const [clientFullData, setClientFullData] = useState(null);\n  const [clientDetailsLoading, setClientDetailsLoading] = useState(false);'
    )

# 3. Add Topbar search
topbar_target = '''        <div className="db-topbar">
          <button className="db-burger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="db-topbar-title">{TABS.find(t=>t.key===tab)?.label || "Dashboard"}</span>
        </div>'''
topbar_replacement = '''        <div className="db-topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <button className="db-burger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <span className="db-topbar-title">{TABS.find(t=>t.key===tab)?.label || "Dashboard"}</span>
          </div>
          <div className="db-topbar-search" style={{ position: "relative", width: "100%", maxWidth: 300 }}>
             <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
             <input 
               type="text" 
               placeholder="Rechercher (Client, Email...)"
               value={globalSearch}
               onChange={(e) => setGlobalSearch(e.target.value)}
               style={{ width: "100%", padding: "10px 10px 10px 35px", borderRadius: 20, border: "1px solid #e2e8f0", outline: "none", fontSize: 13, background: "#f8fafc" }}
             />
          </div>
        </div>'''
if topbar_target in content:
    content = content.replace(topbar_target, topbar_replacement)

# 4. Modify Clients Tab to use filteredClients and new Modal function
# First, add the function to load client details
if 'const openClientDetails' not in content:
    client_func = '''  const openClientDetails = async (client) => {
    setShowClientDetails(client);
    setClientFullData(null);
    setClientDetailsLoading(true);
    try {
      const [progRes, seancesRes, msgRes] = await Promise.allSettled([
        axios.get(`${API}/progression/by-category?client_id=${client.id}`),
        axios.get(`${API}/seances`),
        axios.get(`${API}/contact-messages`)
      ]);
      const clientSeances = seancesRes.status === "fulfilled" 
        ? seancesRes.value.data.filter(s => s.client?.id === client.id) 
        : [];
      const clientMessages = msgRes.status === "fulfilled"
        ? msgRes.value.data.filter(m => m.email === client.email || m.telephone === client.telephone)
        : [];
      setClientFullData({
        progressionCategories: progRes.status === "fulfilled" ? progRes.value.data : null,
        seances: clientSeances,
        messages: clientMessages
      });
    } catch (e) {
      console.error(e);
    } finally {
      setClientDetailsLoading(false);
    }
  };

  const filteredClients = clients.filter(c => {
    if (!globalSearch) return true;
    const search = globalSearch.toLowerCase();
    return (c.nom?.toLowerCase().includes(search) || 
            c.prenom?.toLowerCase().includes(search) || 
            c.email?.toLowerCase().includes(search) ||
            c.telephone?.toLowerCase().includes(search));
  });
'''
    # insert before return
    content = content.replace('  /* ─────────── RENDER ─────────── */', client_func + '\n  /* ─────────── RENDER ─────────── */')

# replace clients.map with filteredClients.map in clients tab
# Also replace onView action
clients_tab_target = '''{clients.map(c=>(
                    <tr key={c.id}>
                      <td className="db-id">{c.id}</td>
                      <td><b>{c.nom} {c.prenom}</b></td>
                      <td style={{color:"#64748b"}}>{c.email}</td>
                      <td><Badge text={c.role} bg={c.role==="admin"?"#fee2e2":"#dbeafe"} color={c.role==="admin"?"#b91c1c":"#1d4ed8"}/></td>
                      <td style={{fontSize:12,color:"#94a3b8"}}>{new Date(c.created_at).toLocaleDateString("fr-FR")}</td>
                      <td><ActionBtns
                        onView  ={() => window.open(`/profil/${c.id}`,"_blank")}'''
clients_tab_replacement = '''{filteredClients.map(c=>(
                    <tr key={c.id}>
                      <td className="db-id">{c.id}</td>
                      <td><b>{c.nom} {c.prenom}</b></td>
                      <td style={{color:"#64748b"}}>{c.email}</td>
                      <td><Badge text={c.role} bg={c.role==="admin"?"#fee2e2":"#dbeafe"} color={c.role==="admin"?"#b91c1c":"#1d4ed8"}/></td>
                      <td style={{fontSize:12,color:"#94a3b8"}}>{new Date(c.created_at).toLocaleDateString("fr-FR")}</td>
                      <td><ActionBtns
                        onView  ={() => openClientDetails(c)}'''
if clients_tab_target in content:
    content = content.replace(clients_tab_target, clients_tab_replacement)

# Also update clients count
if 'Clients ({clients.length})' in content:
    content = content.replace('Clients ({clients.length})', 'Clients ({filteredClients.length})')

# 5. Add Charts to Accueil
charts_code = '''
            {/* NEW CHARTS ROW */}
            <div className="db-charts-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 20 }}>
              <div className="db-card">
                <div className="db-card-head"><span>📈 Évolution des Inscriptions</span></div>
                <div style={{ height: 260, padding: "20px 20px 0 0" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={(() => {
                      const counts = clients.reduce((acc, c) => {
                        const date = new Date(c.created_at).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' });
                        acc[date] = (acc[date] || 0) + 1;
                        return acc;
                      }, {});
                      return Object.keys(counts).map(date => ({ date, Inscriptions: counts[date] })).slice(-15);
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                      <Line type="monotone" dataKey="Inscriptions" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="db-card">
                <div className="db-card-head"><span>🍩 Séances par Statut</span></div>
                <div style={{ height: 260, position: "relative" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={(() => {
                        const counts = seances.reduce((acc, s) => {
                          acc[s.statut] = (acc[s.statut] || 0) + 1;
                          return acc;
                        }, {});
                        const COLORS = { planifiee: "#3b82f6", en_cours: "#eab308", terminee: "#22c55e", annulee: "#94a3b8" };
                        return Object.keys(counts).map(key => ({
                          name: STATUT_SEANCE[key]?.label || key,
                          value: counts[key],
                          color: COLORS[key] || "#cbd5e1"
                        }));
                      })()} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                        {(() => {
                          const counts = seances.reduce((acc, s) => { acc[s.statut] = (acc[s.statut] || 0) + 1; return acc; }, {});
                          const COLORS = { planifiee: "#3b82f6", en_cours: "#eab308", terminee: "#22c55e", annulee: "#94a3b8" };
                          return Object.keys(counts).map(key => ({ name: STATUT_SEANCE[key]?.label || key, value: counts[key], color: COLORS[key] || "#cbd5e1" }));
                        })().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 15, flexWrap: "wrap", padding: "0 10px" }}>
                    {(() => {
                        const counts = seances.reduce((acc, s) => { acc[s.statut] = (acc[s.statut] || 0) + 1; return acc; }, {});
                        const COLORS = { planifiee: "#3b82f6", en_cours: "#eab308", terminee: "#22c55e", annulee: "#94a3b8" };
                        return Object.keys(counts).map(key => ({ name: STATUT_SEANCE[key]?.label || key, value: counts[key], color: COLORS[key] || "#cbd5e1" }));
                    })().map(entry => (
                      <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#475569", fontWeight: 600 }}>
                        <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: entry.color }}/>
                        {entry.name} ({entry.value})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
'''
if 'db-charts-grid' not in content:
    content = content.replace(
        '<div className="db-recent-grid">',
        charts_code + '\n            <div className="db-recent-grid">'
    )

# 6. Add Detailed Profile Modal
modal_code = '''
      {/* ── MODAL PROFIL ÉLÈVE DÉTAILLÉ ── */}
      {showClientDetails && (
        <div className="db-modal-overlay" onClick={() => setShowClientDetails(null)}>
          <div className="db-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 850, width: "95%", background: "#f8fafc" }}>
            <div className="db-modal-head" style={{ background: "white", padding: "15px 25px" }}>
              <h5>👤 Profil Détaillé : {showClientDetails.prenom} {showClientDetails.nom}</h5>
              <button className="db-modal-x" onClick={() => setShowClientDetails(null)}>×</button>
            </div>
            <div className="db-modal-body" style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Left col: Info + Prog */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div className="db-card" style={{ margin: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <div className="db-card-head"><span>ℹ️ Infos Personnelles</span></div>
                    <div style={{ padding: "15px 20px" }}>
                      <p style={{ margin: "0 0 10px 0", fontSize: 14 }}><strong>Email :</strong> <span style={{color:"#475569"}}>{showClientDetails.email}</span></p>
                      <p style={{ margin: "0 0 10px 0", fontSize: 14 }}><strong>Téléphone :</strong> <span style={{color:"#475569"}}>{showClientDetails.telephone || "—"}</span></p>
                      <p style={{ margin: "0 0 10px 0", fontSize: 14 }}><strong>Inscrit le :</strong> <span style={{color:"#475569"}}>{new Date(showClientDetails.created_at).toLocaleDateString("fr-FR")}</span></p>
                      <Badge text={showClientDetails.role} bg={showClientDetails.role==="admin"?"#fee2e2":"#dbeafe"} color={showClientDetails.role==="admin"?"#b91c1c":"#1d4ed8"}/>
                    </div>
                  </div>

                  <div className="db-card" style={{ margin: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <div className="db-card-head"><span>📚 Progression E-learning</span></div>
                    <div style={{ padding: "15px 20px" }}>
                      {clientDetailsLoading ? (
                        <div style={{ fontSize: 13, color: "#64748b", textAlign: "center", padding: 20 }}>⏳ Chargement de la progression...</div>
                      ) : clientFullData?.progressionCategories && Object.keys(clientFullData.progressionCategories).length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                          {Object.keys(clientFullData.progressionCategories).map(cat => {
                            const data = clientFullData.progressionCategories[cat];
                            return (
                              <div key={cat}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: "#334155" }}>
                                  <span style={{ fontWeight: 700, textTransform: "capitalize" }}>{cat.replace('_', ' ')}</span>
                                  <span style={{ fontWeight: 600 }}>{data.done} / {data.total} ({data.pct}%)</span>
                                </div>
                                <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                                  <div style={{ height: "100%", width: `${data.pct}%`, background: data.pct === 100 ? "#15803d" : "#3b82f6", borderRadius: 4, transition: "width 0.5s ease" }}/>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: 20 }}>Aucune progression trouvée.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right col: Seances + Messages */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div className="db-card" style={{ margin: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <div className="db-card-head"><span>🚗 Historique des Séances</span></div>
                    <div style={{ maxHeight: 220, overflowY: "auto", padding: "10px 15px" }}>
                      {clientDetailsLoading ? (
                        <div style={{ padding: 15, fontSize: 13, color: "#64748b", textAlign:"center" }}>⏳ Chargement...</div>
                      ) : clientFullData?.seances?.length > 0 ? (
                        <table className="db-table" style={{ margin: 0 }}>
                          <tbody>
                            {clientFullData.seances.map(s => (
                              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ fontSize: 12.5, padding: "10px 5px" }}>{new Date(s.date).toLocaleDateString("fr-FR")}</td>
                                <td style={{ fontSize: 12.5, padding: "10px 5px", color:"#64748b" }}>{s.heure_debut}</td>
                                <td style={{ padding: "10px 5px", textAlign:"right" }}><Badge text={STATUT_SEANCE[s.statut]?.label||s.statut} bg={STATUT_SEANCE[s.statut]?.bg||"#f1f5f9"} color={STATUT_SEANCE[s.statut]?.color||"#64748b"}/></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: 15, fontSize: 13, color: "#94a3b8", textAlign:"center" }}>Aucune séance planifiée.</div>
                      )}
                    </div>
                  </div>

                  <div className="db-card" style={{ margin: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <div className="db-card-head"><span>✉️ Messages Envoyés</span></div>
                    <div style={{ maxHeight: 220, overflowY: "auto", padding: "10px 15px" }}>
                      {clientDetailsLoading ? (
                        <div style={{ padding: 15, fontSize: 13, color: "#64748b", textAlign:"center" }}>⏳ Chargement...</div>
                      ) : clientFullData?.messages?.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {clientFullData.messages.map(m => (
                            <div key={m.id} style={{ padding: 12, background: "white", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                <span style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600 }}>{new Date(m.created_at).toLocaleDateString("fr-FR")}</span>
                                <Badge text={STATUT_MSG[m.statut]?.label||m.statut} bg={STATUT_MSG[m.statut]?.bg||"#f1f5f9"} color={STATUT_MSG[m.statut]?.color||"#64748b"}/>
                              </div>
                              <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>"{m.message}"</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: 15, fontSize: 13, color: "#94a3b8", textAlign:"center" }}>Aucun message envoyé.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
'''
if 'MODAL PROFIL ÉLÈVE DÉTAILLÉ' not in content:
    content = content.replace(
        '{/* â• â•  MODAL FAQ â• â•  */}',
        modal_code + '\n      {/* â• â•  MODAL FAQ â• â•  */}'
    )

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Modifications appliquées avec succès.")
