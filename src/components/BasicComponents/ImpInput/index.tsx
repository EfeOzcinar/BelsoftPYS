/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View,Keyboard } from 'react-native';
import { TextField } from 'react-native-ui-lib';
import PageDimensions from '../../../constants/pageDimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


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

export const useImpInput = (inputData:InputDataProps) =>{
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
        checkRequired,
    };
};

interface ImpInputProps {
    inputState: InputDataProps;
    containerStyle?: any;
    onChange?: (item: any) => void;
    keyboardType?: any;
    maxLength?: number;
    leadingAccessory?: boolean;
    iconName?: string;
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
}

function ImpInput({
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
    inputStyle,
    isTrailingAccessory = false,
    onPressIcon,
    iconName = '',
    secureTextEntry = false,
    labelStyle,
    placeholderStyle,

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
        const _width = text.length * PageDimensions.wp * 0.02;
        setPlaceholderWidth(_width ? _width : PageDimensions.wp * 0.3);
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
        <View style={{marginTop: PageDimensions.hp * 0.012}}>
            <TextField
                ref={inputRef}
                value={inputState.value}
                onChange={(e)=>{
                    if (onChange){
                        onChange(e.nativeEvent.text);
                    }
                    inputState.setValue(e.nativeEvent.text);
                }}
                floatingPlaceholder
                floatingPlaceholderStyle={{
                    color: isValid ? 'red' : '#808080',
                    marginTop: PageDimensions.hp * 0.012,
                    fontSize: PageDimensions.hp * 0.016,
                    width: placeholderWidth,
                    backgroundColor: '#fff',
                    paddingLeft: PageDimensions.wp * 0.01,
                    ...placeholderStyle,

                }}
                style={{
                    fontSize: PageDimensions.hp * 0.018,
                    height: PageDimensions.wp * 0.11,
                    ...inputStyle,
                }}
                label={inputState.label}
                secureTextEntry={secureTextEntry}
                labelColor='#353635'
                placeholder={isValid ? 'Zorunlu Alan' : inputState?.label}
                readonly={inputState.disabled}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                maxLength={maxLength}
                labelStyle={{
                    marginTop: PageDimensions.hp * -0.02,
                    height: PageDimensions.wp * 0.05,
                    margin: 0,
                    padding: 0,
                    zIndex: 100,
                    width: placeholderWidth,
                    borderRadius: 1,
                    color: '#808080',
                    paddingLeft: PageDimensions.wp * 0.012,
                    ...labelStyle,
                }}
                containerStyle={{
                    display: inputState.isHidden ? 'none' : 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                    borderRadius: PageDimensions.hp * 0.008,
                    borderColor:  isValid ? 'red' : '#ABB2B9',
                    height: height,
                    width: width,
                    paddingLeft: PageDimensions.wp * 0.05,
                    ...containerStyle,
                }}
                trailingAccessory={
                    isTrailingAccessory ? (
                      <View
                        style={{
                          height: PageDimensions.hp * 0.04,
                          width: PageDimensions.hp * 0.04,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: PageDimensions.wp * 0.01,
                        }}>
                        <TouchableOpacity
                            onPress={onPressIcon}
                            disabled={inputState.disabled}
                            style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Icon
                              name={iconName}
                              size={PageDimensions.hp * 0.028}
                              color={'#804BDF'}
                            />
                        </TouchableOpacity>
                      </View>
                    ) : <></>
                }
                onBlur={handleBlur}
                onFocus={handleFocus}
                returnKeyType="done"
                returnKeyLabel="Bitti"
                onSubmitEditing={Keyboard.dismiss}
            />
        </View>
    );
}
export default ImpInput;
