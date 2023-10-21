"use client"
import Image from 'next/image'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
// import Chapters from './components/Chapters'
import VerseDay from './components/VerseDay'
// import Carousel from './components/Carousel'
import Quiz from './components/Quiz'
import BooksCard from './components/BooksCard'


export default function Home() {
  return (
    <div>
      <Navbar />
      {
      <div className="flex justify-center bg-gray-200">
  <div className="flex-col mx-8 hero-content lg:flex-row-reverse ">
    <img src="https://vedabase.io/static/img/vedabase-logo.svg" className="max-w-sm rounded-lg md:w-3/5 md:h-4/5" />
    <div className='justify-start'>
      <h1 className="mx-20 my-4 text-3xl font-bold">Bhaktivedanta GitaLearn</h1>
      <p className='mx-20 text-4xl font-medium'>The best source of spiritual knowledge.</p>
      <p className="py-6 mx-20 text-2xl">This is an online platform for Comprehensive Learning Bhagavad Gita </p>
      <button className="mx-20 text-white bg-orange-300 btn hover:bg-orange-500 ">Get Started</button>
    </div>
  </div>
</div>}
     {/* <Carousel/> */}
     <BooksCard/>
      {/* <Chapters/> */}
      {/* <Quiz/> */}
      
      
     
      
      <Footer/>
    </div>

    
    
  )
}
