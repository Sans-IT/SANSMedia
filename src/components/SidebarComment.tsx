import {
  Avatar,
  Box,
  Text,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Heading,
  IconButton,
  Spacer,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import React, { useEffect } from "react";
import CommentSession from "./CommentSession";
import { BsChatLeftTextFill } from "react-icons/bs";
import { Post } from "@prisma/client";

type Props = {
  postprops: Post;
};

export default function SidebarComment({ postprops }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        _hover={{ bg: "transparent" }}
        size={"md"}
        icon={<BsChatLeftTextFill />}
        aria-label="commentbutton"
        variant={"outline"}
        bg={"transparent"}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size={{ xs: "full", sm: "md" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Ini Judul</DrawerHeader>
          <Divider />

          <DrawerBody my={5}>
            <CommentSession comment={false} postprops={postprops} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
