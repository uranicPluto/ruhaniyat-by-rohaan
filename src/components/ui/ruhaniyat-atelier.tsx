import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ==========================================
// MATHEMATICAL SVG ORNAMENT HELPERS
// ==========================================

function polar(r: number, a: number): [number, number] {
  return [+(r * Math.cos(a)).toFixed(2), +(r * Math.sin(a)).toFixed(2)]
}

function petalPath(r1: number, r2: number, a: number, spread = 0.3): string {
  const [x1, y1] = polar(r1, a - spread)
  const [x2, y2] = polar(r2, a)
  const [x3, y3] = polar(r1, a + spread)
  const [c1x, c1y] = polar((r1 + r2) * 0.55, a - spread * 0.4)
  const [c2x, c2y] = polar((r1 + r2) * 0.55, a + spread * 0.4)
  return `M${x1},${y1} Q${c1x},${c1y} ${x2},${y2} Q${c2x},${c2y} ${x3},${y3} Z`
}

function scallopPath(r: number, n: number, phase = 0): string {
  const pts: string[] = []
  const step = (Math.PI * 2) / n
  for (let i = 0; i < n; i++) {
    const a0 = i * step + phase
    const a1 = (i + 1) * step + phase
    const am = (a0 + a1) / 2
    const [x0, y0] = polar(r, a0)
    const [x1, y1] = polar(r, a1)
    const [xm, ym] = polar(r + r * 0.08, am)
    pts.push(`${i === 0 ? "M" : "A"}${x0},${y0} Q${xm},${ym} ${x1},${y1}`)
  }
  return pts.join(" ") + " Z"
}

function archPath(x: number, y: number, w: number, h: number, k = 1, lobes = 4): string {
  const r = w / 2
  const topY = y + r * 0.8
  const cx1 = x + r * 0.35
  const cx2 = x + w - r * 0.35
  const cy = topY

  let d = `M${x},${y + h} L${x},${topY}`
  for (let i = 0; i <= lobes; i++) {
    const t = i / lobes
    const a = Math.PI - t * (Math.PI / 2)
    const px = cx1 + (r * 0.65) * Math.cos(a) * k + (x - cx1) * (1 - k) * (1 - t)
    const py = cy - (r * 0.65) * Math.sin(a) * k + (y - cy) * (1 - k) * t
    d += ` L${px.toFixed(1)},${py.toFixed(1)}`
  }
  for (let i = 0; i <= lobes; i++) {
    const t = i / lobes
    const a = Math.PI / 2 - t * (Math.PI / 2)
    const px = cx2 + (r * 0.65) * Math.cos(a) * k + (x + w - cx2) * (1 - k) * t
    const py = cy - (r * 0.65) * Math.sin(a) * k + (y - cy) * (1 - k) * (1 - t)
    d += ` L${px.toFixed(1)},${py.toFixed(1)}`
  }
  d += ` L${x + w},${y + h} Z`
  return d
}

// Ornaments
export function Rosette({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg className={`inline-block text-[#c99e52] ${className}`} viewBox="-20 -20 40 40" width={size} height={size} aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={petalPath(4, 18, (i * Math.PI) / 4, 0.42)} fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="0.9" />
      ))}
      <circle r="3.2" fill="currentColor" />
      {Array.from({ length: 8 }, (_, i) => {
        const [x, y] = polar(11, (i * Math.PI) / 4 + Math.PI / 8)
        return <circle key={"d" + i} cx={x} cy={y} r="1" fill="currentColor" />
      })}
    </svg>
  )
}

export function Emblem({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg className={`text-[#c99e52] ${className}`} viewBox="-50 -50 100 100" width={size} height={size} aria-hidden="true">
      <path d={scallopPath(44, 24, 0)} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.2" />
      <circle r="37" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle r="33" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={petalPath(6, 28, (i * Math.PI) / 6, 0.3)} fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
      ))}
      <circle r="6" fill="currentColor" />
    </svg>
  )
}

export function Brocade({ className = "", vertical = false }: { className?: string; vertical?: boolean }) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <svg className={`w-full h-3 text-[#c99e52]/40 ${className}`} aria-hidden="true">
      <defs>
        <pattern id={`broc-${id}`} width="28" height="14" patternUnits="userSpaceOnUse" patternTransform={vertical ? "rotate(90)" : undefined}>
          <path d="M0,0.7H28M0,13.3H28" stroke="currentColor" strokeWidth="0.8" />
          <path d="M14,2.5L18.4,7L14,11.5L9.6,7Z" fill="currentColor" />
          <circle cx="0" cy="7" r="2.8" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="28" cy="7" r="2.8" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="0" cy="7" r="1" fill="currentColor" />
          <circle cx="28" cy="7" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#broc-${id})`} />
    </svg>
  )
}

export function Damask({ className = "" }: { className?: string }) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none text-[#c99e52]/10 ${className}`} aria-hidden="true">
      <defs>
        <pattern id={`damask-${id}`} width="96" height="124" patternUnits="userSpaceOnUse">
          <path d="M48,2Q66,40 94,62Q66,84 48,122Q30,84 2,62Q30,40 48,2Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <g transform="translate(48,62)">
            {Array.from({ length: 8 }, (_, i) => (
              <path key={i} d={petalPath(3, 14, (i * Math.PI) / 4, 0.4)} fill="currentColor" fillOpacity="0.45" />
            ))}
            <circle r="2" fill="currentColor" />
          </g>
          {[[0, 0], [96, 0], [0, 124], [96, 124]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#damask-${id})`} />
    </svg>
  )
}

export function Mandala({ className = "", size = 180 }: { className?: string; size?: number }) {
  return (
    <svg className={`text-[#c99e52] pointer-events-none ${className}`} viewBox="-100 -100 200 200" width={size} height={size} aria-hidden="true">
      <circle r="92" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2,3" />
      <circle r="84" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle r="68" fill="none" stroke="currentColor" strokeWidth="0.5" />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={petalPath(30, 80, (i * Math.PI) / 8, 0.22)} fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="0.6" />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <path key={"in" + i} d={petalPath(15, 50, (i * Math.PI) / 8 + Math.PI / 16, 0.28)} fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.7" />
      ))}
      <circle r="14" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
      <circle r="4" fill="currentColor" />
    </svg>
  )
}

export function Filigree({ corner = "tl", className = "" }: { corner?: "tl" | "tr" | "bl" | "br"; className?: string }) {
  const transform =
    corner === "tr" ? "scale(-1, 1)" :
    corner === "bl" ? "scale(1, -1)" :
    corner === "br" ? "scale(-1, -1)" : undefined

  return (
    <svg className={`w-28 h-28 text-[#c99e52]/60 pointer-events-none ${className}`} viewBox="0 0 120 120" aria-hidden="true" style={{ transform }}>
      <path d="M0,8 Q50,8 60,35 T100,50" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8,0 Q8,50 35,60 T50,100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M0,20 Q35,20 40,40" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path d="M20,0 Q20,35 40,40" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="60" cy="35" r="2.5" fill="currentColor" />
      <circle cx="35" cy="60" r="2.5" fill="currentColor" />
      <circle cx="100" cy="50" r="3" fill="currentColor" />
      <circle cx="50" cy="100" r="3" fill="currentColor" />
    </svg>
  )
}

