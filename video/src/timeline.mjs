// Спільна розкладка трейлера для відео й музики. Одиниця — такт (4 долі по 12 кадрів при 30 fps).
export const BPM = 150;
export const FPS = 30;
export const BEAT = 12; // кадрів
export const BAR = 48; // кадрів

export const SECTIONS = [
  { id: 'cold', start: 0, bars: 2, chord: ['C', 'A'], music: { pad: 0.03, hats: 8, riser: 'long', roll: true } },
  { id: 'logo', start: 2, bars: 2, music: { impact: true, pad: 0.06, bass: 2, arp: true, kick: 4, snare: true, hats: 16, lead: 'on' } },
  { id: 'story', start: 4, bars: 3, music: { crash: true, pad: 0.04, bass: 1, arp: true, kick: 2, hats: 8 } },
  { id: 'heroes', start: 7, bars: 4, music: { crash: true, pad: 0.05, bass: 2, arp: true, kick: 4, snare: true, hats: 16, lead: 'on' } },
  { id: 'play', start: 11, bars: 4, music: { crash: true, bass: 2, arp: true, kick: 4, snare: true, hats: 8, lead: 'thin' } },
  { id: 'wolf', start: 15, bars: 2, chord: ['Dm', 'A'], music: { pad: 0.03, longBass: true, kick: 1, riser: 'long', roll: true } },
  { id: 'worlds', start: 17, bars: 4, music: { impact: true, pad: 0.06, bass: 2, arp: true, kick: 4, snare: true, hats: 16, lead: 'up' } },
  { id: 'map', start: 21, bars: 2, music: { crash: true, bass: 2, arp: true, kick: 4, snare: true, hats: 16 } },
  { id: 'abc', start: 23, bars: 3, music: { crash: true, pad: 0.03, box: true, hats: 8, kick: 1 } },
  { id: 'ways', start: 26, bars: 2, music: { pad: 0.04, bass: 1, arp: true, kick: 4, hats: 16, riser: 'long', roll: true } },
  { id: 'features', start: 28, bars: 2, music: { impact: true, pad: 0.06, bass: 2, arp: true, kick: 4, snare: true, hats: 16, lead: 'on' } },
  { id: 'outro', start: 30, bars: 2, music: { crash: true, pad: 0.06, bass: 2, arp: true, kick: 4, snare: true, hats: 16, lead: 'up', roll: true } },
  { id: 'end', start: 32, bars: 2, music: { end: true } },
];

export const BARS = SECTIONS.reduce((n, s) => Math.max(n, s.start + s.bars), 0);
export const TOTAL_FRAMES = BARS * BAR;
export const sec = (id) => SECTIONS.find((s) => s.id === id);
