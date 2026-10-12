export type Badge = {
  title: string
  subtitle: string
  /** Proof screenshots (store rankings…) revealed by the badge dropdown */
  images?: string[]
}

export type Experience = {
  id: string
  name: string
  /** Shorter label for the phone home screen (iOS truncates long names) */
  shortName?: string
  /** Three accent colours (from the app icon) driving the phone wallpaper when the app is active */
  palette: [string, string, string]
  /** Audience size, normalised as '80.000+' / '3.000.000+'; rendered the same way for every app */
  users?: string
  /** Where the users figure comes from, when it is not first-party */
  usersSource?: string
  role: string
  period: string
  icon: string
  bullets: string[]
  /** Optional screenshots shown under the bullets, paths under public/ */
  images?: string[]
  /** Optional achievement badges shown after the screenshots */
  badges?: Badge[]
  /** Optional external links shown under the bullets */
  links?: { label: string; href: string }[]
}

export const profile = {
  name: 'Antoine Gonthier',
  tagline: 'Mobile Engineer',
  bio: "Welcome to my site. I'm a 22-yo mobile engineer between Paris and Dublin, with 5+ years of experience building consumer apps. I build high-quality iOS and Android apps used by millions of people.",
  github: 'https://github.com/antoinegtir',
  linkedin: 'https://www.linkedin.com/in/antoinegtr',
  email: 'antoinegonthier11@icloud.com',
}

