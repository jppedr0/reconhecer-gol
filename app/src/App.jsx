import React, { useState, useMemo } from "react";
import {
  Home, Award, Send, Trophy, User, Mail, Heart, Search,
  Sparkles, Medal, Crown, ChevronRight, Star, Zap, Users, Check, Pencil, X,
} from "lucide-react";

/* ============================================================
   PROGRAMA RECONHECER — GOL / Inteligência
   v2 — Identidade oficial GOL (brandbook)
   ============================================================
   CORES OFICIAIS (brandbook GOL):
   Laranja #FF7020 · Laranja Escuro #DB5014 · Grafite #37322D
   Cinza Escuro #65605B · Cinza #9A9187 · Cinza Claro #DAD0C5
   Off White #FCF6F0 · Branco #FFFFFF
   ============================================================ */

// ---------- Paleta oficial GOL ----------
const C = {
  orange: "#FF7020",
  orangeDeep: "#DB5014",
  orangeSoft: "#FFEAD9",
  graphite: "#37322D",
  darkGray: "#65605B",
  gray: "#9A9187",
  grayLight: "#DAD0C5",
  offWhite: "#FCF6F0",
  white: "#FFFFFF",
  line: "#E8E2D9",
  bg: "#F4F1EC",
  gold: "#FFB414",
};

/* ============================================================
   IMAGENS DA MARCA
   Os arquivos ficam na pasta /public do projeto.
   Enquanto não subir, o site usa um desenho de reserva (fallback).
   Para ativar a imagem real: suba o arquivo em /public com o
   nome indicado e a imagem aparece sozinha.
   ============================================================ */
const ASSETS = {
  cabeca: "/inteligencia-cabeca.png",   // PNG_CABEÇA_-_Sem_fundo.png  → renomear
  aviao: "/aviao-gol.jpeg",             // GOL_AIRCRAFT_737_262.jpeg   → renomear
};

// ---------- Dados (exemplo — trocar pelos reais depois) ----------
const CATEGORIES = [
  { id: "colab", label: "Colaboração", weight: 1, icon: Users, color: "#007895" },
  { id: "entrega", label: "Entrega & Resultado", weight: 2, icon: Zap, color: "#FF7020" },
  { id: "inova", label: "Inovação", weight: 3, icon: Sparkles, color: "#732846" },
  { id: "alem", label: "Acima & Além", weight: 3, icon: Star, color: "#FFB414" },
];

