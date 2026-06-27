import React, { useState, useMemo } from "react";
import {
  Home, Award, Send, Trophy, Mail, Heart, Search,
  Sparkles, Medal, Crown, ChevronRight, ChevronLeft, ArrowRight, Star, Zap, Users, Check, Pencil, X,
  BadgeCheck, Bell, PartyPopper, TrendingUp, Quote, Gift, Flame,
  Shield, Settings, LogOut, Lock, Trash2, Sliders, CalendarCheck, Eye, EyeOff,
} from "lucide-react";

/* ============================================================
   PROGRAMA RECONHECER — GOL / Inteligência
   v3 — TEMA ESCURO (marca registrada da Inteligência)
   Preto · Grafite · Cinzas · Laranja · detalhes branco
   ============================================================ */

// ---------- Paleta TEMA ESCURO ----------
const C = {
  // bases escuras
  black: "#0E0D0C",
  bg900: "#16140F",       // fundo mais profundo
  bg800: "#1E1B16",       // fundo de seções
  card: "#211D18",        // card base
  cardHi: "#2A251E",      // card hover/destaque
  stroke: "#39332B",      // bordas sutis
  strokeHi: "#4A4339",    // bordas destaque
  // laranja GOL
  orange: "#FF7020",
  orangeDeep: "#DB5014",
  orangeSoft: "#FF8A45",
  orangeGlow: "rgba(255,112,32,0.35)",
  // neutros texto
  white: "#FFFFFF",
  text: "#F2EDE6",        // texto principal (off-white quente)
  textMute: "#A89F92",    // texto secundário
  textDim: "#6E665B",     // texto terciário
  gold: "#FFB414",
  graphite: "#37322D",
};

const ASSETS = {
  elo: "/elo-escuro.png",            // GOL-Simbolo-Pref-FundoEscuro-RGB.png → renomear p/ elo-escuro.png
  eloClaro: "/elo-gol.png",          // versão clara (fallback)
  cabeca: "/inteligencia-cabeca.png",
  aviao: "/aviao-gol.jpeg",
  assinatura: "/assinatura-escuro.png", // assinatura campanha fundo escuro
  tripulacao: "/tripulacao.png",     // Tripulação-01.png → renomear
  mulherCel: "/mulher-celular.png",  // Mulher no celular-01.png → renomear
  madrugol: "/madrugol.png",         // madrugol → pessoa dormindo no celular
  grafismoElos: "/grafismo-elos.png",// padrão de elos para textura de fundo
};

const CATEGORIES = [
  { id: "colab", label: "Colaboração", weight: 1, icon: Users, color: "#3BA7C4" },
  { id: "entrega", label: "Entrega & Resultado", weight: 2, icon: Zap, color: "#FF7020" },
  { id: "inova", label: "Inovação", weight: 3, icon: Sparkles, color: "#B566D9" },
  { id: "alem", label: "Acima & Além", weight: 3, icon: Star, color: "#FFB414" },
];

const PEOPLE = [
  { id: 1, name: "Marina Alves", role: "Analista de Inteligência", area: "Inteligência", initials: "MA",
    bio: "Apaixonada por dados e dashboards que contam histórias." },
  { id: 2, name: "Rafael Souza", role: "Especialista de Dados", area: "Inteligência", initials: "RS",
    bio: "Transformo planilha bagunçada em decisão de negócio." },
  { id: 3, name: "Camila Torres", role: "Coordenadora de Operações", area: "Operações", initials: "CT", bio: "" },
  { id: 4, name: "Diego Martins", role: "Analista de BI", area: "Inteligência", initials: "DM",
    bio: "Power BI é comigo mesmo." },
  { id: 5, name: "Letícia Rocha", role: "Cientista de Dados", area: "Inteligência", initials: "LR", bio: "" },
  { id: 6, name: "Bruno Carvalho", role: "Analista de Processos", area: "Compras", initials: "BC", bio: "" },
  { id: 7, name: "Você", role: "Inteligência", area: "Compras", initials: "EU", bio: "", admin: true },
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

const ME = 7;
const catById = (id) => CATEGORIES.find((c) => c.id === id);
const personById = (id, people) => (people || PEOPLE).find((p) => p.id === id);
function timeAgo(days) { if (days <= 0) return "hoje"; if (days === 1) return "ontem"; return `há ${days} dias`; }
function scoreOf(rec) { return catById(rec.cat).weight + rec.likes * 0.2; }

// ---------- Avatar ----------
function Avatar({ p, size = 40, ring }) {
  const fontSize = size * 0.36;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
      background: p.id === ME ? `linear-gradient(135deg, ${C.graphite}, ${C.black})` : `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
      color: C.white, display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize, letterSpacing: "0.02em",
      boxShadow: ring ? `0 0 0 3px ${C.bg900}, 0 0 0 5px ${C.orange}, 0 0 18px ${C.orangeGlow}` : "none",
      border: p.id === ME ? `1px solid ${C.strokeHi}` : "none",
    }}>
      {p.photo ? <img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.initials}
    </div>
  );
}

function CabecaIntel({ size = 34 }) {
  const [erro, setErro] = useState(false);
  if (!erro) {
    return <img src={ASSETS.cabeca} alt="Inteligência GOL" onError={() => setErro(true)}
      style={{ height: size, width: "auto", display: "block", filter: "drop-shadow(0 0 6px rgba(255,112,32,0.3))" }} />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="Inteligência">
      <path d="M8 20c0-7 5-12 12-12s11 4 11 11c0 3-1 5-3 7v5h-4v-3h-6v3h-3v-6c-4-2-7-5-7-9z" fill={C.orange} />
      <circle cx="16" cy="16" r="1.6" fill="#fff" /><circle cx="23" cy="14" r="1.6" fill="#fff" />
      <circle cx="25" cy="21" r="1.6" fill="#fff" /><circle cx="19" cy="23" r="1.6" fill="#fff" />
      <path d="M16 16l3-2M23 14l2 7M25 21l-6 2" stroke="#fff" strokeWidth="1.1" />
    </svg>
  );
}

function CatChip({ catId, small }) {
  const c = catById(catId);
  const Icon = c.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}44`,
      padding: small ? "3px 9px" : "5px 11px", borderRadius: 999,
      fontSize: small ? 11 : 12.5, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      <Icon size={small ? 12 : 14} strokeWidth={2.5} /> {c.label}
    </span>
  );
}

// ---------- Elo (imagem, com fallback) ----------
function EloMark({ size = 36 }) {
  const [erro, setErro] = useState(false);
  if (!erro) {
    return <img src={ASSETS.elo} alt="GOL" onError={() => setErro(true)}
      style={{ height: size, width: "auto", display: "block" }} />;
  }
  return (
    <svg width={size * 1.2} height={size} viewBox="0 0 48 40" fill="none" aria-label="GOL">
      <circle cx="28" cy="20" r="11" stroke={C.textMute} strokeWidth="6" />
      <circle cx="18" cy="20" r="11" stroke={C.orange} strokeWidth="6" />
    </svg>
  );
}

