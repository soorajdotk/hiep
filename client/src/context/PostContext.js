import React, { createContext, useReducer } from 'react'

export const PostContext = createContext()

export const PostReducer = (state, action) => {
    switch(action.type){
        case 'SET_POSTS':
            return{
                ...state,
                posts: action.payload
            }
        default:
            return state
    }
}

const PostContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(PostReducer, {
        posts:[]
    })

    return(
        <PostContext.Provider value={{...state, dispatch}}>
            {children}
        </PostContext.Provider>
    )
}


export default PostContextProvider