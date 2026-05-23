export function generateTimeSlots(
  startTime,
  endTime,
  interval,
  buffer
) {
  const slots = []

  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)

  while (start < end) {
    const formatted = start.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })

    slots.push(formatted)

    start.setMinutes(
  start.getMinutes() +
    Number(interval) +
    Number(buffer)
)
  }

  return slots
}