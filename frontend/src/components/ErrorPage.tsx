import { Flex, Heading, Text } from "@chakra-ui/react"
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom"
import Footer from "./Footer"

export default function ErrorPage() {

    const error = useRouteError()

    if (isRouteErrorResponse(error)) {
        return (
            <>
                <Flex minH={"100vh"} align={"center"} justify={"center"}>
                    <Flex gap={5} flexDir={"column"} align={"center"}>
                        <Heading>{error.status}: {error.data}</Heading>
                        <Link to={"/"}><Text _hover={{ textDecor: "underline" }}>Click here to go back</Text></Link>
                    </Flex>
                </Flex>
                <Footer />
            </>
        )
    } else {
        return <p>Oops</p>
    }


}
