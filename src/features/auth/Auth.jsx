// src/components/Auth/Auth.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../Header/Navbar";
import Footer from "../Footer/Footer";
import profileImg from "../../assets/profile.jpg";
import api from "../../api/axiosInstance";
import "./Auth.css";

/* =========================
   NO-BLUE COLOR PALETTE
   (Charcoal + Green + Gold + Burgundy)
========================= */
const CHARCOAL = "#121212";     // primary
const CHARCOAL_2 = "#1a1a1a";
const GREEN = "#1B7F3A";        // secondary (green, not teal/blue)
const GREEN_DARK = "#14612C";
const GOLD = "#C6A24A";         // accent
const BURGUNDY = "#8B2332";     // highlight
const OFFWHITE = "#FBFAF7";     // background
const LIGHT = "#F4F1E8";        // subtle
const LINE = "rgba(18,18,18,0.12)";

/* =========================
   Icons
========================= */
const MailIcon = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = ({ size = 22 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.11-5.7" />
    <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
    <path d="M1 1l22 22" />
  </svg>
);

export default function Auth() {
  const { login, loginWithOtp, user, brand: brandFromAuth } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/dashboard";

  // ===== Brand (optional from BRAND_THEME) =====
  const [brandLogo, setBrandLogo] = useState(profileImg);
  const [brandName, setBrandName] = useState("Your Company");
  const [brandFont, setBrandFont] = useState(
    "'Inter', system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Open Sans', sans-serif"
  );

  useEffect(() => {
    const fallbackName = "Your Company";
    const fallbackLogo = profileImg;
    const fallbackFont =
      "'Inter', system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Open Sans', sans-serif";

    let effectiveBrand = brandFromAuth || null;
    if (!effectiveBrand) {
      try {
        const stored = localStorage.getItem("BRAND_THEME");
        if (stored) effectiveBrand = JSON.parse(stored);
      } catch {}
    }

    setBrandLogo(effectiveBrand?.logo || fallbackLogo);
    setBrandName(effectiveBrand?.company_name || fallbackName);
    setBrandFont(
      effectiveBrand?.font_family
        ? `${effectiveBrand.font_family}, system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Open Sans', sans-serif`
        : fallbackFont
    );
  }, [brandFromAuth]);

  // ===== Layout responsive =====
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 768);
      setIsTablet(w > 768 && w <= 1024);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ===== Slider images (put in /public) =====
  const IMAGE_PATHS = useMemo(
    () => ["/back1.jpeg", "/g7.jpeg", "/back3.jpeg", "/g6.jpeg"],
    []
  );
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentImg((p) => (p + 1) % IMAGE_PATHS.length);
    }, 5000);
    return () => clearInterval(t);
  }, [IMAGE_PATHS.length]);

  // ===== Mobile Menu =====
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // ===== Sections =====
  const headerHeight = 66;
  const rightSectionWidth = "23%";

  const sections = useMemo(
    () => [
      { label: "Home", id: "home", icon: "🏠" },
      { label: "About", id: "about", icon: "ℹ️" },
      { label: "Gallery", id: "gallery", icon: "📸" },
      { label: "Contact", id: "contact", icon: "📞" },
    ],
    []
  );

  function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (!target) return;

    if (isMobile || isTablet) {
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
      setShowMobileMenu(false);
      return;
    }

    const container = document.querySelector(".left-pane");
    if (container) {
      const top = target.offsetTop - headerHeight;
      container.scrollTo({ top, behavior: "smooth" });
    }
  }

  // ===== Gallery preview modal =====
  const galleryData = useMemo(
    () => ["/g9.png", "/g10.png", "/g11.png", "/g4.jpeg", "/g6.jpeg", "/g5.jpeg"],
    []
  );
  const [previewImg, setPreviewImg] = useState(null);

  // ===== Login modal (your existing login) =====
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  // ESC close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowLoginModal(false);
        setPreviewImg(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isPasswordMode = loginMode === "password";
  const isOtpMode = loginMode === "otp";

  const openAdminLogin = () => {
    setShowLoginModal(true);
    setLoginMode("password");
    setOtpSent(false);
    setError("");
    setShowPassword(false);
    setFormData({ username: "", password: "", otp: "" });
  };

  const handleModeChange = (mode) => {
    setLoginMode(mode);
    setOtpSent(false);
    setError("");
    setShowPassword(false);
    setFormData((p) => ({ ...p, password: "", otp: "" }));
  };

  const handleInputChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSendOtp = async () => {
    setError("");
    if (!formData.username) {
      setError("Please enter your email address to receive OTP.");
      return;
    }
    setOtpSending(true);
    try {
      await api.post("/accounts/login/otp/start/", { email: formData.username });
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please check your email and try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const doAfterLogin = async (data) => {
    const userRole = data?.user?.role || "SALES";

    // keep your existing behavior
    try {
      const scopeRes = await api.get("/client/my-scope/", { params: { include_units: true } });
      localStorage.setItem("MY_SCOPE", JSON.stringify(scopeRes.data || {}));
    } catch (e) {
      console.error("Failed /client/my-scope/", e);
    }

    setShowLoginModal(false);

    if (userRole === "SALES") nav("/dashboard", { replace: true });
    else nav(from, { replace: true });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isPasswordMode) {
        const data = await login({
          username: formData.username,
          password: formData.password,
        });
        await doAfterLogin(data);
      } else {
        if (!formData.username) {
          setError("Please enter your email address.");
          return;
        }
        if (!formData.otp) {
          setError("Please enter the OTP you received.");
          return;
        }

        const data = await loginWithOtp({
          email: formData.username,
          otp: formData.otp,
        });
        await doAfterLogin(data);
      }
    } catch (err) {
      console.error(err);
      setError(isPasswordMode ? "Invalid username or password" : "Invalid email or OTP");
    } finally {
      setLoading(false);
    }
  };

  // ===== Contact form (simple UI only) =====
  const [contact, setContact] = useState({ name: "", email: "", message: "" });

  return (
    <div className="lp-wrap" style={{ fontFamily: brandFont }}>
      {/* Keep your existing Navbar */}
      <Navbar showLogout={false} currentUser={user} />

      {/* Header (reference-style) */}
      <header
        className="lp-header"
        style={{
          height: headerHeight,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: OFFWHITE,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        {(isMobile || isTablet) && (
          <button
            className="lp-menu-btn"
            onClick={() => setShowMobileMenu((p) => !p)}
            aria-label="Menu"
          >
            ☰
          </button>
        )}

        <div className="lp-brand">
          <img className="lp-brand-logo" src={brandLogo || profileImg} alt={brandName} />
          <div className="lp-brand-text">
            <div className="lp-brand-title">{brandName}</div>
            <div className="lp-brand-sub">
              Premium Landing • Clean UI • No Blue Theme
            </div>
          </div>
        </div>

        {!isMobile && !isTablet && (
          <nav className="lp-nav">
            {/* <button className="lp-home-icon" onClick={() => scrollToSection("home")}>🏠</button> */}

            {sections.map((s) => (
              <button
                key={s.id}
                className="lp-nav-item"
                onClick={() => scrollToSection(s.id)}
              >
                {s.label}
              </button>
            ))}

            {/* ✅ IMPORTANT: Login opens YOUR modal (NOT /admin page) */}
            <button className="lp-admin-btn" onClick={openAdminLogin}>
              Login
            </button>
          </nav>
        )}

        {!isMobile && !isTablet && (
          <div className="lp-header-right" style={{ width: rightSectionWidth }}>
            <button className="lp-cta" onClick={() => scrollToSection("contact")}>
              📞 Contact
            </button>
            <button className="lp-cta2" onClick={openAdminLogin}>
              🔐 Login
            </button>
          </div>
        )}

        {(isMobile || isTablet) && (
          <div className="lp-mini-right">
            <button className="lp-mini-cta" onClick={openAdminLogin}>🔐 Login</button>
          </div>
        )}
      </header>

      {/* Mobile/Tablet Menu Overlay */}
      {(isMobile || isTablet) && showMobileMenu && (
        <div className="lp-mobile-menu">
          <button className="lp-mobile-close" onClick={() => setShowMobileMenu(false)}>×</button>

          {sections.map((s) => (
            <button
              key={s.id}
              className="lp-mobile-item"
              onClick={() => scrollToSection(s.id)}
            >
              <span className="lp-mobile-ico">{s.icon}</span>
              {s.label}
            </button>
          ))}

          <button className="lp-mobile-admin" onClick={() => { setShowMobileMenu(false); openAdminLogin(); }}>
            🔐Login
          </button>
        </div>
      )}

      {/* MAIN LAYOUT (reference-style: left scroll + right panel desktop) */}
      <div className="lp-layout">
        {/* LEFT */}
        <div className="left-pane hide-scroll" style={{ width: isMobile || isTablet ? "100%" : "77%" }}>
          {/* HERO */}
          <section
            id="home"
            className="lp-hero"
            style={{
              minHeight: `calc(100vh - ${headerHeight}px)`,
              backgroundImage: `url(${IMAGE_PATHS[currentImg]})`,
            }}
          >
            <div className="lp-hero-overlay" />

            <div className="lp-hero-card">
              <div className="lp-strip">
                2026 Ready UI • Secure Auth • OTP + Password
              </div>

              <div className="lp-card-body">
                <h1 className="lp-h1">
                  Welcome to <span style={{ color: GREEN }}>{brandName}</span>
                </h1>

                <div className="lp-pill">
                  Modern Landing Page • No Redirect on Login
                </div>

                <div className="lp-featurebox">
                  <div className="lp-row">
                    <span>Security</span>
                    <b>Role + Token</b>
                  </div>
                  <div className="lp-row">
                    <span>Login Modes</span>
                    <b>Password / OTP</b>
                  </div>
                  <div className="lp-row">
                    <span>Design</span>
                    <b>Charcoal • Green • Gold</b>
                  </div>
                </div>

                <div className="lp-offer">
                  <div className="lp-offer-title">Quick Access</div>
                  <div className="lp-offer-sub">
                    Click below to open <b>Login</b> modal (same page).
                  </div>
                </div>

                <div className="lp-btn-row">
                  <button className="lp-btn-primary" onClick={openAdminLogin}>
                     Login
                  </button>
                  <button className="lp-btn-ghost" onClick={() => scrollToSection("about")}>
                    Explore About
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="lp-section">
            <h2 className="lp-h2">About Us</h2>
            <p className="lp-p">
              This is a reference-style landing layout (like the code you sent), but colors are
              <b> strictly non-blue</b>. Login button opens your existing login flow as modal.
            </p>

            <div className="lp-grid">
              <div className="lp-box">
                <h3>Clean UI</h3>
                <p>Minimal, premium look with solid spacing & typography.</p>
              </div>
              <div className="lp-box">
                <h3>Login</h3>
                <p>Password + OTP, scoped fetch after login (same as your code).</p>
              </div>
              <div className="lp-box">
                <h3>Responsive</h3>
                <p>Mobile menu overlay + desktop split layout (reference style).</p>
              </div>
            </div>
          </section>

          {/* GALLERY */}
          <section id="gallery" className="lp-section alt">
            <div className="lp-head-row">
              <h2 className="lp-h2">Gallery</h2>
              <button className="lp-small-btn" onClick={() => scrollToSection("contact")}>
                Get in Touch
              </button>
            </div>

            <div className="lp-gallery">
              {galleryData.map((img) => (
                <button
                  key={img}
                  className="lp-imgbtn"
                  onClick={() => setPreviewImg(img)}
                  aria-label="Preview image"
                >
                  <img src={img} alt="Gallery" />
                </button>
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="lp-section">
            <div className="lp-head-row">
              <h2 className="lp-h2">Contact Us</h2>
              <button className="lp-small-btn" onClick={openAdminLogin}>
                Login
              </button>
            </div>

            <div className="lp-contact">
              <div className="lp-contact-card">
                <label>Name</label>
                <input
                  value={contact.name}
                  onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your Name"
                />

                <label>Email</label>
                <input
                  value={contact.email}
                  onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Your Email"
                />

                <label>Message</label>
                <textarea
                  rows={5}
                  value={contact.message}
                  onChange={(e) => setContact((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Write your message..."
                />

                <button type="button" className="lp-btn-primary" onClick={() => alert("Connect backend later")}>
                  Send Message
                </button>
              </div>

              <div className="lp-info">
                <div className="lp-info-box">
                  <div className="lp-info-title">Support</div>
                  <div className="lp-info-text">support@company.com</div>
                </div>
                <div className="lp-info-box">
                  <div className="lp-info-title">Phone</div>
                  <div className="lp-info-text">+91 00000 00000</div>
                </div>
                <div className="lp-info-box">
                  <div className="lp-info-title">Office</div>
                  <div className="lp-info-text">Mumbai, India</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT PANEL (Desktop only) */}
        {!isMobile && !isTablet && (
          <aside className="right-pane" style={{ width: rightSectionWidth }}>
            <div className="rp-card">
              <div className="rp-title">Quick Actions</div>
              <button className="rp-btn" onClick={openAdminLogin}>🔐 Login</button>
              <button className="rp-btn2" onClick={() => scrollToSection("contact")}>📞 Contact</button>
              <div className="rp-note">
                Login button opens <b>your login modal</b> (no redirect).
              </div>
            </div>

            <div className="rp-card" style={{ marginTop: 14 }}>
              <div className="rp-title">Why this UI?</div>
              <ul className="rp-list">
                <li>No blue colors</li>
                <li>Reference layout kept</li>
                <li>Modal login integrated</li>
                <li>Responsive (mobile menu)</li>
              </ul>
            </div>
          </aside>
        )}
      </div>

      {/* Mobile sticky bottom bar */}
      {isMobile && (
        <div className="lp-sticky">
          <button className="lp-stick-btn" onClick={() => scrollToSection("contact")}>Contact</button>
          <button className="lp-stick-btn2" onClick={openAdminLogin}>Login</button>
        </div>
      )}

      {/* Gallery preview modal */}
      {previewImg && (
        <div className="lp-overlay" onClick={() => setPreviewImg(null)}>
          <img className="lp-preview" src={previewImg} alt="Preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* ✅ Login MODAL (YOUR LOGIN FLOW) */}
      {showLoginModal && (
        <div className="lp-overlay" onMouseDown={(e) => {
          if (e.target.classList.contains("lp-overlay")) setShowLoginModal(false);
        }}>
          <div className="login-modal" role="dialog" aria-modal="true">
            <div className="login-head">
              <div className="login-brand">
                <img src={brandLogo || profileImg} alt={brandName} />
                <div>
                  <div className="login-title">{brandName}</div>
                  <div className="login-sub">Login</div>
                </div>
              </div>
              <button className="login-close" onClick={() => setShowLoginModal(false)}>✕</button>
            </div>

            <div className="login-modes">
              <button
                type="button"
                className={`mode ${isPasswordMode ? "active" : ""}`}
                onClick={() => handleModeChange("password")}
              >
                Password
              </button>
              <button
                type="button"
                className={`mode ${isOtpMode ? "active" : ""}`}
                onClick={() => handleModeChange("otp")}
              >
                OTP
              </button>
            </div>

            <form className="login-form" onSubmit={handleLoginSubmit}>
              <div className="field">
                <label>{isPasswordMode ? "Username" : "Email Address"}</label>
                <div className="inputwrap">
                  <MailIcon />
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    type={isPasswordMode ? "text" : "email"}
                    placeholder={isPasswordMode ? "Enter username" : "Enter email"}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {isPasswordMode && (
                <div className="field">
                  <label>Password</label>
                  <div className="inputwrap">
                    <LockIcon />
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      required
                    />
                    <button type="button" className="eye" onClick={() => setShowPassword((p) => !p)} aria-label="Toggle password">
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              )}

              {isOtpMode && (
                <>
                  <div className="field">
                    <label>OTP</label>
                    <div className="inputwrap">
                      <LockIcon />
                      <input
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Enter OTP"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="otp-btn"
                    onClick={handleSendOtp}
                    disabled={otpSending || !formData.username}
                  >
                    {otpSending ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </>
              )}

              {error && <div className="err">{error}</div>}

              <button className="submit" type="submit" disabled={loading}>
                {loading ? "Please wait..." : isPasswordMode ? "Login" : "Verify & Login"}
              </button>
            </form>

            <div className="login-foot">Tip: ESC to close</div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
