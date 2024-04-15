import { Navbar } from './components/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './context/ThemeContext'
import { FontSizeProvider } from './context/FontSizeContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gita Learn',
  description: 'Welcome to Gita-Learn, your ultimate online portal for diving deep into the spiritual essence of the Bhagavad Gita, guided by the enlightening teachings of Srila Prabhupada. This platform is designed to foster a profound understanding and appreciation of the Gita through interactive learning methods and innovative features tailored for both enthusiasts and scholars alike.',
}

export default function RootLayout({ children }) {
  return (

    <html lang="en" data-theme="light">
      <head>
        <title>Gita-Learn</title>
        <meta name="description" content="Embark on a spiritual journey with Gita-Learn. Explore the Bhagavad Gita chapter by chapter with teachings from Srila Prabhupada. Test your understanding with interactive quizzes, manage your reading streaks, enjoy a fullscreen reading experience, and easily search for verses." />
        <meta name="keywords" content="Srimad Bhagavad gita, bhagavad gita quotes, bhagavad gita sanskrit to english, bhagavad gita quotes in sanskrit, Bhagavad-gītā as it is, Sanskrit shloka, bhagavad gita sanskrit to english, bhagavad gita sanskrit quotes, bhagavad gita in english for free, translation, purports, Bhagavad Gita Learning, BG, bhagavad gita in english with meaning, bhagavad gita 700 slokas in english, bhagavad gita slokas in english with meaning, Gita Quizzes, bhagavad gita purpose, bhagavad gita with explanation, bhagavad gita in english, Srila Prabhupada, Spiritual Learning, Hindu Scriptures, Gita Verses, Bhagwat Gita, Bhagvad Gita, Gita Study" />
      </head>

      <body className={inter.className}>

        <ThemeProvider>
        <FontSizeProvider>
          <Navbar />
          {children}
          </FontSizeProvider>
        </ThemeProvider>
      </body>

    </html>
  )
}
