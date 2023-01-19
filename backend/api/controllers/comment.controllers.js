import Comment from "../models/Comment.js"
import User from "../models/User.js"
import { uuidSchema } from "../validations/post.validations.js"

export const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params

    try {
        await uuidSchema.validate(postId)
        const comments = await Comment.findAll({ where: { post_id: postId } })
        const user = await User.findOne({ where: { id: comments.author } })
        return res.json({ id: comments.id, content: comments.content, createdAt: comments.createdAt, updatedAt: comments.updatedAt, post_id: comments.post_id, authorId: comments.author, author: user.username })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const createCommentToPost = async (req, res) => {
    const { content } = req.body
    const { postId } = req.params
    const user = req.user

    try {
        await uuidSchema.validate(postId)
        const newComment = await Comment.create({ content, post_id: postId, author: user.id })
        if (newComment) {
            return res.status(201).json(newComment)
        } else {
            return res.status(500).json({ error: "Server error" })
        }
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteCommentFromPost = async (req, res) => {
    const { id } = req.params
    try {
        await uuidSchema.validate(id)
        const user = await User.findByPk(req.user.id)
        const comment = await Comment.findByPk(id)

        if (comment) {
            if (user.id === comment.author) {
                await Comment.destroy({ where: { id } })
                return res.status(200).json({ message: "Comment deleted" })
            }
            return res.status(403).json({ error: "You can only delete your comments" })
        } else {
            return res.status(404).json({ error: "Comment does not exist" })
        }
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const updateCommentById = async (req, res) => {
    const { id } = req.params
    const { content } = req.body
    const user = req.user

    try {
        await uuidSchema.validate(id)
        const comment = await Comment.findByPk(id)
        if (comment) {
            if (user.id === comment.author) {
                await Post.update({ content }, { where: { id } })
                return res.json({ message: "Comment updated" })
            }
            return res.status(403).json({ error: "You can only delete your comments" })
        }
        return res.status(404).json({ error: "Comment does not exist" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}