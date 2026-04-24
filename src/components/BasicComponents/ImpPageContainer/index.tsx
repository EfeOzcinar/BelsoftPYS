/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import { Text} from 'react-native';
import React, {FC} from 'react';
import {Colors, LoaderScreen, View} from 'react-native-ui-lib';
import NavigatorFooterBar from '../../BussinessComponents/NavigatorFooterBar';



interface ImpPageContainerProps {
  children?: any;
  containerStyle?: any;
  container?: boolean;
  systemLoading?: boolean;
  footer?: boolean;
}

const ImpPageContainer: FC<ImpPageContainerProps> = ({
  children,
  containerStyle,
  container,
  systemLoading = false,
  footer = false,
}) => {
  return (
    <View
      flex
      style={{ flexDirection:container ? 'row' : 'column',...containerStyle }}>
      {children}
      {systemLoading && (
        <View
          style={{
            backgroundColor:'rgba(0,0,0,.2)',
            position:'absolute' ,
            width:'100%',
            height:'100%',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
          }}
        >
          <LoaderScreen
            color={Colors.blue10}
            overlay
            size={40}
          />
          <Text style={{marginTop:'18%', color:'black', fontWeight:'bold', fontSize:16}}>Lütfen Bekleyiniz...</Text>
        </View>
      )}
      { footer && (
        <NavigatorFooterBar />
      )}
    </View>
  );
};

export default ImpPageContainer;
