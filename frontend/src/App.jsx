import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import "./App.css";
import accLogo from "./assets/acc-logo.png";
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import IPL2026Page from "./pages/IPL2026Page";

/* ───────── nav config ───────── */
const SECTION_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Domains", href: "/#domains" },
  { label: "Events", href: "/#events" },
  { label: "Team", href: "/#team" },
  { label: "Contact", href: "/#contact" },
];

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleSectionClick = (e, href) => {
    // If we're already on the home page, scroll to the section
    if (location.pathname === "/" && href.startsWith("/#")) {
      e.preventDefault();
      const id = href.replace("/#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={accLogo}
            alt="ACC Logo"
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/10 bg-white object-contain p-0.5 group-hover:border-white/30 transition-all duration-300"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-heading text-lg font-bold tracking-wide">
              ACC
            </span>
            <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-medium">
              NIT Jamshedpur
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleSectionClick(e, link.href)}
              className="text-white/50 hover:text-white text-sm tracking-wide transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}

          {/* Projects */}
          <Link
            to="/projects"
            className={`text-sm tracking-wide transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 hover:after:w-full ${
              location.pathname === "/projects"
                ? "text-white after:w-full"
                : "text-white/50 hover:text-white"
            }`}
          >
            Projects
          </Link>

          <Link
            to="/projects/ipl-2026"
            className={`text-sm tracking-wide transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 hover:after:w-full ${
              location.pathname === "/projects/ipl-2026" ||
              location.pathname === "/project-ipl"
                ? "text-white after:w-full"
                : "text-white/50 hover:text-white"
            }`}
          >
            IPL 2026
          </Link>

          <Link
            to="/#contact"
            className="ml-2 px-5 py-2 text-sm text-black bg-white rounded-full font-medium hover:bg-white/90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Join Us
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 animate-fade-in-up"
          style={{ animationDuration: "0.3s" }}
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className="text-white/60 hover:text-white text-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/projects"
              className="text-white/60 hover:text-white text-lg transition-colors"
            >
              Projects
            </Link>
            <Link
              to="/projects/ipl-2026"
              className="text-white/60 hover:text-white text-lg transition-colors"
            >
              IPL 2026
            </Link>
            <a
              href="/#contact"
              className="mt-2 px-5 py-3 text-center text-black bg-white rounded-full font-medium"
            >
              Join Us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={accLogo}
            alt="ACC"
            className="w-7 h-7 rounded-full bg-white p-0.5 object-contain"
          />
          <span className="text-white/30 text-sm">
            © {new Date().getFullYear()} Analytics & Consultancy Club, NIT
            Jamshedpur
          </span>
        </div>
        <div className="flex items-center gap-6">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/20 hover:text-white/50 text-xs tracking-wide transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/projects"
            className="text-white/20 hover:text-white/50 text-xs tracking-wide transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/projects/ipl-2026"
            className="text-white/20 hover:text-white/50 text-xs tracking-wide transition-colors"
          >
            IPL 2026
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   APP — with routing
   ═══════════════════════════════════════════════ */
function App() {
  return (
    <BrowserRouter>
      <div className="noise-bg bg-surface text-white min-h-screen font-sans antialiased selection:bg-white/10">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/ipl-2026" element={<IPL2026Page />} />
          <Route path="/project-ipl" element={<IPL2026Page />} />
        </Routes>
        <div className="gradient-line" />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
