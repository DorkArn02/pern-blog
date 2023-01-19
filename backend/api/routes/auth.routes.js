import express from "express"
import { checkCookie, loginUser, logoutUser, registerUser } from "../controllers/auth.controllers.js"
import { userLoginSchema, userRegisterSchema } from "../validations/auth.validations.js"
import { validateSchema } from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.post('/register', validateSchema(userRegisterSchema), registerUser)
router.post('/login', validateSchema(userLoginSchema), loginUser)
router.post('/logout', logoutUser)
router.post('/check', checkCookie)

export default router