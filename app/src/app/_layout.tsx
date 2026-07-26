import { DarkTheme, Slot, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppShell } from "@/presentation/shell/app-shell";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AppShell>
        <AnimatedSplashOverlay />
        <Slot />
      </AppShell>
    </ThemeProvider>
  );
}
