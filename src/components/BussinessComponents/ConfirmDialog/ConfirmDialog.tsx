/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dialog, View, Text, Button} from 'react-native-ui-lib';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';
import { getResponsiveSize } from '../../../utilMethods';



interface  ShowDialogProps {
    isDialogVisible: boolean;
    onClose: () => void;
    onSave: () => void;
    infoMessage: any;
}

function ConfirmDialog(props: ShowDialogProps) {
    const {themeColor} = useAppContext();

  return (
    <View>
      <Dialog
        visible={props.isDialogVisible}
        width={PageDimensions.wp * 0.9}
        panDirection="right"
        onDialogDismissed={() => props.onClose()}
        onDismiss={() => props.onClose()}
        containerStyle={{
          borderRadius: PageDimensions.hp * 0.01,
          backgroundColor: themeColor.purple,
          borderWidth: 1,
          borderColor: themeColor.inputBorderColor,
          elevation: 8,
          zIndex: 1,
        }}>
        <View
            row spread
            style={{
                height: PageDimensions.hp * 0.06,
                width: PageDimensions.wp * 0.9,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text
              style={{
                fontSize: PageDimensions.hp * 0.024,
                color: themeColor.white,
                textAlign: 'center',
              }}
            >
              Bilgilendirme
            </Text>
        </View>
        <View
          style={{
            width: PageDimensions.wp * 0.9,
            display: 'flex',
            backgroundColor: themeColor.white,
            borderTopStartRadius: PageDimensions.hp * 0.05,
            borderTopEndRadius: PageDimensions.hp * 0.05,
            padding: PageDimensions.hp * 0.04,
            alignItems: 'center',
          }}>
            <Text style={{
                fontSize: PageDimensions.hp * 0.02,
                color: themeColor.mainBackgroundColor,
                fontWeight: '400',
            }}>
              {props.infoMessage}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: PageDimensions.wp * 0.7,
              }}
            >
              <Button
                  label="Geri Dön"
                  color="#fff"
                  onPress={() => props.onClose()}
                  size={Button.sizes.small}
                  style={{
                      borderRadius: 3,
                      backgroundColor: '#E74C3C',
                      width: PageDimensions.wp * 0.3,
                      height:getResponsiveSize(20),
                      marginTop: PageDimensions.hp * 0.03,
                  }}
              />
                <Button
                  label="Evet"
                  color="#fff"
                  onPress={() => props.onSave()}
                  size={Button.sizes.small}
                  style={{
                      borderRadius: 3,
                      backgroundColor: '#28B463',
                      width: PageDimensions.wp * 0.3,
                      marginTop: PageDimensions.hp * 0.03,
                  }}
              />
            </View>
        </View>
      </Dialog>
    </View>
  );
}

export default ConfirmDialog;