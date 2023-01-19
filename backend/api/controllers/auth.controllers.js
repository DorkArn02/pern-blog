import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const registerUser = async (req, res) => {
    const { username, password, email } = req.body

    const user = await User.findOne({ where: { username, email } })

    if (!user) {
        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(password, salt).then((encrypted) => {
                User.create({ username, password: encrypted, email }).then((response) => {
                    return res.status(201).json({ response })
                }).catch((error) => {
                    return res.status(500).json({ error: error.message })
                })
            })
        })
    } else {
        return res.status(409).json({ error: "Username or email exists" })
    }

}

export const loginUser = async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ where: { username } })

    if (user) {
        bcrypt.compare(password, user.password).then((loginResult) => {
            if (!loginResult) {
                return res.status(401).json({ error: "Wrong credentials" })
            } else {
                let token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: "15m" })

                // 15 minutes
                res.cookie("access-token", token, { maxAge: 900000, httpOnly: true })

                return res.status(200).json({
                    id: user.id,
                    username: user.username,
                    email: user.email
                })
            }
        })
    } else {
        return res.status(404).json({ error: "Username not found" })
    }

}

export const checkCookie = (req, res) => {
    const accessToken = req.cookies['access-token']

    if (!accessToken) {
        return res.status(401).json({ error: 'Not token provided for auth' })
    }

    try {
        jwt.verify(accessToken, process.env.SECRET)

        return res.status(200).json({ message: "OK" })

    } catch (error) {
        return res.status(403).json({ error: "Invalid token provided" })
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie('access-token')
    return res.status(200).json({ message: "Logged out" })
}