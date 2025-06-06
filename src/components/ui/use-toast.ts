import { toast as shadToast } from "sonner";

export function useToast() {
  return {
    toast: shadToast
  };
}
