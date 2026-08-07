import { useMemo, useState } from 'react';
import Shell, { SectionHead, PageHero, BtnLink } from '../components/Shell';
import AfIcon from '../components/AfIcon';
import { SCENE_MAP, getFocusSet, type FocusSet, type Lens, type Mode, type Env, type Time } from '../lib/data';

const MOTIONS = ["Still • No Motion","Walking","Running","Dancing","Vehicles","Sports","Wildlife Action"];
const SUBJECTS = ["Human","Bird","Animal","Product","Food","Vehicle","Building","Nature","Machinery","Document"];

type Req = {
  aperture: string; shutter: string; iso: string; focal: string;
  focus: string; wb: string; drive: string; stab: string; note: string;
};

/* Baseline requirement per scene — mirrors the guide's logic */
function requiredFor(scene: string, lens: Lens, time: Time, env: Env, mode: Mode, motion: string): Req {
  const s = scene.toLowerCase();
  const prime = lens === '40mm';
  const night = time === 'night';
  const indoor = env === 'indoor';

  let aperture = prime ? 'f/4 to f/5.6' : 'f/5.6 to f/8';
  let shutter = night ? '1/200' : '1/500';
  let iso = night ? '1600 to 6400' : (indoor ? '400 to 1000' : '100 to 400');
  let focal = prime ? '40mm' : '40 to 70mm';
  let focus = 'AF-C Auto Area';
  let wb = 'Auto';
  let drive = 'Single';
  let stab = 'VR on • handheld';
  let note = 'Keep background 2m back → cleaner look.';

  const set = (o: Partial<Req>) => {
    aperture = o.aperture ?? aperture; shutter = o.shutter ?? shutter; iso = o.iso ?? iso;
    focal = o.focal ?? focal; focus = o.focus ?? focus; wb = o.wb ?? wb;
    drive = o.drive ?? drive; stab = o.stab ?? stab; note = o.note ?? note;
  };

  if (s.includes('interview')) set({
    aperture: prime ? 'f/2 to f/2.8' : 'f/4', shutter: mode==='video' ? '1/50 at 24p' : '1/200',
    iso: night ? '800 to 2000' : '400 to 1000', focal: prime ? '40mm' : '50 to 85mm',
    focus: 'Eye Detect • Human', wb: 'Auto or 4000K with LED', stab: 'Tripod • IBIS off',
    note: 'Light 45° on one side + soft fill on the other.' });
  else if (s.includes('group portrait')) set({
    aperture: prime ? 'f/4 to f/5.6' : 'f/5.6 to f/8', shutter: night ? '1/200' : '1/400',
    iso: night ? '2000 to 6400' : (indoor ? '800 to 1600' : '100 to 400'),
    focal: prime ? '40mm at f/4' : '35 to 50mm', focus: 'Wide Area AF L',
    note: 'Focus on front row → f/8 if 3 rows.' });
  else if (s.includes('portrait')) set({
    aperture: prime ? 'f/2 to f/2.8' : 'f/4 to f/5.6', shutter: night ? '1/250' : '1/640',
    iso: night ? '1600 to 5000' : (indoor ? '400 to 1000' : '100 to 400'),
    focal: prime ? '40mm • half body' : '85 to 120mm', focus: 'Eye Detect • Human',
    note: 'f/2.2 is sharper than f/2 → still blurry background.' });
  else if (s.includes('product')) set({
    aperture: prime ? 'f/5.6 to f/8' : 'f/8 to f/11', shutter: '1/125 • tripod',
    iso: '100 to 400', focal: prime ? '40mm plus crop' : '70 to 100mm',
    focus: 'Pinpoint AF', wb: '5500K', drive: '2s timer', stab: 'Tripod • IBIS off',
    note: 'Tripod + timer → focus by hand for best result.' });
  else if (s.includes('food')) set({
    aperture: prime ? 'f/2.8 to f/4' : 'f/4 to f/5.6', shutter: night ? '1/160' : '1/250',
    focal: prime ? '40mm overhead' : '50 to 80mm', focus: 'Wide-S AF', wb: 'Auto warm',
    note: 'Window light on one side + white card on the other.' });
  else if (s.includes('macro')) set({
    aperture: prime ? 'f/5.6 to f/8' : 'f/8 to f/11', shutter: '1/500',
    focal: prime ? '40mm plus tube' : '120mm • 0.39x', focus: 'MF with peaking',
    note: 'Very little is sharp → lean in slowly and shoot a burst.' });
  else if (s.includes('architecture') || s.includes('interior') || s.includes('office')) set({
    aperture: 'f/8 to f/11', shutter: night ? '1 to 5 sec • tripod' : '1/125 • tripod',
    iso: night ? '100 to 800' : '100 to 400', focal: prime ? '40mm detail' : '24 to 35mm',
    focus: 'Single AF', drive: '2s timer', stab: 'Tripod • IBIS off',
    note: 'Keep the camera level → shoot at −0.7 / 0 / +0.7.' });
  else if (s.includes('concert') || s.includes('stage') || s.includes('festival')) set({
    aperture: prime ? 'f/2 to f/2.5' : 'f/4 wide open', shutter: '1/320 to 1/500',
    iso: '3200 to 12800', focal: prime ? '40mm close' : '70 to 120mm',
    focus: 'Eye AF • low light', drive: 'Continuous',
    note: 'Stage lights blink → use 1/100 (India/Europe) or 1/125 (US/Japan).' });
  else if (s.includes('event') || s.includes('party')) set({
    aperture: prime ? 'f/2 to f/2.8' : 'f/4', shutter: night ? '1/200' : '1/320',
    focus: 'Auto Area • People', drive: 'Continuous',
    note: 'Point flash at the ceiling → set it to −0.7.' });
  else if (s.includes('street')) set({
    aperture: 'f/5.6 to f/8', shutter: night ? '1/320 at f/2' : '1/1000',
    focal: prime ? '40mm' : '35 to 50mm', focus: 'Zone focus at 3m',
    note: 'Focus at 3m + f/8 → almost everything stays sharp.' });
  else if (s.includes('wildlife') || s.includes('bird')) set({
    aperture: prime ? 'f/2.8 to f/4' : 'f/4 to f/5.6', shutter: s.includes('bird') ? '1/3200' : '1/2000 or faster',
    iso: night ? '3200 to 12800' : '400 to 1600',
    focal: prime ? '40mm • environmental' : '120mm plus DX crop', focus: 'Animal Detect',
    drive: 'Continuous 20fps',
    note: 'Use the DX crop for extra reach and enable pre-release capture for take-offs.' });
  else if (s.includes('sport')) set({
    aperture: prime ? 'f/2 to f/2.8' : 'f/4', shutter: '1/1000 to 1/2000',
    focal: prime ? '40mm courtside' : '70 to 120mm', focus: '3D Tracking • People',
    drive: 'Continuous high',
    note: 'Back-button focus keeps tracking alive between shots.' });
  else if (s.includes('landscape') || s.includes('mountain')) set({
    aperture: 'f/8 to f/11', shutter: night ? '4 to 30 sec • tripod' : '1/125 • tripod',
    iso: night ? '100 to 800' : '100', focal: prime ? '40mm pano' : '24 to 35mm',
    focus: 'AF-S at infinity', wb: 'Daylight 5200K', drive: '2s timer', stab: 'Tripod • IBIS off',
    note: 'Focus about one third into the scene for front-to-back sharpness.' });
  else if (s.includes('cityscape') || s.includes('night architecture')) set({
    aperture: 'f/8 to f/11', shutter: night ? '2 to 15 sec • tripod' : '1/250',
    iso: '100 to 400', focus: 'AF-S at infinity', drive: '2s timer', stab: 'Tripod • IBIS off',
    note: 'Blue hour, about 20 minutes after sunset, balances sky and city lights.' });
  else if (s.includes('astro') || s.includes('milky')) set({
    aperture: prime ? 'f/2' : 'f/4', shutter: prime ? '10 to 13 sec' : '15 to 20 sec',
    iso: '3200 to 6400', focus: 'MF on a bright star', wb: '3800K',
    drive: '2s timer', stab: 'Tripod • IBIS off',
    note: 'Magnify a bright star to 100% and focus manually. Shoot several frames to stack.' });
  else if (s.includes('moon')) set({
    aperture: 'f/8 to f/11', shutter: '1/100 at ISO 100', iso: '100 to 400',
    focal: prime ? '40mm • heavy crop' : '120mm plus DX crop', focus: 'MF magnified',
    wb: 'Daylight', drive: '2s timer', stab: 'Tripod • IBIS off',
    note: 'The moon is a sunlit subject. Expose about −0.7 EV to keep crater detail.' });
  else if (s.includes('light trail') || s.includes('long exposure')) set({
    aperture: 'f/8 to f/11', shutter: '4 to 30 sec', iso: '100 to 400',
    focus: 'MF at about 5m', drive: '2s timer', stab: 'Tripod • IBIS off',
    note: 'Start at 8 seconds and adjust until the trails are long enough.' });
  else if (s.includes('waterfall') || s.includes('nature')) set({
    aperture: 'f/11 plus ND', shutter: '0.5 to 4 sec', iso: '100',
    focus: 'MF', wb: 'Cloudy', drive: '2s timer', stab: 'Tripod • IBIS off',
    note: 'Focus first, then fit the ND filter so autofocus is not fighting the dark glass.' });
  else if (s.includes('beach')) set({
    aperture: 'f/8 to f/11', shutter: '1/1000', iso: '100', wb: '5200K',
    note: 'Bright sand fools the meter. Dial in about −0.7 EV and use a polariser.' });
  else if (s.includes('travel') || s.includes('documentary') || s.includes('lifestyle') || s.includes('street-style')) set({
    aperture: prime ? 'f/2.8 to f/5.6' : 'f/4 to f/5.6', shutter: night ? '1/250' : '1/500',
    focus: 'Auto Area • People',
    note: 'Keep it simple and stay ready. Aperture priority with Auto ISO handles most of it.' });

  // subject motion overrides the shutter requirement
  if (motion && motion !== 'Still • No Motion') {
    const table: Record<string,string> = {
      'Walking': '1/250 minimum', 'Running': '1/500 minimum', 'Dancing': '1/500 to 1/800',
      'Vehicles': '1/1000 to 1/2000', 'Sports': '1/1000 minimum', 'Wildlife Action': '1/2000 to 1/3200'
    };
    shutter = table[motion] ?? shutter;
    drive = 'Continuous';
    focus = focus.includes('MF') ? focus : 'AF-C tracking';
  }
  if (mode === 'video') {
    shutter = '1/50 at 24p • 1/60 at 30p • 1/120 at 60p';
    drive = 'Movie record';
    note = 'Lock shutter with the 180° rule first, then set aperture, then ISO.';
  }
  return { aperture, shutter, iso, focal, focus, wb, drive, stab, note };
}

