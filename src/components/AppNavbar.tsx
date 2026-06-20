import { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BsBoxArrowRight } from "react-icons/bs";
import type { RootState } from "../store";
import { logout } from "../store/slices/userSlice";
import Swal from "sweetalert2";
import AppSidebar from "./AppSidebar";

const NAV_LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Templates", href: "/#templates" },
  { label: "Testimonials", href: "/#testimonial" },
  { label: "Contact", href: "/#contact-us" },
];

const DASHBOARD_ROUTES = ["/dashboard", "/portfolios", "/portfolio-editor", "/settings"];

const AvatarDisplay = ({ avatar, name, initials }: { avatar: string; name: string; initials: string }) => {
  if (avatar) {
    return <img src={avatar} alt={name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />;
  }
  return <>{initials}</>;
};

export default function AppNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoggedIn } = useSelector((state: RootState) => state.user);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDashboard = DASHBOARD_ROUTES.some(
    (route) => location.pathname === route || location.pathname.startsWith(route + "/")
  );

  useEffect(() => {
    setMenuOpen(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 24);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); setSidebarOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || sidebarOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, sidebarOpen]);

  const handleLogout = () => {
    Swal.fire({
      title: "Log Out?",
      text: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#7C3AED",
      background: "#1a1040",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        setMenuOpen(false);
        setSidebarOpen(false);
        navigate("/");
        Swal.fire({
          title: "Logged Out",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1a1040",
          color: "#fff",
        });
      }
    });
  };

  const initials = data.name
    ? data.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <header role="banner">
        <nav
          className={`navbar-custom${scrolled ? " scrolled" : ""}${isDashboard ? " dashboard-nav" : ""}`}
          aria-label="Main navigation"
        >
          <Container fluid="xl">
            <div className="navbar-inner">
              <Link to="/" className="brand-logo" aria-label="portfolioGenie — go to home">
                portfolio<span className="ai">Genie</span>
                <span className="brand-dot" aria-hidden="true" />
              </Link>

              {!isDashboard && (
                <ul className="nav-links" role="list">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              )}

              {/* Desktop actions - landing */}
              {!isDashboard && (
                <div className="nav-actions" role="group" aria-label="Account actions">
                  {isLoggedIn ? (
                    <>
                      <Link to="/dashboard" className="nav-avatar" title={data.name}>
                        <AvatarDisplay avatar={data.avatar} name={data.name} initials={initials} />
                      </Link>
                      <button onClick={handleLogout} className="btn-ghost btn-logout">
                        <BsBoxArrowRight size={16} /> Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="btn-ghost">Login</Link>
                      <Link to="/signup" className="btn-purple">Get Started Free</Link>
                    </>
                  )}
                </div>
              )}

              {/* Dashboard desktop - show logout only */}
              {isDashboard && (
                <div className="nav-actions d-none d-lg-flex" role="group">
                  <button onClick={handleLogout} className="btn-ghost btn-logout">
                    <BsBoxArrowRight size={16} /> Log Out
                  </button>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="hamburger"
                onClick={() => isDashboard ? setSidebarOpen((o) => !o) : setMenuOpen((o) => !o)}
                aria-expanded={isDashboard ? sidebarOpen : menuOpen}
                aria-label={isDashboard ? "Open sidebar" : "Open menu"}
              >
                <span className={`burger-line${(isDashboard ? sidebarOpen : menuOpen) ? " open" : ""}`} aria-hidden="true">
                  <span /><span /><span />
                </span>
              </button>
            </div>

            {/* Landing mobile menu */}
            {!isDashboard && menuOpen && (
              <div id="mobile-menu" className="mobile-menu open" aria-hidden={false}>
                <nav aria-label="Mobile links">
                  {NAV_LINKS.map((link) => (
                    <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="mobile-actions">
                  {isLoggedIn ? (
                    <>
                      <Link to="/dashboard" className="nav-avatar mobile-nav-avatar" title={data.name} onClick={() => setMenuOpen(false)}>
                        <AvatarDisplay avatar={data.avatar} name={data.name} initials={initials} />
                      </Link>
                      <button className="btn-ghost btn-logout" onClick={handleLogout}>
                        <BsBoxArrowRight size={16} /> Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="btn-ghost" onClick={() => setMenuOpen(false)}>Login</Link>
                      <Link to="/signup" className="btn-purple" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </Container>
        </nav>
      </header>

      {isDashboard && (
        <AppSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </>
  );
}