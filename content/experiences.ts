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
  bio: "Welcome to my site. I'm a 22-yo mobile engineer between Paris and Dublin, with 5+ years of experience building consumer apps. I work with SwiftUI & Java, Node.js and Firebase, and I care a lot about product design.",
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
    icon: '/icons/wellnotes.png',
    users: '80.000+',
    bullets: [
      'Student app with 1,000+ ratings at 4.6 stars.',
      'Ranked on average in the top 100 of the App Store in France.',
      '$30K ARR.',
    ],
    images: [
      '/screens/wellnotes-02-note-editing.jpg',
      '/screens/wellnotes-03-new-note.jpg',
      '/screens/wellnotes-04-note-schemes.jpg',
      '/screens/wellnotes-05-mindmap.jpg',
      '/screens/wellnotes-06-quiz.jpg',
      '/screens/wellnotes-07-folder.jpg',
    ],
    badges: [{ title: 'APP STORE FRANCE', subtitle: 'Top 100 on average', images: ['/screens/wellnotes-fr-top100.jpg'] }],
    links: [{ label: 'App Store', href: 'https://apps.apple.com/fr/app/wellnotes-fiches-ia-mindmap/id6739225998' }],
  },
  {
    id: 'atclub',
    name: 'AtClub',
    role: 'Advisor to the CTO',
    period: '6 months',
    icon: '/icons/atclub.png',
    users: '1.000.000+',
    usersSource: 'AppMagic',
    bullets: [
      'Advised the CTO for 6 months on engineering and product for AtClub, a social app to find sports partners.',
      'Advised on the Flutter and Firebase architecture of the app.',
    ],
    images: [
      '/screens/atclub-01.jpg',
      '/screens/atclub-02.jpg',
      '/screens/atclub-03.jpg',
      '/screens/atclub-04.jpg',
      '/screens/atclub-05.jpg',
      '/screens/atclub-06.jpg',
    ],
    badges: [{ title: 'APP STORE FRANCE', subtitle: 'Top 20 Social Networking (source: AppMagic)' }],
    links: [{ label: 'App Store', href: 'https://apps.apple.com/us/app/atclub-sports-partners/id6450602291' }],
  },
  {
    id: 'vibes',
    name: 'Vibes Widget',
    role: 'Founding Engineer',
    period: '2023.08 - 2025.11',
    icon: '/icons/vibes.png',
    users: '3.000.000+',
    bullets: [
      'Founding member of a social network popular in Japan, top of the App Store charts in 30+ countries.',
      'Built and deployed the entire Android app.',
      'Built and maintain the iOS versions.',
    ],
    images: [
      '/screens/vibes-01-lockscreen.jpg',
      '/screens/vibes-02-send-vibes.jpg',
      '/screens/vibes-03-reply.jpg',
      '/screens/vibes-04-listening.jpg',
      '/screens/vibes-05-photos.jpg',
      '/screens/vibes-06-memories.jpg',
      '/screens/vibes-07-map.jpg',
    ],
    badges: [
      {
        title: 'APP STORE',
        subtitle: '#2 Social Networking in Japan and France',
        images: ['/screens/vibes-jp-store.jpg', '/screens/vibes-jp-2.jpg', '/screens/vibes-fr-2.jpg'],
      },
      {
        title: 'APP STORE · GOOGLE PLAY',
        subtitle: 'Top charts in 30+ countries',
        images: ['/screens/vibes-se-4.jpg', '/screens/vibes-play-17.jpg'],
      },
    ],
  },
  {
    id: 'dreamoji',
    name: 'Dreamoji',
    role: 'Founding Engineer',
    period: '2024.09 - 2025.01',
    icon: '/icons/dreamoji.png',
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
    icon: '/icons/threads.png',
    bullets: [
      'Built a fully functional clone of Threads in Flutter and Firebase, 24 hours after Threads launched.',
      'The most-starred Flutter Threads clone on GitHub (130+ stars), cloned by tens of thousands of developers.',
      'Went viral in developer communities: 61K+ reach and 600+ reactions on a single Facebook post.',
    ],
    images: [
      '/screens/threads-feed.jpg',
      '/screens/threads-threads.jpg',
      '/screens/threads-profile.jpg',
      '/screens/threads-facebook.jpg',
    ],
    links: [{ label: 'github.com/Antoinegtir/fhreads-meta', href: 'https://github.com/Antoinegtir/fhreads-meta' }],
  },
  {
    id: 'rebeal',
    name: 'ReBeal',
    role: 'Open Source',
    period: '2023.06',
    icon: '/icons/rebeal.png',
    bullets: [
      'Built a fully functional clone of BeReal in Flutter and Firebase in 48 hours.',
      'The most-starred BeReal clone on GitHub, across all languages (66 stars, 16 forks).',
    ],
    images: ['/screens/rebeal-home.jpg', '/screens/rebeal-feed.jpg', '/screens/rebeal-discover.jpg', '/screens/rebeal-profile.jpg'],
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
    icon: '/icons/kams.png',
    bullets: ['Launched my first social network at 16. It did not take off, but I learned a lot.'],
    images: [
      '/screens/kams-01.jpg',
      '/screens/kams-02.jpg',
      '/screens/kams-03.jpg',
      '/screens/kams-04.jpg',
      '/screens/kams-05.jpg',
      '/screens/kams-06.jpg',
    ],
    links: [{ label: 'App Store', href: 'https://apps.apple.com/fr/app/kams/id1616390258' }],
  },
]
