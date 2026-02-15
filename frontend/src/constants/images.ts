// High-quality imagery for UK & Qatar student living (Unsplash)
// Use w=1920 or 2560 for HD/4K; q=90 for high quality
const U = 'https://images.unsplash.com'

export const LANDING_IMAGES = {
  logo: 'https://img.icons8.com/fluency/96/22c55e/student-male--v1.png',
  // HD hero: London cityscape (Tower Bridge / river) - high-res, full quality
  hero: `${U}/photo-1486299267070-83823f5448dd?w=1920&q=90&fit=crop`,
  heroUK: `${U}/photo-1513635269975-59663e0ac1ad?w=1920&q=90`,
  heroQatar: `${U}/photo-1586724237569-f3d0c3de59ad?w=1920&q=90`,
  studentLife: `${U}/photo-1523050854058-8df90110c9f1?w=800&q=80`,
  safeHousing: `${U}/photo-1564013799919-ab600027ffc6?w=800&q=80`,
  halalFood: `${U}/photo-1546069901-ba9599a7e63c?w=800&q=80`,
  transport: `${U}/photo-1544620347-c4fd4a3d5957?w=800&q=80`,
  gym: `${U}/photo-1534438327276-14e5300c3a48?w=800&q=80`,
  mosque: `${U}/photo-1582136572721-0f31db4f1c8f?w=800&q=80`,
  shopping: `${U}/photo-1441984904996-e0b6ba687e04?w=800&q=80`,
  london: `${U}/photo-1513635269975-59663e0ac1ad?w=800&q=80`,
  doha: `${U}/photo-1586724237569-f3d0c3de59ad?w=800&q=80`,
  university: `${U}/photo-1523050854058-8df90110c9f1?w=800&q=80`,
  mapPin: `${U}/photo-1524661135-423995f22d0b?w=800&q=80`,
} as const
