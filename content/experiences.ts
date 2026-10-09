export type Badge = {
  title: string
  subtitle: string
}

export type Experience = {
  id: string
  name: string
  role: string
  period: string
  icon: string
  bullets: string[]
  /** Optional screenshots shown under the bullets, paths under public/ */
  images?: string[]
  /** Optional achievement badges shown after the screenshots */
  badges?: Badge[]
}

export const profile = {
  name: 'Antoine Gonthier',
  tagline: 'Mobile Engineer',
  bio: "Welcome to my site. I'm a 21-yo mobile engineer between Paris and Dublin, with 5+ years of experience building consumer apps. I work with SwiftUI & Java, Node.js and Firebase, and I care a lot about product design.",
  github: 'https://github.com/antoinegtir',
  linkedin: 'https://www.linkedin.com/in/antoinegtr',
  email: 'antoinegonthier11@icloud.com',
}

export const experiences: Experience[] = [
  {
    id: 'calico',
    name: 'Calico',
    role: 'Mobile Engineer',
    period: '2026.03 - Present',
    icon: '/icons/calico.png',
    bullets: ['Shipped 3 apps for an American studio.'],
  },
  {
    id: 'wellnotes',
    name: 'Wellnotes',
    role: 'Solo Founder',
    period: '2025.02 - Present',
    icon: '/icons/wellnotes.png',
    bullets: [
      'Student app with 80K+ users and 1,000+ ratings at 4.6 stars.',
      'Ranked on average in the top 100 of the App Store in France.',
      '$30K ARR.',
    ],
    images: ['/screens/wellnotes-fr-top100.jpg'],
    badges: [{ title: 'APP STORE FRANCE', subtitle: 'Top 100 on average' }],
  },
  {
    id: 'dreamoji',
    name: 'Dreamoji',
    role: 'Founding Engineer',
    period: '2024.09 - 2025.06',
    icon: '/icons/dreamoji.png',
    bullets: [
      'Shipped an app generating Genmoji-style AI emojis before iOS 18 launched.',
      '300K+ users on iOS.',
    ],
  },
  {
    id: 'vibes',
    name: 'Vibes Widget',
    role: 'Founding Engineer',
    period: '2023.08 - 2025.11',
    icon: '/icons/vibes.png',
    bullets: [
      'Founding member of a social network popular in Japan: 3,000,000+ users worldwide, top of the App Store charts in 30+ countries.',
      'Built and deployed the entire Android app.',
      'Built and maintain the iOS versions.',
    ],
    images: [
      '/screens/vibes-jp-store.jpg',
      '/screens/vibes-jp-2.jpg',
      '/screens/vibes-fr-2.jpg',
      '/screens/vibes-se-4.jpg',
      '/screens/vibes-play-17.jpg',
    ],
    badges: [
      { title: 'APP STORE', subtitle: '#2 Social Networking in Japan and France' },
      { title: 'APP STORE', subtitle: 'Top charts in 30+ countries' },
    ],
  },
  {
    id: 'kams',
    name: 'Kams',
    role: 'Solo Founder',
    period: '2021.12 - 2023',
    icon: '/icons/kams.png',
    bullets: ['Launched my first social network at 16. It did not take off, but I learned a lot.'],
  },
]
