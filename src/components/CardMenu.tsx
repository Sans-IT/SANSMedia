import {
  Input,
  Text,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  MenuItem,
  MenuButton,
  Divider,
  Menu,
  MenuList,
} from "@chakra-ui/react";
import { BsThreeDotsVertical, BsLink45Deg } from "react-icons/bs";
import React from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useMutation } from "@tanstack/react-query";
import dataController from "../../utils/controller";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

type Props = {
  dataPost: PostWithUser;
  comment: boolean;
};

export default function CardMenu({ dataPost, comment }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useUser();
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationKey: ["deletepost", dataPost?.id],
    mutationFn: async () => {
      await supabase.storage
        .from("source")
        .remove([`${dataPost?.userId}/${dataPost?.source}`]);
      return await dataController.deletePost(dataPost?.id);
    },
    onSuccess: () => {
      onClose();
      if (comment) {
        router.push("/");
      } else router.reload();
    },
  });

  if (dataPost === undefined) return <></>;

  return (
    <>
      <Menu>
        <MenuButton>
          <BsThreeDotsVertical />
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() =>
              navigator.clipboard.writeText(
                `${window.location.origin}/${dataPost.user.username}/${dataPost.id}`
              )
            }
          >
            <BsLink45Deg className="me-2" />
            Copy Link
          </MenuItem>
          <Divider />
          {user?.id === dataPost?.userId ? (
            <>
              <MenuItem isDisabled>
                Ubah menjadi
                {dataPost?.published ? (
                  <Text color={"blue.500"} ms={1}>
                    Publik
                  </Text>
                ) : (
                  <Text color={"red.500"} ms={1}>
                    Privat
                  </Text>
                )}
              </MenuItem>
              <MenuItem color={"teal.500"} isDisabled>
                Edit
              </MenuItem>
              <MenuItem color={"red.500"} onClick={onOpen}>
                Hapus
              </MenuItem>
            </>
          ) : (
            ""
          )}
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hapus Postingan</ModalHeader>
          <ModalBody>
            <Text>
              Apakah anda yakin ingin menghapus postingan &quot;{dataPost.title}
              &quot;
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => mutate()}
              isLoading={isLoading}
            >
              Hapus
            </Button>
            <Button onClick={onClose}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
