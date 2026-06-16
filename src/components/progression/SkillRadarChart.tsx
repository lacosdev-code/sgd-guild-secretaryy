'use client'

import { DEFAULT_SKILLS } from '@/lib/progression'

interface Skill {
  skillName: string
  skillLevel: string // F,E,D,C,B,A,S
}

// Convert letter grade to numeric 0-6
function levelToNum(level: string): number {
  const idx = ['F', 'E', 'D', 'C', 'B', 'A', 'S'].indexOf(level)
  return idx === -1 ? 0 : idx
}

interface SkillRadarChartProps {
  skills: Skill[]
  color?: string
}

export function SkillRadarChart({ skills, color = '#C9A227' }: SkillRadarChartProps) {
  const size = 240
  const center = size / 2
  const maxRadius = 90
  const sides = DEFAULT_SKILLS.length
  const angleStep = (2 * Math.PI) / sides

  // Get skill level (default F=0) for each default skill
  const skillMap = Object.fromEntries(skills.map(s => [s.skillName, levelToNum(s.skillLevel)]))
  const values = DEFAULT_SKILLS.map(name => skillMap[name] ?? 0)

  // Generate polygon point
  const getPoint = (index: number, value: number, radius: number) => {
    const angle = angleStep * index - Math.PI / 2
    const r = radius * (value / 6)
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  // Background grid rings
  const rings = [1, 2, 3, 4, 5, 6]

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid rings */}
        {rings.map(ring => {
          const points = DEFAULT_SKILLS.map((_, i) => {
            const angle = angleStep * i - Math.PI / 2
            const r = maxRadius * (ring / 6)
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
          }).join(' ')
          return (
            <polygon
              key={ring}
              points={points}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          )
        })}

        {/* Axis lines */}
        {DEFAULT_SKILLS.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(angle)}
              y2={center + maxRadius * Math.sin(angle)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          )
        })}

        {/* Skill polygon */}
        <polygon
          points={DEFAULT_SKILLS.map((_, i) => {
            const pt = getPoint(i, values[i], maxRadius)
            return `${pt.x},${pt.y}`
          }).join(' ')}
          fill={`${color}30`}
          stroke={color}
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {/* Skill dots */}
        {DEFAULT_SKILLS.map((_, i) => {
          const pt = getPoint(i, values[i], maxRadius)
          return <circle key={i} cx={pt.x} cy={pt.y} r="4" fill={color} stroke="#0F1B2D" strokeWidth="2" />
        })}

        {/* Skill labels */}
        {DEFAULT_SKILLS.map((name, i) => {
          const angle = angleStep * i - Math.PI / 2
          const labelRadius = maxRadius + 20
          const x = center + labelRadius * Math.cos(angle)
          const y = center + labelRadius * Math.sin(angle)
          const level = ['F', 'E', 'D', 'C', 'B', 'A', 'S'][values[i]]
          return (
            <g key={i}>
              <text
                x={x}
                y={y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fill="rgba(255,255,255,0.5)"
                fontWeight="600"
                style={{ fontFamily: 'inherit' }}
              >
                {name.split(' ')[0]}
              </text>
              <text
                x={x}
                y={y + 7}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill={color}
                fontWeight="900"
                style={{ fontFamily: 'inherit' }}
              >
                {level}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {DEFAULT_SKILLS.map((name, i) => {
          const levelStr = ['F', 'E', 'D', 'C', 'B', 'A', 'S'][values[i]]
          return (
            <div key={name} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color, opacity: 0.4 + values[i] * 0.1 }} />
              <span className="text-gray-400 truncate">{name}</span>
              <span className="font-black ml-auto" style={{ color }}>{levelStr}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
