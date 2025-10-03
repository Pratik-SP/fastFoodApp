import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://bd09d30cfa9d5d99672dd910321e0545@o4509977189810176.ingest.us.sentry.io/4509977304956928',
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import cn from 'clsx';
import RootNavigator from './app/RootNavigator';

import { toastConfig } from './components/toastConfig';
import { persistor, store } from './redux-store/store';
import { fetchAuthenticatedUser } from './redux-store/authSlice';
import { useAppDispatch, useAppSelector } from './redux-store/hooks';

function App() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isLoading = useAppSelector(state => state.auth.isLoading);

  useEffect(() => {
    dispatch(fetchAuthenticatedUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FE8C00" />
      </View>
    );
  }
  const styles = StyleSheet.create({
    spaces: {
      paddingTop: StatusBar.currentHeight,
      paddingBottom: 25,
    },
  });
  return (
    <NavigationContainer>
      <View
        className={cn(
          'flex-1',
          colorScheme === 'dark' ? 'bg-gray' : 'bg-white',
        )}
        style={styles.spaces}
      >
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <RootNavigator />
        <Toast config={toastConfig} />
      </View>
    </NavigationContainer>
  );
}

export default Sentry.wrap(() => (
  <Provider store={store}>
    <PersistGate
      loading={
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#FE8C00" />
        </View>
      }
      persistor={persistor}
    >
      <App />
    </PersistGate>
  </Provider>
));
