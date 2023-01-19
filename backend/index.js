import express from "express"
import dotenv from "dotenv"
import authRouter from "./api/routes/auth.routes.js"
import postRouter from "./api/routes/post.routes.js"
import userRouter from "./api/routes/user.routes.js"
import commentRouter from "./api/routes/comment.routes.js"
import cookieParser from "cookie-parser"
import { initializeSequelize } from "./api/db/database.js"
import Comment from "./api/models/Comment.js"
import Post from "./api/models/Post.js"
import User from "./api/models/User.js"
import cors from "cors"
import multer from "multer"
import { verifyToken } from "./api/middlewares/auth.middlewares.js"
import fs from "fs"

const app = express()
dotenv.config()

app.use(express.json())

initializeSequelize()

const storage = multer.diskStorage({
    destination: "./public",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
})


await User.sync()
await Post.sync()
await Comment.sync()

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser())
app.use('/auth', authRouter)
app.use('/posts', postRouter)
app.use('/comments', commentRouter)
app.use('/users', userRouter)

app.post("/users/profile", verifyToken, upload.single("file"), async (req, res) => {
    const { id } = req.user
    const user = await User.findByPk(id)
    if (user) {
        if (user.thumbnail !== "default.png") {
            if (fs.existsSync(`./public/${user.thumbnail}`)) {
                fs.unlink(`./public/${user.thumbnail}`, (err) => { err ? console.error(err) : "" })
            }
        }

        await User.update({ thumbnail: req.file.filename }, { where: { id } })

        if (!req.file) {
            return res.send({
                error: "No file selected"
            })
        }

        return res.status(200).json({ message: "OK" })
    }
    return res.status(404).json({ error: "User does not exists" })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server is listening on :${PORT}`)
})