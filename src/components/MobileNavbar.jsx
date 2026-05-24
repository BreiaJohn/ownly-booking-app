import logo from "../assets/ownly-logo.png"

function MobileNavbar() {
  return (
    <div className="md:hidden sticky top-0 z-50 bg-[#111827]/80 backdrop-blur-xl border-b border-[#1E293B] px-4 py-4 flex items-center justify-between">
      <button className="text-2xl text-white">
        ☰
      </button>

      <img
        src={logo}
        alt="Ownly Logo"
        className="h-12 w-auto object-contain"
      />

      <div className="w-10 h-10 rounded-full bg-[#A68A72] flex items-center justify-center text-white font-semibold">
        BJ
      </div>
    </div>
  )
}

export default MobileNavbar