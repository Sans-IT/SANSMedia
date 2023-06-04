import {
  VStack,
  Text,
  Box,
  Flex,
  Avatar,
  Textarea,
  Button,
  HStack,
  Heading,
  Spacer,
  IconButton,
  useColorModeValue,
  FormControl,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { AiFillDelete } from "react-icons/ai";
import LoginModal from "./LoginModal";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import dataController from "../../utils/controller";
import { Comment, Post } from "@prisma/client";
import { cdnSource } from "../../utils/global";

type Props = {
  comment: boolean;
  postprops: Post;
};

export default function CommentSession({ comment, postprops }: Props) {
  const user = useUser();
  const bgMode = useColorModeValue("white", "gray.700");

  const schema = yup.object().shape({
    body: yup.string().min(1).required("Komentar wajib diisi"),
    userId: yup.string().required().default(user?.id),
    postId: yup.string().required().default(postprops?.id),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<Comment>({
    resolver: yupResolver(schema),
  });

  const { data: userdata } = useQuery({
    queryKey: ["finduser"],
    queryFn: async () => {
      return await dataController.getUser(user?.id);
    },
  });

  const {
    data,
    isLoading: loadingComment,
    refetch,
  } = useQuery({
    queryKey: ["getcomment", postprops?.id],
    queryFn: async () => {
      return await dataController.getComment(postprops?.id);
    },
    onSuccess: () => {
      setValue("body", "");
    },
  });

  const { mutate, isLoading }: any = useMutation({
    mutationKey: ["createcomment"],
    mutationFn: async (data: Comment) => {
      return await dataController.createComment(data);
    },
    onSuccess: () => refetch(),
  });

  const { mutate: deletecomment }: any = useMutation({
    mutationKey: ["deletecomment"],
    mutationFn: async (data: string) => {
      return await dataController.deleteComment(data);
    },
    onSuccess: () => refetch(),
  });

  if (postprops === undefined) return <></>;

  return (
    <VStack
      alignItems={"start"}
      w={"full"}
      bg={comment ? bgMode : ""}
      p={comment ? "5" : ""}
      borderRadius={5}
      shadow={comment ? "lg" : ""}
      // maxHeight={comment ? "700px" : ""}
      // overflowY={comment ? "scroll" : "hidden"}
    >
      <VStack w={"full"} alignItems={"start"}>
        <Heading size={"sm"} mb={3}>
          {data?.length} Komentar
        </Heading>
        <form className="w-full" onSubmit={handleSubmit(mutate)}>
          <FormControl isInvalid={!!errors.body} w={"full"} mb={3}>
            <Flex gap={3}>
              <Avatar
                src={`${cdnSource}${userdata?.id}/profile${userdata?.avatar}`}
                size={"md"}
              />
              <Textarea
                placeholder="tuliskan komentarmu"
                resize={"none"}
                {...register("body")}
              />
            </Flex>
            <FormErrorMessage float={"right"} mb={3}>
              {errors.body?.message}
            </FormErrorMessage>
          </FormControl>
          <Flex alignItems={"start"} w="full">
            <Spacer />
            {user ? (
              <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                Kirim
              </Button>
            ) : (
              <LoginModal buttonText="Kirim" />
            )}
          </Flex>
        </form>
      </VStack>
      <Flex flexDirection={"column"} px={3} py={2} pb={0} w={"full"}>
        {loadingComment ? (
          <Box mx={"auto"}>
            <Spinner size={"lg"} />
          </Box>
        ) : (
          data?.map((comment: CommentWithUser) => {
            return (
              <HStack mb={5} key={comment?.id}>
                <Avatar
                  src={`${cdnSource}${comment?.user?.id}/profile${comment?.user.avatar}`}
                  size={"md"}
                  me={1}
                />
                <Box>
                  <Heading size={"sm"}>{comment.user.username}</Heading>
                  <Text>{comment.body}</Text>
                </Box>
                <Spacer />
                {user?.id === postprops?.userId ||
                user?.id === comment?.userId ? (
                  <IconButton
                    icon={<AiFillDelete />}
                    aria-label="delete komentar"
                    size={"sm"}
                    onClick={() => deletecomment(comment?.id)}
                  />
                ) : (
                  ""
                )}
              </HStack>
            );
          })
        )}
        <Text textAlign={"center"} color={"gray.400"} fontStyle={"italic"}>
          ~ komentar sudah habis ~
        </Text>
      </Flex>
    </VStack>
  );
}
