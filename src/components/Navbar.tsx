"use client";

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  LightMode,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsPersonCircle, BsMoonFill, BsSunFill } from "react-icons/bs";
import { RiImageAddFill } from "react-icons/ri";
import { FcSettings } from "react-icons/fc";
import { ligthBg, darkBg, cdnSource } from "../../utils/global";
import NextLink from "next/link";
import LoginModal from "./LoginModal";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import dataController from "../../utils/controller";
import { useQuery } from "@tanstack/react-query";

type Props = {};

export default function Navbar({}: Props) {
  const user = useUser();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgMode = useColorModeValue(ligthBg, darkBg);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["finduser"],
    queryFn: async () => {
      return await dataController.getUser(user?.id);
    },
    onSuccess: (res) => {
      setUserAvatar(res?.avatar);
    },
  });

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error);
  };

  const gotoProfile = async () => {
    router.push(`/${data?.username}`);
  };

  const gotoSettings = async () => {
    router.push(`/settings`);
  };

  const goCreatePost = async () => {
    router.push(`/create`);
  };

  useEffect(() => {
    refetch();
  }, [user, userAvatar, router]);

  return (
    <Flex
      minWidth="max-content"
      alignItems="center"
      gap="2"
      bgColor={bgMode}
      borderBottom={"1px"}
      borderColor={"ButtonFace"}
      p={1}
    >
      <Flex
        justifyContent={"space-between"}
        minWidth="max-content"
        alignItems="center"
        w={"full"}
        mx={5}
      >
        <Box p="2">
          <Link as={NextLink} href="/" _hover={{ fontStyle: "normal" }}>
            <Heading size="lg" color={"blue.500"}>
              SANSMedia
            </Heading>
          </Link>
        </Box>
        <Spacer />
        <HStack>
          <IconButton
            icon={colorMode === "light" ? <BsMoonFill /> : <BsSunFill />}
            aria-label="toggletheme"
            onClick={toggleColorMode}
            bg={"transparent"}
            size={"md"}
          />
          {user ? (
            <>
              <IconButton
                icon={<RiImageAddFill />}
                size={"md"}
                aria-label="addpost"
                bg={"transparent"}
                onClick={goCreatePost}
              />
              <Menu>
                <MenuButton>
                  <Avatar
                    src={`${cdnSource}${user.id}/profile${userAvatar}`}
                    name={user.user_metadata.name}
                    size={"md"}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={gotoProfile}>
                    <BsPersonCircle className="me-3" /> Profilku
                  </MenuItem>
                  <MenuItem onClick={gotoSettings}>
                    <FcSettings className="me-3" /> Settings
                  </MenuItem>
                  <MenuItem isDisabled>{user.user_metadata.email}</MenuItem>
                  <Divider />
                  <MenuItem color={"red.500"} onClick={logOut}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <LoginModal />
          )}
        </HStack>
      </Flex>
    </Flex>
  );
}
