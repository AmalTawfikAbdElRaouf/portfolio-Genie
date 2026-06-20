import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./store";
import type { RootState } from "./store";
import { useEffect } from "react";
import { supabase } from "./services/supabaseClient";
import { setUserData, logout } from "./store/slices/userSlice";

import AppNavbar from "./components/AppNavbar";
import AppFooter from "./components/AppFooter";
import Home from "./pages/landing/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Portfolios from "./pages/dashboard/Portfolios";
import Settings from "./pages/dashboard/Settings";
import CreatePortfolio from "./pages/dashboard/CreatePortfolio";
import EditPortfolio from "./pages/dashboard/EditPortfolio";
import PortfolioEditor from "./pages/dashboard/PortfolioEditor";
import NotFound from "./pages/NotFound";
import sidebarStyles from "./style/Sidebar.module.css";
import ResetPassword from "./pages/auth/ResetPassword";

const DASHBOARD_ROUTES = ["/dashboard", "/portfolios", "/portfolio-editor", "/settings"];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={sidebarStyles.mainLayout}>
      <main className={sidebarStyles.mainContent}>{children}</main>
    </div>
  );
}

function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
      const fullName = session.user.user_metadata?.full_name || session.user.email || "";
const avatarUrl = session.user.user_metadata?.avatar_url || "";
dispatch(setUserData({ name: fullName, job: "", avatar: avatarUrl }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
       const fullName = session.user.user_metadata?.full_name || session.user.email || "";
const avatarUrl = session.user.user_metadata?.avatar_url || "";
dispatch(setUserData({ name: fullName, job: "", avatar: avatarUrl }));
      } else {
        dispatch(logout());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return null;
}

function AppRoutes() {
  const location = useLocation();
  const isDashboard = DASHBOARD_ROUTES.some(
    (route) => location.pathname === route || location.pathname.startsWith(route + "/")
  );

  const HAS_OWN_FOOTER = ["/portfolio-editor", "/portfolios/create"];
  const hasOwnFooter = HAS_OWN_FOOTER.some(
    (route) => location.pathname === route || location.pathname.startsWith(route + "/")
  );
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const isAuth = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      <AuthListener />
      <AppNavbar />
      {isDashboard ? (
        <DashboardLayout>
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/portfolios" element={<ProtectedRoute><Portfolios /></ProtectedRoute>} />
            <Route path="/portfolio-editor" element={<ProtectedRoute><PortfolioEditor /></ProtectedRoute>} />
            <Route path="/portfolios/create" element={<ProtectedRoute><CreatePortfolio /></ProtectedRoute>} />
            <Route path="/portfolios/edit/:id" element={<ProtectedRoute><EditPortfolio /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </DashboardLayout>
      ) : (
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />  {/* زيدي هنا */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      )}
      {isDashboard && !hasOwnFooter && <AppFooter />}
      {!isDashboard && !isAuth && <AppFooter />}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;