/* eslint-disable semi */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { ImpButton, ImpInput, ImpPageContainer, ImpSelect, ImpTable, useImpInput, useImpSelect } from '../../components/BasicComponents';
import PageDimensions from '../../constants/pageDimensions';
import { convertUserOidToName, filterUniqueOid, getResponsiveSize } from '../../utilMethods';
import blsCore from '../../core';
import { useNavigation } from '@react-navigation/native';
import { RadioButton, RadioGroup } from 'react-native-ui-lib';

const { width, height } = Dimensions.get('window');

function TaskErrorListBasedCompany() {
    const navigation = useNavigation();
    const [allTaskList, setAllTaskList] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [taskOrErrorList, setTaskOrErrorList] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const txtTaskOrErrorNo = useImpInput({ label: 'Talep No' });
    const slcCompany = useImpSelect({ label: 'Kurum', optionLabel: 'CompanyName', optionValue: 'Oid' });
    const userListRef = useRef<any[] | null>(null)
    const [selectedOption, setSelectedOption] = useState<any>('1');
    const [loading, setLoading] = useState(false)

    const columnDef = [
        { headerName: 'No', headerWidth: PageDimensions.wp * 0.15, valueGetter: (x: any) => x.No ?? '' },
        { headerName: 'Başlık', headerWidth: PageDimensions.wp * 0.38, valueGetter: (x: any) => x.Title ?? '' },
        {
            headerName: 'Personel',
            headerWidth: PageDimensions.wp * 0.25,
            valueGetter: (x: any) => convertUserOidToName(x.SendUserOid, userListRef?.current) ?? '',
        },
        {
            headerName: 'Gözlem',
            headerWidth: PageDimensions.wp * 0.22,
            buttonConfig: {
                text: 'Gözlem',
                onPress: (selectedRow: any) => onDetailButtonClicked(selectedRow),
            },
        },
    ];

    const onDetailButtonClicked = (selectedRow: any) => {
        console.log('Selected row: ', selectedRow);
        if (selectedRow.Type === '1') {
            navigation.navigate({
                name: 'ErrorDetail',
                params: {
                    data: selectedRow,
                },
                merge: true,
            } as never);
        }
        else {
            navigation.navigate({
                name: 'TaskDetail',
                params: {
                    data: selectedRow,
                },
                merge: true,
            } as never);
        }
    };

    useEffect(() => {
        async function pageLoad() {
            userListRef.current = await blsCore.services.authService.getUserList()
            const companyList_ = await blsCore.services.parameterService.getCompanyList();
            slcCompany.setOptionList(companyList_.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName)));
            getTaskList();
        }
        pageLoad();
    }, []);

    const getTaskList = async () => {
        try {
            const queryRequest: TaskAndErrorListByCriteriaRequest = {}
            queryRequest.IsActive = true
            const errorAndTaskList_ = await blsCore.services.taskAndErrorService.getTaskAndErrorListByCriteria(queryRequest);
            const list = errorAndTaskList_.sort((a: any, b: any) => b.No - a.No)
            setAllTaskList(filterUniqueOid(list))
            setTaskOrErrorList(filterUniqueOid(list));

            //setLoading(false)
        }
        catch (e) {
            // setLoading(false)
        }
    }

    const filterListByTaskOrErrorNo = (value: any) => {
        const allDataList = allTaskList.slice();
        if (value) {
            const filteredList = allDataList.filter((x: any) => x.No.toString().startsWith(value.toString()));
            setTaskOrErrorList(filteredList);
        }
        else {
            setTaskOrErrorList(allDataList);
        }
    };


    const onSearchTaskByCriteria = async () => {
        try {
            setLoading(true)
            const queryRequest: TaskAndErrorListByCriteriaRequest = {}

            queryRequest.UserOid = 0

            if (selectedOption === '1') {
                queryRequest.IsActive = true
            }
            if (selectedOption === '2') {
                queryRequest.IsActive = false
            }
            if (slcCompany.value) { queryRequest.CompanyOid = slcCompany.value.Oid }

            if (txtTaskOrErrorNo.value) { queryRequest.TaskOrErrorNumber = Number(txtTaskOrErrorNo.value) }

            /* if (slcRequestStatus.value)
              {queryRequest.StatusCode = slcRequestStatus.value.ParameterCode} */



            const queryList = await blsCore.services.taskAndErrorService.getTaskAndErrorListByCriteria(queryRequest)
            if (queryList && queryList.length > 0) {
                const list = queryList.sort((a: any, b: any) => b.No - a.No)
                setAllTaskList(list)
            }
            else {
                setAllTaskList([])
            }
            setLoading(false)
        }
        catch (e) {
            setLoading(false)
        }
    }

    return (
        <ImpPageContainer systemLoading={loading} footer>
            <LinearGradient
                colors={['#0A1F44', '#0D284E', '#0e6e49']}
                style={styles.gradientContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Svg height={height * 0.3} width={width * 0.6} style={styles.svgStyle}>
                    <Circle
                        cx={-width * 0.1}
                        cy={-height * 0.1}
                        r={width * 0.5}
                        fill="#1C3F7C"
                        fillOpacity="0.6"
                    />
                </Svg>
                <View style={{ padding: 20 }}>
                    <RadioGroup
                        onValueChange={(value: any) => setSelectedOption(value)}
                        initialValue={selectedOption}
                        row
                    >
                        <RadioButton value="1" label="Aktif" labelStyle={{ color: 'white' }} style={{ marginRight: '10%' }} />
                        <RadioButton value="2" label="Kapalı" labelStyle={{ color: 'white' }} style={{ marginRight: '10%' }} />
                        <RadioButton value="3" label="Tümü" labelStyle={{ color: 'white' }} style={{ marginRight: '10%' }} />
                    </RadioGroup>
                </View>
                <View style={styles.inputContainer}>
                    <ImpInput inputState={txtTaskOrErrorNo} onChange={filterListByTaskOrErrorNo} width={130} />
                    <ImpSelect selectState={slcCompany} width={150} isClerable/>
                    <ImpButton type='search' onPress={onSearchTaskByCriteria} buttonStyle={{width:getResponsiveSize(80),marginLeft:getResponsiveSize(10)}}/>
                </View>

                <View style={styles.tableContainer}>
                    <ImpTable
                        width={PageDimensions.wp * 0.98}
                        columns={columnDef as any}
                        rowsData={taskOrErrorList}
                        tableHeader="Hata Talep Tüm Liste"
                        tableContainerHeight={getResponsiveSize(378)}
                        tableHeight={getResponsiveSize(378)}
                    />
                </View>
            </LinearGradient>
        </ImpPageContainer>

    );
}

const styles = StyleSheet.create({


    gradientContainer: {
        flex: 1,
    },
    svgStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    tableContainer: {
        marginLeft: 4,
        marginTop: 0,
        maxHeight: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 20,
        marginLeft: 20,
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    cellHeader: {
        flex: 1,
        padding: 10,
        backgroundColor: '#2f4c70',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000000',
    },
    cell: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000000',
    },
    headerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    cellText: {
        color: '#000000',
    },

});

export default TaskErrorListBasedCompany;
