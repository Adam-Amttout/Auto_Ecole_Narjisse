import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API = "http://127.0.0.1:8000/api";

/* ����������������������������������������������������������������������������������
   HELPERS
���������������������������������������������������������������������������������� */
const TABS = [
  { key:"accueil",      icon:"=�", label:"Tableau de bord" },
  { key:"clients",      icon:"=d", label:"Clients"          },
  { key:"inscriptions", icon:"=�", label:"Inscriptions"     },
  { key:"cours",        icon:"=�", label:"Cours"            },
  { key:"moniteurs",    icon:">�<�", label:"Moniteurs"     },
  { key:"vehicules",    icon:"=�", label:"V�hicules"        },
  { key:"seances",      icon:"=�", label:"S�ances"          },
  { key:"qcm",          icon:"=�", label:"QCM"              },
  { key:"avis",         icon:"P", label:"Avis"             },
  { key:"faq",          icon:"S", label:"FAQ"              },
  { key:"messages",     icon:"	", label:"Messages"         },
];

const STATUT_SEANCE = {
  planifiee: { label:"Planifi�e", bg:"#dbeafe", color:"#1d4ed8" },
  en_cours:  { label:"En cours",  bg:"#fef9c3", color:"#a16207" },
  terminee:  { label:"Termin�e",  bg:"#dcfce7", color:"#15803d" },
  annulee:   { label:"Annul�e",   bg:"#f1f5f9", color:"#64748b" },
};

const STATUT_MSG = {
  nouveau:  { label:"Nouveau",  bg:"#fee2e2", color:"#b91c1c"  },
  lu:       { label:"Lu",       bg:"#f1f5f9", color:"#64748b"  },
  repondu:  { label:"R�pondu",  bg:"#dcfce7", color:"#15803d"  },
  archive:  { label:"Archiv�",  bg:"#f0fdf4", color:"#94a3b8"  },
};

