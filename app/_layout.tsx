import "@/global.css";
import { useUserSync } from "@/hooks/useUserSync";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const publishablekey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function App() {
  const { isLoaded } = useAuth();

  useUserSync()

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return <Slot />;
}

export default function RootLayout() {
  if (!publishablekey) {
    throw new Error("Add your clerk publishable key to your env file");
  }

  return (
    <ClerkProvider
      publishableKey={publishablekey}
      tokenCache={tokenCache}
    >
      <App />
    </ClerkProvider>
  );
}
