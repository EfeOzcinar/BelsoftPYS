/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import AppProvider from './src/context/AppContext';
import AppNavigator from './src/views/routes';
import Toast from 'react-native-toast-message';
import toastConfig from './src/configs/toastConfig';

function App() {



  return (
    <AppProvider>
        <AppNavigator />
        <Toast config={toastConfig}/>
    </AppProvider>
  );
}
export default  App;
