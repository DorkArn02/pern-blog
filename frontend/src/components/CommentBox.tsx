import { Avatar, Button, Flex, HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import moment from 'moment'
import { useContext } from 'react'
import { FaTrash } from 'react-icons/fa'
import { deleteCommentFromPostById } from '../backend/api'
import { CommentInterface, UserContextInterface } from '../backend/interfaces'
import { AuthContext } from '../context/AuthProvider'

export default function CommentBox(c: CommentInterface) {

    const { currentUser } = useContext(AuthContext) as UserContextInterface
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const toast = useToast()

    const handleDelete = async () => {
        const response = await deleteCommentFromPostById(c?.id)

        if (response.status === 200) {
            toast({
                title: 'Success',
                description: "Comment deleted",
                status: 'success',
                duration: 5000,
                isClosable: true,
                variant: "solid"
            })
            c.rerender?.()
            onCloseDelete()
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
            <Flex p={2} boxShadow={"md"} w={"100%"} flexDir={"column"}>
                <HStack>
                    <Avatar size={"sm"} src={`http://localhost:8080/users/picture/${c.authorId}`} />
                    <Text fontWeight={"bold"}>{c.author} ({moment(c.createdAt).fromNow()})</Text>
                    <Spacer />
                    {Object.entries(currentUser).length !== 0 && currentUser.id === c.authorId ?
                        <Tooltip label={"Click to delete your comment"}>
                            <IconButton onClick={onOpenDelete} colorScheme={"red"} aria-label={"delete comment"} icon={<FaTrash />} />
                        </Tooltip>
                        : ""}
                </HStack>
                <Text ml={10}>{c.content}</Text>
            </Flex>
        </>
    )
}
