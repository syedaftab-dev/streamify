import { getAuthUser } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

// will goto auth/me and get the user 
export const useAuthUser = ()=>{
    const authUser=useQuery({
    queryKey:["authUser"],
    queryFn: getAuthUser,
    retry: false, // fetch only once
  });

  return {isLoading:authUser.isLoading,authUser:authUser.data?.user}
} 