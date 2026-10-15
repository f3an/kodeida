# Accessibility

Kodeida is a game about learning, and we want it to be usable by as many people as possible. This file describes what works on the website today, what doesn't yet, and how to tell us about barriers. The game app (`app/`) has its first level; accessibility is part of its design from the start.

## Supported environments

- **Website** (<https://f3an.github.io/kodeida/>): any current browser, desktop and mobile.
- **Languages:** the landing page is Ukrainian and English (switch in the top-right corner); the artbook is Ukrainian for now.
- **Themes:** light, dark, or follow the system setting. The choice is remembered.

## What we do

- Animations stop when the system asks for reduced motion (`prefers-reduced-motion`); every animated scene then shows a finished frame.
- Animated canvases carry text descriptions (`aria-label`), in the current language.
- Navigation, world pins on the map, character and variant pickers, onboarding dots and theme/language switches are native buttons with visible keyboard focus.
- The world map can be driven with the ← → keys once focused.
- The onboarding text has a visible scroll indicator in addition to the native scrollbar.
- On touch devices the "one section per screen" snapping is turned off so the page scrolls normally.

## The game app (pre-alpha)

- Buttons, tabs and the language switch are native controls with visible keyboard focus. **Ctrl/⌘ + Enter** runs the code on the example, **Ctrl/⌘ + Shift + Enter** runs all tests.
- Character lines (Mykyta, Dido, Juno, the Sibyl) are announced through a live region; test results are plain text.
- The world animation respects `prefers-reduced-motion`: heroes jump to their positions instead of walking.
- Not done yet: a text description of each animation step for screen readers, English interface, adjustable font size.

## Known limitations

- We have not yet run a full audit with a screen reader. Animated scenes describe what they show only in general terms.
- Not every element has been checked for colour contrast against WCAG 2.2 AA, especially text over pixel-art scenes.
- On desktop, very short windows scale sections down to fit, which can make small text harder to read.

## Reporting a barrier

If something on the website is hard or impossible to use with your setup, please [open an issue](https://github.com/f3an/kodeida/issues/new/choose) and include:

- your operating system and browser;
- the assistive technology you use (screen reader, magnifier, voice control, keyboard only, …);
- what you tried to do and what happened instead.

Accessibility issues are treated as bugs, not feature requests.
