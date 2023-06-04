import { Container, Heading, Skeleton } from "@chakra-ui/react";
import CardPost from "../components/CardPost";
import { useQuery } from "@tanstack/react-query";
import dataController from "../../utils/controller";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function HomePage() {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["getAllPost", "post"],
    queryFn: async () => {
      return await dataController.getAllPost();
    },
  });

  return (
    <>
      <Container maxW={"lg"}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : data?.length === 0 ? (
          <Heading
            w={"full"}
            textAlign={"center"}
            color={"gray.400"}
            fontStyle={"italic"}
          >
            ~ Belum ada postingan, jadilah salah satunya! ~
          </Heading>
        ) : (
          data?.map((post: PostWithUser) => {
            return post.published === true ? (
              <CardPost dataPost={post} comment={false} key={post.id} />
            ) : (
              ""
            );
          })
        )}
      </Container>
    </>
  );
}
