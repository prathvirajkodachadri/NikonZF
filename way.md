# Nikon Zf + NIKKOR Z 40mm f/2 — Interactive Cinematic Cheat Sheet
### (No-ND Edition — Pure Exposure Workflow Website)

Welcome to the **Nikon Zf + NIKKOR Z 40mm f/2 — Cinematic Cheat Sheet Interactive App**. This repository hosts a premium, responsive, and highly interactive Single-Page Application (SPA) designed specifically for filmmakers, videographers, and creators shooting on the retro **Nikon Zf** with the standard prime **NIKKOR Z 40mm f/2** lens under pure mechanical exposure (no ND filters).

---

## 🌟 Premium Features

The web app is styled with **obsidian, leatherette, and solid brass accents** (`#D4AF37`) matching the timeless aesthetic of the physical Nikon Zf body. It includes the following interactive capabilities:

1. **Retro Dial Control Simulation Panel**:
   - Simulated mechanical brass-trim dials for **ISO** and **Shutter Speed**, plus a small digital **OLED Aperture Window** (`f/2.0` - `f/16.0`) that rotates and snaps to place.
   - Dynamic **EV Deviation Level Gauge** displaying calculated exposure balances.
   - Toggle buttons for **SDR/Flat Mode** and **N-Log Mode** (changing base ISO constraints).

2. **High-Fidelity LCD Viewfinder Monitor**:
   - Simulated fully-articulating LCD screen with continuous red-tally REC blinking, a running timecode, and battery-status indicators.
   - **Dynamic Scenic Backdrops**: Unsplash-linked images representing each environment that change instantly based on the active scenario.
   - **Dynamic Waveform Monitor**: Custom Canvas-rendered real-time waveform analyzing highlight values.
   - **Highlight Zebra Patterns**: Animated diagnostic stripes appearing in highlights (>95% clipping thresholds) to visually guide manual stop-downs.
   - **Red Focus Peaking**: Visual red outlines overlays on subjects to simulate focus peaking aids.
   - Interactive toggle control buttons to show/hide the Grid, Waveform, Zebras, or Peaking on the fly.

3. **Scenario Matrix (Visual Chooser)**:
   - Dynamic grid displaying 13 scenarios across categories (Daylight Shade, Harsh Sun, Interiors, Specialty).
   - Clicking any scenario instantly synchronizes the dials, updates the LCD background, and populates the **Active Director's Notes** with advice on White Balance, focus lanes, and No-ND protection rules.

4. **Direct Sun Exposure Ladder Tool**:
   - Interactive slider representing Aperture size from `f/2.8` to `f/16`.
   - Real-time calculations of the required shutter speeds needed to balance exposure under bright direct sun at ISO 100.
   - Real-time rating of **Motion Signatures** (from "fluid cinematic" to "choppy action" and "severe staccato") with an animated vibration indicator demonstrating the staccato judder.
   - Active advice on diffraction risks and high shutter mitigations.

5. **Focus & Depth-of-Field (DoF) Calculator**:
   - Slider inputs for custom Subject Distance (`0.29 m` to `6.0 m`) and Aperture.
   - **Sensor Crop Factor Switch**: Toggle between Full-Frame (**FX**) and **1.5x DX Crop** (forced during high frame-rate 4K 50p/60p, shifting focal ranges to 60mm equivalents).
   - Real-time mathematical outputs of the Near Focus Limit, Far Focus Limit, Total Depth of Field (in cm), and Hyperfocal Distance.
   - Dynamically drawn **2D Visual Focus Lane Map** displaying camera, subject, and in-focus boundaries.
   - Dynamic **Focus Tolerance Advisories** alerting you of razor-thin boundaries.

6. **Set-Once Camera Menu Checklist**:
   - Interactive checklist with 15 recommended settings (Movie File Type, Frame Size, Tone Mode, Wind noise, tracking speeds).
   - Dynamically updating **Camera Readiness Progress Bar** tracking configure state.
   - **Persistent LocalStorage State**: Check off items and they will remain configured even if you close or reload the browser.

7. **Calculators & Technical Toolbox**:
   - **180° Shutter Speed Solver**: Select frame rates (24p, 25p, 30p, 50p, 60p, 100p, 120p) and see safe motion shutters.
   - **Anti-Flicker Frequency Guide**: Adapt frequencies for India's 50Hz lights vs US 60Hz grids.
   - **Audio Gain Monitor**: Interactive audio meter fluctuating in real-time, displaying why manual sensitivities around -12dB prevent auto-gain hiss.

8. **Specs & Hardware Warning Logs**:
   - Highlights critical on-set boundaries like dual microSD speed bottlenecks, micro-HDMI clamps, battery consumption metrics, and rolling shutter limits.

---

## 🚀 How to Run the Website Locally

Since the application is designed utilizing standard modern HTML5, CSS3 (Tailwind CSS), and Vanilla ES6 JavaScript, it is completely self-contained and has **zero heavy framework dependencies**. It is optimized to run smoothly on any mobile browser (critical for on-set access) as well as desktops.

### Method 1: Double-Click (Easiest)
Simply navigate to the repository directory and double-click `index.html` to open it directly in Google Chrome, Safari, Firefox, or Edge.

### Method 2: Local Python Server (Recommended)
To run a clean local web server, run the helper Python script provided:

```bash
python3 server.py
```

This will automatically spin up a lightweight server on port `8000` and open the app in your default browser at: `http://localhost:8000`.

---

## 🛠 Repository Structure

* `index.html` — The main interactive single-page application.
* `server.py` — A simple helper script to run a local python web server.
* `README.md` — Technical documentation.

---

## 📷 Photographic & Lens Specs Captured

* **Nikon Zf body**: 24.5 Megapixel full-frame sensor, retro manual dial ergonomics, 5-axis IBIS, 10-bit internal recording, dual card slots (UHS-II SD + MicroSD).
* **NIKKOR Z 40mm f/2**: Maximum aperture `f/2.0`, minimum aperture `f/16.0`, 52mm filter thread, 9 rounded aperture blades, minimum focusing distance `0.29 m`, weight `170g`.
