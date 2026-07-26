/* Nikon Zf Field Notes — interaction layer */
const settings = {
  iso: "100",
  shutter: "1/50",
  aperture: "f/2.8",
  ev: 0,
  frameRate: "25p",
  whiteBalance: "7000",
  focusMode: "AF-C · People",
  metering: "Highlight-weighted",
  toneMode: "Flat SDR",
  stabilisation: "IBIS ON · e-VR OFF"
};

const dialValues = {
  iso: ["100", "200", "400", "800", "1600", "3200", "6400", "12800"],
  shutter: ["1/25", "1/50", "1/100", "1/125", "1/200", "1/250", "1/500", "1/1000", "1/1600", "1/3200"],
  aperture: ["f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16"],
  ev: [-2, -1.7, -1.3, -1, -0.7, -0.3, 0, 0.3, 0.7, 1, 1.3, 1.7, 2]
};

const categories = [
  { id: "daylight", label: "☀️ Daylight", short: "Daylight" },
  { id: "indoor", label: "🏠 Indoor day", short: "Indoor" },
  { id: "bluehour", label: "🌆 Blue hour", short: "Blue hour" },
  { id: "nightstreet", label: "🌙 Night street", short: "Night street" },
  { id: "nightevent", label: "🎉 Night events", short: "Events" },
  { id: "vehicle", label: "🚗 Vehicle & movement", short: "Vehicle" },
  { id: "slowmo", label: "⚡ Slow motion", short: "Slow-mo" },
  { id: "special", label: "🌌 Special", short: "Special" }
];

/* All 35 scenarios from the Nikon Zf + 40mm f/2 no-ND master guide.
   photo = realistic scene image shown in the live preview + scene card. */
