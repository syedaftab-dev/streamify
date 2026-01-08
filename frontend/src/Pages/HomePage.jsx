import React from 'react'
import { useThemeStore } from '../store/useThemeStore';

function HomePage() {
  const {theme,setTheme} = useThemeStore();

  return (
    <div>
      Home
    </div>
  )
}

export default HomePage