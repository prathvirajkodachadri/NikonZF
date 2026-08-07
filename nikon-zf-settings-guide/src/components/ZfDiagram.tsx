import { useState } from 'react';

const INK = '#1E2022';
const CHAR = '#2F3133';
const NAVY = '#00365A';
const BEIGE = '#D7BB83';
const PAPER = '#FAF8F3';
const ORANGE = '#C64F0E';
const MUSTARD = '#F4B23C';

export const PARTS = [
  { n:1, t:'ISO DIAL',           d:'100 → 6400 • C = Auto', c:ORANGE },
  { n:2, t:'SHUTTER SPEED DIAL', d:'30 → 8000 • B • T',     c:NAVY, w:true },
  { n:3, t:'APERTURE DIAL',      d:'f/2 → f/16',            c:ORANGE },
  { n:4, t:'EXPOSURE COMP DIAL', d:'−3 → +3',               c:NAVY, w:true },
];

export default function ZfDiagram(){
  const [active, setActive] = useState<number|null>(null);
  const on = (n:number)=> active===n;
  const dim = (n:number)=> active!==null && active!==n ? 0.35 : 1;

  const stripes = (x:number,y:number,w:number,h:number,n:number)=>(
    Array.from({length:n}).map((_,i)=>(<rect key={i} x={x+i*(w/n)} y={y} width={(w/n)*0.44} height={h} rx="1" fill={INK} opacity="0.85"/>))
  );

  const Callout = ({n, ax, ay, lx, ly, side, title, sub}:{n:number;ax:number;ay:number;lx:number;ly:number;side:'l'|'r';title:string;sub:string})=>{
    const anchor = side==='l' ? 'end' : 'start';
    const tx = side==='l' ? lx-10 : lx+10;
    const highlight = on(n);
    return (
      <g style={{cursor:'pointer'}} onMouseEnter={()=>setActive(n)} onMouseLeave={()=>setActive(null)} onClick={()=>setActive(on(n)?null:n)}>
        <path d={`M${ax} ${ay} L${lx} ${ay} L${lx} ${ly}`} stroke={highlight?ORANGE:INK} strokeWidth={highlight?2.2:1.4} fill="none" opacity={dim(n)}/>
        <circle cx={ax} cy={ay} r={highlight?5:3.5} fill={highlight?ORANGE:INK} opacity={dim(n)}/>
        <g className={`badge ${highlight?'badge-on':''}`} opacity={dim(n)}>
          <circle cx={lx} cy={ly} r="11" fill={highlight?ORANGE:NAVY} stroke={PAPER} strokeWidth="2.5"/>
          <text x={lx} y={ly+4} textAnchor="middle" fontSize="11" fontWeight={800} fill={PAPER} fontFamily="'Space Grotesk',sans-serif">{n}</text>
        </g>
        <text x={tx} y={ly-3} textAnchor={anchor} fontSize="12.5" fontWeight={800} fill={CHAR} letterSpacing="0.6" fontFamily="'Space Grotesk',sans-serif" opacity={dim(n)}>{title}</text>
        <text x={tx} y={ly+12} textAnchor={anchor} fontSize="10" fontWeight={600} fill="#564D40" fontFamily="'Space Grotesk',sans-serif" opacity={dim(n)}>{sub}</text>
      </g>
    );
  };

  return (
    <div className="rounded-[18px] border-[1.5px] border-[#2F3133] bg-[#FAF8F3] p-4 md:p-6 shadow-[4px_4px_0px_#2F3133]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 md:mb-4">
        <div className="sans text-[11px] font-bold tracking-[0.16em] mut">RETRO MIRRORLESS • TOP VIEW INFOGRAPHIC</div>
        <div className="text-[10px] font-black tracking-[0.16em] text-[#FAF8F3] bg-[#00365A] border border-[#2F3133] rounded-full px-3 py-1.5 shadow-[1.5px_1.5px_0px_#2F3133]">TAP A LABEL</div>
      </div>

      <div className="rounded-[14px] border-[1.5px] border-[#2F3133] bg-[#EFE7D6] p-2 md:p-3">
        <svg viewBox="0 0 990 640" className="w-full h-auto block" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Camera top view with four labelled dials: ISO dial, shutter speed dial, aperture dial and exposure compensation dial">
          <defs>
            <clipPath id="bodyclip"><rect x="150" y="300" width="600" height="250" rx="42"/></clipPath>
          </defs>

          {/* LENS */}
          <g>
            <rect x="356" y="26" width="188" height="20" rx="10" fill={CHAR} stroke={INK} strokeWidth="2.5"/>
            <rect x="338" y="44" width="224" height="150" rx="16" fill={CHAR} stroke={INK} strokeWidth="3"/>
            <rect x="360" y="58" width="180" height="30" rx="8" fill={NAVY}/>
            <rect x="344" y="96" width="212" height="34" fill={CHAR}/>
            {stripes(350,100,200,26,22)}
            <rect x="338" y="132" width="224" height="18" fill={BEIGE} stroke={INK} strokeWidth="2"/>
            <text x="450" y="145" textAnchor="middle" fontSize="10" fontWeight={800} fill={CHAR} fontFamily="'JetBrains Mono',monospace" letterSpacing="2">f2 · 2.8 · 4 · 5.6 · 8 · 16</text>
            <rect x="344" y="152" width="212" height="30" fill={CHAR}/>
            {stripes(350,156,200,22,22)}
            <text x="450" y="200" textAnchor="middle" fontSize="15" fontWeight={800} fill={PAPER} fontFamily="'Space Grotesk',sans-serif" letterSpacing="1.5">40mm 1:2</text>
          </g>

          {/* LENS MOUNT */}
          <g>
            <rect x="326" y="210" width="248" height="34" rx="12" fill="#3A3D40" stroke={INK} strokeWidth="3"/>
            <rect x="326" y="210" width="248" height="34" rx="12" fill="none" stroke={PAPER} strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6"/>
            <circle cx="352" cy="227" r="4" fill={BEIGE}/>
          </g>

          {/* BODY */}
          <rect x="150" y="300" width="600" height="250" rx="42" fill={CHAR} stroke={INK} strokeWidth="3"/>
          <rect x="168" y="308" width="564" height="4" rx="2" fill={PAPER} opacity="0.08"/>
          <g clipPath="url(#bodyclip)">
            <rect x="360" y="300" width="180" height="250" fill={NAVY}/>
          </g>
          <rect x="132" y="360" width="22" height="34" rx="8" fill="#3A3D40" stroke={INK} strokeWidth="2.5"/>
          <rect x="746" y="360" width="22" height="34" rx="8" fill="#3A3D40" stroke={INK} strokeWidth="2.5"/>

          {/* VIEWFINDER */}
          <g>
            <path d="M388 300 L410 258 H490 L512 300 Z" fill={CHAR} stroke={INK} strokeWidth="3"/>
            <rect x="424" y="266" width="52" height="14" rx="3" fill={NAVY}/>
          </g>

          {/* HOT SHOE */}
          <g>
            <rect x="418" y="360" width="64" height="70" rx="6" fill={BEIGE} stroke={INK} strokeWidth="2.5"/>
            <rect x="430" y="372" width="40" height="46" rx="3" fill={CHAR}/>
            <rect x="444" y="360" width="12" height="10" fill={BEIGE}/>
          </g>

          {/* ISO DIAL */}
          <g className="dialg" style={{transformOrigin:'250px 400px'}} opacity={dim(1)} onMouseEnter={()=>setActive(1)} onMouseLeave={()=>setActive(null)}>
            <circle cx="250" cy="400" r="72" fill="none" stroke={BEIGE} strokeWidth="5" strokeDasharray="3 10"/>
            <circle cx="250" cy="400" r="64" fill="#24262A" stroke={INK} strokeWidth="3"/>
            <circle cx="250" cy="400" r="52" fill="none" stroke={PAPER} strokeWidth="3.5" strokeDasharray="2 8" opacity="0.85"/>
            <circle cx="250" cy="400" r="42" fill={PAPER} stroke={INK} strokeWidth="2.5"/>
            <text x="250" y="376" textAnchor="middle" fontSize="7.5" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">3200</text>
            <text x="272" y="383" textAnchor="middle" fontSize="7.5" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">1600</text>
            <text x="283" y="404" textAnchor="middle" fontSize="7.5" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">800</text>
            <text x="272" y="425" textAnchor="middle" fontSize="7.5" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">400</text>
            <text x="250" y="431" textAnchor="middle" fontSize="7.5" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">200</text>
            <text x="228" y="425" textAnchor="middle" fontSize="7.5" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">100</text>
            <text x="219" y="404" textAnchor="middle" fontSize="9" fontWeight={800} fill={ORANGE} fontFamily="'JetBrains Mono',monospace">C</text>
            <text x="228" y="383" textAnchor="middle" fontSize="7.5" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">6400</text>
            <text x="250" y="452" textAnchor="middle" fontSize="8" fontWeight={800} fill={PAPER} fontFamily="'Space Grotesk',sans-serif" letterSpacing="1">ISO</text>
            <circle cx="250" cy="400" r="11" fill={NAVY} stroke={INK} strokeWidth="2"/>
            <rect x="244" y="322" width="12" height="16" rx="5" fill={MUSTARD} stroke={INK} strokeWidth="2"/>
          </g>

          {/* SHUTTER DIAL */}
          <g className="dialg" style={{transformOrigin:'560px 398px'}} opacity={dim(2)} onMouseEnter={()=>setActive(2)} onMouseLeave={()=>setActive(null)}>
            <circle cx="560" cy="398" r="66" fill="none" stroke={BEIGE} strokeWidth="5" strokeDasharray="3 9"/>
            <circle cx="560" cy="398" r="58" fill="#24262A" stroke={INK} strokeWidth="3"/>
            <circle cx="560" cy="398" r="47" fill="none" stroke={PAPER} strokeWidth="3.5" strokeDasharray="2 7" opacity="0.85"/>
            <circle cx="560" cy="398" r="38" fill={PAPER} stroke={INK} strokeWidth="2.5"/>
            <text x="560" y="376" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">30</text>
            <text x="576" y="381" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">15</text>
            <text x="586" y="396" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">8</text>
            <text x="590" y="410" textAnchor="middle" fontSize="7" fontWeight={800} fill={ORANGE} fontFamily="'JetBrains Mono',monospace">4</text>
            <text x="584" y="424" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">1</text>
            <text x="560" y="430" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">B</text>
            <text x="536" y="424" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">T</text>
            <text x="530" y="410" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">X</text>
            <text x="534" y="396" textAnchor="middle" fontSize="6.5" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">4000</text>
            <text x="544" y="381" textAnchor="middle" fontSize="6.5" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">8000</text>
            <circle cx="560" cy="398" r="10" fill={NAVY} stroke={INK} strokeWidth="2"/>
            <rect x="554" y="326" width="12" height="16" rx="5" fill={MUSTARD} stroke={INK} strokeWidth="2"/>
          </g>

          {/* SHUTTER BUTTON + POWER COLLAR (not labelled) */}
          <g>
            <circle cx="628" cy="356" r="30" fill="#24262A" stroke={INK} strokeWidth="3"/>
            <circle cx="628" cy="356" r="15" fill={BEIGE} stroke={INK} strokeWidth="2.5"/>
            <circle cx="628" cy="356" r="6" fill={PAPER} stroke={INK} strokeWidth="1.5"/>
          </g>

          {/* APERTURE DIAL — front command dial (3) */}
          <g className="dialg" style={{transformOrigin:'690px 330px'}} opacity={dim(3)} onMouseEnter={()=>setActive(3)} onMouseLeave={()=>setActive(null)}>
            <circle cx="690" cy="330" r="30" fill="none" stroke={BEIGE} strokeWidth="4.5" strokeDasharray="3 8"/>
            <circle cx="690" cy="330" r="23" fill="#24262A" stroke={INK} strokeWidth="3"/>
            <circle cx="690" cy="330" r="15" fill={PAPER} stroke={INK} strokeWidth="2"/>
            <text x="690" y="334" textAnchor="middle" fontSize="9" fontWeight={800} fill={NAVY} fontFamily="'JetBrains Mono',monospace">f/2</text>
            <rect x="686" y="296" width="8" height="12" rx="4" fill={MUSTARD} stroke={INK} strokeWidth="2"/>
          </g>

          {/* EXPOSURE COMP */}
          <g className="dialg" style={{transformOrigin:'700px 440px'}} opacity={dim(4)} onMouseEnter={()=>setActive(4)} onMouseLeave={()=>setActive(null)}>
            <circle cx="700" cy="440" r="50" fill="none" stroke={BEIGE} strokeWidth="4.5" strokeDasharray="3 8"/>
            <circle cx="700" cy="440" r="43" fill="#24262A" stroke={INK} strokeWidth="3"/>
            <circle cx="700" cy="440" r="34" fill="none" stroke={PAPER} strokeWidth="3" strokeDasharray="2 6" opacity="0.85"/>
            <circle cx="700" cy="440" r="26" fill={PAPER} stroke={INK} strokeWidth="2.5"/>
            <text x="700" y="423" textAnchor="middle" fontSize="7.5" fontWeight={800} fill={ORANGE} fontFamily="'JetBrains Mono',monospace">+3</text>
            <text x="715" y="429" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">+2</text>
            <text x="721" y="443" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">+1</text>
            <text x="714" y="456" textAnchor="middle" fontSize="7.5" fontWeight={800} fill={CHAR} fontFamily="'JetBrains Mono',monospace">0</text>
            <text x="700" y="461" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">-1</text>
            <text x="685" y="456" textAnchor="middle" fontSize="7" fontWeight={700} fill={NAVY} fontFamily="'JetBrains Mono',monospace">-2</text>
            <text x="679" y="443" textAnchor="middle" fontSize="7.5" fontWeight={800} fill={ORANGE} fontFamily="'JetBrains Mono',monospace">-3</text>
            <circle cx="700" cy="440" r="8" fill={NAVY} stroke={INK} strokeWidth="2"/>
            <rect x="695" y="384" width="10" height="14" rx="4" fill={MUSTARD} stroke={INK} strokeWidth="2"/>
          </g>

          {/* MODE SELECTOR */}
          <g>
            <rect x="176" y="486" width="64" height="24" rx="12" fill="#24262A" stroke={INK} strokeWidth="2.5"/>
            <circle cx="192" cy="498" r="7" fill={BEIGE} stroke={INK} strokeWidth="1.5"/>
            <text x="216" y="502" textAnchor="middle" fontSize="7" fontWeight={800} fill={PAPER} fontFamily="'Space Grotesk',sans-serif">B&amp;W</text>
          </g>

          {/* CALLOUTS — four dials only */}
          <Callout n={1} ax={196} ay={400} lx={134} ly={392} side="l" title="01 · ISO DIAL"           sub="100 → 6400 · C = Auto" />
          <Callout n={2} ax={614} ay={398} lx={790} ly={392} side="r" title="02 · SHUTTER SPEED DIAL" sub="30 → 8000 · B · T" />
          <Callout n={3} ax={676} ay={344} lx={790} ly={252} side="r" title="03 · APERTURE DIAL"      sub="f/2 → f/16" />
          <Callout n={4} ax={744} ay={452} lx={790} ly={520} side="r" title="04 · EXPOSURE COMP DIAL" sub="−3 → +3" />
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PARTS.map(i=>(
          <button key={i.n} onMouseEnter={()=>setActive(i.n)} onMouseLeave={()=>setActive(null)} onClick={()=>setActive(on(i.n)?null:i.n)}
            className={`flex items-center gap-2.5 min-h-[48px] rounded-[10px] border-[1.5px] border-[#2F3133] bg-white px-3 py-2 text-left shadow-[1.5px_1.5px_0px_#2F3133] transition hover:-translate-y-[2px] active:translate-y-0 ${on(i.n)?'ring-[3px] ring-[#F4B23C] bg-[#FFF8EC]':''}`}>
            <span className="h-6 w-6 shrink-0 rounded-full border-[1.5px] border-[#2F3133] flex items-center justify-center text-[11px] font-black" style={{background:i.c, color: i.w?'#FAF8F3':'#2F3133'}}>{i.n}</span>
            <span className="leading-tight min-w-0"><span className="sans block text-[11px] font-black tracking-wide text-[#2F3133] truncate">{i.t}</span><span className="sans block text-[10px] mut font-medium truncate">{i.d}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
