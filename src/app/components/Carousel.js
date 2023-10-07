import React from 'react'

const Carousel = () => {
  return (
    
      <div className="w-full h-screen carousel">
        <div id="slide1" className="relative w-full carousel-item ">
            <img src="https://www.crafttrip.in/image/cache/catalog/radha-krishna/radha-krishna-love-krishna-bhagwan-painting-on-canvas-800x534w.jpg" className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" className="btn btn-circle">❮</a> 
            <a href="#slide2" className="btn btn-circle">❯</a>
            </div>
        </div> 
        <div id="slide2" className="relative w-full carousel-item">
            <img src="https://www.crafttrip.in/image/cache/catalog/radha-krishna/radha-krishna-love-krishna-bhagwan-painting-on-canvas-800x534w.jpg" className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle">❮</a> 
            <a href="#slide3" className="btn btn-circle">❯</a>
            </div>
        </div> 
        <div id="slide3" className="relative w-full carousel-item">
            <img src="https://www.crafttrip.in/image/cache/catalog/radha-krishna/radha-krishna-love-krishna-bhagwan-painting-on-canvas-800x534w.jpg" className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle">❮</a> 
            <a href="#slide4" className="btn btn-circle">❯</a>
            </div>
        </div> 
        <div id="slide4" className="relative w-full carousel-item">
            <img src="https://www.crafttrip.in/image/cache/catalog/radha-krishna/radha-krishna-love-krishna-bhagwan-painting-on-canvas-800x534w.jpg" className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" className="btn btn-circle">❮</a> 
            <a href="#slide1" className="btn btn-circle">❯</a>
            </div>
        </div>
        </div>
    
  )
}

export default Carousel