const Badge = ({ text, bg, color }) => (
  <span style={{ background:bg, color, padding:"2px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, whiteSpace:"nowrap" }}>
    {text}
  </span>
);

function ActionBtns({ onView, onEdit, onDelete, onAnnuler, confirmId, setConfirmId, id }) {
  return (
    <div className="db-actions">
      {onView    && <button className="db-btn view"    onClick={() => onView(id)}    title="Voir">�x�</button>}
      {onEdit    && <button className="db-btn edit"    onClick={() => onEdit(id)}    title="Modifier">�S�️</button>}
      {onAnnuler && <button className="db-btn warn"    onClick={() => onAnnuler(id)} title="Annuler">�S"</button>}
      {confirmId === id ? (
        <>
          <button className="db-btn danger"  onClick={() => { onDelete(id); setConfirmId(null); }}>Oui</button>
          <button className="db-btn neutral" onClick={() => setConfirmId(null)}>Non</button>
        </>
      ) : (
        onDelete && <button className="db-btn danger" onClick={() => setConfirmId(id)} title="Supprimer">�x️</button>
      )}
    </div>
  );
}

function Modal({ show, onClose, title, children, onSave, saveLabel="Enregistrer", error, hideFoot }) {
  if (!show) return null;
  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal" onClick={e => e.stopPropagation()}>
        <div className="db-modal-head">
          <h5>{title}</h5>
          <button className="db-modal-x" onClick={onClose}>�</button>
        </div>
        <div className="db-modal-body">
          {error && <div className="db-alert err">�a� {error}</div>}
          {children}
        </div>
        {!hideFoot && (
          <div className="db-modal-foot">
            <button className="db-btn neutral lg" onClick={onClose}>Annuler</button>
            <button className="db-btn primary lg" onClick={onSave}>{saveLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
   VUE CONVERSATION � panneau droit messages
�"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"� */
function ConversationView({ msg, onReply, onArchive, onClose }) {
  const [reponse, setReponse] = useState("");
  const [sending, setSending] = useState(false);
  const [erreur,  setErreur]  = useState("");
  const [succes,  setSucces]  = useState("");
  const textRef = useRef(null);

  const handleSend = async () => {
    if (!reponse.trim()) { setErreur("Veuillez saisir une r�ponse."); return; }
    setSending(true); setErreur(""); setSucces("");
    try {
      await onReply(msg.id, reponse);
      setSucces("�S& Email envoy� avec succ�s � " + msg.email);
      setReponse("");
    } catch (e) {
      const errMsg = e.response?.data?.message || "Erreur lors de l'envoi.";
      // Code 207 = r�ponse enregistr�e mais email non envoy�
      if (e.response?.status === 207) {
        setSucces("�a�️ R�ponse enregistr�e, mais email non envoy�. V�rifiez la config SMTP dans .env");
      } else {
        setErreur(errMsg);
      }
    } finally { setSending(false); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "";
  const initiales = `${msg.prenom?.[0]||""}${msg.nom?.[0]||""}`.toUpperCase();
  const sc = STATUT_MSG[msg.statut] || STATUT_MSG.nouveau;

  return (
    <div className="conv-panel">
      {/* En-t�te conversation */}
      <div className="conv-header">
        <div className="conv-header-left">
          <button className="conv-back" onClick={onClose}>� �</button>
          <div className="conv-avatar">{initiales}</div>
          <div>
            <div className="conv-name">{msg.prenom} {msg.nom}</div>
            <div className="conv-email">{msg.email}{msg.telephone ? ` · ${msg.telephone}` : ""}</div>
          </div>
        </div>
        <div className="conv-header-right">
          <Badge text={sc.label} bg={sc.bg} color={sc.color}/>
          {msg.statut !== "archive" && (
            <button className="db-btn neutral" style={{fontSize:12}} onClick={() => onArchive(msg.id)} title="Archiver">
              �x�️ Archiver
            </button>
          )}
        </div>
      </div>

      {/* Fils de conversation */}
      <div className="conv-thread">

        {/* Message du client */}
        <div className="conv-bubble client">
          <div className="conv-bubble-head">
            <span className="conv-bubble-author">=d {msg.prenom} {msg.nom}</span>
            <span className="conv-bubble-date">{fmtDate(msg.created_at)}</span>
          </div>
          {msg.sujet && <div className="conv-sujet">Sujet : {msg.sujet}</div>}
          <div className="conv-bubble-text">{msg.message}</div>
        </div>

        {/* R�ponse admin existante (si d�j� r�pondu) */}
        {msg.reponse_admin && (
          <div className="conv-bubble admin">
            <div className="conv-bubble-head">
              <span className="conv-bubble-author">�x�� Auto �0cole Narjiss (Admin)</span>
              <span className="conv-bubble-date">{fmtDate(msg.repondu_le)}</span>
            </div>
            <div className="conv-bubble-text">{msg.reponse_admin}</div>
            <div className="conv-email-sent">�x� Email envoy� � {msg.email}</div>
          </div>
        )}
      </div>

      {/* Zone de r�ponse */}
      <div className="conv-reply-area">
        {succes && <div className="conv-alert ok">{succes}</div>}
        {erreur && <div className="conv-alert err">�a� {erreur}</div>}

        <div className="conv-reply-box">
          <div className="conv-reply-header">
            <span>�S�️ R�pondre � {msg.prenom} {msg.nom}</span>
            <span className="conv-reply-to">�  {msg.email}</span>
          </div>
          <textarea
            ref={textRef}
            className="conv-textarea"
            rows={5}
            value={reponse}
            onChange={e => setReponse(e.target.value)}
            placeholder={`Bonjour ${msg.prenom},\n\nMerci pour votre message⬦`}
          />
          <div className="conv-reply-footer">
            <span className="conv-reply-hint">�x� Un email sera envoy� directement au client</span>
            <button
              className="conv-send-btn"
              onClick={handleSend}
              disabled={sending || !reponse.trim()}
            >
              {sending ? (
                <><span className="conv-spinner"/>Envoi⬦</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Envoyer la r�ponse
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ����������������������������������������������������������������������������������
   COMPOSANT PRINCIPAL
���������������������������������������������������������������������������������� */
export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab]             = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ���� donn�es ���� */
  const [clients,      setClients]      = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [cours,        setCours]        = useState([]);
  const [moniteurs,    setMoniteurs]    = useState([]);
  const [vehicules,    setVehicules]    = useState([]);
  const [seances,      setSeances]      = useState([]);
  const [avis,         setAvis]         = useState([]);
  const [faqs,         setFaqs]         = useState([]);
  const [messages,     setMessages]     = useState([]);
  const [questions,    setQuestions]    = useState([]);
  const [qcmCat,       setQcmCat]       = useState("danger");
  const [progStats,    setProgStats]    = useState(null); // admin progression stats

  /* ���� messages : conversation ouverte + filtres ���� */
  const [convMsg,      setConvMsg]      = useState(null);   // message ouvert dans ConversationView
  const [msgFiltre,    setMsgFiltre]    = useState("tous"); // tous | nouveau | lu | repondu | archive

  /* ���� FAQ ���� */
  const [faqModal,        setFaqModal]        = useState(false);
  const [faqEditItem,     setFaqEditItem]      = useState(null);
  const [faqForm,         setFaqForm]         = useState({ question:"", reponse:"", ordre:0, actif:true });
  const [faqImageFile,    setFaqImageFile]     = useState(null);
  const [faqImagePreview, setFaqImagePreview]  = useState("");
  const [faqSaving,       setFaqSaving]        = useState(false);
  const [faqError,        setFaqError]         = useState("");

  /* ���� S�ance : creneaux disponibles ���� */
  const HEURES = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
  const [creneaux,       setCreneaux]       = useState([]);
  const [creneauxLoading,setCreneauxLoading]= useState(false);
  const [faqConfirmDel,   setFaqConfirmDel]    = useState(null);

  const loadedTabs = useRef(new Set());

  /* ���� modal g�n�rique ���� */
  const [modal,     setModal]     = useState({ show:false, title:"", entity:"" });
  const [formData,  setFormData]  = useState({});
  const [editId,    setEditId]    = useState(null);
  const [modalErr,  setModalErr]  = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [toast,     setToast]     = useState({ show:false, msg:"", ok:true });

  const showToast = (msg, ok=true) => {
    setToast({ show:true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3500);
  };

  /* ���� Chargement par onglet ���� */
  const loadTab = useCallback(async (activeTab) => {
    if (loadedTabs.current.has(activeTab)) return;
    loadedTabs.current.add(activeTab);
    try {
      if (activeTab === "accueil") {
        const [cl, se] = await Promise.allSettled([
          axios.get(`${API}/clients`),
          axios.get(`${API}/seances`),
        ]);
        if (cl.status === "fulfilled") setClients(cl.value.data);
        if (se.status === "fulfilled") setSeances(se.value.data);
      } else if (activeTab === "clients") {
        const res = await axios.get(`${API}/clients`); setClients(res.data);
      } else if (activeTab === "inscriptions") {
        const res = await axios.get(`${API}/inscriptions`); setInscriptions(res.data);
      } else if (activeTab === "cours") {
        const [coursRes, progRes] = await Promise.allSettled([
          axios.get(`${API}/cours/all`),
          axios.get(`${API}/progression/admin-stats`),
        ]);
        if (coursRes.status === "fulfilled") setCours(coursRes.value.data);
        if (progRes.status  === "fulfilled") setProgStats(progRes.value.data);
      } else if (activeTab === "moniteurs") {
        const res = await axios.get(`${API}/moniteurs`); setMoniteurs(res.data);
      } else if (activeTab === "vehicules") {
        const res = await axios.get(`${API}/vehicules`); setVehicules(res.data);
      } else if (activeTab === "seances") {
        const [mo, ve, se] = await Promise.allSettled([
          axios.get(`${API}/moniteurs`),
          axios.get(`${API}/vehicules`),
          axios.get(`${API}/seances`),
        ]);
        if (mo.status === "fulfilled") setMoniteurs(mo.value.data);
        if (ve.status === "fulfilled") setVehicules(ve.value.data);
        if (se.status === "fulfilled") setSeances(se.value.data);
      } else if (activeTab === "avis") {
        const res = await axios.get(`${API}/avis`); setAvis(res.data);
      } else if (activeTab === "faq") {
        const res = await axios.get(`${API}/faq/all`); setFaqs(res.data);
      } else if (activeTab === "messages") {
        const res = await axios.get(`${API}/contact-messages`); setMessages(res.data);
      } else if (activeTab === "qcm") {
        const res = await axios.get(`${API}/qcm`); setQuestions(res.data);
      }
    } catch {}
  }, []);

  const load = useCallback(async () => {
    loadedTabs.current.delete(tab);
    await loadTab(tab);
  }, [tab, loadTab]);

  useEffect(() => { loadTab(tab); }, [tab, loadTab]);

  /* ���� Modal g�n�rique ���� */
  const openModal = (entity, title, data={}, id=null) => {
    setModal({ show:true, title, entity });
    setFormData(data);
    setEditId(id);
    setModalErr("");
    // R�initialiser les cr�neaux � chaque ouverture de modal s�ance
    if (entity === "seance") setCreneaux([]);
  };

  const handleSave = async () => {
    setModalErr("");
    const { entity } = modal;
    const urls = {
      client:      { post:`${API}/clients`,       put:`${API}/clients/${editId}`      },
      inscription: { post:`${API}/inscription`,    put:`${API}/inscriptions/${editId}` },
      cours:       { post:`${API}/cours`,          put:`${API}/cours/${editId}`        },
      moniteur:    { post:`${API}/moniteurs`,      put:`${API}/moniteurs/${editId}`    },
      vehicule:    { post:`${API}/vehicules`,      put:`${API}/vehicules/${editId}`    },
      seance:      { post:`${API}/seances`,        put:`${API}/seances/${editId}`      },
      question:    { post:`${API}/questions`,      put:`${API}/questions/${editId}`    },
    };
    try {
      if (editId) await axios.put(urls[entity].put, formData);
      else        await axios.post(urls[entity].post, formData);
      setModal(m => ({ ...m, show:false }));
      await load();
      showToast(editId ? "Mis � jour !" : "Cr�� avec succ�s !");
    } catch (e) {
      setModalErr(e.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async (entity, id) => {
    const urls = {
      client:      `${API}/clients/${id}`,
      inscription: `${API}/inscriptions/${id}`,
      cours:       `${API}/cours/${id}`,
      moniteur:    `${API}/moniteurs/${id}`,
      vehicule:    `${API}/vehicules/${id}`,
      seance:      `${API}/seances/${id}`,
      question:    `${API}/questions/${id}`,
    };
    try {
      await axios.delete(urls[entity]);
      await load();
      showToast("Supprim�.");
    } catch (e) {
      showToast(e.response?.data?.message || "Impossible de supprimer.", false);
    }
    setConfirmId(null);
  };

  const annulerSeance = async (id) => {
    try {
      await axios.patch(`${API}/seances/${id}/annuler`);
      await load();
      showToast("S�ance annul�e.");
    } catch (e) { showToast(e.response?.data?.message || "Erreur.", false); }
  };

  const F = (key, label, type="text", options=null) => (
    <div className="db-field" key={key}>
      <label>{label}</label>
      {options ? (
        <select className="db-input" value={formData[key]||""} onChange={e => {
          const newData = {...formData, [key]:e.target.value};
          setFormData(newData);
          // Recharger les cr�neaux si on change moniteur, vehicule ou date dans le formulaire s�ance
          if (modal.entity === "seance" && ["date","moniteur_id","vehicule_id"].includes(key)) {
            const d = key==="date" ? e.target.value : newData.date;
            const m = key==="moniteur_id" ? e.target.value : newData.moniteur_id;
            const v = key==="vehicule_id" ? e.target.value : newData.vehicule_id;
            if (d && m && v) {
              setCreneauxLoading(true);
              setCreneaux([]);
              axios.get(`${API}/seances/creneaux`,{params:{date:d,moniteur_id:m,vehicule_id:v}})
                .then(r => setCreneaux(r.data)).catch(()=>{}).finally(()=>setCreneauxLoading(false));
            }
          }
        }}>
          {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea className="db-input" rows={3} value={formData[key]||""} onChange={e=>setFormData({...formData,[key]:e.target.value})}/>
      ) : (
        <input className="db-input" type={type} value={formData[key]||""} onChange={e => {
          const newData = {...formData, [key]:e.target.value};
          setFormData(newData);
          // Recharger si date change dans s�ance
          if (modal.entity === "seance" && key === "date") {
            const d = e.target.value;
            const m = newData.moniteur_id;
            const v = newData.vehicule_id;
            if (d && m && v) {
              setCreneauxLoading(true);
              setCreneaux([]);
              axios.get(`${API}/seances/creneaux`,{params:{date:d,moniteur_id:m,vehicule_id:v}})
                .then(r => setCreneaux(r.data)).catch(()=>{}).finally(()=>setCreneauxLoading(false));
            }
          }
        }}/>
      )}
    </div>
  );

  /* ���� FAQ CRUD ���� */
  const openFaqCreate = () => {
    setFaqEditItem(null);
    setFaqForm({ question:"", reponse:"", ordre:faqs.length+1, actif:true });
    setFaqImageFile(null); setFaqImagePreview(""); setFaqError("");
    setFaqModal(true);
  };
  const openFaqEdit = (item) => {
    setFaqEditItem(item);
    setFaqForm({ question:item.question, reponse:item.reponse, ordre:item.ordre, actif:item.actif });
    setFaqImageFile(null); setFaqImagePreview(item.image||""); setFaqError("");
    setFaqModal(true);
  };
  const handleFaqImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setFaqImageFile(file); setFaqImagePreview(URL.createObjectURL(file)); }
    else       { setFaqImageFile(null); setFaqImagePreview(faqEditItem?.image||""); }
  };
  const handleFaqSave = async () => {
    if (!faqForm.question.trim() || !faqForm.reponse.trim()) {
      setFaqError("La question et la r�ponse sont obligatoires."); return;
    }
    setFaqSaving(true); setFaqError("");
    const fd = new FormData();
    fd.append("question", faqForm.question);
    fd.append("reponse",  faqForm.reponse);
    fd.append("ordre",    faqForm.ordre);
    fd.append("actif",    faqForm.actif ? "1" : "0");
    if (faqImageFile) fd.append("image", faqImageFile);
    try {
      if (faqEditItem) {
        fd.append("_method", "PUT");
        await axios.post(`${API}/faq/${faqEditItem.id}`, fd, { headers:{"Content-Type":"multipart/form-data"} });
      } else {
        await axios.post(`${API}/faq`, fd, { headers:{"Content-Type":"multipart/form-data"} });
      }
      setFaqModal(false);
      loadedTabs.current.delete("faq");
      await loadTab("faq");
      showToast(faqEditItem ? "FAQ mise � jour !" : "FAQ cr��e !");
    } catch (e) {
      setFaqError(e.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally { setFaqSaving(false); }
  };
  const handleFaqDelete = async (id) => {
    try {
      await axios.delete(`${API}/faq/${id}`);
      setFaqConfirmDel(null);
      loadedTabs.current.delete("faq");
      await loadTab("faq");
      showToast("FAQ supprim�e.");
    } catch (e) { showToast(e.response?.data?.message||"Erreur.", false); }
  };

  /* ���� MESSAGES : actions ���� */
  const reloadMessages = async () => {
    loadedTabs.current.delete("messages");
    await loadTab("messages");
  };

  const marquerLu = async (id) => {
    await axios.patch(`${API}/contact-messages/${id}/lire`);
    await reloadMessages();
    // Mettre � jour la conversation ouverte si c'est le m�me message
    if (convMsg?.id === id) setConvMsg(m => ({ ...m, lu:true, statut:"lu" }));
  };

  const handleReply = async (id, reponse) => {
    const res = await axios.post(`${API}/contact-messages/${id}/repondre`, { reponse });
    await reloadMessages();
    // Mettre � jour la conversation affich�e avec la r�ponse
    setConvMsg(m => ({ ...m, reponse_admin:reponse, repondu_le:new Date().toISOString(), statut:"repondu" }));
    return res;
  };

  const handleArchive = async (id) => {
    await axios.patch(`${API}/contact-messages/${id}/archiver`);
    await reloadMessages();
    if (convMsg?.id === id) setConvMsg(m => ({ ...m, statut:"archive" }));
    showToast("Message archiv�.");
  };

  const handleDeleteMsg = async (id) => {
    try {
      await axios.delete(`${API}/contact-messages/${id}`);
      await reloadMessages();
      if (convMsg?.id === id) setConvMsg(null);
      showToast("Message supprim�.");
    } catch (e) { showToast(e.response?.data?.message||"Erreur.", false); }
    setConfirmId(null);
  };

  const openConversation = async (msg) => {
    setConvMsg(msg);
    // Marquer comme lu automatiquement si nouveau
    if (msg.statut === "nouveau" || !msg.lu) {
      try { await marquerLu(msg.id); } catch {}
    }
  };

  const msgFiltres = messages.filter(m =>
    msgFiltre === "tous" ? true : m.statut === msgFiltre
  );
  const nbNouveaux = messages.filter(m => m.statut === "nouveau").length;

  const stats = [
    { icon:"=d", label:"Clients",      val:clients.length,      color:"#e63946" },
    { icon:"=�", label:"Inscriptions", val:inscriptions.length, color:"#2563eb" },
    { icon:"=�", label:"Cours",        val:cours.length,        color:"#7c3aed" },
    { icon:">�<�", label:"Moniteurs", val:moniteurs.length,    color:"#0891b2" },
    { icon:"=�", label:"V�hicules",    val:vehicules.length,    color:"#059669" },
    { icon:"=�", label:"S�ances",      val:seances.length,      color:"#d97706" },
  ];

  /* ���������������������� RENDER ���������������������� */
  return (
    <div className="db-layout">

      {/* ���� SIDEBAR ���� */}
      <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="db-sidebar-brand">
          <span className="db-sidebar-logo">N</span>
          <span className="db-sidebar-title">Narjiss Admin</span>
        </div>
        <nav className="db-sidebar-nav">
          {TABS.map(t => (
            <button key={t.key}
              className={`db-sidebar-link ${tab === t.key ? "active" : ""}`}
              onClick={() => { setTab(t.key); setSidebarOpen(false); setConvMsg(null); }}>
              <span className="db-sidebar-icon">{t.icon}</span>
              <span className="db-sidebar-label">
                {t.label}
                {t.key === "messages" && nbNouveaux > 0 && (
                  <span className="db-sidebar-badge">{nbNouveaux}</span>
                )}
              </span>
            </button>
          ))}
        </nav>
        <div className="db-sidebar-footer">
          <button className="db-sidebar-link logout" onClick={() => { localStorage.removeItem("user"); localStorage.removeItem("role"); navigate("/connexion"); }}>
            <span className="db-sidebar-icon">=�</span>
            <span className="db-sidebar-label">D�connexion</span>
          </button>
          <button className="db-sidebar-link" onClick={() => navigate("/")}>
            <span className="db-sidebar-icon"><�</span>
            <span className="db-sidebar-label">Accueil site</span>
          </button>
        </div>
      </aside>

      {/* ���� MAIN ���� */}
      <main className="db-main">
        <div className="db-topbar">
          <button className="db-burger" onClick={() => setSidebarOpen(!sidebarOpen)}>�ܰ</button>
          <span className="db-topbar-title">{TABS.find(t=>t.key===tab)?.label || "Dashboard"}</span>
        </div>

        {toast.show && (
          <div className={`db-toast ${toast.ok?"ok":"err"}`}>
            {toast.ok ? "�S&" : "�R"} {toast.msg}
          </div>
        )}

        {/* �"��"� ACCUEIL �"��"� */}
        {tab === "accueil" && (
          <div className="db-section">
            <h4 className="db-title">Tableau de bord</h4>
            <div className="db-stats-grid">
              {stats.map((s,i) => (
                <div key={i} className="db-stat-card" style={{"--sc":s.color}}>
                  <div className="db-stat-icon">{s.icon}</div>
                  <div className="db-stat-val">{s.val}</div>
                  <div className="db-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="db-recent-grid">
              <div className="db-card">
                <div className="db-card-head"><span>=d Derniers clients</span></div>
                <table className="db-table"><tbody>
                  {clients.slice(0,5).map(c=>(
                    <tr key={c.id}>
                      <td><b>{c.prenom} {c.nom}</b></td>
                      <td style={{color:"#94a3b8",fontSize:12}}>{c.email}</td>
                      <td><Badge text={c.role} bg={c.role==="admin"?"#fee2e2":"#dbeafe"} color={c.role==="admin"?"#b91c1c":"#1d4ed8"}/></td>
                    </tr>
                  ))}
                </tbody></table>
              </div>
              <div className="db-card">
                <div className="db-card-head"><span>=� Derni�res s�ances</span></div>
                <table className="db-table"><tbody>
                  {seances.slice(0,5).map(s=>(
                    <tr key={s.id}>
                      <td><b>{s.client?.nom} {s.client?.prenom}</b></td>
                      <td style={{fontSize:12,color:"#64748b"}}>{new Date(s.date).toLocaleDateString("fr-FR")}</td>
                      <td><Badge text={STATUT_SEANCE[s.statut]?.label||s.statut} bg={STATUT_SEANCE[s.statut]?.bg||"#f1f5f9"} color={STATUT_SEANCE[s.statut]?.color||"#64748b"}/></td>
                    </tr>
                  ))}
                </tbody></table>
              </div>
            </div>
          </div>
        )}

        {/* �"��"� CLIENTS �"��"� */}
        {tab === "clients" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">Clients ({clients.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("client","�~" Ajouter un client",{role:"user"})}>+ Ajouter</button>
            </div>
            <div className="db-card"><div className="db-table-wrap">
              <table className="db-table">
                <thead><tr><th>#</th><th>Nom complet</th><th>Email</th><th>R�le</th><th>Inscrit le</th><th>Actions</th></tr></thead>
                <tbody>
                  {clients.length===0 && <tr><td colSpan={6} className="db-empty">Aucun client</td></tr>}
                  {clients.map(c=>(
                    <tr key={c.id}>
                      <td className="db-id">{c.id}</td>
                      <td><b>{c.nom} {c.prenom}</b></td>
                      <td style={{color:"#64748b"}}>{c.email}</td>
                      <td><Badge text={c.role} bg={c.role==="admin"?"#fee2e2":"#dbeafe"} color={c.role==="admin"?"#b91c1c":"#1d4ed8"}/></td>
                      <td style={{fontSize:12,color:"#94a3b8"}}>{new Date(c.created_at).toLocaleDateString("fr-FR")}</td>
                      <td><ActionBtns
                        onView  ={() => window.open(`/profil/${c.id}`,"_blank")}
                        onEdit  ={() => openModal("client",`�S�️ Modifier ${c.prenom}`,{nom:c.nom,prenom:c.prenom,email:c.email,password:"",role:c.role},c.id)}
                        onDelete={() => handleDelete("client",c.id)}
                        confirmId={confirmId} setConfirmId={setConfirmId} id={c.id}
                      /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></div>
          </div>
        )}

        {/* �"��"� INSCRIPTIONS �"��"� */}
        {tab === "inscriptions" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">Inscriptions ({inscriptions.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("inscription","�~" Ajouter",{})}>+ Ajouter</button>
            </div>
            <div className="db-card"><div className="db-table-wrap">
              <table className="db-table">
                <thead><tr><th>#</th><th>Nom</th><th>Email</th><th>T�l�phone</th><th>Sujet</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {inscriptions.length===0 && <tr><td colSpan={7} className="db-empty">Aucune inscription</td></tr>}
                  {inscriptions.map(i=>(
                    <tr key={i.id}>
                      <td className="db-id">{i.id}</td>
                      <td><b>{i.nom} {i.prenom}</b></td>
                      <td style={{color:"#64748b"}}>{i.email}</td>
                      <td style={{fontSize:13}}>{i.telephone||"�"}</td>
                      <td><Badge text={i.sujet||"�"} bg="#f0f9ff" color="#0369a1"/></td>
                      <td style={{fontSize:12,color:"#94a3b8"}}>{new Date(i.created_at).toLocaleDateString("fr-FR")}</td>
                      <td><ActionBtns
                        onEdit  ={() => openModal("inscription","�S�️ Modifier",{nom:i.nom,prenom:i.prenom,email:i.email,telephone:i.telephone,sujet:i.sujet,message:i.message},i.id)}
                        onDelete={() => handleDelete("inscription",i.id)}
                        confirmId={confirmId} setConfirmId={setConfirmId} id={i.id}
                      /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></div>
          </div>
        )}

                {/* TT COURS TT */}
        {tab === "cours" && (
          <div className="db-section">

            {/* -- PROGRESSION STATS BANNER -- */}
            {progStats && (
              <div className="db-prog-banner">
                <div className="db-prog-stat">
                  <span className="db-prog-stat-val">{progStats.eleves_actifs}</span>
                  <span className="db-prog-stat-lbl">�l�ves actifs</span>
                </div>
                <div className="db-prog-divider"/>
                <div className="db-prog-stat">
                  <span className="db-prog-stat-val">{progStats.total_completions}</span>
                  <span className="db-prog-stat-lbl">Cours compl�t�s</span>
                </div>
                <div className="db-prog-divider"/>
                <div className="db-prog-stat">
                  <span className="db-prog-stat-val" style={{color: progStats.taux_global >= 60 ? "#15803d" : progStats.taux_global >= 30 ? "#a16207" : "#b91c1c"}}>
                    {progStats.taux_global}%
                  </span>
                  <span className="db-prog-stat-lbl">Taux global</span>
                </div>
                <div className="db-prog-divider"/>
                <div className="db-prog-stat">
                  <span className="db-prog-stat-val">{progStats.total_clients}</span>
                  <span className="db-prog-stat-lbl">Total clients</span>
                </div>
              </div>
            )}

            <div className="db-cours-layout">
              {/* -- Tableau des cours -- */}
              <div className="db-cours-main">
                <div className="db-section-head">
                  <h4 className="db-title">Cours ({cours.length})</h4>
                  <button className="db-btn primary" onClick={() => openModal("cours","� Ajouter un cours",{categorie:"danger",niveau:"debutant"})}>+ Ajouter</button>
                </div>
                <div className="db-card"><div className="db-table-wrap">
                  <table className="db-table">
                    <thead><tr><th>#</th><th>Titre</th><th>Cat�gorie</th><th>Niveau</th><th>Statut</th><th> �l�ves</th><th>Actions</th></tr></thead>
                    <tbody>
                      {cours.length===0 && <tr><td colSpan={7} className="db-empty">Aucun cours</td></tr>}
                      {cours.map(c=>{
                        const nbEleves = progStats?.per_cours?.[c.id] || 0;
                        return (
                          <tr key={c.id}>
                            <td className="db-id">{c.id}</td>
                            <td><b>{c.titre}</b><div style={{fontSize:11.5,color:"#94a3b8",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.description}</div></td>
                            <td><Badge text={c.categorie} bg={{danger:"#fee2e2",indication:"#dbeafe",interdiction:"#fff7ed",autre:"#f0fdf4"}[c.categorie]||"#f1f5f9"} color={{danger:"#b91c1c",indication:"#1d4ed8",interdiction:"#c2410c",autre:"#15803d"}[c.categorie]||"#64748b"}/></td>
                            <td><Badge text={c.niveau} bg={{debutant:"#dcfce7",intermediaire:"#fef9c3",avance:"#fee2e2"}[c.niveau]||"#f1f5f9"} color={{debutant:"#15803d",intermediaire:"#a16207",avance:"#b91c1c"}[c.niveau]||"#64748b"}/></td>
                            <td><Badge text={c.actif?"Actif":"Inactif"} bg={c.actif?"#dcfce7":"#f1f5f9"} color={c.actif?"#15803d":"#64748b"}/></td>
                            <td>
                              <span style={{display:"inline-flex",alignItems:"center",gap:5,fontWeight:700,color: nbEleves>0?"#15803d":"#94a3b8",fontSize:13}}>
                                {nbEleves > 0 ? "" : ""} {nbEleves > 0 ? `${nbEleves} �l�ve${nbEleves>1?"s":""}` : "0"}
                              </span>
                            </td>
                            <td><ActionBtns
                              onEdit  ={() => openModal("cours"," Modifier le cours",{titre:c.titre,description:c.description||"",categorie:c.categorie,image:c.image||"",niveau:c.niveau},c.id)}
                              onDelete={() => handleDelete("cours",c.id)}
                              confirmId={confirmId} setConfirmId={setConfirmId} id={c.id}
                            /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div></div>
              </div>

              {/* -- Top eleves (panneau lateral) -- */}
              {progStats?.per_client?.length > 0 && (
                <div className="db-cours-side">
                  <div className="db-card">
                    <div className="db-card-head"><span><� Top �l�ves  Progression</span></div>
                    <div style={{padding:"4px 0"}}>
                      {progStats.per_client.map((cl, idx) => (
                        <div key={cl.client_id} className="db-prog-row">
                          <span className="db-prog-rank" style={{color: idx===0?"#d97706":idx===1?"#64748b":idx===2?"#c2410c":"#94a3b8"}}>
                            {idx===0?">G":idx===1?">H":idx===2?">I":`#${idx+1}`}
                          </span>
                          <div className="db-prog-info">
                            <span className="db-prog-name">{cl.prenom} {cl.nom}</span>
                            <div className="db-prog-bar-wrap">
                              <div className="db-prog-bar" style={{width:`${cl.pourcentage}%`, background: cl.pourcentage>=80?"#15803d":cl.pourcentage>=50?"#2563eb":"#e63946"}}/>
                            </div>
                          </div>
                          <span className="db-prog-pct">{cl.pourcentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* �"��"� MONITEURS �"��"� */}
        {tab === "moniteurs" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">Moniteurs ({moniteurs.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("moniteur","�~" Ajouter un moniteur",{actif:true})}>+ Ajouter</button>
            </div>
            <div className="db-card"><div className="db-table-wrap">
              <table className="db-table">
                <thead><tr><th>#</th><th>Nom complet</th><th>T�l�phone</th><th>Email</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {moniteurs.length===0 && <tr><td colSpan={6} className="db-empty">Aucun moniteur</td></tr>}
                  {moniteurs.map(m=>(
                    <tr key={m.id}>
                      <td className="db-id">{m.id}</td>
                      <td><b>{m.prenom} {m.nom}</b></td>
                      <td>{m.telephone}</td>
                      <td style={{color:"#64748b"}}>{m.email}</td>
                      <td><Badge text={m.actif?"Actif":"Inactif"} bg={m.actif?"#dcfce7":"#f1f5f9"} color={m.actif?"#15803d":"#64748b"}/></td>
                      <td><ActionBtns
                        onEdit  ={() => openModal("moniteur","�S�️ Modifier",{nom:m.nom,prenom:m.prenom,telephone:m.telephone,email:m.email,actif:m.actif},m.id)}
                        onDelete={() => handleDelete("moniteur",m.id)}
                        confirmId={confirmId} setConfirmId={setConfirmId} id={m.id}
                      /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></div>
          </div>
        )}

        {/* �"��"� V�0HICULES �"��"� */}
        {tab === "vehicules" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">V�hicules ({vehicules.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("vehicule","�~" Ajouter un v�hicule",{disponibilite:"disponible"})}>+ Ajouter</button>
            </div>
            <div className="db-card"><div className="db-table-wrap">
              <table className="db-table">
                <thead><tr><th>#</th><th>V�hicule</th><th>Immatriculation</th><th>Disponibilit�</th><th>Actions</th></tr></thead>
                <tbody>
                  {vehicules.length===0 && <tr><td colSpan={5} className="db-empty">Aucun v�hicule</td></tr>}
                  {vehicules.map(v=>(
                    <tr key={v.id}>
                      <td className="db-id">{v.id}</td>
                      <td><b>{v.marque} {v.modele}</b></td>
                      <td><code style={{background:"#f1f5f9",padding:"2px 7px",borderRadius:5,fontSize:12}}>{v.immatriculation}</code></td>
                      <td><Badge text={{disponible:"Disponible",en_maintenance:"Maintenance",hors_service:"Hors service"}[v.disponibilite]||v.disponibilite} bg={{disponible:"#dcfce7",en_maintenance:"#fef9c3",hors_service:"#fee2e2"}[v.disponibilite]||"#f1f5f9"} color={{disponible:"#15803d",en_maintenance:"#a16207",hors_service:"#b91c1c"}[v.disponibilite]||"#64748b"}/></td>
                      <td><ActionBtns
                        onEdit  ={() => openModal("vehicule","�S�️ Modifier",{marque:v.marque,modele:v.modele,immatriculation:v.immatriculation,disponibilite:v.disponibilite},v.id)}
                        onDelete={() => handleDelete("vehicule",v.id)}
                        confirmId={confirmId} setConfirmId={setConfirmId} id={v.id}
                      /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></div>
          </div>
        )}

        {/* �"��"� S�0ANCES �"��"� */}
        {tab === "seances" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">S�ances ({seances.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("seance","�~" Planifier une s�ance",{client_id:"",moniteur_id:"",vehicule_id:"",date:"",heure_debut:"",heure_fin:"",notes:""})}>+ Planifier</button>
            </div>
            <div className="db-card"><div className="db-table-wrap">
              <table className="db-table">
                <thead><tr><th>#</th><th>�0l�ve</th><th>Moniteur</th><th>V�hicule</th><th>Date</th><th>Horaire</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {seances.length===0 && <tr><td colSpan={8} className="db-empty">Aucune s�ance</td></tr>}
                  {seances.map(s=>{
                    const st = STATUT_SEANCE[s.statut]||{label:s.statut,bg:"#f1f5f9",color:"#64748b"};
                    return (
                      <tr key={s.id}>
                        <td className="db-id">{s.id}</td>
                        <td><b>{s.client?.nom} {s.client?.prenom}</b></td>
                        <td>{s.moniteur?.prenom} {s.moniteur?.nom}</td>
                        <td style={{fontSize:12}}>{s.vehicule?.marque} {s.vehicule?.modele}</td>
                        <td style={{fontSize:12}}>{new Date(s.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})}</td>
                        <td style={{fontSize:12,whiteSpace:"nowrap"}}>{s.heure_debut} � {s.heure_fin}</td>
                        <td><Badge text={st.label} bg={st.bg} color={st.color}/></td>
                        <td><ActionBtns
                          onAnnuler={s.statut==="planifiee" ? annulerSeance : null}
                          onDelete ={() => handleDelete("seance",s.id)}
                          confirmId={confirmId} setConfirmId={setConfirmId} id={s.id}
                        /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div></div>
          </div>
        )}

        {/* �"��"��"��"��"��"��"��"��"��"� QCM QUESTIONS �"��"��"��"��"��"��"��"��"��"� */}
        {tab === "qcm" && (() => {
          const QCM_CATS = [
            { key:"danger",       label:"�a�️ Danger",        color:"#e63946", bg:"#fee2e2" },
            { key:"indication",   label:"��️ Indication",    color:"#2563eb", bg:"#dbeafe" },
            { key:"interdiction", label:"�xa� Interdiction",  color:"#c2410c", bg:"#fff7ed" },
            { key:"code_route",   label:"=� Code Route",    color:"#7c3aed", bg:"#f5f3ff" },
            { key:"conduite",     label:"=� Conduite",      color:"#059669", bg:"#ecfdf5" },
            { key:"autre",        label:"�xR Autre",         color:"#64748b", bg:"#f8fafc" },
          ];
          const catQuestions = questions.filter(q => q.categorie === qcmCat);
          const activeCat    = QCM_CATS.find(c => c.key === qcmCat) || QCM_CATS[0];
          return (
            <div className="db-section">
              <div className="db-section-head">
                <h4 className="db-title">=� Quiz QCM � Gestion par Cat�gorie</h4>
              </div>

              {/* Sub-tabs */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
                {QCM_CATS.map(c => {
                  const cnt = questions.filter(q => q.categorie === c.key).length;
                  const active = qcmCat === c.key;
                  return (
                    <button key={c.key} onClick={() => setQcmCat(c.key)}
                      style={{padding:"7px 16px",borderRadius:20,border:"2px solid",
                        borderColor:active ? c.color:"#e2e8f0",
                        background:active ? c.bg:"white",
                        color:active ? c.color:"#64748b",
                        fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s",
                        display:"flex",alignItems:"center",gap:6}}>
                      {c.label}
                      <span style={{background:active?c.color:"#e2e8f0",color:active?"white":"#64748b",
                        borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:800}}>{cnt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div className="db-card">
                <div className="db-card-head" style={{justifyContent:"space-between"}}>
                  <span style={{fontWeight:700,color:activeCat.color}}>
                    {activeCat.label} � {catQuestions.length} question(s)
                  </span>
                  <button className="db-btn primary"
                    onClick={() => openModal("question","�~" Ajouter une question",{correct_answer:"a",categorie:qcmCat})}>
                    + Ajouter
                  </button>
                </div>
                <div className="db-table-wrap">
                  <table className="db-table">
                    <thead><tr><th>#</th><th>Question</th><th>A</th><th>B</th><th>C</th><th>D</th><th>�S</th><th>Actions</th></tr></thead>
                    <tbody>
                      {catQuestions.length===0 && <tr><td colSpan={8} className="db-empty">Aucune question � cliquez « + Ajouter »</td></tr>}
                      {catQuestions.map(q=>(
                        <tr key={q.id}>
                          <td className="db-id">{q.id}</td>
                          <td style={{maxWidth:260,fontSize:13}}><b>{q.question}</b>
                            {q.explication && <div style={{fontSize:11,color:"#94a3b8",marginTop:2,fontStyle:"italic"}}>{q.explication.slice(0,70)}...</div>}
                          </td>
                          <td style={{fontSize:12,color:"#475569",maxWidth:110}}>{q.option_a}</td>
                          <td style={{fontSize:12,color:"#475569",maxWidth:110}}>{q.option_b}</td>
                          <td style={{fontSize:12,color:"#475569",maxWidth:110}}>{q.option_c}</td>
                          <td style={{fontSize:12,color:"#475569",maxWidth:110}}>{q.option_d}</td>
                          <td><Badge text={q.correct_answer?.toUpperCase()} bg="#dcfce7" color="#15803d"/></td>
                          <td>
                            <ActionBtns
                              onEdit  ={() => openModal("question","�S�️ Modifier",{question:q.question,option_a:q.option_a,option_b:q.option_b,option_c:q.option_c,option_d:q.option_d,correct_answer:q.correct_answer,explication:q.explication||"",categorie:q.categorie},q.id)}
                              onDelete={() => handleDelete("question",q.id)}
                              confirmId={confirmId} setConfirmId={setConfirmId} id={q.id}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* �"��"� AVIS �"��"� */}
        {tab === "avis" && (
          <div className="db-section">
            <div className="db-section-head"><h4 className="db-title">Avis �0l�ves ({avis.length})</h4></div>
            <div className="db-card"><div className="db-table-wrap">
              <table className="db-table">
                <thead><tr><th>#</th><th>Auteur</th><th>T�moignage</th><th>Note</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {avis.length === 0 && <tr><td colSpan={7} className="db-empty">Aucun avis re�u</td></tr>}
                  {avis.map(a => {
                    const sc = {pending:{label:"En attente",bg:"#fef9c3",color:"#a16207"},approved:{label:"Approuv�",bg:"#dcfce7",color:"#15803d"},rejected:{label:"Rejet�",bg:"#fee2e2",color:"#b91c1c"}}[a.statut]||{label:a.statut,bg:"#f1f5f9",color:"#64748b"};
                    return (
                      <tr key={a.id}>
                        <td className="db-id">{a.id}</td>
                        <td><b>{a.nom}{a.prenom?' '+a.prenom:''}</b><div style={{fontSize:11.5,color:"#94a3b8"}}>{a.role_label}</div></td>
                        <td style={{maxWidth:280,fontSize:12.5,color:"#475569",fontStyle:"italic"}}>"{a.texte?.slice(0,100)}{a.texte?.length>100?'...':''}"</td>
                        <td style={{color:"#fbbf24",fontWeight:700}}>{'��&'.repeat(a.note)}</td>
                        <td><Badge text={sc.label} bg={sc.bg} color={sc.color}/></td>
                        <td style={{fontSize:12,color:"#94a3b8"}}>{new Date(a.created_at).toLocaleDateString("fr-FR")}</td>
                        <td>
                          <div className="db-actions">
                            {a.statut !== 'approved' && <button className="db-btn view" title="Approuver" onClick={async () => { await axios.patch(`${API}/avis/${a.id}/statut`,{statut:'approved'}); loadedTabs.current.delete('avis'); loadTab('avis'); showToast('Avis approuv� !'); }}>�S&</button>}
                            {a.statut !== 'rejected' && <button className="db-btn warn"  title="Rejeter"   onClick={async () => { await axios.patch(`${API}/avis/${a.id}/statut`,{statut:'rejected'}); loadedTabs.current.delete('avis'); loadTab('avis'); showToast('Avis rejet�.'); }}>�R</button>}
                            {confirmId === a.id ? (
                              <><button className="db-btn danger" onClick={async () => { await axios.delete(`${API}/avis/${a.id}`); setConfirmId(null); loadedTabs.current.delete('avis'); loadTab('avis'); showToast('Supprim�.'); }}>Oui</button>
                              <button className="db-btn neutral" onClick={() => setConfirmId(null)}>Non</button></>
                            ) : <button className="db-btn danger" onClick={() => setConfirmId(a.id)} title="Supprimer">�x️</button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div></div>
          </div>
        )}

        {/* �"��"� FAQ �"��"� */}
        {tab === "faq" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">FAQ � Questions fr�quentes ({faqs.length})</h4>
              <button className="db-btn primary" onClick={openFaqCreate}>+ Ajouter</button>
            </div>
            <div className="db-card"><div className="db-table-wrap">
              <table className="db-table">
                <thead><tr><th>#</th><th>Image</th><th>Question</th><th>R�ponse</th><th>Ordre</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {faqs.length === 0 && <tr><td colSpan={7} className="db-empty">Aucune FAQ</td></tr>}
                  {faqs.map(f => (
                    <tr key={f.id}>
                      <td className="db-id">{f.id}</td>
                      <td>{f.image ? <img src={f.image} alt="faq" style={{width:52,height:40,objectFit:"cover",borderRadius:8,border:"1.5px solid #e2e8f0"}} onError={e=>{e.target.style.display="none";}} /> : <span style={{color:"#cbd5e1",fontSize:12}}>�</span>}</td>
                      <td style={{maxWidth:200}}><b style={{fontSize:13}}>{f.question}</b></td>
                      <td style={{maxWidth:260,fontSize:12.5,color:"#475569"}}>{f.reponse?.slice(0,80)}{f.reponse?.length>80?"⬦":""}</td>
                      <td style={{textAlign:"center",fontWeight:700,color:"#64748b"}}>{f.ordre}</td>
                      <td><Badge text={f.actif?"Actif":"Inactif"} bg={f.actif?"#dcfce7":"#f1f5f9"} color={f.actif?"#15803d":"#64748b"}/></td>
                      <td>
                        <div className="db-actions">
                          <button className="db-btn edit" onClick={() => openFaqEdit(f)} title="Modifier">�S�️</button>
                          {faqConfirmDel === f.id ? (
                            <><button className="db-btn danger" onClick={() => handleFaqDelete(f.id)}>Oui</button>
                            <button className="db-btn neutral" onClick={() => setFaqConfirmDel(null)}>Non</button></>
                          ) : <button className="db-btn danger" onClick={() => setFaqConfirmDel(f.id)} title="Supprimer">�x️</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></div>
          </div>
        )}

        {/* �"��"� MESSAGES �"��"� */}
        {tab === "messages" && (
          <div className="db-section db-section-messages">
            {/* Si une conversation est ouverte �  afficher ConversationView */}
            {convMsg ? (
              <ConversationView
                msg={convMsg}
                onReply={handleReply}
                onArchive={handleArchive}
                onClose={() => setConvMsg(null)}
              />
            ) : (
              <>
                <div className="db-section-head">
                  <h4 className="db-title">
                    Messagerie
                    {nbNouveaux > 0 && (
                      <span className="msg-badge-count">{nbNouveaux} nouveau{nbNouveaux>1?"x":""}</span>
                    )}
                  </h4>
                </div>

                {/* Filtres */}
                <div className="msg-filtres">
                  {["tous","nouveau","lu","repondu","archive"].map(f => (
                    <button key={f}
                      className={`msg-filtre-btn ${msgFiltre===f?"active":""}`}
                      onClick={() => setMsgFiltre(f)}>
                      { {tous:"Tous",nouveau:"�x� Nouveaux",lu:"�x� Lus",repondu:"�S& R�pondus",archive:"�x�️ Archiv�s"}[f] }
                      <span className="msg-filtre-count">
                        {f==="tous" ? messages.length : messages.filter(m=>m.statut===f).length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Liste des messages */}
                <div className="msg-list">
                  {msgFiltres.length === 0 && (
                    <div className="msg-empty">Aucun message dans cette cat�gorie</div>
                  )}
                  {msgFiltres.map(m => {
                    const sc = STATUT_MSG[m.statut] || STATUT_MSG.nouveau;
                    const initiales = `${m.prenom?.[0]||""}${m.nom?.[0]||""}`.toUpperCase();
                    return (
                      <div
                        key={m.id}
                        className={`msg-item ${m.statut==="nouveau"?"msg-item--new":""}`}
                        onClick={() => openConversation(m)}
                      >
                        <div className="msg-item-avatar">{initiales}</div>
                        <div className="msg-item-body">
                          <div className="msg-item-top">
                            <span className="msg-item-name">{m.prenom} {m.nom}</span>
                            <span className="msg-item-date">
                              {new Date(m.created_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"})}
                            </span>
                          </div>
                          <div className="msg-item-email">{m.email}{m.telephone ? ` · ${m.telephone}` : ""}</div>
                          {m.sujet && <div className="msg-item-sujet">{m.sujet}</div>}
                          <div className="msg-item-preview">{m.message?.slice(0,90)}{m.message?.length>90?"⬦":""}</div>
                          {m.reponse_admin && (
                            <div className="msg-item-replied">
                              � �️ R�pondu · {new Date(m.repondu_le).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                        </div>
                        <div className="msg-item-right">
                          <Badge text={sc.label} bg={sc.bg} color={sc.color}/>
                          <div className="db-actions" onClick={e => e.stopPropagation()}>
                            {confirmId === `del-${m.id}` ? (
                              <><button className="db-btn danger" onClick={() => handleDeleteMsg(m.id)}>Oui</button>
                              <button className="db-btn neutral" onClick={() => setConfirmId(null)}>Non</button></>
                            ) : (
                              <button className="db-btn danger" onClick={() => setConfirmId(`del-${m.id}`)} title="Supprimer">�x️</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

      </main>

      {/* �"��"� MODAL FAQ �"��"� */}
      {faqModal && (
        <div className="db-modal-overlay" onClick={() => setFaqModal(false)}>
          <div className="db-modal db-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="db-modal-head">
              <h5>{faqEditItem ? "�S�️ Modifier la FAQ" : "�~" Nouvelle question FAQ"}</h5>
              <button className="db-modal-x" onClick={() => setFaqModal(false)}>�</button>
            </div>
            <div className="db-modal-body">
              {faqError && <div className="db-alert err">�a� {faqError}</div>}
              <div className="db-field">
                <label>Question *</label>
                <input className="db-input" type="text" value={faqForm.question}
                  onChange={e => setFaqForm({...faqForm,question:e.target.value})}
                  placeholder="Ex: Combien co�te la formation ?" />
              </div>
              <div className="db-field">
                <label>R�ponse *</label>
                <textarea className="db-input" rows={4} value={faqForm.reponse}
                  onChange={e => setFaqForm({...faqForm,reponse:e.target.value})}
                  placeholder="R�ponse d�taill�e⬦" />
              </div>
              <div className="db-field">
                <label>�x� Image (fichier local � optionnel)</label>
                <input type="file" className="db-input"
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                  onChange={handleFaqImageChange} />
                {faqImagePreview && (
                  <div style={{marginTop:10,borderRadius:10,overflow:"hidden",border:"2px solid #e2e8f0",maxHeight:160}}>
                    <img src={faqImagePreview} alt="Aper�u"
                      style={{width:"100%",height:155,objectFit:"cover",display:"block"}}
                      onError={e=>{e.target.style.display="none";}} />
                  </div>
                )}
                {faqEditItem && !faqImageFile && faqEditItem.image && (
                  <p style={{fontSize:11.5,color:"#94a3b8",marginTop:5}}>
                    �x� Une image existe d�j�. Choisissez un nouveau fichier pour la remplacer.
                  </p>
                )}
              </div>
              <div className="db-form-row">
                <div className="db-field">
                  <label>Ordre</label>
                  <input className="db-input" type="number" min={0} value={faqForm.ordre}
                    onChange={e => setFaqForm({...faqForm,ordre:parseInt(e.target.value)||0})} />
                </div>
                <div className="db-field">
                  <label>Statut</label>
                  <select className="db-input" value={faqForm.actif?"1":"0"}
                    onChange={e => setFaqForm({...faqForm,actif:e.target.value==="1"})}>
                    <option value="1">Actif (visible)</option>
                    <option value="0">Inactif (masqu�)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="db-modal-foot">
              <button className="db-btn neutral lg" onClick={() => setFaqModal(false)}>Annuler</button>
              <button className="db-btn primary lg" onClick={handleFaqSave} disabled={faqSaving}>
                {faqSaving ? "Enregistrement⬦" : "�x� Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* �"��"� MODAL G�0N�0RIQUE �"��"� */}
      <Modal show={modal.show} onClose={()=>setModal(m=>({...m,show:false}))}
        title={modal.title} onSave={handleSave} error={modalErr}>
        {modal.entity === "client" && <>
          <div className="db-form-row">{F("nom","Nom")}{F("prenom","Pr�nom")}</div>
          {F("email","Email","email")}
          {F("password","Mot de passe","password")}
          {F("role","R�le","text",[{v:"user",l:"Utilisateur"},{v:"admin",l:"Admin"}])}
        </>}
        {modal.entity === "inscription" && <>
          <div className="db-form-row">{F("nom","Nom")}{F("prenom","Pr�nom")}</div>
          <div className="db-form-row">{F("email","Email","email")}{F("telephone","T�l�phone")}</div>
          {F("sujet","Sujet","text",[{v:"",l:"-- Choisir --"},{v:"Inscription",l:"Inscription"},{v:"Information",l:"Information"},{v:"Tarifs",l:"Tarifs"},{v:"Cours de code",l:"Cours de code"},{v:"Cours de conduite",l:"Cours de conduite"}])}
          {F("message","Message","textarea")}
        </>}
        {modal.entity === "cours" && <>
          {F("titre","Titre *")}
          {F("description","Description","textarea")}
          <div className="db-form-row">
            {F("categorie","Cat�gorie","text",[{v:"danger",l:"Danger"},{v:"indication",l:"Indication"},{v:"interdiction",l:"Interdiction"},{v:"code_route",l:"Code Route"},{v:"conduite",l:"Conduite"},{v:"autre",l:"Autre"}])}
            {F("niveau","Niveau","text",[{v:"debutant",l:"D�butant"},{v:"intermediaire",l:"Interm�diaire"},{v:"avance",l:"Avanc�"}])}
          </div>
          <div className="db-field">
            <label>�x�️ Image du cours (URL)</label>
            <input className="db-input" type="text" placeholder="https://..." value={formData.image||""} onChange={e=>setFormData({...formData,image:e.target.value})}/>
            {formData.image && (
              <div style={{marginTop:10,borderRadius:10,overflow:"hidden",border:"2px solid #e2e8f0",maxHeight:160}}>
                <img src={formData.image} alt="Aper�u" onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="block";}} style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
                <div style={{display:"none",padding:"8px 12px",background:"#fee2e2",color:"#b91c1c",fontSize:12}}>�a�️ Lien invalide</div>
              </div>
            )}
          </div>
          {F("video_url","�x}� Lien Vid�o YouTube")}
          {F("pdf_url","�x Lien PDF")}
        </>}
        {modal.entity === "moniteur" && <>
          <div className="db-form-row">{F("nom","Nom")}{F("prenom","Pr�nom")}</div>
          <div className="db-form-row">{F("telephone","T�l�phone")}{F("email","Email","email")}</div>
          {F("actif","Statut","text",[{v:true,l:"Actif"},{v:false,l:"Inactif"}])}
        </>}
        {modal.entity === "vehicule" && <>
          <div className="db-form-row">{F("marque","Marque")}{F("modele","Mod�le")}</div>
          {F("immatriculation","Immatriculation")}
          {F("disponibilite","Disponibilit�","text",[{v:"disponible",l:"Disponible"},{v:"en_maintenance",l:"En maintenance"},{v:"hors_service",l:"Hors service"}])}
        </>}
        {modal.entity === "seance" && <>
          {F("client_id","�0l�ve","text",clients.map(c=>({v:c.id,l:`${c.prenom} ${c.nom}`})))}
          {F("moniteur_id","Moniteur","text",moniteurs.map(m=>({v:m.id,l:`${m.prenom} ${m.nom}`})))}
          {F("vehicule_id","V�hicule","text",vehicules.map(v=>({v:v.id,l:`${v.marque} ${v.modele} (${v.immatriculation})`})))}
          {F("date","Date","date")}

          {/* S�lecteur d'heure de d�but � uniquement heures rondes */}
          <div className="db-field">
            <label>�x"� Heure de d�but <span style={{fontSize:11,color:"#94a3b8",fontWeight:400}}>(heures rondes uniquement)</span></label>
            <select
              className="db-input"
              value={formData.heure_debut||""}
              onChange={e => {
                const h = e.target.value;
                const fin = h ? String(parseInt(h)+1).padStart(2,"0")+":00" : "";
                setFormData({...formData, heure_debut:h, heure_fin:fin});
                // Charger les cr�neaux si date + moniteur + vehicule sont choisis
                if (formData.date && formData.moniteur_id && formData.vehicule_id && h) {
                  setCreneauxLoading(true);
                  axios.get(`${API}/seances/creneaux`,{params:{date:formData.date,moniteur_id:formData.moniteur_id,vehicule_id:formData.vehicule_id}})
                    .then(r => setCreneaux(r.data))
                    .catch(()=>{})
                    .finally(()=>setCreneauxLoading(false));
                }
              }}
            >
              <option value="">-- Choisir une heure --</option>
              {HEURES.map(h => {
                const cr = creneaux.find(c => c.heure_debut === h);
                const dispo = !cr || cr.disponible;
                const places = cr ? Math.min(cr.places_moniteur, cr.places_vehicule) : "?";
                return (
                  <option key={h} value={h} disabled={cr && !cr.disponible}>
                    {h} �  {String(parseInt(h)+1).padStart(2,"0")}:00
                    {cr ? (cr.disponible ? `  �S ${places} place${places>1?"s":""} restante${places>1?"s":""}` : "  �S Complet") : ""}
                  </option>
                );
              })}
            </select>

            {/* Indicateur de places en temps r�el */}
            {formData.heure_debut && creneaux.length > 0 && (() => {
              const cr = creneaux.find(c => c.heure_debut === formData.heure_debut);
              if (!cr) return null;
              const places = Math.min(cr.places_moniteur, cr.places_vehicule);
              if (!cr.disponible) return (
                <div style={{marginTop:8,padding:"8px 12px",background:"#fee2e2",borderRadius:8,fontSize:12.5,color:"#b91c1c",display:"flex",gap:6,alignItems:"center"}}>
                  �a�️ Ce cr�neau est complet (3/3 �l�ves). Choisissez une autre heure.
                </div>
              );
              return (
                <div style={{marginTop:8,padding:"8px 12px",background:"#dcfce7",borderRadius:8,fontSize:12.5,color:"#15803d",display:"flex",gap:6,alignItems:"center"}}>
                  �S& {places} place{places>1?"s":""} restante{places>1?"s":""} sur ce cr�neau (max 3 �l�ves)
                </div>
              );
            })()}

            {creneauxLoading && (
              <div style={{marginTop:8,fontSize:12,color:"#94a3b8"}}>⏳ V�rification des disponibilit�s⬦</div>
            )}

            {/* Bouton pour charger les disponibilit�s manuellement */}
            {formData.date && formData.moniteur_id && formData.vehicule_id && creneaux.length === 0 && !creneauxLoading && (
              <button
                type="button"
                style={{marginTop:8,fontSize:12,padding:"6px 14px",borderRadius:8,border:"1.5px solid #e2e8f0",background:"#f8fafc",cursor:"pointer",color:"#475569"}}
                onClick={async () => {
                  setCreneauxLoading(true);
                  try {
                    const r = await axios.get(`${API}/seances/creneaux`,{params:{date:formData.date,moniteur_id:formData.moniteur_id,vehicule_id:formData.vehicule_id}});
                    setCreneaux(r.data);
                  } finally { setCreneauxLoading(false); }
                }}
              >
                �x� V�rifier les disponibilit�s
              </button>
            )}
          </div>

          {/* Heure de fin � calcul�e automatiquement */}
          {formData.heure_debut && (
            <div className="db-field">
              <label>�x"� Heure de fin <span style={{fontSize:11,color:"#94a3b8"}}>(automatique : +1 heure)</span></label>
              <input className="db-input" type="text" value={formData.heure_fin||""} readOnly
                style={{background:"#f8fafc",color:"#64748b",cursor:"not-allowed"}}/>
            </div>
          )}

          {F("notes","Notes (optionnel)","textarea")}
        </>}
        {modal.entity === "question" && <>
          {F("question","Question *","textarea")}
          <div className="db-form-row">{F("option_a","Option A")}{F("option_b","Option B")}</div>
          <div className="db-form-row">{F("option_c","Option C")}{F("option_d","Option D")}</div>
          <div className="db-form-row">
            {F("correct_answer","Bonne r\u00e9ponse","text",[{v:"a",l:"A"},{v:"b",l:"B"},{v:"c",l:"C"},{v:"d",l:"D"}])}
            {F("categorie","Cat\u00e9gorie","text",[{v:"danger",l:"\u26a0\ufe0f Danger"},{v:"indication",l:"\u2139\ufe0f Indication"},{v:"interdiction",l:"=� Interdiction"},{v:"code_route",l:"\ud83d� Code Route"},{v:"conduite",l:"=� Conduite"},{v:"autre",l:"=� Autre"}])}
          </div>
          {F("explication","Explication (optionnel)","textarea")}
        </>
        }
      </Modal>

      {sidebarOpen && <div className="db-overlay" onClick={() => setSidebarOpen(false)}/>}
    </div>
  );
}
