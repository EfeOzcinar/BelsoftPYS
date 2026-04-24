/* eslint-disable handle-callback-err */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Alert, Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import PageDimensions from "../../../constants/pageDimensions";
import { getResponsiveSize } from "../../../utilMethods";
import { Dialog } from "react-native-ui-lib";

function ApplicationUpdate({ showUpdateWindow, closeUpdatingWindows }: any) {

    const appStoreUrl = 'itms-apps://apps.apple.com/tr/app/i-%C5%9Flem-%C3%B6%C4%9Fretim-kurumlar%C4%B1/id1624762037?l=tr';

    const playStoreUrl = 'https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME';


    const handleUpdatePress = async () => {
        const url = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;

        try {
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Hata", "Lütfen ios/android marketten uygulamayı güncelleyiniz.");
                console.error("Unsupported URL: ", url);
            }
        } catch (err) {
            console.log("🚀 ~ handleUpdatePress ~ err:", err);
            Alert.alert("Hata", "Lütfen ios/android marketten uygulamayı güncelleyiniz.");
        }
    };

    const closeWindow = () =>{
        closeUpdatingWindows(true);
    };

    return (
        <Dialog
            visible={showUpdateWindow}
            width={PageDimensions.wp * 0.8}
            containerStyle={{
                borderRadius: getResponsiveSize(5),
                borderWidth: 1,
                borderColor: 'gray',
                elevation: 8,
                justifyContent: 'center',
                backgroundColor: 'white',
                padding: '2%',
            }}
            ignoreBackgroundPress
        >
            <View>
                <Text style={{ fontWeight: 'bold', fontSize: getResponsiveSize(12), textAlign: 'center', marginTop: '5%' }}>Uygulama Güncellenmesi</Text>
                <Text style={{ fontSize: getResponsiveSize(10), marginTop: '5%' }}>Merhaba uygulamamıza yeni özellikler eklenmiştir. Daha iyi hizmet almak için Lütfen uygulamayı güncelleyiniz.</Text>
                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '5%' }}>
                    <TouchableOpacity
                        style={{
                            padding: '2%',
                            width: getResponsiveSize(100),
                            height: getResponsiveSize(25),
                            backgroundColor: 'red',
                            borderRadius: 5,
                            marginTop: '5%',
                            marginLeft: '5%',
                        }} onPress={closeWindow}>
                        <Text style={{ color: 'white', fontSize: getResponsiveSize(13), textAlign: 'center' }}>Kapat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            padding: '2%',
                            width: getResponsiveSize(100),
                            height: getResponsiveSize(25),
                            backgroundColor: 'green',
                            borderRadius: 5,
                            marginTop: '5%',
                            marginLeft: '5%',
                        }} onPress={handleUpdatePress}>
                        <Text style={{ color: 'white', fontSize: getResponsiveSize(13), textAlign: 'center' }}>Güncelle</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Dialog>

    )
}

export default ApplicationUpdate;
