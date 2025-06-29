import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setupGlobalErrorHandler } from "@/lib/setupGlobalErrorHandler";
import Toast from "react-native-toast-message";
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  
  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.replace("/auth");
    }
    else if (user && segments[0] === "auth") {
      router.replace("/");
    }
  }, [isLoadingUser, user, segments]);


  if (isLoadingUser) return null; // Or a loading spinner

  return <>{children}</>;
}

export default function RootLayout() {
  useEffect(()=>{
    setupGlobalErrorHandler()
  },[])
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <PaperProvider>
          <SafeAreaProvider>
            <RouteGuard>
              <Slot />
              <Toast/>
            </RouteGuard>
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
