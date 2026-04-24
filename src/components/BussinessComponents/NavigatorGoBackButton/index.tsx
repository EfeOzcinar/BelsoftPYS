import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getResponsiveSize} from '../../../utilMethods';

const NavigatorGoBackButton = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate back or perform any exit-related action
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Text style={styles.buttonText}>{'< Geri Dön'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: getResponsiveSize(10),
  },
});

export default NavigatorGoBackButton;
