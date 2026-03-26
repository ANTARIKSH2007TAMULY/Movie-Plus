import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN
const TMDB_PROXY_URL = import.meta.env.VITE_TMDB_PROXY_URL
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function ensureCredentials() {
  // Best option for production: call your own proxy/backend and keep secrets server-side.
  if (TMDB_PROXY_URL) return

  if (!TMDB_API_KEY && !TMDB_READ_ACCESS_TOKEN) {
    throw new Error(
      'Missing TMDB credentials. Set VITE_TMDB_PROXY_URL (recommended) or VITE_TMDB_READ_ACCESS_TOKEN / VITE_TMDB_API_KEY in .env.'
    )
  }
}

const tmdb = axios.create({
  baseURL: TMDB_PROXY_URL || TMDB_BASE_URL,
  timeout: 15000,
  headers:
    !TMDB_PROXY_URL && TMDB_READ_ACCESS_TOKEN
      ? { Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}` }
      : {},
})

function withAuth(params = {}) {
  ensureCredentials()
  if (TMDB_PROXY_URL) return params
  if (TMDB_READ_ACCESS_TOKEN) return params
  return { api_key: TMDB_API_KEY, ...params }
}

export function getImageUrl(path, size = 'w500') {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export async function fetchTopRatedMovies({ page = 1 } = {}) {
  const { data } = await tmdb.get('/movie/top_rated', { params: withAuth({ page }) })
  return data
}

export async function fetchPopularMovies({ page = 1 } = {}) {
  const { data } = await tmdb.get('/movie/popular', { params: withAuth({ page }) })
  return data
}

export async function searchMovies({ query, page = 1 } = {}) {
  const { data } = await tmdb.get('/search/movie', {
    params: withAuth({ query, page, include_adult: false }),
  })
  return data
}

export async function fetchMovieGenres() {
  const { data } = await tmdb.get('/genre/movie/list', {
    params: withAuth({ language: 'en-US' }),
  })
  return data
}

export async function discoverMovies({
  page = 1,
  with_genres,
  sort_by = 'popularity.desc',
  vote_average_gte,
  primary_release_year,
} = {}) {
  const { data } = await tmdb.get('/discover/movie', {
    params: withAuth({
      page,
      with_genres,
      sort_by,
      vote_average_gte,
      primary_release_year,
      include_adult: false,
      include_video: true,
    }),
  })
  return data
}

const videoCache = new Map()

export async function fetchMovieTrailerKey(movieId) {
  if (!movieId) return null
  if (videoCache.has(movieId)) return videoCache.get(movieId)

  const { data } = await tmdb.get(`/movie/${movieId}/videos`, {
    params: withAuth({ language: 'en-US' }),
  })

  const videos = Array.isArray(data?.results) ? data.results : []
  const pick =
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
    videos.find((v) => v.site === 'YouTube')

  const key = pick?.key ?? null
  videoCache.set(movieId, key)
  return key
}

