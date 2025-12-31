import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';
const useSignUp = ()=>{

    const queryClient = useQueryClient();
    
    const {mutate, isPending, error} = useMutation({
    mutationFn:signup,
    // on successfull signup we have to render the home page
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["authUser"]})
  });

  return {error,isPending,signupMutation:mutate}

}
export default useSignUp;