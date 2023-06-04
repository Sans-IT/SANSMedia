import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  VStack,
  useColorMode,
  Heading,
  Image,
} from "@chakra-ui/react";
import { supabase } from "../../lib/supabase";
import { useMemo, useState } from "react";

type Props = {
  buttonText?: string;
};

export default function LoginModal({ buttonText }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error);
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        {buttonText ? buttonText : "Login"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight={"bold"}>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={3}>
              <Heading textAlign={"center"} size={"md"}>
                Pilih Metode Login
              </Heading>
              {/* Google */}
              <Button
                bg={"transparent"}
                variant={"outline"}
                onClick={signInWithGoogle}
              >
                <Image src="/google.png" alt="google" boxSize="20px" me={3} />
                <Text fontSize={"sm"}>Sign in dengan Google</Text>
              </Button>
              <Text fontSize={"xs"} textAlign={"center"} color={"gray.400"}>
                Akun kalian 100% aman karena sudah terintergrasi dengan akun
                google
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
