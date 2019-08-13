const express = require('express')
const { postsController } = require('../controllers')

const router = express.Router()

router.get('/getPosts', postsController.getPosts)
router.post('/addPost', postsController.addPost)
router.delete('/deletePost/:id', postsController.deletePost)

module.exports = router