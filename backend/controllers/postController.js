// controllers/postController.js
const User = require('../models/userModel');
const Post = require('../models/postModel')
const Comments = require('../models/commentsModel')

// POST CLASS

//UPLOAD POST
const uploadPost = async (req, res) => {
    console.log(req.body)
    console.log(req.file)
    
    const { username, caption, tags} = req.body
    const imageName = req.file.filename


    try{
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newPost = await User.createPost(user.username, imageName, caption, tags);
      res.status(201).json({ post: newPost });
    } catch (error) {
    res.status(500).json({ error: 'Failed to create post', message: error.message });
  }
};

//GETPOSTS
const getPosts = async(req, res) => {
  const username = req.params.username
  
  const userPosts = await Post.find({ author: username }).sort({ createdAt: -1})
  res.status(200).json({userPosts})
}

//LIKE POST
const likePost = async (req, res) => {
  try {
    console.log(req.body.postId, req.body.username)
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.username } },
      { new: true }
    );
    console.log(result);
    res.status(200).json({ message: 'Post liked!', updatedPost: result });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while liking the post' });
  }
};

//UNLIKE POST
const unlikePost = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.username } },
      { new: true }
    );
    res.status(200).json({ message: 'Post Unliked!', updatedPost: result });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while liking the post' });
  }
};

//DELETE POST
const deletePost = async(req, res) => {
  const postId = req.params.postId
  try {
    console.log(postId)

    const deletedPost = await Post.deleteOne({ _id: postId});

    await User.updateMany(
      { posts: postId },
      { $pull: { posts: postId } }
    );

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// VIEW TAGGED PRODUCTS
const viewTaggedProducts = async (req, res) => {
  const { postId } = req.params;

  try {
    // Retrieve the post document from the database
    const post = await Post.findById(postId);
    
    // Check if the post exists
    if (!post) {
      console.error('Post not found');
      return res.status(404).json({ error: 'Post not found' });
    }

    // Retrieve the tagged product IDs from the post
    const taggedProductId = post.tags;

    // Check if there are tagged products
    if (!taggedProductId) {
      console.log('No tagged products found for this post');
      return res.status(201).json({taggedProductId : null});
    }

    return res.status(201).json({taggedProductId})

  } catch (error) {
    console.error('Error viewing tagged products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//GET COMMENTS
const getComments = async(req, res) => {
  const {postId} = req.params
  try{
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Fetch comments for the given postId
    const comments = await Comments.find({ postId });
    res.json({ comments });
  }catch(error){
    console.error(error)
    res.status(500).json({error: 'Interanal Server Error'})
  }
}

//POST COMMENTS
const postComments = async(req, res) => {
  const {postId} = req.params
  const { username, content } = req.body;

  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create the new comment
    const comment = new Comments({
      postId,
      username,
      content,
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



module.exports = {
  uploadPost,
  getPosts,
  likePost,
  unlikePost,
  deletePost,
  viewTaggedProducts,
  getComments,
  postComments
};
