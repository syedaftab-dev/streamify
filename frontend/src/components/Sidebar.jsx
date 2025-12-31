import React from 'react'
import { useAuthUser } from '../hooks/useAuthUser'
import {Link, useLocation} from "react-router"
import { BellIcon, HomeIcon, ShipWheelIcon,UserIcon } from 'lucide-react';

function Sidebar() {

  const {authUser} = useAuthUser();
  const location =  useLocation(); // will return the current location object example {pathname: "/login", search: "", hash: "", state: null, key: "abc123"}
  const currentPath = location.pathname; // will give the current path like "/login" or "/signup"
  console.log(currentPath);
  return (
    <aside className='w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col sticky top-0 h-screen'>
      {/* logo on top */}
      <div className='p-5 border-b border-base-300'>
        <Link to="/" className='flex items-center gap-2.5'>
          <ShipWheelIcon className='size-9 text-primary'/>
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
            Streamify
          </span>
        </Link>
      </div>
      {/* sidebar options block*/}
      <nav className='flex-1 p-4 space-y-1'>
        <Link to="/" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
          currentPath === "/" ? "btn-active" : ""
        }`}>
          <HomeIcon className='size-5 text-base-content opacity-70'/>
          <span>Home</span>
        </Link>

        <Link to="/friends" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
          currentPath === "/friends" ? "btn-active" : ""
        }`}>
          <UserIcon className='size-5 text-base-content opacity-70'/>
          <span>Friends</span>
        </Link>

        <Link to="/notifications" className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
          currentPath === "/notifications" ? "btn-active" : ""
        }`}>
          <BellIcon className='size-5 text-base-content opacity-70'/>
          <span>Notifications</span>
        </Link>
      </nav>
      {/* user profile section at the bottom */}
        {/* mt-auto  will be pushed bottom*/}
      <div className='p-4 border-t border-base-300 mt-auto'>
        <div className='flex items-center gap-3'>
          {/* left side avatar */}
          <div className='avatar'>
            <div className='w-10 rounded-full'>
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          {/* right main username aur uske niche online */}
          <div className='flex-1'>
            <p className='font-semibold text-sm'>{authUser?.fullName}</p>
            <p className='text-xs text-success flex items-center gap-1'>
              <span className='size-2 rounded-full bg-success inline-block'>
              </span>
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
