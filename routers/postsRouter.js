const express = require('express')
const { postsController } = require('../controllers')
const {auth} = require('../helpers/auth')

const router = express.Router()

router.get('/getPosts', auth, postsController.getPosts)
router.post('/addPost', auth, postsController.addPost)
router.delete('/deletePost/:id', auth, postsController.deletePost)
router.put('/editpost:id',auth, postsController.editPost)

module.exports = router