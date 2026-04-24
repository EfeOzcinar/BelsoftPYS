import React, { useEffect, useState } from 'react'
import { Image, View } from 'react-native-ui-lib'
import { ImpButton, ImpInput, ImpPageContainer, useImpInput } from '../../components/BasicComponents'
import PageDimensions from '../../constants/pageDimensions'
import { changePassword } from '../../assets/images'
import { useAppContext } from '../../context/AppContext'
import { useImpButton } from '../../components/BasicComponents/ImpButton'
import Toast from 'react-native-toast-message'
import blsCore from '../../core'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const ChangePassword = () => {
    const {themeColor} = useAppContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    const txtNewPassword = useImpInput({label: 'Yeni şifre', allowBlank: false});
    const txtReNewPassword = useImpInput({ label: 'Yeni şifre (Tekrar)', allowBlank: false });

    const btnSave = useImpButton({});

    const checkRequired = () => {
        txtNewPassword.checkRequired();
        txtReNewPassword.checkRequired();
    };

    useEffect(() => {
        const pageLoad = async() => {
            try {
                setLoading(true);
                const userInfoString = await AsyncStorage.getItem('UserInfo');
                const userId = userInfoString && JSON.parse(userInfoString).id;

                setCurrentUserId(userId || '');

                setLoading(false);
            } catch(e){
                setLoading(false);
            }
        }
        pageLoad();
    }, [])
    


    const onSaveButton = async() => {
        try {
            setLoading(true);
            checkRequired();

            if (txtNewPassword.value.length < 6 || txtReNewPassword.value.length < 6) {
                Toast.show({type: 'error', text1: 'Girdiğiniz şifre en az 6 karakterden oluşmalı!'});
            } else if (txtNewPassword.value === txtReNewPassword.value) {
                
               await blsCore.services.authService.updatePassword(currentUserId, txtReNewPassword.value);
                
                Toast.show({type: 'success', text1: 'Şifreniz başarılı güncellendi!'});
                txtNewPassword.clear();
                txtReNewPassword.clear();
              } else {
                Toast.show({type: 'error', text1: 'Girdiğiniz şifreler aynı olmalı!'});
              }

            setLoading(false);
        } catch(e){
            setLoading(false);
        }
    };


  return (
    <ImpPageContainer systemLoading={loading}>
        <View
            style={{
                width: PageDimensions.wp,
                height: PageDimensions.hp,
                backgroundColor: themeColor.white
            }}
        >
           
            <View 
                style={{
                    backgroundColor: themeColor.mainBackgroundColor, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: Platform.OS === 'android' ? PageDimensions.hp * 0.37 : PageDimensions.hp * 0.42,
                    // borderBottomLeftRadius: PageDimensions.hp * 0.1,
                    borderBottomRightRadius: PageDimensions.hp * 0.1
                }}
            >
                <Image
                    source={changePassword}
                    resizeMode="contain"
                    style={{
                    width: PageDimensions.hp * 0.35,
                    height: PageDimensions.hp * 0.35,
                    }}
                />
            </View>

            <View style={{ backgroundColor: themeColor.mainBackgroundColor, marginTop: PageDimensions.hp * 0.03}}>
                <View 
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: PageDimensions.hp * 0.45,
                        backgroundColor: themeColor.white,
                        borderBottomLeftRadius: PageDimensions.hp * 0.12,

                    }}>
                    <ImpInput 
                        inputState={txtNewPassword} 
                        // containerStyle={{height: PageDimensions.hp * 0.06}} 
                        secureTextEntry
                    />
                    <ImpInput 
                        inputState={txtReNewPassword} 
                        containerStyle={{marginTop: PageDimensions.hp * 0.015}} 
                        secureTextEntry
                    />

                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: PageDimensions.hp * 0.04
                        }}
                    >
                        <ImpButton type='save' buttonState={btnSave} onPress={onSaveButton}/>
                    </View>
                </View>
            </View>

            <View 
                style={{
                    backgroundColor: themeColor.mainBackgroundColor,
                    width: PageDimensions.wp,
                    height: PageDimensions.hp * 0.05,
                    // marginTop: PageDimensions.hp * 0.08,
                }}
            />
        </View>
    </ImpPageContainer>
  )
}

export default ChangePassword