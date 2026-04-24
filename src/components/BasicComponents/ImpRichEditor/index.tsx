/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import { View } from 'react-native-ui-lib';
import { getResponsiveSize } from '../../../utilMethods';
import { Keyboard, KeyboardAvoidingView, Text, TouchableWithoutFeedback } from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

interface RichEditorProps {
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

export const useImpRichEditor = (inputData: RichEditorProps) => {
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
        setValue('');
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

interface ImpRichEditorProps {
    textState: RichEditorProps;
    containerStyle?: any;
    disabled?: boolean;
    height?: any;
    width?: any;
}

function ImpRichEditor({
    width = getResponsiveSize(255),
    height = getResponsiveSize(150),
    containerStyle,
    textState,

}: ImpRichEditorProps) {

    const richText = useRef();

    const handleHead = ({ tintColor }: any) => <Text style={{ color: tintColor }}>H1</Text>;

    const closeKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <View style={{ height: getResponsiveSize(160), backgroundColor: 'transparent', width: width, display: 'flex', borderWidth: 1, borderRadius: 2, borderColor: '#efefef', padding: 8, marginTop: '1%', ...containerStyle }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        <RichToolbar
                            editor={richText}
                            actions={[
                                actions.setBold,
                                actions.setItalic,
                                actions.setUnderline,
                                actions.heading1,
                                actions.insertBulletsList,
                                actions.insertOrderedList,
                            ]}
                            iconMap={{ [actions.heading1]: handleHead }}
                        />
                        <RichEditor
                            ref={richText as any}
                            onChange={descriptionText => {
                                textState.setValue(descriptionText);
                            }}

                            placeholder="Açıklama giriniz."
                            style={{
                                height: height, // Set your desired height here
                                minHeight: height,
                                borderColor: '#ccc',
                                borderWidth: 1,
                                padding: 10,
                            }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
}

export default ImpRichEditor;
