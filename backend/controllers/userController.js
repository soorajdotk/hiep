const User = require('../models/userModel')
const Post = require('../models/postModel')
const Product = require('../models/productModel')
const Account = require('../models/accountModel')
const Designer = require('../models/designerModel')
const Message = require('../models/messageModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// USER CLASS

//LOGGING IN USER
const loginUser = async (req, res) => {

    const { email, password } = req.body

    try{
        const user = await User.login(email, password)

        const token = createToken(user._id)
        
        res.status(200).json({email, token, username:user.username, bio: user.bio, profilePicture: user.profilePicture, fullName: user.fullName, role: user.role, shippingAddress: user.shippingAddress})
    }catch(error){
        res.status(400).json({error: error.message})
    }
    
}

//USER SIGNUP
const signupUser = async (req, res) => {
    const { email, password, username } = req.body

    try{
        const user = await User.signup(email, password, username)
        
        const token = createToken(user._id)
        const account = Account.create({username})
        console.log(account)

        res.status(200).json({email, token, username, bio: user.bio, profilePicture: user.profilePicture, fullName: user.fullName, posts: user.post, role: user.role})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//UPDATE USER PROFILE
const updateProfile = async(req, res) => {
    const username = req.params.username;
    const updateFields = req.body
    console.log("reqest", req.body)
    const profilePicture = req.file? req.file.filename : ''
    updateFields.profilePicture = profilePicture
    console.log(updateFields)

    try{
        const user = await User.update(username, updateFields)

        if(!user){
            return res.status(400).json({error: 'User not found'})
        }

        console.log(user)
        res.status(200).json({user})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

//GET USER PROFILE
const getProfile = async(req, res) => {
    try{
        const username = req.params.username

        const otherUser = await User.findOne({ username })

        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json( otherUser )
    }catch(error){
        res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
    }
}

//FOLLOW USER
const followUser = async(req, res) => {
    const { username } = req.params
    const { followerUsername } = req.body

    try{
        const userToFollow = await User.findOne({ username })
        const follower = await User.findOne({username: followerUsername })

        if (!userToFollow || !follower) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.findOneAndUpdate({ username }, { $addToSet: { followers: followerUsername } })
        await User.findOneAndUpdate({ username: followerUsername }, { $addToSet: { following: username } })

        res.status(200).json({ message: "User followed successfully"})
    }catch(error){
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

//UNFOLLOW USER
const unfollowUser = async(req, res) => {
    const { username } = req.params
    const { followerUsername } = req.body

    try {
        const userToUnfollow = await User.findOne({ username });
        const follower = await User.findOne({ username: followerUsername });
    
        if (!userToUnfollow || !follower) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        await User.findOneAndUpdate({ username }, { $pull: { followers: followerUsername } });
        await User.findOneAndUpdate({ username: followerUsername }, { $pull: { following: username } });
    
        res.status(200).json({ message: 'User unfollowed successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const checkFollow = async(req, res) =>{
    const { username } = req.params
    const { currentUserUsername } = req.query

    try {
        const currentUser = await User.findOne({ username: currentUserUsername });
        const otherUser = await User.findOne({ username });
    
        if (!currentUser || !otherUser) {
          return res.status(404).json({ error: 'Users not found' });
        }
    
        const isFollowing = currentUser.following.includes(otherUser.username);
        const followersCount = otherUser.followers.length
        const followingCount = otherUser.following.length
    
        res.status(200).json({ isFollowing, followersCount, followingCount });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const verifyMail = async(req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error('Invalid or expired verification token.');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();
        
        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        // Handle errors (e.g., invalid token, expired token)
        res.status(400).json({ error: error.message });
    }
}

const userFeed = async(req, res) => {
    const { username } = req.params
    try{
        const user = await User.findOne({username})
        
        const usernames = [...user.following]
        console.log(usernames)

        const feedPosts = await Post.find({ 'author': { $in: usernames } })
        .sort({ createdAt: -1 })

        res.json({ feed: feedPosts });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const switchRole = async(req, res) => {
    const { username } = req.params;

    try {
        // Find the user by ID
            const user = await User.findOne({username});

        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        const { fullName, email, phone, designSkills, additionalComments } = req.body;

        
        // Validate required fields
        if (!fullName || !email || !phone || !designSkills) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate phone number format (you can use a library like 'phone' for more robust validation)
        // For simplicity, let's assume a valid phone number contains only digits and has a length of 10
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        if(phone.length<10){
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        const profilePicture = user.profilePicture


        // Create a new Designer document
        const newDesigner = new Designer({
            username,
            fullName,
            email,
            phone,
            designSkills,
            additionalComments,
            profilePicture
            // Add other fields as needed
        });

        // Save the new designer document to the database
        await newDesigner.save();

        user.role = 'designer';
        await user.save();

        res.json({ message: 'User role switched to designer successfully', user });
    } catch (error) {
        console.error('Error switching user role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getDesignerDetails = async(req, res) => {
    const { username } = req.params
    try {
        // Find the designer by username
        const designer = await Designer.findOne({ username });

        if (!designer) {
            return res.status(404).json({ message: 'Designer not found' });
        }

        // Send the designer details to the client
        res.status(200).json( designer );
    } catch (error) {
        console.error('Error fetching designer details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

const addToCart = async(req, res) => {
    const { productId } = req.params
    const { username } = req.body
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }
    
        await User.findOneAndUpdate({ username }, { $push: { cart: productId } })
        res.json({ message: "Item added to cart", user})
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const removeFromCart = async(req, res) =>{
    
    const { productId } = req.params
    const { username } = req.body
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }
    
        await User.findOneAndUpdate({ username }, { $pull: { cart: productId } })
        res.json({ message: "Item removed from cart", user})
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const addToWishlist = async(req, res) =>{
    const { productId } = req.params
    const { username } = req.body
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }
    
        await User.findOneAndUpdate({ username }, { $push: { wishlist: productId } })
        res.json({ message: "Item added to wishlist", user})
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const removeFromWishlist = async(req, res) => {
    const { productId } = req.params
    const { username } = req.body
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({ message: "User not found" })
        }
    
        await User.findOneAndUpdate({ username }, { $pull: { wishlist: productId } })
        res.json({ message: "Item removed from wishlist", user})
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const viewWishlist = async(req, res) => {
    const { username } = req.params
    try{
        const user = await User.findOne({username})

        const productId = [...user.wishlist]
        console.log(productId)
        
        const wishlistItems = await Product.find({ '_id': { $in: productId } })
        .sort({ createdAt: -1 })

        res.json({ wishlist: wishlistItems });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const checkWishlist = async(req, res) => {
    const { username, productId } = req.params
    try{
        const user = await User.findOne({username})
        

        const inWishlist = user.wishlist.includes(productId);

        return res.json({ inWishlist })
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editShippingAddress = async(req, res) => {
    const { username } = req.params
    const updateFields = req.body
    try{
        const user = await User.findOneAndUpdate(
            { username }, // Find user by username
            { $set: { "shippingAddress": updateFields } }, // Update shippingAddress object
            { new: true } // Return updated document
        );

        if(!user){
            return res.status(400).json({error: 'User not found'})
        }

        console.log(user.shippingAddress)
        res.status(200).json({shippingAddress: user.shippingAddress})
    }catch(error){
        console.error(error)
        res.status(500).json({ error: "Internal Server Error"})
    }
}

//SEARCHING OTHER USERS
const userSearchSuggestions = async(req, res) => {
    const { search } = req.query
    console.log(search)
    try{
        const users = await User.find({ username: { $regex: search, $options: 'i' } }).limit(10); // Limiting to 10 suggestions
        res.json(users);  
    }catch(error){
        console.error('Error fetching search suggestions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getFollowing = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const followingUsernames = user.following; // Assuming followers field contains usernames

        // Fetch user data for each follower
        const followingData = [];
        for (const followingUsername of followingUsernames) {
            const following = await User.findOne({ username: followingUsername });
            if (following) {
                followingData.push({
                    username: following.username,
                    fullName: following.fullName,
                    profilePicture: following.profilePicture,
                    lastMessageTime: null
                });
            }
        }

        for (const userData of followingData) {
            const lastMessage = await Message.findOne({ 
                $or: [
                    { sender: userData.username },
                    { recipient: userData.username },
                ]
            }).sort({ createdAt: -1 }).limit(1); // Get the latest message
            if (lastMessage) {
                userData.lastMessageTime = lastMessage.createdAt;
            }
        }

        followingData.sort((a, b) => {
            if (a.lastMessageTime && b.lastMessageTime) {
                return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
            } else if (a.lastMessageTime) {
                return -1; // Put users with lastMessageTime first
            } else if (b.lastMessageTime) {
                return 1; // Put users with lastMessageTime last
            } else {
                return 0; // Keep the order unchanged if both have null lastMessageTime
            }
        });

        return res.status(200).json({ following: followingData });
    } catch (error) {
        console.error('Error fetching following', error);
        return res.status(500).json({ error: 'Internal Server error' });
    }
}

const getFollowers = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const followerUsernames = user.followers; // Assuming followers field contains usernames

        // Fetch user data for each follower
        const followersData = [];
        for (const followerUsername of followerUsernames) {
            const follower = await User.findOne({ username: followerUsername });
            if (follower) {
                followersData.push({
                    username: follower.username,
                    fullName: follower.fullName,
                    profilePicture: follower.profilePicture
                });
            }
        }

        return res.status(200).json({ followers: followersData });
    } catch (error) {
        console.error('Error fetching following', error);
        return res.status(500).json({ error: 'Internal Server error' });
    }
}



module.exports = { signupUser, 
                    loginUser,
                    updateProfile,  
                    getProfile, 
                    followUser, 
                    unfollowUser, 
                    checkFollow, 
                    verifyMail, 
                    userFeed, 
                    switchRole, 
                    addToWishlist,
                    removeFromWishlist,
                    viewWishlist,
                    checkWishlist,
                    editShippingAddress,
                    userSearchSuggestions,
                    getFollowing,
                    getFollowers,
                    getDesignerDetails
                }