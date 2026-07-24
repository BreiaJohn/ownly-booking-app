import { useTheme } from "../context/ThemeContext"

import logoDark from "../assets/yorly-logo-dark.svg"
import logoLight from "../assets/yorly-logo-light.svg"

export default function Logo({
  className = "",
  alt = "Yorly",
}) {
  const { theme } = useTheme()

  const logo =
    theme === "dark"
      ? logoDark
      : logoLight

  return (
    <img
      src={logo}
      alt={alt}
      className={className}
    />
  )
}