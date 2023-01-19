import { Button, Flex, FormControl, FormLabel, Heading, Input, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../backend/api'
import { UserContextInterface } from '../backend/interfaces'
import { AuthContext } from '../context/AuthProvider'
import Footer from './Footer'

const modules = {
    toolbar: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
    ],
};

export default function WritePost() {
    const { currentUser } = useContext(AuthContext) as UserContextInterface
    const navigate = useNavigate()
    const toast = useToast()

    const [content, setContent] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")

    useEffect(() => {
        if (Object.entries(currentUser).length === 0) {
            navigate("/")
            return
        }
    }, [currentUser])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (title.length !== 0 && description.length !== 0 && content.length !== 0) {
            await createPost({ title, description, content })
            toast({
                title: 'Success',
                description: "Post created",
                status: 'success',
                duration: 5000,
                isClosable: true,
                variant: "solid"
            })
            navigate("/")
        }
    }

    return (
        <>
            <Flex minH={"100vh"} align={"center"} justify="center">
                <Flex w={"80%"} justify={"center"}   >
                    <form onSubmit={handleSubmit}>
                        <Flex gap={6} boxShadow={"lg"} p={4} flexDir={"column"}>
                            <Heading textAlign={"center"}>Write post</Heading>
                            <FormControl isRequired>
                                <FormLabel>Post title:</FormLabel>
                                <Input onChange={(e) => setTitle(e.target.value)} type="text" name="title" placeholder='Post title' />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Post description:</FormLabel>
                                <Input onChange={(e) => setDescription(e.target.value)} type="text" name="description" placeholder='Post description' />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Post content: </FormLabel>
                                <ReactQuill modules={modules} theme="snow" value={content} onChange={setContent} />
                            </FormControl>
                            <Button type="submit" name="submit">Save</Button>
                        </Flex>
                    </form>
                </Flex>
            </Flex >
            <Footer />
        </>
    )
}
