import { useAuthContext } from "./useAuthContext"

export const useUpdate = () =>{
    const { user, dispatch } = useAuthContext()

    const username = user.username

    const update = async(fullName, profilePicture, bio ) => {
        const formData = new FormData()
        formData.append('fullName', fullName)
        formData.append('profilePicture', profilePicture)
        formData.append('bio', bio)

        const response = await fetch(`http://localhost:4000/api/user/update/${username}`, {
            method:'PATCH',
              body: formData
        })
        
        if(!response.ok){
            const errorData = await response.json()
            throw new Error(errorData.error)
        }

        const updatedUser = await response.json()


        dispatch({ type: 'UPDATE', payload: updatedUser})
    }

    return { update }
}