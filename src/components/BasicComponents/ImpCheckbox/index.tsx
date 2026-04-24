/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {FC, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Checkbox, TextField } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';


interface ImpCheckboxProps {
    checkboxState: CheckboxDataProps;
    label?: string;
    defaultChecked?: boolean | undefined;
    color?: string;
    onChange?: (value: boolean) => void;
    checkboxStyle?: any;
    containerStyle?: any;
    size?: number;
    value?: any;
}

interface CheckboxDataProps {
    value?: boolean;
    setValue?: any;
    label?: string;
    placeHolder?: string;
    isHidden?: boolean;
    disabled?: boolean;
    isLabelHidden?: boolean;
    allowBlank?: boolean;
}

export const useImpCheckBox = (inputData: CheckboxDataProps) => {
    const [value, setValue] = useState(inputData.value ?? false);
    const [label, setLabel] = useState(inputData.label ?? '');
    const [isLabelHidden, setIsLabelHidden] = useState(inputData.isLabelHidden ?? false);
    const [isHidden, setIsHidden] = useState(inputData.isHidden ?? false);
    const [disabled, setDisabled] = useState(inputData.disabled ?? false);
  
    const reset = () => {
      setValue(inputData.value ?? false);
      setLabel(inputData.label ?? 'labelAdı');
      setIsLabelHidden(inputData.isLabelHidden ?? false);
      setIsHidden(inputData.isHidden ?? false);
      setDisabled(inputData.disabled ?? false);
    };
  
    const clear = () => setValue(false);
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
      isLabelHidden,
      setIsLabelHidden,
      disabled,
      setDisabled,
      clear,
      reset,
      hide,
      show,
      enable,
      disable,
    };
  };


  const ImpCheckbox: FC<ImpCheckboxProps> = ({
    containerStyle,
    checkboxState,
    checkboxStyle,
    label,
    onChange,
    size = 20,
    color = '#9155fd',
    value
    
  }) => {

    const {themeColor} = useAppContext();

    const handleChange = (isChecked: boolean) => {
      checkboxState.setValue(isChecked);
      onChange && onChange(isChecked);
    };
  
    return (
        <View 
            style={{
                width: PageDimensions.wp * 0.8, 
                margin: PageDimensions.hp * 0.01, 
                ...containerStyle
            }}
        >
            <Checkbox
                value={checkboxState.value}
                onValueChange={handleChange}
                disabled={checkboxState.disabled}
                borderRadius={2}
                color={color}
                label={label}
                size={size}
                labelStyle={{
                fontSize: PageDimensions.hp * 0.018,
                color: themeColor.white,
                ...checkboxStyle,
                }}
            />
        </View>
    );
  };
  

export default ImpCheckbox;
