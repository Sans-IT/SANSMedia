import { Comment, Post, User } from "@prisma/client";

declare global {
  interface UserWithPost extends User {
    post: (Post & { user: User })[];
  }

  interface PostWithUser extends Post {
    user: User;
  }

  interface CommentWithUser extends Comment {
    user: User;
  }
}
