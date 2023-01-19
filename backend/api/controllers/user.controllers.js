import User from "../models/User.js"
import { uuidSchema } from "../validations/post.validations.js"

export const getUserById = async (req, res) => {
    const { id } = req.params

    try {
        await uuidSchema.validate(id)
        const user = await User.findByPk(id)

        if (user) {
            return res.json({ username: user.username, email: user.email, createdAt: user.createdAt })
        }
        return res.status(404).json({ error: "User does not exists" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

}

export const getUserPicture = async (req, res) => {
    const { id } = req.params

    try {
        await uuidSchema.validate(id)
        const user = await User.findByPk(id)
        if (user) {
            const thumbnail = user.thumbnail

            return res.sendFile(`./public/${thumbnail}`, { root: '.' })
        }
        return res.status(404).json({ error: "User does not exists" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const editUserById = async (req, res) => {
    const { id } = req.params
    const { username, email } = req.body
    const user2 = req.user

    try {
        await uuidSchema.validate(id)
        const user = await User.findByPk(id)
        if (user) {
            if (user.id === user2.id) {
                await User.update({ username, email }, { where: { id: user.id } })
                return res.status(200).json({ message: "User details updated" })
            }
            return res.status(403).json({ error: "You can only edit your profile" })
        }
        return res.status(404).json({ error: "User does not exists" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

export const deleteUserById = async (req, res) => {
    const { id } = req.params
    const user2 = req.user

    try {
        await uuidSchema.validate(id)
        const user = await User.findByPk(id)
        if (user) {
            if (user.id === user2.id) {
                await User.destroy({ where: { id: user.id } })
                return res.send({ message: "User deleted" })
            }
            return res.status(403).json({ error: "You can only delete your profile" })
        }
        return res.status(404).json({ error: "User does not exists" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}