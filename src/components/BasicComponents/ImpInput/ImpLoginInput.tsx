/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import {  Icon, TextField } from 'react-native-ui-lib';
import PageDimensions from '../../../constants/pageDimensions';

const wp = Dimensions.get('window').width;
const hp = Dimensions.get('window').height;

interface InputDataProps {
    value?: string | any;
    setValue?: any;
    label?: string;
    placeHolder?: string;
    isHidden?: boolean;
    disabled?: boolean;
    isNullOrEmpty?: () => {};
    allowBlank?: boolean;
  }

export const useImpLoginInput = (inputData:InputDataProps) =>{
    const [value, setValue] = useState(inputData.value);
    const [label, setLabel] = useState(inputData.label ?? 'labelAdı');
    const [placeHolder, setPlaceHolder] = useState(inputData.placeHolder);
    const [isHidden, setIsHidden] = useState(inputData.isHidden ?? false);
    const [disabled, setDisabled] = useState(inputData.disabled ?? false);
    const [allowBlank, setAllowBlank] = useState(inputData.allowBlank ?? true);

    const reset = () => {
        setValue(inputData.value);
        setLabel(inputData.label ?? 'labelAdı');
        setPlaceHolder(inputData.placeHolder ?? '');
        setIsHidden(inputData.isHidden ?? false);
        setDisabled(inputData.disabled ?? false);
        setAllowBlank(inputData.allowBlank ?? true);
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
        checkRequired
    };
};

interface ImpInputProps {
    inputState: InputDataProps;
    containerStyle?: any;
    onChange?: (item: any) => void;
    keyboardType?: any;
    maxLength?: number;
    leadingAccessory?: boolean;
    iconName?: any;
    width?: number;
    disabled?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    height?: number;
    error?: boolean;
    onBlur?: () => void;
    inputStyle?: any;
    floatingPlaceholder?: boolean;
    isTrailingAccessory?: boolean;
    onPressIcon?: any;
    secureTextEntry?: boolean;
    labelStyle?: any;
    placeholderStyle?: any;
    trailingAccessory?: any;
}

function ImpLoginInput({
    inputState,
    containerStyle,
    onChange,
    keyboardType,
    maxLength,
    multiline = false,
    numberOfLines = 1,
    width = PageDimensions.wp * 0.8,
    height = PageDimensions.wp * 0.1,
    error,
    iconName='',
    trailingAccessory,
    secureTextEntry=false

}: ImpInputProps) {
    const inputRef = useRef<any>(null);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [placeholderWidth, setPlaceholderWidth] = useState<number>();

    useEffect(() => {
        if (!inputState?.allowBlank && error) {
            !inputState?.value?.trim() ? setIsValid(true) : setIsValid(false);
        } else {
            setIsValid(false);
        }
    }, []);

    useEffect(() => {
        if (inputState?.label) {
          measurePlaceholderWidth(inputState.label);
        }
    }, [inputState.label]);

    const measurePlaceholderWidth = (text: string) => {
        const width = text.length * PageDimensions.wp * 0.02; 
        setPlaceholderWidth(width ? width : PageDimensions.wp * 0.3);
    };

    const validateInput = () => {
        if (!inputState?.allowBlank && !inputState?.value?.trim()) {
            setIsValid(false); // true
        } else {
            setIsValid(false);
        }
    };

    const handleFocus = () => {
        inputRef.current.focus();
        setIsValid(false);
    };
    const handleBlur = () => {
        inputRef.current.blur();
        validateInput();
    };

    return (
        <View>
            <TextField
                ref={inputRef}
                value={inputState.value}
                placeholder={inputState.label}
                secureTextEntry={secureTextEntry}
                onChange={(e)=>{
                    if (onChange){
                        onChange(e.nativeEvent.text);
                    }
                    inputState.setValue(e.nativeEvent.text);
                }}
                placeholderTextColor="gray"
                style={{
                    width: width,
                    height: height,
                    padding: hp * 0.02,
                    borderLeftWidth: 1,
                    borderLeftColor: '#AED2FF',
                    fontSize:hp * 0.018,
                }}
                containerStyle={{
                    marginTop: hp * 0.05,
                    borderWidth: 1,
                    borderColor: '#337CCF',
                    borderRadius: hp * 0.01,
                    padding: hp * 0.008,
                    backgroundColor: '#fff',
                    ...containerStyle
                }}
                leadingAccessory={
                    <Icon source={iconName} tintColor={'#1450A3'} size={hp * 0.018} style={{margin: hp * 0.012}}/>
                }
                readonly={inputState.disabled}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                maxLength={maxLength}
                onBlur={handleBlur}
                onFocus={handleFocus}

                trailingAccessory={trailingAccessory}
                
            />
        </View>
    );
}
export default ImpLoginInput;
