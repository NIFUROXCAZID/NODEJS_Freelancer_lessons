import mongoose from 'mongoose'
import { escapeRegex } from './helpers.mjs'

export const ALLOWED_POST_FILTERS = {
  post: (v) => {
    const raw = String(v ?? '').trim()
    if (!raw) return undefined

    const safe = escapeRegex(raw)

    return {
      post: new RegExp(safe, 'i'),
    }
  },

  author: (v) => {
    if (!v) return undefined

    try {
      return {
        authors: new mongoose.Types.ObjectId(v),
      }
    } catch {
      return undefined
    }
  },

  // minComments: (v) => {
  //   const count = Number(v)

  //   if (isNaN(count)) return undefined

  //   return {
  //     $expr: {
  //       $gte: [
  //         { $size: '$comments' },
  //         count,
  //       ],
  //     },
  //   }
  // },
}

export function buildPostFilter(query) {
  const filter = {}

  for (const key in ALLOWED_POST_FILTERS) {
    if (query[key] !== undefined && query[key] !== '') {
      const value = ALLOWED_POST_FILTERS[key](query[key])

      if (value) {
        Object.assign(filter, value)
      }
    }
  }

  return filter
}