"use client"
import Image from 'next/image'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Chapters from './components/Chapters'
import VerseDay from './components/VerseDay'
// import Carousel from './components/Carousel'
import Quiz from './components/Quiz'
import BooksCard from './components/BooksCard'


export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen hero" style={{backgroundImage: 'url(https://png.pngtree.com/thumb_back/fh260/background/20230524/pngtree-the-hindu-god-lord-krishna-is-depicted-image_2682659.jpg)'}}>
        
        <div className="text-center hero-content text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-white">Gita Learn</h1>
            <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
     <VerseDay/> 
     {/* <Carousel/> */}
     <BooksCard/>
      <Chapters/>
      <Quiz/>
      
      
     
      
      <Footer/>
    </div>

    
    
  )
}