const PEOPLE = [
  { id: 1, name: "Marina Alves", role: "Analista de Inteligência", area: "Inteligência", initials: "MA",
    bio: "Apaixonada por dados e dashboards que contam histórias." },
  { id: 2, name: "Rafael Souza", role: "Especialista de Dados", area: "Inteligência", initials: "RS",
    bio: "Transformo planilha bagunçada em decisão de negócio." },
  { id: 3, name: "Camila Torres", role: "Coordenadora de Operações", area: "Operações", initials: "CT",
    bio: "" },
  { id: 4, name: "Diego Martins", role: "Analista de BI", area: "Inteligência", initials: "DM",
    bio: "Power BI é comigo mesmo." },
  { id: 5, name: "Letícia Rocha", role: "Cientista de Dados", area: "Inteligência", initials: "LR",
    bio: "" },
  { id: 6, name: "Bruno Carvalho", role: "Analista de Processos", area: "Suprimentos", initials: "BC",
    bio: "" },
  { id: 7, name: "Você", role: "Inteligência", area: "Inteligência", initials: "EU",
    bio: "" },
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

function timeAgo(days) {
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  return `há ${days} dias`;
}
function scoreOf(rec) {
  return catById(rec.cat).weight + rec.likes * 0.2;
}

// ---------- Avatar (com espaço para foto real depois) ----------
function Avatar({ p, size = 40, ring }) {
  const fontSize = size * 0.36;
  // Quando houver foto real do Microsoft, entra aqui via p.photo
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
      background: p.id === ME ? C.graphite : `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
      color: C.white, display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize, letterSpacing: "0.02em",
      boxShadow: ring ? `0 0 0 3px ${C.white}, 0 0 0 5px ${C.orange}` : "none",
    }}>
      {p.photo ? <img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.initials}
    </div>
  );
}

// ---------- Marca da Inteligência (cabeça) com fallback ----------
function CabecaIntel({ size = 34 }) {
  const [erro, setErro] = useState(false);
  if (!erro) {
    return <img src={ASSETS.cabeca} alt="Inteligência GOL" onError={() => setErro(true)}
      style={{ height: size, width: "auto", display: "block" }} />;
  }
  // Fallback: desenho simples de cabeça enquanto a imagem real não está em /public
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="Inteligência">
      <path d="M8 20c0-7 5-12 12-12s11 4 11 11c0 3-1 5-3 7v5h-4v-3h-6v3h-3v-6c-4-2-7-5-7-9z"
        fill={C.orange} />
      <circle cx="16" cy="16" r="1.6" fill="#fff" /><circle cx="23" cy="14" r="1.6" fill="#fff" />
      <circle cx="25" cy="21" r="1.6" fill="#fff" /><circle cx="19" cy="23" r="1.6" fill="#fff" />
      <path d="M16 16l3-2M23 14l2 7M25 21l-6 2" stroke="#fff" strokeWidth="1.1" />
    </svg>
  );
}

// ---------- Chip de categoria ----------
function CatChip({ catId, small }) {
  const c = catById(catId);
  const Icon = c.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: `${c.color}18`, color: c.color,
      padding: small ? "3px 9px" : "5px 11px", borderRadius: 999,
      fontSize: small ? 11 : 12.5, fontWeight: 700, whiteSpace: "nowrap",
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
  const [people, setPeople] = useState(PEOPLE);
  const [liked, setLiked] = useState({});
  const [profileId, setProfileId] = useState(null);
  const [toast, setToast] = useState(null);

  function toggleLike(id) {
    setLiked((l) => ({ ...l, [id]: !l[id] }));
    setRecs((rs) => rs.map((r) => r.id === id ? { ...r, likes: r.likes + (liked[id] ? -1 : 1) } : r));
  }
  function addRec(rec) {
    setRecs((rs) => [{ ...rec, id: Date.now(), fromId: ME, likes: 0, days: 0 }, ...rs]);
    setToast(rec.public ? "Reconhecimento publicado no mural!" : "Mensagem privada enviada!");
    setTimeout(() => setToast(null), 2600);
    setTab(rec.public ? "home" : "mensagens");
  }
  function openProfile(id) { setProfileId(id); setTab("perfil"); }
  function saveBio(id, bio) {
    setPeople((ps) => ps.map((p) => p.id === id ? { ...p, bio } : p));
    setToast("Bio atualizada!");
    setTimeout(() => setToast(null), 2200);
  }

  const ranking = useMemo(() => {
    const totals = {};
    recs.forEach((r) => { totals[r.toId] = (totals[r.toId] || 0) + scoreOf(r); });
    return Object.entries(totals)
      .map(([id, pts]) => ({ person: personById(Number(id), people), pts: Math.round(pts * 10) / 10,
        count: recs.filter((r) => r.toId === Number(id)).length }))
      .filter((r) => r.person)
      .sort((a, b) => b.pts - a.pts);
  }, [recs, people]);

  const NAV = [
    { id: "home", label: "Mural", icon: Home },
    { id: "reconhecer", label: "Reconhecer", icon: Send },
    { id: "ranking", label: "Ranking", icon: Trophy },
    { id: "hall", label: "Hall da Fama", icon: Award },
    { id: "mensagens", label: "Mensagens", icon: Mail },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif",
      background: C.bg, minHeight: "100vh", color: C.graphite }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; }
        .lift { transition: transform .15s ease, box-shadow .15s ease; }
        .lift:hover { transform: translateY(-2px); }
        .fade { animation: fade .35s ease; }
        @keyframes fade { from {opacity:0; transform:translateY(8px);} to {opacity:1; transform:none;} }
        @media (prefers-reduced-motion: reduce){ .fade,.lift{animation:none;transition:none;} }
        button:focus-visible { outline: 2px solid ${C.orange}; outline-offset: 2px; }
        input:focus, textarea:focus { outline: none; border-color: ${C.orange} !important; }
      `}</style>

      {/* ---------- Topbar ---------- */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: C.white,
        borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "12px 22px",
          display: "flex", alignItems: "center", gap: 14 }}>
          {/* LOGO: elo + cabeça + escrita */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <EloMark size={36} />
            <div style={{ width: 1, height: 30, background: C.line }} />
            <CabecaIntel size={32} />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em", color: C.graphite }}>
                Reconhecer
              </div>
              <div style={{ fontSize: 10.5, color: C.gray, fontWeight: 700, letterSpacing: "0.08em", marginTop: 3 }}>
                INTELIGÊNCIA · GOL
              </div>
            </div>
          </div>
          <nav style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
            {NAV.map((n) => {
              const Icon = n.icon; const on = tab === n.id;
              return (
                <button key={n.id} onClick={() => setTab(n.id)} style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "9px 14px", borderRadius: 10,
                  fontWeight: 650, fontSize: 14, color: on ? C.orangeDeep : C.darkGray,
                  background: on ? C.orangeSoft : "transparent" }}>
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

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "26px 22px 60px" }}>
        {tab === "home" && <Mural recs={recs} people={people} liked={liked} toggleLike={toggleLike}
          ranking={ranking} openProfile={openProfile} goReconhecer={() => setTab("reconhecer")} />}
        {tab === "reconhecer" && <Reconhecer people={people} onSend={addRec} />}
        {tab === "ranking" && <Ranking ranking={ranking} openProfile={openProfile} />}
        {tab === "hall" && <Hall />}
        {tab === "mensagens" && <Mensagens recs={recs} people={people} openProfile={openProfile} />}
        {tab === "perfil" && <Perfil id={profileId} people={people} recs={recs} ranking={ranking}
          liked={liked} toggleLike={toggleLike} goReconhecer={() => setTab("reconhecer")} saveBio={saveBio} />}
      </main>

      {toast && (
        <div className="fade" style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)",
          background: C.graphite, color: C.white, padding: "13px 20px", borderRadius: 12,
          fontWeight: 650, fontSize: 14, display: "flex", alignItems: "center", gap: 9,
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)", zIndex: 60 }}>
          <Check size={17} strokeWidth={3} color={C.orange} /> {toast}
        </div>
      )}
    </div>
  );
}

