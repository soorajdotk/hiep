const express = require('express')

const router = express.Router()

const {
    loginUser,
    signupUser,
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
    getShippingAddress,
    userSearchSuggestions,
    getFollowing,
    getFollowers,
    getDesignerDetails
} = require('../controllers/userController')

router.post('/login', loginUser)


router.post('/signup', signupUser)


const multer = require('multer')

    const storage = multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, '../client/src/images')
      },
      filename: function(req, file, cb){
        const uniqueSuffix = Date.now()
        cb(null,uniqueSuffix + file.originalname)
      }
    })

const upload = multer({ storage: storage })

router.patch('/update/:username',upload.single('profilePicture'), updateProfile)

router.get('/:username', getProfile)

router.put('/follow/:username', followUser)
router.put('/unfollow/:username', unfollowUser)
router.get('/check-follow/:username', checkFollow)
router.get('/feed/:username', userFeed)
router.put('/:username/switch-role', switchRole)
router.get('/:username/designer-details', getDesignerDetails)
router.put('/add-to-wishlist/:productId', addToWishlist)
router.put('/remove-from-wishlist/:productId', removeFromWishlist)
router.get('/view-wishlist/:username', viewWishlist)
router.get('/check-wishlist/:username/:productId', checkWishlist )
router.put('/:username/shipping-address', editShippingAddress)
router.get('/users/suggestions', userSearchSuggestions)
router.get('/get-following/:username', getFollowing)
router.get('/get-followers/:username', getFollowers)
// router.get('/verify', verifyMail)


module.exports = router