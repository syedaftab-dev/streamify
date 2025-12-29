import React, { use, useEffect, useState } from 'react'
import {Routes,Route, Navigate} from "react-router"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import NotificationsPage from "./pages/NotificationsPage"
import OnboardingPage from "./pages/OnboardingPage"
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import toast,{Toaster} from "react-hot-toast"
import { axiosInstance } from './lib/axios'
import { useQuery } from '@tanstack/react-query'

function App() {

  const {data:authData,isLoading,error}=useQuery({
    queryKey:["authUser"],
    queryFn: async ()=>{
      const res=await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false, // fetch only once
  })

  // console.log(data);

  const authUser = authData?.user; // this will cntain the authenticated user data if logged in other wise undefined

  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login" />}/> 
        {/* if user is authenticated then only goto homepage other wise navigate to login api(page) */}
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/" />}/>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/>}/>
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login"/>}/>
        <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login"/>}/>
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login"/>}/>
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login"/>}/>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
