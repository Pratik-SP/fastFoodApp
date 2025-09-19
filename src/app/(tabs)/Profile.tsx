import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { signOut } from '../lib/appwrite';
import useAuthStore from '../../store/auth.store';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';

function ProfileDetails({ title, userDetail }: any) {
  return (
    <View className="profile-field pt-4">
      <View className="profile-field__icon">
        <Ionicons
          name={title === 'Name' ? 'person-outline' : 'mail-outline'}
          size={20}
          color={'#FE8C00'}
        />
      </View>
      <View className="flex-1 py-1">
        <Text className="label">{title}</Text>
        <Text className="label base-bold">{userDetail}</Text>
      </View>
    </View>
  );
}

function Profile() {
  const { setIsAuthenticated, setUser, user } = useAuthStore();
  const handleLogout = async () => {
    try {
      await signOut();

      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    }
  };
  return (
    <View className="flex-1 px-2">
      <View className="p-5">
        <View>
          <Text className="base-semibold text-dark-100 text-center">
            Profile
          </Text>
        </View>
        <View className="py-8 flex-center">
          <Image source={{ uri: user?.avatar }} className="profile-avatar" />
          <TouchableOpacity className="ml-20">
            <Image
              source={images.pencil}
              resizeMode="center"
              className="profile-edit border-1"
            />
          </TouchableOpacity>
          <Text className="h3-bold mt-4">{user?.name}</Text>
        </View>

        <View className="p-4 bg-white rounded-3xl mb-8">
          <ProfileDetails
            title="Name"
            userDetail={user?.name}
            image={images.user}
          />
          <ProfileDetails
            title="Email"
            userDetail={user?.email}
            image={images.envelope}
          />
        </View>

        <CustomButton
          leftIcon={
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#F14141"
              style={styles.logOut}
            />
          }
          title="Sign Out"
          onPress={handleLogout}
          style="border border-error p-4 bg-softPink"
          textStyle="text-error"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logOut: { marginRight: 10 },
});

export default Profile;
