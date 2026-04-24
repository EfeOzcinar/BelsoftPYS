/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState } from 'react';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';
import { Button, Picker, View } from 'react-native-ui-lib';
import { PickerModes } from 'react-native-ui-lib';
import _ from 'lodash';

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

export const useImpSearch = (inputData: SelectDataProps) => {
  const [value, setValue] = useState(inputData.value);
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
    setValue(undefined || '' || null);
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
    const results = optionList.filter((item: any) => query.includes(item[optionValue]));
    if (results.length > 0) {
      setValue(results);
    } else {
      clear();
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

interface ImpSearchProps {
  selectState: SelectDataProps;
  onChange?: (item:any) => void;
  searchStyle?:any
  width?: number;
  height?: number;
  labelStyle?: any;
  selectionLimit?: number;
  isClearable?: boolean;
  lightMode?: boolean;
}

function ImpSearch({
  selectState,
  onChange,
  searchStyle,
  width = PageDimensions.wp * 0.8,
  height = PageDimensions.hp * 0.045,
  labelStyle,
  selectionLimit = 10,
  isClearable = false,
  lightMode=false,

}: ImpSearchProps) {

  const {themeColor} = useAppContext();

  return (
    <View>
      <Picker
          key={selectState.optionList}
          floatingPlaceholder={false}
          placeholder={selectState.label + ' Ara...'}
          floatingPlaceholderStyle={{ 
            color: themeColor.white,
            fontSize: PageDimensions.hp * 0.016,
            marginLeft: PageDimensions.wp * 0.02,
            marginTop: PageDimensions.hp * 0.01
          }}
          searchPlaceholder={selectState.label + ' Ara'}
          placeholderTextColor={themeColor.white}
          labelColor={themeColor.white}
          color={themeColor.white}
          value={selectState.value}
          enableModalBlur={false}
          onChange={(selectedItem: any) => {
            selectState.setValue(selectedItem);
            if (onChange) {
              onChange(selectedItem);
            }
          }}
          showSearch
          mode={PickerModes.SINGLE}
          selectionLimit={selectionLimit}
          readonly={selectState.disabled}
          editable={!selectState.disabled}
          searchStyle={{
            color: themeColor.black
          }}
          labelStyle={{
            color: themeColor.white,
            fontSize: PageDimensions.hp * 0.016,
            width: PageDimensions.wp * 0.047,

            ...labelStyle
          }}
          containerStyle={{
            width: width,
            height: height,
            backgroundColor: 'transparent',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#ABB2B9',
            justifyContent: 'flex-start',
            paddingLeft: PageDimensions.wp * 0.04,
            marginTop: PageDimensions.hp * 0.01,
            ...searchStyle,
          }}
          renderCustomDialogHeader={({onDone, onCancel}) => (
            <View padding-s5 row spread>
              <Button link label="Kapat" onPress={onCancel}/>
              <Button link label="Onayla" onPress={onDone}/>
            </View>
          )}
        >
          {_.map(selectState.optionList, option => (
            <Picker.Item
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </Picker>
    </View>
  );
  }


export default ImpSearch;
