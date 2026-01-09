import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFriendRequests, getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import { UsersIcon } from 'lucide-react';
import { Link } from 'react-router';
import NoFriendsFound from '../components/NoFriendsFound';

function HomePage() {
  const queryClient = useQueryClient();

  // state for send request button  
  const [outgoingRequestsIds,setOutgoingRequestsIds]=useState(new Set());

  // to fetch users which are friends to display on home page 
  const {data:friends=[],isLoading:loadingFriends} = useQuery({
    queryKey: ["friends"],
    queryFn: getFriendRequests
  })

  // to fecth user who are not friends and display them on home page
   const {data:recommendedUsers=[],isLoading:loadingUsers} = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers
  })

  // get the data of outgoing request or which we freinds request some one
  const {data:outgoingFriendReqs} = useQuery({
    queryKey:["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs
  })
  // mutation to modify friends requests which are accepted or pending

  const {mutate: sendRequestMutation,isPending} = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["outgoingFriendReqs"]})
  })

  // update the state for outgoing freid req or add all outgoing request  
  useEffect(()=>{
    const outgoingIds = new Set();
    if(outgoingFriendReqs && outgoingFriendReqs.length > 0){
      outgoingFriendReqs.forEach((req)=>{
        outgoingIds.add(req.id)
      })
      setOutgoingRequestsIds(outgoingIds)
    }
  },[outgoingFriendReqs])


  return (
    <div className='p-4 sm:p-6 lg:p-8'>
        <div className='container mx-auto space-y-10'>
          {/* header div  */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friend</h2>
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className='mr-2 size-4'/>
              Friend Requests
            </Link>
          </div>

          {/* Friends divs */}
          {/* if loadingfriends exist show loading or else check friends array lenght if 0 no friends else display friends cards */}
          {loadingFriends ? (
            <div className='flex justify-center py-12'>
              <span className='laoding loading-spinner loading-lg'></span>
            </div>
          ) : (friends.length === 0 ? (
            <NoFriendsFound/>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {friends.map((friend)=>(
                <FriendCard key={friend._id} friend = {friend}/>
              ))}
            </div>
          ))}
        </div>
    </div>
  )
}

export default HomePage