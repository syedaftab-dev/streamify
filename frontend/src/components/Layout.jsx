import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ showSidebar = false, children }) => {
  return (
    <div className='layout min-h-screen'>
    {/* left sidebar is true and right side navbar and main content */}
     <div className='flex'> 
         {showSidebar && <Sidebar/>}
         <div className='flex-1 flex flex-col'>
            <Navbar/>
            <main>
                {children}
            </main>
         </div>
     </div>
    </div>
  )
}

export default Layout
