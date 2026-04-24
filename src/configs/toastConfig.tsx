/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { BaseToast } from 'react-native-toast-message';

const toastConfig = {

  info: ({ props }: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'yellow' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '500',
        color: 'black',
      }}
      text2Style={{
        fontSize: 14,
        fontWeight: '500',
        color: 'black',
      }}
    />
  ),
};

export default toastConfig;
