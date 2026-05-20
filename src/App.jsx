import { Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

import Bookings from "./pages/Bookings"
import Clients from "./pages/Clients"
import Payments from "./pages/Payments"
import Settings from "./pages/Settings"
import ProtectedRoute from "./components/ProtectedRoute"
import { Toaster } from "react-hot-toast"
import PublicBooking from "./pages/PublicBooking"
import { useLocation } from "react-router-dom"

function App(){

  const location = useLocation()

  const hideNavbarRoutes = [
    "/dashboard",
    "/bookings",
    "/clients",
    "/payments",
    "/settings",
  ]

  const shouldHideNavbar =
    hideNavbarRoutes.includes(location.pathname)

  return (
  <>
    <Toaster position="top-right" />

    <div className="bg-[#F7F4EF] min-h-screen overflow-x-hidden">
       {!shouldHideNavbar && <Navbar />}

      <Routes>

  <Route path="/" element={<Home />} />

  <Route path="/login" element={<Login />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

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
  <Route
  path="/book/:username"
  element={<PublicBooking />}
/>

</Routes>
    </div>
  </>
)
}

export default App