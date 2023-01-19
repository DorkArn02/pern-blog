import { Flex, Heading, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import Footer from './Footer'

export default function NotFound() {
    return (
        <>
            <Flex minH={"100vh"} align={"center"} justify={"center"}>
                <Flex gap={5} flexDir={"column"} align={"center"}>
                    <Heading>404: Page not found</Heading>
                    <Link to={"/"}><Text _hover={{ textDecor: "underline" }}>Click here to go back</Text></Link>
                </Flex>
            </Flex>
            <Footer />
        </>
    )
}
