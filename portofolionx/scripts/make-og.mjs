import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const W = 1200, H = 630;
const MONO = "Consolas, 'DejaVu Sans Mono', monospace";
const SANS = "'Segoe UI', Arial, Helvetica, sans-serif";

// Bars: PageSpeed 47 (before, red) -> 98 (after, green)
const barX = 700, barW = 400;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0b0b0d"/>
  <rect x="0" y="0" width="${W}" height="4" fill="#2563eb"/>

  <!-- left column -->
  <text x="72" y="108" font-family="${MONO}" font-size="19" fill="#22c55e">$ white-label web dev · fr/en · 48h</text>

  <text x="72" y="192" font-family="${SANS}" font-size="47" font-weight="700" fill="#f4f4f5" letter-spacing="-1.2">Scale your agency</text>
  <text x="72" y="248" font-family="${SANS}" font-size="47" font-weight="700" fill="#2563eb" letter-spacing="-1.2">without touching code.</text>

  <text x="72" y="330" font-family="${MONO}" font-size="21" fill="#a1a1aa">You close the deal. We build it.</text>
  <text x="72" y="362" font-family="${MONO}" font-size="21" fill="#a1a1aa">You pocket the margin.</text>

  <!-- stat strip -->
  <rect x="72" y="424" width="536" height="92" fill="none" stroke="#27272a" stroke-width="1"/>
  <line x1="206" y1="424" x2="206" y2="516" stroke="#27272a" stroke-width="1"/>
  <line x1="340" y1="424" x2="340" y2="516" stroke="#27272a" stroke-width="1"/>
  <line x1="474" y1="424" x2="474" y2="516" stroke="#27272a" stroke-width="1"/>

  <text x="94" y="466" font-family="${SANS}" font-size="30" font-weight="700" fill="#f4f4f5">48h</text>
  <text x="94" y="496" font-family="${MONO}" font-size="14" fill="#71717a">turnaround</text>
  <text x="228" y="466" font-family="${SANS}" font-size="30" font-weight="700" fill="#f4f4f5">$1K</text>
  <text x="228" y="496" font-family="${MONO}" font-size="14" fill="#71717a">flat_fee</text>
  <text x="362" y="466" font-family="${SANS}" font-size="30" font-weight="700" fill="#f4f4f5">90+</text>
  <text x="362" y="496" font-family="${MONO}" font-size="14" fill="#71717a">pagespeed</text>
  <text x="496" y="466" font-family="${SANS}" font-size="30" font-weight="700" fill="#f4f4f5">FR·EN</text>
  <text x="496" y="496" font-family="${MONO}" font-size="14" fill="#71717a">native</text>

  <!-- right: terminal card -->
  <rect x="${barX - 32}" y="128" width="464" height="374" rx="8" fill="#111113" stroke="#27272a" stroke-width="1"/>
  <circle cx="${barX - 8}" cy="158" r="6" fill="#ef4444"/>
  <circle cx="${barX + 14}" cy="158" r="6" fill="#eab308"/>
  <circle cx="${barX + 36}" cy="158" r="6" fill="#22c55e"/>
  <text x="${barX + 66}" y="164" font-family="${MONO}" font-size="14" fill="#52525b">pagespeed.report</text>

  <text x="${barX - 8}" y="228" font-family="${MONO}" font-size="16" fill="#71717a">before</text>
  <rect x="${barX - 8}" y="244" width="${barW}" height="14" rx="7" fill="#27272a"/>
  <rect x="${barX - 8}" y="244" width="${Math.round(barW * 0.47)}" height="14" rx="7" fill="#ef4444"/>
  <text x="${barX - 8 + barW}" y="228" text-anchor="end" font-family="${SANS}" font-size="30" font-weight="700" fill="#ef4444">47</text>

  <text x="${barX - 8}" y="318" font-family="${MONO}" font-size="16" fill="#71717a">after</text>
  <rect x="${barX - 8}" y="334" width="${barW}" height="14" rx="7" fill="#27272a"/>
  <rect x="${barX - 8}" y="334" width="${Math.round(barW * 0.98)}" height="14" rx="7" fill="#22c55e"/>
  <text x="${barX - 8 + barW}" y="318" text-anchor="end" font-family="${SANS}" font-size="30" font-weight="700" fill="#22c55e">98</text>

  <line x1="${barX - 8}" y1="386" x2="${barX - 8 + barW}" y2="386" stroke="#27272a" stroke-width="1"/>
  <text x="${barX - 8}" y="424" font-family="${MONO}" font-size="15" fill="#22c55e">✓ custom-coded</text>
  <text x="${barX - 8}" y="452" font-family="${MONO}" font-size="15" fill="#22c55e">✓ bilingual fr/en</text>
  <text x="${barX - 8}" y="480" font-family="${MONO}" font-size="15" fill="#22c55e">✓ delivered in 48h</text>

  <!-- wordmark -->
  <text x="72" y="576" font-family="${SANS}" font-size="24" font-weight="700" fill="#f4f4f5">nexawebdev</text>
  <text x="${W - 72}" y="576" text-anchor="end" font-family="${MONO}" font-size="17" fill="#52525b">nexaweb.dev</text>
</svg>`;

const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
console.log('writing ->', out);

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
const meta = await sharp(out).metadata();
console.log('done:', meta.width + 'x' + meta.height, meta.format);
