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
  { id: 7, name: "Você", role: "Jovem Aprendiz", area: "Inteligência de Suprimentos", initials: "EU", bio: "", admin: true },
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

// ---------- Sistema de badges / conquistas ----------
const BADGES = [
  { id: "primeiro", icon: Star, cor: "#3BA7C4", nome: "Primeiro reconhecimento", desc: "Recebeu seu primeiro reconhecimento",
    teste: (s) => s.recebidos >= 1 },
  { id: "querido", icon: Heart, cor: "#FF6B9D", nome: "Queridinho da equipe", desc: "Recebeu 3 ou mais reconhecimentos",
    teste: (s) => s.recebidos >= 3 },
  { id: "popular", icon: Flame, cor: "#FF7020", nome: "Em alta", desc: "Recebeu de 3 pessoas diferentes",
    teste: (s) => s.pessoasDiferentes >= 3 },
  { id: "curtido", icon: TrendingUp, cor: "#FFB414", nome: "Aplaudido", desc: "Acumulou 20+ curtidas nos reconhecimentos",
    teste: (s) => s.curtidasRecebidas >= 20 },
  { id: "colaborador", icon: Users, cor: "#3BA7C4", nome: "Colaborador nato", desc: "Reconhecido em Colaboração",
    teste: (s) => s.cats.has("colab") },
  { id: "inovador", icon: Sparkles, cor: "#B566D9", nome: "Inovador", desc: "Reconhecido em Inovação",
    teste: (s) => s.cats.has("inova") },
  { id: "alemDoComum", icon: Crown, cor: "#FFB414", nome: "Acima & Além", desc: "Reconhecido em Acima & Além",
    teste: (s) => s.cats.has("alem") },
  { id: "generoso", icon: Send, cor: "#FF7020", nome: "Generoso", desc: "Enviou 3 ou mais reconhecimentos",
    teste: (s) => s.enviados >= 3 },
];

function statsDe(id, recs) {
  const recebidosArr = recs.filter((r) => r.toId === id);
  const enviadosArr = recs.filter((r) => r.fromId === id);
  return {
    recebidos: recebidosArr.length,
    enviados: enviadosArr.length,
    curtidasRecebidas: recebidosArr.reduce((s, r) => s + r.likes, 0),
    pessoasDiferentes: new Set(recebidosArr.map((r) => r.fromId)).size,
    cats: new Set(recebidosArr.map((r) => r.cat)),
  };
}
function badgesDe(id, recs) {
  const s = statsDe(id, recs);
  return BADGES.map((b) => ({ ...b, conquistada: b.teste(s) }));
}

// ---------- Reações (no lugar de só curtir) ----------
const REACOES = [
  { id: "heart", emoji: "❤️", label: "Amei" },
  { id: "clap", emoji: "👏", label: "Aplausos" },
  { id: "rocket", emoji: "🚀", label: "Arrasou" },
  { id: "fire", emoji: "🔥", label: "Demais" },
  { id: "idea", emoji: "💡", label: "Inspirador" },
  { id: "party", emoji: "🎉", label: "Festa" },
];

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

