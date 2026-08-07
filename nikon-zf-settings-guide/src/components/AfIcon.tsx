import type { AfKey } from '../lib/data';

const INK = '#2F3133';

/*
  AF-area mode glyphs, matched to the Nikon Zf reference guide icon set.

  Shared construction:
   • Focus-area frames are drawn as four corner ticks (never a closed box).
   • A solid centre square marks the selected focus point.
   • Dynamic-area adds small outlined helper points around the centre.
   • Wide-area frames are landscape rectangles; L is taller than S.
   • S / M / L / C1 / C2 sit as a small subscript at the lower right.
   • 3D-tracking is literally [3D]; Subject-tracking is a winged reticle;
     Auto-area is a solid filled frame.
  Canvas: 48 x 48
*/
export default function AfIcon({ k, size = 34 }: { k: AfKey; size?: number }){
  const L = { stroke: INK, fill: 'none', strokeLinecap: 'butt' as const, strokeLinejoin: 'miter' as const };

  // four corner ticks of a rectangle
  const Frame = ({x,y,w,h,t,sw=2.4}:{x:number;y:number;w:number;h:number;t:number;sw?:number}) => (
    <g {...L} strokeWidth={sw}>
      <path d={`M${x} ${y+t} L${x} ${y} L${x+t} ${y}`}/>
      <path d={`M${x+w-t} ${y} L${x+w} ${y} L${x+w} ${y+t}`}/>
      <path d={`M${x+w} ${y+h-t} L${x+w} ${y+h} L${x+w-t} ${y+h}`}/>
      <path d={`M${x+t} ${y+h} L${x} ${y+h} L${x} ${y+h-t}`}/>
    </g>
  );

  const Sub = ({t}:{t:string}) => (
    <text x="46" y="45" textAnchor="end" fontSize="13" fontWeight={700} fill={INK}
      fontFamily="'Space Grotesk',sans-serif">{t}</text>
  );

  // solid centre focus point
  const Point = ({s=7}:{s?:number}) => <rect x={24-s/2} y={22-s/2} width={s} height={s} fill={INK}/>;

  const body = () => {
    switch(k){

      /* PINPOINT AF — tight frame, very small centre point */
      case 'pinpoint':
        return (<>
          <Frame x={15} y={13} w={18} h={18} t={5}/>
          <rect x="22" y="20" width="4" height="4" fill={INK}/>
        </>);

      /* SINGLE-POINT AF — [ ▪ ] plain brackets, one point */
      case 'single':
        return (<>
          <g {...L} strokeWidth={2.4}>
            <path d="M16 12 L11 12 L11 32 L16 32"/>
            <path d="M32 12 L37 12 L37 32 L32 32"/>
          </g>
          <Point s={8}/>
        </>);

      /* DYNAMIC-AREA AF — frame + centre point + outlined helper points */
      case 'dynS':
      case 'dynM':
      case 'dynL': {
        const half = k==='dynS' ? 12 : k==='dynM' ? 15 : 18;
        const gap  = k==='dynS' ? 8  : k==='dynM' ? 10 : 12;
        return (<>
          <Frame x={24-half} y={22-half} w={half*2} h={half*2} t={5}/>
          <Point s={8}/>
          <g {...L} strokeWidth={1.8}>
            <rect x={24-gap-2.5} y={19.5} width="5" height="5"/>
            <rect x={24+gap-2.5} y={19.5} width="5" height="5"/>
            <rect x={21.5} y={22-gap-2.5} width="5" height="5"/>
            <rect x={21.5} y={22+gap-2.5} width="5" height="5"/>
          </g>
          <Sub t={k==='dynS'?'S':k==='dynM'?'M':'L'}/>
        </>);
      }

      /* WIDE-AREA AF — landscape frame, centre point. L taller than S. */
      case 'wideS':
      case 'wideL':
      case 'wideC1':
      case 'wideC2': {
        const h = k==='wideS' ? 16 : 24;
        const w = 34;
        const x = 24 - w/2, y = 22 - h/2;
        const label = k==='wideC1' ? 'C1' : k==='wideC2' ? 'C2' : k==='wideS' ? 'S' : 'L';
        return (<>
          <Frame x={x} y={y} w={w} h={h} t={6}/>
          <Point s={8}/>
          <Sub t={label}/>
        </>);
      }

      /* 3D-TRACKING — [3D] */
      case '3d':
        return (<>
          <g {...L} strokeWidth={2.4}>
            <path d="M15 10 L10 10 L10 34 L15 34"/>
            <path d="M33 10 L38 10 L38 34 L33 34"/>
          </g>
          <text x="24" y="29" textAnchor="middle" fontSize="15" fontWeight={700} fill={INK}
            fontFamily="'Space Grotesk',sans-serif">3D</text>
        </>);

      /* SUBJECT-TRACKING AF — winged reticle */
      case 'subject':
        return (<>
          <g {...L} strokeWidth={2.4}>
            <path d="M2 22 L13 22"/>
            <path d="M35 22 L46 22"/>
            <path d="M13 14 L13 30"/>
            <path d="M35 14 L35 30"/>
          </g>
          <rect x="17" y="15" width="14" height="14" fill="none" stroke={INK} strokeWidth="2.4"/>
          <Point s={6}/>
        </>);

      /* AUTO-AREA AF — solid filled frame */
      case 'auto':
        return (<>
          <rect x="7" y="10" width="34" height="24" rx="3" fill={INK}/>
          <rect x="12" y="15" width="24" height="14" rx="1.5" fill="#FAF8F3"/>
          <Point s={8}/>
        </>);

      /* MANUAL FOCUS */
      case 'mf':
        return (<>
          <circle cx="24" cy="22" r="14" fill="none" stroke={INK} strokeWidth="2.4"/>
          <text x="24" y="28" textAnchor="middle" fontSize="15" fontWeight={700} fill={INK}
            fontFamily="'Space Grotesk',sans-serif">MF</text>
        </>);
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-hidden="true" className="shrink-0 block">
      {body()}
    </svg>
  );
}
