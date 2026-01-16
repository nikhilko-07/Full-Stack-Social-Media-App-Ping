import { Stack, Skeleton } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack spacing="2">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} height="45px" />
      ))}
    </Stack>
  );
};

export default ChatLoading;