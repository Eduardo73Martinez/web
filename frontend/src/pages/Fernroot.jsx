import { useEffect, useRef, useState } from 'react'
import './Fernroot.css'

const LOG_PLAIN = 'https://thinkingods.com/demos/fernroot-hero/assets/base.webp'
const LOG_COLOUR = 'https://thinkingods.com/demos/fernroot-hero/assets/reveal.webp'
const BRUSH_WIPE = 'https://thinkingods.com/demos/fernroot-hero/assets/brush-wipe.webp'

function Fernroot() {
  const heroRef = useRef(null)
  const stageRef = useRef(null)
  const [isIn, setIsIn] = useState(false)
  const [stageDone, setStageDone] = useState(false)

  useEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    if (!hero || !stage) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touchOnly = window.matchMedia('(hover: none)').matches

    /* ---- tunables ------------------------------------------------------------ */
    const AXIS = -16.6 * Math.PI / 180
    const AX = Math.cos(AXIS), AY = Math.sin(AXIS)
    const PAR = 0.075
    const PAR_LERP = 0.07
    const REV_LERP = 0.10
    const WIPE_MS = 2300, SLIDE_MS = 3000
    const SLIDE = 0.11

    let maskOK = true
    let W = 0, H = 0
    function measure() { W = hero.clientWidth; H = hero.clientHeight }
    measure()
    window.addEventListener('resize', measure)

    const m = { x: -9999, y: -9999, tx: -9999, ty: -9999, seen: false }
    const par = { d: 0, target: 0 }
    const intro = { on: false, t0: 0, doneAt: 0 }
    const last = {}

    function setVar(k, v) {
      if (last[k] !== v) { last[k] = v; hero.style.setProperty(k, v) }
    }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }
    function easeOut(t, p) { return 1 - Math.pow(1 - t, p) }

    function onPointerMove(e) {
      if (!m.seen && m.tx === -9999) { m.x = e.clientX; m.y = e.clientY }
      m.seen = true
      m.tx = e.clientX; m.ty = e.clientY
      par.target = -clamp((e.clientX - W / 2) / (W / 2), -1, 1)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    /* hover-less devices: demo sweep */
    function demo(now) {
      const s = Math.sin(now / 1500)
      const x = W * (0.5 + 0.30 * s)
      const y = H * 0.49 + (x - W * 0.4362) * Math.tan(AXIS)
      m.tx = x; m.ty = y
      if (m.x === -9999) { m.x = x; m.y = y }
    }

    function frame(now) {
      /* intro: brush wipe + slide */
      let slide = 0
      if (intro.on) {
        const t = now - intro.t0
        const pw = easeOut(clamp(t / WIPE_MS, 0, 1), 1.75)
        const ps = easeOut(clamp(t / SLIDE_MS, 0, 1), 4)
        const ew = 0.818 * H
        setVar('--ew', ew + 'px')
        setVar('--ix', (W - pw * (W + ew)) + 'px')
        slide = (1 - ps) * SLIDE * W
        if (t >= Math.max(WIPE_MS, SLIDE_MS)) {
          intro.on = false; intro.doneAt = now
          setStageDone(true)
        }
      }

      if (touchOnly && !m.seen && !intro.on && intro.doneAt && now - intro.doneAt > 600) demo(now)

      /* cursor reveal */
      if (m.tx !== -9999) {
        m.x += (m.tx - m.x) * REV_LERP
        m.y += (m.ty - m.y) * REV_LERP
        setVar('--mx', m.x.toFixed(1) + 'px')
        setVar('--my', m.y.toFixed(1) + 'px')
      }

      /* diagonal parallax */
      par.d += (par.target - par.d) * PAR_LERP
      const dist = (reduce ? 0 : par.d * PAR * W) + slide
      setVar('--tx', (dist * AX).toFixed(2) + 'px')
      setVar('--ty', (dist * AY).toFixed(2) + 'px')

      requestAnimationFrame(frame)
    }

    function start() {
      if (reduce || !maskOK) {
        setStageDone(true)
        setIsIn(true)
        requestAnimationFrame(frame)
        return
      }
      setIsIn(true)
      intro.on = true; intro.t0 = performance.now()
      requestAnimationFrame(frame)
    }

    /* Preload images and brush mask */
    const imgs = Array.prototype.slice.call(document.images)
    const pre = imgs.map(function (i) { return i.decode ? i.decode().catch(function () { }) : Promise.resolve() })
    pre.push(fetch(BRUSH_WIPE, { mode: 'cors' }).then(function (r) { if (!r.ok) throw 0; return r.blob() }).catch(function () { maskOK = false }))
    Promise.all(pre).then(start)

    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <>
      <nav>
        <div className="brand">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 22V10.5" fill="none" stroke="#161616" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M12 12.5C12 7.6 8.4 4.6 3.5 4.6c0 4.9 3.3 7.9 8.5 7.9z" fill="#3f7d4e" />
            <path d="M12 15.2c0-4.2 3-6.9 8.5-6.9 0 4.4-3.2 6.9-8.5 6.9z" fill="#161616" />
          </svg>
        </div>
        <div>
          <button className="join">Explore</button>
          <button className="burger" aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      <section
        ref={heroRef}
        className={`hero${isIn ? ' is-in' : ''}`}
        id="hero"
      >
        <div className="headline">
          <h1>
            <span className="l1 a rv" style={{ animationDelay: '.25s' }}>"Plantados en la casa de Jehvá, en los atrios de nuestro Dios floreceran"</span>
            <span className="l2 a rv" style={{ animationDelay: '.42s' }}>Salmo 92:13-14</span>
          </h1>
        </div>

        <div
          ref={stageRef}
          className={`log-stage${stageDone ? ' done' : ''}`}
          id="stage"
        >
          <div className="layer">
            <div className="pose">
              <img src={LOG_PLAIN} alt="Weathered fallen timber" decoding="async" />
            </div>
          </div>
          <div className="layer reveal">
            <div className="pose">
              <img src={LOG_COLOUR} alt="" decoding="async" />
            </div>
          </div>
        </div>

        <div className="glass a fu" style={{ animationDelay: '.7s' }}>
          <p>Nothing here is waste. Lichen, crystal and wildflower all make a home in the one piece of timber the forest let go.</p>
        </div>

        <div className="cta-block a fu" style={{ animationDelay: '.85s' }}>
          <p>Drag your cursor across the timber to peel back the colour hidden in its grain, then wander into the field guide.</p>
          <button className="cta">Open the Field Guide</button>
        </div>
      </section>
    </>
  )
}

export default Fernroot