// ---------- Marca "elo" oficial (dois aros entrelaçados: laranja + cinza) ----------
function EloMark({ size = 36 }) {
  // Conforme brandbook: círculos interligados, cores contrastantes (laranja + cinza claro)
  return (
    <svg width={size} height={size} viewBox="0 0 48 40" fill="none" aria-label="GOL">
      <circle cx="28" cy="20" r="11" stroke={C.grayLight} strokeWidth="6" />
      <circle cx="18" cy="20" r="11" stroke={C.orange} strokeWidth="6" />
    </svg>
  );
}

// ============================================================
//  MURAL
// ============================================================
function Mural({ recs, people, liked, toggleLike, ranking, openProfile, goReconhecer }) {
  const [heroErro, setHeroErro] = useState(false);
  const publicRecs = recs.filter((r) => r.public);
  const leader = ranking[0];

  return (
    <div className="fade">
      {/* Hero com foto de avião (fallback: gradiente grafite) */}
      <section style={{ position: "relative", overflow: "hidden", borderRadius: 22,
        marginBottom: 26, background: C.graphite }}>
        {/* Imagem de fundo */}
        {!heroErro && (
          <img src={ASSETS.aviao} alt="" onError={() => setHeroErro(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.55 }} />
        )}
        {/* Overlay para legibilidade */}
        <div style={{ position: "absolute", inset: 0,
          background: `linear-gradient(100deg, ${C.graphite}F2 0%, ${C.graphite}CC 45%, ${C.orangeDeep}66 130%)` }} />
        {/* elo decorativo */}
        <div style={{ position: "absolute", right: -30, top: -20, opacity: 0.12 }}>
          <svg width="220" height="220" viewBox="0 0 48 40" fill="none">
            <circle cx="28" cy="20" r="11" stroke="#fff" strokeWidth="2.2" />
            <circle cx="18" cy="20" r="11" stroke="#fff" strokeWidth="2.2" />
          </svg>
        </div>

        <div style={{ position: "relative", padding: "32px 34px", maxWidth: 580 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
            color: C.orange, textTransform: "uppercase" }}>Junho · Destaque do mês</span>
          <h1 style={{ fontSize: 31, fontWeight: 800, margin: "10px 0 8px", letterSpacing: "-0.02em",
            lineHeight: 1.15, color: C.white }}>
            Inteligência faz a gente voar.<br />
            <span style={{ color: C.orange }}>Reconhecer faz a gente decolar.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 15, lineHeight: 1.5, margin: "0 0 20px" }}>
            Todo início de mês a Inteligência celebra quem mais recebeu reconhecimentos. Um gesto simples vira destaque.
          </p>
          <button onClick={goReconhecer} className="lift" style={{ background: C.orange, color: C.white,
            fontWeight: 700, fontSize: 15, padding: "12px 22px", borderRadius: 12,
            display: "inline-flex", alignItems: "center", gap: 9,
            boxShadow: "0 8px 20px rgba(255,112,32,0.4)" }}>
            <Send size={17} strokeWidth={2.6} /> Reconhecer alguém
          </button>

          {leader && (
            <button onClick={() => openProfile(leader.person.id)} className="lift" style={{
              marginTop: 24, display: "flex", alignItems: "center", gap: 14,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 16, padding: "12px 16px", textAlign: "left" }}>
              <div style={{ position: "relative" }}>
                <Avatar p={leader.person} size={46} ring />
                <Crown size={20} color={C.gold} fill={C.gold} style={{ position: "absolute", top: -12,
                  left: "50%", transform: "translateX(-50%) rotate(-12deg)" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 600, letterSpacing: "0.05em" }}>LIDERANDO AGORA</div>
                <div style={{ color: C.white, fontWeight: 700, fontSize: 16 }}>{leader.person.name}</div>
                <div style={{ color: C.orange, fontWeight: 700, fontSize: 13 }}>{leader.pts} pontos</div>
              </div>
              <ChevronRight size={18} color="rgba(255,255,255,0.55)" style={{ marginLeft: 6 }} />
            </button>
          )}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 750, margin: 0 }}>Mural de reconhecimentos</h2>
            <span style={{ fontSize: 13, color: C.gray, fontWeight: 600 }}>{publicRecs.length} públicos</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {publicRecs.map((r) => (
              <RecCard key={r.id} rec={r} people={people} liked={liked[r.id]} toggleLike={toggleLike} openProfile={openProfile} />
            ))}
          </div>
        </div>

        <aside style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.line}`,
          padding: 18, position: "sticky", top: 88 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Trophy size={17} color={C.orange} strokeWidth={2.5} />
            <h3 style={{ fontSize: 15, fontWeight: 750, margin: 0 }}>Top do mês</h3>
          </div>
          {ranking.slice(0, 5).map((row, i) => (
            <button key={row.person.id} onClick={() => openProfile(row.person.id)} className="lift"
              style={{ display: "flex", alignItems: "center", gap: 11, width: "100%",
                padding: "9px 6px", borderRadius: 10, textAlign: "left" }}>
              <span style={{ width: 20, fontWeight: 800, fontSize: 14,
                color: i === 0 ? C.gold : i === 1 ? C.gray : i === 2 ? "#CD7F32" : C.grayLight }}>{i + 1}</span>
              <Avatar p={row.person} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 650, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.person.name}</div>
              </div>
              <span style={{ fontWeight: 750, fontSize: 13, color: C.orangeDeep }}>{row.pts}</span>
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}

// ---------- Card de reconhecimento (alinhamento corrigido) ----------
function RecCard({ rec, people, liked, toggleLike, openProfile }) {
  const from = personById(rec.fromId, people);
  const to = personById(rec.toId, people);
  return (
    <article className="lift" style={{ background: C.white, borderRadius: 18,
      border: `1px solid ${C.line}`, padding: "18px 20px" }}>
      {/* Cabeçalho: avatar + texto alinhados pelo topo, sem desencaixe */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11, marginBottom: 13 }}>
        <button onClick={() => openProfile(from.id)} style={{ marginTop: 1 }}><Avatar p={from} size={40} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* linha 1: quem reconheceu quem — alinhado na mesma baseline */}
          <div style={{ fontSize: 14, lineHeight: 1.45, display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0 5px" }}>
            <button onClick={() => openProfile(from.id)} style={{ fontWeight: 700, color: C.graphite }}>{from.name}</button>
            <span style={{ color: C.gray }}>reconheceu</span>
            <button onClick={() => openProfile(to.id)} style={{ fontWeight: 700, color: C.orangeDeep }}>{to.name}</button>
          </div>
          {/* linha 2: tempo — agora logo abaixo, sem flutuar */}
          <div style={{ fontSize: 12, color: C.gray, fontWeight: 500, marginTop: 3 }}>{timeAgo(rec.days)}</div>
        </div>
        <div style={{ flexShrink: 0 }}><CatChip catId={rec.cat} /></div>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.55, color: C.darkGray,
        fontFamily: "'Inter',sans-serif" }}>"{rec.msg}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => toggleLike(rec.id)} style={{ display: "flex", alignItems: "center", gap: 7,
          padding: "7px 13px", borderRadius: 999,
          background: liked ? C.orangeSoft : C.offWhite, color: liked ? C.orangeDeep : C.darkGray,
          fontWeight: 650, fontSize: 13.5, transition: "all .15s" }}>
          <Heart size={16} strokeWidth={2.4} fill={liked ? C.orange : "none"} color={liked ? C.orange : C.darkGray} />
          {rec.likes}
        </button>
        <span style={{ fontSize: 12.5, color: C.gray, marginLeft: "auto", fontWeight: 600 }}>
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
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Reconhecer alguém</h1>
      <p style={{ color: C.gray, fontSize: 15, margin: "0 0 24px" }}>
        Um reconhecimento sincero vale mais que mil reuniões. Conte o que essa pessoa fez.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {["Quem", "Categoria", "Mensagem"].map((s, i) => (
          <div key={s} style={{ flex: 1 }}>
            <div style={{ height: 4, borderRadius: 999, background: step >= i + 1 ? C.orange : C.line, transition: "background .3s" }} />
            <div style={{ fontSize: 12, fontWeight: 650, marginTop: 6, color: step >= i + 1 ? C.graphite : C.gray }}>{i + 1}. {s}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.line}`, padding: 24 }}>
        {step === 1 && (
          <div className="fade">
            <label style={lbl}>Para quem é o reconhecimento?</label>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <Search size={17} color={C.gray} style={{ position: "absolute", left: 13, top: 13 }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pessoa..." style={{ ...inp, paddingLeft: 40 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {options.map((p) => (
                <button key={p.id} onClick={() => setToId(p.id)} style={{ display: "flex", alignItems: "center",
                  gap: 11, padding: 12, borderRadius: 12,
                  border: `2px solid ${toId === p.id ? C.orange : C.line}`,
                  background: toId === p.id ? C.orangeSoft : C.white, textAlign: "left" }}>
                  <Avatar p={p} size={38} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: C.gray, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.role}</div>
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
                  <button key={c.id} onClick={() => setCat(c.id)} style={{ padding: 16, borderRadius: 14, textAlign: "left",
                    border: `2px solid ${on ? c.color : C.line}`, background: on ? `${c.color}0D` : C.white }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Icon size={22} color={c.color} strokeWidth={2.4} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: `${c.color}1A`, padding: "3px 8px", borderRadius: 999 }}>
                        {c.weight} {c.weight > 1 ? "pts" : "pt"}
                      </span>
                    </div>
                    <div style={{ fontWeight: 750, fontSize: 15, marginTop: 10 }}>{c.label}</div>
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12.5, color: C.gray, margin: "12px 0 0" }}>Categorias com maior impacto valem mais pontos no ranking mensal.</p>
            <NavRow back={() => setStep(1)} next={() => setStep(3)} nextOk={!!cat} />
          </div>
        )}

        {step === 3 && (
          <div className="fade">
            <label style={lbl}>Escreva o reconhecimento</label>
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4}
              placeholder="Seja específico: o que a pessoa fez e o impacto que gerou..."
              style={{ ...inp, resize: "vertical", fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }} />
            <div style={{ fontSize: 12, color: msg.trim().length > 8 ? C.gray : C.orangeDeep, marginTop: 6, fontWeight: 600 }}>
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
    <button onClick={onClick} style={{ flex: 1, padding: 14, borderRadius: 13, textAlign: "left",
      border: `2px solid ${on ? C.orange : C.line}`, background: on ? C.orangeSoft : C.white }}>
      <Icon size={19} color={on ? C.orangeDeep : C.darkGray} strokeWidth={2.3} />
      <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>{sub}</div>
    </button>
  );
}

