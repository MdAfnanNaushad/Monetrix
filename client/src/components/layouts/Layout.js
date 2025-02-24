import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className='d-flex flex-column min-vh-100"'>
      <Header />
      <div className='content flex-grow-1'>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