const presets = [
  { id: "s1", num: 1, cat: "daylight", icon: "◱", name: "Interview · Open Shade", rail: "best no-ND case", photo: "shade",
    desc: "An outdoor talking head in soft open shade — the ideal no-ND setup where true 180° shutter survives.",
    iso: "100", shutter: "1/50", aperture: "f/4", frameRate: "25p", whiteBalance: "6500", toneMode: "Flat SDR",
    focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Open shade is 3–4 stops below direct sun. 25p · 1/50 · f/4–5.6 · ISO 100 holds with zero compromise. Use Wide-Area (L-people)." },
  { id: "s2", num: 2, cat: "daylight", icon: "☀", name: "Interview · Direct Sun", rail: "lock it off", photo: "sun",
    desc: "Harsh sun forces a fast shutter. Lock the camera off — or better, move your subject into shade.",
    iso: "100", shutter: "1/500", aperture: "f/8", frameRate: "25p", whiteBalance: "5600", toneMode: "Flat SDR",
    focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "1/500 at f/8 is the balanced direct-sun rung. Motion gets staccato, so use a tripod and avoid fast moves. Shade is always the better fix." },
  { id: "s3", num: 3, cat: "daylight", icon: "◒", name: "Golden Hour Portrait", rail: "free ND", photo: "golden",
    desc: "The easiest beautiful light of the day. Backlight the subject and keep the warmth.",
    iso: "100", shutter: "1/50", aperture: "f/2.8", frameRate: "25p", whiteBalance: "7000", toneMode: "Flat SDR",
    focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Golden hour is your ND. Backlight + a white bounce lifts the face. 6500–7500K keeps the glow warm — don't let AWB neutralise it." },
  { id: "s4", num: 4, cat: "daylight", icon: "▤", name: "Midday B-roll", rail: "open ground", photo: "sun",
    desc: "Bright open ground at noon. High shutter, deep focus, locked-off or very slow moves only.",
    iso: "100", shutter: "1/500", aperture: "f/8", frameRate: "25p", whiteBalance: "5600", toneMode: "Flat SDR",
    focusMode: "MF + peaking", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Set manual focus at hyperfocal and treat every shot like a photograph that breathes. At 1/500, fast pans will look staccato." },
  { id: "s5", num: 5, cat: "daylight", icon: "❂", name: "Midday + Bokeh", rail: "50p hack", photo: "slowmo",
    desc: "You want f/2.8 separation in full sun? Shoot 50p at 1/1000 and conform to 25p — judder vanishes.",
    iso: "100", shutter: "1/1000", aperture: "f/2.8", frameRate: "50p", whiteBalance: "5600", toneMode: "Flat SDR",
    focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF",
    tip: "The best no-ND hack there is: 50p → 25p slow motion hides the fast shutter. ⚠️ 4K 50p adds a 1.5× DX crop — your 40mm frames like 60mm." },
  { id: "s6", num: 6, cat: "daylight", icon: "☁", name: "Overcast Street", rail: "the gift day", photo: "overcast",
    desc: "Clouds are free ND. 180° shutter at ISO 100 with zero compromise — go make images.",
    iso: "100", shutter: "1/50", aperture: "f/8", frameRate: "25p", whiteBalance: "6500", toneMode: "Flat SDR",
    focusMode: "AF-C · Auto-area", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Overcast means f/8–11 at 1/50 and ISO 100. Soft, even light in every direction — shoot coverage sets: wide → medium → close → detail." },
  { id: "s7", num: 7, cat: "daylight", icon: "⌁", name: "Street Walking Shot", rail: "day · moving", photo: "walk",
    desc: "A handheld walking shot through a daytime street. e-VR on, knees bent, heel-toe steps.",
    iso: "800", shutter: "1/50", aperture: "f/4", frameRate: "25p", whiteBalance: "5600", toneMode: "Flat SDR",
    focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR ON",
    tip: "Accept the 1.1× e-VR crop and frame slightly wider. ISO 400–1600 keeps f/4 alive in shaded lanes. Walk heel-toe with bent knees." },
  { id: "s8", num: 8, cat: "daylight", icon: "△", name: "Landscape / Establishing", rail: "tripod & depth", photo: "landscape",
    desc: "Sharp from foreground to horizon. Tripod, IBIS off, manual focus with punch-in.",
    iso: "100", shutter: "1/50", aperture: "f/8", frameRate: "25p", whiteBalance: "5600", toneMode: "Flat SDR",
    focusMode: "MF + peaking", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "IBIS drifts when locked off — switch it OFF on a tripod. f/8–11, punch in to confirm focus, and hold every shot for 10 seconds." },
  { id: "s9", num: 9, cat: "daylight", icon: "☂", name: "Rain / Monsoon Street", rail: "wet light", photo: "rain",
    desc: "Wet ground doubles your light with reflections. Shield the fragile micro-HDMI port.",
    iso: "800", shutter: "1/50", aperture: "f/5.6", frameRate: "25p", whiteBalance: "6000", toneMode: "Flat SDR",
    focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Reflections on wet roads are free production value. ISO 400–1600 rides the changing clouds. Keep a cloth on the camera and cover the ports." },
  { id: "s10", num: 10, cat: "indoor", icon: "▦", name: "Indoor Interview · Window", rail: "window at 45°", photo: "window",
    desc: "A window at 45° is a free softbox. Negative fill on the shadow side, N-Log for grading room.",
    iso: "800", shutter: "1/50", aperture: "f/2.8", frameRate: "25p", whiteBalance: "4000", toneMode: "N-Log",
    focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "N-Log starts at ISO 800 — never below. Eye-detect to find focus, then lock it. ETTR by about +1 stop so shadows stay clean." },
  { id: "s11", num: 11, cat: "indoor", icon: "☕", name: "Café / Restaurant B-roll", rail: "practicals", photo: "cafe",
    desc: "Warm practicals, shallow depth, braced elbows. Grey-card the white balance — mixed LEDs lie.",
    iso: "1600", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3800", toneMode: "N-Log",
    focusMode: "MF + peaking", metering: "Center-weighted", stabilisation: "IBIS ON · e-VR OFF",
    tip: "ISO 800–3200 with f/2 wide open. Manual focus + peaking beats AF hunting in dim rooms. Do a grey-card custom WB — mixed LEDs lie." },
  { id: "s12", num: 12, cat: "indoor", icon: "▣", name: "Product / Food Macro", rail: "0.29 m limit", photo: "product",
    desc: "Tactile close-up detail on a tripod. The 40mm focuses no closer than 0.29 m — never trust AF here.",
    iso: "100", shutter: "1/50", aperture: "f/5.6", frameRate: "25p", whiteBalance: "5000", toneMode: "Flat SDR",
    focusMode: "MF + peaking", metering: "Center-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "Minimum focus is 0.29 m at 0.17× magnification. Manual focus + punch-in, always. f/4–5.6 keeps the whole plate readable." },
  { id: "s13", num: 13, cat: "indoor", icon: "▰", name: "Office Talking Head", rail: "1/50 only", photo: "window",
    desc: "Corporate interview under tube lights. 1/50 only — 1/60 will band under Indian 50 Hz light.",
    iso: "800", shutter: "1/50", aperture: "f/2.8", frameRate: "25p", whiteBalance: "4300", toneMode: "N-Log",
    focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "Tube-light banding is invisible until the edit. Stay at 1/50, do a 5-second flicker test roll, and keep faces at 42–50 IRE in N-Log." },
  { id: "s14", num: 14, cat: "bluehour", icon: "🏙", name: "Blue Hour Cityscape", rail: "best 20 min", photo: "bluecity",
    desc: "🏆 The best light of the day, and it lasts 20–25 minutes. Tripod, N-Log, focus at infinity — shoot fast.",
    iso: "800", shutter: "1/50", aperture: "f/4", frameRate: "25p", whiteBalance: "4500", toneMode: "N-Log",
    focusMode: "MF locked", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "Sky and city lights balance for only ~20 minutes. Plan the shot list before the sun goes. MF at infinity, confirmed with punch-in." },
  { id: "s15", num: 15, cat: "bluehour", icon: "◐", name: "Blue Hour Portrait / Walk", rail: "sky backdrop", photo: "bluecity",
    desc: "Use the deep blue sky as your backdrop and a practical light as the key.",
    iso: "1600", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "4200", toneMode: "N-Log",
    focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF",
    tip: "f/2–2.8 with ISO 800–3200. A shop sign or streetlamp becomes the key light while the sky holds colour behind." },
  { id: "s16", num: 16, cat: "nightstreet", icon: "✺", name: "Neon Street / Market", rail: "expose the sign", photo: "neon",
    desc: "Expose for the sign, not the street. Let the blacks crush — grey mush is worse than deep black.",
    iso: "3200", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3600", toneMode: "Flat SDR",
    focusMode: "AF-C · Tracking", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF",
    tip: "ISO 3200–6400 at f/2. Protect the neon from clipping and let the shadows fall away. Slow tracking stops AF jumping to passers-by." },
  { id: "s17", num: 17, cat: "nightstreet", icon: "☾", name: "Streetlamp Portrait", rail: "rim light", photo: "lamp",
    desc: "One lamp behind and 45° above becomes a rim light. Pre-focus with a phone torch, then lock.",
    iso: "3200", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3400", toneMode: "Flat SDR",
    focusMode: "MF locked", metering: "Spot", stabilisation: "IBIS ON · e-VR OFF",
    tip: "At 1.5 m and f/2, depth of field is only 17 cm. Manual focus locked, subject on a floor mark, and nobody leans in or out." },
  { id: "s18", num: 18, cat: "nightstreet", icon: "➶", name: "Night Walking / POV", rail: "focus safety", photo: "neon",
    desc: "A moving night shot. f/2.8 buys focus safety — worth one stop of ISO.",
    iso: "6400", shutter: "1/50", aperture: "f/2.8", frameRate: "25p", whiteBalance: "3800", toneMode: "Flat SDR",
    focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR ON",
    tip: "e-VR ON for the walk (1.1× crop). At f/2 a moving subject slips out of focus constantly — f/2.8 with ISO 6400 is the smarter trade." },
  { id: "s19", num: 19, cat: "nightstreet", icon: "◗", name: "Dim Lane / Distant Lamp", rail: "the deep end", photo: "lamp",
    desc: "Almost no light. Brace on a wall, lock manual focus, and plan to denoise in post.",
    iso: "12800", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3200", toneMode: "Flat SDR",
    focusMode: "MF locked", metering: "Spot", stabilisation: "IBIS ON · e-VR OFF",
    tip: "ISO 6400–12800 is emergency territory: denoise is mandatory and delivering 1080p from the 4K frame hides the rest." },
  { id: "s20", num: 20, cat: "nightstreet", icon: "∿", name: "Night Traffic / Light Trails", rail: "360° shutter", photo: "trails",
    desc: "A 1/25 shutter at 25p smears headlights into ribbons and buys a free stop. Tripod only.",
    iso: "800", shutter: "1/25", aperture: "f/4", frameRate: "25p", whiteBalance: "3600", toneMode: "N-Log",
    focusMode: "MF locked", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "The 360° shutter (1/25) is only usable on a locked tripod — every camera wobble smears too. Beautiful for traffic, rivers of light, rain." },
  { id: "s21", num: 21, cat: "nightevent", icon: "🍸", name: "Bar / Lounge / Café Night", rail: "sit by a practical", photo: "cafe",
    desc: "Seat your subject beside a lamp and let the room fall dark around them.",
    iso: "1600", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3200", toneMode: "N-Log",
    focusMode: "MF + peaking", metering: "Center-weighted", stabilisation: "IBIS ON · e-VR OFF",
    tip: "N-Log with ETTR +1 stop keeps shadows clean at ISO 1600–3200. Peaking level 3 makes manual focus reliable in the dark." },
  { id: "s22", num: 22, cat: "nightevent", icon: "◨", name: "Night Interview · One LED", rail: "45° key", photo: "window",
    desc: "One LED panel at 45° plus negative fill is a complete night interview kit.",
    iso: "800", shutter: "1/50", aperture: "f/2.8", frameRate: "25p", whiteBalance: "3200", toneMode: "N-Log",
    focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "Key at 45°, negative fill opposite. In N-Log put Indian/medium skin at 42–50 IRE on the waveform, then trust it." },
  { id: "s23", num: 23, cat: "nightevent", icon: "⌂", name: "House Party / Function", rail: "flicker test first", photo: "stage",
    desc: "Home functions mix every cheap LED ever made. Run a 5-second flicker test before anything else.",
    iso: "3200", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3600", toneMode: "Flat SDR",
    focusMode: "AF-C · People", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF",
    tip: "1/50 only — 1/60 will band. Flat SDR keeps the edit fast for family delivery. ISO 3200–6400 and let f/2 do the work." },
  { id: "s24", num: 24, cat: "nightevent", icon: "✦", name: "Wedding Reception / Stage", rail: "red clips first", photo: "stage",
    desc: "Coloured LED wash clips the red channel first. Underexpose faces ⅓ stop and keep moving.",
    iso: "3200", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "4200", toneMode: "Flat SDR",
    focusMode: "AF-C · Tracking", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF",
    tip: "⚠️ Watch the waveform when the DJ light hits faces — red clips before the exposure looks wrong. ISO 1600–6400 rides the light changes." },
  { id: "s25", num: 25, cat: "nightevent", icon: "♫", name: "Concert / Live Stage", rail: "meter the peak", photo: "stage",
    desc: "Meter for the brightest lighting moment of the show, not the darkest.",
    iso: "6400", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "4000", toneMode: "Flat SDR",
    focusMode: "AF-C · Tracking", metering: "Spot", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Stage lights swing 4+ stops in seconds. Set exposure for the peak moment so the chorus doesn't clip. Brace against the barrier." },
  { id: "s26", num: 26, cat: "nightevent", icon: "🪔", name: "Diwali Diyas / Candlelight", rail: "let flames clip", photo: "diya",
    desc: "A face lit only by diya flames. Let the flames clip — they're supposed to glow.",
    iso: "6400", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "2800", toneMode: "Flat SDR",
    focusMode: "MF locked", metering: "Spot", stabilisation: "IBIS ON · e-VR OFF",
    tip: "2800–3200K keeps flames golden, not orange soup. A hidden warm LED at 5–10% lifts the shadow side. 1/25 is allowed — on a tripod." },
  { id: "s27", num: 27, cat: "nightevent", icon: "❋", name: "Fireworks / Festival Lights", rail: "bursts are bright", photo: "fireworks",
    desc: "Bursts are brighter than you think — stop down and expose just under zebra.",
    iso: "1600", shutter: "1/50", aperture: "f/4", frameRate: "25p", whiteBalance: "3800", toneMode: "N-Log",
    focusMode: "MF locked", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "MF at infinity, tripod locked, f/2.8–4. Set exposure on the first burst and leave it — chasing fireworks with exposure ruins every take." },
  { id: "s28", num: 28, cat: "vehicle", icon: "▢", name: "Car Interior · Parked Night", rail: "dash glow key", photo: "car",
    desc: "Dashboard glow plus a phone-screen bounce is a free two-light setup.",
    iso: "6400", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3400", toneMode: "Flat SDR",
    focusMode: "MF locked", metering: "Center-weighted", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Kill the AC before rolling — the vent noise ruins the audio. Lock focus; nobody moves much in a car seat." },
  { id: "s29", num: 29, cat: "vehicle", icon: "➜", name: "Moving Vehicle / Dash POV", rail: "rolling shutter", photo: "car",
    desc: "Clamp the camera hard. Rolling shutter skews passing poles — steady the camera, not the car.",
    iso: "6400", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3600", toneMode: "Flat SDR",
    focusMode: "MF locked", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF",
    tip: "⚠️ Vertical lines (poles, pillars) bend during fast passes — frame to avoid them or embrace the look. A hard clamp beats any soft mount." },
  { id: "s30", num: 30, cat: "vehicle", icon: "✥", name: "Gimbal Move (Any Light)", rail: "slow & deliberate", photo: "walk",
    desc: "The 40mm is a tiny gimbal load. Slow, deliberate, motivated moves only.",
    iso: "100", shutter: "1/50", aperture: "f/8", frameRate: "25p", whiteBalance: "5600", toneMode: "Flat SDR",
    focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Day-shade: 1/50 at f/8. Direct sun: 1/500. Night: f/2 and ISO as needed. Whatever the light — one movement per shot." },
  { id: "s31", num: 31, cat: "slowmo", icon: "↯", name: "Slow-mo Hero (Day)", rail: "100p · 1080", photo: "slowmo",
    desc: "4–5× slow motion for hero shots. 1080/100p at 1/200 — save it for moments that earn it.",
    iso: "400", shutter: "1/200", aperture: "f/4", frameRate: "100p", whiteBalance: "5600", toneMode: "Flat SDR",
    focusMode: "MF + peaking", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Pre-set focus where the action will happen — AF can't keep up at 100p. Alternative: 4K 50p, but remember the 1.5× DX crop (40→60mm)." },
  { id: "s32", num: 32, cat: "slowmo", icon: "☽", name: "Slow-mo Night (Lit Subject)", rail: "costs a stop", photo: "neon",
    desc: "Slow motion at night costs a stop. 50p max — 100/120p at night is a noise disaster.",
    iso: "6400", shutter: "1/100", aperture: "f/2", frameRate: "50p", whiteBalance: "3600", toneMode: "Flat SDR",
    focusMode: "MF locked", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod",
    tip: "1/100 at 50p keeps the 180° rule and stays flicker-safe under 50 Hz light. Only attempt with a genuinely lit subject." },
  { id: "s33", num: 33, cat: "slowmo", icon: "↻", name: "2× Cinematic Slow-mo", rail: "looks expensive", photo: "slowmo",
    desc: "The universal 'looks expensive' hack: shoot 50p, conform to 25p in the edit.",
    iso: "100", shutter: "1/100", aperture: "f/4", frameRate: "50p", whiteBalance: "5600", toneMode: "Flat SDR",
    focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Everything slows gracefully: hair, fabric, steam, traffic. ⚠️ In 4K the 50p DX crop turns your 40mm into a 60mm — don't intercut carelessly." },
  { id: "s34", num: 34, cat: "special", icon: "◑", name: "B&W Night Street", rail: "commit to mono", photo: "neon",
    desc: "Monochrome is a commitment — colour is unrecoverable. High-ISO noise reads as film grain.",
    iso: "6400", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3600", toneMode: "Monochrome",
    focusMode: "MF locked", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF",
    tip: "Zone-focus manually at ~2 m and shoot from the hip. In mono, ISO 6400 noise becomes texture instead of a problem." },
  { id: "s35", num: 35, cat: "special", icon: "✧", name: "Astro / Star Field", rail: "stills → timelapse", photo: "astro",
    desc: "Real-time star video isn't viable at 40mm. Shoot stills with the interval timer, build a timelapse.",
    iso: "3200", shutter: "1/25", aperture: "f/2", frameRate: "25p", whiteBalance: "4000", toneMode: "Flat SDR",
    focusMode: "MF locked", metering: "Matrix", stabilisation: "IBIS OFF · Tripod",
    tip: "Switch to Photo mode: interval timer, f/2, ISO 3200–6400, multi-second exposures. MF at infinity confirmed with punch-in on a bright star.",
    special: "PHOTO MODE + INTERVAL TIMER" },
];

/* Beginner-friendly quick picks that map onto guide scenarios */
const quickPicks = [
  { label: "Portrait", target: "s3" }, { label: "Landscape", target: "s8" },
  { label: "Street", target: "s6" }, { label: "Wildlife", target: "s5" },
  { label: "Sports", target: "s31" }, { label: "Golden Hour", target: "s3" },
  { label: "Blue Hour", target: "s14" }, { label: "Night", target: "s16" },
  { label: "Wedding", target: "s24" }, { label: "Travel", target: "s7" },
  { label: "Product", target: "s12" }, { label: "Food", target: "s12" }
];

const fieldTips = [
  "Shutter = 1 ÷ (2 × fps). Break it upward in sun; downward (1/25) only at night on a tripod.",
  "Base ISO first — 100 for Flat SDR, 800 for N-Log. Never chase exposure with ISO.",
  "f/16 is the hard daylight ceiling; f/2 is the night floor.",
  "Only 1/50 and 1/100 under Indian artificial light — 1/60 and 1/125 will band.",
  "Day: protect highlights. Night: protect the face and let the blacks crush.",
  "Consistency within a scene beats correctness across scenes.",
  "Golden hour is your ND. Schedule around it religiously.",
  "Open shade is 3–4 stops below direct sun — it rescues the 180° shutter instantly.",
  "Hold every shot 10 seconds minimum, even if you use 3.",
  "One movement per shot. Pan or push in — never both.",
  "A 90° pan at 40mm should take at least 6 seconds.",
  "Record 10 seconds of room tone at every location.",
  "At 1.5 m and f/2, depth of field is only 17 cm. Manual focus and lock it.",
  "e-VR crops 1.1× — frame wider before you turn it on.",
  "4K 50p forces a 1.5× DX crop: your 40mm becomes a 60mm equivalent.",
  "Deviate deliberately, never accidentally."
];
let tipIndex = 0;

let activePreset = presets[2]; // Golden Hour Portrait
let activeFilter = "all";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const photoSrc = name => `assets/scenes/${name}.jpg`;

function renderPresets() {
  const list = $("#presetList");
  let html = "";
  categories.forEach(cat => {
    const group = presets.filter(p => p.cat === cat.id);
    html += `<div class="rail-group">${cat.label}</div>`;
    html += group.map(p => `
      <button class="preset-button ${p.id === activePreset.id ? "active" : ""}" type="button" data-preset="${p.id}">
        <span class="preset-icon">${String(p.num).padStart(2, "0")}</span><span>${p.name}<small>${p.rail}</small></span>
      </button>`).join("");
  });
  list.innerHTML = html;
  $$("[data-preset]", list).forEach(button => button.addEventListener("click", () => loadPreset(button.dataset.preset)));
}

function renderQuickPicks() {
  const wrap = $("#quickPicks");
  if (!wrap) return;
  wrap.innerHTML = quickPicks.map(q => `<button type="button" class="quick-chip" data-target="${q.target}">${q.label}</button>`).join("");
  $$(".quick-chip", wrap).forEach(chip => chip.addEventListener("click", () => {
    loadPreset(chip.dataset.target);
    $("#simulator").scrollIntoView({ behavior: "smooth" });
  }));
}

function renderFilterChips() {
  const wrap = $("#sceneFilters");
  if (!wrap) return;
  wrap.innerHTML = [`<button type="button" class="filter-chip active" data-filter="all">All 35</button>`]
    .concat(categories.map(c => `<button type="button" class="filter-chip" data-filter="${c.id}">${c.label}</button>`)).join("");
  $$(".filter-chip", wrap).forEach(chip => chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter;
    $$(".filter-chip", wrap).forEach(c => c.classList.toggle("active", c === chip));
    renderSceneCards();
  }));
}

function renderSceneCards() {
  const cards = $("#sceneCards");
  const visible = presets.filter(p => activeFilter === "all" || p.cat === activeFilter);
  cards.innerHTML = visible.map(p => `
    <button class="scene-card" type="button" data-preset="${p.id}" aria-label="Load scenario ${p.num}: ${p.name}">
      <span class="scene-card-photo"><img src="${photoSrc(p.photo)}" alt="" loading="lazy" /><span class="scene-card-number">#${String(p.num).padStart(2, "0")}</span></span>
      <span class="scene-card-body">
        <h3>${p.name}</h3><p>${p.desc}</p>
        <span class="scene-card-settings"><b>${p.frameRate}</b> · ${p.shutter} · ${p.aperture} · ISO ${p.iso} · ${p.whiteBalance}K · ${p.toneMode}</span>
      </span>
    </button>`).join("");
  $$("[data-preset]", cards).forEach(button => button.addEventListener("click", () => {
    loadPreset(button.dataset.preset);
    $("#simulator").scrollIntoView({ behavior: "smooth" });
  }));
}

function renderReferenceRows() {
  $("#scenarioTableBody").innerHTML = presets.map(p => {
    const cat = categories.find(c => c.id === p.cat);
    return `<tr class="scenario-row" data-search="${(p.num + " " + p.name + " " + cat.short + " " + p.desc + " " + p.tip + " " + p.frameRate + " " + p.shutter + " " + p.aperture + " ISO " + p.iso + " " + p.whiteBalance + "K " + p.toneMode + " " + p.focusMode + " " + p.stabilisation).toLowerCase().replace(/"/g, "")}">
      <td data-label="Scene"><b>#${String(p.num).padStart(2, "0")}</b> ${p.name}<small class="row-cat">${cat.label}</small></td>
      <td><b>${p.frameRate}</b> · ${p.shutter}</td>
      <td>${p.aperture} · ISO ${p.iso}</td>
      <td>${p.whiteBalance}K · ${p.toneMode}</td>
      <td>${p.tip}</td>
    </tr>`;
  }).join("");
}

function loadPreset(id, announce = true) {
  const found = presets.find(p => p.id === id);
  if (!found) return;
  activePreset = found;
  ["iso", "shutter", "aperture", "frameRate", "whiteBalance", "focusMode", "metering", "toneMode", "stabilisation"].forEach(key => {
    settings[key] = found[key];
  });
  settings.ev = 0;
  renderPresets();
  updateSimulator("preset");
  if (announce) toast(`#${String(found.num).padStart(2, "0")} ${found.name} loaded`);
}

function formatEV(value) {
  const number = Number(value);
  return number > 0 ? `+${number.toFixed(1)}` : number.toFixed(1);
}

/* Exposure offset in stops vs the scenario's recommended settings */
function exposureStops() {
  const shutterDen = s => Number(String(s).split("/")[1] || 1);
  const apNum = a => Number(String(a).replace("f/", ""));
  const stopsIso = Math.log2(Number(settings.iso) / Number(activePreset.iso));
  const stopsShutter = Math.log2(shutterDen(activePreset.shutter) / shutterDen(settings.shutter));
  const stopsAperture = 2 * Math.log2(apNum(activePreset.aperture) / apNum(settings.aperture));
  return stopsIso + stopsShutter + stopsAperture + Number(settings.ev);
}

function updateSimulator(changed = "") {
  $("#isoDial").textContent = settings.iso;
  $("#shutterDial").textContent = settings.shutter;
  $("#apertureDial").textContent = settings.aperture;
  $("#previewShutter").textContent = settings.shutter;
  $("#previewAperture").textContent = settings.aperture;
  $("#previewIso").textContent = `ISO ${settings.iso}`;
  $("#previewWB").textContent = `${settings.whiteBalance}K`;
  $("#previewEV").textContent = `EV ${formatEV(settings.ev)}`;
  $("#previewMode").textContent = settings.toneMode.toUpperCase();
  $("#previewFps").textContent = settings.frameRate === "100p" ? "1080 100p" : `4K ${settings.frameRate}`;
  $("#previewScene").textContent = `#${String(activePreset.num).padStart(2, "0")} · ${activePreset.name.toUpperCase()}`;
  $("#evOutput").textContent = formatEV(settings.ev);

  ["frameRate", "whiteBalance", "focusMode", "metering", "toneMode", "stabilisation"].forEach(key => {
    const el = $(`#${key}`);
    if (el) el.value = settings[key];
  });

  const preview = $("#previewPanel");
  const img = $("#previewImage");
  const newSrc = photoSrc(activePreset.photo);
  if (!img.getAttribute("src") || !img.getAttribute("src").endsWith(`${activePreset.photo}.jpg`)) {
    preview.classList.add("switching");
    img.src = newSrc;
    img.onload = () => preview.classList.remove("switching");
  }

  /* --- realistic preview response --- */
  const stops = exposureStops();
  const brightness = Math.min(2.1, Math.max(0.4, Math.pow(2, stops * 0.45)));

  const iso = Number(settings.iso);
  const grain = Math.min(0.3, Math.max(0.03, 0.03 + Math.log2(iso / 100) * 0.038));
  preview.style.setProperty("--grain", grain.toFixed(3));

  const kelvinDelta = Number(settings.whiteBalance) - Number(activePreset.whiteBalance);
  const wbColor = kelvinDelta > 0 ? "#ff9c3f" : "#3f7bff";
  const wbOpacity = Math.min(0.42, Math.abs(kelvinDelta) / 3200 * 0.42);
  preview.style.setProperty("--wb-color", wbColor);
  preview.style.setProperty("--wb-opacity", wbOpacity.toFixed(2));

  const mono = settings.toneMode === "Monochrome";
  const nlog = settings.toneMode === "N-Log";
  let filter = `brightness(${brightness.toFixed(2)})`;
  if (mono) filter += " grayscale(1) contrast(1.12)";
  if (nlog) filter += " saturate(.55) contrast(.72) brightness(1.08)";
  img.style.filter = filter;

  /* crop simulation: 4K 50p = 1.5× DX; e-VR = 1.1× */
  const dxCrop = settings.frameRate === "50p" ? 1.5 : 1;
  const evrCrop = settings.stabilisation.includes("e-VR ON") ? 1.1 : 1;
  img.style.transform = `scale(${(dxCrop * evrCrop).toFixed(2)})`;
  const cropBadge = $("#cropBadge");
  if (dxCrop > 1 && evrCrop > 1) cropBadge.textContent = "DX 1.5× + e-VR 1.1× · 40mm ≈ 66mm";
  else if (dxCrop > 1) cropBadge.textContent = "DX 1.5× CROP · 40mm → 60mm eq.";
  else if (evrCrop > 1) cropBadge.textContent = "e-VR 1.1× CROP · frame wider";
  else cropBadge.textContent = "";
  cropBadge.hidden = !cropBadge.textContent;

  const special = $("#specialBadge");
  special.textContent = activePreset.special || "";
  special.hidden = !activePreset.special;

  updateExposureStatus(changed, stops);
  updateSettingHelp(changed);
  $("#fieldTip").textContent = activePreset.tip;
}

function updateExposureStatus(changed, stops = 0) {
  const exactShutter = (settings.frameRate === "25p" && settings.shutter === "1/50") ||
    (settings.frameRate === "50p" && settings.shutter === "1/100") ||
    (settings.frameRate === "100p" && settings.shutter === "1/200");
  const status = $("#exposureState");
  const flicker = $("#flickerMessage");
  const usesSafeFlicker = ["1/25", "1/50", "1/100", "1/200"].includes(settings.shutter);

  let statusClass = "good";
  let title = "Guide-recommended setup";
  let subtitle = "180° shutter • highlight-safe";
  if (!exactShutter) {
    statusClass = "warning";
    title = "Intentional shutter change";
    subtitle = "Check motion feel before you roll";
  }
  if (stops > 0.6) {
    statusClass = "warning";
    title = `About ${stops.toFixed(1)} stops brighter than the recipe`;
    subtitle = "Watch the zebras — protect highlights";
  } else if (stops < -0.6) {
    statusClass = "warning";
    title = `About ${Math.abs(stops).toFixed(1)} stops darker than the recipe`;
    subtitle = "Fix light → aperture → shutter → then ISO";
  }
  if (Number(settings.iso) >= 12800) {
    statusClass = "warning";
    title = "ISO 12800 — emergency only";
    subtitle = "Denoise in post; deliver 1080p from 4K";
  }
  if (settings.toneMode === "N-Log" && Number(settings.iso) < 800) {
    statusClass = "alert";
    title = "N-Log needs ISO 800+";
    subtitle = "Raise ISO to the N-Log base before exposing";
  }
  status.innerHTML = `<span class="state-dot ${statusClass}"></span><div><b>${title}</b><small>${subtitle}</small></div>`;
  if (usesSafeFlicker) {
    flicker.innerHTML = `<i></i><b>50 Hz safe</b> · ${settings.shutter} is friendly to Indian LEDs &amp; tube lights.`;
  } else {
    flicker.innerHTML = `<i class="warn"></i><b>Flicker check</b> · ${settings.shutter} may band under Indian LEDs or tube lights. Test a 5-second clip.`;
  }
}

function updateSettingHelp(changed) {
  const title = $("#helpTitle");
  const text = $("#helpText");
  const tag = $(".help-card-num");
  const help = {
    iso: ["ISO", "ISO controls brightness", Number(settings.iso) <= 100 ? "ISO 100 is clean and ideal for Flat SDR daylight." : Number(settings.iso) >= 6400 ? `ISO ${settings.iso} is the deep end — noise is visible. Protect the face, let blacks crush, denoise in post.` : `ISO ${settings.iso} adds brightness, but also adds grain. Use it only after light, aperture, and shutter.`],
    shutter: ["SHUTTER", "Shutter controls motion", settings.shutter === "1/50" ? "1/50 at 25p gives natural cinematic motion — and works under 50 Hz lighting." : settings.shutter === "1/25" ? "1/25 is the 360° shutter: +1 stop of light and beautiful motion smear. Tripod only." : `${settings.shutter} changes motion blur. Faster looks crisper and more staccato; slower looks smeared.`],
    aperture: ["APERTURE", "Aperture controls depth", settings.aperture === "f/2" ? "f/2 gives maximum separation but the focus area is razor thin — 17 cm at 1.5 m." : settings.aperture === "f/16" ? "f/16 is the hard ceiling. Diffraction softens the image — use it only to hold 1/50 in strong light." : `${settings.aperture} balances light and depth. Higher f-numbers keep more of the scene sharp.`],
    frameRate: ["FRAME", "Frame rate controls time", settings.frameRate === "25p" ? "25p is your everyday cinematic frame rate in India." : settings.frameRate === "50p" ? "50p conforms to lovely 2× slow motion — but 4K 50p adds a 1.5× DX crop (40mm → 60mm)." : "100p records 1080p for 4× slow motion. Save it for hero moments in good light."],
    whiteBalance: ["WB", "White balance locks colour", `${settings.whiteBalance}K keeps every clip consistent. Avoid Auto WB during a take — mixed LEDs lie, use a grey card indoors.`],
    focusMode: ["FOCUS", "Focus should feel invisible", settings.focusMode.startsWith("MF") ? "Manual focus gives certainty. Use red peaking and punch-in, then lock. At night, pre-focus with a phone torch." : "AF-C follows movement. Slow AF speed (−5) and tracking sensitivity 4–5 make it feel like a focus puller, not a webcam."],
    metering: ["METER", "Metering tells the camera where to look", settings.metering === "Highlight-weighted" ? "Highlight-weighted is a good reminder: keep sky and bright skin from clipping." : settings.metering === "Spot" ? "Spot metering reads one small area — perfect for a face under a single lamp." : `${settings.metering} decides which part of the frame guides exposure. Watch the waveform, not just the meter.`],
    toneMode: ["TONE", "Tone mode decides your workflow", settings.toneMode === "N-Log" ? "N-Log needs ISO 800+. ETTR by 1–1.5 stops, keep View Assist on, grade from Nikon's N-Log → Rec.709 LUT. Don't use it outdoors without ND." : settings.toneMode === "Monochrome" ? "Monochrome is a deliberate commitment — colour is unrecoverable. High-ISO noise reads as film grain." : "Flat SDR is the fast, forgiving everyday choice — especially without an ND filter."],
    stabilisation: ["IBIS", "Stability follows support", settings.stabilisation.includes("Tripod") ? "On a locked tripod, switch IBIS and e-VR off to prevent slow drifting." : settings.stabilisation.includes("e-VR ON") ? "e-VR steadies a walking shot but crops the image about 1.1× — see the preview tighten." : "IBIS on with e-VR off is the default for handheld static shots. The 40mm has no OIS — IBIS is all you have."],
    ev: ["EV", "Exposure compensation nudges brightness", `${formatEV(settings.ev)} EV shifts the preview brightness. In manual video, trust the waveform and zebras rather than the meter.`],
    preset: ["SCENE", `Scenario #${String(activePreset.num).padStart(2, "0")} loaded`, activePreset.tip]
  };
  const content = help[changed] || help.preset;
  tag.textContent = content[0]; title.textContent = content[1]; text.textContent = content[2];
}

function stepSetting(key, direction) {
  const values = dialValues[key];
  let index = values.findIndex(value => String(value) === String(settings[key]));
  if (index === -1) index = 0;
  index = Math.min(values.length - 1, Math.max(0, index + Number(direction)));
  settings[key] = values[index];
  updateSimulator(key);
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => element.classList.remove("show"), 2300);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("#themeToggle").setAttribute("aria-pressed", String(theme === "dark"));
  $("#themeToggle").setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  const themeColor = theme === "dark" ? "#20211e" : "#efe9dc";
  $("meta[name='theme-color']").setAttribute("content", themeColor);
  localStorage.setItem("zf-field-notes-theme", theme);
}

function initEvents() {
  $$("[data-step]").forEach(button => button.addEventListener("click", () => {
    stepSetting(button.dataset.step, button.dataset.direction);
  }));
  $$(".dial-button").forEach(button => button.addEventListener("click", () => {
    const unit = button.closest("[data-setting]");
    if (unit) stepSetting(unit.dataset.setting, 1);
  }));
  $$("select[data-setting]").forEach(select => select.addEventListener("change", event => {
    settings[event.target.dataset.setting] = event.target.value;
    updateSimulator(event.target.dataset.setting);
  }));
  $("#resetCamera").addEventListener("click", () => loadPreset(activePreset.id, false));
  $("#settingHelp").addEventListener("click", () => toast(`${$("#helpTitle").textContent} — ${$("#helpText").textContent}`));
  $("#themeToggle").addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
  $("#nextTip").addEventListener("click", () => {
    tipIndex = (tipIndex + 1) % fieldTips.length;
    $("#fieldTip").textContent = fieldTips[tipIndex];
  });
  $("#tableSearch").addEventListener("input", event => {
    const query = event.target.value.trim().toLowerCase();
    let shown = 0;
    $$(".scenario-row").forEach(row => {
      const match = !query || row.dataset.search.includes(query);
      row.classList.toggle("hidden", !match);
      if (match) shown++;
    });
    $("#resultCount").textContent = query ? `${shown} matching scenario${shown === 1 ? "" : "s"} of 35` : "Showing all 35 scenarios";
    if (query && $("#tab-scenarios").getAttribute("aria-selected") !== "true") activateTab("scenarios");
  });
  $$(".reference-tabs [role='tab']").forEach(tab => tab.addEventListener("click", () => activateTab(tab.dataset.tab)));
}

function activateTab(tabName) {
  $$(".reference-tabs [role='tab']").forEach(tab => {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  $$(".tab-panel").forEach(panel => {
    const active = panel.id === `panel-${tabName}`;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
}

function init() {
  const savedTheme = localStorage.getItem("zf-field-notes-theme");
  if (savedTheme) setTheme(savedTheme);
  renderPresets();
  renderQuickPicks();
  renderFilterChips();
  renderSceneCards();
  renderReferenceRows();
  updateSimulator("preset");
  initEvents();
}

document.addEventListener("DOMContentLoaded", init);
