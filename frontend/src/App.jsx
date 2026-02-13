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
import Signup from "./pages/Signup";
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
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  // Assumes your user object has an 'role' field from MongoDB
  return user && user.role === "admin" ? children : <Navigate to="/login" />;
};

/* Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

/* Main Layout */
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className={isAdminRoute ? "min-h-screen bg-gray-100" : "min-h-screen bg-background text-textPrimary"}>
      {!isAdminRoute && <Header />} 
      <main className={isAdminRoute ? "min-h-screen" : "min-h-[80vh]"}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
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
              <Route path="/cart" element={<CartDrawer />} />
              
              {/* AUTH ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* PROTECTED USER ROUTES */}
              <Route 
                path="/reservation" 
                element={<ProtectedRoute><Reservation /></ProtectedRoute>} 
              />
              <Route 
                path="/order-summary" 
                element={<ProtectedRoute><OrderSummaryPage /></ProtectedRoute>} 
              />
              <Route 
                path="/profile" 
                element={<ProtectedRoute><Profile /></ProtectedRoute>} 
              />

              {/* PROTECTED ADMIN ROUTES */}
              <Route 
                path="/admin" 
                element={<AdminRoute><AdminDashboard /></AdminRoute>} 
              />
              <Route 
                path="/admin/menu" 
                element={<AdminRoute><MenuList /></AdminRoute>} 
              />
              <Route 
                path="/admin/orders" 
                element={<AdminRoute><OrdersList /></AdminRoute>} 
              />
              <Route 
                path="/admin/reservations" 
                element={<AdminRoute><ReservationsList /></AdminRoute>} 
              />

              {/* 404 Redirect */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
