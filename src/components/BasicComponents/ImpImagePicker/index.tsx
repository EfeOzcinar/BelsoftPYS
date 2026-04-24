/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Image, PermissionsAndroid, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {Dialog} from 'react-native-ui-lib';
import { closeIcon } from '../../../assets/icons';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';
import ImpButton from '../ImpButton';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const includeExtra = true;

function ImpImagePicker({imageList,buttonStyle}: any) {
  const [openPopup, setOpenPopup] = useState(false);
  const {setLoading} = useAppContext();

  useEffect(() => {
    imageList([]);
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Belsoft Sulama',
          message: 'Kameranızı kullanmak için erişim izni veriniz',
          buttonNeutral: 'Sonra Hatırlat',
          buttonNegative: 'Vazgeç',
          buttonPositive: 'İzin Ver',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onButtonPress = React.useCallback(async (type: any, options: any) => {
    try {
      setLoading(true);
      setOpenPopup(false);

      if (type === 'capture') {
        const permissonCamera = await requestCameraPermission();
        if (permissonCamera) {
          //ImagePicker.launchCamera(options, setResponse);
          ImagePicker.launchCamera(
            {
              ...options,
              includeBase64: true,
              quality: 0.8,
              maxHeight: 900,
              maxWidth: 900,
            }, // includeBase64: true,
            (response: any) => {
              imageList(response.assets || []);
            },
          );
        } 
      } 
      if (type === 'document') {
        setTimeout(async() => {
          await pickDocument();
        }, 100);
        
      }
      else {
        setTimeout(() => {
          ImagePicker.launchImageLibrary(
            {
              ...options,
              includeBase64: true,
              quality: 0.8,
              maxHeight: 900,
              maxWidth: 900,
            }, //includeBase64: true,
            (response: any) => {
              console.log("🚀 ~ setTimeout ~ response:", response)
              imageList(response.assets || []);
            },
          );
        }, 100);
        //ImagePicker.launchImageLibrary(options, setResponse);

      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const documents:any[] = [];
      await Promise.all(res.map(async (item: any) => {
        const documentObj:any = item;
        try { 
          await new Promise(resolve => setTimeout(resolve, 100));
          const base64Data = await RNFS.readFile(item.uri, 'base64');
          documentObj.base64 = base64Data;
          documentObj.fileName = documentObj.name;
          documents.push(documentObj);
        }
        catch (e) {
          console.log("🚀 ~ awaitPromise.all ~ e:", e);
        }
      }));
      imageList(documents);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the picker");
      } else {
        console.log("Error picking document:", err);
      }
    }
  };

  return (
    <View>
      <ImpButton type="addImage" onPress={() => setOpenPopup(true)} buttonStyle={buttonStyle}>
        Ekle
      </ImpButton>
      {openPopup && (
        <Dialog
          visible={openPopup}
          width={PageDimensions.wp * 0.8}
          height={PageDimensions.hp * 0.2}
          containerStyle={{
            borderRadius: 6,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'white',
            elevation: 8,
            alignItems: 'center',
            padding: 0,
            margin: 0,
          }}
          onDismiss={() => setOpenPopup(false)}>
          <TouchableOpacity
            style={{
              width: PageDimensions.wp * 0.8,
              height: PageDimensions.hp * 0.03,
              backgroundColor: '#5a48f5',
            }}
            onPress={() => setOpenPopup(false)}>
            <Image
              source={closeIcon}
              resizeMode="contain"
              style={{
                width: PageDimensions.hp * 0.02,
                marginTop: PageDimensions.hp * 0.005,
                tintColor: '#fff',
                marginLeft: PageDimensions.wp * 0.71,
              }}
            />
          </TouchableOpacity>
          {actions.map(({title, type, options}) => {
            return (
              <ImpButton
                key={type}
                type="addImage"
                onPress={() => onButtonPress(type, options)}
                buttonStyle={{marginTop: 10}}
                width={PageDimensions.wp * 0.5}>
                {title}
              </ImpButton>
            );
          })}
        </Dialog>
      )}
    </View>
  );
}

interface Action {
  title: string;
  type: 'capture' | 'library' | 'document';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  /*{
    title: 'Kamera',
    type: 'capture',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  }, */
  {
    title: 'Dosya',
    type: 'document',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
  {
    title: 'Resim',
    type: 'library',
    options: {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
      includeExtra,
    },
  },
];
export default ImpImagePicker;
