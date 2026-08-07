import Shell, { SectionHead, PageHero, BtnLink } from '../components/Shell';

export default function Rules(){
  return (
    <Shell active="#/rules">
      <PageHero
        eyebrow="RULES • LAB NOTES"
        accent="#C64F0E"
        title={<>Four rules<br/><span className="relative inline-block">worth knowing.<span className="absolute bottom-1 left-0 w-full h-[10px] bg-[#D7BB83] -z-10 rounded-full"></span></span></>}
        lead="Short, retro lab notes. Learn these and most exposure problems solve themselves before you press the shutter."
        actions={<><BtnLink href="#notes">READ THE RULES</BtnLink><BtnLink href="#/diagnoser" variant="plain">DIAGNOSE A SHOT</BtnLink></>}
        art={
          <div className="p-6 md:p-8">
            <svg viewBox="0 0 320 200" className="w-full h-auto block" role="img" aria-label="Exposure triangle">
              <polygon points="160,22 296,178 24,178" fill="none" stroke="#2F3133" strokeWidth="3"/>
              <circle cx="160" cy="22" r="24" fill="#F4B23C" stroke="#2F3133" strokeWidth="3"/>
              <text x="160" y="27" textAnchor="middle" fontSize="10" fontWeight={800} fill="#2F3133" fontFamily="'Space Grotesk',sans-serif">APER</text>
              <circle cx="296" cy="178" r="24" fill="#00365A" stroke="#2F3133" strokeWidth="3"/>
              <text x="296" y="183" textAnchor="middle" fontSize="10" fontWeight={800} fill="#FAF8F3" fontFamily="'Space Grotesk',sans-serif">SHUT</text>
              <circle cx="24" cy="178" r="24" fill="#C64F0E" stroke="#2F3133" strokeWidth="3"/>
              <text x="24" y="183" textAnchor="middle" fontSize="10" fontWeight={800} fill="#FAF8F3" fontFamily="'Space Grotesk',sans-serif">ISO</text>
              <circle cx="160" cy="126" r="30" fill="#D7BB83" stroke="#2F3133" strokeWidth="3"/>
              <text x="160" y="131" textAnchor="middle" fontSize="10" fontWeight={800} fill="#2F3133" fontFamily="'Space Grotesk',sans-serif">BALANCE</text>
            </svg>
          </div>
        }
      />

      <main id="notes" className="relative z-10 scroll-mt-24 mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-10 py-10 md:py-16">
        <SectionHead num="A" title="Exposure Rules" sub="RETRO LAB NOTES · WORTH MEMORISING" tone="orange" />

        <div data-reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[2px_2px_0px_#2F3133] hover:-translate-y-[2px] transition">
            <div className="sans text-[12px] font-black text-[#2F3133]">1 • 180° SHUTTER RULE</div>
            <div className="sans text-[11px] leading-[1.5] mt-1.5 text-[#4A4237] font-medium">Video looks natural when shutter is double the frame rate.</div>
            <div className="mono text-[11px] mt-2 bg-[#F4B23C] text-[#2F3133] border border-[#2F3133] inline-block px-2 py-1 rounded-[6px] font-black">1/50 at 24p • 1/60 at 30p • 1/120 at 60p</div>
          </div>
          <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#D7BB83]/30 p-4 shadow-[2px_2px_0px_#2F3133] hover:-translate-y-[2px] transition">
            <div className="sans text-[12px] font-black text-[#2F3133]">2 • RECIPROCAL • Handheld</div>
            <div className="sans text-[11px] leading-[1.5] mt-1.5 text-[#4A4237] font-medium">Minimum shutter is 1 over focal length to avoid shake.</div>
            <div className="mono text-[11px] mt-2 bg-white text-[#2F3133] border border-[#2F3133] inline-block px-2 py-1 rounded-[6px] font-black">40mm → 1/40 min • 120mm → 1/125 min</div>
          </div>
          <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#00365A] p-4 shadow-[2px_2px_0px_#2F3133] hover:-translate-y-[2px] transition">
            <div className="sans text-[12px] font-black text-[#F4B23C]">3 • MOTION FREEZE</div>
            <div className="sans text-[11px] leading-[1.5] mt-1.5 text-white/85 font-medium">How fast the subject moves sets the shutter you need.</div>
            <div className="mono text-[11px] mt-2 leading-[1.7] text-white">Walking • 1/250<br/>Running • 1/500<br/>Sports or Birds • 1/1000 to 1/2000</div>
          </div>
          <div className="rounded-[12px] border-[1.5px] border-[#2F3133] bg-[#C64F0E] p-4 shadow-[2px_2px_0px_#2F3133] hover:-translate-y-[2px] transition">
            <div className="sans text-[12px] font-black text-white">4 • NOISE RULE • ISO Last</div>
            <div className="sans text-[11px] leading-[1.5] mt-1.5 text-white/90 font-medium">Set the look and the freeze first, then lift ISO only as needed.</div>
            <div className="mono text-[11px] mt-2 bg-[#FAF8F3] text-[#2F3133] border border-[#2F3133] inline-block px-2 py-1 rounded-[6px] font-black">Aperture → Shutter → ISO</div>
          </div>
        </div>

        <div data-reveal className="mt-4 rounded-[12px] border-[1.5px] border-[#2F3133] bg-white p-4 md:p-5 shadow-[2px_2px_0px_#2F3133]">
          <div className="sans text-[12px] font-black text-[#2F3133]">5 • SETTING ORDER • BY TYPE</div>
          <div className="sans text-[11px] leading-[1.5] mt-1 mut font-medium">For different types of photography</div>
          <ul className="mt-3 divide-y divide-[#E9DFD0]">
            {[
              {t:'Portrait',          o:'Aperture → Shutter → ISO', c:'#F4B23C'},
              {t:'Landscape',         o:'Aperture → Shutter → ISO', c:'#F4B23C'},
              {t:'Sports / Wildlife', o:'Shutter → Aperture → ISO', c:'#00365A', w:true},
              {t:'Night handheld',    o:'Shutter → Aperture → ISO', c:'#00365A', w:true},
              {t:'Video',             o:'Shutter → Aperture → ISO', c:'#C64F0E', w:true, n:'For video shooting Shutter is usually fixed first using the 180° shutter rule, then aperture, then ISO.'},
            ].map(r=>(
              <li key={r.t} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5">
                <span className="sans text-[11px] font-black tracking-wide text-[#2F3133] min-w-[112px]">{r.t}</span>
                <span className="mono text-[11px] font-black border border-[#2F3133] rounded-[6px] px-2 py-1" style={{background:r.c, color: r.w ? '#FAF8F3' : '#2F3133'}}>{r.o}</span>
                {r.n && <span className="sans text-[10.5px] leading-[1.45] mut font-medium basis-full">{r.n}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="#/" className="group rounded-[14px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[3px_3px_0px_#2F3133] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#2F3133] transition no-underline">
            <div className="sans text-[11px] font-black tracking-[0.18em] px-2 py-1 rounded-full inline-block text-[#FAF8F3] bg-[#00365A]">SETTINGS</div>
            <div className="sans text-[13px] font-bold mt-2.5 text-[#2F3133]">Get settings + see the dials.</div>
            <div className="sans text-[11px] font-black tracking-[0.16em] mt-2 text-[#00365A] group-hover:text-[#C64F0E] transition">OPEN →</div>
          </a>
          <a href="#/diagnoser" className="group rounded-[14px] border-[1.5px] border-[#2F3133] bg-white p-4 shadow-[3px_3px_0px_#2F3133] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#2F3133] transition no-underline">
            <div className="sans text-[11px] font-black tracking-[0.18em] px-2 py-1 rounded-full inline-block text-[#FAF8F3] bg-[#C64F0E]">DIAGNOSER</div>
            <div className="sans text-[13px] font-bold mt-2.5 text-[#2F3133]">A shot went wrong? Find the cause and the fix.</div>
            <div className="sans text-[11px] font-black tracking-[0.16em] mt-2 text-[#00365A] group-hover:text-[#C64F0E] transition">OPEN →</div>
          </a>
        </div>
      </main>
    </Shell>
  );
}