// ---------- Tooltip de ajuda ----------
function Ajuda({ texto }) {
  const [aberto, setAberto] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setAberto(true)} onMouseLeave={() => setAberto(false)}>
      <button onClick={() => setAberto((a) => !a)} aria-label="Ajuda" style={{
        width: 18, height: 18, borderRadius: "50%", border: `1px solid ${C.strokeHi}`,
        background: "rgba(255,255,255,0.05)", color: C.textMute, fontSize: 11, fontWeight: 800,
        display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, cursor: "help" }}>?</button>
      {aberto && (
        <span className="fade" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)", width: 260, zIndex: 50,
          background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`, color: C.text,
          border: `1px solid ${C.strokeHi}`, borderRadius: 12, padding: "11px 13px",
          fontSize: 12.5, fontWeight: 500, lineHeight: 1.5, textAlign: "left",
          boxShadow: "0 12px 36px rgba(0,0,0,0.5)" }}>
          {texto}
        </span>
      )}
    </span>
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
  // solicitações de acesso (pendentes) e e-mails já aprovados
  const [solicitacoes, setSolicitacoes] = useState([
    { id: 1, nome: "João Pereira", email: "joao.pereira@voegol.com.br", quando: "há 2 dias" },
    { id: 2, nome: "Ana Lima", email: "ana.lima@voegol.com.br", quando: "ontem" },
  ]);
  const [aprovados, setAprovados] = useState(["jpomatos@voegol.com.br", "teste@voegol.com.br"]);
  // notificações para o usuário (quem te reconheceu)
  const [notifsLidas, setNotifsLidas] = useState(false);
  // reações: { [recId]: { [reacaoId]: count } } e qual EU dei: { [recId]: reacaoId }
  const [reacoes, setReacoes] = useState({});
  const [minhaReacao, setMinhaReacao] = useState({});
  // favoritos: Set de recIds
  const [favoritos, setFavoritos] = useState({});

  function reagir(recId, reacaoId) {
    setReacoes((prev) => {
      const atual = { ...(prev[recId] || {}) };
      const anterior = minhaReacao[recId];
      if (anterior === reacaoId) {
        // tirar reação
        atual[reacaoId] = Math.max(0, (atual[reacaoId] || 1) - 1);
      } else {
        if (anterior) atual[anterior] = Math.max(0, (atual[anterior] || 1) - 1);
        atual[reacaoId] = (atual[reacaoId] || 0) + 1;
      }
      return { ...prev, [recId]: atual };
    });
    setMinhaReacao((prev) => ({ ...prev, [recId]: prev[recId] === reacaoId ? null : reacaoId }));
  }
  function toggleFavorito(recId) {
    setFavoritos((prev) => ({ ...prev, [recId]: !prev[recId] }));
    notify(favoritos[recId] ? "Removido dos favoritos." : "Salvo nos favoritos! ⭐", 1800);
  }

  const eu = personById(ME, people);
  const souAdmin = eu?.admin === true;

  function notify(msg, ms = 2400) { setToast(msg); setTimeout(() => setToast(null), ms); }

  function toggleLike(id) {
    setLiked((l) => ({ ...l, [id]: !l[id] }));
    setRecs((rs) => rs.map((r) => r.id === id ? { ...r, likes: r.likes + (liked[id] ? -1 : 1) } : r));
  }
  function addRec(rec) {
    setRecs((rs) => [{ ...rec, id: Date.now(), fromId: ME, likes: 0, days: 0 }, ...rs]);
    // a tela de sucesso (confete) é mostrada pelo próprio componente Reconhecer
  }
  function irPara(t) { setTab(t); }
  function openProfile(id) { setProfileId(id); setTab("perfil"); }
  function saveBio(id, bio) {
    setPeople((ps) => ps.map((p) => p.id === id ? { ...p, bio } : p));
    notify("Bio atualizada!", 2200);
  }
  // ---- Acesso (solicitar / aprovar) ----
  function solicitarAcesso(email, nome) {
    setSolicitacoes((s) => [{ id: Date.now(), nome: nome || email.split("@")[0], email, quando: "agora" }, ...s]);
  }
  function aprovarSolicitacao(id) {
    const s = solicitacoes.find((x) => x.id === id);
    if (!s) return;
    setAprovados((a) => [...a, s.email]);
    setSolicitacoes((ss) => ss.filter((x) => x.id !== id));
    notify(`${s.nome} aprovado! Já pode acessar.`);
  }
  function recusarSolicitacao(id) {
    setSolicitacoes((ss) => ss.filter((x) => x.id !== id));
    notify("Solicitação recusada.");
  }
  // ---- Gerenciar pessoas ----
  function addPessoa(nome, role, area) {
    const initials = nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    setPeople((ps) => [...ps, { id: Date.now(), name: nome, role: role || "Colaborador(a)", area: area || "Inteligência", initials, bio: "" }]);
    notify(`${nome} adicionado(a) ao time!`);
  }
  function removerPessoa(id) {
    if (id === ME) { notify("Você não pode remover a si mesmo."); return; }
    setPeople((ps) => ps.filter((p) => p.id !== id));
    setRecs((rs) => rs.filter((r) => r.toId !== id && r.fromId !== id));
    notify("Pessoa removida.");
  }
  function toggleAdmin(id) {
    setPeople((ps) => ps.map((p) => p.id === id ? { ...p, admin: !p.admin } : p));
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
    { id: "radar", label: "Radar", icon: Sparkles },
    { id: "mensagens", label: "Mensagens", icon: Mail },
    ...(souAdmin ? [{ id: "admin", label: "Admin", icon: Shield }] : []),
  ];

  // Tela de login aparece antes de tudo
  if (!logado) {
    return <Login onEntrar={() => setLogado(true)} aprovados={aprovados} solicitarAcesso={solicitarAcesso} />;
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif",
      minHeight: "100vh", color: C.text, overflowX: "hidden",
      background: `
        radial-gradient(1200px 600px at 80% -5%, rgba(255,112,32,0.18) 0%, transparent 55%),
        radial-gradient(1000px 500px at 0% 30%, rgba(255,112,32,0.10) 0%, transparent 50%),
        radial-gradient(800px 600px at 100% 100%, rgba(219,80,20,0.10) 0%, transparent 55%),
        linear-gradient(180deg, ${C.bg900} 0%, ${C.black} 100%)
      `,
      backgroundAttachment: "fixed", position: "relative" }}>
      {/* Textura de elos GOL ao fundo */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.07,
        backgroundImage: `url(${ASSETS.grafismoElos})`, backgroundSize: "560px", backgroundRepeat: "repeat",
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
        /* cascata: cada filho entra com leve atraso */
        .cascata > * { opacity: 0; animation: subir .5s ease forwards; }
        .cascata > *:nth-child(1){animation-delay:.04s}
        .cascata > *:nth-child(2){animation-delay:.10s}
        .cascata > *:nth-child(3){animation-delay:.16s}
        .cascata > *:nth-child(4){animation-delay:.22s}
        .cascata > *:nth-child(5){animation-delay:.28s}
        .cascata > *:nth-child(6){animation-delay:.34s}
        .cascata > *:nth-child(n+7){animation-delay:.40s}
        @keyframes subir { from {opacity:0; transform:translateY(16px);} to {opacity:1; transform:none;} }
        @keyframes pop { 0%{transform:scale(.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes confeteCai { 0%{transform:translateY(-20px) rotate(0);opacity:1} 100%{transform:translateY(380px) rotate(540deg);opacity:0} }
        @keyframes flutuar { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes flutuar2 { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-16px) rotate(4deg)} }
        @keyframes pulsarBrilho { 0%,100%{opacity:.5} 50%{opacity:.9} }
        @keyframes girar { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes brilhoBadge { 0%,100%{box-shadow:0 0 0 rgba(255,180,20,0)} 50%{box-shadow:0 0 16px rgba(255,180,20,0.5)} }
        .flutua { animation: flutuar 6s ease-in-out infinite; }
        .flutua2 { animation: flutuar2 8s ease-in-out infinite; }
        .pulsa { animation: pulsarBrilho 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .fade,.lift,.cascata>*,.flutua,.flutua2,.pulsa{animation:none;transition:none;opacity:1;} }
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
          <Sininho recs={recs} people={people} openProfile={openProfile} />
          <button onClick={() => openProfile(ME)} className="lift" style={{ marginLeft: 2 }} title="Meu perfil">
            <Avatar p={personById(ME, people)} size={38} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1600, margin: "0 auto", padding: "26px 22px 60px" }}>
        {tab === "home" && <Mural recs={recs} people={people} ranking={ranking} openProfile={openProfile}
          goReconhecer={() => setTab("reconhecer")}
          reacoes={reacoes} minhaReacao={minhaReacao} reagir={reagir} favoritos={favoritos} toggleFavorito={toggleFavorito} />}
        {tab === "reconhecer" && <Reconhecer people={people} onSend={addRec} irPara={irPara} />}
        {tab === "ranking" && <Ranking ranking={ranking} openProfile={openProfile} />}
        {tab === "hall" && <Hall hall={hall} />}
        {tab === "radar" && <Radar recs={recs} people={people} openProfile={openProfile} />}
        {tab === "mensagens" && <Mensagens recs={recs} people={people} openProfile={openProfile} />}
        {tab === "perfil" && <Perfil id={profileId} people={people} recs={recs} ranking={ranking}
          goReconhecer={() => setTab("reconhecer")} saveBio={saveBio}
          reacoes={reacoes} minhaReacao={minhaReacao} reagir={reagir} favoritos={favoritos} toggleFavorito={toggleFavorito} />}
        {tab === "admin" && souAdmin && <Admin recs={recs} people={people} cats={cats} ranking={ranking}
          removerRec={removerRec} mudarPeso={mudarPeso} fecharMes={() => fecharMes(ranking)}
          solicitacoes={solicitacoes} aprovarSolicitacao={aprovarSolicitacao} recusarSolicitacao={recusarSolicitacao}
          addPessoa={addPessoa} removerPessoa={removerPessoa} toggleAdmin={toggleAdmin} openProfile={openProfile} />}
      </main>

      {/* ---------- Rodapé ---------- */}
      <Rodape />
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
//  RODAPÉ
// ============================================================
function Rodape() {
  const [assErro, setAssErro] = useState(false);
  return (
    <footer style={{ position: "relative", borderTop: `1px solid ${C.stroke}`, marginTop: 40,
      background: `linear-gradient(180deg, transparent, ${C.bg900})` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 22px 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <EloMark size={26} />
            <span style={{ fontWeight: 800, fontSize: 16, color: C.white }}>Reconhecer</span>
          </div>
          <p style={{ fontSize: 12.5, color: C.textMute, margin: 0, maxWidth: 280, lineHeight: 1.5 }}>
            Programa de reconhecimento da Inteligência de Suprimentos. Um gesto simples vira destaque.
          </p>
        </div>

        {/* Assinatura da campanha (com fallback em texto) */}
        <div style={{ textAlign: "right" }}>
          {!assErro ? (
            <img src={ASSETS.assinatura} alt="Inteligência faz a gente voar" onError={() => setAssErro(true)}
              style={{ height: 34, width: "auto", opacity: 0.9, marginBottom: 8 }} />
          ) : (
            <div style={{ fontSize: 15, fontWeight: 800, color: C.orange, marginBottom: 8 }}>
              Inteligência faz a gente voar ✈
            </div>
          )}
          <div style={{ fontSize: 11.5, color: C.textDim }}>
            © {new Date().getFullYear()} GOL Linhas Aéreas · Inteligência de Suprimentos
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
//  SININHO DE NOTIFICAÇÕES
// ============================================================
function Sininho({ recs, people, openProfile }) {
  const [aberto, setAberto] = useState(false);
  // notificações = reconhecimentos que EU recebi
  const minhas = recs.filter((r) => r.toId === ME).sort((a, b) => a.days - b.days);
  const naoLidas = minhas.filter((r) => r.days <= 1).length;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setAberto((a) => !a)} className="lift" title="Notificações" style={{
        position: "relative", width: 40, height: 40, borderRadius: 11, marginLeft: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: aberto ? `${C.orange}1F` : "rgba(255,255,255,0.04)",
        border: `1px solid ${aberto ? C.orange + "55" : C.stroke}` }}>
        <Bell size={18} color={aberto ? C.orange : C.textMute} strokeWidth={2.3} />
        {naoLidas > 0 && (
          <span style={{ position: "absolute", top: 6, right: 6, minWidth: 16, height: 16,
            background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, borderRadius: 999,
            fontSize: 10, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center",
            justifyContent: "center", border: `2px solid ${C.bg900}`, padding: "0 3px" }}>{naoLidas}</span>
        )}
      </button>

      {aberto && (
        <>
          <div onClick={() => setAberto(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
          <div className="fade" style={{ position: "absolute", right: 0, top: 50, width: 340, zIndex: 50,
            background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`, borderRadius: 16,
            border: `1px solid ${C.strokeHi}`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.stroke}`,
              display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={16} color={C.orange} strokeWidth={2.5} />
              <span style={{ fontWeight: 750, fontSize: 14.5, color: C.white }}>Notificações</span>
            </div>
            {minhas.length === 0 ? (
              <div style={{ padding: "28px 16px", textAlign: "center", color: C.textMute, fontSize: 13.5 }}>
                <PartyPopper size={26} color={C.textDim} style={{ marginBottom: 8 }} /><br />
                Nenhum reconhecimento ainda. Continue brilhando! ✨
              </div>
            ) : (
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                {minhas.map((r) => {
                  const from = personById(r.fromId, people);
                  const cat = catById(r.cat);
                  return (
                    <button key={r.id} onClick={() => { openProfile(ME); setAberto(false); }} className="lift" style={{
                      display: "flex", alignItems: "flex-start", gap: 11, width: "100%", padding: "12px 16px",
                      borderBottom: `1px solid ${C.stroke}`, textAlign: "left" }}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <Avatar p={from} size={36} />
                        <span style={{ position: "absolute", bottom: -3, right: -3, width: 18, height: 18,
                          borderRadius: "50%", background: cat.color, display: "flex", alignItems: "center",
                          justifyContent: "center", border: `2px solid ${C.card}` }}>
                          <Heart size={9} color="#fff" fill="#fff" />
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>
                          <strong style={{ color: C.white }}>{from.name}</strong> te reconheceu em <strong style={{ color: cat.color }}>{cat.label}</strong>
                        </div>
                        <div style={{ fontSize: 11.5, color: C.textDim, marginTop: 2 }}>{timeAgo(r.days)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
//  DASHBOARD PESSOAL + RECONHECIMENTO EM NÚMEROS
// ============================================================
function DashboardPessoal({ recs, people, ranking }) {
  const eu = personById(ME, people);
  const meusStats = statsDe(ME, recs);
  const minhaPos = ranking.findIndex((r) => r.person.id === ME) + 1;
  const meusPontos = ranking.find((r) => r.person.id === ME)?.pts || 0;
  // categoria top que recebi
  const catsRecebidas = {};
  recs.filter((r) => r.toId === ME).forEach((r) => { catsRecebidas[r.cat] = (catsRecebidas[r.cat] || 0) + 1; });
  const topCatId = Object.entries(catsRecebidas).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topCat = topCatId ? catById(topCatId) : null;

  // Números do programa (todos)
  const totalRecs = recs.length;
  const pessoasReconhecidas = new Set(recs.map((r) => r.toId)).size;
  const totalCurtidas = recs.reduce((s, r) => s + r.likes, 0);
  const publicos = recs.filter((r) => r.public).length;
  const pctParticipacao = people.length ? Math.round((pessoasReconhecidas / people.length) * 100) : 0;

  return (
    <div style={{ marginBottom: 26 }}>
      {/* Saudação + meus números */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Card de boas-vindas pessoal */}
        <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.card}, ${C.bg800})`,
          borderRadius: 18, border: `1px solid ${C.stroke}`, padding: "22px 24px", boxShadow: "0 10px 36px rgba(0,0,0,0.3)" }}>
          <div className="pulsa" style={{ position: "absolute", right: "-10%", top: "-30%", width: 220, height: 220,
            background: `radial-gradient(circle, ${C.orangeGlow} 0%, transparent 65%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <Avatar p={eu} size={52} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.white, letterSpacing: "-0.01em" }}>
                Olá, {eu.name.split(" ")[0]} 👋
              </div>
              <div style={{ fontSize: 13, color: C.textMute }}>Veja seu mês de reconhecimentos</div>
            </div>
          </div>
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            <MiniStat icon={Heart} cor="#FF6B9D" valor={meusStats.recebidos} label="recebidos" />
            <MiniStat icon={Trophy} cor={C.gold} valor={meusPontos} label="pontos" />
            <MiniStat icon={TrendingUp} cor={C.orange} valor={minhaPos > 0 ? `#${minhaPos}` : "—"} label="ranking" />
            <MiniStat icon={topCat ? topCat.icon : Star} cor={topCat ? topCat.color : C.textMute}
              valor={meusStats.curtidasRecebidas} label="curtidas" />
          </div>
          {topCat && (
            <div style={{ position: "relative", marginTop: 14, fontSize: 12.5, color: C.textMute }}>
              Sua categoria de destaque: <span style={{ color: topCat.color, fontWeight: 700 }}>{topCat.label}</span>
            </div>
          )}
        </div>

        {/* Meta da equipe */}
        <MetaEquipe totalRecs={totalRecs} />
      </div>

      {/* Reconhecimento em números (faixa) */}
      <div style={{ background: `linear-gradient(180deg, ${C.bg800}, ${C.bg900})`, borderRadius: 18,
        border: `1px solid ${C.stroke}`, padding: "18px 24px" }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.orange, letterSpacing: "0.12em",
          textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>
          <Sparkles size={13} strokeWidth={2.6} /> O programa em números
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          <NumeroGrande icon={Heart} cor="#FF6B9D" valor={totalRecs} label="Reconhecimentos" />
          <NumeroGrande icon={Users} cor="#3BA7C4" valor={pessoasReconhecidas} label="Pessoas reconhecidas" />
          <NumeroGrande icon={Flame} cor={C.orange} valor={`${pctParticipacao}%`} label="Participação" />
          <NumeroGrande icon={TrendingUp} cor={C.gold} valor={totalCurtidas} label="Curtidas" />
          <NumeroGrande icon={BadgeCheck} cor="#B566D9" valor={publicos} label="Públicos" />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, cor, valor, label }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.22)", borderRadius: 12, padding: "11px 8px", textAlign: "center",
      border: `1px solid ${C.stroke}` }}>
      <Icon size={16} color={cor} strokeWidth={2.4} style={{ marginBottom: 5 }} />
      <div style={{ fontSize: 19, fontWeight: 800, color: C.white, lineHeight: 1 }}>{valor}</div>
      <div style={{ fontSize: 10.5, color: C.textMute, fontWeight: 600, marginTop: 3 }}>{label}</div>
    </div>
  );
}

