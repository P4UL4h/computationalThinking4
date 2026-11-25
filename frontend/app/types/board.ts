// Someone who may see a board.
export interface Member {
  id: string
  name: string
  avatarUrl?: string
}

// A board holds objects; every object belongs to exactly one board.
export interface Board {
  id: string
  name: string
  createdAt: string
  members: readonly Member[]
}
