const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'assets');
const badgesDir = path.join(baseDir, 'badges');
const stampsDir = path.join(baseDir, 'stamps');

[badgesDir, stampsDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. NIC Logo SVG
const nicSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="200" height="50">
  <rect width="200" height="50" fill="#ffffff" rx="4"/>
  <rect x="0" y="0" width="66.6" height="3" fill="#f97316"/>
  <rect x="66.6" y="0" width="66.6" height="3" fill="#ffffff"/>
  <rect x="133.2" y="0" width="66.8" height="3" fill="#16a34a"/>
  <g transform="translate(8, 8)">
    <circle cx="17" cy="17" r="16" fill="#002147"/>
    <circle cx="17" cy="17" r="12" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 1.5"/>
    <path d="M17 5 L17 29 M5 17 L29 17 M8.5 8.5 L25.5 25.5 M8.5 25.5 L25.5 8.5" stroke="#ffffff" stroke-width="1" opacity="0.7"/>
    <circle cx="17" cy="17" r="4" fill="#f97316"/>
  </g>
  <text x="48" y="20" font-family="'Inter', sans-serif" font-size="14" font-weight="900" fill="#002147" letter-spacing="1">NIC</text>
  <text x="48" y="31" font-family="'Inter', sans-serif" font-size="7.5" font-weight="700" fill="#0284c7">राष्ट्रीय सूचना विज्ञान केंद्र</text>
  <text x="48" y="41" font-family="'Inter', sans-serif" font-size="7" font-weight="600" fill="#475569">National Informatics Centre</text>
</svg>`;

// 2. CERT-In Cyber Security Badge SVG
const certInSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50">
  <rect width="160" height="50" fill="#ffffff" rx="4" stroke="#cbd5e1" stroke-width="1"/>
  <g transform="translate(10, 8)">
    <path d="M16 2 L4 7 V18 C4 26 16 32 16 32 C16 32 28 26 28 18 V7 Z" fill="#002147" stroke="#f97316" stroke-width="1.5"/>
    <rect x="11" y="16" width="10" height="8" rx="1" fill="#22c55e"/>
    <path d="M13 16 V12 C13 10.3 14.3 9 16 9 C17.7 9 19 10.3 19 12 V16" fill="none" stroke="#ffffff" stroke-width="1.5"/>
    <circle cx="16" cy="19.5" r="1" fill="#002147"/>
  </g>
  <text x="46" y="20" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#002147">CERT-In</text>
  <text x="46" y="31" font-family="'Inter', sans-serif" font-size="7.5" font-weight="700" fill="#16a34a">CYBER SECURED</text>
  <text x="46" y="41" font-family="'Inter', sans-serif" font-size="6.5" font-weight="500" fill="#64748b">MeitY Govt of India</text>
</svg>`;

// 3. DigiLocker Logo SVG
const digilockerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" width="160" height="50">
  <rect width="160" height="50" fill="#ffffff" rx="4" stroke="#cbd5e1" stroke-width="1"/>
  <g transform="translate(10, 10)">
    <path d="M8 20 A7 7 0 0 1 18 10 A9 9 0 0 1 30 16 A6 6 0 0 1 30 26 H8 A6 6 0 0 1 8 20 Z" fill="#0284c7" opacity="0.2" stroke="#0284c7" stroke-width="1.5"/>
    <circle cx="20" cy="18" r="3" fill="#002147"/>
    <polygon points="18,19 22,19 21,24 19,24" fill="#002147"/>
  </g>
  <text x="48" y="20" font-family="'Inter', sans-serif" font-size="12" font-weight="900" fill="#0284c7">DigiLocker</text>
  <text x="48" y="31" font-family="'Inter', sans-serif" font-size="7.5" font-weight="700" fill="#16a34a">VERIFIED STORAGE</text>
  <text x="48" y="41" font-family="'Inter', sans-serif" font-size="6.5" font-weight="500" fill="#64748b">Digital India Initiative</text>
</svg>`;

// 4. GIGW 3.0 Compliance Badge SVG
const gigwSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 50" width="150" height="50">
  <rect width="150" height="50" fill="#ffffff" rx="4" stroke="#cbd5e1" stroke-width="1"/>
  <g transform="translate(10, 10)">
    <circle cx="15" cy="15" r="14" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
    <path d="M8 15 L13 20 L22 10" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="44" y="20" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#002147">GIGW 3.0</text>
  <text x="44" y="31" font-family="'Inter', sans-serif" font-size="7.5" font-weight="700" fill="#15803d">COMPLIANT</text>
  <text x="44" y="41" font-family="'Inter', sans-serif" font-size="6.5" font-weight="500" fill="#64748b">STQC Certified Portal</text>
</svg>`;

// 5. ISO 27001 ISMS Badge SVG
const isoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 50" width="150" height="50">
  <rect width="150" height="50" fill="#ffffff" rx="4" stroke="#cbd5e1" stroke-width="1"/>
  <g transform="translate(10, 10)">
    <polygon points="15,2 27,8 27,22 15,28 3,22 3,8" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
    <text x="15" y="18" font-family="'Inter', sans-serif" font-size="8" font-weight="900" fill="#1e3a8a" text-anchor="middle">ISMS</text>
  </g>
  <text x="44" y="20" font-family="'Inter', sans-serif" font-size="10.5" font-weight="800" fill="#002147">ISO/IEC 27001</text>
  <text x="44" y="31" font-family="'Inter', sans-serif" font-size="7.5" font-weight="700" fill="#2563eb">DATA PRIVACY</text>
  <text x="44" y="41" font-family="'Inter', sans-serif" font-size="6.5" font-weight="500" fill="#64748b">Certified Security</text>
</svg>`;

// 6. AICTE Gold Statutory Hologram Seal SVG
const goldSealSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <defs>
    <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="25%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="75%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </radialGradient>
    <radialGradient id="innerGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef9c3"/>
      <stop offset="70%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#a16207"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  
  <g filter="url(#shadow)">
    <circle cx="90" cy="90" r="82" fill="url(#goldGrad)" stroke="#78350f" stroke-width="1.5"/>
    <circle cx="90" cy="90" r="76" fill="none" stroke="#78350f" stroke-width="1" stroke-dasharray="3 2"/>
    <circle cx="90" cy="90" r="72" fill="url(#innerGrad)" stroke="#92400e" stroke-width="1.5"/>
    <circle cx="90" cy="90" r="56" fill="#ffffff" opacity="0.15"/>
    <circle cx="90" cy="90" r="54" fill="none" stroke="#78350f" stroke-width="1" stroke-dasharray="2 2"/>
  </g>
  
  <path id="textPathTop" d="M 25 90 A 65 65 0 0 1 155 90" fill="none"/>
  <text font-family="'Inter', sans-serif" font-size="8.2" font-weight="900" fill="#451a03" letter-spacing="0.8">
    <textPath href="#textPathTop" startOffset="50%" text-anchor="middle">
      ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
    </textPath>
  </text>
  
  <path id="textPathBottom" d="M 155 90 A 65 65 0 0 1 25 90" fill="none"/>
  <text font-family="'Inter', sans-serif" font-size="8.2" font-weight="900" fill="#451a03" letter-spacing="1">
    <textPath href="#textPathBottom" startOffset="50%" text-anchor="middle">
      * STATUTORY LIEN DEPOSIT SEAL *
    </textPath>
  </text>
  
  <g transform="translate(60, 58)">
    <polygon points="30,2 35,16 49,11 41,23 54,29 41,35 49,47 35,42 30,56 25,42 11,47 19,35 6,29 19,23 11,11 25,16" fill="#ca8a04" opacity="0.4"/>
    <circle cx="30" cy="29" r="19" fill="#78350f" stroke="#fef08a" stroke-width="1"/>
    <text x="30" y="25" font-family="'Inter', sans-serif" font-size="7.5" font-weight="900" fill="#fef08a" text-anchor="middle">AICTE</text>
    <text x="30" y="33" font-family="'Inter', sans-serif" font-size="5" font-weight="700" fill="#ffffff" text-anchor="middle">APH 2024-27</text>
    <text x="30" y="41" font-family="'Inter', sans-serif" font-size="4.5" font-weight="800" fill="#fde047" text-anchor="middle">CLAUSE 1.4</text>
  </g>
</svg>`;

// 7. Official Red Rubber Stamp: AICTE Statutory Lien Verified
const redLienStampSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 120" width="220" height="120">
  <g transform="rotate(-4, 110, 60)">
    <rect x="6" y="6" width="208" height="108" rx="6" fill="none" stroke="#b91c1c" stroke-width="3.5" stroke-dasharray="120 2 80 1.5 50 3" opacity="0.9"/>
    <rect x="11" y="11" width="198" height="98" rx="4" fill="#fef2f2" fill-opacity="0.8" stroke="#dc2626" stroke-width="1.5" opacity="0.85"/>
    
    <text x="110" y="28" font-family="'Inter', monospace" font-size="9" font-weight="900" fill="#991b1b" text-anchor="middle" letter-spacing="1.5">
      AICTE REGULATION BUREAU
    </text>
    <line x1="22" y1="33" x2="198" y2="33" stroke="#b91c1c" stroke-width="1" stroke-dasharray="4 2"/>
    
    <text x="110" y="55" font-family="'Inter', sans-serif" font-size="13" font-weight="900" fill="#b91c1c" text-anchor="middle" letter-spacing="1">
      * STATUTORY LIEN RECORDED *
    </text>
    
    <text x="110" y="72" font-family="'Inter', sans-serif" font-size="8.5" font-weight="800" fill="#7f1d1d" text-anchor="middle">
      IN FAVOUR OF: MEMBER SECRETARY, AICTE NEW DELHI
    </text>
    <text x="110" y="85" font-family="'Inter', sans-serif" font-size="7.5" font-weight="700" fill="#991b1b" text-anchor="middle">
      MANDATED UNDER APH 2024-27 CL. 1.4 · LEVEL L2 VERIFIED
    </text>
    
    <line x1="22" y1="92" x2="198" y2="92" stroke="#b91c1c" stroke-width="1" stroke-dasharray="4 2"/>
    <text x="110" y="103" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="600" fill="#7f1d1d" text-anchor="middle">
      REGISTRY REF: AICTE-FDR-2026-REG-OK · ZERO-GAP
    </text>
  </g>
</svg>`;

// 8. Official Blue Bank CBS Attestation Stamp
const blueBankStampSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 110" width="200" height="110">
  <g transform="rotate(3, 100, 55)">
    <rect x="5" y="5" width="190" height="100" rx="5" fill="#eff6ff" fill-opacity="0.8" stroke="#1d4ed8" stroke-width="3" stroke-dasharray="90 2 60 1" opacity="0.9"/>
    <rect x="10" y="10" width="180" height="90" rx="3" fill="none" stroke="#2563eb" stroke-width="1" opacity="0.7"/>
    
    <text x="100" y="27" font-family="'Inter', sans-serif" font-size="9" font-weight="900" fill="#1e40af" text-anchor="middle" letter-spacing="1">
      SCHEDULED COMMERCIAL BANK
    </text>
    <line x1="20" y1="32" x2="180" y2="32" stroke="#1d4ed8" stroke-width="1"/>
    
    <text x="100" y="52" font-family="'Inter', sans-serif" font-size="12" font-weight="900" fill="#1e3a8a" text-anchor="middle" letter-spacing="0.5">
      ✓ CBS LIEN ATTESTED
    </text>
    <text x="100" y="68" font-family="'Inter', sans-serif" font-size="8" font-weight="700" fill="#1d4ed8" text-anchor="middle">
      BRANCH CBS FLAG: LIEN_AICTE_NEW_DELHI
    </text>
    
    <line x1="20" y1="75" x2="180" y2="75" stroke="#1d4ed8" stroke-width="1" stroke-dasharray="3 2"/>
    <text x="100" y="88" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#1e40af" text-anchor="middle">
      AUTH SIGNATORY: CHIEF BRANCH MGR
    </text>
    <text x="100" y="98" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="600" fill="#475569" text-anchor="middle">
      STP API CONFIRMATION HASH VERIFIED
    </text>
  </g>
</svg>`;

// 9. Official Green NOC Release Stamp / Rosette
const greenNocStampSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <g transform="rotate(-6, 80, 80)">
    <circle cx="80" cy="80" r="74" fill="#f0fdf4" fill-opacity="0.85" stroke="#15803d" stroke-width="3" stroke-dasharray="40 2 30 1"/>
    <circle cx="80" cy="80" r="68" fill="none" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 2"/>
    <circle cx="80" cy="80" r="52" fill="none" stroke="#15803d" stroke-width="1"/>
    
    <path id="nocTopPath" d="M 20 80 A 60 60 0 0 1 140 80" fill="none"/>
    <text font-family="'Inter', sans-serif" font-size="7.5" font-weight="900" fill="#14532d" letter-spacing="0.5">
      <textPath href="#nocTopPath" startOffset="50%" text-anchor="middle">
        ALL INDIA COUNCIL FOR TECHNICAL ED.
      </textPath>
    </text>
    
    <path id="nocBottomPath" d="M 140 80 A 60 60 0 0 1 20 80" fill="none"/>
    <text font-family="'Inter', sans-serif" font-size="8" font-weight="900" fill="#14532d" letter-spacing="1">
      <textPath href="#nocBottomPath" startOffset="50%" text-anchor="middle">
        * ENCASHMENT NOC RELEASED *
      </textPath>
    </text>
    
    <g transform="translate(50, 52)">
      <circle cx="30" cy="28" r="18" fill="#15803d"/>
      <path d="M22 28 L28 34 L38 22" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="30" y="46" font-family="'Inter', sans-serif" font-size="6" font-weight="900" fill="#14532d" text-anchor="middle">NOC GRANTED</text>
    </g>
  </g>
</svg>`;

// 10. Guilloche Certificate Background Pattern SVG
const guillocheSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <pattern id="guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0 20 Q10 0 20 20 T40 20 M20 0 Q30 20 20 40 T20 0" fill="none" stroke="#002147" stroke-width="0.35" opacity="0.08"/>
      <circle cx="20" cy="20" r="8" fill="none" stroke="#f97316" stroke-width="0.35" opacity="0.06"/>
      <circle cx="20" cy="20" r="14" fill="none" stroke="#0284c7" stroke-width="0.3" opacity="0.05" stroke-dasharray="2 2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#guilloche)"/>
</svg>`;

fs.writeFileSync(path.join(badgesDir, 'nic.svg'), nicSvg);
fs.writeFileSync(path.join(badgesDir, 'cert-in.svg'), certInSvg);
fs.writeFileSync(path.join(badgesDir, 'digilocker.svg'), digilockerSvg);
fs.writeFileSync(path.join(badgesDir, 'gigw.svg'), gigwSvg);
fs.writeFileSync(path.join(badgesDir, 'iso27001.svg'), isoSvg);
fs.writeFileSync(path.join(stampsDir, 'aicte-gold-seal.svg'), goldSealSvg);
fs.writeFileSync(path.join(stampsDir, 'stamp-lien-verified.svg'), redLienStampSvg);
fs.writeFileSync(path.join(stampsDir, 'stamp-bank-confirmed.svg'), blueBankStampSvg);
fs.writeFileSync(path.join(stampsDir, 'stamp-noc-released.svg'), greenNocStampSvg);
fs.writeFileSync(path.join(stampsDir, 'guilloche-pattern.svg'), guillocheSvg);

console.log('Successfully generated 10 vector SVG assets in public/assets/badges and public/assets/stamps!');

