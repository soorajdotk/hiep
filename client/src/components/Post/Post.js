import React, { useEffect,useState } from 'react'
import './ProfilePost.css'
import { FaHeart, FaRegHeart, FaTrash, FaRegComment, FaComment } from 'react-icons/fa6'
import { useAuthContext } from '../../hooks/useAuthContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import PostLikes from '../PostLikes/PostLikes'
import { Link } from 'react-router-dom'
import PostComments from '../PostComments/PostComments'

const Post = ({post, onDelete}) => {
  const { user } = useAuthContext()
  const [isLiked, setIsLiked] = useState(post.likes.includes(user.username))
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const [ showPostLikes, setShowPostLikes] = useState(false)
  const[postAuthor, setPostAuthor] = useState(null)
  const [taggedProduct, setTaggedProduct] = useState(null)
  const[isComment, setIsComment] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/user/${post.author}`, {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        console.log(data)
        setPostAuthor(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchUser()

    const getTaggedProducts = async() =>{
      try{
        const response = await fetch(`http://localhost:4000/api/posts/view-tagged-products/${post._id}`)
        if(!response.ok){
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const tdata = data.taggedProductId
        setTaggedProduct(tdata)
        console.log("tagged",taggedProduct)
      }catch (error) {
        console.error("Error: ", error);
      }
    }

    getTaggedProducts()
  }, [])


  const handleLikePost = async() => {
    try{
      const endpoint = isLiked ? 'unlike' : 'like';
      const response = await fetch(`http://localhost:4000/api/posts/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post._id,
          username: user.username,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to like/unlike post');
      }

      // Update local state based on the response
      const data = await response.json();
      setIsLiked(!isLiked);
      setLikeCount(data.updatedPost.likes.length);
    }catch(error){
      console.error("Error:", error)
    }
  }

  const handleCommentPost = () => {
    if(isComment){
      setIsComment(false)
    }else{
      setIsComment(true)
    }
  }

  const handleViewLikers = () =>{
    setShowPostLikes(true)
    console.log(post)
  }

  const handleCloseLikers = () => {
    setShowPostLikes(false);
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }), // Pass the user ID or any necessary data for authentication
      });

      if (response.ok) {
        // If deletion is successful, invoke the onDelete callback to update the UI
        onDelete(post._id);
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const profilePicture = postAuthor && postAuthor.profilePicture !=='' ? require(`../../images/${postAuthor.profilePicture}`) : null

    return (
      <div>
        <img src={profilePicture} alt="" className='profile-picture' />
        <h4 className='author-name'>
          <Link to={`/${post.author}`}>{post.author}</Link>
          {taggedProduct && (
            <Link to={`/product/${taggedProduct}`}>
              <MdOutlineProductionQuantityLimits size={30} className='product-icon' />
            </Link>
          )}
        </h4>
        <img src={require(`../../images/${post.image}`)} alt={post.caption} className='post-modal-image' /> 
        <div className="post-interactions">
          <h5 onClick={handleViewLikers} className="post-text">{likeCount} likes</h5>
          {user.username === post.author && ( <button className='delete-btn' onClick={handleDeletePost}>
          <FaTrash size={20} />
          </button>
        )}
        {!isLiked? (
          <FaRegHeart
            size='30px'
            color="#810541"
            className="post-button"
            onClick={handleLikePost}
          />
        ) : ( 
          <FaHeart
            size='30px'
            color="#810541"
            className="post-button"
            onClick={handleLikePost}
          />)}
          {!isComment? (
            <FaRegComment size={30} color='#810541' className='post-button' onClick={handleCommentPost}/>
            ) : (
              <FaComment size={30} color='#810541' className='post-button' onClick={handleCommentPost} />
            )
          }
          <p className="post-text"><strong>{post.author} </strong><small>  {post.caption}</small></p>
          <p className="post-text"><small>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true})}</small></p>
          {isComment && <PostComments postId={post._id} user={user}/> }
        </div>
        {showPostLikes && <PostLikes likers={post.likes} onClose={handleCloseLikers} /> }
      </div>
  )
}

export default Post
