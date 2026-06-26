import React, { useState, useMemo } from "react";
import {
  Home, Award, Send, Trophy, User, Mail, Heart, Plus, Search,
  Sparkles, Medal, Crown, ChevronRight, Star, Zap, Users, X, Check,
} from "lucide-react";

/* ============================================================
   PROGRAMA RECONHECER — GOL / Inteligência
   Protótipo navegável (dados fictícios, sem banco)
   Paleta: laranja GOL + grafite. Assinatura: "o elo" (conexão).
   ============================================================ */

// ---------- Design tokens ----------
const C = {
  orange: "#FF5A00",
  orangeDeep: "#E14E00",
  orangeSoft: "#FFEDE2",
  graphite: "#1C1C22",
  slate: "#3A3A45",
  mute: "#8A8A96",
  line: "#ECECEF",
  bg: "#F7F6F4",
  white: "#FFFFFF",
  gold: "#E8A100",
};

// ---------- Dados fictícios ----------
const CATEGORIES = [
  { id: "colab", label: "Colaboração", weight: 1, icon: Users, color: "#2D7DD2" },
  { id: "entrega", label: "Entrega & Resultado", weight: 2, icon: Zap, color: "#FF5A00" },
  { id: "inova", label: "Inovação", weight: 3, icon: Sparkles, color: "#7B2FBE" },
  { id: "alem", label: "Acima & Além", weight: 3, icon: Star, color: "#E8A100" },
];

const PEOPLE = [
  { id: 1, name: "Marina Alves", role: "Analista de Inteligência", initials: "MA" },
  { id: 2, name: "Rafael Souza", role: "Especialista de Dados", initials: "RS" },
  { id: 3, name: "Camila Torres", role: "Coordenadora de Ops", initials: "CT" },
  { id: 4, name: "Diego Martins", role: "Analista de BI", initials: "DM" },
  { id: 5, name: "Letícia Rocha", role: "Cientista de Dados", initials: "LR" },
  { id: 6, name: "Bruno Carvalho", role: "Analista de Processos", initials: "BC" },
  { id: 7, name: "Você", role: "Inteligência", initials: "EU" },
];

const seedRecs = [
  { id: 101, fromId: 3, toId: 1, cat: "inova", public: true, likes: 14,
    msg: "A Marina criou um dashboard que cortou 3h do nosso fechamento mensal. Mudou o jogo pra equipe inteira.", days: 1 },
  { id: 102, fromId: 2, toId: 5, cat: "alem", public: true, likes: 21,
    msg: "Letícia ficou até tarde ajudando no modelo preditivo mesmo não sendo dela a demanda. Generosidade rara.", days: 1 },
  { id: 103, fromId: 4, toId: 1, cat: "entrega", public: true, likes: 9,
    msg: "Entregou o relatório da diretoria com um dia de antecedência e ainda revisou os meus números. Obrigado!", days: 2 },
  { id: 104, fromId: 6, toId: 3, cat: "colab", public: true, likes: 7,
    msg: "Camila destravou a integração com o time de Ops numa call de 10 minutos. Liderança na prática.", days: 3 },
  { id: 105, fromId: 5, toId: 2, cat: "inova", public: true, likes: 12,
    msg: "Rafael automatizou a coleta que a gente fazia na mão. Semana passada economizou meio dia de trabalho.", days: 4 },
  { id: 106, fromId: 1, toId: 4, cat: "colab", public: true, likes: 5,
    msg: "Diego sempre o primeiro a responder quando alguém trava num dado. Pilar silencioso do time.", days: 5 },
];

const HALL = [
  { month: "Maio/2026", name: "Rafael Souza", initials: "RS", pts: 38, cat: "Inovação" },
  { month: "Abril/2026", name: "Camila Torres", initials: "CT", pts: 41, cat: "Acima & Além" },
  { month: "Março/2026", name: "Letícia Rocha", initials: "LR", pts: 33, cat: "Entrega & Resultado" },
];

