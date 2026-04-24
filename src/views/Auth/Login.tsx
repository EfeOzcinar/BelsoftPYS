


/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable comma-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useContext, useState } from 'react';
import { Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, Icon, Image, Text, View } from 'react-native-ui-lib';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { passwordIcon } from '../../assets/icons';
import {
  ImpLoginInput,
  ImpPageContainer,
  useImpLoginInput
} from '../../components/BasicComponents';
import { AppContext } from '../../context/AppContext';
import blsCore from '../../core';
import { getResponsiveSize } from '../../utilMethods';
import Toast from 'react-native-toast-message';

const wp = Dimensions.get('window').width;
const hp = Dimensions.get('window').height;

function Login() {

  const { setUserInfo } = useContext(AppContext);

  const txtUserName = useImpLoginInput({label: 'Kullanıcı Adı'});
  const txtPassword = useImpLoginInput({label: 'Şifre'});
  const [loading, setLoading] = useState<boolean>(false);

  const [isPasswordNotVisible, setIsPasswordNotVisible] = useState<boolean>(true);



  const onSubmit = async()=> {
    try {
      if (txtUserName.value.trim() !== '' && txtPassword.value.trim() !== ''){
        setLoading(true);
        const response = await blsCore.services.authService.login(txtUserName.value, txtPassword.value);  
          console.log("🚀 ~ onSubmit ~ response:", response)
          if (response){
            await AsyncStorage.setItem('UserInfo',JSON.stringify(response));
            /*const currentUserToken = await AsyncStorage.getItem('fcmtoken');
            

            console.log("currentUserToken",currentUserToken);

            const personnelInfo = await blsCore.services.firebaseService.getUserInfoByUserName(response.UserName);
           
            if (currentUserToken && personnelInfo) {
              await blsCore.services.firebaseService.updateUserToken(personnelInfo.id, currentUserToken);
            }
            else {
              if (currentUserToken) {
                await blsCore.services.firebaseService.saveUser({
                  ...response,
                  UserToken: currentUserToken,
                });
              }
            }*/

            setUserInfo(response);
          }
          else {
            Toast.show({type: 'error', text1: 'Kullanıcı adı veya şifreniz yanlış'});
          }
        setLoading(false);
    } else {
      Toast.show({type: 'success', text1: 'Kurum Kodu, Kullanıcı adı ve şifre boş bırakılamaz'});
    } 
    }
    catch (e){
      console.log("error", e);
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/images/mainBg.png')}
      style={{flex: 1, width: wp, height: hp}}>
        <ImpPageContainer systemLoading={loading}>
        <View backgroundColor="transparent" flex centerH>
        <View
          backgroundColor="#fff"
          marginT-150
          centerH
          style={{borderRadius: 10, padding: 5}}>
          <Image
            source={require('../../assets/logo/logo.png')}
            style={{width: getResponsiveSize(70), height: getResponsiveSize(70)}}
          />
        </View>
        <Text
          marginT-20
          white
          style={{fontSize: getResponsiveSize(15)}}>
          {' '}
          Proje Yönetim Sistemi{' '}
        </Text>
        <View
          centerH
          backgroundColor="#F5F5F5"
          width={wp}
          height={hp}
          marginT-30
          style={{borderColor: '#fff', borderTopLeftRadius: 110}}>
          <Text
            marginT-50
            text60M
            green10
            style={{color: '#1450A3',fontSize:getResponsiveSize(14)}}>
            {' '}
            Hesabınıza <Text black>Giriş Yapınız</Text>{' '}
          </Text>
          <ImpLoginInput
            inputState={txtUserName}
            width={wp * 0.7}
            containerStyle={{marginTop: '2%'}}
            iconName={passwordIcon}
          />
          <ImpLoginInput
            inputState={txtPassword}
            width={wp * 0.62}
            containerStyle={{marginTop: '2%'}}
            iconName={passwordIcon}
            secureTextEntry={isPasswordNotVisible}
            trailingAccessory={
              <TouchableOpacity
                  onPress={() => setIsPasswordNotVisible(!isPasswordNotVisible)} 
                  style={{width: hp * 0.04, height: hp * 0.04, alignItems: 'center', justifyContent: 'center'}}
              >
                  <Icon source={
                      isPasswordNotVisible ?  passwordIcon : passwordIcon} 
                      tintColor={'#1450A3'} size={hp * 0.02} 
                  />
              </TouchableOpacity>
            }
          />

          <View style={{marginTop: '5%'}}>
            <Button 
              label="Giriş" 
              onPress={onSubmit} 
              style={{
                width: wp * 0.82,
                height:getResponsiveSize(32),
                borderRadius: hp * 0.01,
              }}
              labelStyle={{fontSize:getResponsiveSize(12)}}
            />
          </View>
        </View>
      </View>
        </ImpPageContainer>
     
    </ImageBackground>
  );
}
export default Login;

