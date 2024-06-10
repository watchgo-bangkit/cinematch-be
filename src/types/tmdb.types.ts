export type TMDB_Genre = {
  id: string
  name: string
}
export enum TMDB_Gender {
  NotSpecified = 0,
  Female = 1,
  Male = 2,
}
export type TMDB_Cast = {
  id: number
  adult: boolean
  gender: TMDB_Gender
  name: string
  popularity: number // 3 points decimal
  profile_path: string
  character: string
}
export type TMDB_Crew = Omit<TMDB_Cast, 'character'> & {
  department: string
  job: string
}

export type TMDB_Credits = {
  id: number
  cast: TMDB_Cast[]
  director: TMDB_Crew | null
}

export type TMDB_Movie = {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_title: string
  overview: string
  popularity: number //decimal with 3
  poster_path: string
  release_date: string //'2024-05-02'
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export type TMDB_MovieDetail = Omit<TMDB_Movie, 'genre_ids'> & {
  genres: TMDB_Genre[]
  homepage: string
  imdb_id: string
  runtime: number // in minutes
  status: string
  tagline: string
  credits: TMDB_Credits
}
