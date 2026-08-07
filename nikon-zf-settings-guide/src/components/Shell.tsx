import { useEffect, useState, type ReactNode } from 'react';

export const TONE = { orange:'#C64F0E', navy:'#00365A', char:'#2F3133' } as const;

const NAV: [string,string,string][] = [
  ['#/',          'SETTINGS',  'SETTINGS + CAM MAP'],
  ['#/rules',     'RULES',     'RULES'],
  ['#/diagnoser', 'DIAGNOSER', 'DIAGNOSER'],
];

export function SectionHead({num, title, sub, tone='navy'}:{num:string; title:string; sub?:string; tone?:keyof typeof TONE}){
  return (
    <div className="mb-5 md:mb-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 h-9 w-9 rounded-full border-[1.5px] border-[#2F3133] flex items-center justify-center sans text-[12px] font-black text-[#FAF8F3] shadow-[2px_2px_0px_#2F3133]" style={{background:TONE[tone]}}>{num}</span>
          <div className="min-w-0">
            <h2 className="display text-[clamp(20px,3.2vw,28px)] leading-[1] tracking-tight text-[#2F3133]">{title}</h2>
            {sub && <p className="sans text-[11px] font-bold tracking-[0.16em] mut mt-1">{sub}</p>}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 pb-1">
          <span className="h-2 w-8 rounded-full bg-[#00365A] border border-[#2F3133]"></span>
          <span className="h-2 w-6 rounded-full bg-[#C64F0E] border border-[#2F3133]"></span>
          <span className="h-2 w-4 rounded-full bg-[#F4B23C] border border-[#2F3133]"></span>
          <span className="h-2 w-3 rounded-full bg-[#D7BB83] border border-[#2F3133]"></span>
        </div>
      </div>
      <div className="mt-3 h-[2px] w-full bg-[#2F3133]"></div>
    </div>
  );
}

