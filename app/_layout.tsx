import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { requestNotificationPermissions, scheduleDailyStreakNotification } from '@/lib/notifications';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const setupNotifications = async () => {
      await requestNotificationPermissions();
      await scheduleDailyStreakNotification();
    };

    setupNotifications();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
      <Stack screenOptions={{ animationTypeForReplace: 'push' , animation: 'slide_from_bottom'}} >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
      </Stack>
  );
}
