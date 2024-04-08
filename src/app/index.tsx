import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const StartPage = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (isSignedIn && user?.publicMetadata.role === "Admin") {
    return <Redirect href="/(admin)/home" />;
  }
  if (isSignedIn && user?.publicMetadata.role !== "Admin") {
    return <Redirect href="/(user)/home" />;
  }
  
  return <Redirect href="/(public)/login" />;
};

export default StartPage;
