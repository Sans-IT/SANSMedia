import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Img,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { Post } from "@prisma/client";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import dataController from "../../../utils/controller";
import { supabase } from "../../../lib/supabase";

type Props = {};

export default function CreatePage({}: Props) {
  const inputImageRef = useRef<HTMLInputElement | any>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [fileUpload, setFileUpload] = useState<File | null>();
  const user = useUser();
  const router = useRouter();
  const toast = useToast();

  const schema = yup.object().shape({
    source: yup.string().min(1).required().default(`${Date.now().toString()}`),
    title: yup.string().min(3).required(),
    body: yup.string().required(),
    published: yup.boolean().default(true),
    sensitive: yup.boolean().default(false),
    type: yup.string().default(fileUpload?.type),
    userId: yup.string().default(user?.id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<Post>({
    resolver: yupResolver(schema),
  });

  const onImageUpload = () => {
    inputImageRef?.current.click();
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement | any>) => {
    if (e.target.files?.length !== 0) {
      switch (e.target.files[0].type.split("/")[0]) {
        case "video":
          setFilePreview(URL.createObjectURL(e.target.files[0]));
          setFileUpload(e.target.files[0]);
        case "image":
          setFilePreview(URL.createObjectURL(e.target.files[0]));
          setFileUpload(e.target.files[0]);
          break;
        default:
          toast({
            title: "file tidak valid",
            position: "top",
            isClosable: true,
            status: "error",
          });
      }
    }
  };

  const { mutate, isLoading: isLoadingForm }: any = useMutation({
    mutationKey: ["createpost", user?.id],
    mutationFn: async (data: Post) => {
      await dataController.createPost(data);
      await supabase.storage
        .from("source")
        .upload(`${data.userId}/${data.source}`, fileUpload as File);
    },
    onSuccess: () => {
      resetField("body"),
        resetField("title"),
        setFileUpload(null),
        setFilePreview(""),
        router.push("/");
    },
  });

  return (
    <>
      <Container>
        <Heading>Buat Postingan</Heading>
        <Divider my={3} />
        <form onSubmit={handleSubmit(mutate)}>
          {/* gambar / video */}
          <Box mb={8}>
            <Box>
              <Heading size={"md"}>* Gambar / Video</Heading>
              <Text fontSize={"sm"}>Ukuran maks: 10mb</Text>
            </Box>
            <Box my={3}>
              <FormControl isInvalid={!!errors.source}>
                <Input
                  {...register("source")}
                  type="file"
                  ref={inputImageRef}
                  onChange={handleFile}
                  accept=".png,.jpg,.jpeg,.mp4,.mov,.mkv"
                  hidden
                />

                <Box
                  _hover={{ opacity: "0.8" }}
                  width={"full"}
                  height={250}
                  border={"1px"}
                  borderRadius={5}
                  borderColor={!!errors.source ? "red.400" : "Highlight"}
                  borderStyle={"dashed"}
                  borderWidth={"2px"}
                  cursor={"pointer"}
                  p={2}
                  onClick={onImageUpload}
                >
                  {fileUpload?.type.split("/")[0] === "video" ? (
                    <video
                      className="object-contain w-full h-full"
                      src={filePreview}
                      controls
                    />
                  ) : (
                    <Img
                      objectFit={filePreview === "" ? "cover" : "contain"}
                      h={"full"}
                      w={"full"}
                      src={filePreview === "" ? "/dummyimg.jpg" : filePreview}
                      alt="sumber_postingan"
                    />
                  )}
                </Box>
                <FormErrorMessage>
                  {!!errors.source ? "sumber harus diterapkan" : ""}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Box>
          {/* Judul */}
          <Box mb={8}>
            <Flex flexDirection={"column"} gap={2}>
              <Heading size={"md"}>* Judul</Heading>
              <Text fontSize={"sm"}>Masukan title minimum 3 huruf</Text>
              <FormControl isInvalid={!!errors.title}>
                <Input
                  placeholder="Masukan judul postingan"
                  {...register("title")}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>
            </Flex>
          </Box>
          {/* Deskripsi */}
          <Box mb={8}>
            <Flex flexDirection={"column"} gap={2}>
              <Heading size={"md"}>* Deskripsi</Heading>
              <Text fontSize={"sm"}>
                Masukan deskripsi yang pas untuk postingan mu
              </Text>
              <FormControl isInvalid={!!errors.body}>
                <Input
                  placeholder="Masukan body postingan"
                  {...register("body")}
                />
                <FormErrorMessage>{errors.body?.message}</FormErrorMessage>
              </FormControl>
            </Flex>
          </Box>
          {/* Publik & Konten Sensitif */}
          <Flex flexDirection={"column"} gap={3}>
            <Stack spacing={[1, 5]} direction={["column", "row"]}>
              <Checkbox defaultChecked size="lg" {...register("published")}>
                Publik
              </Checkbox>
              <Checkbox colorScheme="red" size="lg" {...register("sensitive")}>
                Konten Sensitif
              </Checkbox>
            </Stack>
          </Flex>
          <Divider my={5} />
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={isLoadingForm}
            float={"right"}
          >
            Buat
          </Button>
        </form>
      </Container>
    </>
  );
}
