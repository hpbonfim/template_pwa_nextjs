import { QueryClient, type DefaultOptions } from "@tanstack/react-query";

export const defaultOptions = {
  queries: {}
} satisfies DefaultOptions;

export const queryClient = new QueryClient({
  defaultOptions
});
