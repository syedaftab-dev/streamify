import React from 'react'
import {Routes,Route} from "react-router"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import NotificationsPage from "./pages/NotificationsPage"
import OnboardingPage from "./pages/OnboardingPage"
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import toast,{Toaster} from "react-hot-toast"

function App() {
  return (
    <div className="h-screen" data-theme="night">
      <button onClick={()=>toast.success("hello world!")}>
        Show Toast
      </button>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={ <SignUpPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/notifications" element={<NotificationsPage />}/>
        <Route path="/onboarding" element={<OnboardingPage />}/>
        <Route path="/call" element={<CallPage />}/>
        <Route path="/chat" element={<ChatPage />}/>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
