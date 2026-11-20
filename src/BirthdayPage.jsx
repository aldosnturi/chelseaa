import { useState, useRef, useEffect, useMemo } from "react";

/* ====== UBAH BAGIAN INI ====== */
const NAMA = "Chelsea";
const UMUR = 20;
const DARI = "pacarmu si aldo jahattt";
const SURAT = `Thankyou udah hadir dihidup aku, mau dengerin ceritaku yang nggak penting, dan tetap ada di saat aku lagi gaje. Selamat masuk usia 20, semoga makin bahagia, makin cantik, makin sehat, dan semua doamu dikabulkan. Aku sayang kamu, banget.`;
const ALASAN = [
  "senyummu bikin kepikiran.",
  "kamuu lucu dan gemesin.",
  "cara kamu ngobrol itu nyaman banget buat aku.",
  "kamu cantik, tapi yang bikin jatuh hati itu adalah cara pikir kmu.",
  "bareng kamu, aku yakin hal biasa jadi terasa seru.",
  "karena kamu adalah kamu. titik.",
];
const KUPON = [
  "kupon traktir makan apa aja (maks. 1x)",
  "kupon discord sepanjang malam",
  "kupon nonton film pilihan chelsea",
  "kupon kebal dari debat 'gamauuuu' 1 hari",
  "kupon es krim kapan pun diminta",
  "kupon misterius disaat ketemu nanti",
];

/* ====== FOTO ======
   1. Taruh semua foto di folder  public/foto/
   2. Cukup ganti nama file + caption di bawah ini.
   Tambah/hapus baris sesuka kamu. */
const FOLDER = "public/img/";
const FOTO_UTAMA = "logo.jpeg"; // foto bulat di bagian atas (isi "" kalau tidak mau)
const FOTO = [
  { file: "pap.jpeg", cap: "pertama kali kamu kasih pap ke aku" },
  { file: "cantik.jpeg", cap: "ini foto cantik bangetttt" },
  { file: "lucu.jpeg", cap: "kamu lucu bangett di sini" },
  { file: "fav.jpeg", cap: "favorit aku" },
];
/* ============================= */

const PAL = ["#FF6FB5", "#8B5CFF", "#52E1FF", "#FFD27A", "#FFFFFF", "#9CFFD9"];
const BALLOON = ["#FF6FB5", "#8B5CFF", "#52E1FF", "#FFD27A", "#9CFFD9", "#FF9A6B"];

const Heart = ({ size = 40, c = "#FF6FB5", className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 29C4 20 2 11 8 7c4-3 8 0 8 3 0-3 4-6 8-3 6 4 4 13-8 22z" fill={c} />
  </svg>
);

function Reveal({ children, className = "" }) {
  const r = useRef(), [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => e.isIntersecting && (setV(true), o.disconnect()), { threshold: 0.2 });
    o.observe(r.current);
    return () => o.disconnect();
  }, []);
  return <section ref={r} className={`sec ${className} ${v ? "in" : ""}`}>{children}</section>;
}

function useDodge(limit) {
  const [d, set] = useState({ x: 0, y: 0, n: 0 });
  const go = () => d.n < limit && set({ x: (Math.random() - 0.5) * 240, y: (Math.random() - 0.5) * 150, n: d.n + 1 });
  return { n: d.n, style: { transform: d.n < limit ? `translate(${d.x}px,${d.y}px)` : "none" }, on: { onMouseEnter: go, onTouchStart: go }, reset: () => set({ x: 0, y: 0, n: 0 }) };
}

function Letter() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v >= SURAT.length ? (clearInterval(t), v) : v + 1)), 30);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="glass letter">
      <p>{SURAT.slice(0, i)}<span className="caret" /></p>
      {i >= SURAT.length && <p className="sign">— {DARI}</p>}
    </div>
  );
}

