// Розкладка відео до релізу v0.3. Ті самі одиниці, що й у трейлера: такт = 48 кадрів, доля = 12.
export const BPM = 150;
export const FPS = 30;
export const BEAT = 12;
export const BAR = 48;

export const SECTIONS = [
  { id: 'ship', start: 0, bars: 2, chord: ['C', 'A'], music: { pad: 0.03, hats: 8, kick: 1, riser: 'long', roll: true } },
  { id: 'release', start: 2, bars: 2, music: { impact: true, pad: 0.06, bass: 2, arp: true, kick: 4, snare: true, hats: 16, lead: 'on' } },
  { id: 'abc', start: 4, bars: 3, music: { crash: true, pad: 0.03, box: true, bass: 1, kick: 2, hats: 8 } },
  { id: 'worlds', start: 7, bars: 2, music: { impact: true, bass: 2, arp: true, kick: 4, snare: true, hats: 16, lead: 'up' } },
  { id: 'ways', start: 9, bars: 2, music: { pad: 0.04, bass: 1, arp: true, kick: 4, hats: 16, riser: 'long', roll: true } },
  { id: 'more', start: 11, bars: 2, music: { impact: true, pad: 0.06, bass: 2, arp: true, kick: 4, snare: true, hats: 16, lead: 'on' } },
  { id: 'download', start: 13, bars: 3, music: { crash: true, bass: 2, arp: true, kick: 4, snare: true, hats: 8, lead: 'thin' } },
  { id: 'playtest', start: 16, bars: 2, chord: ['Dm', 'A'], music: { pad: 0.03, longBass: true, kick: 1, riser: 'long', roll: true } },
  { id: 'end', start: 18, bars: 2, music: { end: true } },
];

export const BARS = SECTIONS.reduce((n, s) => Math.max(n, s.start + s.bars), 0);
export const TOTAL_FRAMES = BARS * BAR;
