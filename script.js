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
  iso: ["100", "400", "800", "1600", "3200", "6400", "12800"],
  shutter: ["1/25", "1/50", "1/100", "1/125", "1/200", "1/250", "1/500", "1/1000", "1/1600", "1/3200"],
  aperture: ["f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16"],
  ev: [-2, -1.7, -1.3, -1, -0.7, -0.3, 0, 0.3, 0.7, 1, 1.3, 1.7, 2]
};

const presets = [
  { id: "portrait", icon: "◒", name: "Portrait", rail: "soft separation", desc: "A forgiving, flattering starting point for a person in soft daylight.", iso: "100", shutter: "1/50", aperture: "f/2.8", frameRate: "25p", whiteBalance: "7000", toneMode: "Flat SDR", focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF", tip: "At f/2.8, give your subject room to move. Put the eye in the focus box before rolling.", visual: "golden" },
  { id: "landscape", icon: "△", name: "Landscape", rail: "tripod & depth", desc: "Sharp foreground to horizon. Make the camera completely still.", iso: "100", shutter: "1/50", aperture: "f/8", frameRate: "25p", whiteBalance: "5600", toneMode: "Flat SDR", focusMode: "MF + peaking", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod", tip: "On a tripod, turn IBIS off. Punch in, focus carefully, then hold every shot for ten seconds.", visual: "day" },
  { id: "street", icon: "⌁", name: "Street", rail: "open shade", desc: "A calm street frame in friendly shade or overcast light.", iso: "100", shutter: "1/50", aperture: "f/5.6", frameRate: "25p", whiteBalance: "6500", toneMode: "Flat SDR", focusMode: "AF-C · Auto-area", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF", tip: "Open shade is your best no-ND friend: it often lets 1/50 survive at ISO 100.", visual: "cloud" },
  { id: "wildlife", icon: "◈", name: "Wildlife", rail: "movement", desc: "A bright-day action setup. The 40mm works best for nearby subjects.", iso: "100", shutter: "1/1000", aperture: "f/4", frameRate: "50p", whiteBalance: "5600", toneMode: "Flat SDR", focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF", tip: "The 40mm is not a long wildlife lens — move closer only when safe. Use 50p and keep the action in the centre.", visual: "day" },
  { id: "sports", icon: "↯", name: "Sports", rail: "fast action", desc: "Freeze action in full sun, then slow it down in a 25p edit.", iso: "100", shutter: "1/1000", aperture: "f/2.8", frameRate: "50p", whiteBalance: "5600", toneMode: "Flat SDR", focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF", tip: "In harsh sun, 50p at 1/1000 and f/2.8 is the no-ND slow-motion hack. Slow the clip to 25p later.", visual: "day" },
  { id: "golden", icon: "☼", name: "Golden Hour", rail: "portrait glow", desc: "The easiest beautiful light. Let the warm sky stay warm.", iso: "100", shutter: "1/50", aperture: "f/2.8", frameRate: "25p", whiteBalance: "7000", toneMode: "Flat SDR", focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF", tip: "Golden hour is free ND. Backlight the subject and use a white bounce if you need to lift the face.", visual: "golden" },
  { id: "blue", icon: "◐", name: "Blue Hour", rail: "best 20 minutes", desc: "A controlled city or portrait setup after the sun has gone down.", iso: "800", shutter: "1/50", aperture: "f/2.8", frameRate: "25p", whiteBalance: "4200", toneMode: "N-Log", focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF", tip: "Blue hour moves fast — work the scene in wide, medium, close, detail order before the sky changes.", visual: "blue", lowLight: true },
  { id: "night", icon: "☾", name: "Night Street", rail: "neon & texture", desc: "Expose for the sign, keep the face lit, and let blacks fall away.", iso: "6400", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "3600", toneMode: "Flat SDR", focusMode: "AF-C · Tracking", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF", tip: "At night, protect the face and let the blacks crush. Grey shadows are usually worse than intentional darkness.", visual: "night", lowLight: true },
  { id: "wedding", icon: "✦", name: "Wedding", rail: "reception lights", desc: "A dependable reception preset for quick-moving people and coloured LEDs.", iso: "3200", shutter: "1/50", aperture: "f/2", frameRate: "25p", whiteBalance: "4200", toneMode: "Flat SDR", focusMode: "AF-C · Tracking", metering: "Highlight-weighted", stabilisation: "IBIS ON · e-VR OFF", tip: "Do a five-second flicker test before an event. Coloured stage lights clip red first — protect the face by one-third stop.", visual: "night", lowLight: true },
  { id: "travel", icon: "⌖", name: "Travel", rail: "walk & discover", desc: "A daylight moving shot that gives you enough depth and stability.", iso: "400", shutter: "1/50", aperture: "f/4", frameRate: "25p", whiteBalance: "5600", toneMode: "Flat SDR", focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR ON", tip: "e-VR is useful for a careful walking shot, but it crops the frame 1.1×. Frame slightly wider first.", visual: "cloud" },
  { id: "product", icon: "▣", name: "Product", rail: "detail close-up", desc: "Careful, tactile detail footage of an object on a stable support.", iso: "100", shutter: "1/50", aperture: "f/5.6", frameRate: "25p", whiteBalance: "5000", toneMode: "Flat SDR", focusMode: "MF + peaking", metering: "Center-weighted", stabilisation: "IBIS OFF · Tripod", tip: "The 40mm focuses no closer than 0.29 m. Use manual focus and punch-in for any product close-up.", visual: "studio" },
  { id: "food", icon: "◉", name: "Food", rail: "tabletop", desc: "Simple food and café coverage with a little more depth than a portrait.", iso: "400", shutter: "1/50", aperture: "f/4", frameRate: "25p", whiteBalance: "5000", toneMode: "Flat SDR", focusMode: "MF + peaking", metering: "Center-weighted", stabilisation: "IBIS OFF · Tripod", tip: "For food, f/4–5.6 makes the plate easier to keep sharp. Mixed LEDs lie, so set a custom or manual Kelvin value.", visual: "studio" },
  { id: "interview", icon: "▰", name: "Interview", rail: "window light", desc: "A controlled talking-head setup with room to grade later.", iso: "800", shutter: "1/50", aperture: "f/2.8", frameRate: "25p", whiteBalance: "4200", toneMode: "N-Log", focusMode: "AF-C · People", metering: "Highlight-weighted", stabilisation: "IBIS OFF · Tripod", tip: "Put a window 45° from the subject. In N-Log, expose a little brighter than normal to keep the shadows clean.", visual: "studio", lowLight: true },
  { id: "slowmo", icon: "↻", name: "Slow Motion", rail: "50p to 25p", desc: "The universal ‘looks expensive’ movement setting for daylight.", iso: "100", shutter: "1/100", aperture: "f/5.6", frameRate: "50p", whiteBalance: "5600", toneMode: "Flat SDR", focusMode: "AF-C · Tracking", metering: "Matrix", stabilisation: "IBIS ON · e-VR OFF", tip: "Shoot 50p, then conform the footage to a 25p timeline for a clean 2× slow motion effect.", visual: "day" }
];

const referenceRows = [
  ["Outdoor interview · open shade", "25p · <b>1/50</b>", "f/4–5.6 · ISO 100", "6500K", "The ideal no-ND interview. Keep e-VR off."],
  ["Outdoor interview · direct sun", "25p · <b>1/500</b>", "f/8 · ISO 100", "5600K", "Lock off; better still, move into shade."],
  ["Golden hour portrait", "25p · <b>1/50</b>", "f/2.8–4 · ISO 100", "7000K", "Backlight + white bounce. Your natural ND."],
  ["Midday b-roll", "25p · <b>1/500</b>", "f/8 · ISO 100", "5600K", "Locked-off or very slow moves only."],
  ["Overcast street", "25p · <b>1/50</b>", "f/8–11 · ISO 100", "6500K", "A gift day: 180° shutter with no compromise."],
  ["Walking street shot", "25p · <b>1/50</b>", "f/4 · ISO 400–1600", "5600K", "IBIS + e-VR on. Bend knees and heel-toe walk."],
  ["Landscape / establishing", "25p · <b>1/50</b>", "f/8–11 · ISO 100", "5600K", "Tripod, IBIS off, manual focus + punch-in."],
  ["Café / restaurant", "25p · <b>1/50</b>", "f/2 · ISO 800–3200", "3800K", "N-Log; grey-card WB for mixed LEDs."],
  ["Product / food close-up", "25p · <b>1/50</b>", "f/4–5.6 · ISO 100–400", "5000K", "Tripod, manual focus. 0.29 m closest focus."],
  ["Office talking head", "25p · <b>1/50</b>", "f/2.8–4 · ISO 400–1600", "4300K", "N-Log. 1/50 avoids Indian tube-light banding."],
  ["Blue hour cityscape", "25p · <b>1/50</b>", "f/4–5.6 · ISO 400–1600", "4500K", "Tripod, N-Log, manual focus at infinity."],
  ["Blue hour portrait", "25p · <b>1/50</b>", "f/2–2.8 · ISO 800–3200", "4200K", "Use a practical as the key light."],
  ["Neon market b-roll", "25p · <b>1/50</b>", "f/2 · ISO 3200–6400", "3600K", "Expose for the sign; let the blacks crush."],
  ["Streetlamp portrait", "25p · <b>1/50</b>", "f/2 · ISO 3200–6400", "3400K", "Manual focus locked; depth is only 17 cm at 1.5 m."],
  ["Night traffic / light trails", "25p · <b>1/25</b>", "f/2.8–4 · ISO 800–1600", "3600K", "Tripod only. 360° shutter creates beautiful smear."],
  ["Bar / lounge", "25p · <b>1/50</b>", "f/2 · ISO 1600–3200", "3200K", "N-Log. Seat the subject beside a practical."],
  ["Wedding reception", "25p · <b>1/50</b>", "f/2–2.8 · ISO 1600–6400", "4200K", "Flat SDR. Underexpose faces ⅓ stop under coloured LEDs."],
  ["Concert / stage", "25p · <b>1/50</b>", "f/2 · ISO 3200–12800", "4000K", "Meter for the brightest moment, not the darkest."],
  ["Diwali / candle face", "25p · <b>1/50 or 1/25</b>", "f/2 · ISO 6400–12800", "2800–3200K", "Let flames clip. 1/25 needs a locked camera."],
  ["Car interior · parked", "25p · <b>1/50</b>", "f/2 · ISO 6400", "3400K", "Manual focus locked; kill AC vent noise."],
  ["Gimbal move", "25p · <b>1/50 shade / 1/500 sun</b>", "f/8 day · f/2 night", "Match scene", "IBIS on, e-VR off. Make slow deliberate moves."],
  ["Hero slow motion", "1080/100p · <b>1/200</b>", "f/2.8–5.6 · ISO 400+", "Match scene", "Use in daylight only; pre-set focus."],
  ["2× cinematic slow-mo", "50p → 25p · <b>1/100</b>", "As scene", "Match scene", "The go-to universal slow-motion setting."],
  ["Astro / stars", "Photo interval", "f/2 · ISO 3200–6400", "4000K", "Tripod, IBIS off. Shoot stills for a time-lapse."],
];

const fieldTips = [
  "Golden hour is your ND. At ISO 100, 1/50 and f/2.8–4, you get soft motion and beautiful separation.",
  "Under Indian artificial lighting, test for five seconds. 1/50 and 1/100 are the safe shutter choices.",
  "Hold every shot for at least ten seconds. Editors need handles before and after the action.",
  "At 40mm, a 90° pan should take at least six seconds. The slower it feels while shooting, the smoother it feels later.",
  "At night, focus with a phone torch first, then lock focus. Never let the lens hunt during a take.",
  "With no ND filter, changing where you stand is often smarter than changing camera settings. Open shade is 3–4 stops darker."
];

let activePreset = presets.find(p => p.id === "golden");
let tipIndex = 0;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function renderPresets() {
  const list = $("#presetList");
  const cards = $("#sceneCards");
  list.innerHTML = presets.map(p => `
    <button class="preset-button ${p.id === activePreset.id ? "active" : ""}" type="button" data-preset="${p.id}">
      <span class="preset-icon">${p.icon}</span><span>${p.name}<small>${p.rail}</small></span>
    </button>`).join("");
  cards.innerHTML = presets.map((p, i) => `
    <button class="scene-card" type="button" data-preset="${p.id}" aria-label="Load ${p.name} preset">
      <span class="scene-card-top"><span class="scene-card-icon">${p.icon}</span><span class="scene-card-number">${String(i + 1).padStart(2, "0")}</span></span>
      <h3>${p.name}</h3><p>${p.desc}</p>
      <span class="scene-card-settings"><b>${p.frameRate}</b> · ${p.shutter} · ${p.aperture}<br>ISO ${p.iso} · ${p.whiteBalance}K</span>
    </button>`).join("");
  $$('[data-preset]').forEach(button => button.addEventListener("click", () => loadPreset(button.dataset.preset)));
}

function renderReferenceRows() {
  $("#scenarioTableBody").innerHTML = referenceRows.map(row => `
    <tr class="scenario-row" data-search="${row.join(" ").replace(/<[^>]*>/g, "").toLowerCase()}">
      ${row.map((cell, i) => `<td${i === 0 ? ' data-label="Scene"' : ""}>${cell}</td>`).join("")}
    </tr>`).join("");
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
  if (announce) toast(`${found.name} recipe loaded`);
}

function formatEV(value) {
  const number = Number(value);
  return number > 0 ? `+${number.toFixed(1)}` : number.toFixed(1);
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
  $("#previewFps").textContent = `4K ${settings.frameRate}`;
  $("#previewScene").textContent = activePreset.name.toUpperCase();
  $("#evOutput").textContent = formatEV(settings.ev);

  ["frameRate", "whiteBalance", "focusMode", "metering", "toneMode", "stabilisation"].forEach(key => {
    const el = $(`#${key}`);
    if (el) el.value = settings[key];
  });

  const preview = $("#previewPanel");
  preview.dataset.scene = activePreset.name;
  const visualStyles = {
    golden: ["#7c9fb0", "#d89365", "#f5d17b", ".06"],
    day: ["#87aabf", "#b8d1d5", "#fff4b2", ".02"],
    cloud: ["#8298a3", "#bdc4ba", "#f5e7bd", ".05"],
    blue: ["#1d4269", "#6b7d9a", "#d6c783", ".10"],
    night: ["#071626", "#2c3b53", "#d86b58", ".23"],
    studio: ["#6f7d7a", "#be9a76", "#f9daa1", ".05"]
  };
  const [skyA, skyB, sun, grain] = visualStyles[activePreset.visual] || visualStyles.day;
  preview.style.setProperty("--sky-a", skyA);
  preview.style.setProperty("--sky-b", skyB);
  preview.style.setProperty("--sun-color", sun);
  preview.style.setProperty("--scene-darkness", grain);
  preview.style.filter = settings.toneMode === "Monochrome" ? "grayscale(1) contrast(1.12)" : "none";

  // Warmer Kelvin keeps the preview inviting, cooler Kelvin makes it more blue.
  const kelvin = Number(settings.whiteBalance);
  preview.style.setProperty("--wb-filter", kelvin < 4000 ? "#e89d69" : kelvin > 6200 ? "#e5c16e" : "transparent");
  updateExposureStatus(changed);
  updateSettingHelp(changed);
  $("#fieldTip").textContent = activePreset.tip;
}

function updateExposureStatus(changed) {
  const exactShutter = (settings.frameRate === "25p" && settings.shutter === "1/50") ||
    (settings.frameRate === "50p" && settings.shutter === "1/100") ||
    (settings.frameRate === "100p" && settings.shutter === "1/200");
  const status = $("#exposureState");
  const flicker = $("#flickerMessage");
  const usesSafeFlicker = ["1/50", "1/100"].includes(settings.shutter);

  let statusClass = "good";
  let title = "Balanced starting point";
  let subtitle = "180° shutter • highlight-safe";
  if (!exactShutter) {
    statusClass = "warning";
    title = "Intentional shutter change";
    subtitle = "Check motion before you roll";
  }
  if (activePreset.lowLight && Number(settings.iso) > 6400) {
    statusClass = "warning";
    title = "Low-light limit";
    subtitle = "Noise will be visible — protect the face";
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
    iso: ["ISO", "ISO controls brightness", Number(settings.iso) <= 100 ? "ISO 100 is clean and ideal for Flat SDR daylight." : `ISO ${settings.iso} adds brightness, but also adds grain. Use it only after light, aperture, and shutter.`],
    shutter: ["SHUTTER", "Shutter controls motion", settings.shutter === "1/50" ? "1/50 at 25p gives natural cinematic motion — and works under 50 Hz lighting." : `${settings.shutter} changes motion blur. Faster looks crisper; slower looks smeared.`],
    aperture: ["APERTURE", "Aperture controls depth", settings.aperture === "f/2" ? "f/2 gives maximum separation but the focus area is very thin." : `${settings.aperture} balances light and depth. Higher f-numbers keep more of the scene sharp.`],
    frameRate: ["FRAME", "Frame rate controls time", settings.frameRate === "25p" ? "25p is your everyday cinematic frame rate in India." : `${settings.frameRate} can be slowed into a 25p timeline for smoother slow motion.`],
    whiteBalance: ["WB", "White balance locks colour", `${settings.whiteBalance}K keeps every clip consistent. Avoid Auto WB during a take.`],
    focusMode: ["FOCUS", "Focus should feel invisible", settings.focusMode.startsWith("MF") ? "Manual focus gives you certainty. Use red peaking and punch-in, then lock before rolling." : "AF-C follows movement. Slow AF speed (−5) makes changes feel less like a webcam."],
    metering: ["METER", "Metering tells the camera where to look", settings.metering === "Highlight-weighted" ? "Highlight-weighted metering is a useful reminder: keep sky and bright skin from clipping." : `${settings.metering} decides which part of the frame guides exposure. Watch the waveform, not just the meter.`],
    toneMode: ["TONE", "Tone mode decides your workflow", settings.toneMode === "N-Log" ? "N-Log needs ISO 800 or above. Use it for controlled light, then apply Nikon's N-Log to Rec.709 LUT." : settings.toneMode === "Monochrome" ? "Monochrome is a deliberate commitment. You cannot restore colour later." : "Flat SDR is the fast, forgiving everyday choice — especially without an ND filter."],
    stabilisation: ["IBIS", "Stability follows support", settings.stabilisation.includes("Tripod") ? "On a locked tripod, switch IBIS and e-VR off to prevent slow drifting." : settings.stabilisation.includes("e-VR ON") ? "e-VR steadies a walking shot but crops the image around 1.1×." : "IBIS on with e-VR off is the default for handheld static shots."],
    ev: ["EV", "Exposure compensation nudges brightness", `${formatEV(settings.ev)} EV is a small exposure offset. In manual video, use waveform and zebras rather than chasing the number.`],
    preset: ["SCENE", `${activePreset.name} is loaded`, activePreset.tip]
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
    $("#resultCount").textContent = query ? `${shown} matching field note${shown === 1 ? "" : "s"}` : "Showing all field notes";
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
  renderReferenceRows();
  updateSimulator("preset");
  initEvents();
}

document.addEventListener("DOMContentLoaded", init);
