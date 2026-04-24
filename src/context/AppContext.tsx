/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { LoginResponse } from '../core/Services/AuthService/interfaces';
import { DefaultThemeColors } from '../constants/ThemeColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImpErrorAlert from '../components/BasicComponents/ImpError/ImpError';

type AppValuesType = {
  userInfo: any;
  setUserInfo: any;
  loading: boolean;
  setLoading: any;
  setError: any;
  themeColor: any;
  setThemeColor: any;
};

const defaultProvider: AppValuesType = {
  userInfo: null,
  setUserInfo: () => null,
  loading: false,
  setLoading: () => false,
  setError: () => null,
  themeColor: DefaultThemeColors,
  setThemeColor: () => null,
};

export const AppContext = React.createContext(defaultProvider);

interface Props {
  children: ReactNode;
}

function AppProvider({ children }: Props) {
  const [userInfo, setUserInfo] = useState<LoginResponse>();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const [themeColor, setThemeColor] = useState<any>(defaultProvider.themeColor);

  const values = useMemo(
    () => ({
      loading,
      setLoading,
      setError,
      error,
      userInfo,
      setUserInfo,
      themeColor,
      setThemeColor,
    }),
    [loading, userInfo],
  );

  useEffect(() => {
    console.log("themeColorqeqe",themeColor)
    async function pageLoad() {
      await AsyncStorage.setItem('ThemeColor', JSON.stringify(themeColor));
    }
    pageLoad();
  }, [themeColor, setThemeColor]);


  return (
    <AppContext.Provider value={values}>
      {children}
      {error && <ImpErrorAlert error={error.response?.data || error.message || 'Beklenmedik hata oluştu'} setError={setError} />}
    </AppContext.Provider>
  );
}

export default AppProvider;

export const useAppContext = () => useContext(AppContext);
