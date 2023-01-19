import { Flex } from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { PostInterface, SearchContextInterface } from '../backend/interfaces'
import { SearchContext } from '../context/SearchProvider'
import Footer from './Footer'
import PostItem from './PostItem'

export default function Dashboard() {

    const [posts, setPosts] = useState<PostInterface[]>(useLoaderData() as PostInterface[])
    const { text } = useContext(SearchContext) as SearchContextInterface

    const filteredPosts = text.length !== 0 ? posts.filter(i => text.length !== 0 ? i.title.includes(text) : i) : posts
    return (
        <>
            <Flex minHeight={"100vh"} mt={2} justify={"center"} alignItems={"center"}>
                <Flex gap={"10px"} w={["90%", "70%"]} flexDir={"column"}>
                    {posts ? filteredPosts.map((post, key) => {
                        return <PostItem key={key} {...post} />

                    })
                        : ""
                    }
                </Flex>
            </Flex>
            <Footer />
        </>
    )
}
