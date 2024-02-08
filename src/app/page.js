"use client"
import Image from 'next/image'

import { Footer } from './components/Footer'
// import Chapters from './components/Chapters'
import VerseDay from './components/VerseDay'
// import Carousel from './components/Carousel'
import Quiz from './components/Quiz'
import BooksCard from './components/BooksCard'
import Link from 'next/link'
import ReviewCard from './components/ReviewCard'
import AboutAuthor from './components/AboutAuthor'

export default function Home() {
  return (
    <div>
  
      {
        <div className="flex justify-center bg-orange-200">
          <div className="flex-col mx-8 hero-content lg:flex-row-reverse ">
            <Image src="https://vedabase.io/static/img/vedabase-logo.svg" className="w-2/3 max-w-sm rounded-lg h-2/3 sm:w-3/5 sm:h-4/5" width={100} height={100} alt='cover-image'/>
            <div className='justify-start'>
              <h1 className="mx-20 my-4 text-3xl font-bold">Bhaktivedanta GitaLearn</h1>
              <p className='mx-20 text-2xl font-medium sm:text-4xl'>The Best Source of Spiritual Knowledge.</p>
              <p className="py-6 mx-20 text-xl sm:text-2xl">This is an online platform for Comprehensive Learning Bhagavad Gita </p>
              <Link href="Chapters">
              <button className="mx-20 text-white bg-orange-500 btn hover:text-black">Get Started</button>
              </Link>
            </div>
          </div>
        </div>}
      {/* <Carousel/> */}
      <BooksCard />
      {/* <Chapters/> */}
      {/* <Quiz/> */}
      <ReviewCard />
      <AboutAuthor/>




      <Footer />
    </div>



  )
}
