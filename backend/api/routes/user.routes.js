import express from "express"
import { deleteUserById, editUserById, getUserById, getUserPicture } from "../controllers/user.controllers.js"
import { validateSchema, verifyToken } from "../middlewares/auth.middlewares.js"
import { userSchema } from "../validations/user.validations.js"

const router = express.Router()

router.get("/:id", getUserById)
router.get("/picture/:id", getUserPicture)
router.delete("/:id", [verifyToken], deleteUserById)
router.put("/:id", [verifyToken, validateSchema(userSchema)], editUserById)

export default router