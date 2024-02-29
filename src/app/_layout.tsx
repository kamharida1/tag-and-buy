import "react-native-reanimated";
import "react-native-gesture-handler";
  
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { ThemeProvider } from "@/components/Theme";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "react-native";
import Constants from "expo-constants";

import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import QueryProvider from "@/providers/QueryProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    airBold: require("../assets/fonts/AirbnbCereal_W_Bd.otf"),
    airRegular: require("../assets/fonts/AirbnbCereal_W_Bk.otf"),
    airExtraBold: require("../assets/fonts/AirbnbCereal_W_XBd.otf"),
    airLight: require("../assets/fonts/AirbnbCereal_W_Lt.otf"),
    airMedium: require("../assets/fonts/AirbnbCereal_W_Md.otf"),
    airBlack: require("../assets/fonts/AirbnbCereal_W_Blk.otf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const InitialLayout = () => {
  const { isLoaded, isSignedIn,} = useAuth();
  const { user } = useUser();
  const segments = useSegments();
  const router = useRouter();

  const navigationState = useRootNavigationState();

  console.log("user", user?.publicMetadata.role);

  // If the user is signed in, redirect them to the home page
  // If the user is not signed in, redirect them to the login page
  useEffect(() => {
    if (!isLoaded) return;
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }

    const inTabsGroup = segments[0] === "(auth)";

    if (isSignedIn && !inTabsGroup && user?.publicMetadata.role === "Admin") {
      router.replace("/(admin)/home");
    } else if (
      isSignedIn &&
      !inTabsGroup &&
      user?.publicMetadata.role !== "Admin"
    ) {
      router.replace("/(user)/home");
    } else if (!isSignedIn) {
      router.replace("/login");
    }
  }, [isSignedIn, navigationState?.key]);

  return <Slot />;
};


function RootLayoutNav() {
  return (
    <QueryProvider>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY!}
        //publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
        tokenCache={tokenCache}
      >
        <ThemeProvider>
          <SafeAreaProvider>
            <InitialLayout />
          </SafeAreaProvider>
        </ThemeProvider>
        {/* </ThemeProvider> */}
      </ClerkProvider>
    </QueryProvider>
  );
}
