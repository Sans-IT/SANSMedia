import { Comment, Post, User } from "@prisma/client";
import axios from "axios";

// user
const getUser = async (data: string | any) => {
  const response = await axios.get<UserWithPost>(`/api/user/${data}`);
  return response.data;
};

const updateUser = async (data: User) => {
  const response = await axios.patch<User>(`/api/user/updateuser`, data);
  return response.data;
};

// post
const getPost = async (data: string | string[] | undefined) => {
  const response = await axios.get<PostWithUser[]>(`/api/post/${data}`);
  return response.data;
};

const getAllPost = async () => {
  const response = await axios.get<PostWithUser[]>("/api/post/getallpost");
  return response.data;
};

const createPost = async (data: Post) => {
  const response = await axios.post<Post>("/api/post/createpost", data);
  return response.data;
};

const deletePost = async (data: string) => {
  const response = await axios.delete(`/api/post/deletepost?postid=${data}`);
  return response.data;
};

// comment
const getComment = async (data: string | undefined) => {
  const response = await axios.get<CommentWithUser[]>(`/api/comment/${data}`);
  return response.data;
};

const createComment = async (data: Comment) => {
  const response = await axios.post<Comment>(
    "/api/comment/createcomment",
    data
  );
  return response.data;
};

const deleteComment = async (data: string) => {
  const response = await axios.delete(
    `/api/comment/deletecomment?commentid=${data}`
  );
  return response.data;
};

const dataController = {
  getAllPost,
  createPost,
  getUser,
  updateUser,
  createComment,
  getPost,
  getComment,
  deletePost,
  deleteComment,
};

export default dataController;
