import jwt from "jsonwebtoken"

export const validateSchema = (schema) => async (req, res, next) => {
    const body = req.body
    try {
        await schema.validate(body)
        next()
    } catch (error) {
        return res.status(400).json({ error: "All fields are required" })
    }
}

export const verifyToken = (req, res, next) => {
    const accessToken = req.cookies['access-token']
    // Authorization: Bearer xyz....
    //const accessToken = req.headers['Authorization'] || req.headers['authorization']

    if (!accessToken) {
        return res.status(401).json({ error: 'Not token provided for auth' })
    }

    try {
        let decodedToken = jwt.verify(accessToken, process.env.SECRET)
        req.user = decodedToken
        return next()
    } catch (error) {
        return res.status(401).json({ error: "Invalid token provided" })
    }
}