function NumeroGrande({ icon: Icon, cor, valor, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, margin: "0 auto 8px",
        background: `${cor}1A`, border: `1px solid ${cor}40`,
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={19} color={cor} strokeWidth={2.4} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.white, lineHeight: 1 }}>{valor}</div>
      <div style={{ fontSize: 11.5, color: C.textMute, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function MetaEquipe({ totalRecs }) {
  const META = 30;
  const pct = Math.min(100, Math.round((totalRecs / META) * 100));
  const faltam = Math.max(0, META - totalRecs);
  return (
    <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.card}, ${C.bg800})`,
      borderRadius: 18, border: `1px solid ${C.stroke}`, padding: "22px 24px", boxShadow: "0 10px 36px rgba(0,0,0,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <Flame size={18} color={C.orange} strokeWidth={2.5} />
        <span style={{ fontWeight: 750, fontSize: 15, color: C.white }}>Meta da equipe</span>
        <span style={{ marginLeft: "auto", fontSize: 20, fontWeight: 800, color: C.orange }}>{pct}%</span>
      </div>
      <div style={{ height: 12, borderRadius: 999, background: "rgba(0,0,0,0.3)", overflow: "hidden", marginBottom: 12,
        border: `1px solid ${C.stroke}` }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999,
          background: `linear-gradient(90deg, ${C.orange}, ${C.gold})`, transition: "width .6s",
          boxShadow: `0 0 14px ${C.orangeGlow}` }} />
      </div>
      <div style={{ fontSize: 13, color: C.textMute, lineHeight: 1.5 }}>
        {faltam > 0
          ? <>Faltam <strong style={{ color: C.white }}>{faltam} reconhecimentos</strong> para bater a meta do mês!</>
          : <strong style={{ color: C.gold }}>Meta batida! Parabéns, time! 🎉</strong>}
      </div>
    </div>
  );
}

// ============================================================
//  MURAL
// ============================================================
function Mural({ recs, people, ranking, openProfile, goReconhecer, reacoes, minhaReacao, reagir, favoritos, toggleFavorito }) {
  const [heroErro, setHeroErro] = useState(false);
  const [tripErro, setTripErro] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroCat, setFiltroCat] = useState(null);
  const leader = ranking[0];

  const publicRecs = recs.filter((r) => r.public).filter((r) => {
    if (filtroCat && r.cat !== filtroCat) return false;
    if (busca.trim()) {
      const q = busca.toLowerCase();
      const from = personById(r.fromId, people);
      const to = personById(r.toId, people);
      return r.msg.toLowerCase().includes(q)
        || from?.name.toLowerCase().includes(q)
        || to?.name.toLowerCase().includes(q);
    }
    return true;
  });

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

      {/* Dashboard pessoal + Reconhecimento em números */}
      <DashboardPessoal recs={recs} people={people} ranking={ranking} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 750, margin: 0, color: C.white }}>Mural de reconhecimentos</h2>
            <span style={{ fontSize: 13, color: C.textMute, fontWeight: 600 }}>{publicRecs.length} {publicRecs.length === 1 ? "resultado" : "públicos"}</span>
          </div>

          {/* Busca + filtros */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <Search size={16} color={C.textDim} style={{ position: "absolute", left: 13, top: 13 }} />
              <input value={busca} onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou texto do reconhecimento..."
                style={{ ...inp, paddingLeft: 38, paddingRight: busca ? 38 : 14 }} />
              {busca && (
                <button onClick={() => setBusca("")} style={{ position: "absolute", right: 10, top: 10,
                  color: C.textMute, display: "flex" }}><X size={16} /></button>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setFiltroCat(null)} className="lift" style={{
                fontSize: 12.5, fontWeight: 700, padding: "6px 13px", borderRadius: 999,
                border: `1px solid ${!filtroCat ? C.orange : C.stroke}`,
                background: !filtroCat ? `${C.orange}1F` : "rgba(255,255,255,0.02)",
                color: !filtroCat ? C.orange : C.textMute }}>
                Todas
              </button>
              {CATEGORIES.map((c) => {
                const Icon = c.icon; const on = filtroCat === c.id;
                return (
                  <button key={c.id} onClick={() => setFiltroCat(on ? null : c.id)} className="lift" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 12.5, fontWeight: 700, padding: "6px 13px", borderRadius: 999,
                    border: `1px solid ${on ? c.color : C.stroke}`,
                    background: on ? `${c.color}22` : "rgba(255,255,255,0.02)",
                    color: on ? c.color : C.textMute }}>
                    <Icon size={13} strokeWidth={2.5} /> {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="cascata" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {publicRecs.length === 0 ? (
              <div style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`, borderRadius: 16,
                border: `1px dashed ${C.strokeHi}`, padding: 36, textAlign: "center", color: C.textMute, fontSize: 14 }}>
                <Search size={28} color={C.textDim} style={{ marginBottom: 10 }} /><br />
                Nenhum reconhecimento encontrado com esse filtro.
              </div>
            ) : (
              publicRecs.map((r) => (
                <RecCard key={r.id} rec={r} people={people} openProfile={openProfile}
                  reacoesRec={reacoes[r.id]} minhaReacaoRec={minhaReacao[r.id]} reagir={reagir}
                  favoritado={favoritos[r.id]} toggleFavorito={toggleFavorito} />
              ))
            )}
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

