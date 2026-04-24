/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Dialog, View, Text, Button, Image} from 'react-native-ui-lib';
import { deleteIcon } from '../../../assets/icons';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';

interface ErrorAlertProps {
  error?: any;
  setError?: any;
}

function ImpErrorAlert(props: ErrorAlertProps) {
  const {themeColor} = useAppContext();
  const [isVisible, setisVisible] = useState(false);
  const {error, setError} = props;

  useEffect(() => {
    if (error ?  error?.Message ? error?.Message : error : 'Beklenmedik Hata Oluştu') {
        setisVisible(true);
    }
  }, [error]);

  return (
    <View>
      <Dialog
        visible={isVisible}
        onDismiss={() => setisVisible(false)}
        width={PageDimensions.wp * 0.9}
        panDirection="right"
        containerStyle={{
          borderRadius: 6,
          backgroundColor: themeColor.red,
          borderWidth: 1,
          borderColor: themeColor.headerBgColor,
          elevation: 8,
        }}>
        <View row spread padding-10 style={{height: PageDimensions.hp * 0.04, width: PageDimensions.wp * 0.9}}>
          <View style={{justifyContent:'center', alignItems:'center', display:'flex', width:'100%'}}>
            <Text
              style={{
                fontSize: 16,
                color: themeColor.white,
                fontWeight:'bold'
              }}
            >
              Opppss! Bir hata oluştu.
            </Text>
          </View>
          <TouchableOpacity onPress={() => setError(null)}>
            <Image
              source={deleteIcon}
              resizeMode="contain"
              style={{width: 12, tintColor: themeColor.white}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: PageDimensions.wp * 0.9,
            display: 'flex',
            paddingBottom: 20,
            paddingHorizontal: 20,
            backgroundColor: themeColor.white,
            borderTopStartRadius: 35,
            borderTopEndRadius: 35,
          }}>
          <View centerH padding-15>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 20,
              }}>
              { error ?  error?.Message ? error?.Message : error : 'Beklenmedik Hata Oluştu'}
            </Text>
          </View>
          <View centerH>
            <Button
              label="Tamam"
              color="#fff"
              onPress={() => setError(null)}
              size={Button.sizes.small}
              style={{
                borderRadius: 3,
                backgroundColor: themeColor.headerBgColor,
              }}
            />
          </View>
        </View>
      </Dialog>
    </View>
  );
}

export default ImpErrorAlert;
