import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer"; 
import ProtectedRoute from "./components/ProtectedRoute"; 

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Reservation from "./pages/Reservation";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile"; 

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import MenuList from "./components/admin/MenuList";
import OrdersList from "./components/admin/OrdersList";
import ReservationsList from "./components/admin/ReservationsList";

// Contexts
import { CartProvider } from "./context/CartContext";
import { AuthProvider, AuthContext } from "./context/AuthContext"; 

/* Admin Route Protector */
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  return user && user.role === "admin" ? children : <Navigate to="/login" />;
};

/* Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/* Main Layout Logic */
const Layout = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;
  
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname);
  const isCartRoute = pathname === "/cart";

  return (
    // FIX: Force bg-black here for the entire site theme (Requirement #1)
    <div className={isAdminRoute ? "min-h-screen bg-gray-100" : "min-h-screen bg-black text-white"}>
      
      {!isAdminRoute && <Header />} 
      
      <main className={isAdminRoute ? "" : "min-h-screen"}>
        {children}
      </main>

      {!isAdminRoute && !isAuthPage && !isCartRoute && <Footer />}
      
      {/* 
          FIX: Removed the duplicate CartDrawer call from here. 
          It will now ONLY render when called by the Route below.
      */}
    </div>
  );
};

export default function App() {
  return (
    <Router 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Layout>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/gallery" element={<Gallery />} />
              
              {/* 
                  REQUIREMENT #8: Single Cart Page Logic
                  We render the CartDrawer as a standalone page here.
              */}
              <Route path="/cart" element={<CartDrawer />} />
              
              {/* AUTH ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* PROTECTED USER ROUTES */}
              <Route path="/reservation" element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
              <Route path="/order-summary" element={<ProtectedRoute><OrderSummaryPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* PROTECTED ADMIN ROUTES */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/menu" element={<AdminRoute><MenuList /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><OrdersList /></AdminRoute>} />
              <Route path="/admin/reservations" element={<AdminRoute><ReservationsList /></AdminRoute>} />

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
