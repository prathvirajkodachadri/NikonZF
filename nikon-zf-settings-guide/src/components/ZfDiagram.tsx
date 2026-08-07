import { useState } from 'react';

const INK = '#1E2022';
const CHAR = '#2F3133';
const NAVY = '#00365A';
const BEIGE = '#D7BB83';
const PAPER = '#FAF8F3';
const ORANGE = '#C64F0E';
const MUSTARD = '#F4B23C';
const DARK = '#24262A';
const PLATE = '#3A3D40';
const RING = '#1D1F21';
const RED = '#B3352B';
const LCDGLASS = '#E8C97A';

export const PARTS = [
  { n:1, t:'ISO DIAL',           d:'100 → 51200 • C = Auto',        c:ORANGE },
  { n:2, t:'SHUTTER SPEED DIAL', d:'1/8000 → 4s • B • T • X',       c:NAVY, w:true },
  { n:3, t:'APERTURE DIAL',      d:'Front command dial • f/2 → f/16', c:ORANGE },
  { n:4, t:'EXPOSURE COMP DIAL', d:'−3 → +3 • C',                   c:NAVY, w:true },
];

/* point on a circle: 0° = east, positive = clockwise (svg y-down) */
const polar = (cx:number, cy:number, r:number, deg:number):[number,number]=>{
  const a = (deg*Math.PI)/180;
  return [cx + r*Math.cos(a), cy + r*Math.sin(a)];
};

