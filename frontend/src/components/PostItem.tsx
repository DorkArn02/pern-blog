import { Avatar, Box, Card, CardBody, CardFooter, CardHeader, Heading, HStack, Text } from '@chakra-ui/react'
import moment from "moment"
import { Link } from 'react-router-dom'
import { PostInterface } from '../backend/interfaces'

export default function PostItem(p: PostInterface) {
    return (
        <Card p={[1, 3]} boxShadow={"md"}>
            <CardHeader>
                <HStack>
                    <Avatar src={`http://localhost:8080/users/picture/${p.authorId}`} size={"sm"} />
                    <Box>
                        <Text fontWeight={"bold"}>{p.author}</Text>
                        <Text>{moment(p.createdAt).fromNow()}</Text>
                    </Box>
                </HStack>
            </CardHeader>
            <CardBody>
                <Link to={`/post/${p.id}`}><Heading _hover={{ textDecor: "underline" }}>{p.title}</Heading></Link>
            </CardBody>
            <CardFooter>
                {p.description}
            </CardFooter>
        </Card >
    )
}
