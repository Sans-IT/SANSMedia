import CardPost from "@/components/CardPost";
import CommentSession from "@/components/CommentSession";
import dataController from "../../../../utils/controller";
import {
  Box,
  HStack,
  Stack,
  Text,
  Container,
  Skeleton,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

type Props = {};

export default function PostIdPage({}: Props) {
  const router = useRouter();
  const { userid } = router.query;
  const { postid } = router.query;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getpost", userid, postid],
    queryFn: async () => {
      return await dataController.getPost(userid);
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <Container maxWidth={"lg"}>
        {data?.map((post: PostWithUser) => {
          return post.id === postid ? (
            <>
              <CardPost comment={true} dataPost={post} />
              <CommentSession comment={true} postprops={post} />
            </>
          ) : (
            ""
          );
        })}
      </Container>
    </>
  );
}
