import { Text, TextInput, View } from 'react-native';
import cn from 'clsx';
import { useState } from 'react';

import { CustomInputProps } from '../../type';

function CustomInput({
  placeholder = 'Enter text',
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = 'default',
}: Readonly<CustomInputProps>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full">
      <Text className="label">{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#888"
        autoCapitalize="none"
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'input',
          isFocused ? 'border-primary' : 'border-gray-300',
        )}
      />
    </View>
  );
}

export default CustomInput;