export default function ZfDiagram(){
  const [active, setActive] = useState<number|null>(null);
  const on = (n:number)=> active===n;
  const dim = (n:number)=> active!==null && active!==n ? 0.35 : 1;
  const tip = (n:number|null)=> ()=> setActive(n);
  const toggle = (n:number)=> ()=> setActive(active===n ? null : n);

  /* vertical knurl stripes (lens ring) */
  const stripes = (x:number,y:number,w:number,h:number,n:number)=>(
    Array.from({length:n}).map((_,i)=>(<rect key={i} x={x+i*(w/n)} y={y} width={(w/n)*0.44} height={h} rx="1" fill={INK} opacity="0.85"/>))
  );

  /* radial knurl ticks (dial rims) */
  const Ticks = ({cx,cy,r,len,n,color=BEIGE,op=0.45,sw=2.4}:{cx:number;cy:number;r:number;len:number;n:number;color?:string;op?:number;sw?:number;})=>(
    <g>{Array.from({length:n}).map((_,i)=>{
      const [x1,y1] = polar(cx,cy,r-len,(360/n)*i);
      const [x2,y2] = polar(cx,cy,r,(360/n)*i);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={sw} opacity={op} strokeLinecap="round"/>;
    })}</g>
  );

  /* engraved values around a dial face */
  const RingText = ({cx,cy,r,start,step,items}:{cx:number;cy:number;r:number;start:number;step:number;items:{t:string;c?:string;s?:number}[]})=>(
    <g fontFamily="'JetBrains Mono',monospace" textAnchor="middle">{items.map((it,i)=>{
      const [x,y] = polar(cx,cy,r,start+i*step);
      const size = it.s ?? 7;
      return <text key={i} x={x} y={y+size*0.36} fontSize={size} fontWeight={700} fill={it.c ?? NAVY}>{it.t}</text>;
    })}</g>
  );

  const Callout = ({n, ax, ay, lx, ly, side, title, sub}:{n:number;ax:number;ay:number;lx:number;ly:number;side:'l'|'r';title:string;sub:string})=>{
    const anchor = side==='l' ? 'end' : 'start';
    const tx = side==='l' ? lx-10 : lx+10;
    const highlight = on(n);
    return (
      <g style={{cursor:'pointer'}} onMouseEnter={tip(n)} onMouseLeave={tip(null)} onClick={toggle(n)}>
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
        <div className="sans text-[11px] font-bold tracking-[0.16em] mut">NIKON Zf • TOP PLATE • INFOGRAPHIC</div>
        <div className="text-[10px] font-black tracking-[0.16em] text-[#FAF8F3] bg-[#00365A] border border-[#2F3133] rounded-full px-3 py-1.5 shadow-[1.5px_1.5px_0px_#2F3133]">TAP A LABEL</div>
      </div>

      <div className="rounded-[14px] border-[1.5px] border-[#2F3133] bg-[#EFE7D6] p-2 md:p-3">
        <svg viewBox="0 0 1152 660" className="w-full h-auto block" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Nikon Zf top view with four labelled controls: ISO dial, shutter speed dial, aperture front command dial and exposure compensation dial">
          <defs>
            <clipPath id="bodyclip"><rect x="176" y="316" width="656" height="244" rx="28"/></clipPath>
            <clipPath id="gripclip"><rect x="792" y="336" width="72" height="204" rx="22"/></clipPath>
            <clipPath id="backclip"><rect x="700" y="566" width="90" height="40"/></clipPath>
            <pattern id="grain" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.4" fill="#1B1D1F" opacity="0.9"/>
              <circle cx="7.2" cy="7" r="1" fill="#1B1D1F" opacity="0.7"/>
            </pattern>
          </defs>

          {/* ============ BODY ============ */}
          <rect x="170" y="310" width="668" height="256" rx="34" fill={CHAR} stroke={INK} strokeWidth="3"/>
          {/* metal top plate */}
          <rect x="178" y="318" width="652" height="96" rx="26" fill={PLATE}/>
          <rect x="188" y="323" width="632" height="3.5" rx="1.75" fill={PAPER} opacity="0.10"/>
          {/* leatherette */}
          <g clipPath="url(#bodyclip)">
            <rect x="176" y="414" width="656" height="152" fill="url(#grain)" opacity="0.55"/>
            <rect x="176" y="410" width="656" height="4" fill={PAPER} opacity="0.06"/>
          </g>
          {/* base plate */}
          <rect x="196" y="542" width="616" height="16" rx="8" fill="#22262A"/>
          {[252,416,608,772].map(x=>(<circle key={x} cx={x} cy={550} r="2.4" fill="#494D50"/>))}
          {/* strap lugs */}
          <g>
            <rect x="150" y="374" width="26" height="32" rx="9" fill={PLATE} stroke={INK} strokeWidth="2.5"/>
            <circle cx="163" cy="390" r="5" fill="#141619" stroke={INK} strokeWidth="1.5"/>
            <rect x="852" y="374" width="26" height="32" rx="9" fill={PLATE} stroke={INK} strokeWidth="2.5"/>
            <circle cx="865" cy="390" r="5" fill="#141619" stroke={INK} strokeWidth="1.5"/>
          </g>
          {/* focal plane mark */}
          <g opacity="0.85">
            <circle cx="674" cy="332" r="6" fill="none" stroke={PAPER} strokeWidth="1.6"/>
            <line x1="666" y1="332" x2="682" y2="332" stroke={PAPER} strokeWidth="1.6"/>
          </g>

          {/* ============ FRONT COMMAND DIAL (03) — under the grip lip ============ */}
          <g className="dialg" style={{transformOrigin:'820px 334px'}} opacity={dim(3)} onMouseEnter={tip(3)} onMouseLeave={tip(null)} onClick={toggle(3)}>
            <rect x="794" y="324" width="44" height="20" rx="10" fill="#141619"/>
            <circle cx="820" cy="334" r="15" fill={DARK} stroke={INK} strokeWidth="2.5"/>
            <Ticks cx={820} cy={334} r={12.5} len={4.5} n={12} op={0.6}/>
            <circle cx="820" cy="334" r="3.5" fill={PLATE}/>
          </g>

          {/* grip (drawn over the command dial so only its crown peeks out) */}
          <g>
            <rect x="792" y="336" width="72" height="204" rx="22" fill="#373A3D" stroke={INK} strokeWidth="2.5"/>
            <g clipPath="url(#gripclip)">
              <rect x="792" y="336" width="72" height="204" fill="url(#grain)" opacity="0.6"/>
            </g>
            <rect x="798" y="342" width="3.5" height="192" rx="1.75" fill={PAPER} opacity="0.09"/>
          </g>

          {/* ============ ISO STACK (left shoulder) ============ */}
          {/* shooting-mode sub dial under the ISO dial: P · S · A · AUTO · M */}
          <g opacity={dim(1)} onMouseEnter={tip(1)} onMouseLeave={tip(null)} onClick={toggle(1)} style={{cursor:'pointer'}}>
            <circle cx="272" cy="414" r="92" fill={RING} stroke={INK} strokeWidth="2.5"/>
            <g fontFamily="'JetBrains Mono',monospace" textAnchor="middle" fontWeight={800} fontSize="8.5" fill={PAPER} opacity="0.95">
              {(['P','S','A','AUTO','M'] as const).map((t,i)=>{
                const [x,y] = polar(272,414,85.5,[122,106,90,74,58][i]);
                return <text key={t} x={x} y={y+3}>{t}</text>;
              })}
            </g>
            <path d="M176 410 L176 418 L184 414 Z" fill={PAPER} opacity="0.9"/>
          </g>

          {/* ============ SHUTTER STACK (right of prism) ============ */}
          {/* photo / B&W / movie selector ring under the shutter dial */}
          <g opacity={dim(2)} onMouseEnter={tip(2)} onMouseLeave={tip(null)} onClick={toggle(2)} style={{cursor:'pointer'}}>
            <circle cx="632" cy="416" r="84" fill={RING} stroke={INK} strokeWidth="2.5"/>
            {/* stills glyph (105°) */}
            {(()=>{ const [x,y] = polar(632,416,79,105); return (
              <g transform={`translate(${x} ${y})`}>
                <rect x="-5" y="-3.4" width="10" height="6.8" rx="1.8" fill="none" stroke={PAPER} strokeWidth="1.6"/>
                <circle cx="0" cy="0" r="1.7" fill="none" stroke={PAPER} strokeWidth="1.4"/>
              </g> ); })()}
            {/* B&W (90°) */}
            {(()=>{ const [x,y] = polar(632,416,79,90); return (
              <text x={x} y={y+2.6} textAnchor="middle" fontSize="7.5" fontWeight={800} fill={PAPER} fontFamily="'JetBrains Mono',monospace">B&amp;W</text> ); })()}
            {/* movie glyph (75°) */}
            {(()=>{ const [x,y] = polar(632,416,79,75); return (
              <path d={`M${x-3.4} ${y-2.6} L${x-3.4} ${y+2.6} L${x+3.4} ${y} Z`} fill={PAPER}/> ); })()}
            <path d="M628 504 L636 504 L632 496 Z" fill={PAPER} opacity="0.9"/>
          </g>

          {/* ============ PRISM + VIEWFINDER ============ */}
          <g>
            <polygon points="458,286 566,286 612,358 412,358" fill={DARK} stroke={INK} strokeWidth="3"/>
            <polygon points="458,286 566,286 584,332 440,332" fill={CHAR} stroke={INK} strokeWidth="2.5"/>
            <text transform="rotate(180 512 314)" x="512" y="318" textAnchor="middle" fontSize="16" fontWeight={600} letterSpacing="3.5" fill={PAPER} opacity="0.9" fontFamily="'Instrument Serif',serif">NIKON</text>
            {/* shoe deck */}
            <rect x="456" y="334" width="108" height="52" rx="9" fill="#26282B" stroke={INK} strokeWidth="2.5"/>
            {/* accessory shoe rails + contacts */}
            <rect x="468" y="342" width="15" height="42" rx="3" fill={BEIGE} stroke={INK} strokeWidth="2"/>
            <rect x="541" y="342" width="15" height="42" rx="3" fill={BEIGE} stroke={INK} strokeWidth="2"/>
            <rect x="488" y="346" width="48" height="32" rx="3" fill={PLATE} stroke={INK} strokeWidth="1.8"/>
            <circle cx="512" cy="362" r="3.8" fill={MUSTARD} stroke={INK} strokeWidth="1.5"/>
            <circle cx="500" cy="354" r="1.7" fill={BEIGE}/>
            <circle cx="524" cy="354" r="1.7" fill={BEIGE}/>
            <circle cx="500" cy="370" r="1.7" fill={BEIGE}/>
            <circle cx="524" cy="370" r="1.7" fill={BEIGE}/>
            {/* stereo mic holes */}
            {[346,358,370].map(y=>(<g key={y}>
              <circle cx="430" cy={y} r="1.7" fill="#14161A"/>
              <circle cx="594" cy={y} r="1.7" fill="#14161A"/>
            </g>))}
            {/* viewfinder eyepiece */}
            <rect x="458" y="392" width="90" height="34" rx="17" fill="#1A1C1E" stroke={INK} strokeWidth="2.5"/>
            <rect x="470" y="398" width="66" height="22" rx="11" fill={NAVY} opacity="0.5" stroke={INK} strokeWidth="1.5"/>
            <line x1="480" y1="402" x2="492" y2="402" stroke={PAPER} strokeWidth="1.6" opacity="0.5" strokeLinecap="round"/>
            {/* diopter */}
            <circle cx="442" cy="409" r="5.5" fill={PLATE} stroke={INK} strokeWidth="1.8"/>
            <line x1="438.5" y1="409" x2="445.5" y2="409" stroke={INK} strokeWidth="1.6"/>
          </g>

          {/* ============ NIKKOR Z 40mm f/2 SE LENS ============ */}
          <g>
            {/* mount flange */}
            <rect x="372" y="244" width="280" height="38" rx="10" fill={PLATE} stroke={INK} strokeWidth="3"/>
            <rect x="380" y="252" width="264" height="24" rx="8" fill="none" stroke={PAPER} strokeWidth="1.4" strokeDasharray="4 6" opacity="0.5"/>
            <circle cx="396" cy="268" r="2" fill="#494D50"/>
            <circle cx="628" cy="268" r="2" fill="#494D50"/>
            {/* barrel */}
            <rect x="396" y="108" width="232" height="138" rx="6" fill={CHAR} stroke={INK} strokeWidth="3"/>
            <text x="512" y="136" textAnchor="middle" fontSize="11" fontWeight={700} fill={PAPER} fontFamily="'Space Grotesk',sans-serif" letterSpacing="2" opacity="0.92">NIKKOR Z</text>
            <text x="512" y="158" textAnchor="middle" fontSize="16" fontWeight={800} fill={PAPER} fontFamily="'Space Grotesk',sans-serif" letterSpacing="1.5">40mm f/2</text>
            <text x="512" y="174" textAnchor="middle" fontSize="8" fontWeight={600} fill={BEIGE} fontFamily="'JetBrains Mono',monospace" letterSpacing="2.5">SPECIAL EDITION</text>
            {/* focus scale window */}
            <rect x="424" y="192" width="176" height="28" rx="6" fill={DARK} stroke={INK} strokeWidth="1.5"/>
            <text x="512" y="210" textAnchor="middle" fontSize="9.5" fontWeight={600} fill={PAPER} opacity="0.75" fontFamily="'JetBrains Mono',monospace" letterSpacing="1">0.29 · 0.5 · 1 · 2 · ∞</text>
            {/* white lens-mount index dot */}
            <circle cx="512" cy="238" r="3.5" fill={PAPER}/>
            {/* silver accent ring */}
            <rect x="388" y="90" width="248" height="14" rx="4" fill={BEIGE} stroke={INK} strokeWidth="2"/>
            {/* knurled control ring */}
            <rect x="388" y="40" width="248" height="46" rx="10" fill={DARK} stroke={INK} strokeWidth="3"/>
            {stripes(394,44,236,38,26)}
            {/* front rim */}
            <rect x="412" y="16" width="200" height="20" rx="10" fill={CHAR} stroke={INK} strokeWidth="2.5"/>
            <rect x="428" y="20" width="168" height="12" rx="6" fill={DARK}/>
          </g>

          {/* ============ DIAL 01 · ISO ============ */}
          <g className="dialg" style={{transformOrigin:'272px 414px'}} opacity={dim(1)} onMouseEnter={tip(1)} onMouseLeave={tip(null)} onClick={toggle(1)}>
            <circle cx="272" cy="414" r="78" fill={DARK} stroke={INK} strokeWidth="3"/>
            <Ticks cx={272} cy={414} r={76} len={9} n={32} />
            <circle cx="272" cy="414" r="64" fill={PAPER} stroke={INK} strokeWidth="2.5"/>
            <RingText cx={272} cy={414} r={49} start={-150} step={30} items={[
              {t:'C',c:ORANGE},{t:'100'},{t:'200'},{t:'400'},{t:'800'},{t:'1600'},
              {t:'3200'},{t:'6400'},{t:'12800',s:6},{t:'25600',s:6},{t:'51200',s:6},{t:'H1',c:ORANGE},
            ]}/>
            <circle cx="272" cy="414" r="11" fill={PLATE} stroke={INK} strokeWidth="2"/>
            <circle cx="272" cy="414" r="3.5" fill={BEIGE} stroke={INK} strokeWidth="1"/>
            <rect x="266" y="328" width="12" height="16" rx="5" fill={MUSTARD} stroke={INK} strokeWidth="2"/>
          </g>

          {/* ============ DIAL 02 · SHUTTER SPEED ============ */}
          <g className="dialg" style={{transformOrigin:'632px 416px'}} opacity={dim(2)} onMouseEnter={tip(2)} onMouseLeave={tip(null)} onClick={toggle(2)}>
            <circle cx="632" cy="416" r="74" fill={DARK} stroke={INK} strokeWidth="3"/>
            <Ticks cx={632} cy={416} r={72} len={9} n={32} />
            <circle cx="632" cy="416" r="61" fill={PAPER} stroke={INK} strokeWidth="2.5"/>
            <RingText cx={632} cy={416} r={46} start={-170} step={360/14} items={[
              {t:'STEP',c:ORANGE,s:6},{t:'8000',s:6},{t:'4000',s:6},{t:'2000',s:6},{t:'1000',s:6},
              {t:'500'},{t:'250'},{t:'125'},{t:'60'},{t:'30',c:ORANGE},{t:'4',c:ORANGE},{t:'B'},{t:'T'},{t:'X'},
            ]}/>
            <circle cx="632" cy="416" r="10.5" fill={PLATE} stroke={INK} strokeWidth="2"/>
            <circle cx="632" cy="416" r="3.2" fill={BEIGE} stroke={INK} strokeWidth="1"/>
            <rect x="626" y="334" width="12" height="16" rx="5" fill={MUSTARD} stroke={INK} strokeWidth="2"/>
          </g>

          {/* ============ ON/OFF COLLAR + SHUTTER BUTTON ============ */}
          <g>
            <circle cx="748" cy="342" r="25" fill={PLATE} stroke={INK} strokeWidth="2.5"/>
            <Ticks cx={748} cy={342} r={23.5} len={4.5} n={18} op={0.5} sw={2}/>
            <circle cx="748" cy="342" r="13" fill={BEIGE} stroke={INK} strokeWidth="2.5"/>
            <circle cx="748" cy="342" r="4.5" fill="none" stroke={INK} strokeWidth="1.8"/>
            {/* power lever */}
            <g transform="rotate(38 748 342)">
              <rect x="766" y="338" width="16" height="8" rx="4" fill={DARK} stroke={INK} strokeWidth="2"/>
              <circle cx="779" cy="342" r="1.6" fill={PAPER}/>
            </g>
            <text x="710" y="378" textAnchor="middle" fontSize="7" fontWeight={800} fill={PAPER} opacity="0.85" fontFamily="'JetBrains Mono',monospace">OFF</text>
            <text x="783" y="378" textAnchor="middle" fontSize="7" fontWeight={800} fill={PAPER} opacity="0.85" fontFamily="'JetBrains Mono',monospace">ON</text>
          </g>

          {/* ============ MOVIE RECORD BUTTON ============ */}
          <g>
            <circle cx="780" cy="328" r="9.5" fill={DARK} stroke={INK} strokeWidth="2"/>
            <circle cx="780" cy="328" r="5.5" fill={RED}/>
            <circle cx="777.8" cy="325.8" r="1.6" fill={PAPER} opacity="0.5"/>
          </g>

          {/* ============ TOP LCD (aperture readout) ============ */}
          <g>
            <rect x="726" y="392" width="46" height="20" rx="6" fill="#0F1214" stroke={INK} strokeWidth="2.5"/>
            <text x="749" y="405.5" textAnchor="middle" fontSize="11" fontWeight={600} fill={LCDGLASS} fontFamily="'JetBrains Mono',monospace">f/2.8</text>
          </g>

          {/* ============ DIAL 04 · EXPOSURE COMPENSATION ============ */}
          <g className="dialg" style={{transformOrigin:'726px 494px'}} opacity={dim(4)} onMouseEnter={tip(4)} onMouseLeave={tip(null)} onClick={toggle(4)}>
            <circle cx="726" cy="494" r="45" fill={DARK} stroke={INK} strokeWidth="2.5"/>
            <Ticks cx={726} cy={494} r={43.5} len={5.5} n={24} op={0.45} sw={2}/>
            <circle cx="726" cy="494" r="38" fill={PAPER} stroke={INK} strokeWidth="2.5"/>
            <RingText cx={726} cy={494} r={27} start={-135} step={45} items={[
              {t:'C',c:ORANGE},{t:'-3'},{t:'-2'},{t:'-1'},{t:'0',c:CHAR},{t:'+1'},{t:'+2'},{t:'+3'},
            ]}/>
            <circle cx="726" cy="494" r="7" fill={PLATE} stroke={INK} strokeWidth="2"/>
            <rect x="721" y="441" width="10" height="14" rx="4" fill={MUSTARD} stroke={INK} strokeWidth="2"/>
          </g>

          {/* ============ REAR COMMAND DIAL (peeks from the back edge) ============ */}
          <g clipPath="url(#backclip)">
            <circle cx="736" cy="570" r="13" fill={DARK} stroke={INK} strokeWidth="2.5"/>
            <Ticks cx={736} cy={570} r={11.5} len={4} n={10} op={0.6} sw={2}/>
          </g>

          {/* ============ Zƒ SCRIPT LOGO ============ */}
          <text x="246" y="535" fontSize="27" fontStyle="italic" fontWeight={600} fill={PAPER} opacity="0.92" fontFamily="'Instrument Serif',serif" letterSpacing="1">Zƒ</text>

          {/* ============ CALLOUTS ============ */}
          <Callout n={1} ax={212} ay={464} lx={128} ly={500} side="l" title="ISO DIAL"           sub="100 → 51200 · C" />
          <Callout n={2} ax={706} ay={416} lx={940} ly={396} side="r" title="SHUTTER SPEED DIAL" sub="1/8000 → 4s · B · T · X" />
          <Callout n={3} ax={820} ay={321} lx={1000} ly={246} side="r" title="APERTURE DIAL"      sub="Front dial · f/2 → f/16" />
          <Callout n={4} ax={773} ay={494} lx={964} ly={560} side="r" title="EXPOSURE COMP DIAL" sub="−3 → +3 · C" />
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PARTS.map(i=>(
          <button key={i.n} onMouseEnter={tip(i.n)} onMouseLeave={tip(null)} onClick={toggle(i.n)}
            className={`flex items-center gap-2.5 min-h-[48px] rounded-[10px] border-[1.5px] border-[#2F3133] bg-white px-3 py-2 text-left shadow-[1.5px_1.5px_0px_#2F3133] transition hover:-translate-y-[2px] active:translate-y-0 ${on(i.n)?'ring-[3px] ring-[#F4B23C] bg-[#FFF8EC]':''}`}>
            <span className="h-6 w-6 shrink-0 rounded-full border-[1.5px] border-[#2F3133] flex items-center justify-center text-[11px] font-black" style={{background:i.c, color: i.w?'#FAF8F3':'#2F3133'}}>{i.n}</span>
            <span className="leading-tight min-w-0"><span className="sans block text-[11px] font-black tracking-wide text-[#2F3133] truncate">{i.t}</span><span className="sans block text-[10px] mut font-medium truncate">{i.d}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
