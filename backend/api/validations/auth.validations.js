import yup from "yup"

export const userRegisterSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().min(8).required(),
    email: yup.string().email().required()
})

export const userLoginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
})