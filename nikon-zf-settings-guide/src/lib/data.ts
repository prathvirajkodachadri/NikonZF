export type Lens = '24-120' | '40mm';
export type Mode = 'photo' | 'video';
export type Env = 'indoor' | 'outdoor';
export type Time = 'day' | 'night';

export const SCENE_MAP = {
  indoor: {
    day: ["Portrait","Group Portrait","Lifestyle","Interview","Product","Food","Macro","Architecture • Interior","Office • Corporate","Event","Street-style"],
    night: ["Portrait","Group Portrait","Lifestyle","Interview","Product","Food","Concert • Stage","Event • Party","Architecture • Interior","Low-light Documentary"]
  },
  outdoor: {
    day: ["Portrait","Group Portrait","Interview","Landscape","Cityscape","Street Photography","Wildlife","Bird Photography","Sports","Travel","Architecture","Macro","Nature","Beach","Mountains","Waterfalls","Documentary"],
    night: ["Portrait","Interview","Landscape","Cityscape","Street Photography","Astrophotography","Moon Photography","Milky Way","Light Trails","Long Exposure","Night Architecture","Festival","Documentary"]
  }
};

export const MODS = {
  subjectMotion: ["Walking","Running","Dancing","Vehicles","Sports","Wildlife Action","Still • No Motion"],
  weather: ["Sunny","Cloudy","Rain","Fog","Snow","Golden Hour","Blue Hour"],
  lighting: ["Natural Light","Artificial Light","Mixed Light","Backlit","Silhouette","High Key","Low Key"],
  cameraMove: ["Static • Locked Off","Handheld","Tripod","Gimbal","Dolly","Slider","Crane • Jib","Drone"],
  subject: ["Human","Bird","Animal","Product","Food","Vehicle","Building","Nature","Machinery","Document"]
};

/* Focus type • AF-area mode • Subject detection • VR • Electronic VR for a scene */
export type FocusSet = { focusType:string; afArea:string; afKey:AfKey; detect:string; vr:string; evr:string; why:string };

/* AF-area keys match Nikon's list, used to draw the matching symbol */
export type AfKey =
  | 'pinpoint' | 'single' | 'dynS' | 'dynM' | 'dynL'
  | 'wideS' | 'wideL' | 'wideC1' | 'wideC2'
  | '3d' | 'subject' | 'auto' | 'mf';

export const AF_LABEL: Record<AfKey,string> = {
  pinpoint:'Pinpoint AF', single:'Single-point AF',
  dynS:'Dynamic-area AF (S)', dynM:'Dynamic-area AF (M)', dynL:'Dynamic-area AF (L)',
  wideS:'Wide-area AF (S)', wideL:'Wide-area AF (L)', wideC1:'Wide-area AF (C1)', wideC2:'Wide-area AF (C2)',
  '3d':'3D-tracking', subject:'Subject-tracking AF', auto:'Auto-area AF', mf:'Manual focus',
};

export const DETECT_OPTIONS = ['Auto','People','Animal','Bird','Vehicle','Airplane','Off'];

