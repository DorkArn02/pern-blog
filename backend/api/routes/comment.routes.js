import express from "express"
import { createCommentToPost, deleteCommentFromPost, getCommentsByPostId, updateCommentById } from "../controllers/comment.controllers.js"
import { validateSchema, verifyToken } from "../middlewares/auth.middlewares.js"
import { commentSchema } from "../validations/comment.validations.js"

const router = express.Router()

router.get('/:postId', getCommentsByPostId)
router.post('/:postId', [verifyToken, validateSchema(commentSchema)], createCommentToPost)
router.delete('/:id', [verifyToken], deleteCommentFromPost)
router.put('/:postId/:commentId', [verifyToken, validateSchema(commentSchema)], updateCommentById)

export default router