export function Flourish({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-4 text-[#c99e52] ${className}`} aria-hidden="true">
      <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-[#c99e52]" />
      <Rosette size={14} />
      <div className="w-1.5 h-1.5 rotate-45 bg-[#c99e52]" />
      <Rosette size={14} />
      <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-[#c99e52]" />
    </div>
  )
}

// ==========================================
// DATA STRUCTURES
// ==========================================

const CRAFTSMANSHIP_TECHNIQUES = [
  {
    id: "zardozi",
    name: "ZARDOZI",
    tagline: "The Grandeur of Metallic Embroidery.",
    description: "An intricate embroidery tradition celebrated for its richness and dimensional detailing, bringing depth and elegance to couture surfaces. Originating in Persia and perfected across Mughal royal courts, real metallic wires, coils (dabka, kora) and sequins are hand-stitched over plush velvets and rich silks.",
    features: ["Metallic Dabka & Kora Coils", "Three-Dimensional Relief", "Royal Regal Surfaces"],
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "aari",
    name: "AARI",
    tagline: "The Art of Intricate Needlework.",
    description: "A traditional technique known for its flowing patterns, delicate detailing and remarkable versatility across embroidered textiles. Crafted using a specialised awl-like hook needle (Aari), artisans construct continuous chain stitches that curve fluidly around flora, paisleys and architectural borders.",
    features: ["Micro Chain-Stitch Detailing", "Graceful Arabesque Flourishes", "Delicate Fine Needlework"],
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "resham",
    name: "RESHAM",
    tagline: "The Beauty of Silk Threads.",
    description: "Silk-thread embroidery that introduces texture, colour and expressive detail through carefully crafted motifs. Untwisted mulberry silk floss creates luminous satin gradations, allowing shades to melt into one another with feather-like subtlety across bridal lehengas and evening gowns.",
    features: ["Pure Mulberry Silk Floss", "Luminous Ombré Gradations", "Soft Tactile Elegance"],
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mukaish",
    name: "MUKAISH",
    tagline: "A Subtle Play of Light.",
    description: "A traditional embellishment technique that introduces delicate metallic accents and understated luminosity to fabric surfaces. Fine flattened silver or gold metallic wire (baadla) is pierced directly into sheer gossamer silks, twisting into sparkling starburst dots (fardi) that shimmer gently with every movement.",
    features: ["Fine Metallic Baadla Wire", "Starlit Fardi Dot Embellishment", "Subtle Ethereal Shimmer"],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gotapatti",
    name: "GOTA PATTI",
    tagline: "A Heritage of Ornamentation.",
    description: "An expressive decorative technique using metallic ribbon and appliqué work to create distinctive traditional patterns. Pure gold and silver zari ribbons are cut into petal, leaf, and geometric shapes, folded and hand-hemmed with fine chain stitch onto rich georgettes, bandhej and silks.",
    features: ["Cut Metallic Zari Appliqué", "Rajasthani Heritage Motifs", "Geometric Floral Symphony"],
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80"
  }
]

const COUTURE_COLLECTIONS = [
  {
    id: "bridal-couture",
    number: "01",
    title: "Bridal Couture",
    tagline: "For Moments That Become Memories.",
    description: "An exploration of occasion dressing through expressive silhouettes, intricate detailing and the richness of Indian craftsmanship. Every bespoke bridal ensemble is sculpted over hundreds of artisan hours, weaving personal family heirlooms into eternal bridal poetry.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85",
    tag: "Bespoke Bridal"
  },
  {
    id: "designer-lehengas",
    number: "02",
    title: "Designer Lehengas",
    tagline: "Tradition, Reimagined.",
    description: "Statement silhouettes that celebrate the elegance of Indian fashion through thoughtful design and intricate surface ornamentation. Featuring sweeping flared volumes, structured corsetry, and hand-embroidered panels that bridge historic grandeur and modern poise.",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=900&q=80",
    tag: "Signature Flairs"
  },
  {
    id: "contemporary-gowns",
    number: "03",
    title: "Contemporary Gowns",
    tagline: "Modern Elegance. Timeless Expression.",
    description: "Contemporary forms brought to life through refined detailing, graceful silhouettes and an appreciation for artistic craftsmanship. Draped red-carpet contours meet handcrafted Indian embellishments for global soirees and galas.",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
    tag: "Global Soiree"
  },
  {
    id: "occasion-wear",
    number: "04",
    title: "Occasion Wear",
    tagline: "Made for Moments Worth Remembering.",
    description: "Distinctive creations designed to celebrate individuality, elegance and the beauty of life's special occasions. Thoughtful cocktail ensembles, shararas, and cape sets infused with handcrafted finesse.",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
    tag: "Celebration Wear"
  }
]

const ATELIER_SERVICES = [
  {
    number: "01",
    title: "Embroidery Sampling",
    description: "Developing embroidery samples that translate creative concepts into detailed textile expressions.",
    icon: "✦"
  },
  {
    number: "02",
    title: "Embroidery Panels",
    description: "Creating intricate embroidered panels designed to complement garments, collections and couture applications.",
    icon: "◈"
  },
  {
    number: "03",
    title: "Surface Ornamentation",
    description: "Specialised decorative techniques combining traditional embroidery and contemporary embellishment.",
    icon: "❖"
  },
  {
    number: "04",
    title: "MOQ & Bulk Production",
    description: "Supporting fashion businesses with embroidery production requirements and scalable project execution.",
    icon: "❋"
  },
  {
    number: "05",
    title: "Made-to-Order Garments",
    description: "Developing customised garments including lehengas, gowns, occasionwear and other couture creations.",
    icon: "❊"
  },
  {
    number: "06",
    title: "Couture Development",
    description: "Collaborating on garment detailing, embroidery concepts and creative development for distinctive fashion projects.",
    icon: "✧"
  }
]

const CREATIVE_PROCESS_STEPS = [
  {
    number: "01",
    title: "DISCOVER",
    subtitle: "Understanding Creative Vision",
    description: "Understanding the creative vision, design requirements, references, moods, textile selection, and project objectives."
  },
  {
    number: "02",
    title: "DEVELOP",
    subtitle: "Motif & Technique Exploration",
    description: "Exploring embroidery concepts, historic and modern motifs, surface techniques and limitless design possibilities."
  },
  {
    number: "03",
    title: "SAMPLE",
    subtitle: "Translating to Tactile Swatches",
    description: "Translating ideas into physical embroidery samples, checking tension, metallic wire luster, and refining the details."
  },
  {
    number: "04",
    title: "CREATE",
    subtitle: "Master Artisan Execution",
    description: "Bringing the approved design to life through skilled craftsmanship, meticulous artisan hands, and considered execution."
  },
  {
    number: "05",
    title: "DELIVER",
    subtitle: "Flawless Completion",
    description: "Completing the project with absolute attention to detailing, rigorous quality inspection, and agreed production requirements."
  }
]

const LOOKBOOK_ITEMS = [
  {
    title: "Regal Heirloom Bridal",
    category: "Bridal",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    detail: "Zardozi & Dabka on Raw Silk"
  },
  {
    title: "The Royal Court Lehenga",
    category: "Couture",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    detail: "Aari Lattice & Gota Patti Floral Crests"
  },
  {
    title: "Gold Thread Atelier Panel",
    category: "Atelier",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    detail: "Dimensional Metallic Wire & Pearl Studding"
  },
  {
    title: "Modern Couture Silhouette",
    category: "Couture",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    detail: "Sculpted Bodice with Mukaish Shimmer"
  },
  {
    title: "Festive Embroidered Ensemble",
    category: "Occasion",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
    detail: "Resham Silk Flora on Organza"
  },
  {
    title: "Master Artisan at Frame",
    category: "Atelier",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    detail: "Traditional Wooden Adda Embroidery Craft"
  }
]

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function RuhaniyatAtelier() {
  const [activeTechnique, setActiveTechnique] = React.useState(0)
  const [activeLookbookCategory, setActiveLookbookCategory] = React.useState("All")
  const [lightboxImage, setLightboxImage] = React.useState<{ title: string; image: string; detail: string } | null>(null)
  const [isPlayingFilm, setIsPlayingFilm] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Form State
  const [formState, setFormState] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    enquiryType: "Couture Enquiry",
    projectDetails: ""
  })
  const [formSubmitted, setFormSubmitted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFormSubmitted(true)
      setTimeout(() => setFormSubmitted(false), 7000)
    }, 600)
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  const filteredLookbook = activeLookbookCategory === "All"
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter(item => item.category === activeLookbookCategory)

  return (
    <div className="relative w-full bg-[#16070a] text-[#f5eedf] font-serif overflow-x-hidden selection:bg-[#c99e52] selection:text-[#16070a]">
      {/* ========================================================
          ANNOUNCEMENT STRIP
          ======================================================== */}
      <aside aria-label="Announcement marquee" className="relative z-40 bg-[#240c12] border-b border-[#c99e52]/30 py-2.5 overflow-hidden text-xs tracking-[0.2em] uppercase text-[#e8d5b5]">
        <div className="flex items-center space-x-8 whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center space-x-6">
              <span className="flex items-center gap-2">
                <Rosette size={12} /> RUHANIYAT BY ROHAAN
              </span>
              <span className="text-[#c99e52]">✦</span>
              <span>THE ART OF INDIAN COUTURE & CRAFTSMANSHIP</span>
              <span className="text-[#c99e52]">✦</span>
              <span>HANDCRAFTED ARTISTRY · CONTEMPORARY DESIGN</span>
              <span className="text-[#c99e52]">✦</span>
              <span>BESPOKE BRIDAL APPOINTMENTS & ATELIER COLLABORATIONS</span>
              <span className="text-[#c99e52]">✦</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ========================================================
          BRAND BAND & HEADER
          ======================================================== */}
      <header className="relative bg-[#1c090e] border-b border-[#c99e52]/25 px-4 md:px-12 py-6">
        <Damask className="opacity-25" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="hidden lg:flex items-center gap-4 text-left">
            <Emblem size={44} />
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#c99e52] font-sans font-medium">BORN IN 2019</p>
              <p className="text-sm tracking-wider text-[#d9c4a5] italic">Mumbai, Maharashtra, India</p>
            </div>
          </div>

          <div className="text-center group cursor-pointer" onClick={() => scrollTo("hero")}>
            <p className="text-[11px] md:text-xs tracking-[0.45em] text-[#c99e52] uppercase font-sans font-medium mb-1">
              THE HOUSE OF
            </p>
            <h1 className="text-3xl md:text-5xl font-normal tracking-[0.18em] text-[#f7f0e3] font-['Cinzel'] drop-shadow-sm">
              RUHANIYAT
            </h1>
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-[#c99e52] mt-1 font-['Cinzel'] font-light">
              BY ROHAAN
            </p>
            <p className="text-[11px] md:text-xs tracking-wider text-[#cbb698] italic mt-1 max-w-md mx-auto hidden sm:block">
              The Art of Indian Couture & Craftsmanship
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollTo("contact")}
              className="px-5 py-2 rounded-full border border-[#c99e52] text-[#f7f0e3] text-xs uppercase tracking-[0.2em] font-sans hover:bg-[#c99e52] hover:text-[#180a0e] transition-all duration-300 shadow-lg cursor-pointer"
            >
              Enquire Atelier
            </button>
            <a
              href="https://wa.me/919967012423"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a1319] border border-[#c99e52]/40 text-[#c99e52] text-xs uppercase tracking-wider font-sans hover:border-[#c99e52] transition-colors"
            >
              <span>WhatsApp</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================
          STICKY BROCADE NAVIGATION
          ======================================================== */}
      <nav className="sticky top-0 z-40 bg-[#19070c]/95 backdrop-blur-md border-y border-[#c99e52]/30 shadow-2xl">
        <Brocade className="opacity-40" />
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-3">
          <div className="lg:hidden text-xs uppercase tracking-widest font-['Cinzel'] text-[#c99e52]">
            RUHANIYAT BY ROHAAN
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#c99e52] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className={`lg:flex items-center justify-center space-x-1 md:space-x-8 w-full text-xs uppercase tracking-[0.2em] font-sans font-light ${mobileMenuOpen ? "flex flex-col py-4 space-y-4 space-x-0 bg-[#16070a] border-t border-[#c99e52]/30" : "hidden"}`}>
            {[
              { label: "The House", id: "about" },
              { label: "Philosophy", id: "philosophy" },
              { label: "Couture Collections", id: "collections" },
              { label: "Craftsmanship", id: "craftsmanship" },
              { label: "Atelier", id: "atelier" },
              { label: "Creative Process", id: "process" },
              { label: "The Designer", id: "designer" },
              { label: "Editorial", id: "editorial" },
              { label: "Film", id: "film" },
              { label: "Contact", id: "contact" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-[#d8c3a3] hover:text-[#c99e52] transition-colors py-1 relative group cursor-pointer"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#c99e52] transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </button>
            ))}
          </div>
        </div>
        <Brocade className="opacity-40" />
      </nav>

      {/* ========================================================
          SECTION 01 — HERO
          ======================================================== */}
      <section id="hero" className="relative min-h-[92vh] flex items-center justify-center py-16 px-4 md:px-12 border-b border-[#c99e52]/30 overflow-hidden">
        <Damask className="opacity-20" />
        <Mandala className="absolute -left-24 top-1/4 opacity-15 rotate-45" size={420} />
        <Mandala className="absolute -right-24 bottom-10 opacity-15 -rotate-12" size={420} />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Panel */}
          <div className="lg:col-span-6 relative p-6 md:p-12 rounded-2xl bg-[#220a11]/80 border border-[#c99e52]/40 backdrop-blur-md shadow-2xl">
            <Filigree corner="tl" className="absolute top-2 left-2" />
            <Filigree corner="br" className="absolute bottom-2 right-2" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#140508] border border-[#c99e52]/40 text-[#c99e52] text-[10px] md:text-xs tracking-[0.25em] uppercase font-sans mb-6">
              <Rosette size={10} /> INDIAN COUTURE · HANDCRAFTED ARTISTRY · CONTEMPORARY DESIGN
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal font-['Cinzel'] tracking-wider text-[#f7f0e3] leading-[1.08] mb-4">
              RUHANIYAT <br />
              <span className="italic font-serif text-[#c99e52] text-3xl sm:text-4xl md:text-5xl">BY ROHAAN</span>
            </h1>

            <p className="text-xl md:text-2xl font-normal text-[#e4cead] tracking-wide mb-4 font-['Cinzel']">
              The Art of Indian Couture & Craftsmanship.
            </p>

            <p className="text-sm md:text-base text-[#d9c4a5] leading-relaxed mb-6 font-light max-w-xl">
              An expression of heritage, artistry and contemporary design. Rooted in tradition. Reimagined through a contemporary lens. Every creation reflects a passion for individuality, intricate craftsmanship and timeless elegance.
            </p>

            <Flourish className="my-6" />

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollTo("about")}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#9e7631] via-[#c99e52] to-[#a37932] text-[#140508] font-sans font-semibold text-xs uppercase tracking-[0.22em] hover:shadow-[0_0_25px_rgba(201,158,82,0.4)] transition-all duration-300 cursor-pointer"
              >
                EXPLORE THE HOUSE
              </button>
              <button
                onClick={() => scrollTo("craftsmanship")}
                className="px-7 py-3.5 rounded-full border border-[#c99e52] text-[#f7f0e3] font-sans font-medium text-xs uppercase tracking-[0.22em] hover:bg-[#c99e52]/15 transition-all duration-300 cursor-pointer"
              >
                DISCOVER OUR CRAFT
              </button>
            </div>
          </div>

          {/* Right Panel: Mughal Jharokha Arch Window */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-t-[120px] p-3 border-2 border-[#c99e52]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-gradient-to-b from-[#311119] via-[#1f0b10] to-[#120508]">
              {/* Cusped Arch Accent */}
              <div className="relative w-full h-full rounded-t-[110px] overflow-hidden border border-[#c99e52]/40 group">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85"
                  alt="Ruhaniyat By Rohaan Bespoke Indian Bridal Couture"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16060a] via-transparent to-black/20" />

                {/* Rotating Gilded Seal */}
                <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-[#c99e52]/60 bg-[#16070a]/90 backdrop-blur-md flex items-center justify-center p-2 text-center text-[#c99e52] shadow-xl animate-spin-slow">
                  <p className="text-[7.5px] uppercase tracking-widest font-sans font-bold leading-tight">
                    MUMBAI · ATELIER · 2026 · RUHANIYAT ·
                  </p>
                </div>

                {/* Photo Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#1d080e]/90 border border-[#c99e52]/50 backdrop-blur-md">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#c99e52] font-sans">
                    HAUTE COUTURE · NEW SEASON
                  </p>
                  <h3 className="text-xl font-['Cinzel'] text-[#f7f0e3] mt-1">
                    Heirloom Zardozi & Resham
                  </h3>
                  <button
                    onClick={() => scrollTo("contact")}
                    className="mt-3 inline-flex items-center gap-2 text-xs text-[#c99e52] tracking-widest uppercase hover:underline cursor-pointer"
                  >
                    <span>BOOK AN APPOINTMENT</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 02 — INTRODUCTION: THE HOUSE OF RUHANIYAT
          ======================================================== */}
      <section id="about" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#1b080d]">
        <Damask className="opacity-15" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Emblem size={56} className="mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
            THE HOUSE OF RUHANIYAT
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-3">
            Fashion That Speaks Beyond Words.
          </h2>

          <p className="text-xl md:text-2xl italic text-[#c99e52] font-serif max-w-2xl mx-auto mb-8 font-light">
            “Some creations are made to be worn. Others are made to be remembered.”
          </p>

          <Flourish className="mb-8" />

          <div className="space-y-6 text-base md:text-lg text-[#d8c3a3] leading-relaxed max-w-3xl mx-auto font-light text-justify sm:text-center">
            <p>
              Born in 2019, Ruhaniyat emerged from a passion for soulful design, individuality and the enduring beauty of Indian craftsmanship.
            </p>
            <p>
              Today, the house returns with a renewed creative vision, bringing together contemporary couture and traditional embroidery through thoughtfully designed garments and dedicated atelier craftsmanship.
            </p>
            <p className="text-[#f0e3cf] font-normal">
              Every silhouette, every motif and every intricate detail reflects an appreciation for the artistry that makes Indian fashion extraordinary.
            </p>
          </div>

          <div className="mt-10">
            <button
              onClick={() => scrollTo("philosophy")}
              className="px-8 py-3.5 rounded-full border border-[#c99e52] text-[#f7f0e3] font-sans text-xs uppercase tracking-[0.22em] hover:bg-[#c99e52] hover:text-[#180a0e] transition-all duration-300 cursor-pointer shadow-lg"
            >
              DISCOVER OUR STORY
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 03 — BRAND PHILOSOPHY: OUR PHILOSOPHY
          ======================================================== */}
      <section id="philosophy" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#16060a]">
        <Damask className="opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
              OUR PHILOSOPHY
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
              Rooted in Heritage. Created for Today.
            </h2>
            <Flourish />
            <p className="text-base md:text-lg text-[#d8c3a3] leading-relaxed font-light">
              At Ruhaniyat, we believe that true luxury lives in the details. It is found in the precision of a handcrafted motif, the richness of a carefully selected textile and the individuality of a thoughtfully imagined silhouette.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                number: "I",
                title: "Precision of the Motif",
                body: "Our creative approach draws inspiration from India's rich cultural heritage while embracing the possibilities of contemporary design."
              },
              {
                number: "II",
                title: "Textile Richness",
                body: "Pure silks, diaphanous organzas, and regal velvets are curated with reverence to drape the human form with grace and timeless majesty."
              },
              {
                number: "III",
                title: "Tradition & Innovation",
                body: "We celebrate the harmony between tradition and innovation, where craftsmanship becomes an expression of identity and every creation carries its own character."
              }
            ].map((pillar, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl bg-[#220a11]/60 border border-[#c99e52]/30 hover:border-[#c99e52] transition-all duration-300 group shadow-xl"
              >
                <Filigree corner="tl" className="absolute top-2 left-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="text-2xl font-['Cinzel'] text-[#c99e52]/40 group-hover:text-[#c99e52] transition-colors">
                  {pillar.number}
                </span>
                <h3 className="text-xl font-['Cinzel'] text-[#f7f0e3] mt-3 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#d4bf9f] leading-relaxed font-light">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 04 — COUTURE COLLECTIONS
          ======================================================== */}
      <section id="collections" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#1c080e]">
        <Damask className="opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
              THE RUHANIYAT COLLECTIONS
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
              An Expression of Individuality.
            </h2>
            <Flourish />
            <p className="text-base md:text-lg text-[#d8c3a3] leading-relaxed font-light">
              A celebration of form, texture and artistry. Discover creations that bring together traditional Indian aesthetics and contemporary couture sensibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {COUTURE_COLLECTIONS.map((item) => (
              <article
                key={item.id}
                className="group relative rounded-2xl bg-[#230b12] border border-[#c99e52]/40 overflow-hidden shadow-2xl flex flex-col justify-between hover:border-[#c99e52] transition-all duration-500"
              >
                <div>
                  {/* Arched Image Header */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#230b12] via-transparent to-black/20" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#18060a]/90 border border-[#c99e52]/50 text-[10px] uppercase tracking-widest text-[#c99e52] font-sans">
                      {item.tag}
                    </span>
                    <span className="absolute top-4 right-4 text-xs font-['Cinzel'] text-[#c99e52]/80 font-bold">
                      {item.number}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-['Cinzel'] text-[#f7f0e3] mb-1 group-hover:text-[#c99e52] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs uppercase tracking-wider text-[#c99e52] mb-3 italic">
                      {item.tagline}
                    </p>
                    <p className="text-xs text-[#d4bf9f] leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      setFormState(prev => ({ ...prev, enquiryType: `Couture: ${item.title}` }))
                      scrollTo("contact")
                    }}
                    className="w-full py-2.5 rounded-full border border-[#c99e52]/60 text-[#e6d3b4] text-xs uppercase tracking-widest font-sans group-hover:bg-[#c99e52] group-hover:text-[#180a0e] transition-all duration-300 cursor-pointer"
                  >
                    Enquire Collection
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => scrollTo("contact")}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#a37932] via-[#c99e52] to-[#a37932] text-[#140508] font-sans font-semibold text-xs uppercase tracking-[0.22em] hover:shadow-[0_0_20px_rgba(201,158,82,0.4)] transition-all cursor-pointer"
            >
              EXPLORE THE COUTURE
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 05 — CRAFTSMANSHIP: THE ART OF HAND EMBROIDERY
          ======================================================== */}
      <section id="craftsmanship" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#16060a]">
        <Damask className="opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
              THE ART OF HAND EMBROIDERY
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
              Every Thread Holds a Story.
            </h2>
            <Flourish />
            <p className="text-base md:text-lg text-[#d8c3a3] leading-relaxed font-light">
              Craftsmanship is not simply a finishing touch. It is the soul of a creation. Inspired by India's rich textile heritage, our approach to surface ornamentation celebrates the patience, precision and artistry of traditional hand embroidery.
            </p>
          </div>

          {/* Interactive Technique Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {CRAFTSMANSHIP_TECHNIQUES.map((tech, index) => (
              <button
                key={tech.id}
                onClick={() => setActiveTechnique(index)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] font-sans transition-all duration-300 cursor-pointer ${
                  activeTechnique === index
                    ? "bg-[#c99e52] text-[#16060a] font-semibold shadow-[0_0_15px_rgba(201,158,82,0.4)]"
                    : "bg-[#250c13] text-[#d6c2a4] border border-[#c99e52]/30 hover:border-[#c99e52]"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>

          {/* Active Technique Showcase Card */}
          {(() => {
            const current = CRAFTSMANSHIP_TECHNIQUES[activeTechnique]
            return (
              <div className="p-8 md:p-12 rounded-3xl bg-[#240b12] border border-[#c99e52]/50 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#c99e52] font-sans mb-3">
                    <Rosette size={14} /> TRADITIONAL TECHNIQUE 0{activeTechnique + 1}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-['Cinzel'] text-[#f7f0e3] mb-2">
                    {current.name}
                  </h3>
                  <p className="text-base text-[#c99e52] italic mb-6">
                    {current.tagline}
                  </p>
                  <p className="text-sm md:text-base text-[#d8c3a3] leading-relaxed font-light mb-6">
                    {current.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {current.features.map((feat, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-full bg-[#16060a] border border-[#c99e52]/30 text-xs text-[#d9c4a5] font-sans">
                        ✦ {feat}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setFormState(prev => ({ ...prev, enquiryType: `Craftsmanship: ${current.name}` }))
                      scrollTo("contact")
                    }}
                    className="px-7 py-3 rounded-full border border-[#c99e52] text-[#f7f0e3] text-xs uppercase tracking-[0.2em] font-sans hover:bg-[#c99e52] hover:text-[#180a0e] transition-colors cursor-pointer"
                  >
                    Enquire This Technique
                  </button>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#c99e52]/50 shadow-xl">
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 text-xs font-['Cinzel'] tracking-wider text-[#e6d3b4]">
                      Atelier Swatch Archive
                    </span>
                  </div>
                </div>
              </div>
            )
          })()}

          <div className="text-center mt-12">
            <button
              onClick={() => scrollTo("atelier")}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#a37932] via-[#c99e52] to-[#a37932] text-[#140508] font-sans font-semibold text-xs uppercase tracking-[0.22em] hover:shadow-[0_0_20px_rgba(201,158,82,0.4)] transition-all cursor-pointer"
            >
              EXPLORE OUR CRAFTSMANSHIP
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 06 — ATELIER BY RUHANIYAT
          ======================================================== */}
      <section id="atelier" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#1c080e]">
        <Damask className="opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
              ATELIER BY RUHANIYAT
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
              Where Craftsmanship Meets Creative Precision.
            </h2>
            <Flourish />
            <p className="text-base md:text-lg text-[#d8c3a3] leading-relaxed font-light">
              An atelier dedicated to the art of embroidery, surface ornamentation and couture development. Working with fashion designers, boutique houses, creative studios and fashion businesses, Atelier by Ruhaniyat brings traditional Indian craftsmanship into contemporary fashion production.
            </p>
            <p className="text-sm text-[#e4cead] mt-4 italic">
              From a single embroidery sample to detailed panels and larger production requirements, we approach every project with attention to detail, technical precision and respect for the craft.
            </p>
          </div>

          {/* 6 Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {ATELIER_SERVICES.map((srv) => (
              <div
                key={srv.number}
                className="p-8 rounded-2xl bg-[#230b12] border border-[#c99e52]/30 hover:border-[#c99e52] transition-all duration-300 group shadow-xl relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl text-[#c99e52]">{srv.icon}</span>
                  <span className="text-xs font-['Cinzel'] text-[#c99e52]/60 group-hover:text-[#c99e52] font-bold">
                    {srv.number}
                  </span>
                </div>
                <h3 className="text-xl font-['Cinzel'] text-[#f7f0e3] mb-2 group-hover:text-[#c99e52] transition-colors">
                  {srv.title}
                </h3>
                <p className="text-sm text-[#d4bf9f] leading-relaxed font-light">
                  {srv.description}
                </p>
              </div>
            ))}
          </div>

          {/* Collaborations Box */}
          <div className="p-8 md:p-10 rounded-2xl bg-[#2b0e16]/80 border border-[#c99e52]/50 text-center relative overflow-hidden">
            <Filigree corner="tl" className="absolute top-2 left-2" />
            <Filigree corner="br" className="absolute bottom-2 right-2" />

            <p className="text-xs uppercase tracking-[0.3em] text-[#c99e52] font-sans font-medium mb-3">
              OUR COLLABORATIONS
            </p>
            <h3 className="text-2xl font-['Cinzel'] text-[#f7f0e3] mb-4">
              We Welcome Enquiries From Global Creative Leaders
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto my-6">
              {[
                "Independent Fashion Designers",
                "Luxury Fashion Labels",
                "Bridal Boutiques",
                "Couture Houses",
                "Fashion Studios",
                "International Sourcing Teams"
              ].map((client, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full bg-[#18060a] border border-[#c99e52]/40 text-xs font-sans text-[#e4cead] tracking-wide"
                >
                  ✦ {client}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <button
                onClick={() => {
                  setFormState(prev => ({ ...prev, enquiryType: "Atelier Collaboration" }))
                  scrollTo("contact")
                }}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#a37932] via-[#c99e52] to-[#a37932] text-[#140508] font-sans font-semibold text-xs uppercase tracking-[0.22em] hover:shadow-[0_0_20px_rgba(201,158,82,0.4)] transition-all cursor-pointer"
              >
                DISCUSS YOUR PROJECT
              </button>
              <button
                onClick={() => {
                  setFormState(prev => ({ ...prev, enquiryType: "Embroidery Sampling" }))
                  scrollTo("contact")
                }}
                className="px-8 py-3.5 rounded-full border border-[#c99e52] text-[#f7f0e3] font-sans text-xs uppercase tracking-[0.22em] hover:bg-[#c99e52]/20 transition-all cursor-pointer"
              >
                ENQUIRE ABOUT ATELIER SERVICES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 07 — OUR CREATIVE PROCESS
          ======================================================== */}
      <section id="process" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#16060a]">
        <Damask className="opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
              OUR CREATIVE PROCESS
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
              From Concept to Craft.
            </h2>
            <Flourish />
            <p className="text-base md:text-lg text-[#d8c3a3] leading-relaxed font-light">
              Every Creation Begins With an Idea. Our approach brings together creative exploration, technical development and detailed craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {CREATIVE_PROCESS_STEPS.map((step) => (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-[#220a11]/80 border border-[#c99e52]/30 hover:border-[#c99e52] transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-['Cinzel'] text-[#c99e52] font-bold block mb-2">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-['Cinzel'] text-[#f7f0e3] tracking-wider mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] uppercase tracking-wider text-[#c99e52] mb-3 italic">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-[#d4bf9f] leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#c99e52]/20 flex items-center gap-1.5 text-[10px] text-[#c99e52]/70 font-sans uppercase">
                  <span>Phase {step.number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 08 — THE DESIGNER: ROHAAN SHEIKH
          ======================================================== */}
      <section id="designer" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#1e090f]">
        <Damask className="opacity-15" />
        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#c99e52]/60 p-2 bg-[#2d0f17] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Rohaan Sheikh Creative Director Ruhaniyat"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b080d] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-[#c99e52] font-sans font-medium">CREATIVE DIRECTOR</p>
                <h4 className="text-2xl font-['Cinzel'] text-[#f7f0e3]">Rohaan Sheikh</h4>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#140508] border border-[#c99e52]/40 text-[#c99e52] text-xs tracking-widest uppercase font-sans mb-4">
              <Rosette size={12} /> THE CREATIVE VISION
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
              A Vision by Rohaan Sheikh.
            </h2>
            <Flourish className="justify-start mb-6" />

            <div className="space-y-4 text-base text-[#d8c3a3] leading-relaxed font-light">
              <p>
                At the heart of Ruhaniyat is a creative vision shaped by a deep appreciation for fashion, Indian heritage and the art of craftsmanship.
              </p>
              <p>
                Rohaan Sheikh brings together traditional influences and contemporary design sensibilities, exploring the relationship between intricate detailing, artistic expression and modern couture.
              </p>
              <p>
                His approach celebrates the people, techniques and creative processes behind every creation.
              </p>
              <p className="text-[#f2e6d5] font-normal">
                Through Ruhaniyat and its dedicated atelier, this vision continues to evolve — bringing craftsmanship and contemporary fashion together through meaningful creative collaborations.
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  setFormState(prev => ({ ...prev, enquiryType: "Creative Consultation with Rohaan Sheikh" }))
                  scrollTo("contact")
                }}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#a37932] via-[#c99e52] to-[#a37932] text-[#140508] font-sans font-semibold text-xs uppercase tracking-[0.22em] hover:shadow-[0_0_20px_rgba(201,158,82,0.4)] transition-all cursor-pointer"
              >
                CONNECT WITH THE DESIGNER
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 09 — EDITORIAL / LOOKBOOK
          ======================================================== */}
      <section id="editorial" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#16060a]">
        <Damask className="opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
              THE RUHANIYAT EDIT
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
              Stories Told Through Style.
            </h2>
            <Flourish />
            <p className="text-base md:text-lg text-[#d8c3a3] leading-relaxed font-light">
              A visual journey through our creative world. Discover the silhouettes, textures, intricate details and artistic expressions that define the Ruhaniyat aesthetic. From statement couture to the delicate beauty of embroidery, every frame offers a closer look at our creative perspective.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {["All", "Bridal", "Couture", "Atelier", "Occasion"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveLookbookCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-sans transition-colors cursor-pointer ${
                  activeLookbookCategory === cat
                    ? "bg-[#c99e52] text-[#180a0e] font-semibold"
                    : "bg-[#250c13] text-[#d8c3a3] border border-[#c99e52]/30 hover:border-[#c99e52]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lookbook Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLookbook.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(item)}
                className="group relative rounded-2xl overflow-hidden bg-[#240b12] border border-[#c99e52]/40 aspect-[3/4] cursor-pointer shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140407] via-transparent to-black/30 group-hover:from-[#140407]/90 transition-all duration-300" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#c99e52] font-sans">
                    {item.category}
                  </span>
                  <h4 className="text-xl font-['Cinzel'] text-[#f7f0e3] mt-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#d4bf9f] mt-1 italic">
                    {item.detail}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#c99e52] mt-3 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Detail</span> <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => scrollTo("contact")}
              className="px-8 py-3.5 rounded-full border border-[#c99e52] text-[#f7f0e3] font-sans text-xs uppercase tracking-[0.22em] hover:bg-[#c99e52] hover:text-[#180a0e] transition-all cursor-pointer shadow-lg"
            >
              EXPLORE THE EDITORIAL
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10 — CRAFTSMANSHIP FILM
          ======================================================== */}
      <section id="film" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#1c080e]">
        <Damask className="opacity-15" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
            BEHIND EVERY CREATION
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
            The Hands. The Art. The Details.
          </h2>
          <Flourish />
          <p className="text-base md:text-lg text-[#d8c3a3] leading-relaxed max-w-2xl mx-auto mb-10 font-light">
            Beyond the finished silhouette lies a world of patience, precision and creativity. Discover the intricate process behind traditional embroidery and the craftsmanship that brings every detail to life.
          </p>

          {/* Cinematic Frame */}
          <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-[#c99e52]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-black/80 max-w-4xl mx-auto group">
            <img
              src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80"
              alt="Artisan Hands Embroidery Film Ruhaniyat"
              className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <button
                onClick={() => setIsPlayingFilm(true)}
                className="w-20 h-20 rounded-full bg-[#c99e52]/90 hover:bg-[#c99e52] text-[#140508] flex items-center justify-center shadow-[0_0_30px_rgba(201,158,82,0.6)] hover:scale-110 transition-all duration-300 cursor-pointer"
                aria-label="Play Craftsmanship Film"
              >
                <svg className="w-8 h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <p className="mt-4 text-xs font-['Cinzel'] uppercase tracking-[0.3em] text-[#f7f0e3]">
                Watch Craftsmanship Documentary
              </p>
              <span className="text-[10px] text-[#c99e52] tracking-widest uppercase">
                4K Ultra HD · Atelier Symphony
              </span>
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={() => scrollTo("atelier")}
              className="px-8 py-3.5 rounded-full border border-[#c99e52] text-[#f7f0e3] font-sans text-xs uppercase tracking-[0.22em] hover:bg-[#c99e52] hover:text-[#180a0e] transition-all cursor-pointer"
            >
              EXPERIENCE THE ATELIER
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 11 — COLLABORATION
          ======================================================== */}
      <section id="collaboration" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#16060a]">
        <Damask className="opacity-15" />
        <div className="max-w-5xl mx-auto text-center relative z-10 p-8 md:p-14 rounded-3xl bg-[#250c13] border border-[#c99e52]/50 shadow-2xl">
          <Filigree corner="tl" className="absolute top-2 left-2" />
          <Filigree corner="tr" className="absolute top-2 right-2" />
          <Filigree corner="bl" className="absolute bottom-2 left-2" />
          <Filigree corner="br" className="absolute bottom-2 right-2" />

          <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
            FOR DESIGNERS & FASHION HOUSES
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
            Let's Create Something Extraordinary.
          </h2>
          <Flourish />
          <p className="text-base md:text-lg text-[#d8c3a3] leading-relaxed max-w-2xl mx-auto mb-8 font-light">
            Looking for intricate hand embroidery, customised panels or a dedicated atelier partner for your next collection? Atelier by Ruhaniyat welcomes creative collaborations with designers, boutique houses, fashion labels and sourcing professionals.
          </p>
          <p className="text-sm text-[#e4cead] max-w-xl mx-auto italic mb-10">
            Whether you are developing a single sample or planning a larger production requirement, we would love to understand your vision.
          </p>

          <button
            onClick={() => {
              setFormState(prev => ({ ...prev, enquiryType: "Atelier Collaboration" }))
              scrollTo("contact")
            }}
            className="px-9 py-4 rounded-full bg-gradient-to-r from-[#9e7631] via-[#c99e52] to-[#a37932] text-[#140508] font-sans font-semibold text-xs uppercase tracking-[0.25em] hover:shadow-[0_0_25px_rgba(201,158,82,0.4)] transition-all cursor-pointer"
          >
            START A COLLABORATION
          </button>
        </div>
      </section>

      {/* ========================================================
          SECTION 12 — CONTACT & CONSULTATION
          ======================================================== */}
      <section id="contact" className="relative py-24 px-4 md:px-12 border-b border-[#c99e52]/30 bg-[#1e090f]">
        <Damask className="opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c99e52] font-sans font-medium mb-2">
              GET IN TOUCH
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-['Cinzel'] tracking-wide text-[#f7f0e3] mb-4">
              Every Great Creation Begins With a Conversation.
            </h2>
            <Flourish />
            <p className="text-base text-[#d8c3a3] leading-relaxed font-light">
              Whether you are exploring a couture creation or looking for an atelier partner, we welcome the opportunity to connect.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Direct Enquiries & Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 rounded-2xl bg-[#250c13] border border-[#c99e52]/30 shadow-xl">
                <h3 className="text-xl font-['Cinzel'] text-[#f7f0e3] mb-2">
                  Couture Enquiries
                </h3>
                <p className="text-sm text-[#d4bf9f] font-light leading-relaxed mb-4">
                  For bespoke garments, bridal commissions, collection enquiries and personal creative consultations.
                </p>
                <div className="h-[1px] bg-[#c99e52]/20 my-4" />
                <h3 className="text-xl font-['Cinzel'] text-[#f7f0e3] mb-2">
                  Atelier & Business Enquiries
                </h3>
                <p className="text-sm text-[#d4bf9f] font-light leading-relaxed">
                  For embroidery sampling, panel development, bulk production and global fashion house collaborations.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#250c13] border border-[#c99e52]/30 shadow-xl space-y-5">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#c99e52] font-sans">Direct Email</p>
                  <a
                    href="mailto:ruhaniyatbyrohaan@gmail.com"
                    className="text-base md:text-lg text-[#f7f0e3] hover:text-[#c99e52] transition-colors"
                  >
                    ruhaniyatbyrohaan@gmail.com
                  </a>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#c99e52] font-sans">Phone / WhatsApp</p>
                  <a
                    href="https://wa.me/919967012423"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base md:text-lg text-[#f7f0e3] hover:text-[#c99e52] transition-colors flex items-center gap-2"
                  >
                    <span>+91 99670 12423</span>
                    <span className="text-xs text-emerald-400 font-sans tracking-normal">(Chat on WhatsApp)</span>
                  </a>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#c99e52] font-sans">Atelier Location</p>
                  <p className="text-base text-[#f7f0e3]">
                    Mumbai, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7 p-8 md:p-12 rounded-3xl bg-[#260d14] border border-[#c99e52]/50 shadow-2xl relative">
              <Filigree corner="tl" className="absolute top-2 left-2" />
              <Filigree corner="br" className="absolute bottom-2 right-2" />

              <h3 className="text-2xl font-['Cinzel'] text-[#f7f0e3] mb-2">
                Send Your Enquiry
              </h3>
              <p className="text-xs text-[#c99e52] uppercase tracking-wider mb-8">
                We respond within 24 business hours
              </p>

              {formSubmitted ? (
                <div className="p-8 rounded-2xl bg-[#140508] border border-[#c99e52] text-center my-8 animate-fade-in">
                  <Emblem size={50} className="mx-auto mb-4" />
                  <h4 className="text-2xl font-['Cinzel'] text-[#c99e52] mb-2">Thank You</h4>
                  <p className="text-sm text-[#e4cead] mb-4">
                    Your enquiry has been received by the atelier team. We will review your project details and get back to you promptly.
                  </p>
                  <a
                    href="https://wa.me/919967012423"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#c99e52] underline"
                  >
                    Need an immediate response? Connect on WhatsApp →
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#d8c3a3] mb-2 font-sans">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.fullName}
                        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                        placeholder="e.g. Aanya Singhania"
                        className="w-full px-4 py-3 rounded-xl bg-[#18060a] border border-[#c99e52]/40 text-[#f5eedf] placeholder-[#8c7457] text-sm focus:outline-none focus:border-[#c99e52] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#d8c3a3] mb-2 font-sans">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#18060a] border border-[#c99e52]/40 text-[#f5eedf] placeholder-[#8c7457] text-sm focus:outline-none focus:border-[#c99e52] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#d8c3a3] mb-2 font-sans">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+91 99999 99999"
                        className="w-full px-4 py-3 rounded-xl bg-[#18060a] border border-[#c99e52]/40 text-[#f5eedf] placeholder-[#8c7457] text-sm focus:outline-none focus:border-[#c99e52] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#d8c3a3] mb-2 font-sans">
                        Enquiry Type *
                      </label>
                      <select
                        value={formState.enquiryType}
                        onChange={(e) => setFormState({ ...formState, enquiryType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#18060a] border border-[#c99e52]/40 text-[#f5eedf] text-sm focus:outline-none focus:border-[#c99e52] transition-colors"
                      >
                        <option value="Couture Enquiry">Couture Enquiry (Bespoke Garments)</option>
                        <option value="Atelier Collaboration">Atelier Collaboration</option>
                        <option value="Embroidery Sampling">Embroidery Sampling</option>
                        <option value="Bulk Production">MOQ & Bulk Production</option>
                        <option value="Other">Other Creative Project</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#d8c3a3] mb-2 font-sans">
                      Tell Us About Your Project *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.projectDetails}
                      onChange={(e) => setFormState({ ...formState, projectDetails: e.target.value })}
                      placeholder="Share your silhouettes, embroidery references, timelines, and requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-[#18060a] border border-[#c99e52]/40 text-[#f5eedf] placeholder-[#8c7457] text-sm focus:outline-none focus:border-[#c99e52] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#9e7631] via-[#c99e52] to-[#a37932] text-[#140508] font-sans font-semibold text-xs uppercase tracking-[0.25em] hover:shadow-[0_0_25px_rgba(201,158,82,0.4)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "SENDING ENQUIRY..." : "SEND YOUR ENQUIRY"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 13 — FOOTER
          ======================================================== */}
      <footer className="relative bg-[#140508] border-t border-[#c99e52]/40 text-[#d8c3a3] pt-16 pb-12 px-4 md:px-12">
        <Damask className="opacity-15" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Emblem size={52} className="mx-auto mb-3" />
            <h2 className="text-3xl font-['Cinzel'] tracking-widest text-[#f7f0e3]">
              RUHANIYAT BY ROHAAN
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-[#c99e52] mt-1 font-['Cinzel']">
              The Art of Indian Couture & Craftsmanship.
            </p>
            <p className="text-xs text-[#a89379] italic mt-1 max-w-md mx-auto">
              An expression of heritage, artistry and contemporary design.
            </p>
            <Flourish className="my-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-y border-[#c99e52]/25 py-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#c99e52] font-sans font-bold mb-4">
                EXPLORE
              </p>
              <ul className="space-y-2.5 text-sm font-light">
                {["Home", "The House", "Couture", "The Atelier", "Craftsmanship", "Editorial", "Contact"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollTo(item === "Home" ? "hero" : item === "The House" ? "about" : item === "The Atelier" ? "atelier" : item.toLowerCase())}
                      className="hover:text-[#c99e52] transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#c99e52] font-sans font-bold mb-4">
                CONNECT
              </p>
              <ul className="space-y-2.5 text-sm font-light">
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#c99e52] transition-colors">
                    Instagram (@ruhaniyatbyrohaan)
                  </a>
                </li>
                <li>
                  <a href="mailto:ruhaniyatbyrohaan@gmail.com" className="hover:text-[#c99e52] transition-colors">
                    Email (ruhaniyatbyrohaan@gmail.com)
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/919967012423" target="_blank" rel="noopener noreferrer" className="hover:text-[#c99e52] transition-colors">
                    WhatsApp (+91 99670 12423)
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#c99e52] font-sans font-bold mb-4">
                BUSINESS ENQUIRIES
              </p>
              <div className="space-y-2 text-sm font-light">
                <p>Email: <a href="mailto:ruhaniyatbyrohaan@gmail.com" className="hover:text-[#c99e52]">ruhaniyatbyrohaan@gmail.com</a></p>
                <p>Phone: +91 99670 12423</p>
                <p>Location: Mumbai, Maharashtra, India</p>
                <p className="text-xs text-[#c99e52] pt-2">Global Couture & Atelier Sourcing Welcomed</p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8c7457] tracking-wider font-sans">
            <p>© 2026 Ruhaniyat By Rohaan. All Rights Reserved.</p>
            <p className="mt-2 sm:mt-0 italic">Handcrafted with reverence in Mumbai, India.</p>
          </div>
        </div>
      </footer>

      {/* ========================================================
          MODALS & LIGHTBOXES
          ======================================================== */}
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#1e090f] border border-[#c99e52] rounded-2xl overflow-hidden p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-[#c99e52] flex items-center justify-center hover:bg-[#c99e52] hover:text-black transition-colors cursor-pointer"
            >
              ✕
            </button>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
              <img src={lightboxImage.image} alt={lightboxImage.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 text-center">
              <h4 className="text-2xl font-['Cinzel'] text-[#f7f0e3]">{lightboxImage.title}</h4>
              <p className="text-sm text-[#c99e52] italic mt-1">{lightboxImage.detail}</p>
            </div>
          </div>
        </div>
      )}

      {/* Film Modal */}
      {isPlayingFilm && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsPlayingFilm(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#1c080e] border border-[#c99e52] rounded-2xl overflow-hidden p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPlayingFilm(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-[#c99e52] flex items-center justify-center hover:bg-[#c99e52] hover:text-black transition-colors cursor-pointer"
            >
              ✕
            </button>
            <Emblem size={50} className="mx-auto mb-3" />
            <h4 className="text-2xl font-['Cinzel'] text-[#f7f0e3] mb-2">The Hands. The Art. The Details.</h4>
            <p className="text-xs uppercase tracking-widest text-[#c99e52] mb-6">A Craftsmanship Film by Ruhaniyat</p>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#c99e52]/40 bg-black flex items-center justify-center">
              <div className="p-8 text-[#d9c4a5] space-y-3">
                <div className="w-16 h-16 rounded-full border border-[#c99e52] mx-auto flex items-center justify-center animate-pulse">
                  <span className="text-[#c99e52] text-xl">▶</span>
                </div>
                <p className="text-sm italic">
                  “Beyond the finished silhouette lies a world of patience, precision and creativity.”
                </p>
                <p className="text-xs text-[#8c7457]">
                  Filmed inside the Mumbai embroidery atelier · Featuring Zardozi & Aari master karigars
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPlayingFilm(false)}
              className="mt-6 px-6 py-2 rounded-full border border-[#c99e52] text-xs uppercase tracking-widest text-[#c99e52] hover:bg-[#c99e52] hover:text-[#180a0e] transition-colors cursor-pointer"
            >
              Close Film
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
