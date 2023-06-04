import {
  Button,
  Container,
  Divider,
  Heading,
  Box,
  Text,
  Input,
  Flex,
  FormErrorMessage,
  FormControl,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import dataController from "../../../utils/controller";
import { User } from "@prisma/client";
import { supabase } from "../../../lib/supabase";
import { cdnSource } from "../../../utils/global";

type Props = {};

export default function SettingPage({}: Props) {
  const inputProfile = useRef<HTMLInputElement | any>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [profileUpload, setProfileUpload] = useState<File>();
  const [errorUsername, setErrorUsername] = useState<boolean>(false);
  const toast = useToast();
  const user = useUser();
  const router = useRouter();

  const { data: datauser, isLoading: isLoadingGet } = useQuery({
    queryKey: ["finduser", user?.id],
    queryFn: async () => {
      return await dataController.getUser(user?.id);
    },
    onSuccess: (res) => {
      setImagePreview(`${cdnSource}${res?.id}/profile${res?.avatar}`);
      setValue("username", res?.username);
      setValue("biodata", res?.biodata);
    },
  });

  const schema = yup.object().shape({
    id: yup.string().required().default(user?.id),
    avatar: yup
      .string()
      .min(1)
      .required()
      .default(
        `${cdnSource}${user?.id}/profile${datauser?.avatar}` !== imagePreview
          ? Date.now().toString()
          : datauser?.avatar
      ),
    username: yup
      .string()
      .required()
      .min(3)
      .matches(/^(\S+$)/g, "Username tidak boleh menggunakan spasi"),
    biodata: yup.string().nullable(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<User>({
    resolver: yupResolver(schema),
  });

  const handleFile = (e: ChangeEvent<HTMLInputElement | any>) => {
    if (e.target.files?.length !== 0) {
      switch (e.target.files[0].type.split("/")[0]) {
        case "video":
          setImagePreview(URL.createObjectURL(e.target.files[0]));
          setProfileUpload(e.target.files[0]);
        case "image":
          setImagePreview(URL.createObjectURL(e.target.files[0]));
          setProfileUpload(e.target.files[0]);
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

  const onProfileClick = () => {
    inputProfile?.current.click();
  };

  const { mutate, isLoading }: any = useMutation({
    mutationKey: ["updateuser", user?.id],
    mutationFn: async (data: User) => {
      if (
        `${cdnSource}${data?.id}/profile${datauser?.avatar}` !== imagePreview
      ) {
        await supabase.storage
          .from("source")
          .remove([`${data.id}/profile${datauser?.avatar}`]);
        await supabase.storage
          .from("source")
          .upload(`${data.id}/profile${data.avatar}`, profileUpload as File);
      }
      console.log(data.avatar, datauser?.avatar);
      await dataController.updateUser(data);
    },

    onSuccess: () => {
      router.push(`/${getValues("username")}`);
    },
    onError: () => {
      setErrorUsername(true);
    },
  });

  return (
    <>
      <Container>
        <Heading>Pengaturan</Heading>
        <Divider my={3} />
        <form onSubmit={handleSubmit(mutate)}>
          <Box mb={8}>
            <Box>
              <Heading size={"md"}>Foto Profil</Heading>
              <Text>Gambar maksimal: 3 mb</Text>
            </Box>
            <Box my={3}>
              <FormControl isInvalid={!!errors.avatar}>
                <Input
                  type="file"
                  hidden
                  accept=".png,.jpeg,.jpg"
                  {...register("avatar")}
                  onChange={handleFile}
                  ref={inputProfile}
                />{" "}
                <Image
                  _hover={{ opacity: "0.8" }}
                  width={200}
                  height={200}
                  src={imagePreview}
                  alt={""}
                  border={"1px"}
                  borderRadius={5}
                  borderColor={!!errors.avatar ? "red.400" : "Highlight"}
                  borderStyle={"dashed"}
                  borderWidth={"2px"}
                  cursor={"pointer"}
                  p={2}
                  onClick={onProfileClick}
                  objectFit={"contain"}
                />
                <FormErrorMessage>{!!errors.avatar?.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </Box>
          <Box mb={8}>
            <Flex flexDirection={"column"} gap={2}>
              <Heading size={"md"}>* Username</Heading>
              <Text fontSize={"sm"}>
                Panjang username: 3 - 30 karakter
                <br />
                Karakter yang valid: a-z / 0-9 / _ / .
              </Text>
              <FormControl isInvalid={!!errors.username}>
                <Input placeholder="username kamu" {...register("username")} />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
              </FormControl>
            </Flex>
          </Box>
          <Box>
            <Flex flexDirection={"column"} gap={2}>
              <Heading size={"md"}>* Biodata</Heading>
              <Text fontSize={"sm"}>
                Isi biodata sesuai yang anda punya, agar memudahkan orang lain
                mengenali mu
              </Text>
              <FormControl isInvalid={!!errors.biodata}>
                <Input placeholder="biodatamu" {...register("biodata")} />
                <FormErrorMessage>{errors.biodata?.message}</FormErrorMessage>
              </FormControl>
            </Flex>
          </Box>
          <Divider my={5} />
          <Text color={"red.500"}>
            {errorUsername ? "Username telah terpakai" : ""}
          </Text>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={isLoading}
            float={"right"}
          >
            Ubah
          </Button>
        </form>
      </Container>
    </>
  );
}
