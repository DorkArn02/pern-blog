import { Flex, HStack, Spacer, Text } from '@chakra-ui/react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
    return (
        <Flex mt={3}>
            <Flex w={"100%"} boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;" justify={"space-between"} p={4}>
                <HStack w={"100%"}>
                    <Text>Blog</Text>
                    <Spacer />
                    <Text textAlign={"center"}>© 2022 Blog. All rights reserved</Text>
                    <Spacer />
                    <HStack>
                        <FaFacebook />
                        <FaInstagram />
                        <FaTwitter />
                    </HStack>
                </HStack>
            </Flex>
        </Flex>
    )
}
