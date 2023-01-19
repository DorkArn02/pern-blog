import { Avatar, Box, Button, Flex, HStack, IconButton, Input, InputGroup, InputRightElement, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text, useColorMode, useDisclosure, VStack } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { checkJWT, logout } from '../backend/api';
import { SearchContextInterface, UserContextInterface, UserInterface } from '../backend/interfaces';
import { AuthContext } from '../context/AuthProvider';
import { SearchContext } from '../context/SearchProvider';

export default function Navbar() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate()
    const { toggleColorMode, colorMode } = useColorMode()
    const { currentUser, setCurrentUser } = useContext(AuthContext) as UserContextInterface

    const [search, setSearch] = useState<string>("")

    const { setText } = useContext(SearchContext) as SearchContextInterface

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            navigate("/")
            setText(search)
        }
    }

    const handleLogout = async () => {
        await logout().then(() => {
            setCurrentUser({} as UserInterface)
        })
    }

    useEffect(() => {
        if (Object.entries(currentUser).length !== 0) {
            setInterval(() => {
                checkJWT().catch(() => {
                    logout().then(() => {
                        window.location.reload()
                    })
                })
            }, 4000)
        }
    }, [currentUser])


    return (
        <>
            <Flex boxShadow={isOpen ? "" : "md"} p={1} alignItems={'center'} justifyContent={'space-between'} flexDir={"row"}>
                <HStack display={{ md: 'none' }}>
                    <IconButton
                        icon={isOpen ? <RxCross1 /> : <RxHamburgerMenu />}
                        aria-label={'Open Menu'}
                        onClick={isOpen ? onClose : onOpen}
                    />
                </HStack>
                <HStack justify={{ base: "center", md: "left" }} gap={10} w={"100%"}>
                    <Box ml={{ lg: "5%" }}>
                        <Link to="/">
                            <Text fontWeight={"medium"} fontSize={"2xl"}>Blog</Text>
                        </Link>
                    </Box>
                    <InputGroup display={{ base: "none", md: "block" }} maxWidth={"25%"}>
                        <InputRightElement
                            children={<FaSearch />}
                        />
                        <Input onKeyDown={handleSearch} onChange={(e) => setSearch(e.target.value)} variant={"filled"} type='text' placeholder='Search by title...' />
                    </InputGroup>
                </HStack>
                {Object.entries(currentUser).length !== 0 ?
                    <HStack mr={{ lg: "5%" }}>
                        <Box>
                            <Menu>
                                <MenuButton margin={0} _hover={{ cursor: "pointer", opacity: "0.8" }} as={Avatar} src={`http://localhost:8080/users/picture/${currentUser.id}`} />
                                <MenuList>
                                    <MenuGroup title={currentUser.username}>
                                        <MenuItem onClick={() => navigate("/profile")}>My Account</MenuItem>
                                        <MenuItem onClick={() => navigate('/write')}>Write post</MenuItem>
                                        <MenuDivider />
                                        <MenuItem onClick={() => handleLogout()}>Log out</MenuItem>
                                    </MenuGroup>
                                </MenuList>
                            </Menu>
                        </Box>
                    </HStack>
                    :
                    <HStack mr={{ lg: "5%" }}>
                        <Button display={{ base: "none", md: "block" }} onClick={() => navigate('/login')} colorScheme={"blue"}>Log in</Button>
                        <Button display={{ base: "none", md: "block" }} onClick={() => navigate('/register')} colorScheme={"blue"} variant={"outline"} >Create account</Button>
                    </HStack>
                }
                <IconButton display={{ base: "none", md: "flex" }} aria-label='color-switch' onClick={toggleColorMode} icon={colorMode === "light" ? <FaSun /> : <FaMoon />} />
            </Flex>
            {isOpen ? (
                <Box pb={4} boxShadow={"md"} display={{ md: 'none' }}>
                    <VStack p={2} as={"nav"} spacing={4}>
                        {Object.entries(currentUser).length !== 0 ?
                            <>
                                <Link to="" color={"#fff"}>Write a post</Link>
                                <InputGroup maxW={"80%"}>
                                    <InputRightElement
                                        children={<FaSearch color='#ddd' />}
                                    />
                                    <Input color={"#fff"} type='text' placeholder='Search...' />
                                </InputGroup>
                            </>
                            :
                            <>
                                <Text _hover={{ textDecoration: "underline" }}><Link to="/login">Log in</Link></Text>
                                <Text _hover={{ textDecoration: "underline" }}><Link to="/register">Register</Link></Text>
                            </>
                        }
                    </VStack>
                </Box>
            ) : null}

        </>
    )
}
