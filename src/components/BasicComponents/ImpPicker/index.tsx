/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable keyword-spacing */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker, View, Image, Button } from 'react-native-ui-lib';
import PageDimensions from '../../../constants/pageDimensions';
import { PickerModes } from 'react-native-ui-lib';
import { closeIcon } from '../../../assets/icons';
import { getResponsiveSize } from '../../../utilMethods';

interface SelectDataProps {
    value?: string | any;
    setValue?: any;
    label: string;
    placeHolder?: string;
    placeHolderNode?: React.ReactNode;
    searchPlaceholder?: string;
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
    setIndex?: any;
    index?: number;
}

export const useImpPicker = (inputData: SelectDataProps) => {
    const [value, setValue] = useState<any>(inputData.value);
    const [optionList, setOptionList] = useState(inputData.optionList ?? []);
    const [label, setLabel] = useState(inputData.label ?? 'labelAdı');
    const [placeHolder, setPlaceHolder] = useState(inputData.placeHolder ?? 'Seçiniz');
    const [placeHolderNode, setPlaceHolderNode] = useState<React.ReactNode>(inputData.placeHolderNode ?? null);
    const [searchPlaceholder, setSearchPlaceholder] = useState(inputData.searchPlaceholder);
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
        setValue(null as any);
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
        placeHolderNode,
        setPlaceHolderNode,
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
        searchPlaceholder,
        setSearchPlaceholder
    };
};

interface BlsPickerProps {
    selectState: SelectDataProps;
    onChange?: any;
    isClerable?: boolean;
    lightMode?: boolean;
    dropDownStyle?: any;
    isMulti?: boolean;
    width?: number;
    height?: number;
    buttonTextStyle?: any;
    containerStyle?: any
    topBarProps?: any;
    labelStyle?: any;
    floatingPlaceholder?: boolean;
    floatingPlaceholderStyle?: any;
    textAlign?: 'left' | 'center' | 'right';
}

function BlsPicker({
    selectState,
    topBarProps,
    containerStyle,
    onChange,
    width = PageDimensions.wp * 0.45,
    labelStyle,
    isMulti,
    isClerable,
    floatingPlaceholder = false,
    floatingPlaceholderStyle,
    textAlign = "left",
}: BlsPickerProps) {
    const inputRef = useRef<any>(null);

    const handleClear = () => {
        if (onChange) {
            onChange('');
            selectState.setValue(null);
        }
    };

    return (
        <View>
            <View>
                <Picker
                    ref={inputRef}
                    textAlign={textAlign}
                    style={{ color: 'black' }}
                    key={selectState.optionList && selectState?.optionList?.length}
                    label={selectState?.label}
                    floatingPlaceholder={floatingPlaceholder}
                    floatingPlaceholderStyle={{
                        color: 'gray',
                        fontSize: getResponsiveSize(11),
                        padding: 0,
                        ...floatingPlaceholderStyle
                    }}
                    placeholder={selectState.placeHolder}
                    topBarProps={topBarProps}
                    labelStyle={{ fontSize: PageDimensions.hp * 0.012, ...labelStyle }}
                    searchPlaceholder={selectState.searchPlaceholder}
                    value={selectState?.value && selectState?.value[selectState.optionValue]}
                    enableModalBlur={false}

                    onChange={(e: any) => {
                        const selectedValue = selectState.optionList.find((x: any) => x[selectState.optionValue] === e)
                        if (onChange) {
                            onChange(selectedValue);
                        }
                        selectState.setValue(selectedValue);
                    }}
                    showSearch
                    mode={isMulti ? PickerModes.MULTI : PickerModes.SINGLE}
                    readonly={selectState.disabled}
                    editable={!selectState.disabled}
                    renderCustomDialogHeader={({ onDone, onCancel }) => (
                        <SafeAreaView >
                            <View padding-s5 row spread>
                                <Button link label="Kapat" onPress={onCancel} />
                                <Button link label="Onayla" onPress={onDone} />
                            </View>
                        </SafeAreaView>

                    )}
                    containerStyle={{
                        borderWidth: 1,
                        borderRadius: 4,
                        height: PageDimensions.hp * 0.04,
                        width: width,
                        paddingLeft: PageDimensions.hp * 0.008,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        ...containerStyle,
                    }}
                >
                    {selectState.optionList?.map((option: any) => (
                        <Picker.Item
                            key={option[selectState.optionValue]}
                            value={option[selectState.optionValue]}
                            label={option[selectState.optionLabel]}
                        //label={selectState.optionLabel === 'function' ? selectState.optionLabel(option) : option[selectState.optionLabel]}
                        />
                    ))}
                </Picker>
                {isClerable &&
                    <View
                        center
                        style={{
                            position: 'absolute',
                            width: PageDimensions.wp * 0.05,
                            height: PageDimensions.hp * 0.04,
                            backgroundColor: 'transparent',
                            right: PageDimensions.wp * 0.08,
                            zIndex: 100,
                        }}
                    >
                        <TouchableOpacity onPress={handleClear} disabled={selectState.disabled}>
                            <Image
                                source={closeIcon}
                                resizeMode="contain"
                                style={{ width: PageDimensions.wp * 0.022 }}
                            />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>

    );
}

export default BlsPicker;
