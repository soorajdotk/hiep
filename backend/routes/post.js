const express = require('express')

const router = express.Router()

const {
    uploadPost,
    getPosts,
    likePost,
    unlikePost,
    deletePost,
    viewTaggedProducts,
    getComments,
    postComments
} = require('../controllers/postController.js')

const multer = require('multer')
const requireAuth = require('../middleware/requireAuth.js')

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

router.post('/upload',  upload.single("image"),  uploadPost)
router.get('/:username',  getPosts)
router.post('/like',  likePost)
router.post('/unlike',  unlikePost)
router.delete('/:postId', deletePost)
router.get('/view-tagged-products/:postId', viewTaggedProducts)
router.get('/:postId/comments', getComments)
router.post('/:postId/comments', postComments)

module.exports = router