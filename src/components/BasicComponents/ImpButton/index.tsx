/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import {Text, Dimensions, View} from 'react-native';
import React, {FC, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-ui-lib';
import { getResponsiveSize } from '../../../utilMethods';

export const useImpButton = (inputData: any) => {
  const [isHidden, setIsHidden] = useState<boolean>(
    inputData?.isHidden ?? false,
  );
  const [disabled, setDisabled] = useState<boolean>(
    inputData?.disabled ?? false,
  );

  const hide = () => setIsHidden(true);
  const show = () => setIsHidden(false);
  const disable = () => setDisabled(true);
  const enable = () => setDisabled(false);

  return {
    hide,
    show,
    disable,
    enable,
    isHidden,
    disabled,
  };
};

interface ImpButtonProps {
  type?: string;
  width?: number;
  height?: number;
  onPress?: () => void;
  buttonStyle?: any;
  disabled?: boolean;
  hoverStyle?: any;
  isHidden?: boolean;
  buttonState?: any;
  children?: string;
  labelStyle?: any;
  iconName?: string;
  backgroundColor?: string;
}
const wp = Dimensions.get('window').width;
const hp = Dimensions.get('window').height;

const ImpButton: FC<ImpButtonProps> = ({
  width = wp * 0.4,
  type,
  onPress,
  buttonStyle,
  disabled = false,
  isHidden,
  buttonState,
  children,
  labelStyle,
  height = hp * 0.05,
  iconName = 'autorenew',
  backgroundColor = '#D08409',
}) => {
  let buttonTypes = [
    {
      type: 'new',
      text: 'Yeni',
      color: '#000',
      icon: <Icon name="autorenew" size={20} color="#fff" />,
      backgroundColor: '#34495E',
    },
    {
      type: 'update',
      text: 'Güncelle',
      color: '#fff',
      icon: <Icon name="autorenew" size={20} color="#fff" />,
      backgroundColor: '#1E90FF',
    },
    {
      type: 'save',
      text: 'Kaydet',
      icon: <Icon name="content-save" size={20} color="#fff" />,
      color: '#fff',
      backgroundColor: '#804BDF',
    },
    {
      type: 'calculate',
      text: 'Hesapla',
      icon: <Icon name="calculator" size={20} color="#fff" />,
      color: '#fff',
      backgroundColor: '#3771D8',
    },
    {
      type: 'createAccrument',
      text: 'Tahakkuk Oluştur',
      icon: <Icon name="cloud-download" size={20} color="#fff" />,
      color: '#fff',
      backgroundColor: '#52BE80',
    },
    {
      type: 'memberList',
      text: 'Üye Listesi',
      color: '#000',
      icon: <Icon name="account-group" size={20} color="#fff" />,
      backgroundColor: '#E74C3C',
    },
    {
      type: 'landList',
      text: 'Arazi Listesi',
      color: '#000',
      icon: <Icon name="clipboard-list" size={20} color="#fff" />,
      backgroundColor: '#F39C12',
    },
    {
      type: 'declarationList',
      text: 'Beyan Listesi',
      color: '#000',
      icon: <Icon name="view-list" size={20} color="#fff" />,
      backgroundColor: '#34495E',
    },
    {
      type: 'map',
      text: 'Harita',
      color: '#000',
      icon: <Icon name="google-maps" size={20} color="#fff" />,
      backgroundColor: '#34495E',
    },
    {
      type: 'addImage',
      text: 'Fotograf Ekle',
      color: '#000',
      icon: <Icon name="image-plus" size={20} color="#fff" />,
      backgroundColor: '#39A6A6',
    },
    {
      type: 'search',
      text: 'Sorgula',
      color: '#000',
      icon: <Icon name="card-search-outline" size={22} color="#fff" />,
      backgroundColor: '#1EC1B2',
    },
    {
      type: 'approve',
      text: 'Onayla',
      color: '#000',
      icon: <Icon name="sticker-plus-outline" size={22} color="#fff" />,
      backgroundColor: '#D5A51A',
    },
    {
      type: 'clear',
      text: 'Temizle',
      color: '#000',
      icon: <Icon name="notification-clear-all" size={22} color="#fff" />,
      backgroundColor: '#1D99D3',
    },
    {
      type: 'back',
      text: 'Geri',
      color: '#000',
      icon: <Icon name="keyboard-backspace" size={22} color="#fff" />,
      backgroundColor: '#474d47',
    },
    {
      type: 'chooseDeclaration',
      text: 'Beyan Seç',
      color: '#000',
      icon: <Icon name="form-select" size={20} color="#fff"/>,
      backgroundColor: '#E67E22',
    },
    {
      type: 'closure',
      text: 'Kapama',
      color: '#000',
      icon: <Icon name="close-box-outline" size={20} color="#fff"/>,
      backgroundColor: '#8a2828',
    },
    {
      type: 'salesOperations',
      text: 'Satış İşlemi',
      color: '#000',
      icon: <Icon name="autorenew" size={20} color="#fff"/>,
      backgroundColor: '#4287f5',
    }, 
    {
      type: 'districtBuildingParcelDefinition',
      text: 'Köy Ada Parsel',
      color: '#000',
      icon: <Icon name="card-outline" size={20} color="#fff"/>,
      backgroundColor: '#16A085',
    },
    {
      type: 'continue',
      text: 'Devam Et',
      color: '#000',
      icon: <Icon name="arrow-right-bold-box-outline" size={20} color="#000"/>,
      backgroundColor: "#9155fd",
    },
    {
      type: 'delete',
      text: 'Sil',
      color: '#000',
      icon: <Icon name="arrow-right-bold-box-outline" size={20} color="#000"/>,
      backgroundColor: "#16A085",
    },
    {
      type: 'observation',
      text: 'Sınav Puanları',
      color: '#000',
      icon: <Icon name="arrow-right-bold-box-outline" size={20} color="#000"/>,
      backgroundColor: "#9155fd",
    },

    

  ];

  let defaultButtonStyle = {
    type: 'default',
    text: 'default',
    color: '#000',
   icon: <Icon name={iconName} size={20} color="#fff" />,
    hoverColor: '#004440',
    backgroundColor: backgroundColor,
  };

  let buttonType = buttonTypes.find(x => x.type === type) ?? defaultButtonStyle;

  if (buttonState ? buttonState.isHidden : isHidden) {
    return null;
  }
  return (
    <Button
      onPress={onPress}
      enableShadow
      disabled={buttonState ? buttonState.disabled : disabled}
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: width,
        height: height ,
        marginTop: 2,
        borderRadius: 3,
        justifyContent:'flex-start',
        alignItems: 'center',
        padding: 5,
        paddingLeft:0,
        elevation: 8,
        borderWidth:1,
        borderColor:
        buttonType.type !== 'save' && buttonType.type !== 'update'  && buttonType.type !== 'chooseDeclaration' 
        ? buttonType.backgroundColor
        : buttonType
        ? buttonType.backgroundColor
        : defaultButtonStyle.backgroundColor,

        backgroundColor:buttonType.type !== 'save' && buttonType.type !== 'update'   && buttonType.type !== 'chooseDeclaration' 
        && buttonType.type !== 'createAccrument' && buttonType.type !== 'calculate'
        ? '#F4F6F6'
        : buttonType
        ? buttonType.backgroundColor
        : defaultButtonStyle.backgroundColor,
        opacity: (buttonState ? buttonState.disabled : disabled) ? 0.3 : 1,
        ...buttonStyle,
      }}>
      <View
        style={{backgroundColor: buttonType ? buttonType.backgroundColor : 'transparent', height: height, width: wp * 0.08,display:'flex', justifyContent:'center', alignItems:'center'}}>
        {buttonType ? buttonType.icon : defaultButtonStyle.icon}
      </View>

      {
        <Text
          style={{
            color: buttonType ? buttonType.color : defaultButtonStyle.color,
            paddingLeft:8,
            fontSize: getResponsiveSize(11),
            fontWeight: 'bold',
            ...labelStyle,
          }}>
          {children ?? buttonType.text}
        </Text>
      }
    </Button>
  );
};

export default ImpButton;
