import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ReactNode } from 'react';

import { images } from '../../constants';

type AuthLayoutProps = {
  children: ReactNode;
};

function AuthLayout({ children }: Readonly<AuthLayoutProps> | any) {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="relative h-1/2">
          <ImageBackground
            source={images.loginGraphic}
            className="w-full h-full"
            resizeMode="cover"
          />

          <View className="absolute inset-0 bg-black opacity-40" />

          <View className="absolute -inset-6 justify-end items-center z-10">
            <Image
              source={images.logo}
              className="w-48 h-48 rounded-full"
              resizeMode="contain"
            />
          </View>
        </View>

        <View
          className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-10 -mt-16 shadow-lg"
          style={styles.shadowStyle}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  shadowStyle: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default AuthLayout;
