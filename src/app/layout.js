import { Navbar } from './components/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './context/ThemeContext'

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
    <meta name="keywords" content="Bhagavad Gita Learning, BG, Gita Quizzes, Bhagavad Gita As It Is, Srila Prabhupada, Spiritual Learning, Hindu Scriptures, Gita Verses, Interactive Learning, Streak Management, Fullscreen Reading, Gita Search, Bhagwat Gita, Bhagvad Gita, Gita Study" />
</head>

      <body className={inter.className}>

        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>

    </html>
  )
}