// ============================================================
//  APP
// ============================================================
export default function App() {
  const [logado, setLogado] = useState(false);
  const [tab, setTab] = useState("home");
  const [recs, setRecs] = useState(seedRecs);
  const [people, setPeople] = useState(PEOPLE);
  const [liked, setLiked] = useState({});
  const [profileId, setProfileId] = useState(null);
  const [toast, setToast] = useState(null);
  const [cats, setCats] = useState(CATEGORIES);
  const [hall, setHall] = useState(HALL);

  const eu = personById(ME, people);
  const souAdmin = eu?.admin === true;

  function notify(msg, ms = 2400) { setToast(msg); setTimeout(() => setToast(null), ms); }

  function toggleLike(id) {
    setLiked((l) => ({ ...l, [id]: !l[id] }));
    setRecs((rs) => rs.map((r) => r.id === id ? { ...r, likes: r.likes + (liked[id] ? -1 : 1) } : r));
  }
  function addRec(rec) {
    setRecs((rs) => [{ ...rec, id: Date.now(), fromId: ME, likes: 0, days: 0 }, ...rs]);
    notify(rec.public ? "Reconhecimento publicado no mural!" : "Mensagem privada enviada!", 2600);
    setTab(rec.public ? "home" : "mensagens");
  }
  function openProfile(id) { setProfileId(id); setTab("perfil"); }
  function saveBio(id, bio) {
    setPeople((ps) => ps.map((p) => p.id === id ? { ...p, bio } : p));
    notify("Bio atualizada!", 2200);
  }
  // ---- Funções do Admin ----
  function removerRec(id) {
    setRecs((rs) => rs.filter((r) => r.id !== id));
    notify("Reconhecimento removido.");
  }
  function mudarPeso(catId, novoPeso) {
    setCats((cs) => cs.map((c) => c.id === catId ? { ...c, weight: Math.max(0, novoPeso) } : c));
  }
  function fecharMes(ranking) {
    const campeao = ranking[0];
    if (!campeao) { notify("Sem reconhecimentos para fechar o mês."); return; }
    const mesAtual = "Junho/2026";
    setHall((h) => [{ month: mesAtual, name: campeao.person.name, initials: campeao.person.initials,
      pts: campeao.pts, cat: "Destaque do mês" }, ...h]);
    setRecs([]); setLiked({});
    notify(`Mês fechado! ${campeao.person.name} foi para o Hall da Fama. 🏆`, 3200);
    setTab("hall");
  }

  const ranking = useMemo(() => {
    const pesoDe = (catId) => (cats.find((c) => c.id === catId)?.weight ?? 0);
    const score = (rec) => pesoDe(rec.cat) + rec.likes * 0.2;
    const totals = {};
    recs.forEach((r) => { totals[r.toId] = (totals[r.toId] || 0) + score(r); });
    return Object.entries(totals)
      .map(([id, pts]) => ({ person: personById(Number(id), people), pts: Math.round(pts * 10) / 10,
        count: recs.filter((r) => r.toId === Number(id)).length }))
      .filter((r) => r.person).sort((a, b) => b.pts - a.pts);
  }, [recs, people, cats]);

  const NAV = [
    { id: "home", label: "Mural", icon: Home },
    { id: "reconhecer", label: "Reconhecer", icon: Send },
    { id: "ranking", label: "Ranking", icon: Trophy },
    { id: "hall", label: "Hall da Fama", icon: Award },
    { id: "mensagens", label: "Mensagens", icon: Mail },
    ...(souAdmin ? [{ id: "admin", label: "Admin", icon: Shield }] : []),
  ];

  // Tela de login aparece antes de tudo
  if (!logado) {
    return <Login onEntrar={() => setLogado(true)} />;
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif",
      minHeight: "100vh", color: C.text, overflowX: "hidden",
      background: `
        radial-gradient(1200px 600px at 80% -5%, rgba(255,112,32,0.16) 0%, transparent 55%),
        radial-gradient(900px 500px at 0% 100%, rgba(255,112,32,0.08) 0%, transparent 50%),
        linear-gradient(180deg, ${C.bg900} 0%, ${C.black} 100%)
      `,
      backgroundAttachment: "fixed", position: "relative" }}>
      {/* Textura de elos GOL ao fundo (bem sutil) */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.05,
        backgroundImage: `url(${ASSETS.grafismoElos})`, backgroundSize: "600px", backgroundRepeat: "repeat",
        mixBlendMode: "screen" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        html, body, #root { margin: 0 !important; padding: 0 !important; border: 0 !important; background: ${C.black}; width: 100%; max-width: 100%; overflow-x: hidden; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
        .lift { transition: transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease; }
        .lift:hover { transform: translateY(-2px); }
        .glow:hover { box-shadow: 0 8px 30px ${C.orangeGlow} !important; border-color: ${C.strokeHi} !important; }
        .fade { animation: fade .4s ease; }
        @keyframes fade { from {opacity:0; transform:translateY(10px);} to {opacity:1; transform:none;} }
        @media (prefers-reduced-motion: reduce){ .fade,.lift{animation:none;transition:none;} }
        button:focus-visible { outline: 2px solid ${C.orange}; outline-offset: 2px; }
        input:focus, textarea:focus { outline: none; border-color: ${C.orange} !important; }
        input::placeholder, textarea::placeholder { color: ${C.textDim}; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: ${C.bg900}; }
        ::-webkit-scrollbar-thumb { background: ${C.stroke}; border-radius: 6px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.strokeHi}; }
      `}</style>

      {/* ---------- Topbar ---------- */}
      <header style={{ position: "sticky", top: 0, zIndex: 40,
        background: "rgba(14,13,12,0.72)", backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${C.stroke}` }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: "12px 22px",
          display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <EloMark size={34} />
            <div style={{ width: 1, height: 28, background: C.stroke }} />
            <CabecaIntel size={30} />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1, alignItems: "flex-start" }}>
              <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em", color: C.white, display: "block" }}>Reconhecer</span>
              <span style={{ fontSize: 10.5, color: C.orange, fontWeight: 700, letterSpacing: "0.14em", marginTop: 4, display: "block" }}>INTELIGÊNCIA · COMPRAS</span>
            </div>
          </div>
          <nav style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
            {NAV.map((n) => {
              const Icon = n.icon; const on = tab === n.id;
              return (
                <button key={n.id} onClick={() => setTab(n.id)} className="lift" style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10,
                  fontWeight: 650, fontSize: 14, color: on ? C.white : C.textMute,
                  background: on ? `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})` : "transparent",
                  boxShadow: on ? `0 4px 16px ${C.orangeGlow}` : "none" }}>
                  <Icon size={17} strokeWidth={on ? 2.6 : 2.1} />{n.label}
                </button>
              );
            })}
          </nav>
          <button onClick={() => openProfile(ME)} className="lift" style={{ marginLeft: 6 }} title="Meu perfil">
            <Avatar p={personById(ME, people)} size={38} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1600, margin: "0 auto", padding: "26px 22px 60px" }}>
        {tab === "home" && <Mural recs={recs} people={people} liked={liked} toggleLike={toggleLike}
          ranking={ranking} openProfile={openProfile} goReconhecer={() => setTab("reconhecer")} />}
        {tab === "reconhecer" && <Reconhecer people={people} onSend={addRec} />}
        {tab === "ranking" && <Ranking ranking={ranking} openProfile={openProfile} />}
        {tab === "hall" && <Hall hall={hall} />}
        {tab === "mensagens" && <Mensagens recs={recs} people={people} openProfile={openProfile} />}
        {tab === "perfil" && <Perfil id={profileId} people={people} recs={recs} ranking={ranking}
          liked={liked} toggleLike={toggleLike} goReconhecer={() => setTab("reconhecer")} saveBio={saveBio} />}
        {tab === "admin" && souAdmin && <Admin recs={recs} people={people} cats={cats} ranking={ranking}
          removerRec={removerRec} mudarPeso={mudarPeso} fecharMes={() => fecharMes(ranking)} />}
      </main>

      </div>
      {toast && (
        <div className="fade" style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)",
          background: `linear-gradient(135deg, ${C.cardHi}, ${C.card})`, color: C.white,
          padding: "13px 20px", borderRadius: 12, fontWeight: 650, fontSize: 14,
          display: "flex", alignItems: "center", gap: 9, border: `1px solid ${C.strokeHi}`,
          boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${C.orangeGlow}`, zIndex: 60 }}>
          <Check size={17} strokeWidth={3} color={C.orange} /> {toast}
        </div>
      )}
    </div>
  );
}

// ============================================================
//  MURAL
// ============================================================
function Mural({ recs, people, liked, toggleLike, ranking, openProfile, goReconhecer }) {
  const [heroErro, setHeroErro] = useState(false);
  const [tripErro, setTripErro] = useState(false);
  const publicRecs = recs.filter((r) => r.public);
  const leader = ranking[0];

  return (
    <div className="fade">
      {/* Hero em CARD com borda (largura do conteúdo) */}
      <section style={{ position: "relative", overflow: "hidden", borderRadius: 24,
        marginBottom: 28, background: C.black, border: `1px solid ${C.stroke}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        {!heroErro && (
          <img src={ASSETS.aviao} alt="" onError={() => setHeroErro(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.42 }} />
        )}
        <div style={{ position: "absolute", inset: 0,
          background: `linear-gradient(105deg, ${C.black}F7 0%, ${C.black}DD 44%, rgba(219,80,20,0.32) 125%)` }} />
        {/* brilho laranja */}
        <div style={{ position: "absolute", right: "6%", top: "-45%", width: 480, height: 480,
          background: `radial-gradient(circle, ${C.orangeGlow} 0%, transparent 65%)`, pointerEvents: "none" }} />
        {/* Ilustração tripulação à direita, dentro do card */}
        {!tripErro && (
          <img src={ASSETS.tripulacao} alt="" onError={() => setTripErro(true)}
            style={{ position: "absolute", right: "4%", bottom: 0, height: "116%",
              width: "auto", objectFit: "contain", opacity: 0.96, pointerEvents: "none",
              filter: "drop-shadow(0 0 40px rgba(0,0,0,0.5))", display: "block" }} />
        )}

        <div style={{ position: "relative", padding: "40px 40px 42px", maxWidth: 600 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.16em",
            color: C.orange, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 7, textAlign: "left" }}>
            <Sparkles size={14} strokeWidth={2.6} /> Junho · Destaque do mês
          </span>
          <h1 style={{ fontSize: 33, fontWeight: 800, margin: "12px 0 10px", letterSpacing: "-0.02em",
            lineHeight: 1.12, color: C.white, textAlign: "left" }}>
            Inteligência faz a gente voar.<br />
            <span style={{ background: `linear-gradient(120deg, ${C.orangeSoft}, ${C.orange})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Reconhecer faz a gente decolar.
            </span>
          </h1>
          <p style={{ color: "rgba(242,237,230,0.78)", fontSize: 15, lineHeight: 1.5, margin: "0 0 22px", textAlign: "left", maxWidth: 440 }}>
            Todo início de mês a Inteligência celebra quem mais recebeu reconhecimentos. Um gesto simples vira destaque.
          </p>
          <button onClick={goReconhecer} className="lift" style={{
            background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, color: C.white,
            fontWeight: 700, fontSize: 15, padding: "13px 24px", borderRadius: 12,
            display: "inline-flex", alignItems: "center", gap: 9,
            boxShadow: `0 10px 30px ${C.orangeGlow}` }}>
            <Send size={17} strokeWidth={2.6} /> Reconhecer alguém
          </button>

          {leader && (
            <button onClick={() => openProfile(leader.person.id)} className="lift glow" style={{
              marginTop: 26, display: "flex", alignItems: "center", gap: 14,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 16, padding: "12px 16px", textAlign: "left", backdropFilter: "blur(8px)" }}>
              <div style={{ position: "relative" }}>
                <Avatar p={leader.person} size={48} ring />
                <Crown size={20} color={C.gold} fill={C.gold} style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%) rotate(-12deg)" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(242,237,230,0.6)", fontWeight: 600, letterSpacing: "0.05em" }}>LIDERANDO AGORA</div>
                <div style={{ color: C.white, fontWeight: 700, fontSize: 16 }}>{leader.person.name}</div>
                <div style={{ color: C.orange, fontWeight: 700, fontSize: 13 }}>{leader.pts} pontos</div>
              </div>
              <ChevronRight size={18} color="rgba(242,237,230,0.5)" style={{ marginLeft: 6 }} />
            </button>
          )}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 750, margin: 0, color: C.white }}>Mural de reconhecimentos</h2>
            <span style={{ fontSize: 13, color: C.textMute, fontWeight: 600 }}>{publicRecs.length} públicos</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {publicRecs.map((r) => (
              <RecCard key={r.id} rec={r} people={people} liked={liked[r.id]} toggleLike={toggleLike} openProfile={openProfile} />
            ))}
          </div>
        </div>

        <aside style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`,
          borderRadius: 18, border: `1px solid ${C.stroke}`, padding: 18,
          position: "sticky", top: 88, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Trophy size={17} color={C.orange} strokeWidth={2.5} />
            <h3 style={{ fontSize: 15, fontWeight: 750, margin: 0, color: C.white }}>Top do mês</h3>
          </div>
          {ranking.slice(0, 5).map((row, i) => (
            <button key={row.person.id} onClick={() => openProfile(row.person.id)} className="lift"
              style={{ display: "flex", alignItems: "center", gap: 11, width: "100%",
                padding: "9px 6px", borderRadius: 10, textAlign: "left" }}>
              <span style={{ width: 20, fontWeight: 800, fontSize: 14,
                color: i === 0 ? C.gold : i === 1 ? C.textMute : i === 2 ? "#CD7F32" : C.textDim }}>{i + 1}</span>
              <Avatar p={row.person} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 650, fontSize: 13.5, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.person.name}</div>
              </div>
              <span style={{ fontWeight: 750, fontSize: 13, color: C.orange }}>{row.pts}</span>
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}

function RecCard({ rec, people, liked, toggleLike, openProfile }) {
  const from = personById(rec.fromId, people);
  const to = personById(rec.toId, people);
  return (
    <article className="lift glow" style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`,
      borderRadius: 18, border: `1px solid ${C.stroke}`, padding: "18px 20px",
      boxShadow: "0 8px 28px rgba(0,0,0,0.28)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 13 }}>
        <button onClick={() => openProfile(from.id)}><Avatar p={from} size={42} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, lineHeight: 1.3, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0 5px" }}>
            <button onClick={() => openProfile(from.id)} style={{ fontWeight: 700, color: C.white, fontSize: 15 }}>{from.name}</button>
            <span style={{ color: C.textMute }}>reconheceu</span>
            <button onClick={() => openProfile(to.id)} style={{ fontWeight: 700, color: C.orange, fontSize: 15 }}>{to.name}</button>
            <span style={{ color: C.textDim }}>·</span>
            <span style={{ fontSize: 12.5, color: C.textMute, fontWeight: 500 }}>{timeAgo(rec.days)}</span>
          </div>
        </div>
        <div style={{ flexShrink: 0 }}><CatChip catId={rec.cat} /></div>
      </div>
      <div style={{ position: "relative", margin: "0 0 14px" }}>
        <Quote size={26} color={C.orange} fill={C.orange} strokeWidth={0}
          style={{ position: "absolute", left: -2, top: -6, opacity: 0.18 }} />
        <p style={{ margin: 0, paddingLeft: 16, fontSize: 15, lineHeight: 1.55, color: C.text,
          fontFamily: "'Inter',sans-serif" }}>{rec.msg}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => toggleLike(rec.id)} style={{ display: "flex", alignItems: "center", gap: 7,
          padding: "7px 13px", borderRadius: 999, border: `1px solid ${liked ? C.orange + "66" : C.stroke}`,
          background: liked ? `${C.orange}1F` : "rgba(255,255,255,0.03)", color: liked ? C.orangeSoft : C.textMute,
          fontWeight: 650, fontSize: 13.5, transition: "all .15s" }}>
          <Heart size={16} strokeWidth={2.4} fill={liked ? C.orange : "none"} color={liked ? C.orange : C.textMute} />
          {rec.likes}
        </button>
        <span style={{ fontSize: 12.5, color: C.textDim, marginLeft: "auto", fontWeight: 600 }}>
          +{Math.round(scoreOf(rec) * 10) / 10} pts no ranking
        </span>
      </div>
    </article>
  );
}

// ============================================================
//  RECONHECER
// ============================================================
function Reconhecer({ people, onSend }) {
  const [step, setStep] = useState(1);
  const [toId, setToId] = useState(null);
  const [cat, setCat] = useState(null);
  const [msg, setMsg] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [q, setQ] = useState("");

  const options = people.filter((p) => p.id !== ME && p.name.toLowerCase().includes(q.toLowerCase()));
  const canSend = toId && cat && msg.trim().length > 8;

  return (
    <div className="fade" style={{ maxWidth: 660, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px", color: C.white,
        display: "flex", alignItems: "center", gap: 10 }}>
        <Send size={22} color={C.orange} strokeWidth={2.4} /> Reconhecer alguém
      </h1>
      <p style={{ color: C.textMute, fontSize: 15, margin: "0 0 24px" }}>
        Um reconhecimento sincero vale mais que mil reuniões. Conte o que essa pessoa fez.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {["Quem", "Categoria", "Mensagem"].map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 4, borderRadius: 999,
              background: step >= i + 1 ? `linear-gradient(90deg, ${C.orange}, ${C.orangeDeep})` : C.stroke, transition: "background .3s" }} />
            <div style={{ fontSize: 12, fontWeight: 650, marginTop: 6, color: step >= i + 1 ? C.text : C.textDim }}>{i + 1}. {s}</div>
          </div>
        ))}
      </div>

      <div style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`, borderRadius: 18,
        border: `1px solid ${C.stroke}`, padding: 24, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
        {step === 1 && (
          <div className="fade">
            <label style={lbl}>Para quem é o reconhecimento?</label>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <Search size={17} color={C.textDim} style={{ position: "absolute", left: 13, top: 13 }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pessoa..." style={{ ...inp, paddingLeft: 40 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {options.map((p) => (
                <button key={p.id} onClick={() => setToId(p.id)} className="lift" style={{ display: "flex", alignItems: "center",
                  gap: 11, padding: 12, borderRadius: 12,
                  border: `2px solid ${toId === p.id ? C.orange : C.stroke}`,
                  background: toId === p.id ? `${C.orange}1A` : "rgba(255,255,255,0.02)", textAlign: "left" }}>
                  <Avatar p={p} size={38} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: C.textMute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.role}</div>
                  </div>
                </button>
              ))}
            </div>
            <NavRow next={() => setStep(2)} nextOk={!!toId} />
          </div>
        )}

        {step === 2 && (
          <div className="fade">
            <label style={lbl}>Que tipo de atitude foi essa?</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
              {CATEGORIES.map((c) => {
                const Icon = c.icon; const on = cat === c.id;
                return (
                  <button key={c.id} onClick={() => setCat(c.id)} className="lift" style={{ padding: 16, borderRadius: 14, textAlign: "left",
                    border: `2px solid ${on ? c.color : C.stroke}`,
                    background: on ? `${c.color}1A` : "rgba(255,255,255,0.02)",
                    boxShadow: on ? `0 6px 20px ${c.color}33` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Icon size={22} color={c.color} strokeWidth={2.4} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: `${c.color}26`, padding: "3px 8px", borderRadius: 999 }}>
                        {c.weight} {c.weight > 1 ? "pts" : "pt"}
                      </span>
                    </div>
                    <div style={{ fontWeight: 750, fontSize: 15, marginTop: 10, color: C.text }}>{c.label}</div>
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12.5, color: C.textMute, margin: "12px 0 0" }}>Categorias com maior impacto valem mais pontos no ranking mensal.</p>
            <NavRow back={() => setStep(1)} next={() => setStep(3)} nextOk={!!cat} />
          </div>
        )}

        {step === 3 && (
          <div className="fade">
            <label style={lbl}>Escreva o reconhecimento</label>
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4}
              placeholder="Seja específico: o que a pessoa fez e o impacto que gerou..."
              style={{ ...inp, resize: "vertical", fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }} />
            <div style={{ fontSize: 12, color: msg.trim().length > 8 ? C.textMute : C.orange, marginTop: 6, fontWeight: 600 }}>
              {msg.trim().length <= 8 ? "Conte um pouco mais (mín. 8 caracteres)" : `${msg.length} caracteres`}
            </div>
            <label style={{ ...lbl, marginTop: 20 }}>Visibilidade</label>
            <div style={{ display: "flex", gap: 11 }}>
              <VisBtn on={isPublic} onClick={() => setIsPublic(true)} icon={Users} title="Mural público" sub="Todo o time vê e pode curtir" />
              <VisBtn on={!isPublic} onClick={() => setIsPublic(false)} icon={Mail} title="Privado" sub="Só a pessoa recebe a mensagem" />
            </div>
            <NavRow back={() => setStep(2)} send={() => onSend({ toId, cat, msg: msg.trim(), public: isPublic })} sendOk={canSend} />
          </div>
        )}
      </div>
    </div>
  );
}

function VisBtn({ on, onClick, icon: Icon, title, sub }) {
  return (
    <button onClick={onClick} className="lift" style={{ flex: 1, padding: 14, borderRadius: 13, textAlign: "left",
      border: `2px solid ${on ? C.orange : C.stroke}`, background: on ? `${C.orange}1A` : "rgba(255,255,255,0.02)" }}>
      <Icon size={19} color={on ? C.orangeSoft : C.textMute} strokeWidth={2.3} />
      <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8, color: C.text }}>{title}</div>
      <div style={{ fontSize: 12, color: C.textMute, marginTop: 2 }}>{sub}</div>
    </button>
  );
}

