import { useState, useEffect, useRef } from 'react'
import accLogo from '../assets/acc-logo.png'

/* ───────── reusable data ───────── */
const STATS = [
  { value: '75+', label: 'Active Members' },
  { value: '8+', label: 'Projects Delivered' },
  { value: '5+', label: 'Corporate Partners' },
  { value: '2+', label: 'Years of Excellence' },
]

const DOMAINS = [
  {
    icon: '📊',
    title: 'Data Analytics',
    description: 'Transforming raw data into actionable insights through advanced statistical modelling, machine learning, and visualization techniques.',
  },
  {
    icon: '💼',
    title: 'Management Consulting',
    description: 'Providing strategic solutions for real-world business challenges through case competitions, live projects, and industry collaboration.',
  },
  {
    icon: '📈',
    title: 'Financial Analysis',
    description: 'Deep-diving into market trends, equity research, valuation modelling, and portfolio management with a data-centric approach.',
  },
  {
    icon: '🧠',
    title: 'Product & Strategy',
    description: 'Crafting go-to-market strategies, product roadmaps, and leveraging analytical frameworks to drive business growth.',
  },
]

const EVENTS = [
  {
    title: 'Case Crunch',
    tag: 'Flagship',
    description: 'Our annual inter-college case study competition attracting 500+ participants from premier B-schools and engineering institutes.',
  },
  {
    title: 'DataVerse',
    tag: 'Technical',
    description: 'A data science hackathon where participants solve real industry problems using analytics, ML, and visualization.',
  },
  {
    title: 'Consult-O-Mania',
    tag: 'Workshop',
    description: 'Interactive workshop series featuring industry leaders sharing insights on consulting frameworks and career paths.',
  },
  {
    title: 'Analytics Summit',
    tag: 'Conference',
    description: 'An annual conference bringing together thought leaders, alumni, and students to discuss the future of analytics.',
  },
]

const TEAM = [
  { name: 'Club President', role: 'Overall Lead', initials: 'CP' },
  { name: 'Vice President', role: 'Strategy & Ops', initials: 'VP' },
  { name: 'Tech Lead', role: 'Analytics Head', initials: 'TL' },
  { name: 'Events Head', role: 'Events & Outreach', initials: 'EH' },
]

const MARQUEE_ITEMS = [
  'Analytics', '•', 'Consulting', '•', 'Strategy', '•', 'Data Science', '•',
  'Machine Learning', '•', 'Case Studies', '•', 'Finance', '•', 'Product', '•',
  'Analytics', '•', 'Consulting', '•', 'Strategy', '•', 'Data Science', '•',
  'Machine Learning', '•', 'Case Studies', '•', 'Finance', '•', 'Product', '•',
]

/* ───────── intersection observer hook ───────── */
function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.15, ...options })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, isInView]
}

/* ── Hero ── */
function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden grid-pattern">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/50 text-xs tracking-widest uppercase font-medium">Est. NIT Jamshedpur</span>
        </div>

        {/* Logo & Heading */}
        <div className="animate-fade-in-up delay-100">
          <img src={accLogo} alt="ACC Logo" className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-6 rounded-2xl bg-white p-2 shadow-[0_0_60px_rgba(255,255,255,0.08)]" />
        </div>

        <h1 className="animate-fade-in-up delay-200 font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
          Analytics &<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50">
            Consultancy Club
          </span>
        </h1>

        <p className="animate-fade-in-up delay-300 mt-6 text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Empowering the next generation of analytical leaders and strategic thinkers at NIT Jamshedpur.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up delay-400 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#about"
            className="group px-8 py-3.5 bg-white text-black rounded-full font-semibold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-500 flex items-center gap-2"
          >
            Explore
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#events"
            className="px-8 py-3.5 border border-white/15 text-white/70 rounded-full font-medium text-sm tracking-wide hover:border-white/30 hover:text-white transition-all duration-500"
          >
            Upcoming Events
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-up delay-700">
        <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  )
}