function RecCard({ rec, people, openProfile, reacoesRec, minhaReacaoRec, reagir, favoritado, toggleFavorito }) {
  const from = personById(rec.fromId, people);
  const to = personById(rec.toId, people);
  const [hoverReacoes, setHoverReacoes] = useState(false);
  // total de reações = curtidas originais (likes) + reações novas
  const totalReacoes = (rec.likes || 0) + Object.values(reacoesRec || {}).reduce((s, n) => s + n, 0);
  // emojis ativos (com contagem > 0)
  const emojisAtivos = REACOES.filter((re) => (reacoesRec?.[re.id] || 0) > 0);
  const minha = minhaReacaoRec ? REACOES.find((re) => re.id === minhaReacaoRec) : null;

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
        {/* Favoritar */}
        {toggleFavorito && (
          <button onClick={() => toggleFavorito(rec.id)} className="lift" title={favoritado ? "Remover dos favoritos" : "Favoritar"}
            style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
              background: favoritado ? `${C.gold}1F` : "transparent", border: `1px solid ${favoritado ? C.gold + "66" : "transparent"}` }}>
            <Star size={16} strokeWidth={2.4} fill={favoritado ? C.gold : "none"} color={favoritado ? C.gold : C.textDim} />
          </button>
        )}
        <div style={{ flexShrink: 0 }}><CatChip catId={rec.cat} /></div>
      </div>
      <div style={{ position: "relative", margin: "0 0 14px" }}>
        <Quote size={26} color={C.orange} fill={C.orange} strokeWidth={0}
          style={{ position: "absolute", left: 0, top: -6, opacity: 0.18 }} />
        <p style={{ margin: 0, paddingLeft: 34, fontSize: 15, lineHeight: 1.55, color: C.text,
          fontFamily: "'Inter',sans-serif" }}>{rec.msg}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Botão de reação com paleta no hover */}
        <div style={{ position: "relative" }} onMouseEnter={() => setHoverReacoes(true)} onMouseLeave={() => setHoverReacoes(false)}>
          <button onClick={() => reagir && reagir(rec.id, minha ? minha.id : "heart")} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 999,
            border: `1px solid ${minha ? C.orange + "66" : C.stroke}`,
            background: minha ? `${C.orange}1F` : "rgba(255,255,255,0.03)",
            color: minha ? C.orangeSoft : C.textMute, fontWeight: 650, fontSize: 13.5 }}>
            {minha ? <span style={{ fontSize: 15 }}>{minha.emoji}</span>
                   : <Heart size={16} strokeWidth={2.4} color={C.textMute} />}
            {totalReacoes > 0 ? totalReacoes : "Reagir"}
          </button>
          {/* Paleta de reações */}
          {hoverReacoes && reagir && (
            <div className="fade" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, zIndex: 30,
              display: "flex", gap: 3, padding: "7px 9px", background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`,
              border: `1px solid ${C.strokeHi}`, borderRadius: 999, boxShadow: "0 12px 36px rgba(0,0,0,0.5)" }}>
              {REACOES.map((re) => (
                <button key={re.id} onClick={() => { reagir(rec.id, re.id); setHoverReacoes(false); }}
                  title={re.label} className="lift" style={{ fontSize: 20, padding: "3px 5px", borderRadius: 8,
                    background: minhaReacaoRec === re.id ? `${C.orange}22` : "transparent", lineHeight: 1 }}>
                  {re.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Emojis ativos (resumo) */}
        {emojisAtivos.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {emojisAtivos.slice(0, 4).map((re) => (
              <span key={re.id} style={{ fontSize: 14 }} title={`${re.label}: ${reacoesRec[re.id]}`}>{re.emoji}</span>
            ))}
          </div>
        )}
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
function Reconhecer({ people, onSend, irPara }) {
  const [step, setStep] = useState(1);
  const [toId, setToId] = useState(null);
  const [cat, setCat] = useState(null);
  const [msg, setMsg] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [q, setQ] = useState("");
  const [enviado, setEnviado] = useState(false);

  const MIN = 9, MAX = 280;
  const options = people.filter((p) => p.id !== ME && p.name.toLowerCase().includes(q.toLowerCase()));
  const len = msg.trim().length;
  const canSend = toId && cat && len >= MIN;
  const alvo = personById(toId, people);

  function enviar() {
    onSend({ toId, cat, msg: msg.trim(), public: isPublic });
    setEnviado(true);
  }
  function reiniciar() {
    setStep(1); setToId(null); setCat(null); setMsg(""); setIsPublic(true); setQ(""); setEnviado(false);
  }

  // Tela de comemoração após enviar
  if (enviado && alvo) {
    return <SucessoReconhecimento alvo={alvo} cat={catById(cat)} isPublic={isPublic}
      irPara={irPara} reiniciar={reiniciar} />;
  }

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
            <textarea value={msg} onChange={(e) => setMsg(e.target.value.slice(0, MAX))} rows={4}
              placeholder="Seja específico: o que a pessoa fez e o impacto que gerou..."
              style={{ ...inp, resize: "vertical", fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              {/* barrinha de progresso do tamanho */}
              <div style={{ flex: 1, height: 5, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 999, transition: "width .2s, background .2s",
                  width: `${Math.min(100, (len / MIN) * 100)}%`,
                  background: len >= MIN ? `linear-gradient(90deg, ${C.orange}, ${C.orangeDeep})` : C.strokeHi }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                color: len >= MIN ? C.textMute : C.orange }}>
                {len < MIN ? `Faltam ${MIN - len}` : `${len}/${MAX}`}
              </span>
            </div>
            {len < MIN && (
              <div style={{ fontSize: 12, color: C.textDim, marginTop: 5 }}>Capriche um pouquinho mais — conte o impacto real.</div>
            )}
            <label style={{ ...lbl, marginTop: 20 }}>Visibilidade</label>
            <div style={{ display: "flex", gap: 11 }}>
              <VisBtn on={isPublic} onClick={() => setIsPublic(true)} icon={Users} title="Mural público" sub="Todo o time vê e pode curtir" />
              <VisBtn on={!isPublic} onClick={() => setIsPublic(false)} icon={Mail} title="Privado" sub="Só a pessoa recebe a mensagem" />
            </div>
            <NavRow back={() => setStep(2)} send={enviar} sendOk={canSend} />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Confete (comemoração) ----------
function Confete() {
  const cores = [C.orange, C.orangeSoft, C.gold, "#fff", C.orangeDeep];
  const pecas = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: 20 }}>
      {pecas.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const dur = 1.6 + Math.random() * 1.4;
        const size = 6 + Math.random() * 7;
        const cor = cores[i % cores.length];
        const redondo = Math.random() > 0.5;
        return (
          <span key={i} style={{ position: "absolute", top: -20, left: `${left}%`,
            width: size, height: size * (redondo ? 1 : 1.6),
            background: cor, borderRadius: redondo ? "50%" : 2,
            animation: `confeteCai ${dur}s ${delay}s ease-in forwards` }} />
        );
      })}
    </div>
  );
}

// ---------- Tela de sucesso ao reconhecer ----------
function SucessoReconhecimento({ alvo, cat, isPublic, irPara, reiniciar }) {
  const Icon = cat.icon;
  return (
    <div className="fade" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ position: "relative", background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`,
        borderRadius: 20, border: `1px solid ${C.strokeHi}`, padding: "48px 36px", textAlign: "center",
        overflow: "hidden", boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 50px ${C.orangeGlow}` }}>
        <Confete />
        {/* brilho central */}
        <div style={{ position: "absolute", left: "50%", top: "10%", width: 280, height: 220,
          transform: "translateX(-50%)", background: `radial-gradient(circle, ${C.orangeGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", margin: "0 auto 18px",
            background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 10px 30px ${C.orangeGlow}`, animation: "pop .5s ease" }}>
            <PartyPopper size={42} color="#fff" strokeWidth={2.2} />
          </div>
          <h1 style={{ fontSize: 25, fontWeight: 800, color: C.white, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Reconhecimento enviado! 🎉
          </h1>
          <p style={{ fontSize: 15, color: C.textMute, lineHeight: 1.55, margin: "0 0 22px" }}>
            Você reconheceu <strong style={{ color: C.white }}>{alvo.name}</strong> em{" "}
            <span style={{ color: cat.color, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, verticalAlign: "middle" }}>
              <Icon size={15} strokeWidth={2.5} /> {cat.label}
            </span>.
            <br />{isPublic ? "Já está no mural pra todo mundo ver e curtir." : "A mensagem foi enviada de forma privada."}
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "10px 18px",
            borderRadius: 999, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.stroke}`, marginBottom: 26 }}>
            <Avatar p={alvo} size={32} />
            <span style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{alvo.name} vai adorar! 🧡</span>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => irPara(isPublic ? "home" : "mensagens")} className="lift" style={{ ...btnPrimary }}>
              <Home size={16} strokeWidth={2.5} /> {isPublic ? "Ver no mural" : "Ver mensagens"}
            </button>
            <button onClick={reiniciar} className="lift" style={{ ...btnGhost }}>
              <Send size={15} strokeWidth={2.5} /> Reconhecer outra pessoa
            </button>
          </div>
        </div>
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
      <p style={{ color: C.textMute, fontSize: 15, margin: "0 0 28px", display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        Pontuação = peso da categoria + curtidas no mural (0,2 cada). Zera todo dia 1º.
        <Ajuda texto="Cada reconhecimento vale os pontos da categoria escolhida (Colaboração 1 · Entrega 2 · Inovação e Acima & Além 3). Cada curtida no mural soma 0,2. No dia 1º de cada mês o ranking zera e o 1º lugar vai pro Hall da Fama." />
      </p>

      {ranking.length === 0 ? (
        // Estado vazio bonito
        <div style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`, borderRadius: 20,
          border: `1px dashed ${C.strokeHi}`, padding: "56px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: "50%", top: "-20%", width: 320, height: 240,
            transform: "translateX(-50%)", background: `radial-gradient(circle, ${C.orangeGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <Trophy size={48} color={C.orange} strokeWidth={1.8} style={{ marginBottom: 16, opacity: 0.9 }} />
            <h2 style={{ fontSize: 19, fontWeight: 800, color: C.white, margin: "0 0 8px" }}>O ranking está esperando o primeiro herói</h2>
            <p style={{ fontSize: 14.5, color: C.textMute, lineHeight: 1.5, maxWidth: 380, margin: "0 auto" }}>
              Ainda não há reconhecimentos neste mês. Seja a primeira pessoa a reconhecer alguém e inaugure o pódio!
            </p>
          </div>
        </div>
      ) : (
      <>
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
      </>
      )}
    </div>
  );
}

// ============================================================
//  RADAR DA INTELIGÊNCIA (grafo de quem reconheceu quem)
// ============================================================
function Radar({ recs, people, openProfile }) {
  const [hover, setHover] = useState(null);
  // pessoas que aparecem (que enviaram ou receberam)
  const ativos = people.filter((p) => recs.some((r) => r.fromId === p.id || r.toId === p.id));
  const N = ativos.length;
  const W = 760, H = 540, cx = W / 2, cy = H / 2;
  const raio = Math.min(W, H) / 2 - 90;

  // posição de cada pessoa em círculo
  const pos = {};
  ativos.forEach((p, i) => {
    const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
    pos[p.id] = { x: cx + raio * Math.cos(ang), y: cy + raio * Math.sin(ang), p };
  });

  // arestas (quem reconheceu quem) - agrupa contagem
  const arestas = [];
  recs.forEach((r) => {
    if (pos[r.fromId] && pos[r.toId] && r.fromId !== r.toId) {
      const existente = arestas.find((a) => a.de === r.fromId && a.para === r.toId);
      if (existente) existente.peso++;
      else arestas.push({ de: r.fromId, para: r.toId, peso: 1 });
    }
  });

  // quantos reconhecimentos cada um recebeu (pra tamanho do nó)
  const recebidos = {};
  ativos.forEach((p) => { recebidos[p.id] = recs.filter((r) => r.toId === p.id).length; });
  const maxReceb = Math.max(1, ...Object.values(recebidos));

  const destacado = (pid) => hover && (hover === pid || arestas.some((a) =>
    (a.de === hover && a.para === pid) || (a.para === hover && a.de === pid)));

  return (
    <div className="fade">
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px", color: C.white,
        display: "flex", alignItems: "center", gap: 10 }}>
        <Sparkles size={24} color={C.orange} strokeWidth={2.4} /> Radar da Inteligência
      </h1>
      <p style={{ color: C.textMute, fontSize: 15, margin: "0 0 24px", display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        O mapa de colaboração do time: cada linha é um reconhecimento. Passe o mouse numa pessoa para destacar suas conexões.
        <Ajuda texto="Cada bolinha é uma pessoa. As linhas mostram quem reconheceu quem. Quanto maior a bolinha, mais reconhecimentos a pessoa recebeu. Quanto mais o time se reconhece, mais conectado fica o radar." />
      </p>

      <div style={{ background: `radial-gradient(circle at 50% 40%, ${C.bg800}, ${C.bg900})`, borderRadius: 20,
        border: `1px solid ${C.stroke}`, padding: 16, boxShadow: "0 16px 50px rgba(0,0,0,0.4)", overflow: "hidden" }}>
        {N === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: C.textMute }}>
            <Sparkles size={40} color={C.textDim} style={{ marginBottom: 12 }} /><br />
            Ainda não há conexões. Quando o time começar a se reconhecer, o radar ganha vida!
          </div>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
            {/* círculos de fundo decorativos */}
            {[raio, raio * 0.66, raio * 0.33].map((r, i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={C.stroke} strokeWidth="1" opacity="0.4" />
            ))}
            {/* linha central com brilho */}
            <circle cx={cx} cy={cy} r={raio} fill="none" stroke={C.orange} strokeWidth="1" opacity="0.15" />

            {/* arestas */}
            {arestas.map((a, i) => {
              const de = pos[a.de], para = pos[a.para];
              const ativo = destacado(a.de) && destacado(a.para) && hover;
              return (
                <line key={i} x1={de.x} y1={de.y} x2={para.x} y2={para.y}
                  stroke={ativo ? C.orange : C.strokeHi}
                  strokeWidth={ativo ? 2 + a.peso : 1 + a.peso * 0.5}
                  opacity={hover ? (ativo ? 0.9 : 0.12) : 0.4} style={{ transition: "all .2s" }} />
              );
            })}

            {/* nós (pessoas) */}
            {ativos.map((p) => {
              const { x, y } = pos[p.id];
              const tam = 16 + (recebidos[p.id] / maxReceb) * 16;
              const ativo = !hover || destacado(p.id);
              const ehLider = recebidos[p.id] === maxReceb && maxReceb > 0;
              return (
                <g key={p.id} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}
                  onClick={() => openProfile(p.id)} style={{ cursor: "pointer", transition: "opacity .2s" }}
                  opacity={ativo ? 1 : 0.3}>
                  {ehLider && <circle cx={x} cy={y} r={tam + 6} fill="none" stroke={C.gold} strokeWidth="2" opacity="0.5" />}
                  <circle cx={x} cy={y} r={tam} fill={`url(#grad${p.id})`}
                    stroke={p.id === ME ? C.white : (ehLider ? C.gold : C.orangeDeep)} strokeWidth={p.id === ME ? 2.5 : 1.5} />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                    fill="#fff" fontSize={tam * 0.62} fontWeight="700" style={{ pointerEvents: "none" }}>
                    {p.initials}
                  </text>
                  <text x={x} y={y + tam + 14} textAnchor="middle" fill={ativo ? C.text : C.textDim}
                    fontSize="12" fontWeight="600" style={{ pointerEvents: "none" }}>
                    {p.name.split(" ")[0]}
                  </text>
                  <defs>
                    <radialGradient id={`grad${p.id}`}>
                      <stop offset="0%" stopColor={p.id === ME ? C.graphite : C.orange} />
                      <stop offset="100%" stopColor={p.id === ME ? C.black : C.orangeDeep} />
                    </radialGradient>
                  </defs>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Legenda */}
      <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <LegendaRadar cor={C.gold} texto="Mais reconhecido" />
        <LegendaRadar cor={C.orange} texto="Bolinha maior = mais reconhecimentos" />
        <LegendaRadar cor={C.white} texto="Você" />
      </div>
    </div>
  );
}

function LegendaRadar({ cor, texto }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.textMute }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: cor, flexShrink: 0 }} />
      {texto}
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
function Perfil({ id, people, recs, ranking, goReconhecer, saveBio, reacoes, minhaReacao, reagir, favoritos, toggleFavorito }) {
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

      {/* Conquistas / Badges */}
      <SecaoConquistas id={id} recs={recs} />

      <h2 style={{ fontSize: 17, fontWeight: 750, margin: "0 0 14px", color: C.white }}>Reconhecimentos recebidos</h2>
      {received.length === 0 ? (
        <div style={{ color: C.textMute, fontSize: 14, background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`,
          borderRadius: 14, border: `1px dashed ${C.strokeHi}`, padding: 30, textAlign: "center" }}>
          Ainda sem reconhecimentos. Que tal ser o primeiro a reconhecer?
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {received.map((r) => (
            <RecCard key={r.id} rec={r} people={people} openProfile={() => {}}
              reacoesRec={reacoes[r.id]} minhaReacaoRec={minhaReacao[r.id]} reagir={reagir}
              favoritado={favoritos[r.id]} toggleFavorito={toggleFavorito} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Seção de Conquistas (badges) ----------
function SecaoConquistas({ id, recs }) {
  const badges = badgesDe(id, recs);
  const conquistadas = badges.filter((b) => b.conquistada);
  const bloqueadas = badges.filter((b) => !b.conquistada);

  return (
    <div style={{ marginBottom: 26 }}>
      <h2 style={{ fontSize: 17, fontWeight: 750, margin: "0 0 4px", color: C.white, display: "flex", alignItems: "center", gap: 9 }}>
        <Medal size={19} color={C.gold} strokeWidth={2.4} /> Conquistas
        <span style={{ fontSize: 13, color: C.textMute, fontWeight: 600 }}>({conquistadas.length}/{badges.length})</span>
      </h2>
      <p style={{ color: C.textMute, fontSize: 13.5, margin: "0 0 16px" }}>Medalhas desbloqueadas ao participar do programa.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {[...conquistadas, ...bloqueadas].map((b) => {
          const Icon = b.icon;
          const on = b.conquistada;
          return (
            <div key={b.id} className={on ? "lift" : ""} title={b.desc} style={{
              position: "relative", background: on ? `linear-gradient(180deg, ${C.card}, ${C.bg800})` : "rgba(255,255,255,0.02)",
              borderRadius: 14, border: `1px solid ${on ? b.cor + "55" : C.stroke}`, padding: "16px 14px",
              textAlign: "center", opacity: on ? 1 : 0.45, overflow: "hidden",
              animation: on ? "brilhoBadge 3s ease-in-out infinite" : "none" }}>
              {on && <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
                width: 80, height: 50, background: `radial-gradient(circle, ${b.cor}44 0%, transparent 70%)`, pointerEvents: "none" }} />}
              <div style={{ position: "relative", width: 46, height: 46, borderRadius: "50%", margin: "0 auto 10px",
                background: on ? `linear-gradient(135deg, ${b.cor}, ${b.cor}AA)` : "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: on ? `0 6px 18px ${b.cor}55` : "none" }}>
                {on ? <Icon size={22} color="#fff" strokeWidth={2.3} /> : <Lock size={18} color={C.textDim} />}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 750, color: on ? C.white : C.textMute, lineHeight: 1.3 }}>{b.nome}</div>
            </div>
          );
        })}
      </div>
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
function Login({ onEntrar, aprovados, solicitarAcesso }) {
  const [heroErro, setHeroErro] = useState(false);
  const [eloErro, setEloErro] = useState(false);
  const [cabecaErro, setCabecaErro] = useState(false);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [modo, setModo] = useState("entrar"); // entrar | solicitar
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function tentarEntrar() {
    setErro("");
    if (!emailValido) { setErro("Digite um e-mail válido."); return; }
    if (aprovados.includes(email.trim().toLowerCase())) {
      onEntrar();
    } else {
      setErro("Este e-mail ainda não tem acesso. Solicite abaixo.");
      setModo("solicitar");
    }
  }
  function enviarSolicitacao() {
    setErro("");
    if (!emailValido) { setErro("Digite um e-mail válido."); return; }
    if (!nome.trim()) { setErro("Digite seu nome."); return; }
    solicitarAcesso(email.trim().toLowerCase(), nome.trim());
    setEnviado(true);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", position: "relative", overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans','Inter',system-ui,sans-serif", background: C.black }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        html, body, #root { margin:0; padding:0; background:${C.black}; }
        button { font-family: inherit; cursor: pointer; border: none; }
        input { font-family: inherit; }
        input::placeholder { color: ${C.textDim}; }
        input:focus { outline: none; border-color: ${C.orange} !important; }
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
      <div style={{ position: "absolute", inset: 0,
        background: `radial-gradient(900px 600px at 75% 30%, rgba(255,112,32,0.25) 0%, transparent 60%), linear-gradient(120deg, ${C.black}F2 0%, ${C.black}E8 50%, rgba(219,80,20,0.25) 130%)` }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none",
        backgroundImage: `url(${ASSETS.grafismoElos})`, backgroundSize: "500px", backgroundRepeat: "repeat", mixBlendMode: "screen" }} />
      {!eloErro && (
        <img src={ASSETS.elo} alt="" onError={() => setEloErro(true)}
          style={{ position: "absolute", right: "-6%", bottom: "-10%", width: 420, opacity: 0.12,
            animation: "float 6s ease-in-out infinite", pointerEvents: "none" }} />
      )}

      {/* Card central de login */}
      <div className="fade" style={{ position: "relative", margin: "auto", width: "100%", maxWidth: 440, padding: "0 22px" }}>
        <div style={{ background: `linear-gradient(180deg, ${C.card}EE, ${C.bg800}EE)`, backdropFilter: "blur(16px)",
          borderRadius: 24, border: `1px solid ${C.strokeHi}`, padding: "38px 34px",
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${C.orangeGlow}` }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            {!eloErro && <img src={ASSETS.elo} alt="GOL" style={{ height: 38 }} onError={() => setEloErro(true)} />}
            {!cabecaErro && <img src={ASSETS.cabeca} alt="" style={{ height: 36, filter: "drop-shadow(0 0 6px rgba(255,112,32,0.4))" }} onError={() => setCabecaErro(true)} />}
          </div>
          <h1 style={{ textAlign: "center", fontSize: 27, fontWeight: 800, color: C.white, margin: "8px 0 2px", letterSpacing: "-0.02em" }}>
            Reconhecer
          </h1>
          <p style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, color: C.orange, letterSpacing: "0.16em", margin: "0 0 18px" }}>
            INTELIGÊNCIA · COMPRAS
          </p>

          {enviado ? (
            // ---- Confirmação de solicitação enviada ----
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
                background: `${C.orange}22`, border: `1px solid ${C.orange}55`,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Check size={28} color={C.orange} strokeWidth={2.6} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 17, color: C.white, marginBottom: 8 }}>Solicitação enviada!</div>
              <p style={{ fontSize: 13.5, color: C.textMute, lineHeight: 1.5, margin: "0 0 20px" }}>
                A Inteligência vai revisar seu pedido. Assim que aprovado, você entra direto com <strong style={{ color: C.text }}>{email}</strong>.
              </p>
              <button onClick={() => { setEnviado(false); setModo("entrar"); setEmail(""); setNome(""); }}
                className="lift" style={{ ...btnGhost, width: "100%", justifyContent: "center" }}>
                Voltar
              </button>
            </div>
          ) : (
            <>
              <p style={{ textAlign: "center", fontSize: 13.5, color: C.textMute, lineHeight: 1.5, margin: "0 0 20px" }}>
                {modo === "entrar"
                  ? "Entre com seu e-mail corporativo para reconhecer quem faz a diferença."
                  : "Primeiro acesso? Solicite sua entrada e a Inteligência aprova."}
              </p>

              {/* Campo nome (só no modo solicitar) */}
              {modo === "solicitar" && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ position: "relative" }}>
                    <Users size={16} color={C.textDim} style={{ position: "absolute", left: 13, top: 14 }} />
                    <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo"
                      style={{ ...loginInp, paddingLeft: 38 }} />
                  </div>
                </div>
              )}

              {/* Campo e-mail */}
              <div style={{ position: "relative", marginBottom: erro ? 8 : 16 }}>
                <Mail size={16} color={C.textDim} style={{ position: "absolute", left: 13, top: 14 }} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu.nome@voegol.com.br"
                  type="email" style={{ ...loginInp, paddingLeft: 38 }}
                  onKeyDown={(e) => { if (e.key === "Enter") (modo === "entrar" ? tentarEntrar() : enviarSolicitacao()); }} />
              </div>

              {erro && (
                <div style={{ fontSize: 12.5, color: "#FF8A8A", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <Bell size={13} /> {erro}
                </div>
              )}

              {modo === "entrar" ? (
                <>
                  <button onClick={tentarEntrar} className="lift" style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, color: C.white,
                    fontWeight: 700, fontSize: 15, padding: "13px", borderRadius: 12,
                    boxShadow: `0 10px 30px ${C.orangeGlow}` }}>
                    <ArrowRight size={17} strokeWidth={2.6} /> Entrar
                  </button>
                  <button onClick={() => { setModo("solicitar"); setErro(""); }} style={{
                    width: "100%", marginTop: 10, background: "transparent", color: C.textMute,
                    fontWeight: 600, fontSize: 13, padding: "8px" }}>
                    Primeiro acesso? <span style={{ color: C.orange, fontWeight: 700 }}>Solicitar acesso</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={enviarSolicitacao} className="lift" style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, color: C.white,
                    fontWeight: 700, fontSize: 15, padding: "13px", borderRadius: 12,
                    boxShadow: `0 10px 30px ${C.orangeGlow}` }}>
                    <Send size={16} strokeWidth={2.6} /> Solicitar acesso
                  </button>
                  <button onClick={() => { setModo("entrar"); setErro(""); }} style={{
                    width: "100%", marginTop: 10, background: "transparent", color: C.textMute,
                    fontWeight: 600, fontSize: 13, padding: "8px" }}>
                    Já tenho acesso? <span style={{ color: C.orange, fontWeight: 700 }}>Entrar</span>
                  </button>
                </>
              )}
            </>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, justifyContent: "center" }}>
            <Lock size={13} color={C.textDim} />
            <span style={{ fontSize: 11.5, color: C.textDim }}>Acesso exclusivo para colaboradores GOL</span>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11.5, color: C.textDim, marginTop: 18 }}>
          Inteligência · Compras · GOL Linhas Aéreas
        </p>
      </div>
    </div>
  );
}