export const experiences: Experience[] = [
  {
    id: 'wellnotes',
    name: 'Wellnotes',
    role: 'Solo Founder',
    period: '2025.02 - Present',
    icon: '/icons/wellnotes.webp',
    palette: ['#f5b400', '#ffe08a', '#fff3c4'],
    users: '80.000+',
    bullets: [
      'Student app with 1,000+ ratings at 4.6 stars.',
      'Ranked on average in the top 100 of the App Store in France.',
      '$30K ARR.',
    ],
    images: [
      '/screens/wellnotes-02-note-editing.webp',
      '/screens/wellnotes-03-new-note.webp',
      '/screens/wellnotes-04-note-schemes.webp',
      '/screens/wellnotes-05-mindmap.webp',
      '/screens/wellnotes-06-quiz.webp',
      '/screens/wellnotes-07-folder.webp',
    ],
    badges: [{ title: 'APP STORE FRANCE', subtitle: 'Top 100 on average', images: ['/screens/wellnotes-fr-top100.webp'] }],
    links: [{ label: 'App Store', href: 'https://apps.apple.com/fr/app/wellnotes-fiches-ia-mindmap/id6739225998' }],
  },
  {
    id: 'atclub',
    name: 'AtClub',
    role: 'Advisor',
    period: '2025.07 - Present',
    icon: '/icons/atclub.webp',
    palette: ['#ff2d55', '#ff6a3d', '#ff8ab5'],
    users: '1.000.000+',
    usersSource: 'AppMagic',
    bullets: [
      'Advising the CTO on engineering and product for AtClub, a social app to find sports partners.',
      'Advising on the Flutter and Firebase architecture of the app.',
    ],
    images: [
      '/screens/atclub-01.webp',
      '/screens/atclub-02.webp',
      '/screens/atclub-03.webp',
      '/screens/atclub-04.webp',
      '/screens/atclub-05.webp',
      '/screens/atclub-06.webp',
    ],
    badges: [{ title: 'APP STORE FRANCE', subtitle: 'Top 20 Social Networking (source: AppMagic)' }],
    links: [{ label: 'App Store', href: 'https://apps.apple.com/us/app/atclub-sports-partners/id6450602291' }],
  },
  {
    id: 'vibes',
    name: 'Vibes Widget',
    role: 'Founding Engineer',
    period: '2023.08 - 2025.11',
    icon: '/icons/vibes.webp',
    palette: ['#8b7fd6', '#b8a7e6', '#5b4bc4'],
    users: '3.000.000+',
    bullets: [
      'Founding member of a social network popular in Japan, top of the App Store charts in 30+ countries.',
      'Built and deployed the entire Android app.',
      'Built and maintain the iOS versions.',
    ],
    images: [
      '/screens/vibes-01-lockscreen.webp',
      '/screens/vibes-02-send-vibes.webp',
      '/screens/vibes-03-reply.webp',
      '/screens/vibes-04-listening.webp',
      '/screens/vibes-05-photos.webp',
      '/screens/vibes-06-memories.webp',
      '/screens/vibes-07-map.webp',
    ],
    badges: [
      {
        title: 'APP STORE',
        subtitle: '#2 Social Networking in Japan and France',
        images: ['/screens/vibes-jp-store.webp', '/screens/vibes-jp-2.webp', '/screens/vibes-fr-2.webp'],
      },
      {
        title: 'APP STORE · GOOGLE PLAY',
        subtitle: 'Top charts in 30+ countries',
        images: ['/screens/vibes-se-4.webp', '/screens/vibes-play-17.webp'],
      },
    ],
  },
  {
    id: 'dreamoji',
    name: 'Dreamoji',
    role: 'Founding Engineer',
    period: '2024.09 - 2025.01',
    icon: '/icons/dreamoji.webp',
    palette: ['#7c3aed', '#ec4899', '#f97316'],
    users: '300.000+',
    bullets: [
      'Shipped an app generating Genmoji-style AI emojis before iOS 18 launched.',
      'Built the entire Android app.',
    ],
  },
  {
    id: 'threads',
    name: 'Fhreads',
    role: 'Open Source',
    period: '2023.07',
    icon: '/icons/threads.webp',
    palette: ['#4a4a4a', '#8a8a8a', '#1f1f1f'],
    bullets: [
      'Built a fully functional clone of Threads in Flutter and Firebase, 24 hours after Threads launched.',
      'The most-starred Flutter Threads clone on GitHub (130+ stars), cloned by tens of thousands of developers.',
      'Went viral in developer communities: 61K+ reach and 600+ reactions on a single Facebook post.',
    ],
    images: [
      '/screens/threads-feed.webp',
      '/screens/threads-threads.webp',
      '/screens/threads-profile.webp',
      '/screens/threads-onboard.webp',
      '/screens/threads-search.webp',
      '/screens/threads-post.webp',
      '/screens/threads-notification.webp',
      '/screens/threads-follow.webp',
      '/screens/threads-settings.webp',
    ],
    badges: [{ title: 'THREADS', subtitle: 'Most viral open-source repo on the Threads app', images: ['/screens/threads-facebook.webp'] }],
    links: [{ label: 'github.com/Antoinegtir/fhreads-meta', href: 'https://github.com/Antoinegtir/fhreads-meta' }],
  },
  {
    id: 'rebeal',
    name: 'ReBeal',
    role: 'Open Source',
    period: '2023.06',
    icon: '/icons/rebeal.webp',
    palette: ['#3a3a3a', '#6b6b6b', '#161616'],
    bullets: [
      'Built a fully functional clone of BeReal in Flutter and Firebase in 48 hours.',
      'The most-starred BeReal clone on GitHub, across all languages (66 stars, 16 forks).',
    ],
    images: [
      '/screens/rebeal-home.webp', '/screens/rebeal-feed.webp', '/screens/rebeal-discover.webp', '/screens/rebeal-profile.webp',
      '/screens/rebeal-photos.webp', '/screens/rebeal-global.webp', '/screens/rebeal-profiles.webp', '/screens/rebeal-search.webp', '/screens/rebeal-request.webp', '/screens/rebeal-settings.webp',
    ],
    links: [
      { label: 'github.com/Antoinegtir/bereal-clone', href: 'https://github.com/Antoinegtir/bereal-clone' },
      { label: 'Medium article', href: 'https://medium.com/@zkhwctb/how-i-create-a-clone-of-bereal-7dbee8a915d5' },
    ],
  },
  {
    id: 'kams',
    name: 'Kams',
    role: 'Solo Founder',
    period: '2021.12 - 2023',
    icon: '/icons/kams.webp',
    palette: ['#22d3ee', '#e040fb', '#fde047'],
    bullets: ['Launched my first social network at 16. It did not take off, but I learned a lot.'],
    images: [
      '/screens/kams-01.webp',
      '/screens/kams-02.webp',
      '/screens/kams-03.webp',
      '/screens/kams-04.webp',
      '/screens/kams-05.webp',
      '/screens/kams-06.webp',
    ],
    links: [{ label: 'App Store', href: 'https://apps.apple.com/fr/app/kams/id1616390258' }],
  },
]