/* ── Marquee ── */
function MarqueeBanner() {
  return (
    <div className="border-y border-white/5 bg-white/[0.01] py-4 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {MARQUEE_ITEMS.map((item, i) => (
          <span
            key={i}
            className={`mx-4 text-sm tracking-widest uppercase ${
              item === '•' ? 'text-white/10' : 'text-white/20 font-medium'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── About ── */
function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" ref={ref} className="relative py-24 lg:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <span className="text-white/30 text-xs tracking-[0.3em] uppercase font-medium">Who We Are</span>
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight ${inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              Where Data Meets
              <br />
              <span className="text-white/50">Decision Making</span>
            </h2>
            <p className={`mt-6 text-white/40 text-base md:text-lg leading-relaxed ${inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              The Analytics & Consultancy Club (ACC) at NIT Jamshedpur is a
              student-driven initiative dedicated to bridging the gap between
              academic theory and real-world business application. We cultivate
              analytical thinking, strategic problem-solving, and data-driven
              decision-making skills.
            </p>
            <p className={`mt-4 text-white/40 text-base md:text-lg leading-relaxed ${inView ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              Through case competitions, workshops, industry projects, and
              knowledge sessions, our members develop the skills and mindset
              needed to excel in consulting, analytics, and strategy roles.
            </p>
          </div>

          <div className={`grid grid-cols-2 gap-4 ${inView ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
            {STATS.map((s, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 lg:p-8 text-center transition-all duration-500 hover:scale-[1.02]"
              >
                <span className="block font-heading text-3xl lg:text-4xl font-bold text-white">{s.value}</span>
                <span className="block mt-2 text-white/30 text-sm tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Domains ── */
function Domains() {
  const [ref, inView] = useInView()

  return (
    <section id="domains" ref={ref} className="relative py-24 lg:py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <span className={`text-white/30 text-xs tracking-[0.3em] uppercase font-medium ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            What We Do
          </span>
          <h2 className={`mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white ${inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
            Our Domains
          </h2>
          <p className={`mt-4 text-white/40 max-w-lg mx-auto ${inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            We operate across four core verticals, each fostering deep expertise and hands-on experience.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DOMAINS.map((d, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-6 lg:p-8 group transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${
                inView ? `animate-fade-in-up delay-${(i + 2) * 100}` : 'opacity-0'
              }`}
            >
              <span className="text-3xl lg:text-4xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                {d.icon}
              </span>
              <h3 className="font-heading text-lg font-semibold text-white mb-2">{d.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{d.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Events ── */
function Events() {
  const [ref, inView] = useInView()

  return (
    <section id="events" ref={ref} className="relative py-24 lg:py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <span className={`text-white/30 text-xs tracking-[0.3em] uppercase font-medium ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Experiences
            </span>
            <h2 className={`mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white ${inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              Signature Events
            </h2>
          </div>
          <p className={`text-white/40 max-w-md text-sm md:text-base ${inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            From inter-college competitions to exclusive industry workshops, our events are designed to push boundaries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {EVENTS.map((e, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-6 lg:p-8 group transition-all duration-500 hover:scale-[1.01] ${
                inView ? `animate-fade-in-up delay-${(i + 2) * 100}` : 'opacity-0'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                  {e.title}
                </h3>
                <span className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 rounded-full px-3 py-1">
                  {e.tag}
                </span>
              </div>
              <p className="text-white/35 text-sm leading-relaxed">{e.description}</p>
              <div className="mt-6 flex items-center gap-2 text-white/20 group-hover:text-white/40 transition-colors text-sm">
                <span>Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Team ── */
function Team() {
  const [ref, inView] = useInView()

  return (
    <section id="team" ref={ref} className="relative py-24 lg:py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto text-center">
        <span className={`text-white/30 text-xs tracking-[0.3em] uppercase font-medium ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          Leadership
        </span>
        <h2 className={`mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white ${inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
          The Core Team
        </h2>
        <p className={`mt-4 text-white/40 max-w-lg mx-auto ${inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
          Driven by passion and purpose — meet the people steering ACC forward.
        </p>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM.map((t, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-6 lg:p-8 group transition-all duration-500 hover:scale-[1.03] ${
                inView ? `animate-fade-in-up delay-${(i + 2) * 100}` : 'opacity-0'
              }`}
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-white/20 transition-colors">
                <span className="font-heading text-xl lg:text-2xl font-bold text-white/60">{t.initials}</span>
              </div>
              <h3 className="font-heading text-base lg:text-lg font-semibold text-white">{t.name}</h3>
              <p className="text-white/30 text-sm mt-1">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Contact / CTA ── */
function Contact() {
  const [ref, inView] = useInView()

  return (
    <section id="contact" ref={ref} className="relative py-24 lg:py-32 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <span className={`text-white/30 text-xs tracking-[0.3em] uppercase font-medium ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          Get In Touch
        </span>
        <h2 className={`mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white ${inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
          Ready to Join ACC?
        </h2>
        <p className={`mt-4 text-white/40 max-w-lg mx-auto ${inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
          Whether you're a data enthusiast, strategy buff, or just curious — there's a place for you here.
        </p>

        <div className={`mt-10 ${inView ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
          <a
            href="mailto:acc@nitjsr.ac.in"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-semibold text-sm tracking-wide hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] transition-all duration-500 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            acc@nitjsr.ac.in
          </a>
        </div>

        <div className={`mt-8 flex items-center justify-center gap-6 ${inView ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
          {['LinkedIn', 'Instagram', 'Twitter'].map((s) => (
            <a key={s} href="#" className="text-white/25 hover:text-white text-sm transition-colors duration-300">
              {s}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════ */
function LandingPage() {
  return (
    <>
      <Hero />
      <MarqueeBanner />
      <About />
      <Domains />
      <Events />
      <Team />
      <Contact />
    </>
  )
}

export default LandingPage