/* Symptom catalogue */
type Symptom = { id: string; label: string; group: string };
const SYMPTOMS: Symptom[] = [
  { id:'motionblur',  label:'Moving subject is blurry',   group:'NOT SHARP' },
  { id:'shake',       label:'Whole photo is shaky',       group:'NOT SHARP' },
  { id:'missfocus',   label:'Focus is on the wrong thing',group:'NOT SHARP' },
  { id:'softall',     label:'Part of subject is soft',    group:'NOT SHARP' },
  { id:'dark',        label:'Too dark',                   group:'LIGHT' },
  { id:'bright',      label:'Too bright',                 group:'LIGHT' },
  { id:'noise',       label:'Grainy • dotty',             group:'LIGHT' },
  { id:'flat',        label:'Looks flat • dull',          group:'LIGHT' },
  { id:'nobokeh',     label:'Background is not blurry',   group:'LOOK' },
  { id:'colour',      label:'Colours look orange or blue',group:'LOOK' },
  { id:'banding',     label:'Dark bands • flicker',       group:'LOOK' },
  { id:'stutter',     label:'Video looks jumpy',          group:'LOOK' },
];

type Finding = { title:string; cause:string; fix:string[]; dial:string; tone:'orange'|'navy'|'char' };

function diagnose(ids: string[], req: Req, lens: Lens, mode: Mode, time: Time, motion: string, fs?: FocusSet|null): Finding[] {
  const out: Finding[] = [];
  const prime = lens === '40mm';
  const night = time === 'night';
  const has = (k:string)=> ids.includes(k);

  if (has('motionblur')) out.push({
    title:'Shutter is too slow', tone:'orange',
    cause:`The subject moves faster than your shutter${motion && motion!=='Still • No Motion' ? ` → ${motion.toLowerCase()} needs a fast one` : ''}.`,
    fix:[`Set shutter to ${req.shutter}.`,'Hold the button down → shoot a burst.','Use AF-C so focus follows.','Too dark? Open aperture first, ISO last.'],
    dial:`Shutter → ${req.shutter}`
  });
  if (has('shake')) out.push({
    title:'Your hands moved', tone:'navy',
    cause:`Shutter was too slow to hold by hand. ${prime?'40mm needs 1/40 or faster':'120mm needs 1/125 or faster'}.`,
    fix:[prime?'Use 1/60 or faster by hand.':'Use 1/125 or faster by hand.','Turn VR on. Keep elbows in.','On a tripod → use the 2s timer.','On a tripod → turn VR off.'],
    dial:'Shutter → 1/60 or faster'
  });
  if (has('missfocus')) out.push({
    title:'Camera picked the wrong spot', tone:'navy',
    cause:'The focus area was too big, so it grabbed the nearest thing.',
    fix:[
      `Focus mode → ${fs?.focusType ?? 'AF-C'}.`,
      `AF-area → ${fs?.afArea ?? 'Single-point AF'}.`,
      `Subject detection → ${fs?.detect ?? 'Auto'}.`,
      night ? 'Dark? Aim at a bright edge.' : 'Half press → check the box is on your subject.'
    ],
    dial:`AF-area → ${fs?.afArea ?? 'Single-point AF'}`
  });
  if (has('softall')) out.push({
    title:'Not enough is in focus', tone:'char',
    cause:'A wide aperture keeps only a thin slice sharp.',
    fix:['Close down to f/5.6 or f/8.','Step back a little.','People → focus on the near eye.','Groups → line them up side by side.'],
    dial:'Aperture → f/5.6 to f/8'
  });
  if (has('dark')) out.push({
    title:'Not enough light', tone:'orange',
    cause:'Your settings are not letting in enough light.',
    fix:[`1. Open aperture to ${prime?'f/2':'f/4'}.`,`2. Slow shutter, but not past ${req.shutter}.`,`3. Raise ISO to ${req.iso}.`,'Snow or white wall? Add +0.7.'],
    dial:'Aperture → Shutter → ISO'
  });
  if (has('bright')) out.push({
    title:'Too much light', tone:'orange',
    cause:'Bright parts turn pure white and cannot be fixed later.',
    fix:['Set −0.7 on the exposure dial.','Use a faster shutter, or close the aperture.','Drop ISO to 100.','Very sunny? Use a dark (ND) filter.'],
    dial:'Exposure → −0.7'
  });
  if (has('noise')) out.push({
    title:'ISO is too high', tone:'navy',
    cause:'ISO went up before aperture and shutter were opened.',
    fix:[`Open to ${prime?'f/2':'f/4'} first.`,'Slow the shutter as much as the subject allows.','Add light → window, lamp, or white card.',`Keep ISO within ${req.iso}.`],
    dial:`ISO → ${req.iso}`
  });
  if (has('flat')) out.push({
    title:'The light is flat', tone:'char',
    cause:'Light hits the subject straight on → no shadow, no depth.',
    fix:['Move so light comes from the side.','Shoot near sunrise or sunset.','Put a dark background behind a bright subject.','Add a bit of contrast after.'],
    dial:'Move → side light'
  });
  if (has('nobokeh')) out.push({
    title:'Background stays sharp', tone:'navy',
    cause:'Blur needs a wide aperture + long lens + distance.',
    fix:[prime?'Open the 40mm to f/2.':'Zoom to 120mm at f/4.','Get closer to your subject.','Move the subject 2m away from the background.','Do not use wide focal lengths for people.'],
    dial:`Aperture → ${prime?'f/2':'f/4 at 120mm'}`
  });
  if (has('colour')) out.push({
    title:'Colours are off', tone:'char',
    cause:'Auto white balance is guessing under mixed lights.',
    fix:[`Set white balance to ${req.wb}.`,'Indoor lamps → try 3200K.','Shade → try 7000K.','Shoot RAW → easy to fix later.'],
    dial:`White balance → ${req.wb}`
  });
  if (has('banding')) out.push({
    title:'Lights are flickering', tone:'orange',
    cause:'Indoor lights blink fast. A wrong shutter shows dark bands.',
    fix:['Use 1/100 (India, Europe, Asia — 50Hz).','Use 1/125 (US, Japan — 60Hz).','Turn on anti-flicker in the menu.','Do not use very fast shutter indoors.'],
    dial:'Shutter → 1/100 (India)'
  });
  if (has('stutter')) out.push({
    title:'Video shutter is wrong', tone:'navy',
    cause:'Video looks smooth when shutter is double the frame rate.',
    fix:['24p → 1/50','30p → 1/60','60p → 1/120','Too bright outside? Use a dark (ND) filter.','Pan slowly.'],
    dial:'Shutter → 1/50 at 24p'
  });

  if (mode==='video' && !has('stutter') && ids.length>0) out.push({
    title:'Video note', tone:'char',
    cause:'In video the shutter is fixed. You cannot move it freely.',
    fix:['Set shutter first → double the frame rate.','Use a dark (ND) filter outside.','Then aperture, then ISO.'],
    dial:'Shutter → 1/50 at 24p'
  });

  return out;
}

