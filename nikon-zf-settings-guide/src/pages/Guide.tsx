import { useMemo, useState } from 'react';
import Shell, { SectionHead, PageHero, BtnLink } from '../components/Shell';
import ZfDiagram from '../components/ZfDiagram';
import AfIcon from '../components/AfIcon';
import { SCENE_MAP, MODS, getBase, getFocusSet, AF_LABEL, type AfKey, type Lens, type Mode, type Env, type Time } from '../lib/data';

export default function Guide(){
  const [lens, setLens] = useState<Lens | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [env, setEnv] = useState<Env | null>(null);
  const [time, setTime] = useState<Time | null>(null);
  const [scene, setScene] = useState<string | null>(null);
  const [subjectMotion, setSubjectMotion] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);
  const [lighting, setLighting] = useState<string | null>(null);
  const [cameraMove, setCameraMove] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = ()=>{ setLens(null);setMode(null);setEnv(null);setTime(null);setScene(null);setSubjectMotion(null);setWeather(null);setLighting(null);setCameraMove(null);setSubject(null); };

  const scenes = useMemo(()=>{
    if(!env || !time) return [] as string[];
    // @ts-ignore
    return (SCENE_MAP[env]?.[time]) || [];
  }, [env, time]);

  const settings = useMemo(()=>{
    if(!lens || !mode || !env || !time || !scene) return null;
    const base = getBase(scene);
    const isPrime = lens==='40mm';
    const isNight = time==='night';
    const isIndoor = env==='indoor';
    let aperture = isPrime ? base.aperturePrime : base.apertureZoom;
    let shutter = isNight ? base.shutterPhotoNight : base.shutterPhotoDay;
    let iso = isNight ? base.isoNight : (isIndoor ? base.isoDayIn : base.isoDayOut);
    let focal = isPrime ? base.focalPrime : base.focalZoom;
    let focus = base.focus;
    let wb = base.wb;
    let tip = base.tip;
    const warnings: string[] = [];
    if(subjectMotion && subjectMotion !== "Still • No Motion"){
      shutter = isNight ? "1/500 to 1/1000" : "1/1000 to 1/2000";
      tip = `${subjectMotion} subject → raise shutter to ${shutter}.`;
    }
    if(weather){
      if(weather==='Sunny') iso="Lo64 to 200 plus ND if f/2";
      if(weather==='Snow') { wb="6500K Shade"; tip="Snow needs plus 1 EV, otherwise grey."; }
      if(weather==='Golden Hour') { wb="7500K Shade"; aperture = isPrime ? "f/2 to f/2.8" : "f/4"; }
      if(weather==='Blue Hour') { shutter="Tripod 1 to 4 sec"; }
      if(weather==='Rain') warnings.push("Zf sealed — use sleeve. 40mm f/2 less sealed than 24-120mm.");
    }
    if(lighting){
      if(lighting==='Backlit') tip="Backlit → plus 1 EV or reflector fill.";
      if(lighting==='Silhouette') { aperture="f/8"; shutter="Expose sky minus 1 EV"; tip="Expose sky, subject goes black."; }
      if(lighting==='Artificial Light') tip="Artificial light → anti-flicker on, shutter 1/100 for 50Hz or 1/125 for 60Hz.";
    }
    if(subject){
      if(subject==='Human') focus="Eye Detect Human";
      if(subject==='Animal') focus="Animal Detect";
      if(subject==='Product' || subject==='Food') focus="Pinpoint or MF";
      if(subject==='Vehicle') focus="Vehicle Detect";
    }
    if(isPrime && (scene.toLowerCase().includes('bird') || scene.toLowerCase().includes('wildlife') || scene.toLowerCase().includes('moon'))){
      warnings.push("40mm f/2 short — use 24-120mm at 120mm plus DX crop.");
    }
    const videoShutter = "1/50 at 24p • 1/60 at 30p • 1/120 at 60p";
    const dialMode = scene.toLowerCase().includes('astro') || scene.toLowerCase().includes('moon') || scene.toLowerCase().includes('long exposure') || scene.toLowerCase().includes('light trail') ? "M Manual" : "A Aperture Priority plus Auto ISO";
    const fset = getFocusSet(scene, mode, subjectMotion, subject, cameraMove);
    return { aperture, shutter, iso, focal, focus, wb, videoRes: base.videoRes, videoFps: base.videoFps, videoShutter, tip, warnings, dialMode, fset };
  }, [lens, mode, env, time, scene, subjectMotion, weather, lighting, subject, cameraMove]);

  const copy = ()=>{
    if(!settings) return;
    const txt = `${lens==='24-120'?'24-120mm f/4 S':'40mm f/2'} • ${mode} • ${scene}\nAperture ${settings.aperture}\nShutter ${mode==='photo'?settings.shutter:settings.videoShutter}\nISO ${settings.iso}\nFocal ${settings.focal}\nFocus type ${settings.fset.focusType}\nAF-area ${settings.fset.afArea}\nSubject detection ${settings.fset.detect}\nVR ${settings.fset.vr}\nElectronic VR ${settings.fset.evr}\nWB ${settings.wb}`;
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),1500);
  };

  return (
    <Shell active="#/" onReset={reset}>
      <PageHero
        eyebrow="LENS TO SETTINGS"
        title={<>Simple.<br/>Exact.<br/><span className="relative inline-block">Retro.<span className="absolute bottom-1 left-0 w-full h-[10px] bg-[#D7BB83] -z-10 rounded-full"></span></span></>}
        lead="Pick lens and scene. Choose your situation. See only what you need."
        actions={<><BtnLink href="#build">GET SETTINGS</BtnLink><BtnLink href="#map" variant="plain">CAM MAP ↓</BtnLink></>}
        art={
          <>
            <div className="absolute inset-0 flex flex-col justify-center gap-2.5 p-4 opacity-90">
              <div className="h-5 w-full rounded-full bg-[#F4B23C] border border-[#2F3133]"></div>
              <div className="h-5 w-full rounded-full bg-[#C64F0E] border border-[#2F3133]"></div>
              <div className="h-5 w-[85%] rounded-full bg-[#00365A] border border-[#2F3133]"></div>
              <div className="h-5 w-[70%] rounded-full bg-[#D7BB83] border border-[#2F3133]"></div>
            </div>
            <div className="relative flex items-center justify-center p-6 md:p-8">
              <img src="/images/hero-camera-70s.jpg" alt="1970s retro camera illustration" className="relative z-10 w-[88%] max-w-[420px] object-contain rounded-[12px] border-[1.5px] border-[#2F3133] bg-white shadow-[3px_3px_0px_#2F3133]" />
            </div>
          </>
        }
      />

      <main id="build" className="relative z-10 scroll-mt-24 mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-10 py-10 md:py-16">
        <SectionHead num="A" title="Build Your Shot" sub="CHOOSE LENS · MODE · SCENE · SITUATION" tone="navy" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

          <div className="lg:col-span-5 space-y-6">
            <div data-reveal className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-5 shadow-[3px_3px_0px_#2F3133]">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-full bg-[#00365A] border border-[#2F3133] text-white flex items-center justify-center sans text-[10px] font-black">01</div>
                <div className="sans text-[12px] font-black tracking-[0.18em]">LENS • CHOOSE GLASS</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {id:'24-120', name:'24-120mm f/4 S', img:'/images/24-120-lens.jpg', color:'#00365A'},
                  {id:'40mm', name:'40mm f/2', img:'/images/40mm-lens.jpg', color:'#C64F0E'},
                ].map(l=>(
                  <button key={l.id} onClick={()=>setLens(l.id as Lens)} className={`group text-left rounded-[12px] border-[1.5px] border-[#2F3133] overflow-hidden transition-all ${lens===l.id? 'shadow-[3px_3px_0px_#2F3133] -translate-y-0.5' : 'shadow-[1.5px_1.5px_0px_#2F3133] hover:shadow-[2px_2px_0px_#2F3133] hover:-translate-y-[1px]'} bg-[#FAF8F3]`}>
                    <div className="relative h-28 w-full overflow-hidden bg-white border-b-[1.5px] border-[#2F3133]">
                      <img src={l.img} alt={l.name} loading="lazy" decoding="async" className="h-full w-full object-cover group-hover:scale-[1.04] transition duration-500" />
                      <div className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-black tracking-widest border border-[#2F3133] shadow-[1px_1px_0px_#2F3133] text-[#2F3133]" style={{backgroundColor: lens===l.id ? '#F4B23C' : 'white'}}>{l.id.toUpperCase()}</div>
                    </div>
                    <div className="p-3">
                      <div className="sans text-[13px] font-black tracking-tight text-[#2F3133]">{l.name}</div>
                      <div className="mt-1 flex gap-1"><div className="h-2 flex-1 rounded-full bg-[#D7BB83] border border-[#2F3133]"></div><div className="h-2 w-2 rounded-full border border-[#2F3133]" style={{backgroundColor: l.color}}></div></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div data-reveal className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-[#FAF8F3] p-5 shadow-[3px_3px_0px_#2F3133]">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-full bg-[#C64F0E] border border-[#2F3133] text-white flex items-center justify-center sans text-[10px] font-black">02</div>
                <div className="sans text-[12px] font-black tracking-[0.18em]">MODE</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>setMode('photo')} className={`min-h-[48px] rounded-[10px] border-[1.5px] border-[#2F3133] px-4 sans text-[12px] font-black tracking-[0.14em] shadow-[2px_2px_0px_#2F3133] transition ${mode==='photo'? 'bg-[#00365A] text-white shadow-[1px_1px_0px_#2F3133] translate-x-[1px] translate-y-[1px]' : 'bg-white text-[#2F3133] hover:bg-[#FAF8F3]'}`}>PHOTO</button>
                <button onClick={()=>setMode('video')} className={`min-h-[48px] rounded-[10px] border-[1.5px] border-[#2F3133] px-4 sans text-[12px] font-black tracking-[0.14em] shadow-[2px_2px_0px_#2F3133] transition ${mode==='video'? 'bg-[#C64F0E] text-white shadow-[1px_1px_0px_#2F3133] translate-x-[1px] translate-y-[1px]' : 'bg-white text-[#2F3133] hover:bg-[#FAF8F3]'}`}>VIDEO</button>
              </div>
            </div>

            <div data-reveal className="grid grid-cols-2 gap-4">
              <div className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[3px_3px_0px_#2F3133]">
                <div className="flex items-center gap-2 mb-3"><div className="h-5 w-5 rounded-full bg-[#F4B23C] border border-[#2F3133] flex items-center justify-center text-[10px] font-black text-[#2F3133]">03</div><div className="sans text-[11px] font-black tracking-[0.18em]">PLACE</div></div>
                <div className="space-y-2">
                  <button onClick={()=>{setEnv('indoor'); setScene(null)}} className={`w-full min-h-[44px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 sans text-[11px] font-black tracking-widest text-left shadow-[1.5px_1.5px_0px_#2F3133] ${env==='indoor'? 'bg-[#2F3133] text-white' : 'bg-[#FAF8F3] text-[#2F3133] hover:bg-white'}`}>INDOOR</button>
                  <button onClick={()=>{setEnv('outdoor'); setScene(null)}} className={`w-full min-h-[44px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 sans text-[11px] font-black tracking-widest text-left shadow-[1.5px_1.5px_0px_#2F3133] ${env==='outdoor'? 'bg-[#2F3133] text-white' : 'bg-[#FAF8F3] text-[#2F3133] hover:bg-white'}`}>OUTDOOR</button>
                </div>
              </div>
              <div className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-[#D7BB83]/30 p-4 shadow-[3px_3px_0px_#2F3133]">
                <div className="flex items-center gap-2 mb-3"><div className="h-5 w-5 rounded-full bg-[#00365A] border border-[#2F3133] text-white flex items-center justify-center text-[10px] font-black">04</div><div className="sans text-[11px] font-black tracking-[0.18em]">LIGHT</div></div>
                {env ? <div className="space-y-2">
                  <button onClick={()=>{setTime('day'); setScene(null)}} className={`w-full min-h-[44px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 sans text-[11px] font-black tracking-widest text-left shadow-[1.5px_1.5px_0px_#2F3133] text-[#2F3133] ${time==='day'? 'bg-[#F4B23C]' : 'bg-white hover:bg-[#FAF8F3]'}`}>DAY</button>
                  <button onClick={()=>{setTime('night'); setScene(null)}} className={`w-full min-h-[44px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 sans text-[11px] font-black tracking-widest text-left shadow-[1.5px_1.5px_0px_#2F3133] ${time==='night'? 'bg-[#00365A] text-white' : 'bg-white text-[#2F3133] hover:bg-[#FAF8F3]'}`}>NIGHT • LOW</button>
                </div> : <div className="sans text-[11px] border border-dashed border-[#2F3133] rounded-[8px] p-2 bg-white/60 text-[#2F3133]">Pick place first</div>}
              </div>
            </div>

            {env && time && (
              <div data-reveal className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-5 shadow-[3px_3px_0px_#2F3133]">
                <div className="flex items-center gap-2 mb-3"><div className="h-6 w-6 rounded-full bg-[#00365A] border border-[#2F3133] text-white flex items-center justify-center sans text-[10px] font-black">05</div><div className="sans text-[12px] font-black tracking-[0.18em]">SCENE • INCLUDING INTERVIEW</div><div className="ml-auto rounded-full bg-[#F4B23C] border border-[#2F3133] px-2 py-0.5 text-[10px] font-black text-[#2F3133]">{scenes.length}</div></div>
                <div className="grid grid-cols-2 gap-2">
                  {scenes.map((s: string)=>(
                    <button key={s} onClick={()=>setScene(s)} className={`min-h-[48px] rounded-[10px] border-[1.5px] border-[#2F3133] px-3 py-2.5 sans text-[11px] font-black tracking-wide text-left shadow-[1.5px_1.5px_0px_#2F3133] transition hover:-translate-y-[1px] ${scene===s? 'bg-[#C64F0E] text-white shadow-[1px_1px_0px_#2F3133]' : 'bg-[#FAF8F3] text-[#2F3133] hover:bg-white'}`}>{s.toUpperCase()}</button>
                  ))}
                </div>
              </div>
            )}

            {scene && (
              <div data-reveal className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#2F3133]">
                <div className="flex items-center gap-2 mb-4"><div className="h-6 w-6 rounded-full bg-[#C64F0E] border border-[#2F3133] text-white flex items-center justify-center sans text-[10px] font-black">06</div><div className="sans text-[12px] font-black tracking-[0.18em]">YOUR SITUATION • PICK ANY</div></div>
                {[
                  {label:'Subject Motion • What subject does', opts:MODS.subjectMotion, v:subjectMotion, set:setSubjectMotion, accent:'#F4B23C'},
                  {label:'Weather • Time of day', opts:MODS.weather, v:weather, set:setWeather, accent:'#D7BB83'},
                  {label:'Lighting Style', opts:MODS.lighting, v:lighting, set:setLighting, accent:'#00365A'},
                  ...(mode==='video' ? [{label:'Camera Movement • Tripod Gimbal etc', opts:MODS.cameraMove, v:cameraMove, set:setCameraMove, accent:'#C64F0E'}] : []),
                  {label:'Subject Type', opts:MODS.subject, v:subject, set:setSubject, accent:'#2F3133'},
                ].map(block=>(
                  <div key={block.label} className="mb-4">
                    <div className="flex items-center gap-2 mb-2"><div className="h-1.5 w-1.5 rounded-full border border-[#2F3133]" style={{background: block.accent}}></div><div className="sans text-[10px] font-black tracking-[0.16em]">{block.label.toUpperCase()}</div>{block.v && <button onClick={()=>block.set(null)} className="ml-auto sans text-[10px] font-bold underline">CLEAR</button>}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(block.opts as string[]).map(o=>(
                        <button key={o} onClick={()=>block.set(o===block.v?null:o)} className={`sans text-[11px] font-bold rounded-[8px] border-[1.5px] border-[#2F3133] px-3 min-h-[44px] shadow-[1px_1px_0px_#2F3133] transition hover:-translate-y-[1px] ${block.v===o? 'bg-[#00365A] text-white shadow-none translate-x-[1px] translate-y-[1px]' : 'bg-white text-[#2F3133] hover:bg-[#FAF8F3]'}`}>{o}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-4">
            {!settings ? (
              <div data-reveal className="rounded-[18px] border-[1.5px] border-[#2F3133] bg-white p-6 md:p-8 shadow-[4px_4px_0px_#2F3133]">
                <div className="flex gap-2 mb-4">
                  <div className="h-2 w-8 rounded-full bg-[#00365A] border border-[#2F3133]"></div><div className="h-2 w-8 rounded-full bg-[#C64F0E] border border-[#2F3133]"></div><div className="h-2 w-8 rounded-full bg-[#F4B23C] border border-[#2F3133]"></div><div className="h-2 w-8 rounded-full bg-[#D7BB83] border border-[#2F3133]"></div>
                </div>
                <div className="display text-[clamp(24px,3.6vw,34px)] leading-[0.9] text-[#2F3133]">Choose lens,<br/>mode and scene.<br/><span className="text-[#00365A]">Get only</span> <span className="bg-[#F4B23C] border border-[#2F3133] px-2 rounded-[8px]">what matters.</span></div>
                <div className="mt-6 rounded-[12px] border-[1.5px] border-[#2F3133] overflow-hidden">
                  <img src="/images/zf-body.jpg" alt="Retro camera body" loading="lazy" decoding="async" className="w-full h-64 object-cover" />
                  <div className="h-2 w-full flex"><div className="flex-1 bg-[#00365A]"></div><div className="flex-1 bg-[#C64F0E]"></div><div className="flex-1 bg-[#F4B23C]"></div><div className="flex-1 bg-[#D7BB83]"></div></div>
                </div>
              </div>
            ) : (
              <>
                <div data-reveal className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#2F3133] p-3 flex flex-wrap gap-2 items-center shadow-[3px_3px_0px_#2F3133]">
                  <span className="rounded-full bg-[#F4B23C] text-[#2F3133] border border-[#FAF8F3] px-3 py-1.5 sans text-[11px] font-black tracking-widest">{lens==='24-120'?'24-120mm f/4 S':'40mm f/2'} • {mode?.toUpperCase()} • {scene?.toUpperCase()}</span>
                  {[subjectMotion, weather, lighting, cameraMove, subject].filter(Boolean).map(v=>(
                    <span key={v as string} className="rounded-full bg-[#FAF8F3] text-[#2F3133] border border-[#2F3133] px-2.5 py-1 sans text-[10px] font-bold">{v as string}</span>
                  ))}
                  <button onClick={copy} className="ml-auto rounded-full bg-[#C64F0E] border border-[#FAF8F3] text-white px-4 py-1.5 sans text-[11px] font-black tracking-widest shadow-[1px_1px_0px_#FAF8F3] hover:bg-[#00365A] transition">{copied?'COPIED':'COPY'}</button>
                </div>

                <div data-reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {k:'APERTURE', v:settings.aperture, col:'#F4B23C', w:false},
                    {k: mode==='photo'?'SHUTTER':'SHUTTER • 180°', v: mode==='photo'?settings.shutter:settings.videoShutter, col:'#D7BB83', w:false},
                    {k:'ISO', v:settings.iso, col:'#C64F0E', w:true},
                  ].map(c=>(
                    <div key={c.k} className="rounded-[14px] border-[1.5px] border-[#2F3133] p-4 shadow-[2px_2px_0px_#2F3133] hover:-translate-y-[2px] transition" style={{backgroundColor: c.col}}>
                      <div className={`sans text-[10px] font-black tracking-[0.2em] ${c.w?'text-[#FAF8F3]':'text-[#2F3133]'}`}>{c.k}</div>
                      <div className={`mono text-[16px] font-black mt-2 leading-tight ${c.w?'text-white':'text-[#2F3133]'}`}>{c.v}</div>
                    </div>
                  ))}
                </div>

                <div data-reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {k:'FOCAL', v:settings.focal},
                    {k:'FOCUS TYPE', v:settings.fset.focusType},
                    {k:'WHITE BALANCE', v:settings.wb},
                  ].map(c=>(
                    <div key={c.k} className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[2px_2px_0px_#2F3133] hover:-translate-y-[2px] transition">
                      <div className="sans text-[10px] font-black tracking-[0.2em] text-[#564D40]">{c.k}</div>
                      <div className="sans text-[13px] font-black mt-2 leading-tight text-[#2F3133]">{c.v}</div>
                    </div>
                  ))}
                </div>

                {/* AF area + detection + VR */}
                <div data-reveal className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#D7BB83]/40 p-4 shadow-[2px_2px_0px_#2F3133] sm:col-span-2 flex items-center gap-3">
                    <span className="h-12 w-12 shrink-0 rounded-[8px] border-[1.5px] border-[#2F3133] bg-[#FAF8F3] flex items-center justify-center">
                      <AfIcon k={settings.fset.afKey} />
                    </span>
                    <span className="min-w-0">
                      <span className="sans block text-[10px] font-black tracking-[0.2em] text-[#564D40]">AF-AREA MODE</span>
                      <span className="sans block text-[14px] font-black mt-1 leading-tight text-[#2F3133]">{settings.fset.afArea}</span>
                    </span>
                  </div>
                  <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#C64F0E] p-4 shadow-[2px_2px_0px_#2F3133]">
                    <div className="sans text-[10px] font-black tracking-[0.18em] text-[#FAF8F3]">SUBJECT DETECTION</div>
                    <div className="sans text-[14px] font-black mt-2 leading-tight text-white">{settings.fset.detect}</div>
                  </div>
                  <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[2px_2px_0px_#2F3133]">
                    <div className="sans text-[10px] font-black tracking-[0.2em] text-[#564D40]">VR {mode==='video'?'(VIDEO)':''}</div>
                    <div className="sans text-[13px] font-black mt-2 text-[#2F3133]">{settings.fset.vr}</div>
                  </div>
                  <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[2px_2px_0px_#2F3133]">
                    <div className="sans text-[10px] font-black tracking-[0.2em] text-[#564D40]">ELECTRONIC VR</div>
                    <div className="sans text-[13px] font-black mt-2 text-[#2F3133]">{settings.fset.evr}</div>
                  </div>
                  <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#00365A] p-4 shadow-[2px_2px_0px_#2F3133]">
                    <div className="sans text-[10px] font-black tracking-[0.2em] text-[#D7BB83]">WHY</div>
                    <div className="sans text-[12px] font-bold mt-2 leading-tight text-[#FAF8F3]">{settings.fset.why}</div>
                  </div>
                </div>

                {mode==='video' && (
                  <div data-reveal className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[2px_2px_0px_#2F3133]">
                      <div className="sans text-[10px] font-black tracking-[0.2em] text-[#564D40]">VIDEO FORMAT</div>
                      <div className="sans text-[13px] font-black mt-2 text-[#00365A]">{settings.videoRes} • {settings.videoFps}</div>
                      <div className="sans text-[11px] mt-1 text-[#4A4237] font-medium">N-Log if grading • Flat if quick</div>
                    </div>
                    <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#00365A] p-4 shadow-[2px_2px_0px_#2F3133]">
                      <div className="sans text-[10px] font-black tracking-[0.2em] text-[#D7BB83]">CAMERA MOVEMENT • STABILIZER</div>
                      <div className="sans text-[12px] font-bold mt-2 leading-tight text-[#FAF8F3]">
                        {cameraMove ? `${cameraMove} → VR ${settings.fset.vr} • Electronic VR ${settings.fset.evr}` : 'Pick a movement above → Handheld = VR Sport • Tripod = VR Off'}
                      </div>
                    </div>
                  </div>
                )}

                <div data-reveal className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-3 flex justify-between items-center gap-3 shadow-[2px_2px_0px_#2F3133]">
                  <span className="sans text-[10px] font-black tracking-[0.2em] text-[#564D40]">DIAL MODE</span>
                  <span className="sans text-[12px] font-black bg-[#F4B23C] text-[#2F3133] border border-[#2F3133] px-2 py-1 rounded-[6px] text-right">{settings.dialMode}</span>
                </div>

                <div data-reveal className="rounded-[14px] border-[1.5px] border-[#2F3133] bg-[#F4B23C] p-4 shadow-[3px_3px_0px_#2F3133]">
                  <div className="flex items-center gap-2"><div className="h-5 w-5 rounded-full bg-[#2F3133] text-white flex items-center justify-center text-[10px] font-black">!</div><div className="sans text-[11px] font-black tracking-[0.2em] text-[#2F3133]">QUICK TIP</div></div>
                  <div className="sans text-[14px] font-bold leading-relaxed mt-2 text-[#2F3133]">{settings.tip}</div>
                </div>

                {settings.warnings.length>0 && (
                  <div data-reveal className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#C64F0E] text-white p-3 sans text-[12px] font-bold shadow-[2px_2px_0px_#2F3133]">⚠ {settings.warnings[0]}</div>
                )}
              </>
            )}
          </div>
        </div>

      </main>

      {/* ===== CAM MAP BAND ===== */}
      <section id="map" className="relative z-10 scroll-mt-24 border-y-[1.5px] border-[#2F3133] bg-[#F3EDE1]">
        <div className="mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-10 py-10 md:py-16">
          <SectionHead num="B" title="Camera Control Map" sub="TOP VIEW · FOUR MAIN DIALS" tone="char" />
          <div data-reveal><ZfDiagram /></div>

          <div data-reveal className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {t:'01 · ISO DIAL', c:'#F4B23C', w:false, d:'How much light the camera picks up.', pts:['Low ISO → clean photo.','High ISO → grainy photo.','Set this last.','C = camera picks it.']},
              {t:'02 · SHUTTER SPEED DIAL', c:'#00365A', w:true, d:'How long the camera stays open.', pts:['Fast (1/500 → 1/8000) → freezes movement.','Slow (1/30 → 30 sec) → blurs movement.','Walking 1/250 • Running 1/500 • Sports 1/1000.','By hand → 1/60 or faster.','B and T → very long shots.']},
              {t:'03 · APERTURE DIAL', c:'#F4B23C', w:false, d:'How blurry the background is.', pts:['f/2 → blurry background.','f/8 → most things sharp.','Front dial sets it.','Shown on the top screen.']},
              {t:'04 · EXPOSURE COMP DIAL', c:'#C64F0E', w:true, d:'Makes the photo brighter or darker.', pts:['+ → brighter.','− → darker.','Snow or sand → use +.','Bright lights → use −.']},
            ].map(x=>(
              <article key={x.t} className="rounded-[16px] border-[1.5px] border-[#2F3133] bg-white shadow-[3px_3px_0px_#2F3133] overflow-hidden">
                <div className="px-4 py-3 border-b-[1.5px] border-[#2F3133]" style={{background:x.c}}>
                  <h3 className={`sans text-[12px] font-black tracking-[0.16em] ${x.w?'text-[#FAF8F3]':'text-[#2F3133]'}`}>{x.t}</h3>
                </div>
                <div className="p-4">
                  <p className="sans text-[13px] font-bold text-[#2F3133]">{x.d}</p>
                  <ul className="mt-3 space-y-1.5">
                    {x.pts.map(p=>(
                      <li key={p} className="flex gap-2 sans text-[12.5px] leading-[1.5] text-[#2F3133]">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full border border-[#2F3133]" style={{background:x.c}}></span><span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Focus mode legend */}
          <div data-reveal className="mt-6 rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-5 shadow-[3px_3px_0px_#2F3133]">
            <div className="sans text-[12px] font-black tracking-[0.2em] text-[#2F3133]">FOCUS MODE • 4 TYPES</div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                {k:'AF-S', d:'Subject stays still → locks once.', c:'#F4B23C', w:false},
                {k:'AF-C', d:'Subject moves → keeps following.', c:'#00365A', w:true},
                {k:'AF-F', d:'Video → focuses on its own.', c:'#C64F0E', w:true},
                {k:'MF',   d:'You focus by hand.', c:'#2F3133', w:true},
              ].map(f=>(
                <div key={f.k} className="rounded-[10px] border-[1.5px] border-[#2F3133] bg-[#FAF8F3] overflow-hidden">
                  <div className="px-3 py-2 border-b-[1.5px] border-[#2F3133]" style={{background:f.c}}>
                    <span className={`sans text-[12px] font-black tracking-[0.14em] ${f.w?'text-[#FAF8F3]':'text-[#2F3133]'}`}>{f.k}</span>
                  </div>
                  <div className="p-3 sans text-[12px] font-bold leading-tight text-[#2F3133]">{f.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AF-area symbol legend */}
          <div data-reveal className="mt-6 rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-5 shadow-[3px_3px_0px_#2F3133]">
            <div className="sans text-[12px] font-black tracking-[0.2em] text-[#2F3133]">AF-AREA SYMBOLS ON YOUR CAMERA</div>
            <p className="sans text-[12px] mt-1 mut font-medium">Match the symbol on screen → to the mode name.</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {(['pinpoint','single','dynS','dynM','dynL','wideS','wideL','wideC1','wideC2','3d','subject','auto'] as AfKey[]).map(k=>(
                <div key={k} className="flex items-center gap-2 rounded-[10px] border-[1.5px] border-[#2F3133] bg-[#FAF8F3] px-2.5 py-2">
                  <span className="h-9 w-9 shrink-0 rounded-[6px] border border-[#2F3133] bg-white flex items-center justify-center">
                    <AfIcon k={k} size={28} />
                  </span>
                  <span className="sans text-[11px] font-black leading-tight text-[#2F3133]">{AF_LABEL[k]}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="mt-6 rounded-[16px] border-[1.5px] border-[#2F3133] bg-white p-5 shadow-[3px_3px_0px_#2F3133]">
            <div className="sans text-[12px] font-black tracking-[0.2em] text-[#2F3133]">GOOD TO KNOW</div>
            <p className="sans text-[13px] leading-[1.6] mt-2 text-[#4A4237] font-medium max-w-[75ch]">
              The 40mm f/2 has no ring for aperture. Its ring is only for focus → so you set aperture with the front dial on the camera.
            </p>
          </div>

          <div data-reveal className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="#/rules" className="group rounded-[14px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[3px_3px_0px_#2F3133] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#2F3133] transition no-underline">
              <div className="sans text-[11px] font-black tracking-[0.18em] px-2 py-1 rounded-full inline-block text-[#FAF8F3] bg-[#C64F0E]">RULES</div>
              <div className="sans text-[13px] font-bold mt-2.5 text-[#2F3133]">Four short rules to remember.</div>
              <div className="sans text-[11px] font-black tracking-[0.16em] mt-2 text-[#00365A] group-hover:text-[#C64F0E] transition">OPEN →</div>
            </a>
            <a href="#/diagnoser" className="group rounded-[14px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[3px_3px_0px_#2F3133] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#2F3133] transition no-underline">
              <div className="sans text-[11px] font-black tracking-[0.18em] px-2 py-1 rounded-full inline-block text-[#FAF8F3] bg-[#2F3133]">DIAGNOSER</div>
              <div className="sans text-[13px] font-bold mt-2.5 text-[#2F3133]">Shot looks bad? Find the fix.</div>
              <div className="sans text-[11px] font-black tracking-[0.16em] mt-2 text-[#00365A] group-hover:text-[#C64F0E] transition">OPEN →</div>
            </a>
          </div>
        </div>
      </section>
    </Shell>
  );
}
