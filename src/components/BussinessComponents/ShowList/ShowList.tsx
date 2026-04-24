/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {Dialog, View, Text, Button, Image, Checkbox} from 'react-native-ui-lib';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';
import { FlatList } from 'react-native';
import { studentInformationFemaleIcon, studentInformationMaleIcon } from '../../../assets/icons';



interface  ShowListProps {
    isDialogVisible: boolean;
    onClose: () => void;
    onSave?: () => void;
    selectedList: any;
    header: string;
}

function ShowList(props: ShowListProps) {
    const {themeColor} = useAppContext();

  return (
    <View>
      <Dialog
        visible={props.isDialogVisible}
        width={PageDimensions.wp * 0.95}
        height={PageDimensions.hp * 0.9}
        panDirection="right"
        ignoreBackgroundPress
        onDismiss={() => props.onClose()}
        containerStyle={{
          borderRadius: PageDimensions.hp * 0.01,
          backgroundColor: themeColor.white,
          borderWidth: 1,
          borderColor: themeColor.inputBorderColor,
          elevation: 8,
          zIndex: 1,
        }}>
        <View
            row spread
            style={{
                height: PageDimensions.hp * 0.068,
                width: PageDimensions.wp,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: themeColor.purple,
            }}
        >
            <Text
              style={{
                fontSize: PageDimensions.hp * 0.022,
                color: themeColor.white,
                textAlign: 'center',
              }}
            >
              {props.header}
            </Text>
        </View>
        <View
            style={{
            width: PageDimensions.wp,
            height: PageDimensions.hp * 0.76,
            borderTopRightRadius:  PageDimensions.hp * 0.01,
            justifyContent: 'center',
            paddingTop: PageDimensions.hp * 0.01,
            }}
        >
            <FlatList
                data={props.selectedList}
                numColumns={1}
                renderItem={({item, index}) => (
                    <View
                    key={item.id}
                    style={{
                        width: PageDimensions.wp * 0.9,
                        height: PageDimensions.hp * 0.09,
                        marginTop: PageDimensions.hp * 0.007,
                        marginLeft: PageDimensions.wp * 0.02,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        paddingHorizontal: PageDimensions.wp * 0.04,
                        backgroundColor: themeColor.white,
                        borderRadius: PageDimensions.hp * 0.01,
                        elevation: 8,
                        borderColor: themeColor.inputBorderColor,
                        borderWidth: 1,
                        marginBottom: props.selectedList && index === props.selectedList.length - 1
                        ? PageDimensions.hp * 0.02 : 0,
                    }}
                >
                    <View
                    width={PageDimensions.wp * 0.15}
                    height={PageDimensions.hp * 0.084}
                    center
                    style={{ backgroundColor: 'transparent', borderRadius: 6}}
                    >
                    <Image
                    source={
                        item.Gender && item.Gender === 'Erkek'
                        ? studentInformationMaleIcon
                        : studentInformationFemaleIcon
                    }
                    alt="student"
                        style={{
                            width: PageDimensions.hp * 0.055,
                            height: PageDimensions.hp * 0.055,
                            resizeMode: 'cover',
                        }}
                    />
                    </View>

                    <View
                        width={PageDimensions.wp * 0.67}
                        height={PageDimensions.hp * 0.065}
                        style={{
                            paddingVertical: PageDimensions.hp * 0.01,
                            paddingHorizontal: PageDimensions.hp * 0.03,
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: PageDimensions.hp * 0.018,
                                fontWeight: '600',
                                color: themeColor.mainBackgroundColor,
                            }}
                        >
                            {`${item.Name} ${item.Surname}`}
                        </Text>
                        <Text
                            style={{
                                fontSize: PageDimensions.hp * 0.016,
                                fontWeight: '600',
                                color: themeColor.gray,
                            }}
                        >
                            {item.StudentNo}
                        </Text>
                    </View>
                    <View
                        style={{
                        width: PageDimensions.wp * 0.1,
                        height: PageDimensions.hp * 0.08,
                        justifyContent: 'center',
                        }}
                    >
                        <Checkbox
                            value={item.isStudentNonAttended}
                            borderRadius={2}
                            color="#9155fd"
                            size={PageDimensions.hp * 0.03}
                            labelStyle={{
                            fontSize: PageDimensions.hp * 0.018,
                            color: themeColor.black,
                            }}
                        />
                    </View>
                    </View>
                )}
            />
        </View>
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width: PageDimensions.wp,
                marginTop: PageDimensions.hp * 0.02,
            }}>
                <Button
                    label="Kapat"
                    color="#fff"
                    onPress={() => props.onClose()}
                    size={Button.sizes.small}
                    style={{
                        borderRadius: 3,
                        backgroundColor: themeColor.purple,
                        width: PageDimensions.wp * 0.3,
                    }}
                />
        </View>
      </Dialog>
    </View>
  );
}

export default ShowList;
