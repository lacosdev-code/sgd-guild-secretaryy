import React from 'react'
import { cn } from '@/lib/utils'

import Image from 'next/image'

interface AvatarProps {
  url?: string | null
  name: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function Avatar({ url, name, className, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  }

  const initial = name ? name.charAt(0).toUpperCase() : '?'

  if (url) {
    return (
      <Image
        src={url}
        alt={name}
        width={96}
        height={96}
        unoptimized
        className={cn(
          'rounded-full object-cover shrink-0',
          sizeClasses[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold shrink-0',
        'bg-[#1B2E52] text-[#C9A227]',
        sizeClasses[size],
        className
      )}
      title={name}
    >
      {initial}
    </div>
  )
}
