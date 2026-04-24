/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useRef, useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import { Image, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import PageDimensions from '../../../constants/pageDimensions';
import { AppContext } from '../../../context/AppContext';
import { closeIcon } from '../../../assets/icons';

interface SelectDataProps {
  value?: string | any;
  setValue?: any;
  label: string;
  placeHolder?: string;
  isHidden?: boolean;
  disabled?: boolean;
  isLabelHidden?: boolean;
  allowBlank?: boolean;
  optionList?: any;
  optionLabel: any;
  optionValue: any;
  labelHide?: boolean;
  isNullOrEmpty?: () => {};
  selectRef?: any;
  setIndex?:any;
  index?:number;
}

export const useImpSelect = (inputData: SelectDataProps) => {
  const [value, setValue] = useState<any>(inputData.value);
  const [optionList, setOptionList] = useState(inputData.optionList ?? []);
  const [label, setLabel] = useState(inputData.label ?? 'labelAdı');
  const [placeHolder, setPlaceHolder] = useState(inputData.placeHolder);
  const [isLabelHidden, setIsLabelHidden] = useState(
    inputData.labelHide ?? false,
  );
  const [isHidden, setIsHidden] = useState(inputData.isHidden ?? false);
  const [disabled, setDisabled] = useState(inputData.disabled ?? false);
  const [allowBlank, setAllowBlank] = useState(inputData.allowBlank ?? true);
  const [index, setIndex] = useState(inputData.index);

  const reset = () => {
    setValue(inputData.value);
    setOptionList(inputData.optionList ?? []);
    setLabel(inputData.label ?? 'labelAdı');
    setPlaceHolder(inputData.placeHolder ?? '');
    setIsLabelHidden(inputData.labelHide ?? false);
    setIsHidden(inputData.isHidden ?? false);
    setDisabled(inputData.disabled ?? false);
    setAllowBlank(inputData.allowBlank ?? true);
  };

  const optionLabel = inputData.optionLabel ?? '';
  const optionValue = inputData.optionValue ?? '';

  const clear = () => {
    setValue( null as any);
  };

  const getOptionList = () =>
    // Sadece dış kapı ve iç kapı işlemlerinde kullanılır ya da başka formatlı option'larda
    optionList[0].options;

  const checkRequired = () => {
    if (!allowBlank) {
      if (isNullOrEmpty()) {
        throw new Error('alanı zorunludur');
      }
    }
  };

  const select = (query: any) => {
    const result = optionList.find((item: any) => item[optionValue] === (query || ''));
    if (result) setValue(result);
    else clear();
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
    optionList,
    setOptionList,
    isHidden,
    setIsHidden,
    isLabelHidden,
    setIsLabelHidden,
    disabled,
    setDisabled,
    placeHolder,
    setPlaceHolder,
    optionLabel,
    optionValue,
    select,
    clear,
    isNullOrEmpty,
    allowBlank,
    setAllowBlank,
    checkRequired,
    reset,
    getOptionList,
    hide,
    show,
    enable,
    disable,
    setIndex,
    index,
  };
};

interface ImpSelectProps {
  selectState: SelectDataProps;
  onChange?: any;
  searchStyle?: any;
  isClerable?: boolean;
  lightMode?: boolean;
  dropDownStyle?: any;
  isMulti?: boolean;
  width?: number;
  height?: number;
}

function ImpSelect({
  selectState,
  onChange,
  searchStyle,
  isClerable = false,
  lightMode = false,
  dropDownStyle,
  width = PageDimensions.wp * 0.8,
  height = PageDimensions.hp * 0.05,
  isMulti=false,
}: ImpSelectProps) {

  const { themeColor } = useContext(AppContext);
  const dropdownRef = useRef<SelectDropdown>(null);

  const clearSelection = () => {
    selectState.setValue(null);
    if (onChange) {
      onChange(null as any);
    }
    if (dropdownRef.current) {
      dropdownRef.current.reset();
    }
  };

    return (

        <SelectDropdown
          ref={dropdownRef}
          defaultButtonText={selectState.label + ' Seçiniz...'}
          data={selectState.optionList ? selectState.optionList : [] as any}
          defaultValueByIndex={selectState.index}
          defaultValue={selectState.value}
          disabled={selectState.disabled}
          onSelect={(selectedItem: any) => {
            selectState.setValue(selectedItem);
            if (onChange) {
              onChange(selectedItem);
            }
          }}
          buttonTextAfterSelection={(selectedItem: any) => {
          //  return selectedItem[selectState.optionLabel];
          return selectedItem[selectState.optionLabel] || selectState.optionLabel(selectedItem);
          }}
          rowTextForSelection={(item: any) => {
            // return item[selectState.optionLabel];
            return item[selectState.optionLabel] || selectState.optionLabel(item);
          }}
          renderDropdownIcon={() => {
            return (
              isClerable &&
                <TouchableOpacity
                  onPress={() =>clearSelection()}
                  style={{
                    width: PageDimensions.hp * 0.04,
                    height: PageDimensions.hp * 0.04,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={closeIcon}
                    resizeMode="contain"
                    style={{width: PageDimensions.wp * 0.035, tintColor: themeColor.clearButton}}
                  />
                </TouchableOpacity>
            );
          }}

          buttonStyle={{
            width: width,
            height: height,
            backgroundColor: 'transparent',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#ABB2B9',
            justifyContent: 'flex-start',
            marginTop: PageDimensions.hp * 0.01,
            ...searchStyle,
          }}
          buttonTextStyle={{
            color: lightMode ? '#1A1C1C' : 'white',
            fontSize: PageDimensions.hp * 0.016,
            fontWeight:'bold',
            textAlign: 'left',
            padding: 4,
          }}

          dropdownStyle={{
            height: PageDimensions.hp * 0.21,
            borderBottomStartRadius: 5,
            borderBottomEndRadius: 5,
            marginTop: 1,
            justifyContent: 'flex-start',
            backgroundColor: themeColor.mainBackgroundColor,
          }}

          rowStyle={{
            height: PageDimensions.hp * 0.05,
            width: width,
            justifyContent: 'flex-start',
            padding: 4,
            ...dropDownStyle,
          }}

          rowTextStyle={{
            width: width,
            paddingLeft: 10,
            color: '#D5D8DC',
            textAlign: 'left',
            fontSize: PageDimensions.hp * 0.016,
          }}
        />
    );
  }



export default ImpSelect;
