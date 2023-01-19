import yup from "yup"

export const postSchema = yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
    content: yup.string().required()
})

export const uuidSchema = yup.string().uuid().required()