// ---------- Helpers ----------
const catById = (id) => CATEGORIES.find((c) => c.id === id);
const personById = (id) => PEOPLE.find((p) => p.id === id);
const ME = 7;

function timeAgo(days) {
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  return `há ${days} dias`;
}

// Pontuação: peso da categoria + 0,2 por curtida
function scoreOf(rec) {
  return catById(rec.cat).weight + rec.likes * 0.2;
}

// ---------- Avatar ----------
function Avatar({ p, size = 40, ring }) {
  const fontSize = size * 0.36;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: p.id === ME ? C.graphite : `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
      color: C.white, display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize, letterSpacing: "0.02em",
      boxShadow: ring ? `0 0 0 3px ${C.white}, 0 0 0 5px ${C.orange}` : "none",
    }}>
      {p.initials}
    </div>
  );
}

// ---------- Chip de categoria ----------
function CatChip({ catId, small }) {
  const c = catById(catId);
  const Icon = c.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: `${c.color}14`, color: c.color,
      padding: small ? "3px 8px" : "5px 11px", borderRadius: 999,
      fontSize: small ? 11 : 12.5, fontWeight: 650, whiteSpace: "nowrap",
    }}>
      <Icon size={small ? 12 : 14} strokeWidth={2.5} /> {c.label}
    </span>
  );
}

// ============================================================
//  APP
// ============================================================
export default function App() {
  const [tab, setTab] = useState("home");
  const [recs, setRecs] = useState(seedRecs);
  const [liked, setLiked] = useState({});
  const [profileId, setProfileId] = useState(null);
  const [toast, setToast] = useState(null);

  function toggleLike(id) {
    setLiked((l) => ({ ...l, [id]: !l[id] }));
    setRecs((rs) => rs.map((r) =>
      r.id === id ? { ...r, likes: r.likes + (liked[id] ? -1 : 1) } : r
    ));
  }

  function addRec(rec) {
    setRecs((rs) => [{ ...rec, id: Date.now(), fromId: ME, likes: 0, days: 0 }, ...rs]);
    setToast(rec.public ? "Reconhecimento publicado no mural!" : "Mensagem privada enviada!");
    setTimeout(() => setToast(null), 2600);
    setTab(rec.public ? "home" : "mensagens");
  }

  function openProfile(id) { setProfileId(id); setTab("perfil"); }

  // Ranking do mês
  const ranking = useMemo(() => {
    const totals = {};
    recs.forEach((r) => {
      totals[r.toId] = (totals[r.toId] || 0) + scoreOf(r);
    });
    return Object.entries(totals)
      .map(([id, pts]) => ({ person: personById(Number(id)), pts: Math.round(pts * 10) / 10,
        count: recs.filter((r) => r.toId === Number(id)).length }))
      .sort((a, b) => b.pts - a.pts);
  }, [recs]);

  const NAV = [
    { id: "home", label: "Mural", icon: Home },
    { id: "reconhecer", label: "Reconhecer", icon: Send },
    { id: "ranking", label: "Ranking", icon: Trophy },
    { id: "hall", label: "Hall da Fama", icon: Award },
    { id: "mensagens", label: "Mensagens", icon: Mail },
  ];

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      background: C.bg, minHeight: "100vh", color: C.graphite,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; }
        .lift { transition: transform .15s ease, box-shadow .15s ease; }
        .lift:hover { transform: translateY(-2px); }
        .fade { animation: fade .35s ease; }
        @keyframes fade { from { opacity: 0; transform: translateY(8px);} to {opacity:1; transform:none;} }
        @media (prefers-reduced-motion: reduce){ .fade,.lift{animation:none;transition:none;} }
        .navbtn:focus-visible, button:focus-visible { outline: 2px solid ${C.orange}; outline-offset: 2px; }
      `}</style>

      {/* ---------- Topbar ---------- */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40, background: C.white,
        borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 22px",
          display: "flex", alignItems: "center", gap: 14 }}>
          {/* Logo "elo" */}
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <EloMark size={34} />
            <div style={{ lineHeight: 1.05 }}>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
                Reconhecer
              </div>
              <div style={{ fontSize: 11, color: C.mute, fontWeight: 600, letterSpacing: "0.04em" }}>
                GOL · INTELIGÊNCIA
              </div>
            </div>
          </div>
          <nav style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
            {NAV.map((n) => {
              const Icon = n.icon; const on = tab === n.id;
              return (
                <button key={n.id} className="navbtn" onClick={() => setTab(n.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7, padding: "9px 14px",
                    borderRadius: 10, fontWeight: 650, fontSize: 14,
                    color: on ? C.orange : C.slate,
                    background: on ? C.orangeSoft : "transparent",
                  }}>
                  <Icon size={17} strokeWidth={on ? 2.6 : 2.1} />
                  <span style={{ display: "inline" }}>{n.label}</span>
                </button>
              );
            })}
          </nav>
          <button onClick={() => openProfile(ME)} className="lift"
            style={{ marginLeft: 6 }} title="Meu perfil">
            <Avatar p={personById(ME)} size={38} />
          </button>
        </div>
      </header>

      {/* ---------- Conteúdo ---------- */}
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 22px 60px" }}>
        {tab === "home" && <Mural recs={recs} liked={liked} toggleLike={toggleLike}
          ranking={ranking} openProfile={openProfile} goReconhecer={() => setTab("reconhecer")} />}
        {tab === "reconhecer" && <Reconhecer onSend={addRec} />}
        {tab === "ranking" && <Ranking ranking={ranking} openProfile={openProfile} />}
        {tab === "hall" && <Hall />}
        {tab === "mensagens" && <Mensagens recs={recs} openProfile={openProfile} />}
        {tab === "perfil" && <Perfil id={profileId} recs={recs} ranking={ranking}
          liked={liked} toggleLike={toggleLike} goReconhecer={() => setTab("reconhecer")} />}
      </main>

      {/* ---------- Toast ---------- */}
      {toast && (
        <div className="fade" style={{
          position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)",
          background: C.graphite, color: C.white, padding: "13px 20px", borderRadius: 12,
          fontWeight: 650, fontSize: 14, display: "flex", alignItems: "center", gap: 9,
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)", zIndex: 60,
        }}>
          <Check size={17} strokeWidth={3} color={C.orange} /> {toast}
        </div>
      )}
    </div>
  );
}

