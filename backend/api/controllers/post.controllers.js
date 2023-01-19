import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { uuidSchema } from "../validations/post.validations.js"


export const getPosts = async (req, res) => {
    const post = await Post.findAll({ raw: true })
    const DTO = await Promise.all(post.map(async item => {
        const user = await User.findByPk(item.author)
        return { id: item.id, title: item.title, content: item.content, description: item.description, createdAt: item.createdAt, updatedAt: item.updatedAt, author: user.username, authorId: user.id }
    }))
    return res.json(DTO)
}

export const getPostByID = async (req, res) => {
    const { id } = req.params
    try {
        await uuidSchema.validate(id)
        const post = await Post.findByPk(id)
        if (post) {
            const comments = await Comment.findAll({ where: { post_id: post.id } })
            const user = await User.findByPk(post.author)

            const DTO = await Promise.all(comments.map(async item => {
                const user = await User.findByPk(item.author)
                return { id: item.id, content: item.content, createdAt: item.createdAt, updatedAt: item.updatedAt, author: user.username, authorId: user.id }
            }))
            return res.json({ id: post.id, title: post.title, content: post.content, description: post.description, createdAt: post.createdAt, updatedAt: post.updatedAt, author: user.username, authorId: user.id, comments: DTO })
        }
        return res.status(404).json({ error: "Post does not exists" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const createPost = async (req, res) => {
    const { title, description, content } = req.body
    const user = req.user

    const newPost = await Post.create({ title, description, content, author: user.id })

    if (newPost) {
        return res.status(201).json(newPost)
    }
    return res.status(500).json({ error: "Server error" })
}

export const deletePostById = async (req, res) => {
    const { id } = req.params

    try {
        await uuidSchema.validate(id)
        const user = await User.findByPk(req.user.id)
        const post = await Post.findByPk(id)

        if (post) {
            if (user.id === post.author) {
                await Post.destroy({ where: { id } })
                return res.send({ message: "Post deleted" })
            }
            return res.status(403).json({ error: "You can only delete your posts" })
        } else {
            return res.status(404).json({ error: "Post does not exist" })
        }
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const updatePostById = async (req, res) => {
    const { id } = req.params
    const { title, description, content } = req.body
    const user = req.user

    try {
        await uuidSchema.validate(id)
        const post = await Post.findByPk(id)
        if (post) {
            if (user.id === post.author) {
                await Post.update({ title, description, content }, { where: { id } })
                return res.status(200).json({ message: "Post updated" })
            }
            return res.status(403).json({ error: "You can only delete your posts" })
        }
        return res.status(404).json({ error: "Post does not exist" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}