const loginInp = { width: "100%", padding: "12px 14px", borderRadius: 11, border: `1.5px solid ${C.stroke}`,
  fontSize: 14, color: C.text, background: "rgba(0,0,0,0.35)" };

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
function Admin({ recs, people, cats, ranking, removerRec, mudarPeso, fecharMes,
  solicitacoes, aprovarSolicitacao, recusarSolicitacao, addPessoa, removerPessoa, toggleAdmin, openProfile }) {
  const [confirmar, setConfirmar] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoRole, setNovoRole] = useState("");
  const publicRecs = recs.filter((r) => r.public);
  const campeao = ranking[0];

  // Estatísticas
  const totalLikes = recs.reduce((s, r) => s + r.likes, 0);
  const porCategoria = cats.map((c) => ({ ...c, n: recs.filter((r) => r.cat === c.id).length }));
  const maxCat = Math.max(1, ...porCategoria.map((c) => c.n));
  const semReconhecimento = people.filter((p) => p.id !== ME && !recs.some((r) => r.toId === p.id));

  return (
    <div className="fade" style={{ maxWidth: 920, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px", color: C.white,
        display: "flex", alignItems: "center", gap: 10 }}>
        <Shield size={24} color={C.orange} strokeWidth={2.4} /> Painel da Inteligência
      </h1>
      <p style={{ color: C.textMute, fontSize: 15, margin: "0 0 26px" }}>
        Área restrita. Gerencie cadastros, pessoas, pontuações e modere o mural.
      </p>

      {/* Cards de resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <AdminStat icon={Send} label="Reconhecimentos" value={recs.length} />
        <AdminStat icon={Users} label="Pessoas ativas" value={people.length} />
        <AdminStat icon={Heart} label="Curtidas totais" value={totalLikes} />
        <AdminStat icon={Bell} label="Cadastros pendentes" value={solicitacoes.length} destaque={solicitacoes.length > 0} />
      </div>

      {/* Solicitações de cadastro */}
      <AdminCard title="Solicitações de acesso" icon={BadgeCheck} badge={solicitacoes.length}>
        <p style={{ color: C.textMute, fontSize: 14, margin: "0 0 16px" }}>
          Pessoas que pediram acesso ao site. Aprove para liberar a entrada direta.
        </p>
        {solicitacoes.length === 0 ? (
          <div style={{ color: C.textDim, fontSize: 14, fontStyle: "italic", display: "flex", alignItems: "center", gap: 8 }}>
            <Check size={15} color={C.textDim} /> Nenhuma solicitação pendente.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {solicitacoes.map((s) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                background: "rgba(0,0,0,0.25)", borderRadius: 12, border: `1px solid ${C.stroke}` }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                  {s.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{s.nome}</div>
                  <div style={{ fontSize: 12.5, color: C.textMute }}>{s.email} · {s.quando}</div>
                </div>
                <button onClick={() => aprovarSolicitacao(s.id)} className="lift" style={{
                  display: "flex", alignItems: "center", gap: 6, color: "#fff", fontWeight: 700, fontSize: 13,
                  background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
                  padding: "8px 14px", borderRadius: 9, boxShadow: `0 4px 14px ${C.orangeGlow}` }}>
                  <Check size={14} strokeWidth={2.6} /> Aprovar
                </button>
                <button onClick={() => recusarSolicitacao(s.id)} className="lift" title="Recusar" style={{
                  display: "flex", alignItems: "center", color: C.textMute, fontWeight: 650, fontSize: 13,
                  background: "rgba(255,255,255,0.05)", border: `1px solid ${C.stroke}`,
                  padding: "8px 10px", borderRadius: 9 }}>
                  <X size={15} strokeWidth={2.4} />
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Estatísticas */}
      <AdminCard title="Estatísticas do programa" icon={TrendingUp}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          {/* Reconhecimentos por categoria */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Por categoria</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {porCategoria.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.id}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: c.color, fontWeight: 700 }}>
                        <Icon size={13} strokeWidth={2.5} /> {c.label}
                      </span>
                      <span style={{ fontSize: 12.5, color: C.textMute, fontWeight: 700 }}>{c.n}</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(c.n / maxCat) * 100}%`,
                        background: `linear-gradient(90deg, ${c.color}, ${c.color}AA)`, borderRadius: 999, transition: "width .4s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Quem ainda não foi reconhecido */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Flame size={14} color={C.orange} /> Ainda sem reconhecimento
            </div>
            {semReconhecimento.length === 0 ? (
              <div style={{ fontSize: 13, color: C.textDim, fontStyle: "italic" }}>Todo mundo já foi reconhecido! 🎉</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {semReconhecimento.map((p) => (
                  <button key={p.id} onClick={() => openProfile(p.id)} className="lift" style={{
                    display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(0,0,0,0.25)",
                    border: `1px solid ${C.stroke}`, borderRadius: 999, padding: "5px 11px 5px 5px" }}>
                    <Avatar p={p} size={24} />
                    <span style={{ fontSize: 12.5, color: C.text, fontWeight: 600 }}>{p.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            )}
            <p style={{ fontSize: 12, color: C.textDim, marginTop: 14, lineHeight: 1.5 }}>
              Que tal incentivar reconhecimentos para essas pessoas? Ninguém deve ficar de fora.
            </p>
          </div>
        </div>
      </AdminCard>

      {/* Gerenciar pessoas */}
      <AdminCard title="Gerenciar pessoas" icon={Users}>
        <p style={{ color: C.textMute, fontSize: 14, margin: "0 0 14px" }}>
          Adicione, promova a admin ou remova pessoas do programa.
        </p>
        {/* Adicionar pessoa */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Nome da pessoa"
            style={{ ...inp, flex: 2, minWidth: 140 }} />
          <input value={novoRole} onChange={(e) => setNovoRole(e.target.value)} placeholder="Cargo (opcional)"
            style={{ ...inp, flex: 2, minWidth: 140 }} />
          <button onClick={() => { if (novoNome.trim()) { addPessoa(novoNome.trim(), novoRole.trim()); setNovoNome(""); setNovoRole(""); } }}
            className="lift" style={{ ...btnPrimary, flexShrink: 0 }}>
            <Users size={15} strokeWidth={2.5} /> Adicionar
          </button>
        </div>
        {/* Lista de pessoas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {people.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px",
              background: "rgba(0,0,0,0.22)", borderRadius: 11, border: `1px solid ${C.stroke}` }}>
              <Avatar p={p} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.white, display: "flex", alignItems: "center", gap: 7 }}>
                  {p.name}
                  {p.admin && <span style={{ fontSize: 10, fontWeight: 700, color: C.orange, background: `${C.orange}1F`,
                    border: `1px solid ${C.orange}44`, padding: "1px 7px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <Shield size={9} strokeWidth={2.6} /> ADMIN</span>}
                </div>
                <div style={{ fontSize: 12, color: C.textMute }}>{p.role} · {p.area}</div>
              </div>
              <button onClick={() => toggleAdmin(p.id)} className="lift" title={p.admin ? "Remover admin" : "Tornar admin"} style={{
                display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 650,
                color: p.admin ? C.orange : C.textMute, background: "rgba(255,255,255,0.04)",
                border: `1px solid ${C.stroke}`, padding: "6px 10px", borderRadius: 8 }}>
                <Shield size={12} strokeWidth={2.4} /> {p.admin ? "Admin" : "Tornar admin"}
              </button>
              <button onClick={() => removerPessoa(p.id)} className="lift" title="Remover" style={{
                display: "flex", alignItems: "center", color: "#FF6B6B",
                background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.25)",
                padding: "6px 9px", borderRadius: 8 }}>
                <Trash2 size={13} strokeWidth={2.4} />
              </button>
            </div>
          ))}
        </div>
      </AdminCard>

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

function AdminStat({ icon: Icon, label, value, destaque }) {
  return (
    <div style={{ background: destaque ? `linear-gradient(180deg, ${C.orange}22, ${C.bg800})` : `linear-gradient(180deg, ${C.card}, ${C.bg800})`,
      borderRadius: 14, border: `1px solid ${destaque ? C.orange + "55" : C.stroke}`, padding: "16px 18px" }}>
      <Icon size={18} color={C.orange} strokeWidth={2.4} />
      <div style={{ fontSize: 22, fontWeight: 800, color: C.white, marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.textMute, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function AdminCard({ title, icon: Icon, children, badge }) {
  return (
    <div style={{ background: `linear-gradient(180deg, ${C.card}, ${C.bg800})`, borderRadius: 18,
      border: `1px solid ${C.stroke}`, padding: 22, marginBottom: 18, boxShadow: "0 8px 28px rgba(0,0,0,0.25)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <Icon size={18} color={C.orange} strokeWidth={2.5} />
        <h3 style={{ fontSize: 16, fontWeight: 750, margin: 0, color: C.white }}>{title}</h3>
        {badge > 0 && (
          <span style={{ marginLeft: 2, fontSize: 11, fontWeight: 800, color: "#fff",
            background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, minWidth: 20, height: 20,
            borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>
            {badge}
          </span>
        )}
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