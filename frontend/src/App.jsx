import React from 'react'
import {Routes,Route, Navigate} from "react-router"
import HomePage from './Pages/HomePage.jsx'
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import NotificationsPage from "./pages/NotificationsPage"
import OnboardingPage from "./pages/OnboardingPage"
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import {Toaster} from "react-hot-toast"
import PageLoader from './components/PageLoader'
import { useAuthUser } from './hooks/useAuthUser.js'
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'
import { LayoutGrid } from 'lucide-react'

function App() {

  const {isLoading,authUser} = useAuthUser(); // will will goto auth/me and get the authenticated user from backend
  const {theme} = useThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded; // checks if the user is already onboarded

  if(isLoading){
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-base-100" data-theme={theme}>
      <Routes>
       
        {/* if user is authenticated and onboarded just redirect to home page orelse if not authenticated to login orelse onboarding page */}
        <Route path="/" element={
          isAuthenticated && isOnboarded ? 
          <Layout showSidebar={true}>
            <HomePage/>
          </Layout> : <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
        }/> 

        <Route path="/signup" element={ !isAuthenticated ? <SignUpPage /> : (
          !isOnboarded ? <Navigate to="/onboarding" /> : <Navigate to="/"/>
        )}/>
        
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : 
        (
          !isOnboarded ? <Navigate to="/onboarding" /> : <Navigate to="/"/>
        )}/>
        
        <Route path="/notifications" element={isAuthenticated ? (
          <Layout showSidebar={true}>
            <NotificationsPage/>
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
        )}/>
        
        
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login"/>}/>
        
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={false}>
            <ChatPage/>
          </Layout>
        ):(
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"}/>
        )}/>
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
