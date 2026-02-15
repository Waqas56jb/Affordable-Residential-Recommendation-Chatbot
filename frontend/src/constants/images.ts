// High-quality imagery for UK & Qatar student living (Unsplash)
// 8K-style: w=3840 (4K) / 2560 for retina; q=95 for HD; dpr=2 for sharpness
const U = 'https://images.unsplash.com'
const HD = (id: string) => `${U}/photo-${id}?w=2560&q=95&fit=crop`

// 5 auto-rotating hero wallpapers – high-res, bright (light overlay in HeroSection)
export const HERO_SLIDES = [
  HD('1486299267070-83823f5448dd'),   // 1. London cityscape
  HD('1513635269975-59663e0ac1ad'),   // 2. UK / city
  HD('1513635269975-59663e0ac1ad'),   // 3. UK / city
  HD('1486299267070-83823f5448dd'),   // 4. London
  HD('1564013799919-ab600027ffc6'),   // 5. Housing / home
] as const

// Landing images – use same working Unsplash IDs as hero where possible to avoid 404s
export const LANDING_IMAGES = {
  logo: 'https://img.icons8.com/fluency/96/22c55e/student-male--v1.png',
  hero: HERO_SLIDES[0],
  heroUK: `${U}/photo-1513635269975-59663e0ac1ad?w=1920&q=90`,
  heroQatar: `${U}/photo-1513635269975-59663e0ac1ad?w=1920&q=90`,
  studentLife: `${U}/photo-1564013799919-ab600027ffc6?w=800&q=80`,
  safeHousing: `${U}/photo-1564013799919-ab600027ffc6?w=800&q=80`,
  halalFood: `${U}/photo-1546069901-ba9599a7e63c?w=800&q=80`,
  transport: `${U}/photo-1544620347-c4fd4a3d5957?w=800&q=80`,
  gym: `${U}/photo-1534438327276-14e5300c3a48?w=800&q=80`,
  mosque: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/mosque-1867262_1280.jpg',
  shopping: `${U}/photo-1441984904996-e0b6ba687e04?w=800&q=80`,
  london: `${U}/photo-1486299267070-83823f5448dd?w=800&q=80`,
  doha: `${U}/photo-1513635269975-59663e0ac1ad?w=800&q=80`,
  university: `${U}/photo-1486299267070-83823f5448dd?w=800&q=80`,
  mapPin: `${U}/photo-1486299267070-83823f5448dd?w=800&q=80`,
} as const

