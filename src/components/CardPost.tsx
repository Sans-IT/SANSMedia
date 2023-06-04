"use client";
import {
  Card,
  Text,
  Image,
  CardHeader,
  Flex,
  Avatar,
  Heading,
  IconButton,
  CardBody,
  CardFooter,
  Box,
  Badge,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Divider,
  HStack,
  Link,
  Img,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import SidebarComment from "./SidebarComment";
import NextLink from "next/link";
import CardMenu from "./CardMenu";
import { cdnSource } from "../../utils/global";

type Props = {
  comment: boolean;
  dataPost: PostWithUser;
};

export default function CardPost({ dataPost, comment }: Props) {
  const user = useUser();
  const router = useRouter();
  const [like, setLike] = useState<boolean>(false);

  const gotoProfile = () => {
    router.push(`/${dataPost?.user.username}` ?? "");
  };

  const gotoComment = () => {
    router.push(`/${dataPost?.user.username}/${dataPost?.id}` ?? "");
  };

  if (dataPost === undefined) return <></>;

  return (
    <>
      <Card maxW={"full"} mx={"auto"} shadow={"lg"} h={"auto"} mb={5}>
        <CardHeader>
          <Flex mb={3}>
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar
                name={dataPost.user.username ?? ""}
                src={`${cdnSource}${dataPost.user?.id}/profile${dataPost.user.avatar}`}
                onClick={gotoProfile}
                cursor={"pointer"}
              />

              <Box>
                <Heading size="md" onClick={gotoProfile} cursor={"pointer"}>
                  {dataPost?.user.username ?? ""}
                </Heading>
              </Box>
            </Flex>
            <CardMenu dataPost={dataPost} comment={comment} />
          </Flex>
          {comment ? (
            ""
          ) : (
            <Link
              as={NextLink}
              color="blue.400"
              href={`/${dataPost?.user.username}/${dataPost?.id}` ?? ""}
            >
              Lihat Detail
            </Link>
          )}
        </CardHeader>

        {dataPost?.type?.split("/")[0] === "video" ? (
          <video
            className="object-contain w-full h-full"
            src={cdnSource + dataPost.userId + "/" + dataPost.source ?? ""}
            controls
          />
        ) : (
          <Img
            objectFit={"cover"}
            h={"full"}
            w={"full"}
            src={cdnSource + dataPost.userId + "/" + dataPost.source ?? ""}
            alt={cdnSource + dataPost.userId + "/" + dataPost.source ?? ""}
          />
        )}

        <CardBody>
          <Heading size={"md"} mb={3}>
            {dataPost?.title}
          </Heading>
          <Text>{dataPost?.body}</Text>
          <HStack my={3} gap={1}>
            {user?.id === dataPost.userId ? (
              <>
                {dataPost?.published ? (
                  <Badge colorScheme="teal" variant="outline" fontSize="0.8em">
                    Publik
                  </Badge>
                ) : (
                  <Badge colorScheme="red" variant="outline" fontSize="0.8em">
                    Privat
                  </Badge>
                )}
              </>
            ) : (
              ""
            )}
            {dataPost?.sensitive ? (
              <Badge colorScheme="red" variant="outline" fontSize="0.8em">
                Konten Sensitif
              </Badge>
            ) : (
              ""
            )}
          </HStack>
        </CardBody>

        <CardFooter gap={5} pt={0}>
          <IconButton
            _hover={{ bg: "transparent" }}
            size={"md"}
            icon={like ? <AiFillLike /> : <AiOutlineLike />}
            aria-label="commentbutton"
            variant={"outline"}
            bg={"transparent"}
            onClick={() => void setLike(!like)}
          />
          {!comment ? <SidebarComment postprops={dataPost} /> : ""}
        </CardFooter>
      </Card>
    </>
  );
}