export function getFocusSet(
  scene: string, mode: Mode, motion: string|null, subject: string|null, cameraMove: string|null
): FocusSet {
  const s = scene.toLowerCase();
  const moving = !!motion && motion !== 'Still • No Motion';

  // --- Focus mode: AF-S / AF-C / AF-F / MF ---
  // AF-S = still subject · AF-C = moving subject · AF-F = full-time (video) · MF = by hand
  let focusType = 'AF-S';
  if (moving) focusType = 'AF-C';
  if (s.includes('sport') || s.includes('wildlife') || s.includes('bird') || s.includes('street') || s.includes('event') || s.includes('party') || s.includes('documentary') || s.includes('lifestyle') || s.includes('concert') || s.includes('festival')) focusType = 'AF-C';
  if (s.includes('astro') || s.includes('milky') || s.includes('moon') || s.includes('long exposure') || s.includes('light trail') || s.includes('macro') || s.includes('waterfall')) focusType = 'MF';

  // Video: AF-F keeps focusing on its own. Locked-off / tripod talking-head can stay MF.
  if (mode === 'video' && focusType !== 'MF') {
    focusType = 'AF-F';
    if (!moving && (cameraMove === 'Tripod' || cameraMove === 'Static • Locked Off') &&
        (s.includes('product') || s.includes('architecture') || s.includes('interior') || s.includes('office'))) {
      focusType = 'MF';
    }
  }

  // --- AF-area mode ---
  let afKey: AfKey = 'single';
  if (s.includes('group portrait')) afKey = 'wideL';
  else if (s.includes('interview')) afKey = 'wideS';
  else if (s.includes('portrait')) afKey = 'wideS';
  else if (s.includes('lifestyle') || s.includes('event') || s.includes('party') || s.includes('documentary') || s.includes('street-style')) afKey = 'auto';
  else if (s.includes('product') || s.includes('food') || s.includes('macro')) afKey = 'pinpoint';
  else if (s.includes('architecture') || s.includes('interior') || s.includes('office')) afKey = 'single';
  else if (s.includes('bird')) afKey = 'dynS';
  else if (s.includes('wildlife')) afKey = 'dynM';
  else if (s.includes('sport')) afKey = '3d';
  else if (s.includes('street')) afKey = 'wideS';
  else if (s.includes('concert') || s.includes('stage') || s.includes('festival')) afKey = 'wideS';
  else if (s.includes('landscape') || s.includes('cityscape') || s.includes('mountain') || s.includes('beach') || s.includes('nature') || s.includes('waterfall')) afKey = 'single';
  else if (s.includes('astro') || s.includes('milky') || s.includes('long exposure') || s.includes('light trail')) afKey = 'single';
  else if (s.includes('moon')) afKey = 'pinpoint';
  else if (s.includes('travel')) afKey = 'auto';

  // motion can push the area wider / to tracking
  if (moving) {
    if (motion === 'Walking') afKey = afKey === 'pinpoint' ? 'single' : 'wideS';
    if (motion === 'Running' || motion === 'Dancing') afKey = 'wideL';
    if (motion === 'Vehicles') afKey = '3d';
    if (motion === 'Sports') afKey = '3d';
    if (motion === 'Wildlife Action') afKey = 'dynL';
  }

  /* Subject overrides. Detection only runs with Wide-area / 3D / Subject-tracking /
     Auto-area, so a subject that needs detecting gets one of those.            */
  if (subject === 'Human')  afKey = moving ? 'auto'  : 'wideS';
  if (subject === 'Bird')   afKey = moving ? 'wideL' : 'wideS';
  if (subject === 'Animal') afKey = moving ? 'wideL' : 'wideS';
  if (subject === 'Vehicle') afKey = '3d';
  if (subject === 'Product' || subject === 'Food' || subject === 'Document') afKey = 'pinpoint';
  if (subject === 'Building') afKey = 'single';
  if (subject === 'Nature' || subject === 'Machinery') afKey = 'single';

  // video uses subject tracking
  if (mode === 'video') {
    if (subject === 'Human' || s.includes('interview') || s.includes('portrait')) afKey = 'subject';
    else if (moving) afKey = 'subject';
    else if (afKey === 'pinpoint') afKey = 'single';
    else if (afKey === '3d') afKey = 'subject';
  }
  if (focusType === 'MF') afKey = 'mf';

  /* Nikon rules — keep AF-area legal for the focus mode and shooting mode:
     · Pinpoint AF      → photo only, AF-S only
     · Dynamic-area AF  → photo only, AF-C only
     · 3D-tracking      → photo only, AF-C only
     · Subject-tracking → video only                                        */
  const isDyn = afKey==='dynS' || afKey==='dynM' || afKey==='dynL';
  if (mode === 'video') {
    if (afKey==='pinpoint' || isDyn || afKey==='3d') afKey = 'subject';
  } else {
    if (afKey==='subject') afKey = 'auto';                       // video-only mode in photo
    if (afKey==='pinpoint' && focusType !== 'AF-S') afKey = 'single';
    if ((isDyn || afKey==='3d') && focusType !== 'AF-C') afKey = 'single';
  }
  const afArea = AF_LABEL[afKey];

  // --- Subject detection ---
  let detect = 'Auto';
  if (subject === 'Human') detect = 'People';
  else if (subject === 'Bird') detect = 'Bird';
  else if (subject === 'Animal') detect = 'Animal';
  else if (subject === 'Vehicle') detect = 'Vehicle';
  else if (s.includes('bird')) detect = 'Bird';
  else if (s.includes('wildlife')) detect = 'Animal';
  else if (s.includes('portrait') || s.includes('interview') || s.includes('event') || s.includes('party') || s.includes('lifestyle') || s.includes('street') || s.includes('documentary') || s.includes('concert') || s.includes('festival') || s.includes('sport')) detect = 'People';
  else if (s.includes('product') || s.includes('food') || s.includes('macro') || s.includes('architecture') || s.includes('interior') || s.includes('office') || s.includes('landscape') || s.includes('cityscape') || s.includes('mountain') || s.includes('beach') || s.includes('waterfall') || s.includes('nature')) detect = 'Off';
  if (s.includes('astro') || s.includes('milky') || s.includes('moon') || s.includes('long exposure') || s.includes('light trail')) detect = 'Off';

  /* Detection only works with Wide-area, 3D-tracking, Subject-tracking or Auto-area */
  const detectWorks = ['wideS','wideL','wideC1','wideC2','3d','subject','auto'].includes(afKey);
  if (!detectWorks) detect = 'Off';

  // --- Vibration Reduction ---
  const onSticks = cameraMove === 'Tripod' || cameraMove === 'Static • Locked Off' ||
    s.includes('astro') || s.includes('milky') || s.includes('moon') || s.includes('long exposure') ||
    s.includes('light trail') || s.includes('waterfall') || s.includes('product') ||
    s.includes('architecture') || s.includes('interior') || s.includes('office') ||
    s.includes('landscape') || s.includes('cityscape');

  let vr = 'Normal';
  if (onSticks) vr = 'Off';
  else if (moving || s.includes('sport') || s.includes('wildlife') || s.includes('bird')) vr = 'Sport';
  if (cameraMove === 'Gimbal') vr = 'Off';
  if (cameraMove === 'Handheld') vr = moving ? 'Sport' : 'Normal';
  if (cameraMove === 'Drone') vr = 'Off';

  // --- Electronic VR (video only) ---
  let evr = mode === 'video' ? 'On' : 'Off (photo only)';
  if (mode === 'video') {
    if (onSticks || cameraMove === 'Gimbal' || cameraMove === 'Dolly' || cameraMove === 'Slider' || cameraMove === 'Crane • Jib' || cameraMove === 'Drone') evr = 'Off';
    else evr = 'On';
  }

  // --- why line ---
  let why = 'Set focus and VR to match how you and the subject move.';
  if (focusType === 'MF') why = 'Focus by hand → AF cannot lock on this.';
  else if (focusType === 'AF-F') why = 'Video → AF-F keeps focusing on its own.';
  else if (focusType === 'AF-C') why = 'Subject moves → AF-C keeps it sharp.';
  else why = 'Subject stays still → AF-S locks once.';
  if (mode !== 'video' && onSticks && focusType !== 'MF') why += ' On a tripod → VR off.';

  return { focusType, afArea, afKey, detect, vr, evr, why };
}

