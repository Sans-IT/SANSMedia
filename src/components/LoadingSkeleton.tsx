import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

type Props = {};

export default function LoadingSkeleton({}: Props) {
  return (
    <Stack>
      <Skeleton height="100px" />
      <Skeleton height="100px" />
      <Skeleton height="100px" />
    </Stack>
  );
}
