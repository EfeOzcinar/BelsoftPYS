/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Button, Dialog, Text, View } from 'react-native-ui-lib';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';
import { ImpButton } from '../../BasicComponents';
import * as ImagePicker from 'react-native-image-picker';


interface  FileSelectionDialogProps {
    isDialogVisible: boolean;
    onClose: () => void;
    fileList?: any;
}

function FileSelectionDialog(props: FileSelectionDialogProps){
    const {isDialogVisible, onClose, fileList}  = props;
    const {themeColor} = useAppContext();



    const onAddImageButtonPress = async (type: string, options: any) => {
        try {
            ImagePicker.launchImageLibrary(
                {
                  ...options,
                  includeBase64: true,
                  quality: 0.8,
                  maxHeight: 900,
                  maxWidth: 900,
                  selectionLimit:1,
                }, //includeBase64: true,
                (response: any) => {
                    fileList(response.assets || []);
                    onClose();
                },
              );
          
        } catch (error) {
            console.error("Error images:", error);
        }
    };


  return (
    <Dialog
        visible={isDialogVisible}
        width= {PageDimensions.wp * 0.98}
        containerStyle={{
            borderRadius: 6,
            backgroundColor: themeColor.white,
            borderWidth: 1,
            borderColor: themeColor.white,
            elevation: 8,
        }}
        ignoreBackgroundPress
    >
        <View
            row center
            style={{
                width: PageDimensions.wp * 0.97,
                height: PageDimensions.hp * 0.05,
                borderBottomWidth: 0.8,
                borderBottomColor: themeColor.inputBorderColor,
                paddingHorizontal: PageDimensions.wp * 0.03,
                marginTop: PageDimensions.hp * 0.01,
                justifyContent: 'space-between',
            }}
        >
            <Text style={{ fontSize: PageDimensions.hp * 0.02, fontWeight: '500'}} >
                Yüklemek istediğiniz dosya türün seçiniz
            </Text>
        </View>
        <View
            style={{
                width: PageDimensions.wp * 0.97,
                marginTop: PageDimensions.hp * 0.02,
                flexDirection: 'row',
                justifyContent: 'center',
            }}
        >

            <ImpButton
                type="addImage"
                onPress={() => onAddImageButtonPress(actions[0].type, actions[0].options)}
                buttonStyle={{marginTop: 10}}
                width={PageDimensions.wp * 0.4}>
                    Fotograf Ekle
            </ImpButton>
        </View>

        <View
            style={{
                width: PageDimensions.wp * 0.97,
                marginTop: PageDimensions.hp * 0.01,
                marginBottom: PageDimensions.hp * 0.01,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Button
                label='Kapat'
                color="#fff"
                onPress={() => onClose()}
                size={Button.sizes.small}
                style={{
                    borderRadius: 3,
                    backgroundColor: themeColor.purple,
                    width: PageDimensions.wp * 0.3,
                    marginTop: PageDimensions.hp * 0.03
                }}
            />
        </View>
    </Dialog>
  );
}


interface Action {
    title: string;
    type: 'capture' | 'library';
    options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

  const actions: Action[] = [
    {
      title: 'Galeri',
      type: 'library',
      options: {
        selectionLimit: 0,
        mediaType: 'photo',
        includeBase64: false,
      },
    },
    {
        title: 'Kamera',
        type: 'capture',
        options: {
          saveToPhotos: true,
          mediaType: 'photo',
          includeBase64: false,
        },
      },
  ];

export default FileSelectionDialog;
