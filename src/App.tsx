import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://bd09d30cfa9d5d99672dd910321e0545@o4509977189810176.ingest.us.sentry.io/4509977304956928',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import RootNavigator from './app/RootNavigator';
import useAuthStore from './store/auth.store';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { toastConfig } from './components/toastConfig';

function App() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  useEffect(() => {
    fetchAuthenticatedUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FE8C00" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <RootNavigator />
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default Sentry.wrap(App);