export default function BirthdayPage() {
  const cv = useRef(), ps = useRef([]);
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const [popped, setPopped] = useState([]);
  const [lit, setLit] = useState(true);
  const [taps, setTaps] = useState(0);
  const [kupon, setKupon] = useState(null);
  const [ans, setAns] = useState(null);
  const [letter, setLetter] = useState(false);
  const [zoom, setZoom] = useState(null);
  const no = useDodge(99), dont = useDodge(6);
  const stars = useMemo(() => Array.from({ length: 70 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: 1 + Math.random() * 2, d: Math.random() * 4 })), []);

  const boom = (x, y, n = 60) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = 1.5 + Math.random() * 6, l = 55 + Math.random() * 45;
      ps.current.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, l, m: l, c: PAL[(Math.random() * PAL.length) | 0], h: Math.random() < 0.25, r: 1.5 + Math.random() * 2.5 });
    }
  };
  const at = (e, n) => { const r = e.currentTarget.getBoundingClientRect(); boom(r.left + r.width / 2, r.top + r.height / 2, n); };
  const finale = (k = 6) => { for (let i = 0; i < k; i++) setTimeout(() => boom(innerWidth * (0.15 + Math.random() * 0.7), innerHeight * (0.15 + Math.random() * 0.4), 80), i * 260); };

  useEffect(() => {
    const c = cv.current, g = c.getContext("2d");
    const fit = () => { c.width = innerWidth; c.height = innerHeight; };
    fit(); addEventListener("resize", fit);
    let raf;
    const loop = () => {
      g.clearRect(0, 0, c.width, c.height);
      g.globalCompositeOperation = "lighter";
      ps.current = ps.current.filter((p) => p.l > 0);
      for (const p of ps.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.vx *= 0.985; p.l--;
        g.globalAlpha = Math.max(p.l / p.m, 0); g.fillStyle = p.c;
        if (p.h) { g.font = `${p.r * 6}px serif`; g.fillText("♥", p.x, p.y); }
        else { g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill(); }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", fit); };
  }, []);

  const unlock = (e) => { at(e, 90); finale(); setOpen(true); setTimeout(() => setGone(true), 1100); };
  const pop = (i, e) => { if (popped.includes(i)) return; at(e, 40); setPopped([...popped, i]); if (popped.length === 5) finale(4); };
  const tapGift = (e) => {
    const n = taps + 1; setTaps(n);
    if (n % 3 === 0) { at(e, 100); setKupon(KUPON[(Math.random() * KUPON.length) | 0]); } else setKupon(null);
  };
  const last = popped[popped.length - 1];

  return (
    <div className="bp" onPointerDown={(e) => boom(e.clientX, e.clientY, 14)}>
      <style>{css}</style>
      <canvas ref={cv} className="fx" />
      <div className="sky" aria-hidden="true">
        <i className="blob a" /><i className="blob b" /><i className="blob c" />
        {stars.map((s, i) => <b key={i} className="star" style={{ left: s.x + "%", top: s.y + "%", width: s.s, height: s.s, animationDelay: s.d + "s" }} />)}
      </div>

      {!gone && (
        <div className={"gate" + (open ? " out" : "")}>
          <Heart size={96} className="beat glow" />
          <h2>Ada kejutan khusus<br />untuk {NAMA}</h2>
          <button className="btn gold" onClick={unlock}>Buka kejutannya</button>
        </div>
      )}

      <header className="hero">
        <p className="kicker">Happy 20th birthday sayangkuu</p>
        {FOTO_UTAMA && <img className="heroimg" src={FOLDER + FOTO_UTAMA} alt={NAMA} />}
        <h1 aria-label={NAMA}>{NAMA.split("").map((ch, i) => <span key={i} style={{ animationDelay: i * 0.09 + "s" }}>{ch}</span>)}</h1>
        <div className="age"><span>{UMUR}</span><em>tahun</em></div>
        <p className="lead">Hari ini harinya kamu. ada sikit kejutan kecil di bawah, scroll aja.</p>
        <div className="scroll" aria-hidden="true" />
      </header>

      <Reveal>
        <h2>Pecahin balonnya</h2>
        <p className="small">setiap balon ada alasan kenapa aku sayang kamu. ({popped.length}/6)</p>
        <div className="balloons">
          {BALLOON.map((c, i) => (
            <button key={i} className={"bl" + (popped.includes(i) ? " gone" : "")} style={{ "--c": c, animationDelay: i * 0.4 + "s" }} onClick={(e) => pop(i, e)} aria-label={`Balon ${i + 1}`} />
          ))}
        </div>
        <div className="glass note">{last === undefined ? "Ketuk balon pertama..." : ALASAN[last]}</div>
      </Reveal>

      {FOTO.length > 0 && (
        <Reveal>
          <h2>Favorite Part About U</h2>
          <p className="small">beberapa momen singkat yang aku simpan di hati. ketuk fotonya buat memperbesar.</p>
          <div className="gallery">
            {FOTO.map((f, i) => (
              <figure key={i} className="polaroid" style={{ "--r": (i % 2 ? 3 : -3) + "deg" }} onClick={() => setZoom(i)}>
                <img src={FOLDER + f.file} alt={f.cap} loading="lazy" />
                <figcaption>{f.cap}</figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal>
        <h2>Make a wish</h2>
        <svg viewBox="0 0 240 230" className="cake" aria-hidden="true">
          <ellipse cx="120" cy="216" rx="108" ry="12" fill="#ffffff22" />
          <rect x="22" y="140" width="196" height="72" rx="16" fill="#FF9A6B" />
          <rect x="52" y="86" width="136" height="58" rx="14" fill="#FF6FB5" />
          <path d="M22 156q12 20 24 0t24 0 24 0 24 0 24 0 24 0 24 0 24 0v-6a16 16 0 0 0-16-16H38a16 16 0 0 0-16 16z" fill="#FFF3FA" />
          <path d="M52 102q11 18 22 0t22 0 22 0 22 0 22 0 6-4v-4a14 14 0 0 0-14-14H66a14 14 0 0 0-14 14z" fill="#FFF3FA" />
          {[88, 120, 152].map((x, i) => (
            <g key={x}>
              <rect x={x - 6} y="46" width="12" height="40" rx="3" fill={["#52E1FF", "#FFD27A", "#9CFFD9"][i]} />
              <path className={"fl" + (lit ? "" : " off")} d={`M${x} 16c10 11 9 22 0 26-9-4-10-15 0-26z`} fill="#FFD27A" />
            </g>
          ))}
        </svg>
        <button className="btn" onClick={(e) => { if (lit) at(e, 80); setLit(!lit); }}>{lit ? "Tiup lilinnya" : "Nyalain lagi"}</button>
        <p className="small">{lit ? "Pejamkan mata, bikin satu permintaan..." : "Semoga terkabul semua!"}</p>
      </Reveal>

      <Reveal>
        <h2>kado dari aku</h2>
        <button className={"gift" + (!kupon && taps ? " wob" : "")} key={taps} onClick={tapGift} aria-label="Buka kado">
          <svg viewBox="0 0 140 150" width="170" aria-hidden="true">
            <rect x="20" y="64" width="100" height="76" rx="8" fill="#FF6FB5" />
            <rect x="62" y="64" width="16" height="76" fill="#FFD27A" />
            <g className={"lid" + (kupon ? " up" : "")}>
              <rect x="12" y="42" width="116" height="26" rx="8" fill="#8B5CFF" />
              <rect x="62" y="42" width="16" height="26" fill="#FFD27A" />
              <path d="M70 42C50 10 28 24 44 38zM70 42C90 10 112 24 96 38z" fill="#FFD27A" />
            </g>
          </svg>
        </button>
        <p className="small">{kupon ? "Kamu dapat:" : taps === 0 ? "Ketuk kadonya 3 kali" : `Lagi dibuka... (${taps % 3}/3)`}</p>
        {kupon && <div className="glass note gold">{kupon}</div>}
      </Reveal>

      <Reveal>
        <h2>Pertanyaan penting</h2>
        {ans === null ? (
          <>
            <p className="small">Kamu sayang aku nggak?</p>
            <div className="row">
              <button className="btn pink" style={{ transform: `scale(${1 + no.n * 0.22})` }} onClick={(e) => { at(e, 120); finale(3); setAns("ya"); }}>Sayang banget</button>
              <button className="btn ghost" style={no.style} {...no.on} onClick={() => setAns("tidak")}>Nggak</button>
            </div>
          </>
        ) : ans === "ya" ? (
          <div className="glass note gold">Aku juga! Jawaban yang benar.</div>
        ) : (
          <>
            <div className="glass note">Eh? Kok kepencet? Coba lagi ya.</div>
            <button className="btn" onClick={() => setAns(null)}>Ulangi pertanyaan</button>
          </>
        )}
      </Reveal>

      <Reveal>
        <h2>Jangan diklik!</h2>
        <button className="btn danger" style={dont.style} {...dont.on} onClick={(e) => at(e, 140)}>
          {dont.n < 6 ? "JANGAN KLIK" : "Yaudah deh, klik aja"}
        </button>
        <p className="small">{dont.n === 0 ? "Serius, jangan." : dont.n < 6 ? `Udah coba ${dont.n}x. Bandel.` : "Kamu menang. Kamu selalu menang."}</p>
      </Reveal>

      <Reveal className="end">
        <Heart size={56} className="beat glow" />
        <h2>Satu hal lagi</h2>
        <button className="btn gold" onClick={(e) => { if (!letter) { at(e, 100); finale(4); } setLetter(!letter); }}>{letter ? "Tutup surat" : "Buka surat terakhir"}</button>
        {letter && <Letter />}
      </Reveal>

      {zoom !== null && (
        <div className="lightbox" onClick={() => setZoom(null)} role="dialog" aria-label="Foto diperbesar">
          <figure>
            <img src={FOLDER + FOTO[zoom].file} alt={FOTO[zoom].cap} />
            <figcaption>{FOTO[zoom].cap}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,800;1,900&family=Outfit:wght@400;600;700&display=swap');
.bp{font-family:'Outfit',system-ui,sans-serif;color:#F6EEFF;background:#0E0620;min-height:100vh;overflow-x:hidden;text-align:center;position:relative}
.bp *{box-sizing:border-box}
.bp h1,.bp h2,.age span{font-family:'Playfair Display',serif;font-style:italic;font-weight:900;margin:0}
.fx{position:fixed;inset:0;z-index:200;pointer-events:none}
.sky{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.blob{position:absolute;width:60vmax;height:60vmax;border-radius:50%;filter:blur(90px);opacity:.5;animation:drift 18s ease-in-out infinite alternate}
.blob.a{background:#8B5CFF;left:-20vmax;top:-15vmax}.blob.b{background:#FF6FB5;right:-25vmax;top:30vh;animation-delay:-6s}.blob.c{background:#1AA6D8;left:10vw;bottom:-35vmax;animation-delay:-11s}
.star{position:absolute;background:#fff;border-radius:50%;animation:twk 3s ease-in-out infinite}
.bp>header,.bp>section{position:relative;z-index:1}
.gate{position:fixed;inset:0;z-index:150;background:radial-gradient(circle at 50% 40%,#2A0F55,#0E0620 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;padding:20px;transition:opacity 1s,transform 1s}
.gate.out{opacity:0;transform:scale(1.15);pointer-events:none}
.gate h2{font-size:clamp(1.8rem,6vw,3rem);line-height:1.2}
.glow{filter:drop-shadow(0 0 22px #FF6FB5)}
.beat{animation:beat 1.1s ease-in-out infinite}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:60px 20px}
.kicker{margin:0;letter-spacing:.35em;text-transform:uppercase;font-size:.85rem;color:#FFD27A;font-weight:600}
.heroimg{width:min(200px,50vw);aspect-ratio:1;object-fit:cover;border-radius:50%;border:4px solid #FFD27A;box-shadow:0 0 40px #FFD27A66;margin:6px 0}
.hero h1{font-size:clamp(3.4rem,17vw,10rem);line-height:1;display:flex;justify-content:center;background:none}
.hero h1 span{display:inline-block;background:linear-gradient(180deg,#fff,#FF6FB5 60%,#8B5CFF);-webkit-background-clip:text;background-clip:text;color:transparent;animation:rise .9s cubic-bezier(.2,1.4,.4,1) both,bob 3s ease-in-out infinite;filter:drop-shadow(0 0 26px #FF6FB566);padding:0 .02em}
.age{display:flex;align-items:baseline;gap:10px}
.age span{font-size:clamp(4rem,14vw,7rem);color:transparent;-webkit-text-stroke:2px #FFD27A;text-shadow:0 0 30px #FFD27A88}
.age em{font-size:1.4rem;color:#FFD27A}
.lead{max-width:34ch;margin:6px 0 0;opacity:.85;font-size:1.1rem}
.scroll{margin-top:30px;width:26px;height:44px;border:2px solid #fff8;border-radius:14px;position:relative}
.scroll::after{content:"";position:absolute;left:50%;top:8px;width:4px;height:8px;margin-left:-2px;border-radius:2px;background:#fff;animation:sc 1.6s infinite}
.sec{padding:84px 20px;display:flex;flex-direction:column;align-items:center;gap:18px;opacity:0;transform:translateY(40px);transition:opacity .8s,transform .8s}
.sec.in{opacity:1;transform:none}
.sec h2{font-size:clamp(2rem,6vw,3.2rem)}
.small{margin:0;max-width:36ch;opacity:.85}
.glass{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:24px;box-shadow:0 10px 40px #0006}
.note{padding:16px 22px;max-width:34ch;font-weight:600;min-height:56px;display:grid;place-items:center;animation:pop .4s ease-out}
.note.gold{border-color:#FFD27A;box-shadow:0 0 30px #FFD27A44}
.btn{font:inherit;font-weight:700;font-size:1.05rem;color:#fff;cursor:pointer;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:13px 28px;backdrop-filter:blur(10px);transition:transform .2s,box-shadow .2s}
.btn:hover{box-shadow:0 0 26px #8B5CFF99}
.btn:focus-visible,.bl:focus-visible,.gift:focus-visible{outline:3px solid #FFD27A;outline-offset:4px}
.btn.gold{background:linear-gradient(135deg,#FFD27A,#FF9A6B);color:#2A0F55;border:0;font-size:1.15rem;padding:15px 34px;box-shadow:0 0 34px #FFD27A66}
.btn.pink{background:linear-gradient(135deg,#FF6FB5,#8B5CFF);border:0}
.btn.danger{background:#E5384F;border:0}
.btn.ghost{background:transparent}
.row{display:flex;gap:30px;flex-wrap:wrap;justify-content:center;align-items:center;min-height:130px}
.balloons{display:flex;flex-wrap:wrap;gap:22px;justify-content:center;max-width:420px}
.bl{width:62px;height:78px;border:0;cursor:pointer;background:radial-gradient(circle at 32% 28%,#fff9,transparent 32%),var(--c);border-radius:50% 50% 48% 48%/58% 58% 42% 42%;position:relative;box-shadow:0 0 24px color-mix(in srgb,var(--c) 60%,transparent);animation:float 4s ease-in-out infinite;transition:transform .25s,opacity .25s}
.bl::after{content:"";position:absolute;left:50%;top:100%;width:2px;height:34px;background:#fff6}
.bl.gone{transform:scale(2);opacity:0;pointer-events:none}
.gallery{display:flex;flex-wrap:wrap;gap:26px;justify-content:center;max-width:760px}
.polaroid{margin:0;background:#fff;padding:10px 10px 14px;border-radius:6px;width:min(220px,70vw);transform:rotate(var(--r));box-shadow:0 12px 36px #0008;transition:transform .3s;color:#2A0F55;cursor:pointer}
.polaroid:hover{transform:rotate(0) scale(1.06)}
.polaroid img{width:100%;aspect-ratio:1;object-fit:cover;display:block;border-radius:3px;background:#eee}
.polaroid figcaption{margin-top:10px;font-weight:600;font-size:.9rem}
.lightbox{position:fixed;inset:0;z-index:180;background:rgba(14,6,32,.92);display:grid;place-items:center;padding:20px;cursor:zoom-out;animation:pop .25s ease-out}
.lightbox figure{margin:0;max-width:min(92vw,720px)}
.lightbox img{max-width:100%;max-height:78vh;border-radius:10px;border:4px solid #fff;box-shadow:0 0 50px #FF6FB566}
.lightbox figcaption{margin-top:12px;color:#FFD27A;font-weight:600}
.cake{width:min(280px,74vw);overflow:visible;filter:drop-shadow(0 0 30px #FF6FB544)}
.fl{transform-box:fill-box;transform-origin:bottom;animation:flick .5s ease-in-out infinite alternate;filter:drop-shadow(0 0 8px #FFD27A);transition:opacity .2s}
.fl.off{opacity:0;animation:none}
.gift{background:none;border:0;cursor:pointer;filter:drop-shadow(0 0 28px #8B5CFF88)}
.gift.wob{animation:wob .5s}
.lid{transition:transform .5s cubic-bezier(.3,1.6,.5,1)}.lid.up{transform:translate(18px,-44px) rotate(18deg)}
.letter{max-width:480px;padding:28px;text-align:left;line-height:1.7;font-size:1.05rem;animation:pop .4s ease-out}
.letter p{margin:0 0 12px}.sign{font-family:'Playfair Display',serif;font-style:italic;text-align:right;color:#FFD27A;font-size:1.2rem}
.caret{display:inline-block;width:2px;height:1.1em;background:#FFD27A;margin-left:2px;vertical-align:-.15em;animation:blink 1s steps(1) infinite}
.end{padding-bottom:110px}
@keyframes rise{from{transform:translateY(60px) scale(.6);opacity:0}}
@keyframes bob{0%,100%{translate:0 0}50%{translate:0 -10px}}
@keyframes drift{to{transform:translate(12vmax,8vmax) scale(1.2)}}
@keyframes twk{0%,100%{opacity:.15}50%{opacity:1}}
@keyframes sc{0%{transform:translateY(0);opacity:1}100%{transform:translateY(14px);opacity:0}}
@keyframes float{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(3deg)}}
@keyframes flick{from{transform:scale(1) rotate(-3deg)}to{transform:scale(.9,1.12) rotate(3deg)}}
@keyframes pop{from{transform:scale(.8);opacity:0}}
@keyframes beat{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
@keyframes wob{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}
@keyframes blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.bp *{animation:none!important;transition:none!important}.sec{opacity:1;transform:none}}
`;