// ---------- Marca "elo" (dois aros entrelaçados = conexão GOL) ----------
function EloMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="15" cy="20" r="9.5" stroke={C.orange} strokeWidth="4" />
      <circle cx="25" cy="20" r="9.5" stroke={C.graphite} strokeWidth="4" />
    </svg>
  );
}

// ============================================================
//  MURAL (Home)
// ============================================================
function Mural({ recs, liked, toggleLike, ranking, openProfile, goReconhecer }) {
  const publicRecs = recs.filter((r) => r.public);
  const leader = ranking[0];

  return (
    <div className="fade">
      {/* Hero / Destaque do mês */}
      <section style={{
        position: "relative", overflow: "hidden", borderRadius: 22,
        background: `linear-gradient(115deg, ${C.graphite} 0%, #2A2A33 55%, ${C.orangeDeep} 140%)`,
        color: C.white, padding: "30px 32px", marginBottom: 26,
      }}>
        <div style={{ position: "absolute", right: -40, top: -30, opacity: 0.13 }}>
          <svg width="240" height="240" viewBox="0 0 40 40" fill="none">
            <circle cx="15" cy="20" r="9.5" stroke="#fff" strokeWidth="2.4" />
            <circle cx="25" cy="20" r="9.5" stroke="#fff" strokeWidth="2.4" />
          </svg>
        </div>
        <div style={{ position: "relative", maxWidth: 560 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
            color: C.orange, textTransform: "uppercase" }}>
            Junho · Destaque do mês
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "10px 0 6px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Quem você reconhece <br />hoje aproxima o time amanhã.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 15, lineHeight: 1.5, margin: "0 0 20px" }}>
            Todo início de mês a Inteligência celebra quem mais recebeu reconhecimentos. Um gesto simples vira destaque.
          </p>
          <button onClick={goReconhecer} className="lift" style={{
            background: C.orange, color: C.white, fontWeight: 700, fontSize: 15,
            padding: "12px 22px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 9,
            boxShadow: "0 8px 20px rgba(255,90,0,0.35)",
          }}>
            <Send size={17} strokeWidth={2.6} /> Reconhecer alguém
          </button>
        </div>

        {/* Líder atual */}
        {leader && (
          <button onClick={() => openProfile(leader.person.id)} className="lift" style={{
            position: "relative", marginTop: 24, display: "flex", alignItems: "center", gap: 14,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 16, padding: "12px 16px", textAlign: "left", width: "fit-content",
          }}>
            <div style={{ position: "relative" }}>
              <Avatar p={leader.person} size={46} ring />
              <Crown size={20} color={C.gold} fill={C.gold} style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%) rotate(-12deg)" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.05em" }}>
                LIDERANDO AGORA
              </div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 16 }}>{leader.person.name}</div>
              <div style={{ color: C.orange, fontWeight: 700, fontSize: 13 }}>{leader.pts} pontos</div>
            </div>
            <ChevronRight size={18} color="rgba(255,255,255,0.5)" style={{ marginLeft: 6 }} />
          </button>
        )}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
        {/* Feed */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 750, margin: 0 }}>Mural de reconhecimentos</h2>
            <span style={{ fontSize: 13, color: C.mute, fontWeight: 600 }}>{publicRecs.length} públicos</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {publicRecs.map((r) => (
              <RecCard key={r.id} rec={r} liked={liked[r.id]} toggleLike={toggleLike} openProfile={openProfile} />
            ))}
          </div>
        </div>

        {/* Sidebar mini-ranking */}
        <aside style={{
          background: C.white, borderRadius: 18, border: `1px solid ${C.line}`,
          padding: 18, position: "sticky", top: 92,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Trophy size={17} color={C.orange} strokeWidth={2.5} />
            <h3 style={{ fontSize: 15, fontWeight: 750, margin: 0 }}>Top do mês</h3>
          </div>
          {ranking.slice(0, 5).map((row, i) => (
            <button key={row.person.id} onClick={() => openProfile(row.person.id)}
              style={{ display: "flex", alignItems: "center", gap: 11, width: "100%",
                padding: "9px 6px", borderRadius: 10, textAlign: "left" }}
              className="lift">
              <span style={{ width: 20, fontWeight: 800, fontSize: 14,
                color: i === 0 ? C.gold : i === 1 ? "#9AA0A6" : i === 2 ? "#CD7F32" : C.mute }}>
                {i + 1}
              </span>
              <Avatar p={row.person} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 650, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {row.person.name}
                </div>
              </div>
              <span style={{ fontWeight: 750, fontSize: 13, color: C.orange }}>{row.pts}</span>
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}

// ---------- Card de reconhecimento ----------
function RecCard({ rec, liked, toggleLike, openProfile }) {
  const from = personById(rec.fromId);
  const to = personById(rec.toId);
  return (
    <article className="lift" style={{
      background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, padding: "18px 20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 13, flexWrap: "wrap" }}>
        <button onClick={() => openProfile(from.id)}><Avatar p={from} size={38} /></button>
        <div style={{ fontSize: 14, lineHeight: 1.3 }}>
          <button onClick={() => openProfile(from.id)} style={{ fontWeight: 700, color: C.graphite }}>{from.name}</button>
          <span style={{ color: C.mute }}> reconheceu </span>
          <button onClick={() => openProfile(to.id)} style={{ fontWeight: 700, color: C.orange }}>{to.name}</button>
          <div style={{ fontSize: 12, color: C.mute, fontWeight: 500 }}>{timeAgo(rec.days)}</div>
        </div>
        <div style={{ marginLeft: "auto" }}><CatChip catId={rec.cat} /></div>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.55, color: C.slate,
        fontFamily: "'Inter', sans-serif" }}>
        "{rec.msg}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => toggleLike(rec.id)} style={{
          display: "flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 999,
          background: liked ? C.orangeSoft : C.bg, color: liked ? C.orangeDeep : C.slate,
          fontWeight: 650, fontSize: 13.5, transition: "all .15s",
        }}>
          <Heart size={16} strokeWidth={2.4} fill={liked ? C.orange : "none"}
            color={liked ? C.orange : C.slate} />
          {rec.likes}
        </button>
        <span style={{ fontSize: 12.5, color: C.mute, marginLeft: "auto", fontWeight: 600 }}>
          +{Math.round(scoreOf(rec) * 10) / 10} pts no ranking
        </span>
      </div>
    </article>
  );
}

// ============================================================
//  RECONHECER (formulário)
// ============================================================
function Reconhecer({ onSend }) {
  const [step, setStep] = useState(1);
  const [toId, setToId] = useState(null);
  const [cat, setCat] = useState(null);
  const [msg, setMsg] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [q, setQ] = useState("");

  const options = PEOPLE.filter((p) => p.id !== ME &&
    p.name.toLowerCase().includes(q.toLowerCase()));
  const canSend = toId && cat && msg.trim().length > 8;

  return (
    <div className="fade" style={{ maxWidth: 660, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
        Reconhecer alguém
      </h1>
      <p style={{ color: C.mute, fontSize: 15, margin: "0 0 24px" }}>
        Um reconhecimento sincero vale mais que mil reuniões. Conte o que essa pessoa fez.
      </p>

      {/* Stepper */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {["Quem", "Categoria", "Mensagem"].map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 4, borderRadius: 999,
              background: step >= i + 1 ? C.orange : C.line, transition: "background .3s" }} />
            <div style={{ fontSize: 12, fontWeight: 650, marginTop: 6,
              color: step >= i + 1 ? C.graphite : C.mute }}>{i + 1}. {s}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, padding: 24 }}>
        {/* Passo 1: quem */}
        {step === 1 && (
          <div className="fade">
            <label style={lbl}>Para quem é o reconhecimento?</label>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <Search size={17} color={C.mute} style={{ position: "absolute", left: 13, top: 13 }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pessoa..."
                style={{ ...inp, paddingLeft: 40 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {options.map((p) => (
                <button key={p.id} onClick={() => setToId(p.id)} style={{
                  display: "flex", alignItems: "center", gap: 11, padding: 12, borderRadius: 12,
                  border: `2px solid ${toId === p.id ? C.orange : C.line}`,
                  background: toId === p.id ? C.orangeSoft : C.white, textAlign: "left",
                }}>
                  <Avatar p={p} size={38} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: C.mute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.role}</div>
                  </div>
                </button>
              ))}
            </div>
            <NavRow next={() => setStep(2)} nextOk={!!toId} />
          </div>
        )}

        {/* Passo 2: categoria */}
        {step === 2 && (
          <div className="fade">
            <label style={lbl}>Que tipo de atitude foi essa?</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 6 }}>
              {CATEGORIES.map((c) => {
                const Icon = c.icon; const on = cat === c.id;
                return (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{
                    padding: 16, borderRadius: 14, textAlign: "left",
                    border: `2px solid ${on ? c.color : C.line}`,
                    background: on ? `${c.color}0D` : C.white,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Icon size={22} color={c.color} strokeWidth={2.4} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: c.color,
                        background: `${c.color}1A`, padding: "3px 8px", borderRadius: 999 }}>
                        {c.weight} {c.weight > 1 ? "pts" : "pt"}
                      </span>
                    </div>
                    <div style={{ fontWeight: 750, fontSize: 15, marginTop: 10 }}>{c.label}</div>
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12.5, color: C.mute, margin: "12px 0 0" }}>
              Categorias com maior impacto valem mais pontos no ranking mensal.
            </p>
            <NavRow back={() => setStep(1)} next={() => setStep(3)} nextOk={!!cat} />
          </div>
        )}

        {/* Passo 3: mensagem + visibilidade */}
        {step === 3 && (
          <div className="fade">
            <label style={lbl}>Escreva o reconhecimento</label>
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4}
              placeholder="Seja específico: o que a pessoa fez e o impacto que gerou..."
              style={{ ...inp, resize: "vertical", fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }} />
            <div style={{ fontSize: 12, color: msg.trim().length > 8 ? C.mute : C.orangeDeep,
              marginTop: 6, fontWeight: 600 }}>
              {msg.trim().length <= 8 ? "Conte um pouco mais (mín. 8 caracteres)" : `${msg.length} caracteres`}
            </div>

            <label style={{ ...lbl, marginTop: 20 }}>Visibilidade</label>
            <div style={{ display: "flex", gap: 11 }}>
              <VisBtn on={isPublic} onClick={() => setIsPublic(true)}
                icon={Users} title="Mural público" sub="Todo o time vê e pode curtir" />
              <VisBtn on={!isPublic} onClick={() => setIsPublic(false)}
                icon={Mail} title="Privado" sub="Só a pessoa recebe a mensagem" />
            </div>

            <NavRow back={() => setStep(2)}
              send={() => onSend({ toId, cat, msg: msg.trim(), public: isPublic })}
              sendOk={canSend} />
          </div>
        )}
      </div>
    </div>
  );
}

function VisBtn({ on, onClick, icon: Icon, title, sub }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: 14, borderRadius: 13, textAlign: "left",
      border: `2px solid ${on ? C.orange : C.line}`, background: on ? C.orangeSoft : C.white,
    }}>
      <Icon size={19} color={on ? C.orangeDeep : C.slate} strokeWidth={2.3} />
      <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.mute, marginTop: 2 }}>{sub}</div>
    </button>
  );
}

