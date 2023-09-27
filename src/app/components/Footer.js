import React from 'react'

export const Footer = () => {
  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
    <nav>
      <header className="footer-title">About PrabhuPada World</header> 
      <a className="link link-hover">PrabhuPada World is a humble attempt to deliver the Timeless Vedic Wisdom </a>
      <a className="link link-hover">on the authority of his Divine Grace A.C. Bhaktivedanta Swami Srila</a>
      <a className="link link-hover">Prabhupada.</a>
      
    </nav> 
    <nav>
      <header className="footer-title"><b>Important Links</b></header> 
      <a className="link link-hover">Privacy Policy</a>
      <a className="link link-hover">Terms & Conditions</a>
      <a className="link link-hover">Blog</a>
    </nav> 
    <nav>
      <header className="footer-title">Usefull Links</header> 
      <a className="link link-hover">Who is Srila Prabhupada</a>
      <a className="link link-hover">Contact Us</a>
      <a className="link link-hover">Shop</a>
      <a className="link link-hover">Common Questions</a>
      <a className="link link-hover">HKM Mumbai</a>
    </nav>
  </footer>
  )
}