function NavRow({ back, next, send, nextOk, sendOk }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
      {back && <button onClick={back} style={btnGhost}><ChevronLeft size={16} strokeWidth={2.6} /> Voltar</button>}
      <div style={{ flex: 1 }} />
      {next && <button onClick={next} disabled={!nextOk} className="lift" style={{ ...btnPrimary, opacity: nextOk ? 1 : 0.4, cursor: nextOk ? "pointer" : "not-allowed" }}>Continuar <ChevronRight size={17} strokeWidth={2.6} /></button>}
      {send && <button onClick={send} disabled={!sendOk} className="lift" style={{ ...btnPrimary, opacity: sendOk ? 1 : 0.4, cursor: sendOk ? "pointer" : "not-allowed" }}><Send size={16} strokeWidth={2.6} /> Enviar reconhecimento</button>}
    </div>
  );
}

// ============================================================
//  RANKING
// ============================================================
function Ranking({ ranking, openProfile }) {
  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);
  const order = [1, 0, 2];

  return (
    <div className="fade">
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px", color: C.white,
        display: "flex", alignItems: "center", gap: 10 }}>
        <Trophy size={24} color={C.orange} strokeWidth={2.4} /> Ranking de junho
      </h1>
      <p style={{ color: C.textMute, fontSize: 15, margin: "0 0 28px" }}>
        Pontuação = peso da categoria + curtidas no mural (0,2 cada). Zera todo dia 1º.
      </p>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18, marginBottom: 32 }}>
        {order.map((idx) => {
          const row = podium[idx]; if (!row) return null;
          const rank = idx + 1;
          const h = rank === 1 ? 150 : rank === 2 ? 116 : 92;
          const medal = rank === 1 ? C.gold : rank === 2 ? C.textMute : "#CD7F32";
          return (
            <button key={row.person.id} onClick={() => openProfile(row.person.id)} className="lift" style={{ textAlign: "center", width: 150 }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
                <Avatar p={row.person} size={rank === 1 ? 72 : 58} ring={rank === 1} />
                {rank === 1 && <Crown size={26} color={C.gold} fill={C.gold} style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%) rotate(-10deg)" }} />}
              </div>
              <div style={{ fontWeight: 750, fontSize: 14, color: C.text }}>{row.person.name}</div>
              <div style={{ fontSize: 12, color: C.textMute, marginBottom: 10 }}>{row.count} reconhecimentos</div>
              <div style={{ height: h, borderRadius: "14px 14px 0 0", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "flex-start", paddingTop: 14, color: C.white,
                border: rank === 1 ? `1px solid ${C.orange}66` : `1px solid ${C.stroke}`, borderBottom: "none",
                background: rank === 1 ? `linear-gradient(180deg, ${C.orange}, ${C.orangeDeep})` : `linear-gradient(180deg, ${C.cardHi}, ${C.bg800})`,
                boxShadow: rank === 1 ? `0 -8px 30px ${C.orangeGlow}` : "none" }}>
                <Medal size={22} color={medal} fill={medal} />
                <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>{row.pts}</div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>pontos</div>
              </div>
            </button>
          );
        })}
      </div>

      {rest.length > 0 && (
        <div style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`, borderRadius: 16,
          border: `1px solid ${C.stroke}`, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
          {rest.map((row, i) => (
            <button key={row.person.id} onClick={() => openProfile(row.person.id)} className="lift"
              style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "13px 18px",
                borderTop: i === 0 ? "none" : `1px solid ${C.stroke}`, textAlign: "left" }}>
              <span style={{ width: 24, fontWeight: 800, color: C.textMute, fontSize: 15 }}>{i + 4}</span>
              <Avatar p={row.person} size={38} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: C.text }}>{row.person.name}</div>
                <div style={{ fontSize: 12.5, color: C.textMute }}>{row.person.role} · {row.count} reconhecimentos</div>
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
function Hall({ hall }) {
  const lista = hall || HALL;
  return (
    <div className="fade">
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px", color: C.white,
        display: "flex", alignItems: "center", gap: 10 }}>
        <Award size={24} color={C.orange} strokeWidth={2.4} /> Hall da Fama
      </h1>
      <p style={{ color: C.textMute, fontSize: 15, margin: "0 0 28px" }}>
        Os destaques que já receberam o mimo da Inteligência. Cada elo conta uma história.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {lista.map((h) => (
          <div key={h.month} className="lift glow" style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`,
            borderRadius: 18, border: `1px solid ${C.stroke}`, padding: 22, textAlign: "center",
            position: "relative", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.orange}, ${C.gold})` }} />
            <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 160, height: 100,
              background: `radial-gradient(circle, ${C.orangeGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "relative", fontSize: 11, fontWeight: 700, color: C.textMute, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, marginTop: 4 }}>{h.month}</div>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
              <Avatar p={{ id: 0, initials: h.initials }} size={64} ring />
              <Trophy size={22} color={C.gold} fill={C.gold} style={{ position: "absolute", bottom: -4, right: -4 }} />
            </div>
            <div style={{ fontWeight: 750, fontSize: 16, color: C.white }}>{h.name}</div>
            <div style={{ fontSize: 13, color: C.orange, fontWeight: 650, marginTop: 2 }}>{h.cat}</div>
            <div style={{ marginTop: 14, padding: "8px 0", borderTop: `1px solid ${C.stroke}`, fontSize: 13, color: C.textMute }}>
              <strong style={{ color: C.white, fontSize: 18 }}>{h.pts}</strong> pontos no mês
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  MENSAGENS
// ============================================================
function Mensagens({ recs, people, openProfile }) {
  const [ilustraErro, setIlustraErro] = useState(false);
  const mine = recs.filter((r) => !r.public && r.toId === ME);
  return (
    <div className="fade" style={{ maxWidth: 680, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px", color: C.white,
        display: "flex", alignItems: "center", gap: 10 }}>
        <Mail size={24} color={C.orange} strokeWidth={2.4} /> Mensagens privadas
      </h1>
      <p style={{ color: C.textMute, fontSize: 15, margin: "0 0 24px" }}>
        Reconhecimentos enviados só pra você. Eles também contam pontos no ranking.
      </p>
      {mine.length === 0 ? (
        <div style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`, borderRadius: 18,
          border: `1px dashed ${C.strokeHi}`, padding: "36px 44px", textAlign: "center",
          position: "relative", overflow: "hidden" }}>
          {/* brilho */}
          <div style={{ position: "absolute", left: "50%", top: "-30%", width: 280, height: 200,
            transform: "translateX(-50%)", background: `radial-gradient(circle, ${C.orangeGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
          {!ilustraErro ? (
            <img src={ASSETS.madrugol} alt="" onError={() => setIlustraErro(true)}
              style={{ width: 180, height: "auto", margin: "0 auto 8px", display: "block", position: "relative",
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }} />
          ) : (
            <Mail size={34} color={C.textMute} style={{ marginBottom: 12 }} />
          )}
          <div style={{ position: "relative", fontWeight: 700, fontSize: 16, marginBottom: 4, color: C.text }}>Nada por aqui ainda</div>
          <div style={{ position: "relative", color: C.textMute, fontSize: 14 }}>Quando alguém te reconhecer em modo privado, aparece aqui.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {mine.map((r) => {
            const from = personById(r.fromId, people);
            return (
              <div key={r.id} className="glow" style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`,
                borderRadius: 16, border: `1px solid ${C.stroke}`, padding: 18, transition: "all .15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 11 }}>
                  <button onClick={() => openProfile(from.id)}><Avatar p={from} size={38} /></button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.white }}>{from.name}</div>
                    <div style={{ fontSize: 12, color: C.textMute, marginTop: 2 }}>{timeAgo(r.days)}</div>
                  </div>
                  <CatChip catId={r.cat} small />
                </div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: C.text, fontFamily: "'Inter',sans-serif" }}>"{r.msg}"</p>
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
function Perfil({ id, people, recs, ranking, liked, toggleLike, goReconhecer, saveBio }) {
  const p = personById(id, people);
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState("");
  if (!p) return null;

  const received = recs.filter((r) => r.toId === id && (r.public || id === ME));
  const myRank = ranking.findIndex((r) => r.person.id === id) + 1;
  const myPts = ranking.find((r) => r.person.id === id)?.pts || 0;
  const byCat = CATEGORIES.map((c) => ({ ...c, n: recs.filter((r) => r.toId === id && r.cat === c.id).length }));
  const ehMeu = id === ME;

  function abrirEdicao() { setRascunho(p.bio || ""); setEditando(true); }
  function salvar() { saveBio(id, rascunho.trim()); setEditando(false); }

  return (
    <div className="fade" style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`, borderRadius: 20,
        border: `1px solid ${C.stroke}`, marginBottom: 22, boxShadow: "0 16px 50px rgba(0,0,0,0.35)" }}>
        <div style={{ height: 120, position: "relative", borderRadius: "20px 20px 0 0", overflow: "hidden",
          background: `linear-gradient(105deg, ${C.black}, ${C.orangeDeep})` }}>
          {/* brilho */}
          <div style={{ position: "absolute", right: "10%", top: "-60%", width: 240, height: 240,
            background: `radial-gradient(circle, ${C.orangeGlow} 0%, transparent 65%)` }} />
          <div style={{ position: "absolute", right: -16, top: -10, opacity: 0.12 }}>
            <svg width="160" height="160" viewBox="0 0 48 40" fill="none">
              <circle cx="28" cy="20" r="11" stroke="#fff" strokeWidth="2.4" />
              <circle cx="18" cy="20" r="11" stroke="#fff" strokeWidth="2.4" />
            </svg>
          </div>
        </div>
        <div style={{ padding: "0 28px 24px", textAlign: "left", position: "relative", zIndex: 2 }}>
          <div style={{ marginTop: -42, marginBottom: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
            <div style={{ border: `4px solid ${C.card}`, borderRadius: "50%", width: "fit-content", lineHeight: 0,
              boxShadow: `0 6px 20px rgba(0,0,0,0.5), 0 0 20px ${C.orangeGlow}` }}>
              <Avatar p={p} size={80} />
            </div>
            {!ehMeu && (
              <button onClick={goReconhecer} className="lift" style={{ ...btnPrimary, marginBottom: 4 }}>
                <Send size={15} strokeWidth={2.6} /> Reconhecer
              </button>
            )}
          </div>
          <div style={{ textAlign: "left" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: C.white }}>{p.name}</h1>
            <div style={{ color: C.textMute, fontSize: 14, fontWeight: 600, marginTop: 3 }}>
              {p.role} · <span style={{ color: C.orange }}>{p.area}</span>
            </div>
          </div>

          <div style={{ marginTop: 16, background: "rgba(0,0,0,0.25)", borderRadius: 14, padding: "14px 16px", border: `1px solid ${C.stroke}` }}>
            {!editando ? (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <p style={{ margin: 0, flex: 1, fontSize: 14, lineHeight: 1.5,
                  color: p.bio ? C.text : C.textDim, fontStyle: p.bio ? "normal" : "italic", fontFamily: "'Inter',sans-serif" }}>
                  {p.bio || (ehMeu ? "Você ainda não escreveu sua bio. Que tal contar um pouco sobre você?" : "Sem bio ainda.")}
                </p>
                {ehMeu && (
                  <button onClick={abrirEdicao} className="lift" title="Editar bio" style={{
                    display: "flex", alignItems: "center", gap: 6, color: C.orangeSoft, fontWeight: 650,
                    fontSize: 13, background: "rgba(255,255,255,0.04)", padding: "6px 12px", borderRadius: 9, border: `1px solid ${C.stroke}` }}>
                    <Pencil size={13} strokeWidth={2.4} /> Editar
                  </button>
                )}
              </div>
            ) : (
              <div>
                <textarea value={rascunho} onChange={(e) => setRascunho(e.target.value)} rows={3} maxLength={160}
                  placeholder="Escreva algo sobre você (até 160 caracteres)..."
                  style={{ ...inp, resize: "none", fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: C.textMute, fontWeight: 600 }}>{rascunho.length}/160</span>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => setEditando(false)} style={{ ...btnGhost, padding: "8px 14px" }}>
                    <X size={14} strokeWidth={2.4} /> Cancelar
                  </button>
                  <button onClick={salvar} style={{ ...btnPrimary, padding: "8px 16px" }}>
                    <Check size={14} strokeWidth={2.6} /> Salvar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 26, marginTop: 18 }}>
            <Stat n={myPts} label="pontos no mês" hi />
            <Stat n={myRank > 0 ? `#${myRank}` : "—"} label="no ranking" />
            <Stat n={received.length} label="reconhecimentos" />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            {byCat.filter((c) => c.n > 0).map((c) => {
              const Icon = c.icon;
              return (
                <span key={c.id} style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  background: `${c.color}1F`, color: c.color, border: `1px solid ${c.color}3A`,
                  padding: "5px 11px", borderRadius: 999, fontSize: 12.5, fontWeight: 700 }}>
                  <Icon size={13} strokeWidth={2.6} /> {c.label} · {c.n}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 750, margin: "0 0 14px", color: C.white }}>Reconhecimentos recebidos</h2>
      {received.length === 0 ? (
        <div style={{ color: C.textMute, fontSize: 14, background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`,
          borderRadius: 14, border: `1px dashed ${C.strokeHi}`, padding: 30, textAlign: "center" }}>
          Ainda sem reconhecimentos. Que tal ser o primeiro a reconhecer?
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {received.map((r) => (
            <RecCard key={r.id} rec={r} people={people} liked={liked[r.id]} toggleLike={toggleLike} openProfile={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ n, label, hi }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color: hi ? C.orange : C.white, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 12.5, color: C.textMute, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ============================================================
//  LOGIN (visual — não autentica de verdade ainda)
// ============================================================
function Login({ onEntrar }) {
  const [heroErro, setHeroErro] = useState(false);
  const [eloErro, setEloErro] = useState(false);
  const [cabecaErro, setCabecaErro] = useState(false);
  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", background: C.black }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        html, body, #root { margin:0; padding:0; background:${C.black}; }
        button { font-family: inherit; cursor: pointer; border: none; }
        .lift { transition: transform .15s ease, box-shadow .15s ease; }
        .lift:hover { transform: translateY(-2px); }
        .fade { animation: fade .5s ease; }
        @keyframes fade { from {opacity:0; transform:translateY(12px);} to {opacity:1; transform:none;} }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
      `}</style>

      {/* Fundo: foto do avião */}
      {!heroErro && (
        <img src={ASSETS.aviao} alt="" onError={() => setHeroErro(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
      )}
      {/* Overlay escuro com brilho laranja */}
      <div style={{ position: "absolute", inset: 0,
        background: `radial-gradient(900px 600px at 75% 30%, rgba(255,112,32,0.25) 0%, transparent 60%), linear-gradient(120deg, ${C.black}F2 0%, ${C.black}E8 50%, rgba(219,80,20,0.25) 130%)` }} />
      {/* Grafismo de elos sutil */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none",
        backgroundImage: `url(${ASSETS.grafismoElos})`, backgroundSize: "500px", backgroundRepeat: "repeat", mixBlendMode: "screen" }} />
      {/* elo grande decorativo flutuando */}
      {!eloErro && (
        <img src={ASSETS.elo} alt="" onError={() => setEloErro(true)}
          style={{ position: "absolute", right: "-6%", bottom: "-10%", width: 420, opacity: 0.12,
            animation: "float 6s ease-in-out infinite", pointerEvents: "none" }} />
      )}

      {/* Card central de login */}
      <div className="fade" style={{ position: "relative", margin: "auto", width: "100%", maxWidth: 440, padding: "0 22px" }}>
        <div style={{ background: `linear-gradient(180deg, ${C.card}EE, ${C.bg800}EE)`, backdropFilter: "blur(16px)",
          borderRadius: 24, border: `1px solid ${C.strokeHi}`, padding: "40px 36px",
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${C.orangeGlow}` }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            {!eloErro && <img src={ASSETS.elo} alt="GOL" style={{ height: 40 }} onError={() => setEloErro(true)} />}
            {!cabecaErro && <img src={ASSETS.cabeca} alt="" style={{ height: 38, filter: "drop-shadow(0 0 6px rgba(255,112,32,0.4))" }} onError={() => setCabecaErro(true)} />}
          </div>
          <h1 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: C.white, margin: "10px 0 2px", letterSpacing: "-0.02em" }}>
            Reconhecer
          </h1>
          <p style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: C.orange, letterSpacing: "0.16em", margin: "0 0 6px" }}>
            INTELIGÊNCIA · COMPRAS
          </p>
          <p style={{ textAlign: "center", fontSize: 14, color: C.textMute, lineHeight: 1.5, margin: "16px 0 28px" }}>
            Um gesto simples vira destaque. Entre para reconhecer quem faz a diferença no time.
          </p>

          <button onClick={onEntrar} className="lift" style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 11,
            background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, color: C.white,
            fontWeight: 700, fontSize: 15.5, padding: "14px", borderRadius: 12,
            boxShadow: `0 10px 30px ${C.orangeGlow}` }}>
            <MicrosoftIcon /> Entrar com conta Microsoft
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 22, justifyContent: "center" }}>
            <Lock size={13} color={C.textDim} />
            <span style={{ fontSize: 12, color: C.textDim }}>Acesso exclusivo para colaboradores GOL</span>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11.5, color: C.textDim, marginTop: 20 }}>
          Inteligência · Compras · GOL Linhas Aéreas
        </p>
      </div>
    </div>
  );
}

// Ícone Microsoft (4 quadradinhos)
function MicrosoftIcon() {
  return (
    <span style={{ display: "inline-grid", gridTemplateColumns: "1fr 1fr", gap: 2, width: 18, height: 18 }}>
      <span style={{ background: "#F25022", borderRadius: 1 }} />
      <span style={{ background: "#7FBA00", borderRadius: 1 }} />
      <span style={{ background: "#00A4EF", borderRadius: 1 }} />
      <span style={{ background: "#FFB900", borderRadius: 1 }} />
    </span>
  );
}

// ============================================================
//  ADMIN (painel restrito — só quem tem perfil admin)
// ============================================================
function Admin({ recs, people, cats, ranking, removerRec, mudarPeso, fecharMes }) {
  const [confirmar, setConfirmar] = useState(false);
  const publicRecs = recs.filter((r) => r.public);
  const campeao = ranking[0];

  return (
    <div className="fade" style={{ maxWidth: 920, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px", color: C.white,
        display: "flex", alignItems: "center", gap: 10 }}>
        <Shield size={24} color={C.orange} strokeWidth={2.4} /> Painel da Inteligência
      </h1>
      <p style={{ color: C.textMute, fontSize: 15, margin: "0 0 26px" }}>
        Área restrita. Aqui você gerencia o programa: fecha o mês, ajusta pontuações e modera o mural.
      </p>

      {/* Cards de resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        <AdminStat icon={Send} label="Reconhecimentos" value={recs.length} />
        <AdminStat icon={Users} label="Pessoas ativas" value={ranking.length} />
        <AdminStat icon={Crown} label="Líder atual" value={campeao ? campeao.person.name.split(" ")[0] : "—"} />
      </div>

      {/* Fechar o mês */}
      <AdminCard title="Fechar o mês" icon={CalendarCheck}>
        <p style={{ color: C.textMute, fontSize: 14, lineHeight: 1.5, margin: "0 0 14px" }}>
          Ao fechar, o 1º lugar vai para o Hall da Fama e a contagem zera para o próximo mês.
          {campeao && <> Campeão atual: <strong style={{ color: C.orange }}>{campeao.person.name}</strong> ({campeao.pts} pts).</>}
        </p>
        {!confirmar ? (
          <button onClick={() => setConfirmar(true)} className="lift" style={{ ...btnPrimary }}>
            <CalendarCheck size={16} strokeWidth={2.5} /> Fechar mês e premiar
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>Tem certeza? Isso zera o mês.</span>
            <button onClick={fecharMes} className="lift" style={{ ...btnPrimary }}>
              <Check size={16} strokeWidth={2.6} /> Confirmar
            </button>
            <button onClick={() => setConfirmar(false)} style={{ ...btnGhost }}>Cancelar</button>
          </div>
        )}
      </AdminCard>

      {/* Ajustar pesos */}
      <AdminCard title="Pesos das categorias" icon={Sliders}>
        <p style={{ color: C.textMute, fontSize: 14, margin: "0 0 16px" }}>
          Defina quanto cada categoria vale no ranking. As mudanças refletem na hora.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cats.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 200,
                  color: c.color, fontWeight: 700, fontSize: 14 }}>
                  <Icon size={17} strokeWidth={2.5} /> {c.label}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => mudarPeso(c.id, c.weight - 1)} className="lift" style={pesoBtn}>−</button>
                  <span style={{ minWidth: 54, textAlign: "center", fontWeight: 800, fontSize: 16, color: C.white }}>
                    {c.weight} {c.weight === 1 ? "pt" : "pts"}
                  </span>
                  <button onClick={() => mudarPeso(c.id, c.weight + 1)} className="lift" style={pesoBtn}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>

      {/* Moderar mural */}
      <AdminCard title="Moderar mural" icon={Eye}>
        <p style={{ color: C.textMute, fontSize: 14, margin: "0 0 16px" }}>
          Remova reconhecimentos impróprios. A remoção é imediata.
        </p>
        {publicRecs.length === 0 ? (
          <div style={{ color: C.textDim, fontSize: 14, fontStyle: "italic" }}>Nenhum reconhecimento público no momento.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {publicRecs.map((r) => {
              const from = personById(r.fromId, people);
              const to = personById(r.toId, people);
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: "rgba(0,0,0,0.25)", borderRadius: 12, border: `1px solid ${C.stroke}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: C.text }}>
                      <strong style={{ color: C.white }}>{from?.name}</strong> → <strong style={{ color: C.orange }}>{to?.name}</strong>
                    </div>
                    <div style={{ fontSize: 12.5, color: C.textMute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.msg}</div>
                  </div>
                  <button onClick={() => removerRec(r.id)} className="lift" title="Remover" style={{
                    display: "flex", alignItems: "center", gap: 6, color: "#FF6B6B", fontWeight: 650, fontSize: 13,
                    background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.3)",
                    padding: "7px 12px", borderRadius: 9 }}>
                    <Trash2 size={14} strokeWidth={2.4} /> Remover
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

function AdminStat({ icon: Icon, label, value }) {
  return (
    <div style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`, borderRadius: 14,
      border: `1px solid ${C.stroke}`, padding: "16px 18px" }}>
      <Icon size={18} color={C.orange} strokeWidth={2.4} />
      <div style={{ fontSize: 22, fontWeight: 800, color: C.white, marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: C.textMute, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function AdminCard({ title, icon: Icon, children }) {
  return (
    <div style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`, borderRadius: 18,
      border: `1px solid ${C.stroke}`, padding: 22, marginBottom: 18, boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <Icon size={18} color={C.orange} strokeWidth={2.5} />
        <h3 style={{ fontSize: 16, fontWeight: 750, margin: 0, color: C.white }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

const pesoBtn = { width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.06)",
  border: `1px solid ${C.stroke}`, color: C.white, fontSize: 18, fontWeight: 700, lineHeight: 1,
  display: "flex", alignItems: "center", justifyContent: "center" };

// ---------- estilos compartilhados (tema escuro) ----------
const lbl = { display: "block", fontWeight: 700, fontSize: 14, marginBottom: 10, color: C.text };
const inp = { width: "100%", padding: "11px 14px", borderRadius: 11, border: `1.5px solid ${C.stroke}`,
  fontSize: 14.5, color: C.text, background: "rgba(0,0,0,0.3)" };
const btnPrimary = { display: "inline-flex", alignItems: "center", gap: 8,
  background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, color: C.white,
  fontWeight: 700, fontSize: 14.5, padding: "11px 18px", borderRadius: 11, boxShadow: `0 6px 20px ${C.orangeGlow}` };
const btnGhost = { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)",
  color: C.textMute, fontWeight: 650, fontSize: 14.5, padding: "11px 18px", borderRadius: 11, border: `1px solid ${C.stroke}` };