function NavRow({ back, next, send, nextOk, sendOk }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
      {back && (
        <button onClick={back} style={{ ...btnGhost }}>Voltar</button>
      )}
      <div style={{ flex: 1 }} />
      {next && (
        <button onClick={next} disabled={!nextOk}
          style={{ ...btnPrimary, opacity: nextOk ? 1 : 0.4, cursor: nextOk ? "pointer" : "not-allowed" }}>
          Continuar <ChevronRight size={17} strokeWidth={2.6} />
        </button>
      )}
      {send && (
        <button onClick={send} disabled={!sendOk}
          style={{ ...btnPrimary, opacity: sendOk ? 1 : 0.4, cursor: sendOk ? "pointer" : "not-allowed" }}>
          <Send size={16} strokeWidth={2.6} /> Enviar reconhecimento
        </button>
      )}
    </div>
  );
}

// ============================================================
//  RANKING
// ============================================================
function Ranking({ ranking, openProfile }) {
  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);
  const order = [1, 0, 2]; // visual: 2º, 1º, 3º

  return (
    <div className="fade">
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
        Ranking de junho
      </h1>
      <p style={{ color: C.mute, fontSize: 15, margin: "0 0 28px" }}>
        Pontuação = peso da categoria + curtidas no mural (0,2 cada). Zera todo dia 1º.
      </p>

      {/* Pódio */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18, marginBottom: 32 }}>
        {order.map((idx) => {
          const row = podium[idx]; if (!row) return null;
          const rank = idx + 1;
          const h = rank === 1 ? 150 : rank === 2 ? 116 : 92;
          const medal = rank === 1 ? C.gold : rank === 2 ? "#9AA0A6" : "#CD7F32";
          return (
            <button key={row.person.id} onClick={() => openProfile(row.person.id)}
              className="lift" style={{ textAlign: "center", width: 150 }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
                <Avatar p={row.person} size={rank === 1 ? 72 : 58} ring={rank === 1} />
                {rank === 1 && <Crown size={26} color={C.gold} fill={C.gold}
                  style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%) rotate(-10deg)" }} />}
              </div>
              <div style={{ fontWeight: 750, fontSize: 14 }}>{row.person.name}</div>
              <div style={{ fontSize: 12, color: C.mute, marginBottom: 10 }}>{row.count} reconhecimentos</div>
              <div style={{
                height: h, borderRadius: "14px 14px 0 0", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "flex-start", paddingTop: 14, color: C.white,
                background: rank === 1
                  ? `linear-gradient(180deg, ${C.orange}, ${C.orangeDeep})`
                  : `linear-gradient(180deg, ${C.slate}, ${C.graphite})`,
              }}>
                <Medal size={22} color={medal} fill={medal} />
                <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>{row.pts}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>pontos</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tabela restante */}
      {rest.length > 0 && (
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.line}`, overflow: "hidden" }}>
          {rest.map((row, i) => (
            <button key={row.person.id} onClick={() => openProfile(row.person.id)}
              style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "13px 18px",
                borderTop: i === 0 ? "none" : `1px solid ${C.line}`, textAlign: "left" }} className="lift">
              <span style={{ width: 24, fontWeight: 800, color: C.mute, fontSize: 15 }}>{i + 4}</span>
              <Avatar p={row.person} size={38} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{row.person.name}</div>
                <div style={{ fontSize: 12.5, color: C.mute }}>{row.person.role} · {row.count} reconhecimentos</div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 17, color: C.orange }}>{row.pts}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
//  HALL DA FAMA
// ============================================================
function Hall() {
  return (
    <div className="fade">
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
        Hall da Fama
      </h1>
      <p style={{ color: C.mute, fontSize: 15, margin: "0 0 28px" }}>
        Os destaques que já receberam o mimo da Inteligência. Cada elo conta uma história.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {HALL.map((h, i) => (
          <div key={h.month} className="lift" style={{
            background: C.white, borderRadius: 18, border: `1px solid ${C.line}`,
            padding: 22, textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6,
              background: `linear-gradient(90deg, ${C.orange}, ${C.gold})` }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: C.mute, letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 14, marginTop: 4 }}>{h.month}</div>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
              <Avatar p={{ id: 0, initials: h.initials }} size={64} ring />
              <Trophy size={22} color={C.gold} fill={C.gold}
                style={{ position: "absolute", bottom: -4, right: -4 }} />
            </div>
            <div style={{ fontWeight: 750, fontSize: 16 }}>{h.name}</div>
            <div style={{ fontSize: 13, color: C.orange, fontWeight: 650, marginTop: 2 }}>{h.cat}</div>
            <div style={{ marginTop: 14, padding: "8px 0", borderTop: `1px solid ${C.line}`,
              fontSize: 13, color: C.mute }}>
              <strong style={{ color: C.graphite, fontSize: 18 }}>{h.pts}</strong> pontos no mês
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  MENSAGENS (privadas recebidas)
// ============================================================
function Mensagens({ recs, openProfile }) {
  const mine = recs.filter((r) => !r.public && r.toId === ME);
  return (
    <div className="fade" style={{ maxWidth: 680, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
        Mensagens privadas
      </h1>
      <p style={{ color: C.mute, fontSize: 15, margin: "0 0 24px" }}>
        Reconhecimentos enviados só pra você. Eles também contam pontos no ranking.
      </p>
      {mine.length === 0 ? (
        <div style={{ background: C.white, borderRadius: 18, border: `1px dashed ${C.line}`,
          padding: 44, textAlign: "center" }}>
          <Mail size={34} color={C.mute} style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Nada por aqui ainda</div>
          <div style={{ color: C.mute, fontSize: 14 }}>
            Quando alguém te reconhecer em modo privado, aparece aqui.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {mine.map((r) => {
            const from = personById(r.fromId);
            return (
              <div key={r.id} style={{ background: C.white, borderRadius: 16,
                border: `1px solid ${C.line}`, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 11 }}>
                  <button onClick={() => openProfile(from.id)}><Avatar p={from} size={36} /></button>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{from.name}</div>
                    <div style={{ fontSize: 12, color: C.mute }}>{timeAgo(r.days)}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}><CatChip catId={r.cat} small /></div>
                </div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: C.slate,
                  fontFamily: "'Inter', sans-serif" }}>"{r.msg}"</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
//  PERFIL
// ============================================================
function Perfil({ id, recs, ranking, liked, toggleLike, goReconhecer }) {
  const p = personById(id);
  if (!p) return null;
  const received = recs.filter((r) => r.toId === id && (r.public || id === ME));
  const myRank = ranking.findIndex((r) => r.person.id === id) + 1;
  const myPts = ranking.find((r) => r.person.id === id)?.pts || 0;

  // contagem por categoria
  const byCat = CATEGORIES.map((c) => ({
    ...c, n: recs.filter((r) => r.toId === id && r.cat === c.id).length,
  }));

  return (
    <div className="fade" style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.line}`,
        overflow: "hidden", marginBottom: 22 }}>
        <div style={{ height: 88, background: `linear-gradient(115deg, ${C.graphite}, ${C.orangeDeep})` }} />
        <div style={{ padding: "0 26px 22px", marginTop: -34 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            <div style={{ border: `4px solid ${C.white}`, borderRadius: "50%" }}>
              <Avatar p={p} size={76} />
            </div>
            <div style={{ paddingBottom: 4 }}>
              <h1 style={{ fontSize: 23, fontWeight: 800, margin: 0 }}>{p.name}</h1>
              <div style={{ color: C.mute, fontSize: 14, fontWeight: 600 }}>{p.role}</div>
            </div>
            {id !== ME && (
              <button onClick={goReconhecer} className="lift" style={{ ...btnPrimary, marginLeft: "auto", marginBottom: 4 }}>
                <Send size={15} strokeWidth={2.6} /> Reconhecer
              </button>
            )}
          </div>

          {/* stats */}
          <div style={{ display: "flex", gap: 26, marginTop: 20 }}>
            <Stat n={myPts} label="pontos no mês" hi />
            <Stat n={myRank > 0 ? `#${myRank}` : "—"} label="no ranking" />
            <Stat n={received.length} label="reconhecimentos" />
          </div>

          {/* categorias */}
          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            {byCat.filter((c) => c.n > 0).map((c) => {
              const Icon = c.icon;
              return (
                <span key={c.id} style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  background: `${c.color}12`, color: c.color, padding: "5px 11px",
                  borderRadius: 999, fontSize: 12.5, fontWeight: 700 }}>
                  <Icon size={13} strokeWidth={2.6} /> {c.label} · {c.n}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 750, margin: "0 0 14px" }}>
        Reconhecimentos recebidos
      </h2>
      {received.length === 0 ? (
        <div style={{ color: C.mute, fontSize: 14, background: C.white, borderRadius: 14,
          border: `1px dashed ${C.line}`, padding: 30, textAlign: "center" }}>
          Ainda sem reconhecimentos. Que tal ser o primeiro a reconhecer?
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {received.map((r) => (
            <RecCard key={r.id} rec={r} liked={liked[r.id]} toggleLike={toggleLike} openProfile={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ n, label, hi }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: hi ? C.orange : C.graphite, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 12.5, color: C.mute, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ---------- estilos compartilhados ----------
const lbl = { display: "block", fontWeight: 700, fontSize: 14, marginBottom: 10, color: C.graphite };
const inp = {
  width: "100%", padding: "11px 14px", borderRadius: 11, border: `1.5px solid ${C.line}`,
  fontSize: 14.5, color: C.graphite, outline: "none", background: C.white,
};
const btnPrimary = {
  display: "inline-flex", alignItems: "center", gap: 8, background: C.orange, color: C.white,
  fontWeight: 700, fontSize: 14.5, padding: "11px 18px", borderRadius: 11,
};
const btnGhost = {
  display: "inline-flex", alignItems: "center", gap: 6, background: C.bg, color: C.slate,
  fontWeight: 650, fontSize: 14.5, padding: "11px 18px", borderRadius: 11,
};