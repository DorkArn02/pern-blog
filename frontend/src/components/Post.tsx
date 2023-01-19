import { Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, FormControl, FormLabel, Heading, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spacer, Stack, Text, Textarea, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import moment from 'moment'
import { useContext, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { FaPen, FaTrash } from 'react-icons/fa'
import ReactQuill from 'react-quill'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { addCommentToPostById, deletePostById, getPostByID, updatePostById } from '../backend/api'
import { PostInterface, UserContextInterface } from '../backend/interfaces'
import { AuthContext } from '../context/AuthProvider'
import CommentBox from './CommentBox'
import Footer from './Footer'

export default function Post() {
    const [post, setPost] = useState<PostInterface>(useLoaderData() as PostInterface)

    const { currentUser } = useContext(AuthContext) as UserContextInterface

    const toast = useToast()
    const navigate = useNavigate()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
    const [content, setContent] = useState<string>(post.content)
    const [title, setTitle] = useState<string>(post.title)
    const [description, setDescription] = useState<string>(post.description)
    const [comment, setComment] = useState<string>("")
    const [sort, setSort] = useState<boolean>(true)

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
    const handleDelete = async () => {
        await deletePostById(post.id!).then(() => {
            toast({
                title: 'Success',
                description: "Post deleted",
                status: 'success',
                duration: 5000,
                isClosable: true,
                variant: "solid"
            })
            navigate("/")
        })
    }
    const handleUpdate = async () => {
        if (title.length !== 0 && content.length !== 0 && description.length !== 0) {
            const response = await updatePostById(post.id, { title, description, content })

            if (response.status === 200) {
                toast({
                    title: 'Success',
                    description: "Post modified",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    variant: "solid"
                })
                handleRerender()
                onCloseEdit()
            }

        }
    }
    const handleRerender = async () => {
        const posts = await getPostByID(post.id)
        setPost(posts as any as PostInterface)
    }
    const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (comment.length !== 0) {
            const response = await addCommentToPostById(post.id, { content: comment })
            toast({
                title: 'Success',
                description: "Comment created",
                status: 'success',
                duration: 5000,
                isClosable: true,
                variant: "solid"
            })
            handleRerender()
        }
    }

    return (
        <>
            <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete confirmation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb='1rem'>
                            Are you sure?
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={handleDelete} colorScheme='blue' mr={3} >
                            Yes
                        </Button>
                        <Button onClick={onCloseDelete} variant='ghost'>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modify your post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={2} isRequired>
                            <FormLabel>Title</FormLabel>
                            <Input defaultValue={title} onChange={(e) => setTitle(e.target.value)} name="title" type="text" placeholder='Post title' />
                        </FormControl>
                        <FormControl mb={2} isRequired>
                            <FormLabel>Description</FormLabel>
                            <Input defaultValue={description} onChange={(e) => setDescription(e.target.value)} name="description" type="text" placeholder='Post description' />
                        </FormControl>
                        <FormControl mb={2} isRequired>
                            <FormLabel>Post content: </FormLabel>
                            <ReactQuill modules={modules} theme="snow" value={content} onChange={setContent} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button name="submit" onClick={handleUpdate} colorScheme='blue' mr={3} >
                            Modify
                        </Button>
                        <Button onClick={onCloseEdit} variant='ghost'>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Flex flexDir={"column"} minH={"100vh"}>
                <Flex mt={2} mb={2} justify={"center"}>
                    {post ?
                        <Card p={[1, 3]} w={["90%", "70%"]} boxShadow={"md"}>
                            <CardHeader >
                                <Stack align={"center"} direction={['row', 'row']}>
                                    <Avatar src={`http://localhost:8080/users/picture/${post.authorId}`} size={"sm"} />
                                    <Box>
                                        <Text fontWeight={"bold"}>{post.author}</Text>
                                        <Text>{moment(post.createdAt).fromNow()}</Text>
                                    </Box>
                                    <Spacer />
                                    {Object.entries(currentUser).length !== 0 && currentUser.username === post.author ?
                                        <HStack gap={2}>
                                            <Tooltip label="Click to delete your post">
                                                <IconButton onClick={onOpenDelete} colorScheme={"red"} aria-label='delete post' icon={<FaTrash />} />
                                            </Tooltip>
                                            <Tooltip label="Click to edit your post">
                                                <IconButton onClick={onOpenEdit} colorScheme={"blue"} aria-label='edit post' icon={<FaPen />} />
                                            </Tooltip>
                                        </HStack>
                                        : ""}
                                </Stack>
                            </CardHeader>
                            <CardBody>
                                <Heading mb={10}>{post.title}</Heading>
                                {ReactHtmlParser(post.content)}
                            </CardBody>
                        </Card >
                        :
                        ""}
                </Flex >
                <Flex justify={"center"}>
                    <Card w={["90%", "70%"]}>
                        <CardHeader>
                            <Heading size="lg">Comments ({post.comments?.length})</Heading>
                        </CardHeader>
                        <CardBody>
                            {Object.entries(currentUser).length !== 0 ?
                                <form onSubmit={handleAddComment}>
                                    <Flex flexDir={"column"} gap={4}>
                                        <FormControl isRequired>
                                            <Textarea onChange={(e) => setComment(e.target.value)} name="content" placeholder='Comment content' />
                                        </FormControl>
                                        <Button type="submit">Send</Button>
                                    </Flex>
                                </form>
                                :
                                <Alert status='info'>
                                    <AlertIcon />
                                    <AlertTitle>Please log in!</AlertTitle>
                                    <AlertDescription>Only logged in users can write comments.</AlertDescription>
                                </Alert>}
                        </CardBody>
                        <CardFooter flexDir={"column"}>
                            <FormControl mb={3} w={"30%"}>
                                <FormLabel>Sort by</FormLabel>
                                <Select onChange={(e) => setSort(e.target.value === "1" ? true : false)}>
                                    <option value={"1"}>New</option>
                                    <option value={"0"}>Old</option>
                                </Select>
                            </FormControl>
                            {post.comments ? post.comments.sort((a, b) =>
                                sort ? moment(b.createdAt!).valueOf() - moment(a.createdAt!).valueOf() :
                                    moment(a.createdAt!).valueOf() - moment(b.createdAt!).valueOf()
                            ).map((item, key) => {
                                return <CommentBox rerender={handleRerender} key={key} {...item} />
                            }) : ""}
                        </CardFooter>
                    </Card>
                </Flex>
            </Flex>
            <Footer />
        </>
    )
}
