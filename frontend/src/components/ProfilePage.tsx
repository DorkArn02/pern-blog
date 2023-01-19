import { Avatar, Box, Button, ButtonGroup, Card, CardBody, CardHeader, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { FaPen, FaTrash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { deleteUser, editUser, logout, uploadPicture } from "../backend/api"
import { UserContextInterface, UserInterface } from "../backend/interfaces"
import { AuthContext } from "../context/AuthProvider"
import Footer from "./Footer"

export default function ProfilePage() {

    const { currentUser, setCurrentUser } = useContext(AuthContext) as UserContextInterface

    const toast = useToast()
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0]!);
    };

    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()

    useEffect(() => {
        if (Object.entries(currentUser).length === 0) {
            navigate("/")
            return
        }
    }, [currentUser])

    const { isOpen: isOpenPicture, onClose: onClosePicture, onOpen: onOpenPicture } = useDisclosure()

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            return
        }
        const formData = new FormData()
        formData.append("file", file)

        const { data } = await uploadPicture(formData)

        console.log(data)

        if (data.message === "OK") {
            onClosePicture()
            setFile(null)
            toast({
                title: 'Success',
                description: "Profile picture updated",
                status: 'success',
                duration: 5000,
                isClosable: true,
                variant: "solid"
            })
        }
    }

    const [newUsername, setNewUsername] = useState<string>(currentUser.username)
    const [newEmail, setNewEmail] = useState<string>(currentUser.email)

    const handleDelete = async () => {
        await deleteUser(currentUser.id!)
        await logout().then(() => {
            setCurrentUser({} as UserInterface)
        })
    }

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (newUsername.length !== 0 && newEmail.length !== 0) {
            const response = await editUser(currentUser.id!, { username: newUsername, email: newEmail })
            if (response.status === 200) {
                await logout().then(() => {
                    setCurrentUser({} as UserInterface)
                })
            }

        }
    }

    return (
        <>
            <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit your details</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleEdit}>
                        <ModalBody>
                            <FormControl mb={2} isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input onChange={(e) => setNewUsername(e.target.value)} type="text" name="username" placeholder="Username" defaultValue={currentUser.username} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>E-mail</FormLabel>
                                <Input onChange={(e) => setNewEmail(e.target.value)} type="email" name="email" placeholder="E-mail" defaultValue={currentUser.email} />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" colorScheme='blue' mr={3} >
                                Edit
                            </Button>
                            <Button onClick={onCloseEdit} variant='ghost'>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Account delete confirmation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Are you sure?</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleDelete} colorScheme='blue' mr={3} >
                            Yes
                        </Button>
                        <Button onClick={onCloseDelete} variant='ghost'>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenPicture} onClose={onClosePicture}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change your profile picture</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Picture</FormLabel>
                            <Input onChange={handleFileChange} border="0" accept="image/png,image/jpeg,image/gif" type="file" />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={handleUpload} colorScheme='blue' mr={3} >
                            Upload
                        </Button>
                        <Button onClick={onClosePicture} variant='ghost'>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Flex minH={"100vh"} justify={"center"} mt={2}>
                <Card w={"70%"} boxShadow={"md"}>
                    <CardHeader textAlign={"center"}>
                        <Heading size={"lg"} mb={4}>My profile page</Heading>
                        <Avatar src={`http://localhost:8080/users/picture/${currentUser.id}`} _hover={{ cursor: "pointer", opacity: 0.8 }} onClick={onOpenPicture} size={"lg"} />
                        <Box>
                            <Text fontWeight={"bold"}>{currentUser.username}</Text>
                        </Box>
                    </CardHeader>
                    <CardBody ml={5}>
                        <Heading size={"md"} mb={4}>Your details:</Heading>
                        <Text>User id: {currentUser.id}</Text>
                        <Text>Username: {currentUser.username}  </Text>
                        <Text>E-mail: {currentUser.email}</Text>
                        <Heading mt={5} size={"md"} mb={4}>Account methods:</Heading>
                        <ButtonGroup>
                            <Tooltip label={"Click here to delete your account"}>
                                <IconButton onClick={onOpenDelete} aria-label="delete account" colorScheme={"red"} icon={<FaTrash />} />
                            </Tooltip>
                            <Tooltip label={"Click here to edit your account"}>
                                <IconButton onClick={onOpenEdit} aria-label="edit account" colorScheme={"blue"} icon={<FaPen />} />
                            </Tooltip>
                        </ButtonGroup>
                    </CardBody>

                </Card >
            </Flex >
            <Footer />
        </>
    )
}
