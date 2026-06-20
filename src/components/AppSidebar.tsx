import { NavLink, Link, useNavigate } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
import { BsGrid1X2, BsBriefcase, BsGear, BsPlusLg, BsBoxArrowRight } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";
import Swal from "sweetalert2";
import styles from "../style/Sidebar.module.css";

interface AppSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const AppSidebar = ({ mobileOpen, onClose }: AppSidebarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        onClose();
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

  const navLinks = (
    <Nav className="flex-column" style={{ flex: 1 }}>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? `${styles.navLinkCustom} ${styles.navLinkCustomActive}` : styles.navLinkCustom
        }
        onClick={mobileOpen ? onClose : undefined}
      >
        <BsGrid1X2 size={18} /> Dashboard
      </NavLink>

      <NavLink
        to="/portfolios"
        className={({ isActive }) =>
          isActive ? `${styles.navLinkCustom} ${styles.navLinkCustomActive}` : styles.navLinkCustom
        }
        onClick={mobileOpen ? onClose : undefined}
      >
        <BsBriefcase size={18} /> Portfolios
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? `${styles.navLinkCustom} ${styles.navLinkCustomActive}` : styles.navLinkCustom
        }
        onClick={mobileOpen ? onClose : undefined}
      >
        <BsGear size={18} /> Settings
      </NavLink>
    </Nav>
  );

  const bottomActions = (
    <div className="p-4">
      <NavLink
        to="/portfolios/create"
        className={styles.createPortfolioLink}
        onClick={mobileOpen ? onClose : undefined}
      >
        <Button
          className="w-100 py-3 d-flex align-items-center justify-content-center gap-2"
          style={{
            backgroundColor: "var(--purple-main)",
            border: "none",
            borderRadius: "15px",
            fontWeight: "600",
          }}
        >
          <BsPlusLg /> Create Portfolio
        </Button>
      </NavLink>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <div
          className={`d-lg-none ${styles.sidebarOverlay}`}
          onClick={onClose}
        />
      )}

      <aside className={styles.sidebarContainer}>
        <div className={styles.sidebarTopSpacer}>
          <Link to="/" className={styles.sidebarBrand} style={{ textDecoration: "none" }}>
            portfolio<span className={styles.sidebarBrandAccent}>Genie</span>
            <span className={styles.sidebarBrandDot} />
          </Link>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: "24px", overflowY: "auto" }}>
          {navLinks}
          {bottomActions}
        </div>
      </aside>

      <aside className={`${styles.sidebarMobile} ${mobileOpen ? styles.open : ""}`}>
        <div className="h-100 d-flex flex-column">
          <div className="px-4 mb-4 pt-3 d-flex align-items-center justify-content-between">
            <Link to="/" className={styles.sidebarBrand} style={{ textDecoration: "none" }} onClick={onClose}>
              portfolio<span className={styles.sidebarBrandAccent}>Genie</span>
              <span className={styles.sidebarBrandDot} />
            </Link>
            <button
              className="btn text-white p-1 border-0"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <FiX size={22} />
            </button>
          </div>
          {navLinks}
          {bottomActions}
          <div className="px-4 pb-4 mt-auto">
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <BsBoxArrowRight size={18} /> Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
