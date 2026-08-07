import type { AfKey } from '../lib/data';

const INK = '#2F3133';

/*
  Authentic Nikon Zf AF-Area mode symbols.
  Source of truth: Nikon Zf Online Manual — AF-Area Mode
  (https://onlinemanual.nikonimglib.com/zf/en/focus_guid-c17f653e-5bfd-dc34-6d1b-f69cdc52caa7_25.html)

  Design rules (matching Nikon’s official UI):
  • All focus-area frames are open corner-bracket rectangles (never fully closed).
  • A solid centre square marks the selected focus point.
  • Dynamic-area adds four small outlined helper squares around the centre.
  • Wide-area frames are landscape rectangles; L is taller / larger than S.
  • Subscript labels (S / M / L / C1 / C2) sit at the lower-right of the glyph.
  • 3D-tracking shows bracket frame with “3D” centred inside.
  • Auto-area AF uses a solid filled frame with a lighter inner rectangle and centre point.
  • Subject-tracking AF (video) uses an open reticle with a small tracking diamond.
  • Manual focus uses a circular reticle with “MF”.
  • Canvas: 48 × 48 (consistent with existing component)
*/

export default function AfIcon({ k, size = 34 }: { k: AfKey; size?: number }){
  const L = { stroke: INK, fill: 'none', strokeLinecap: 'square' as const, strokeLinejoin: 'miter' as const };

  /* Open corner-bracket rectangle */
  const Frame = ({x,y,w,h,t=5,sw=2.2}:{x:number;y:number;w:number;h:number;t?:number;sw?:number}) => (
    <g {...L} strokeWidth={sw}>
      {/* top-left */}
      <path d={`M${x} ${y+t} L${x} ${y} L${x+t} ${y}`} />
      {/* top-right */}
      <path d={`M${x+w-t} ${y} L${x+w} ${y} L${x+w} ${y+t}`} />
      {/* bottom-right */}
      <path d={`M${x+w} ${y+h-t} L${x+w} ${y+h} L${x+w-t} ${y+h}`} />
      {/* bottom-left */}
      <path d={`M${x+t} ${y+h} L${x} ${y+h} L${x} ${y+h-t}`} />
    </g>
  );

  const Sub = ({t}:{t:string}) => (
    <text x="45" y="44" textAnchor="end" fontSize="10" fontWeight={700} fill={INK}
      fontFamily="'Space Grotesk',sans-serif">{t}</text>
  );

  const Point = ({s=7}:{s?:number}) => <rect x={24-s/2} y={22-s/2} width={s} height={s} fill={INK}/>;

  const body = () => {
    switch(k){

      /* PINPOINT AF — smallest open bracket, smallest centre square */
      case 'pinpoint':
        return (<>
          <Frame x={19} y={17} w={10} h={10} t={3} sw={2} />
          <rect x={23.5} y={21.5} width={3} height={3} fill={INK} />
        </>);

      /* SINGLE-POINT AF — standard open bracket, solid centre */
      case 'single':
        return (<>
          <Frame x={16} y={12} w={16} h={16} t={5} sw={2.4} />
          <Point s={8} />
        </>);

      /* DYNAMIC-AREA AF — frame + centre + four small outlined helpers */
      case 'dynS':
      case 'dynM':
      case 'dynL': {
        const half = k==='dynS' ? 11 : k==='dynM' ? 14 : 17;
        const gap  = k==='dynS' ? 7  : k==='dynM' ? 9  : 11;
        return (<>
          <Frame x={24-half} y={22-half} w={half*2} h={half*2} t={5} sw={2.2} />
          <Point s={8} />
          <g {...L} strokeWidth={1.6}>
            {/* helper squares at N, S, E, W */}
            <rect x={24-2.5} y={19-gap} width="5" height="5" />
            <rect x={24-2.5} y={19+gap} width="5" height="5" />
            <rect x={19-gap} y={21.5} width="5" height="5" />
            <rect x={19+gap} y={21.5} width="5" height="5" />
          </g>
          <Sub t={k==='dynS'?'S':k==='dynM'?'M':'L'} />
        </>);
      }

      /* WIDE-AREA AF — landscape open bracket, centre point */
      case 'wideS':
      case 'wideL':
      case 'wideC1':
      case 'wideC2': {
        const h = k==='wideS' ? 16 : 24;
        const w = 32;
        const x = 24 - w/2, y = 22 - h/2;
        const label = k==='wideC1' ? 'C1' : k==='wideC2' ? 'C2' : k==='wideS' ? 'S' : 'L';
        return (<>
          <Frame x={x} y={y} w={w} h={h} t={6} sw={2.2} />
          <Point s={8} />
          <Sub t={label} />
        </>);
      }

      /* 3D-TRACKING — open bracket with centred “3D” label */
      case '3d':
        return (<>
          <Frame x={16} y={12} w={16} h={16} t={5} sw={2.4} />
          <text x="24" y="28" textAnchor="middle" fontSize="13" fontWeight={700} fill={INK}
            fontFamily="'Space Grotesk',sans-serif">3D</text>
        </>);

      /* SUBJECT-TRACKING AF — open reticle with tracking diamond / arrow */
      case 'subject':
        return (<>
          <Frame x={16} y={12} w={16} h={16} t={5} sw={2.2} />
          <rect x={21} y={16} width="6" height="6" fill="none" stroke={INK} strokeWidth="2" transform="rotate(45 24 19)" />
          <Point s={5} />
        </>);

      /* AUTO-AREA AF — solid filled frame (close to full box), inner light area, centre point */
      case 'auto':
        return (<>
          <rect x={10} y={10} width={28} height={24} rx={3} fill={INK} />
          <rect x={13} y={13} width={22} height={18} rx={1.5} fill="#FAF8F3" />
          <Point s={7} />
        </>);

      /* MANUAL FOCUS — circular reticle with MF */
      case 'mf':
        return (<>
          <circle cx="24" cy="22" r="13" fill="none" stroke={INK} strokeWidth="2.4" />
          <text x="24" y="27" textAnchor="middle" fontSize="13" fontWeight={700} fill={INK}
            fontFamily="'Space Grotesk',sans-serif">MF</text>
        </>);
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-hidden="true" className="shrink-0 block" style={{overflow:'visible'}}>
      {body()}
    </svg>
  );
}
