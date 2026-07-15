import { Routes, Route, useLocation } from "react-router-dom"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Setup from "./pages/Setup"
import Dashboard from "./pages/Dashboard"
import Bookings from "./pages/Bookings"
import Clients from "./pages/Clients"
import Payments from "./pages/Payments"
import Settings from "./pages/Settings"
import PublicBooking from "./pages/PublicBooking"
import SetupServices from "./pages/SetupServices"
import SetupAvailability from "./pages/SetupAvailability"

import PaymentSuccess from "./pages/PaymentSuccess"

import { Toaster } from "react-hot-toast"

function App() {
  const location = useLocation()

  const shouldHideNavbar =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/setup") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/bookings") ||
    location.pathname.startsWith("/clients") ||
    location.pathname.startsWith("/payments") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/payment-success") ||
    location.pathname.startsWith("/book")

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen overflow-x-hidden bg-[#F7F4EF]">
        {!shouldHideNavbar && <Navbar />}

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />


          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <Setup />
              </ProtectedRoute>
            }
          />

          <Route
  path="/setup/services"
  element={
    <ProtectedRoute>
      <SetupServices />
    </ProtectedRoute>
  }
/>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            }
          />

          <Route
  path="/setup/availability"
  element={
    <ProtectedRoute>
      <SetupAvailability />
    </ProtectedRoute>
  }
/>

          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="/book" element={<PublicBooking />} />

          <Route path="/book/:username" element={<PublicBooking />} />
        </Routes>
      </div>
    </>
  )
}

export default App