export function PageHero({eyebrow, title, accent, lead, actions, art}:{
  eyebrow:string; title:ReactNode; accent?:string; lead:string; actions?:ReactNode; art:ReactNode;
}){
  return (
    <section className="relative z-10 border-b-[1.5px] border-[#2F3133] bg-[#F3EDE1]">
      <div className="mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-10 py-10 md:py-16">
        <div data-reveal className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <span className="inline-block rounded-full border-[1.5px] border-[#2F3133] px-3 py-1 sans text-[10px] font-black tracking-[0.18em] shadow-[2px_2px_0px_#2F3133]" style={{background:accent ?? '#F4B23C', color: accent ? '#FAF8F3' : '#2F3133'}}>{eyebrow}</span>
            <h1 className="display isolate text-[clamp(38px,7.5vw,68px)] leading-[0.88] tracking-tight mt-4 text-[#2F3133]">{title}</h1>
            <p className="sans text-[clamp(14px,1.6vw,16px)] leading-[1.6] mt-5 max-w-[48ch] text-[#4A4237] font-medium">{lead}</p>
            {actions && <div className="mt-6 flex flex-wrap gap-2">{actions}</div>}
          </div>
          <div className="relative rounded-[16px] border-[1.5px] border-[#2F3133] bg-[#FAF8F3] overflow-hidden shadow-[4px_4px_0px_#2F3133]">
            {art}
            <div className="h-[8px] w-full flex">
              <div className="flex-1 bg-[#00365A]"></div><div className="flex-1 bg-[#C64F0E]"></div><div className="flex-1 bg-[#F4B23C]"></div><div className="flex-1 bg-[#D7BB83]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BtnLink({href, children, variant='navy'}:{href:string; children:ReactNode; variant?:'navy'|'plain'}){
  const base = "rounded-[10px] border-[1.5px] border-[#2F3133] px-5 min-h-[48px] flex items-center sans text-[11px] font-black tracking-[0.16em] shadow-[3px_3px_0px_#2F3133] hover:shadow-[2px_2px_0px_#2F3133] hover:translate-x-[1px] hover:translate-y-[1px] transition no-underline";
  return <a href={href} className={`${base} ${variant==='navy' ? 'bg-[#00365A] text-[#FAF8F3] hover:bg-[#C64F0E]' : 'bg-white text-[#2F3133] hover:bg-[#F4B23C]'}`}>{children}</a>;
}

export default function Shell({active, onReset, children}:{active:string; onReset?:()=>void; children:ReactNode}){
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(()=>{
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){ (e.target as HTMLElement).classList.add('revealed'); io.unobserve(e.target); }
    }),{threshold:0.06});
    els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  });

  const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAF8F3] text-[#2F3133] selection:bg-[#F4B23C]/50 touch-manipulation">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@500&display=swap');
        .display{font-family:'Syne', sans-serif; font-weight:800; letter-spacing:-0.02em}
        .sans{font-family:'Space Grotesk', sans-serif}
        .mono{font-family:'JetBrains Mono', monospace}
        *{ -webkit-font-smoothing: antialiased }
        html{ scroll-behavior:smooth }
        button:focus-visible, a:focus-visible{ outline:3px solid #00365A; outline-offset:2px; border-radius:6px }
        .mut{ color:#564D40 }
        .dialg{ transition: transform .55s cubic-bezier(.22,.9,.26,1.2); cursor:pointer }
        .dialg:hover{ transform: rotate(20deg) }
        .popg{ transition: transform .3s ease; cursor:pointer; transform-box: fill-box; transform-origin: center }
        .popg:hover{ transform: scale(1.12) }
        .badge{ transition: transform .3s; transform-box: fill-box; transform-origin: center }
        .badge-on{ animation: badgepop .5s ease }
        @keyframes badgepop{ 0%{transform:scale(1)} 40%{transform:scale(1.35)} 100%{transform:scale(1)} }
        @keyframes floaty{ 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-16px) rotate(3deg)} }
        @keyframes floaty2{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
        .floaty{ animation: floaty 9s ease-in-out infinite }
        .floaty2{ animation: floaty2 11s ease-in-out infinite }
        [data-reveal]{ opacity:0; transform: translateY(20px); transition: opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1) }
        [data-reveal].revealed{ opacity:1; transform:none }
        @media (prefers-reduced-motion: reduce){
          *{ animation:none !important; transition:none !important }
          [data-reveal]{ opacity:1 !important; transform:none !important }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: grain}}></div>
        <div className="floaty absolute -top-10 right-[8%] h-40 w-40 rounded-full border-[10px] border-[#F4B23C] opacity-25"></div>
        <div className="floaty2 absolute top-[38%] -left-16 h-28 w-28 rounded-full bg-[#C64F0E] opacity-10"></div>
        <div className="floaty absolute bottom-[12%] right-[4%] h-24 w-24 rounded-full bg-[#00365A] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-[10px] flex">
          <div className="flex-1 bg-[#00365A]"></div><div className="flex-1 bg-[#C64F0E]"></div><div className="flex-1 bg-[#F4B23C]"></div><div className="flex-1 bg-[#D7BB83]"></div><div className="flex-1 bg-[#2F3133]"></div>
        </div>
      </div>

      <header className="relative z-30 border-b-[1.5px] border-[#2F3133] bg-[#FAF8F3]">
        <div className="mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-10">
          <div className="flex flex-wrap items-center justify-between gap-y-1 py-2 border-b border-dashed border-[#2F3133]/20">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full bg-[#C64F0E] border border-[#2F3133] shrink-0"></span>
              <span className="sans text-[9px] sm:text-[10px] font-bold tracking-[0.18em] truncate">EST. 1978 • NIKON ZF FIELD GUIDE</span>
              <span className="hidden md:inline h-2 w-2 rounded-full bg-[#F4B23C] border border-[#2F3133]"></span>
              <span className="hidden md:inline sans text-[10px] font-bold tracking-[0.2em]">24-120mm f/4 S • 40mm f/2</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-[#00365A] border border-[#2F3133]"></div>
              <div className="h-5 w-5 rounded-full bg-[#D7BB83] border border-[#2F3133]"></div>
              <div className="h-5 w-5 rounded-full bg-[#C64F0E] border border-[#2F3133]"></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 py-3 md:py-5">
            <a href="#/" className="flex items-center gap-3 md:gap-4 min-w-0 no-underline text-[#2F3133]">
              <div className="h-11 w-11 md:h-12 md:w-12 rounded-[10px] bg-[#00365A] border-[1.5px] border-[#2F3133] text-[#FAF8F3] flex items-center justify-center display text-[18px] md:text-[20px] shadow-[3px_3px_0px_#2F3133] shrink-0">Zf</div>
              <div className="min-w-0">
                <div className="display text-[clamp(19px,3.4vw,28px)] leading-[0.9] tracking-tight">ZF FIELD COMPANION</div>
                <div className="sans text-[9px] sm:text-[11px] font-bold tracking-[0.18em] text-[#00365A]">RETRO EDITORIAL • 1978 POSTER EDITION</div>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
              {NAV.map(([href,label])=> href===active ? (
                <span key={href} aria-current="page" className="rounded-[8px] px-3.5 py-2 sans text-[11px] font-black tracking-[0.14em] bg-[#F4B23C] text-[#2F3133] border-[1.5px] border-[#2F3133] shadow-[2px_2px_0px_#2F3133]">{label}</span>
              ) : (
                <a key={href} href={href} className="rounded-[8px] px-3.5 py-2 sans text-[11px] font-black tracking-[0.14em] text-[#2F3133] hover:bg-[#D7BB83]/50 transition no-underline">{label}</a>
              ))}
              {onReset && <button onClick={onReset} className="ml-2 min-h-[44px] rounded-[10px] border-[1.5px] border-[#2F3133] bg-[#00365A] text-[#FAF8F3] px-4 sans text-[11px] font-bold tracking-[0.18em] shadow-[2px_2px_0px_#2F3133] hover:bg-[#C64F0E] hover:shadow-[1px_1px_0px_#2F3133] hover:translate-x-[1px] hover:translate-y-[1px] transition">RESET</button>}
            </nav>

            <button onClick={()=>setMenuOpen(v=>!v)} aria-expanded={menuOpen} aria-label="Open menu" className="lg:hidden min-h-[44px] min-w-[44px] rounded-[10px] border-[1.5px] border-[#2F3133] bg-[#FAF8F3] shadow-[2px_2px_0px_#2F3133] flex flex-col items-center justify-center gap-[5px] px-3">
              <span className={`block h-[2.5px] w-5 bg-[#2F3133] rounded transition ${menuOpen?'translate-y-[7.5px] rotate-45':''}`}></span>
              <span className={`block h-[2.5px] w-5 bg-[#2F3133] rounded transition ${menuOpen?'opacity-0':''}`}></span>
              <span className={`block h-[2.5px] w-5 bg-[#2F3133] rounded transition ${menuOpen?'-translate-y-[7.5px] -rotate-45':''}`}></span>
            </button>
          </div>

          {menuOpen && (
            <nav className="lg:hidden pb-4 space-y-1.5" aria-label="Mobile">
              {NAV.map(([href,,long])=> href===active ? (
                <span key={href} aria-current="page" className="block rounded-[10px] border-[1.5px] border-[#2F3133] bg-[#F4B23C] px-4 min-h-[48px] flex items-center sans text-[12px] font-black tracking-[0.12em] text-[#2F3133] shadow-[1.5px_1.5px_0px_#2F3133]">{long}</span>
              ) : (
                <a key={href} href={href} onClick={()=>setMenuOpen(false)} className="block rounded-[10px] border-[1.5px] border-[#2F3133] bg-white px-4 min-h-[48px] flex items-center sans text-[12px] font-black tracking-[0.12em] text-[#2F3133] shadow-[1.5px_1.5px_0px_#2F3133] no-underline">{long}</a>
              ))}
              {onReset && <button onClick={()=>{onReset();setMenuOpen(false);}} className="w-full rounded-[10px] border-[1.5px] border-[#2F3133] bg-[#C64F0E] text-white px-4 min-h-[48px] sans text-[12px] font-black tracking-[0.14em] shadow-[1.5px_1.5px_0px_#2F3133]">RESET ALL</button>}
            </nav>
          )}
        </div>
      </header>

      {children}

      <footer className="relative z-10 border-t-[1.5px] border-[#2F3133] bg-[#2F3133] text-[#FAF8F3] mt-10">
        <div className="mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-10 py-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {NAV.map(([href,label])=>(
              <a key={href} href={href} className="rounded-[8px] border border-[#FAF8F3]/25 px-3 py-1.5 sans text-[10px] font-black tracking-[0.14em] text-[#FAF8F3] hover:bg-[#FAF8F3] hover:text-[#2F3133] transition no-underline">{label}</a>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-2 pt-4 border-t border-[#FAF8F3]/20">
            <div className="flex items-center gap-2 sans text-[10px] font-bold tracking-[0.18em]">
              <div className="h-2 w-2 rounded-full bg-[#F4B23C]"></div> NIKKOR Z 24-120mm f/4 S • 40mm f/2 • 1978 RETRO
            </div>
            <div className="sans text-[10px] tracking-widest opacity-70">PRINTED PAPER FEEL • MINIMAL COLOR</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