export type BasePreset = {
  aperturePrime: string; apertureZoom: string;
  shutterPhotoDay: string; shutterPhotoNight: string;
  isoDayOut: string; isoDayIn: string; isoNight: string;
  focalZoom: string; focalPrime: string;
  focus: string; wb: string;
  videoRes: string; videoFps: string;
  tip: string;
};

export function getBase(sceneRaw: string): BasePreset {
  const s = sceneRaw.toLowerCase();
  const d: BasePreset = {
    aperturePrime: "f/4 to f/5.6", apertureZoom: "f/5.6 to f/8",
    shutterPhotoDay: "1/500", shutterPhotoNight: "1/200",
    isoDayOut: "100 to 400", isoDayIn: "400 to 1000", isoNight: "1600 to 6400",
    focalZoom: "40 to 70mm", focalPrime: "40mm",
    focus: "AF-C Auto", wb: "Auto",
    videoRes: "4K", videoFps: "24p",
    tip: "Keep background 2m back → cleaner look."
  };
  if (s.includes('interview')) return { ...d,
    aperturePrime: "f/2 to f/2.8", apertureZoom: "f/4",
    shutterPhotoDay: "1/50 video or 1/200 photo", shutterPhotoNight: "1/50 video or 1/160 photo",
    isoDayOut: "100 to 400", isoDayIn: "400 to 1000", isoNight: "800 to 2000",
    focalZoom: "50 to 85mm", focalPrime: "40mm",
    focus: "Eye Detect Human", wb: "Auto or 4000K with LED",
    videoRes: "4K", videoFps: "24p or 30p",
    tip: "Light 45° on one side + soft fill on other. Mic close."
  };
  if (s.includes('group portrait')) return { ...d,
    aperturePrime: "f/4 to f/5.6", apertureZoom: "f/5.6 to f/8",
    shutterPhotoDay: "1/400", shutterPhotoNight: "1/200",
    isoDayOut: "100 to 400", isoDayIn: "800 to 1600", isoNight: "2000 to 6400",
    focalZoom: "35 to 50mm", focalPrime: "40mm at f/4",
    focus: "Wide Area AF L", wb: "Auto",
    videoRes: "4K", videoFps: "30p",
    tip: "Focus on front row → f/8 if 3 rows."
  };
  if (s === 'portrait' || (s.includes('portrait') && !s.includes('group'))) return { ...d,
    aperturePrime: "f/2 to f/2.8", apertureZoom: "f/4 to f/5.6",
    shutterPhotoDay: "1/640", shutterPhotoNight: "1/250",
    isoDayOut: "100 to 400", isoDayIn: "400 to 1000", isoNight: "1600 to 5000",
    focalZoom: "85 to 120mm", focalPrime: "40mm half body",
    focus: "Eye Detect Human", wb: "Auto",
    videoRes: "4K", videoFps: "24p plus 60p B-roll",
    tip: "f/2.2 is sharper than f/2 → background 2m back."
  };
  if (s.includes('lifestyle')) return { ...d,
    aperturePrime: "f/2.5 to f/4", apertureZoom: "f/4 to f/5.6",
    shutterPhotoDay: "1/500", shutterPhotoNight: "1/320",
    focalZoom: "35 to 70mm", focalPrime: "40mm natural eye",
    focus: "Auto Area People", wb: "Auto",
    videoRes: "4K", videoFps: "24p",
    tip: "Shoot through something in front → 40mm looks natural."
  };
  if (s.includes('product')) return { ...d,
    aperturePrime: "f/5.6 to f/8", apertureZoom: "f/8 to f/11",
    shutterPhotoDay: "1/125 Tripod", shutterPhotoNight: "1/60 Tripod",
    isoDayOut: "100", isoDayIn: "100 to 400", isoNight: "100 to 800",
    focalZoom: "70 to 100mm", focalPrime: "40mm plus crop",
    focus: "Pinpoint AF", wb: "5500K",
    videoRes: "4K", videoFps: "30p",
    tip: "Tripod + 2s timer → turn VR off."
  };
  if (s.includes('food')) return { ...d,
    aperturePrime: "f/2.8 to f/4", apertureZoom: "f/4 to f/5.6",
    shutterPhotoDay: "1/250", shutterPhotoNight: "1/160",
    focalZoom: "50 to 80mm", focalPrime: "40mm overhead",
    focus: "Wide-S AF", wb: "Auto Warm",
    videoRes: "4K", videoFps: "60p pour",
    tip: "Window light on the side + white card on other side."
  };
  if (s.includes('macro')) return { ...d,
    aperturePrime: "f/5.6 to f/8", apertureZoom: "f/8 to f/11",
    shutterPhotoDay: "1/500", shutterPhotoNight: "1/250",
    focalZoom: "120mm 0.39x", focalPrime: "40mm plus 11mm tube",
    focus: "MF Peaking", wb: "Auto",
    videoRes: "4K", videoFps: "60p",
    tip: "24-120mm at 120mm gets closest. Move slowly."
  };
  if (s.includes('architecture') || s.includes('interior') || s.includes('office') || s.includes('night architecture')) return { ...d,
    aperturePrime: "f/8 to f/11", apertureZoom: "f/8 to f/11",
    shutterPhotoDay: "1/125 Tripod", shutterPhotoNight: "1 to 5 sec Tripod",
    isoDayOut: "100 to 200", isoDayIn: "100 to 400", isoNight: "100 to 800",
    focalZoom: "24 to 35mm", focalPrime: "40mm detail",
    focus: "Single AF", wb: "Auto",
    videoRes: "4K", videoFps: "24p",
    tip: "Level the camera → shoot 3 shots at −0.7 / 0 / +0.7."
  };
  if (s.includes('concert') || s.includes('stage') || s.includes('festival')) return { ...d,
    aperturePrime: "f/2 to f/2.5", apertureZoom: "f/4 wide open",
    shutterPhotoDay: "1/320", shutterPhotoNight: "1/320 to 1/500",
    isoDayOut: "800 to 3200", isoDayIn: "1600 to 6400", isoNight: "3200 to 12800",
    focalZoom: "70 to 120mm", focalPrime: "40mm close",
    focus: "Eye AF Low Light", wb: "Auto",
    videoRes: "4K", videoFps: "30p or 60p",
    tip: "Lights flicker → use 1/100 or 1/125 to stop bands."
  };
  if (s.includes('event') || s.includes('party')) return { ...d,
    aperturePrime: "f/2 to f/2.8", apertureZoom: "f/4 constant",
    shutterPhotoDay: "1/320", shutterPhotoNight: "1/200",
    focalZoom: "24 to 120mm", focalPrime: "40mm discrete",
    focus: "Auto People", wb: "Auto",
    videoRes: "4K", videoFps: "30p",
    tip: "Point flash at ceiling → set flash to −0.7."
  };
  if (s.includes('street')) return { ...d,
    aperturePrime: "f/5.6 to f/8", apertureZoom: "f/5.6 to f/8",
    shutterPhotoDay: "1/1000", shutterPhotoNight: "1/320 at f/2",
    focalZoom: "35 to 50mm", focalPrime: "40mm street king",
    focus: "Zone 3m at f/8", wb: "Auto",
    videoRes: "4K", videoFps: "24p",
    tip: "Set focus to 3m at f/8 → everything far is sharp."
  };
  if (s.includes('wildlife')) return { ...d,
    aperturePrime: "f/2.8 to f/4", apertureZoom: "f/4 to f/5.6",
    shutterPhotoDay: "1/2000 plus", shutterPhotoNight: "1/1000 min",
    isoDayOut: "400 to 1600", isoDayIn: "1600 to 6400", isoNight: "3200 to 12800",
    focalZoom: "120mm plus DX 180mm", focalPrime: "40mm env",
    focus: "Animal Detect", wb: "Auto",
    videoRes: "4K", videoFps: "60p",
    tip: "Use crop mode for more reach + hold the shutter down."
  };
  if (s.includes('bird')) return { ...d,
    aperturePrime: "f/2.8", apertureZoom: "f/4 plus DX",
    shutterPhotoDay: "1/3200", shutterPhotoNight: "1/2000",
    isoDayOut: "400 to 1600", isoDayIn: "1600 to 3200", isoNight: "3200 plus",
    focalZoom: "120mm plus DX 360mm eq", focalPrime: "40mm env",
    focus: "Bird Detect", wb: "Auto",
    videoRes: "4K", videoFps: "60p",
    tip: "1/3200 or faster → freezes wings."
  };
  if (s.includes('sport')) return { ...d,
    aperturePrime: "f/2 to f/2.8", apertureZoom: "f/4",
    shutterPhotoDay: "1/1000 to 1/2000", shutterPhotoNight: "1/1000",
    focalZoom: "70 to 120mm", focalPrime: "40mm courtside",
    focus: "3D People", wb: "Auto",
    videoRes: "4K", videoFps: "60p slow mo",
    tip: "Hold shutter down → shoot a burst, pick the best."
  };
  if (s.includes('landscape')) return { ...d,
    aperturePrime: "f/8 to f/11", apertureZoom: "f/8 to f/11",
    shutterPhotoDay: "1/125 Tripod", shutterPhotoNight: "4 to 30 sec Tripod",
    isoDayOut: "100 Lo64", isoDayIn: "100 to 200", isoNight: "100 to 800",
    focalZoom: "24 to 35mm", focalPrime: "40mm pano",
    focus: "AF-S Infinity", wb: "Daylight 5200K",
    videoRes: "4K", videoFps: "24p",
    tip: "Focus 1/3 into the scene + use 2s timer."
  };
  if (s.includes('cityscape')) return { ...d,
    aperturePrime: "f/8 to f/11", apertureZoom: "f/8 to f/11",
    shutterPhotoDay: "1/250", shutterPhotoNight: "2 to 15 sec Tripod",
    focalZoom: "24 to 70mm", focalPrime: "40mm",
    focus: "AF-S Infinity", wb: "Auto",
    videoRes: "4K", videoFps: "24p",
    tip: "Shoot 20 min after sunset → sky + lights both look good."
  };
  if (s.includes('travel')) return { ...d,
    aperturePrime: "f/5.6 to f/8", apertureZoom: "f/5.6 to f/8",
    shutterPhotoDay: "1/500", shutterPhotoNight: "1/250",
    focalZoom: "24 to 120mm", focalPrime: "40mm light",
    focus: "Auto", wb: "Auto",
    videoRes: "4K", videoFps: "30p",
    tip: "One lens does it all → keep it simple."
  };
  if (s.includes('beach')) return { ...d,
    aperturePrime: "f/8 to f/11", apertureZoom: "f/8 to f/11",
    shutterPhotoDay: "1/1000", shutterPhotoNight: "N/A",
    isoDayOut: "100", isoDayIn: "100", isoNight: "100",
    focalZoom: "24 to 50mm", focalPrime: "40mm",
    focus: "Wide AF", wb: "5200K",
    videoRes: "4K", videoFps: "60p",
    tip: "Sand is bright → set −0.7 so it is not too light."
  };
  if (s.includes('mountain')) return { ...d,
    aperturePrime: "f/8 to f/11", apertureZoom: "f/8 to f/11",
    shutterPhotoDay: "1/500", shutterPhotoNight: "N/A",
    isoDayOut: "100 to 400", isoDayIn: "100 to 400", isoNight: "100",
    focalZoom: "24 to 70mm", focalPrime: "40mm stitch",
    focus: "Infinity", wb: "Daylight",
    videoRes: "4K", videoFps: "24p",
    tip: "Shoot in the morning → air is clearer."
  };
  if (s.includes('waterfall') || s.includes('nature')) return { ...d,
    aperturePrime: "f/11 plus ND64", apertureZoom: "f/11 plus ND64",
    shutterPhotoDay: "0.5 to 4 sec ND", shutterPhotoNight: "1 to 5 sec",
    isoDayOut: "100 plus ND", isoDayIn: "100", isoNight: "400",
    focalZoom: "24 to 50mm", focalPrime: "40mm plus ND",
    focus: "MF", wb: "Cloudy",
    videoRes: "4K", videoFps: "60p",
    tip: "Focus first → then add the dark filter."
  };
  if (s.includes('astro')) return { ...d,
    aperturePrime: "f/2", apertureZoom: "f/4",
    shutterPhotoDay: "N/A", shutterPhotoNight: "15 to 20 sec at 24mm or 10 to 13 sec at 40mm",
    isoDayOut: "N/A", isoDayIn: "N/A", isoNight: "3200 to 6400",
    focalZoom: "24mm", focalPrime: "40mm",
    focus: "MF Infinity star", wb: "3800K",
    videoRes: "Timelapse", videoFps: "24p",
    tip: "Zoom in on a bright star → focus by hand."
  };
  if (s.includes('milky')) return { ...d,
    aperturePrime: "f/2", apertureZoom: "f/4",
    shutterPhotoDay: "N/A", shutterPhotoNight: "10 to 15 sec 40mm or 20 to 25 sec 24mm",
    isoDayOut: "N/A", isoDayIn: "N/A", isoNight: "3200 to 6400",
    focalZoom: "24mm", focalPrime: "40mm pano",
    focus: "MF Infinity", wb: "3800K",
    videoRes: "Timelapse", videoFps: "24p",
    tip: "Go far from city lights → shoot 10 shots, blend later."
  };
  if (s.includes('moon')) return { ...d,
    aperturePrime: "f/8 to f/11", apertureZoom: "f/8 to f/11",
    shutterPhotoDay: "N/A", shutterPhotoNight: "f/11 1/100 ISO100",
    isoDayOut: "N/A", isoDayIn: "N/A", isoNight: "100 to 400",
    focalZoom: "120mm plus DX 360mm", focalPrime: "40mm env",
    focus: "MF crater 200 percent", wb: "Daylight",
    videoRes: "4K DX", videoFps: "30p",
    tip: "Moon is bright → set −0.7 to keep detail."
  };
  if (s.includes('light trail')) return { ...d,
    aperturePrime: "f/8 to f/11", apertureZoom: "f/8 to f/11",
    shutterPhotoDay: "N/A", shutterPhotoNight: "4 to 30 sec",
    isoDayOut: "N/A", isoDayIn: "N/A", isoNight: "100 to 400",
    focalZoom: "24 to 50mm", focalPrime: "40mm",
    focus: "MF 5m", wb: "3200K orange",
    videoRes: "Timelapse", videoFps: "24p",
    tip: "Shoot at dusk → sky still blue + car lights show."
  };
  if (s.includes('long exposure')) return { ...d,
    aperturePrime: "f/8 to f/11 plus ND1000", apertureZoom: "f/8 to f/11 plus ND1000",
    shutterPhotoDay: "30 to 120 sec ND", shutterPhotoNight: "30 to 300 sec",
    isoDayOut: "64 Lo", isoDayIn: "100", isoNight: "100 to 400",
    focalZoom: "24mm", focalPrime: "40mm",
    focus: "MF", wb: "Daylight",
    videoRes: "N/A", videoFps: "N/A",
    tip: "Use a dark filter → lets you shoot long in daylight."
  };
  if (s.includes('documentary')) return { ...d,
    aperturePrime: "f/2.8 to f/5.6", apertureZoom: "f/4 to f/5.6",
    shutterPhotoDay: "1/500", shutterPhotoNight: "1/320",
    focalZoom: "24 to 120mm", focalPrime: "40mm",
    focus: "People AF", wb: "Auto",
    videoRes: "4K", videoFps: "24p",
    tip: "Stay quiet + stay ready → catch real moments."
  };
  return d;
}
