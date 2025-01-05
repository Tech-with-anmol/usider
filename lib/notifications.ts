import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
};


export const scheduleDailyStreakNotification = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync(); 

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Streak Reminder",
      body: "Don't forget to maintain your streak today!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 24 * 60 * 60, 
      repeats: true,
    },
  });
};
