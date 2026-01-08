import { useState } from "react";
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async(email, password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({email, password})
        })
        const user = await response.json()
        console.log(user)

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
            }));

            dispatch({type: 'LOGIN', payload: user})

            setIsLoading(false)
        }
    }

    return { login,  isLoading, error }
}