const TONE = { orange:'#C64F0E', navy:'#00365A', char:'#2F3133' } as const;

export default function Diagnoser(){
  const [lens, setLens] = useState<Lens|null>(null);
  const [mode, setMode] = useState<Mode|null>(null);
  const [env, setEnv] = useState<Env|null>(null);
  const [time, setTime] = useState<Time|null>(null);
  const [scene, setScene] = useState<string|null>(null);
  const [motion, setMotion] = useState<string>('Still • No Motion');
  const [subjectType, setSubjectType] = useState<string|null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const scenes = useMemo(()=>{
    if(!env || !time) return [] as string[];
    // @ts-ignore
    return (SCENE_MAP[env]?.[time]) || [];
  },[env,time]);

  const ready = !!(lens && mode && env && time && scene);
  const req = useMemo(()=> ready ? requiredFor(scene!, lens!, time!, env!, mode!, motion) : null, [ready, scene, lens, time, env, mode, motion]);
  const fset = useMemo(()=> ready ? getFocusSet(scene!, mode!, motion, subjectType, null) : null, [ready, scene, mode, motion, subjectType]);
  const findings = useMemo(()=> req ? diagnose(symptoms, req, lens!, mode!, time!, motion, fset) : [], [symptoms, req, lens, mode, time, motion, fset]);

  const toggleSymptom = (id:string)=> setSymptoms(p=> p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const reset = ()=>{ setLens(null);setMode(null);setEnv(null);setTime(null);setScene(null);setMotion('Still • No Motion');setSubjectType(null);setSymptoms([]); };

  const copy = ()=>{
    if(!req) return;
    const t = `DIAGNOSER — ${scene} • ${mode} • ${env} ${time} • ${lens==='24-120'?'24-120mm f/4 S':'40mm f/2'}\nAperture ${req.aperture}\nShutter ${req.shutter}\nISO ${req.iso}\nFocal ${req.focal}\nFocus type ${fset?.focusType ?? req.focus}\nAF-area ${fset?.afArea ?? '-'}\nSubject detection ${fset?.detect ?? '-'}\nVR ${fset?.vr ?? '-'}\nElectronic VR ${fset?.evr ?? '-'}\nWhite balance ${req.wb}\nDrive ${req.drive}`;
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(t).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),1500);
  };

  const groups = Array.from(new Set(SYMPTOMS.map(s=>s.group)));

  return (
    <Shell active="#/diagnoser" onReset={reset}>



      <PageHero
        eyebrow="DIAGNOSER • FIX SETTINGS"
        accent="#C64F0E"
        title={<>Diagnoser<span className="text-[#C64F0E]">.</span></>}
        lead="Shot went wrong? Pick what you shoot → get the right settings. Then tick what looks bad → get the fix."
        actions={<><BtnLink href="#pick">START</BtnLink><BtnLink href="#/rules" variant="plain">SEE RULES</BtnLink></>}
        art={
          <div className="p-6 md:p-8">
            <svg viewBox="0 0 320 220" className="w-full h-auto block" role="img" aria-label="Exposure triangle diagram">
              <polygon points="160,24 292,196 28,196" fill="none" stroke="#2F3133" strokeWidth="3"/>
              <circle cx="160" cy="24" r="26" fill="#F4B23C" stroke="#2F3133" strokeWidth="3"/>
              <text x="160" y="29" textAnchor="middle" fontSize="11" fontWeight={800} fill="#2F3133" fontFamily="'Space Grotesk',sans-serif">APER</text>
              <circle cx="292" cy="196" r="26" fill="#00365A" stroke="#2F3133" strokeWidth="3"/>
              <text x="292" y="201" textAnchor="middle" fontSize="10" fontWeight={800} fill="#FAF8F3" fontFamily="'Space Grotesk',sans-serif">SHUT</text>
              <circle cx="28" cy="196" r="26" fill="#C64F0E" stroke="#2F3133" strokeWidth="3"/>
              <text x="28" y="201" textAnchor="middle" fontSize="11" fontWeight={800} fill="#FAF8F3" fontFamily="'Space Grotesk',sans-serif">ISO</text>
              <circle cx="160" cy="140" r="34" fill="#D7BB83" stroke="#2F3133" strokeWidth="3"/>
              <text x="160" y="137" textAnchor="middle" fontSize="10" fontWeight={800} fill="#2F3133" fontFamily="'Space Grotesk',sans-serif">CHECK</text>
              <text x="160" y="152" textAnchor="middle" fontSize="10" fontWeight={800} fill="#2F3133" fontFamily="'Space Grotesk',sans-serif">EACH</text>
            </svg>
          </div>
        }
      />

      {/* A — PICK THE SCENE */}
      <main id="pick" className="relative z-10 scroll-mt-24 mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-10 py-10 md:py-16">
        <SectionHead num="A" title="What Are You Shooting?" sub="LENS → MODE → PLACE → LIGHT → SCENE" tone="navy" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          <div className="lg:col-span-5 space-y-6">
            {/* lens */}
            <div data-reveal className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-5 shadow-[3px_3px_0px_#2F3133]">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-full bg-[#00365A] border border-[#2F3133] text-white flex items-center justify-center sans text-[10px] font-black">01</div>
                <div className="sans text-[12px] font-black tracking-[0.18em]">LENS</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {([['24-120','24-120mm f/4 S'],['40mm','40mm f/2']] as [Lens,string][]).map(([id,label])=>(
                  <button key={id} onClick={()=>setLens(id)} className={`min-h-[48px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 py-2.5 sans text-[11px] font-black tracking-wide shadow-[1.5px_1.5px_0px_#2F3133] transition ${lens===id?'bg-[#00365A] text-[#FAF8F3] translate-x-[1px] translate-y-[1px] shadow-none':'bg-[#FAF8F3] text-[#2F3133] hover:bg-white'}`}>{label}</button>
                ))}
              </div>
            </div>

            {/* mode */}
            <div data-reveal className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-[#FAF8F3] p-5 shadow-[3px_3px_0px_#2F3133]">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-full bg-[#C64F0E] border border-[#2F3133] text-white flex items-center justify-center sans text-[10px] font-black">02</div>
                <div className="sans text-[12px] font-black tracking-[0.18em]">MODE</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {([['photo','PHOTO'],['video','VIDEO']] as [Mode,string][]).map(([id,label])=>(
                  <button key={id} onClick={()=>setMode(id)} className={`min-h-[48px] rounded-[10px] border-[1.5px] border-[#2F3133] px-4 sans text-[12px] font-black tracking-[0.14em] shadow-[2px_2px_0px_#2F3133] transition ${mode===id?(id==='photo'?'bg-[#00365A] text-white':'bg-[#C64F0E] text-white')+' translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0px_#2F3133]':'bg-white text-[#2F3133] hover:bg-[#FAF8F3]'}`}>{label}</button>
                ))}
              </div>
            </div>

            {/* place + light */}
            <div data-reveal className="grid grid-cols-2 gap-4">
              <div className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[3px_3px_0px_#2F3133]">
                <div className="flex items-center gap-2 mb-3"><div className="h-5 w-5 rounded-full bg-[#F4B23C] border border-[#2F3133] flex items-center justify-center text-[10px] font-black">03</div><div className="sans text-[11px] font-black tracking-[0.18em]">PLACE</div></div>
                <div className="space-y-2">
                  {(['indoor','outdoor'] as Env[]).map(e=>(
                    <button key={e} onClick={()=>{setEnv(e); setScene(null);}} className={`w-full min-h-[44px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 sans text-[11px] font-black tracking-widest text-left shadow-[1.5px_1.5px_0px_#2F3133] ${env===e?'bg-[#2F3133] text-white':'bg-[#FAF8F3] text-[#2F3133] hover:bg-white'}`}>{e.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <div className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-[#D7BB83]/30 p-4 shadow-[3px_3px_0px_#2F3133]">
                <div className="flex items-center gap-2 mb-3"><div className="h-5 w-5 rounded-full bg-[#00365A] border border-[#2F3133] text-white flex items-center justify-center text-[10px] font-black">04</div><div className="sans text-[11px] font-black tracking-[0.18em]">LIGHT</div></div>
                {env ? (
                  <div className="space-y-2">
                    <button onClick={()=>{setTime('day'); setScene(null);}} className={`w-full min-h-[44px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 sans text-[11px] font-black tracking-widest text-left shadow-[1.5px_1.5px_0px_#2F3133] text-[#2F3133] ${time==='day'?'bg-[#F4B23C]':'bg-white hover:bg-[#FAF8F3]'}`}>DAY</button>
                    <button onClick={()=>{setTime('night'); setScene(null);}} className={`w-full min-h-[44px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 sans text-[11px] font-black tracking-widest text-left shadow-[1.5px_1.5px_0px_#2F3133] ${time==='night'?'bg-[#00365A] text-white':'bg-white text-[#2F3133] hover:bg-[#FAF8F3]'}`}>NIGHT • LOW</button>
                  </div>
                ) : <div className="sans text-[11px] border border-dashed border-[#2F3133] rounded-[8px] p-2 bg-white/60 text-[#2F3133]">Pick place first</div>}
              </div>
            </div>

            {/* scene */}
            {env && time && (
              <div data-reveal className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-5 shadow-[3px_3px_0px_#2F3133]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-full bg-[#00365A] border border-[#2F3133] text-white flex items-center justify-center sans text-[10px] font-black">05</div>
                  <div className="sans text-[12px] font-black tracking-[0.18em]">SCENE</div>
                  <div className="ml-auto rounded-full bg-[#F4B23C] border border-[#2F3133] px-2 py-0.5 text-[10px] font-black text-[#2F3133]">{scenes.length}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {scenes.map(s=>(
                    <button key={s} onClick={()=>setScene(s)} className={`min-h-[48px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 py-2.5 sans text-[11px] font-black tracking-wide text-left shadow-[1.5px_1.5px_0px_#2F3133] transition hover:-translate-y-[1px] ${scene===s?'bg-[#C64F0E] text-white shadow-[1px_1px_0px_#2F3133]':'bg-[#FAF8F3] text-[#2F3133] hover:bg-white'}`}>{s.toUpperCase()}</button>
                  ))}
                </div>
              </div>
            )}

            {/* subject motion */}
            {scene && (
              <div data-reveal className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-5 shadow-[3px_3px_0px_#2F3133]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-full bg-[#C64F0E] border border-[#2F3133] text-white flex items-center justify-center sans text-[10px] font-black">06</div>
                  <div className="sans text-[12px] font-black tracking-[0.18em]">SUBJECT MOTION</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MOTIONS.map(m=>(
                    <button key={m} onClick={()=>setMotion(m)} className={`sans text-[11px] font-bold rounded-[8px] border-[1.5px] border-[#2F3133] px-3 min-h-[44px] shadow-[1px_1px_0px_#2F3133] transition hover:-translate-y-[1px] ${motion===m?'bg-[#00365A] text-white shadow-none translate-x-[1px] translate-y-[1px]':'bg-white text-[#2F3133] hover:bg-[#FAF8F3]'}`}>{m}</button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-5 mb-3">
                  <div className="h-6 w-6 rounded-full bg-[#00365A] border border-[#2F3133] text-white flex items-center justify-center sans text-[10px] font-black">07</div>
                  <div className="sans text-[12px] font-black tracking-[0.18em]">SUBJECT TYPE</div>
                  {subjectType && <button onClick={()=>setSubjectType(null)} className="ml-auto sans text-[10px] font-bold underline text-[#2F3133]">CLEAR</button>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUBJECTS.map(sT=>(
                    <button key={sT} onClick={()=>setSubjectType(sT===subjectType?null:sT)} className={`sans text-[11px] font-bold rounded-[8px] border-[1.5px] border-[#2F3133] px-3 min-h-[44px] shadow-[1px_1px_0px_#2F3133] transition hover:-translate-y-[1px] ${subjectType===sT?'bg-[#C64F0E] text-white shadow-none translate-x-[1px] translate-y-[1px]':'bg-white text-[#2F3133] hover:bg-[#FAF8F3]'}`}>{sT}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* REQUIRED SETTINGS PANEL */}
          <div className="lg:col-span-7">
            {!req ? (
              <div data-reveal className="rounded-[18px] border-[1.5px] border-[#2F3133] bg-white p-8 shadow-[4px_4px_0px_#2F3133]">
                <div className="flex gap-2 mb-4">
                  <div className="h-2 w-8 rounded-full bg-[#00365A] border border-[#2F3133]"></div><div className="h-2 w-8 rounded-full bg-[#C64F0E] border border-[#2F3133]"></div><div className="h-2 w-8 rounded-full bg-[#F4B23C] border border-[#2F3133]"></div><div className="h-2 w-8 rounded-full bg-[#D7BB83] border border-[#2F3133]"></div>
                </div>
                <div className="display text-[clamp(24px,3.6vw,34px)] leading-[0.95] text-[#2F3133]">Pick lens + mode<br/>+ scene to see the<br/><span className="bg-[#F4B23C] border border-[#2F3133] px-2 rounded-[8px]">right settings.</span></div>
                <p className="sans text-[14px] mt-4 leading-relaxed text-[#4A4237] font-medium">It fills in as you tap. No submit button.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div data-reveal className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#2F3133] p-3 flex flex-wrap gap-2 items-center shadow-[3px_3px_0px_#2F3133]">
                  <span className="rounded-full bg-[#F4B23C] text-[#2F3133] border border-[#FAF8F3] px-3 py-1.5 sans text-[11px] font-black tracking-widest">{lens==='24-120'?'24-120mm f/4 S':'40mm f/2'} • {mode?.toUpperCase()} • {scene?.toUpperCase()}</span>
                  <span className="rounded-full bg-[#FAF8F3] text-[#2F3133] border border-[#2F3133] px-2.5 py-1 sans text-[10px] font-bold">{env?.toUpperCase()} • {time?.toUpperCase()}</span>
                  <span className="rounded-full bg-[#FAF8F3] text-[#2F3133] border border-[#2F3133] px-2.5 py-1 sans text-[10px] font-bold">{motion}</span>
                  {subjectType && <span className="rounded-full bg-[#FAF8F3] text-[#2F3133] border border-[#2F3133] px-2.5 py-1 sans text-[10px] font-bold">{subjectType}</span>}
                  <button onClick={copy} className="ml-auto rounded-full bg-[#C64F0E] border border-[#FAF8F3] text-white px-4 py-1.5 sans text-[11px] font-black tracking-widest shadow-[1px_1px_0px_#FAF8F3] hover:bg-[#00365A] transition">{copied?'COPIED':'COPY'}</button>
                </div>

                <div data-reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {k:'APERTURE', v:req.aperture, col:'#F4B23C', w:false},
                    {k:'SHUTTER',  v:req.shutter,  col:'#D7BB83', w:false},
                    {k:'ISO',      v:req.iso,      col:'#C64F0E', w:true},
                  ].map(c=>(
                    <div key={c.k} className="rounded-[14px] border-[1.5px] border-[#2F3133] p-4 shadow-[2px_2px_0px_#2F3133] hover:-translate-y-[2px] transition" style={{backgroundColor:c.col}}>
                      <div className={`sans text-[10px] font-black tracking-[0.2em] ${c.w?'text-[#FAF8F3]':'text-[#2F3133]'}`}>{c.k}</div>
                      <div className={`mono text-[16px] font-black mt-2 leading-tight ${c.w?'text-white':'text-[#2F3133]'}`}>{c.v}</div>
                    </div>
                  ))}
                </div>

                <div data-reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {k:'FOCAL', v:req.focal},
                    {k:'FOCUS TYPE', v:fset?.focusType ?? req.focus},
                    {k:'WHITE BALANCE', v:req.wb},
                  ].map(c=>(
                    <div key={c.k} className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[2px_2px_0px_#2F3133] hover:-translate-y-[2px] transition">
                      <div className="sans text-[10px] font-black tracking-[0.2em] text-[#564D40]">{c.k}</div>
                      <div className="sans text-[13px] font-black mt-2 leading-tight text-[#2F3133]">{c.v}</div>
                    </div>
                  ))}
                </div>

                {fset && (
                  <div data-reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#D7BB83]/40 p-4 shadow-[2px_2px_0px_#2F3133] sm:col-span-2 flex items-center gap-3">
                      <span className="h-12 w-12 shrink-0 rounded-[8px] border-[1.5px] border-[#2F3133] bg-[#FAF8F3] flex items-center justify-center">
                        <AfIcon k={fset.afKey} />
                      </span>
                      <span className="min-w-0">
                        <span className="sans block text-[10px] font-black tracking-[0.2em] text-[#564D40]">AF-AREA MODE</span>
                        <span className="sans block text-[14px] font-black mt-1 leading-tight text-[#2F3133]">{fset.afArea}</span>
                      </span>
                    </div>
                    <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#C64F0E] p-4 shadow-[2px_2px_0px_#2F3133]">
                      <div className="sans text-[10px] font-black tracking-[0.18em] text-[#FAF8F3]">SUBJECT DETECTION</div>
                      <div className="sans text-[14px] font-black mt-2 leading-tight text-white">{fset.detect}</div>
                    </div>
                    <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[2px_2px_0px_#2F3133]">
                      <div className="sans text-[10px] font-black tracking-[0.2em] text-[#564D40]">VR {mode==='video'?'(VIDEO)':''}</div>
                      <div className="sans text-[13px] font-black mt-2 text-[#2F3133]">{fset.vr}</div>
                    </div>
                    <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[2px_2px_0px_#2F3133]">
                      <div className="sans text-[10px] font-black tracking-[0.2em] text-[#564D40]">ELECTRONIC VR</div>
                      <div className="sans text-[13px] font-black mt-2 text-[#2F3133]">{fset.evr}</div>
                    </div>
                    <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#00365A] p-4 shadow-[2px_2px_0px_#2F3133]">
                      <div className="sans text-[10px] font-black tracking-[0.2em] text-[#D7BB83]">WHY</div>
                      <div className="sans text-[12px] font-bold mt-2 leading-tight text-[#FAF8F3]">{fset.why}</div>
                    </div>
                  </div>
                )}

                <div data-reveal className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[2px_2px_0px_#2F3133] flex justify-between items-center gap-3">
                  <span className="sans text-[10px] font-black tracking-[0.2em] text-[#564D40]">DRIVE</span>
                  <span className="sans text-[13px] font-black text-[#2F3133] text-right">{req.drive}</span>
                </div>

                <div data-reveal className="rounded-[14px] border-[1.5px] border-[#2F3133] bg-[#F4B23C] p-4 shadow-[3px_3px_0px_#2F3133]">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-[#2F3133] text-white flex items-center justify-center text-[10px] font-black">!</div>
                    <div className="sans text-[11px] font-black tracking-[0.2em] text-[#2F3133]">TIP</div>
                  </div>
                  <div className="sans text-[14px] font-bold leading-relaxed mt-2 text-[#2F3133]">{req.note}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* B — SYMPTOMS */}
      <section id="symptoms" className="relative z-10 scroll-mt-24 border-y-[1.5px] border-[#2F3133] bg-[#F3EDE1]">
        <div className="mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-10 py-10 md:py-16">
          <SectionHead num="B" title="What Looks Bad?" sub="TICK ALL THAT YOU SEE" tone="orange" />

          {!req ? (
            <div data-reveal className="rounded-[14px] border-[1.5px] border-dashed border-[#2F3133] bg-white/70 p-6 sans text-[13px] font-medium text-[#4A4237]">
              Pick a scene in step A first ↑
            </div>
          ) : (
            <div data-reveal className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {groups.map(g=>(
                <div key={g} className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-4 md:p-5 shadow-[3px_3px_0px_#2F3133]">
                  <div className="sans text-[11px] font-black tracking-[0.2em] text-[#2F3133] pb-2 mb-3 border-b-[1.5px] border-[#E9DFD0]">{g}</div>
                  <div className="space-y-2">
                    {SYMPTOMS.filter(s=>s.group===g).map(s=>{
                      const active = symptoms.includes(s.id);
                      return (
                        <button key={s.id} onClick={()=>toggleSymptom(s.id)} aria-pressed={active}
                          className={`w-full min-h-[48px] flex items-center gap-3 rounded-[10px] border-[1.5px] border-[#2F3133] px-3 py-2 text-left shadow-[1.5px_1.5px_0px_#2F3133] transition hover:-translate-y-[1px] ${active?'bg-[#00365A] text-[#FAF8F3]':'bg-[#FAF8F3] text-[#2F3133] hover:bg-white'}`}>
                          <span className={`h-5 w-5 shrink-0 rounded-[5px] border-[1.5px] border-[#2F3133] flex items-center justify-center text-[11px] font-black ${active?'bg-[#F4B23C] text-[#2F3133]':'bg-white text-transparent'}`}>✓</span>
                          <span className="sans text-[12px] font-bold leading-tight">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {req && symptoms.length>0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="sans text-[11px] font-black tracking-[0.18em] rounded-full bg-[#2F3133] text-[#FAF8F3] px-3 py-1.5 border-[1.5px] border-[#2F3133]">{findings.length} FIX{findings.length===1?'':'ES'} BELOW ↓</span>
              <button onClick={()=>setSymptoms([])} className="sans text-[11px] font-black tracking-[0.14em] rounded-[10px] border-[1.5px] border-[#2F3133] bg-white px-4 min-h-[44px] shadow-[2px_2px_0px_#2F3133] hover:bg-[#F4B23C] transition text-[#2F3133]">CLEAR ALL</button>
            </div>
          )}
        </div>
      </section>

      {/* C — DIAGNOSIS */}
      <section id="diagnosis" className="relative z-10 scroll-mt-24">
        <div className="mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-10 py-10 md:py-16">
          <SectionHead num="C" title="Why & How To Fix" sub="WHY IT HAPPENED → WHAT TO DO" tone="char" />

          {findings.length===0 ? (
            <div data-reveal className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-6 md:p-8 shadow-[3px_3px_0px_#2F3133]">
              <div className="display text-[clamp(20px,3vw,26px)] leading-tight text-[#2F3133]">
                {req ? 'Nothing ticked → use the settings above.' : 'Waiting for your picks.'}
              </div>
              <p className="sans text-[13px] mt-3 text-[#4A4237] font-medium max-w-[60ch]">
                {req ? 'Set them, take one test shot, then come back and tick what still looks bad.' : 'Do step A → then tick in step B.'}
              </p>
            </div>
          ) : (
            <div data-reveal className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {findings.map((f,i)=>(
                <article key={f.title} className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white shadow-[3px_3px_0px_#2F3133] overflow-hidden flex flex-col">
                  <div className="flex items-center gap-3 px-4 py-3 border-b-[1.5px] border-[#2F3133]" style={{background:TONE[f.tone]}}>
                    <span className="h-7 w-7 shrink-0 rounded-full bg-[#FAF8F3] border-[1.5px] border-[#2F3133] flex items-center justify-center sans text-[11px] font-black text-[#2F3133]">{i+1}</span>
                    <h3 className="sans text-[13px] font-black tracking-wide text-[#FAF8F3] leading-tight">{f.title}</h3>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="sans text-[10px] font-black tracking-[0.18em] text-[#564D40]">WHY</div>
                    <p className="sans text-[13px] leading-[1.55] mt-1.5 text-[#2F3133] font-medium">{f.cause}</p>
                    <div className="sans text-[10px] font-black tracking-[0.18em] text-[#564D40] mt-4">DO THIS ✓</div>
                    <ul className="mt-2 space-y-1.5">
                      {f.fix.map(step=>(
                        <li key={step} className="flex gap-2 sans text-[12.5px] leading-[1.5] text-[#2F3133]">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full border border-[#2F3133]" style={{background:TONE[f.tone]}}></span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-4 py-3 border-t-[1.5px] border-[#E9DFD0] bg-[#FAF8F3]">
                    <span className="mono text-[11px] font-black inline-block rounded-[6px] border border-[#2F3133] bg-[#F4B23C] text-[#2F3133] px-2 py-1">{f.dial}</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* order reminder */}
          <div data-reveal className="mt-6 rounded-[16px] border-[1.5px] border-[#2F3133] bg-[#D7BB83]/30 p-5 md:p-6 shadow-[3px_3px_0px_#2F3133]">
            <div className="sans text-[12px] font-black tracking-[0.2em] text-[#2F3133]">FIX IN THIS ORDER</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {[['1 APERTURE','#F4B23C',false],['2 SHUTTER','#00365A',true],['3 ISO','#C64F0E',true]].map(([l,c,w],i)=>(
                <span key={l as string} className="flex items-center gap-2">
                  <span className="mono text-[12px] font-black rounded-[8px] border-[1.5px] border-[#2F3133] px-3 py-2 shadow-[1.5px_1.5px_0px_#2F3133]" style={{background:c as string, color: w?'#FAF8F3':'#2F3133'}}>{l as string}</span>
                  {i<2 && <span className="sans text-[16px] font-black text-[#2F3133]">→</span>}
                </span>
              ))}
            </div>
            <p className="sans text-[12px] leading-[1.55] mt-3 text-[#4A4237] font-medium max-w-[70ch]">
              Sports • wildlife • night by hand • all video → set shutter first, then aperture, then ISO.
            </p>
          </div>
        </div>
      </section>

    </Shell>
  );
}
