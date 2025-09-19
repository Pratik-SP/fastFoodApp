import { StyleSheet, Text, View } from 'react-native';

function SuccessToast({ text1, text2 }: any) {
  return (
    <View style={styles.toastContainer}>
      <View style={styles.toastTextContainer}>
        <Text style={styles.toastText1}>{text1}</Text>
        {text2 ? <Text style={styles.toastText2}>{text2}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5ED',
    padding: 12,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FE8C00',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toastTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  toastText1: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
  toastText2: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    marginTop: 4,
  },
});
export const toastConfig = {
  success: (props: any) => <SuccessToast {...props} />,
};
