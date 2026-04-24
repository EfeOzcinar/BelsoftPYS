/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { View, StyleSheet, Alert, Platform, TouchableOpacity, Text, Image } from 'react-native';
import RNFS from 'react-native-fs';
import { downloadIcon } from '../../../assets/icons';
import { getResponsiveSize } from '../../../utilMethods';

interface DocumentProps {
    base64String: string;
    type: string;
}
function DocumentDownload({ base64String, type }: DocumentProps) {
    const saveImage = async (base64String: any) => {
        try {
            const directoryPath = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
            const filePath = `${directoryPath}/downloaded_file${type}`;

            await RNFS.writeFile(filePath, base64String, 'base64');
            Alert.alert('Başarılı', `Dosyanız şu konuma indirildi: ${filePath}`);
        } catch (error) {
            Alert.alert('Hata', 'Dosya indirilirken bir hata oluştu');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
            style={{
                backgroundColor:'orange',
                borderStyle:'solid',
                borderWidth:1,borderColor:'gray',
                padding:'3%',
                borderRadius:5,
                justifyContent:'center',
                alignItems:'center',
                flexDirection:'row',
                display:'flex',
            }}
            onPress={() => saveImage(base64String)}>
                <Image source={downloadIcon} style={{width:getResponsiveSize(20),height:getResponsiveSize(20),marginRight:'3%'}}/>
                <Text style={{fontWeight:'bold'}}>Dosyayı İndir</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default DocumentDownload;
