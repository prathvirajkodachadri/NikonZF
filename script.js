/* ZF Field Companion — interactions */
(function () {
  'use strict';

  // ---------- Lens chooser ----------
  const lensCards = document.querySelectorAll('.lens-card');
  lensCards.forEach((btn) => {
    btn.addEventListener('click', () => {
      lensCards.forEach((b) => {
        b.classList.remove('is-selected');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('is-selected');
      btn.setAttribute('aria-checked', 'true');
      recompute();
    });
  });

  // ---------- Toggle rows (mode, place) ----------
  document.querySelectorAll('.toggle-row').forEach((row) => {
    const buttons = row.querySelectorAll('.toggle');
    buttons.forEach((b) => {
      b.addEventListener('click', () => {
        buttons.forEach((x) => {
          x.classList.remove('is-on');
          x.setAttribute('aria-checked', 'false');
        });
        b.classList.add('is-on');
        b.setAttribute('aria-checked', 'true');
        // When place changes, show/hide light options accordingly
        if (row.getAttribute('aria-label') === 'Place') {
          toggleLightOptions();
        }
        recompute();
      });
    });
  });

  // ---------- Light chips ----------
  const lightWrap = document.querySelector('.light-options');
  const lightEmpty = document.querySelector('.light-empty');
  function toggleLightOptions() {
    const place = document.querySelector('.toggle[data-place].is-on')?.dataset.place;
    if (!lightWrap) return;
    if (place) {
      lightEmpty.hidden = true;
      lightWrap.hidden = false;
    } else {
      lightEmpty.hidden = false;
      lightWrap.hidden = true;
    }
  }
  if (lightWrap) {
    lightWrap.querySelectorAll('.chip').forEach((c) => {
      c.addEventListener('click', () => {
        c.classList.toggle('is-on');
        // exclusive within group
        lightWrap.querySelectorAll('.chip').forEach((o) => {
          if (o !== c) o.classList.remove('is-on');
        });
        recompute();
      });
    });
  }
  toggleLightOptions();

  // ---------- Settings recompute ----------
  const out = {
    iso: document.querySelector('[data-r="iso"]'),
    shutter: document.querySelector('[data-r="shutter"]'),
    aperture: document.querySelector('[data-r="aperture"]'),
    focus: document.querySelector('[data-r="focus"]'),
    drive: document.querySelector('[data-r="drive"]'),
    wb: document.querySelector('[data-r="wb"]'),
    pc: document.querySelector('[data-r="pc"]'),
  };
  const note = document.getElementById('resultNote');

  // simple recipe table
  const RECIPES = {
    '24-120|photo|outdoor|bright':  { iso: '100', shutter: '1/1000', aperture: 'f/8',  focus: 'AF-S',  drive: 'Single',  wb: 'Daylight 5600K', pc: 'Standard' },
    '24-120|photo|outdoor|overcast':{ iso: '200', shutter: '1/500',  aperture: 'f/5.6',focus: 'AF-S',  drive: 'Single',  wb: 'Cloudy 6000K',  pc: 'Standard' },
    '24-120|photo|outdoor|shade':   { iso: '400', shutter: '1/250',  aperture: 'f/4',  focus: 'AF-C',  drive: 'Single',  wb: 'Shade 7500K',   pc: 'Neutral'  },
    '24-120|photo|outdoor|golden':  { iso: '200', shutter: '1/250',  aperture: 'f/4',  focus: 'AF-S',  drive: 'Single',  wb: 'Cloudy 6000K',  pc: 'Vivid'    },
    '24-120|photo|outdoor|blue':    { iso: '800', shutter: '1/60',   aperture: 'f/4',  focus: 'AF-S',  drive: 'Single',  wb: 'Auto (warm)',  pc: 'Neutral'  },
    '24-120|photo|outdoor|night':   { iso: '3200',shutter: '1/60',   aperture: 'f/2.8',focus: 'AF-C',  drive: 'Single',  wb: 'Auto',         pc: 'Standard' },
    '24-120|photo|indoor|window':   { iso: '400', shutter: '1/250',  aperture: 'f/2.8',focus: 'AF-S',  drive: 'Single',  wb: 'Auto',         pc: 'Standard' },
    '24-120|photo|indoor|mixed':    { iso: '800', shutter: '1/125',  aperture: 'f/2.8',focus: 'AF-C',  drive: 'Single',  wb: 'Auto',         pc: 'Standard' },
    '24-120|photo|indoor|bright':   { iso: '200', shutter: '1/250',  aperture: 'f/4',  focus: 'AF-S',  drive: 'Single',  wb: 'Daylight 5600K',pc: 'Standard' },

    '40|photo|outdoor|bright':      { iso: '100', shutter: '1/1000', aperture: 'f/5.6',focus: 'AF-S',  drive: 'Single',  wb: 'Daylight 5600K',pc: 'Standard' },
    '40|photo|outdoor|overcast':    { iso: '200', shutter: '1/500',  aperture: 'f/4',  focus: 'AF-S',  drive: 'Single',  wb: 'Cloudy 6000K',  pc: 'Standard' },
    '40|photo|outdoor|shade':       { iso: '400', shutter: '1/250',  aperture: 'f/2.8',focus: 'AF-C',  drive: 'Single',  wb: 'Shade 7500K',   pc: 'Neutral'  },
    '40|photo|outdoor|golden':      { iso: '200', shutter: '1/250',  aperture: 'f/2.8',focus: 'AF-S',  drive: 'Single',  wb: 'Cloudy 6000K',  pc: 'Vivid'    },
    '40|photo|outdoor|blue':        { iso: '800', shutter: '1/60',   aperture: 'f/2',  focus: 'AF-S',  drive: 'Single',  wb: 'Auto (warm)',  pc: 'Neutral'  },
    '40|photo|outdoor|night':       { iso: '3200',shutter: '1/60',   aperture: 'f/2',  focus: 'AF-C',  drive: 'Single',  wb: 'Auto',         pc: 'Standard' },
    '40|photo|indoor|window':       { iso: '400', shutter: '1/250',  aperture: 'f/2',  focus: 'AF-S',  drive: 'Single',  wb: 'Auto',         pc: 'Standard' },
    '40|photo|indoor|mixed':        { iso: '800', shutter: '1/125',  aperture: 'f/2',  focus: 'AF-C',  drive: 'Single',  wb: 'Auto',         pc: 'Standard' },
    '40|photo|indoor|bright':       { iso: '200', shutter: '1/250',  aperture: 'f/2.8',focus: 'AF-S',  drive: 'Single',  wb: 'Daylight 5600K',pc: 'Standard' },

    '24-120|video|outdoor|bright':  { iso: '100', shutter: '1/50',   aperture: 'f/8',  focus: 'AF-F',  drive: '—',      wb: 'Daylight 5600K',pc: 'Neutral'  },
    '24-120|video|outdoor|overcast':{ iso: '200', shutter: '1/50',   aperture: 'f/5.6',focus: 'AF-F',  drive: '—',      wb: 'Cloudy 6000K',  pc: 'Neutral'  },
    '24-120|video|outdoor|shade':   { iso: '400', shutter: '1/50',   aperture: 'f/4',  focus: 'AF-F',  drive: '—',      wb: 'Shade 7500K',   pc: 'Neutral'  },
    '24-120|video|outdoor|golden':  { iso: '200', shutter: '1/50',   aperture: 'f/4',  focus: 'AF-F',  drive: '—',      wb: 'Cloudy 6000K',  pc: 'Vivid'    },
    '24-120|video|outdoor|blue':    { iso: '800', shutter: '1/50',   aperture: 'f/4',  focus: 'AF-F',  drive: '—',      wb: 'Auto (warm)',  pc: 'Neutral'  },
    '24-120|video|outdoor|night':   { iso: '3200',shutter: '1/50',   aperture: 'f/2.8',focus: 'AF-F',  drive: '—',      wb: 'Auto',         pc: 'Neutral'  },
    '24-120|video|indoor|window':   { iso: '400', shutter: '1/50',   aperture: 'f/2.8',focus: 'AF-F',  drive: '—',      wb: 'Auto',         pc: 'Neutral'  },
    '24-120|video|indoor|mixed':    { iso: '800', shutter: '1/50',   aperture: 'f/2.8',focus: 'AF-F',  drive: '—',      wb: 'Auto',         pc: 'Neutral'  },
    '24-120|video|indoor|bright':   { iso: '200', shutter: '1/50',   aperture: 'f/4',  focus: 'AF-F',  drive: '—',      wb: 'Daylight 5600K',pc: 'Neutral'  },

    '40|video|outdoor|bright':      { iso: '100', shutter: '1/50',   aperture: 'f/5.6',focus: 'AF-F',  drive: '—',      wb: 'Daylight 5600K',pc: 'Neutral'  },
    '40|video|outdoor|overcast':    { iso: '200', shutter: '1/50',   aperture: 'f/4',  focus: 'AF-F',  drive: '—',      wb: 'Cloudy 6000K',  pc: 'Neutral'  },
    '40|video|outdoor|shade':       { iso: '400', shutter: '1/50',   aperture: 'f/2.8',focus: 'AF-F',  drive: '—',      wb: 'Shade 7500K',   pc: 'Neutral'  },
    '40|video|outdoor|golden':      { iso: '200', shutter: '1/50',   aperture: 'f/2.8',focus: 'AF-F',  drive: '—',      wb: 'Cloudy 6000K',  pc: 'Vivid'    },
    '40|video|outdoor|blue':        { iso: '800', shutter: '1/50',   aperture: 'f/2',  focus: 'AF-F',  drive: '—',      wb: 'Auto (warm)',  pc: 'Neutral'  },
    '40|video|outdoor|night':       { iso: '3200',shutter: '1/50',   aperture: 'f/2',  focus: 'AF-F',  drive: '—',      wb: 'Auto',         pc: 'Neutral'  },
    '40|video|indoor|window':       { iso: '400', shutter: '1/50',   aperture: 'f/2',  focus: 'AF-F',  drive: '—',      wb: 'Auto',         pc: 'Neutral'  },
    '40|video|indoor|mixed':        { iso: '800', shutter: '1/50',   aperture: 'f/2',  focus: 'AF-F',  drive: '—',      wb: 'Auto',         pc: 'Neutral'  },
    '40|video|indoor|bright':       { iso: '200', shutter: '1/50',   aperture: 'f/2.8',focus: 'AF-F',  drive: '—',      wb: 'Daylight 5600K',pc: 'Neutral'  }
  };

  function recompute() {
    const lens  = document.querySelector('.lens-card.is-selected')?.dataset.lens;
    const mode  = document.querySelector('.toggle[data-mode].is-on')?.dataset.mode;
    const place = document.querySelector('.toggle[data-place].is-on')?.dataset.place;
    const light = document.querySelector('.light-options .chip.is-on')?.dataset.light;
    if (!lens || !mode || !place || !light) {
      if (note) {
        const missing = [];
        if (!lens)  missing.push('lens');
        if (!mode)  missing.push('mode');
        if (!place) missing.push('place');
        if (!light) missing.push('light');
        note.textContent = 'Still need: ' + missing.join(', ') + '.';
      }
      return;
    }
    const key = lens + '|' + mode + '|' + place + '|' + light;
    const r = RECIPES[key] || {
      iso: 'AUTO', shutter: 'AUTO', aperture: 'AUTO',
      focus: mode === 'video' ? 'AF-F' : 'AF-S',
      drive: mode === 'video' ? '—' : 'Single',
      wb: 'Auto', pc: 'Standard'
    };
    if (out.iso)      out.iso.textContent      = r.iso;
    if (out.shutter)  out.shutter.textContent  = r.shutter;
    if (out.aperture) out.aperture.textContent = r.aperture;
    if (out.focus)    out.focus.textContent    = r.focus;
    if (out.drive)    out.drive.textContent    = r.drive;
    if (out.wb)       out.wb.textContent       = r.wb;
    if (out.pc)       out.pc.textContent       = r.pc;
    if (note) note.textContent = 'Saved for: ' + lens + ' · ' + mode + ' · ' + place + ' · ' + light + '.';
  }

  // ---------- Camera control map: dial hot spots ----------
  const hotSpots = document.querySelectorAll('.topview .hot');
  const dialPanels = document.querySelectorAll('.dial-panel');
  const legendItems = document.querySelectorAll('.dial-legend li');
  const DIAL_KEYS = { iso: 'iso', shutter: 'shutter', aperture: 'aperture', ec: 'ec' };

  function activateDial(key) {
    hotSpots.forEach((g) => g.classList.toggle('is-on', g.dataset.dial === key));
    legendItems.forEach((li, i) => {
      const k = ['iso','shutter','aperture','ec'][i];
      li.style.color = k === key ? 'var(--accent)' : '';
    });
    dialPanels.forEach((p) => {
      const match = p.dataset.dialPanel === key;
      p.classList.toggle('is-on', match);
      p.classList.toggle('is-dim', !match);
    });
  }
  hotSpots.forEach((g) => {
    g.addEventListener('click', () => activateDial(g.dataset.dial));
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateDial(g.dataset.dial); }
    });
  });
  legendItems.forEach((li, i) => {
    const k = ['iso','shutter','aperture','ec'][i];
    li.addEventListener('click', () => activateDial(k));
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateDial(k); }
    });
  });
  // default: highlight first
  activateDial('iso');

  // ---------- Initial state ----------
  recompute();
})();
