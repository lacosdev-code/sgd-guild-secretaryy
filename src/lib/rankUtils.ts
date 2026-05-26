export type RankType = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

export interface RankInfo {
  currentRank: RankType
  currentPoints: number
  pointsForNextRank: number | null // null if max rank
  progressPercentage: number
}

export function getRankInfo(points: number): RankInfo {
  if (points < 100) {
    return {
      currentRank: 'F',
      currentPoints: points,
      pointsForNextRank: 100,
      progressPercentage: Math.max(0, Math.min(100, (points / 100) * 100))
    }
  }
  if (points < 300) {
    return {
      currentRank: 'E',
      currentPoints: points,
      pointsForNextRank: 300,
      progressPercentage: Math.max(0, Math.min(100, ((points - 100) / 200) * 100))
    }
  }
  if (points < 600) {
    return {
      currentRank: 'D',
      currentPoints: points,
      pointsForNextRank: 600,
      progressPercentage: Math.max(0, Math.min(100, ((points - 300) / 300) * 100))
    }
  }
  if (points < 1000) {
    return {
      currentRank: 'C',
      currentPoints: points,
      pointsForNextRank: 1000,
      progressPercentage: Math.max(0, Math.min(100, ((points - 600) / 400) * 100))
    }
  }
  if (points < 1500) {
    return {
      currentRank: 'B',
      currentPoints: points,
      pointsForNextRank: 1500,
      progressPercentage: Math.max(0, Math.min(100, ((points - 1000) / 500) * 100))
    }
  }
  if (points < 2000) {
    return {
      currentRank: 'A',
      currentPoints: points,
      pointsForNextRank: 2000,
      progressPercentage: Math.max(0, Math.min(100, ((points - 1500) / 500) * 100))
    }
  }
  
  return {
    currentRank: 'S',
    currentPoints: points,
    pointsForNextRank: null,
    progressPercentage: 100
  }
}
