/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import DatePicker from 'react-native-date-picker'
import { Text } from 'react-native';
import { getResponsiveSize } from '../../../utilMethods';
import moment from 'moment';

interface InputDatePickerProps {
  value?: string | any;
  setValue?: any;
  label: string;
  placeHolder?: string;
  isHidden?: boolean;
  disabled?: boolean;
  isNullOrEmpty?: () => {};
  allowBlank?: boolean;
  date?: any;
  setDate?: any;
}

export const useImpDatePicker = (inputData: InputDatePickerProps) => {
  const [value, setValue] = useState(inputData.value);
  const [label, setLabel] = useState(inputData.label ?? 'labelAdı');
  const [placeHolder, setPlaceHolder] = useState(inputData.placeHolder);
  const [isHidden, setIsHidden] = useState(inputData.isHidden ?? false);
  const [disabled, setDisabled] = useState(inputData.disabled ?? false);
  const [allowBlank, setAllowBlank] = useState(inputData.allowBlank ?? true);
  const [date, setDate] = useState(inputData.date ?? new Date());

  const reset = () => {
    setValue(inputData.value);
    setLabel(inputData.label ?? 'labelAdı');
    setPlaceHolder(inputData.placeHolder ?? 'labelAdı');
    setIsHidden(inputData.isHidden ?? false);
    setDisabled(inputData.disabled ?? false);
    setAllowBlank(inputData.allowBlank ?? true);
    setDate(new Date());
  };


  const clear = () => {
    setValue(null || '');
  };

  const checkRequired = () => {
    if (!allowBlank && !isHidden) {
      if (isNullOrEmpty()) {
        throw new Error(`${label.replace(':', '')} alanı zorunludur`);
      } 
    }
  };

  const isNullOrEmpty = () => value === null || value === undefined;

  const hide = () => setIsHidden(true);
  const show = () => setIsHidden(false);

  const enable = () => setDisabled(false);
  const disable = () => setDisabled(true);

  return {
    value,
    setValue,
    label,
    setLabel,
    isHidden,
    setIsHidden,
    disabled,
    setDisabled,
    placeHolder,
    setPlaceHolder,
    clear,
    isNullOrEmpty,
    reset,
    hide,
    show,
    enable,
    disable,
    allowBlank,
    setAllowBlank,
    checkRequired,
    date,
    setDate,
  };
};

interface ImpInputDatePickerProps {
    inputState: InputDatePickerProps;
    containerStyle?: any;
    onChange?: (item: any) => void;
    width?: number;
    disabled?: boolean;
    height?: number;
    error?: boolean;
    onBlur?: () => void;
    inputStyle?: any;
    placeholderColor?: string;
    placeholderStyle?: any;
    mode?:'date' | 'time' | 'datetime' | undefined;
}

function ImpDatePicker({
    inputState,
    onChange,
    width =  getResponsiveSize(255),
    containerStyle,
    mode = 'date',

}: ImpInputDatePickerProps) {

    useEffect(()=>{
        inputState.setValue(formatDate(new Date()));
    },[]);
    const [open, setOpen] = useState(false);

  const formatDate = (dateValue?: Date) => {
    if (mode !== 'time') {
      if (dateValue) {
        return moment(dateValue).format('DD.MM.YYYY');
      }
      return moment().format('DD.MM.YYYY');
    }
    else {
      return moment(dateValue).format('HH:mm');
    }

  };


    return (
        <View style={{ height: getResponsiveSize(30),backgroundColor:'transparent',width:width,display:'flex',borderWidth:1,borderRadius:2,borderColor:'#efefef',padding:8,marginTop:'1%',...containerStyle }}>
            <TouchableOpacity onPress={() => setOpen(true)} >
                <Text style={{color:'black'}}>
                  {
                    mode !== 'time' ? 
                  moment(inputState.date).format('DD.MM.YYYY') :
                  moment(inputState.date).format('HH:mm')
                  }
                  </Text>
            </TouchableOpacity>
            <DatePicker
                modal
                open={open}
                date={inputState.date ?? new Date()}
                locale="tr"
                mode={mode}
                confirmText="Onayla"
                cancelText="İptal"
                onConfirm={(e) => {
                    setOpen(false);
                    inputState.setDate(e);
                    console.log("e",formatDate(e))
                    inputState.setValue(formatDate(e));
                    onChange && onChange(e);
                }}
                onCancel={() => {
                    setOpen(false);
                }}
            />
        </View>
    );
}
export default ImpDatePicker;
