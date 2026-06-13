export function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function parseBoolean(v) {
  const s = String(v).trim().toLowerCase()
  if (s === 'true' || s === '1') return true
  if (s === 'false' || s === '0') return false
  return null
}

export function parseNumber(v) {
  if (v === undefined || v === null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export function parseDate(v) {
  if (!v) return null
  const d = new Date(String(v))
  return Number.isNaN(d.getTime()) ? null : d
}
