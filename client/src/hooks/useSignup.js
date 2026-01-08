import { useState } from "react";
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async(email, password, username) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('http://localhost:4000/api/user/signup', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({email, password, username})
        })
        const user = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(user.error)
        }
        if(response.ok){
            localStorage.setItem('user', JSON.stringify({
                email: user.email,
                username: user.username,
                bio: user.bio, // Assuming these fields are provided by the server upon signup
                profilePicture: user.profilePicture,
                fullName: user.fullName,
                posts: user.posts,
                role: user.role,
                shippingAddress: user.shippingAddress
            }));


            dispatch({type: 'LOGIN', PAYLOAD: user})

            setIsLoading(false)
        }
    }

    return { signup,  isLoading, error }
}