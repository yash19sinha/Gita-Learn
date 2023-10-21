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
      <div className=" bg-gray-200">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <img src="https://vedabase.io/static/img/vedabase-logo.svg" className="max-w-sm rounded-lg " />
    <div>
      <h1 className="text-3xl font-bold my-4 mx-20">Bhaktivedanta GitaLearn</h1>
      <p className='mx-20 text-4xl'>The best source of spiritual knowledge.</p>
      <p className="py-6 mx-20 text-2xl">This is an oline platform for Comprehensive Learning Bhagavad Gita </p>
      <button className="btn btn-primary bg-blue-700 mx-20 text-white">Get Started</button>
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
