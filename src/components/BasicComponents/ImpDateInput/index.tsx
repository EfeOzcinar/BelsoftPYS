/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { TextField, TouchableOpacity, View } from 'react-native-ui-lib';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';

interface InputDateProps {
  value?: string | any;
  setValue?: any;
  label: string;
  placeHolder?: string;
  isHidden?: boolean;
  disabled?: boolean;
  isNullOrEmpty?: () => {};
  allowBlank?: boolean;
}

export const useImpDateInput = (inputData: InputDateProps) => {
  const [value, setValue] = useState(inputData.value);
  const [label, setLabel] = useState(inputData.label ?? 'labelAdı');
  const [placeHolder, setPlaceHolder] = useState(inputData.placeHolder);
  const [isHidden, setIsHidden] = useState(inputData.isHidden ?? false);
  const [disabled, setDisabled] = useState(inputData.disabled ?? false);
  const [allowBlank, setAllowBlank] = useState(inputData.allowBlank ?? true);

  const reset = () => {
    setValue(inputData.value);
    setLabel(inputData.label ?? 'labelAdı');
    setPlaceHolder(inputData.placeHolder ?? 'labelAdı');
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

interface ImpInputDateProps {
    inputState: InputDateProps;
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
}

function ImpInputDate({
    inputState,
    containerStyle,
    onChange,
    width = PageDimensions.wp * 0.42,
    disabled = false,
    height = PageDimensions.wp * 0.1,
    error,
    inputStyle,
    placeholderColor='#808080',
    placeholderStyle

}: ImpInputDateProps) {
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
        const width = text.length * PageDimensions.wp * 0.015; 
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
 
    const formatDateString = (input: string): string => {
        const formattedDate = input
        .replace(/^(\d{2})/, '$1.')
        .replace(/^(\d{2}\.)(\d{2})/, '$1$2.');
        return formattedDate;
    };

    const handleChange = (e: any) => {
        const sanitizedInput = e.replace(/\D/g, '');
        const formattedInput = formatDateString(sanitizedInput);
        inputState.setValue(formattedInput);
        onChange && onChange(formattedInput);
    }
       
      
    return (
        <View style={{marginTop: PageDimensions.hp * 0.01}}>
            <TextField
                ref={inputRef}
                value={inputState.value}
                onChange={(e)=> handleChange(e.nativeEvent.text)}
                floatingPlaceholder
                keyboardType='numeric'
                floatingPlaceholderStyle={{ 
                    color: isValid ? 'red' : placeholderColor, 
                    marginTop: PageDimensions.hp * 0.014, 
                    fontSize: PageDimensions.hp * 0.016,
                    width: placeholderWidth,
                    backgroundColor: '#fff',
                    paddingLeft: PageDimensions.wp * 0.01,
                    placeholderColor :'#4a4a4a',
                    ...placeholderStyle

                }}
                labelColor={'black'}
                placeholder={isValid ? 'Zorunlu Alan' : inputState?.label}
                readonly={inputState.disabled}
                maxLength={10}
                style={{ 
                    fontSize: PageDimensions.hp * 0.018, 
                    height: PageDimensions.wp * 0.11,
                    color: 'white', 
                    ...inputStyle
                }}
                label={inputState.label}
                containerStyle={{
                    display: inputState.isHidden ? 'none' : 'flex',
                    justifyContent: 'center',
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                    borderRadius: PageDimensions.hp * 0.008,
                    borderColor:  isValid ? 'red' : '#ABB2B9',
                    height: height,
                    width: width,
                    paddingBottom: PageDimensions.hp * 0.023,
                    paddingLeft: PageDimensions.wp * 0.05,
                    ...containerStyle,
                }}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
        </View>
    );
}
export default ImpInputDate;
