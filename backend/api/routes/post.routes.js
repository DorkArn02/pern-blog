import express from "express"
import { createPost, deletePostById, getPostByID, getPosts, updatePostById } from "../controllers/post.controllers.js"
import { validateSchema, verifyToken } from "../middlewares/auth.middlewares.js"
import { postSchema } from "../validations/post.validations.js"

const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPostByID)
router.post('/', [verifyToken, validateSchema(postSchema)], createPost)
router.delete('/:id', [verifyToken], deletePostById)
router.put('/:id', [verifyToken, validateSchema(postSchema)], updatePostById)

export default router