function NavRow({ back, next, send, nextOk, sendOk }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
      {back && <button onClick={back} style={btnGhost}>Voltar</button>}
      <div style={{ flex: 1 }} />
      {next && <button onClick={next} disabled={!nextOk} style={{ ...btnPrimary, opacity: nextOk ? 1 : 0.4, cursor: nextOk ? "pointer" : "not-allowed" }}>Continuar <ChevronRight size={17} strokeWidth={2.6} /></button>}
      {send && <button onClick={send} disabled={!sendOk} style={{ ...btnPrimary, opacity: sendOk ? 1 : 0.4, cursor: sendOk ? "pointer" : "not-allowed" }}><Send size={16} strokeWidth={2.6} /> Enviar reconhecimento</button>}
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
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Ranking de junho</h1>
      <p style={{ color: C.gray, fontSize: 15, margin: "0 0 28px" }}>
        Pontuação = peso da categoria + curtidas no mural (0,2 cada). Zera todo dia 1º.
      </p>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18, marginBottom: 32 }}>
        {order.map((idx) => {
          const row = podium[idx]; if (!row) return null;
          const rank = idx + 1;
          const h = rank === 1 ? 150 : rank === 2 ? 116 : 92;
          const medal = rank === 1 ? C.gold : rank === 2 ? C.gray : "#CD7F32";
          return (
            <button key={row.person.id} onClick={() => openProfile(row.person.id)} className="lift" style={{ textAlign: "center", width: 150 }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
                <Avatar p={row.person} size={rank === 1 ? 72 : 58} ring={rank === 1} />
                {rank === 1 && <Crown size={26} color={C.gold} fill={C.gold} style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%) rotate(-10deg)" }} />}
              </div>
              <div style={{ fontWeight: 750, fontSize: 14 }}>{row.person.name}</div>
              <div style={{ fontSize: 12, color: C.gray, marginBottom: 10 }}>{row.count} reconhecimentos</div>
              <div style={{ height: h, borderRadius: "14px 14px 0 0", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "flex-start", paddingTop: 14, color: C.white,
                background: rank === 1 ? `linear-gradient(180deg, ${C.orange}, ${C.orangeDeep})` : `linear-gradient(180deg, ${C.darkGray}, ${C.graphite})` }}>
                <Medal size={22} color={medal} fill={medal} />
                <div style={{ fontWeight: 800, fontSize: 24, marginTop: 6 }}>{row.pts}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>pontos</div>
              </div>
            </button>
          );
        })}
      </div>

      {rest.length > 0 && (
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.line}`, overflow: "hidden" }}>
          {rest.map((row, i) => (
            <button key={row.person.id} onClick={() => openProfile(row.person.id)} className="lift"
              style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "13px 18px",
                borderTop: i === 0 ? "none" : `1px solid ${C.line}`, textAlign: "left" }}>
              <span style={{ width: 24, fontWeight: 800, color: C.gray, fontSize: 15 }}>{i + 4}</span>
              <Avatar p={row.person} size={38} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{row.person.name}</div>
                <div style={{ fontSize: 12.5, color: C.gray }}>{row.person.role} · {row.count} reconhecimentos</div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 17, color: C.orangeDeep }}>{row.pts}</span>
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
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Hall da Fama</h1>
      <p style={{ color: C.gray, fontSize: 15, margin: "0 0 28px" }}>
        Os destaques que já receberam o mimo da Inteligência. Cada elo conta uma história.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {HALL.map((h) => (
          <div key={h.month} className="lift" style={{ background: C.white, borderRadius: 18,
            border: `1px solid ${C.line}`, padding: 22, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${C.orange}, ${C.gold})` }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, marginTop: 4 }}>{h.month}</div>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
              <Avatar p={{ id: 0, initials: h.initials }} size={64} ring />
              <Trophy size={22} color={C.gold} fill={C.gold} style={{ position: "absolute", bottom: -4, right: -4 }} />
            </div>
            <div style={{ fontWeight: 750, fontSize: 16 }}>{h.name}</div>
            <div style={{ fontSize: 13, color: C.orangeDeep, fontWeight: 650, marginTop: 2 }}>{h.cat}</div>
            <div style={{ marginTop: 14, padding: "8px 0", borderTop: `1px solid ${C.line}`, fontSize: 13, color: C.gray }}>
              <strong style={{ color: C.graphite, fontSize: 18 }}>{h.pts}</strong> pontos no mês
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
  const mine = recs.filter((r) => !r.public && r.toId === ME);
  return (
    <div className="fade" style={{ maxWidth: 680, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px" }}>Mensagens privadas</h1>
      <p style={{ color: C.gray, fontSize: 15, margin: "0 0 24px" }}>
        Reconhecimentos enviados só pra você. Eles também contam pontos no ranking.
      </p>
      {mine.length === 0 ? (
        <div style={{ background: C.white, borderRadius: 18, border: `1px dashed ${C.line}`, padding: 44, textAlign: "center" }}>
          <Mail size={34} color={C.gray} style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Nada por aqui ainda</div>
          <div style={{ color: C.gray, fontSize: 14 }}>Quando alguém te reconhecer em modo privado, aparece aqui.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {mine.map((r) => {
            const from = personById(r.fromId, people);
            return (
              <div key={r.id} style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.line}`, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 11, marginBottom: 11 }}>
                  <button onClick={() => openProfile(from.id)} style={{ marginTop: 1 }}><Avatar p={from} size={36} /></button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{from.name}</div>
                    <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>{timeAgo(r.days)}</div>
                  </div>
                  <CatChip catId={r.cat} small />
                </div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: C.darkGray, fontFamily: "'Inter',sans-serif" }}>"{r.msg}"</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
//  PERFIL (com nome, área, cargo e BIO EDITÁVEL)
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
      <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.line}`, overflow: "hidden", marginBottom: 22 }}>
        <div style={{ height: 110, background: `linear-gradient(100deg, ${C.graphite}, ${C.orangeDeep})`, position: "relative" }}>
          <div style={{ position: "absolute", right: -16, top: -10, opacity: 0.14 }}>
            <svg width="150" height="150" viewBox="0 0 48 40" fill="none">
              <circle cx="28" cy="20" r="11" stroke="#fff" strokeWidth="2.4" />
              <circle cx="18" cy="20" r="11" stroke="#fff" strokeWidth="2.4" />
            </svg>
          </div>
        </div>
        <div style={{ padding: "0 26px 22px" }}>
          {/* Avatar sobe sobre a capa */}
          <div style={{ marginTop: -42, marginBottom: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ border: `4px solid ${C.white}`, borderRadius: "50%", width: "fit-content" }}><Avatar p={p} size={84} /></div>
            {!ehMeu && (
              <button onClick={goReconhecer} className="lift" style={{ ...btnPrimary, marginBottom: 4 }}>
                <Send size={15} strokeWidth={2.6} /> Reconhecer
              </button>
            )}
          </div>
          {/* Nome e cargo ficam abaixo da capa, no fundo branco */}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{p.name}</h1>
            <div style={{ color: C.gray, fontSize: 14, fontWeight: 600, marginTop: 3 }}>
              {p.role} · <span style={{ color: C.orangeDeep }}>{p.area}</span>
            </div>
          </div>

          {/* BIO editável */}
          <div style={{ marginTop: 16, background: C.offWhite, borderRadius: 14, padding: "14px 16px", border: `1px solid ${C.line}` }}>
            {!editando ? (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <p style={{ margin: 0, flex: 1, fontSize: 14, lineHeight: 1.5,
                  color: p.bio ? C.darkGray : C.gray, fontStyle: p.bio ? "normal" : "italic",
                  fontFamily: "'Inter',sans-serif" }}>
                  {p.bio || (ehMeu ? "Você ainda não escreveu sua bio. Que tal contar um pouco sobre você?" : "Sem bio ainda.")}
                </p>
                {ehMeu && (
                  <button onClick={abrirEdicao} className="lift" title="Editar bio" style={{
                    display: "flex", alignItems: "center", gap: 6, color: C.orangeDeep, fontWeight: 650,
                    fontSize: 13, background: C.white, padding: "6px 12px", borderRadius: 9, border: `1px solid ${C.line}` }}>
                    <Pencil size={13} strokeWidth={2.4} /> Editar
                  </button>
                )}
              </div>
            ) : (
              <div>
                <textarea value={rascunho} onChange={(e) => setRascunho(e.target.value)} rows={3} maxLength={160}
                  placeholder="Escreva algo sobre você (até 160 caracteres)..."
                  style={{ ...inp, resize: "none", fontFamily: "'Inter',sans-serif", lineHeight: 1.5, background: C.white }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: C.gray, fontWeight: 600 }}>{rascunho.length}/160</span>
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
                  background: `${c.color}14`, color: c.color, padding: "5px 11px", borderRadius: 999, fontSize: 12.5, fontWeight: 700 }}>
                  <Icon size={13} strokeWidth={2.6} /> {c.label} · {c.n}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 750, margin: "0 0 14px" }}>Reconhecimentos recebidos</h2>
      {received.length === 0 ? (
        <div style={{ color: C.gray, fontSize: 14, background: C.white, borderRadius: 14, border: `1px dashed ${C.line}`, padding: 30, textAlign: "center" }}>
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
      <div style={{ fontSize: 26, fontWeight: 800, color: hi ? C.orangeDeep : C.graphite, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 12.5, color: C.gray, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ---------- estilos compartilhados ----------
const lbl = { display: "block", fontWeight: 700, fontSize: 14, marginBottom: 10, color: C.graphite };
const inp = { width: "100%", padding: "11px 14px", borderRadius: 11, border: `1.5px solid ${C.line}`,
  fontSize: 14.5, color: C.graphite, background: C.white };
const btnPrimary = { display: "inline-flex", alignItems: "center", gap: 8, background: C.orange, color: C.white,
  fontWeight: 700, fontSize: 14.5, padding: "11px 18px", borderRadius: 11 };
const btnGhost = { display: "inline-flex", alignItems: "center", gap: 6, background: C.offWhite, color: C.darkGray,
  fontWeight: 650, fontSize: 14.5, padding: "11px 18px", borderRadius: 11 };