import { useTheme } from "@/context/ThemeContext";
import { Toaster as Sonner, toast } from "sonner";

const Toaster = (props) => {
  const { theme } = useTheme();
  // Use theme as needed, e.g., pass to Sonner or for styling
  return <Sonner theme={theme} {...props} />;
};

export { Toaster, toast };
