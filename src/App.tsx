import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MehndiAtelierTemplate from "@/components/ui/mehndi-atelier-template"

export default function App() {
  useEffect(() => {
    // Initialize Lenis luxury smooth scrolling
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    })

    // Synchronize Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update)

    // Drive Lenis requestAnimationFrame from GSAP's central high-performance ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    // Ensure ScrollTrigger refreshes with Lenis metrics
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="w-full">
      <MehndiAtelierTemplate />
    </div>
  )
}
