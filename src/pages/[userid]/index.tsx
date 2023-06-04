import {
  Avatar,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import CardPost from "../../components/CardPost";
import dataController from "../../../utils/controller";
import { useQuery } from "@tanstack/react-query";
import { cdnSource } from "../../../utils/global";
import LoadingSkeleton from "@/components/LoadingSkeleton";

type Props = {};

export default function UserPage({}: Props) {
  const router = useRouter();
  const { userid } = router.query;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["findpost", userid],
    queryFn: async () => {
      return await dataController.getUser(userid);
    },
  });

  return (
    <>
      <Container maxW={"container.sm"}>
        <HStack gap={3}>
          <Avatar
            src={`${cdnSource}${data?.id}/profile${data?.avatar}`}
            name={data?.username ?? ""}
            size={"lg"}
          />
          <Flex flexDirection={"column"}>
            <Heading size={"lg"}>{data?.username}</Heading>
            <Text fontWeight={"bold"}>
              Bio : <span className="font-normal">{data?.biodata}</span>
            </Text>
          </Flex>
        </HStack>
        <Divider my={5} />
        {isLoading ? (
          <LoadingSkeleton />
        ) : data?.post.length === 0 ? (
          <Heading
            textAlign={"center"}
            w={"full"}
            size={"lg"}
            color={"gray.400"}
            fontStyle={"italic"}
          >
            ~ Belum ada postingan ~
          </Heading>
        ) : (
          data?.post.map((post: PostWithUser) => {
            return <CardPost comment={false} dataPost={post} key={post.id} />;
          })
        )}
      </Container>
    </>
  );
}
