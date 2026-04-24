import React, { useEffect, useState } from 'react';
import {  View, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { ImpInput, ImpSelect, ImpButton, ImpTable, useImpInput, useImpSelect } from '../../components/BasicComponents';
import PageDimensions from '../../constants/pageDimensions';
import { getResponsiveSize } from '../../utilMethods';
import blsCore from '../../core';
import { ParametrConstants } from '../../constants/ParametrConstants';
const { width, height } = Dimensions.get('window');

function TaskErrorListBasedCompany() {
    const [allTaskList, setAllTaskList] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [taskOrErrorList, setTaskOrErrorList] = useState<TaskErrorListByCriteriaResponse[]>([]);
    
    // Input and select fields
    const txtTaskOrErrorNo = useImpInput({ label: 'Talep/Hata No' });
    const slcInstitution = useImpSelect({ label: 'Kurum Seçiniz', optionLabel: 'CompanyName', optionValue: 'Oid', allowBlank: false });
    const slcTaskOrErrorStatus = useImpSelect({ label: 'Hata Talep Durumu Seçiniz', optionLabel: 'ParameterName', optionValue: 'ParameterCode', allowBlank: false });
    const slcPriority = useImpSelect({ label: 'Önem Derecesi Seçiniz', optionLabel: 'ParameterName', optionValue: 'Oid', allowBlank: false });

    // Table Columns
    const columnDef = [
        { headerName: 'No', headerWidth: PageDimensions.wp * 0.15, valueGetter: (x: any) => x.No ?? '' },
        { headerName: 'Başlık', headerWidth: PageDimensions.wp * 0.40, valueGetter: (x: any) => x.Title ?? '' },
        { headerName: 'Önem Derecesi', headerWidth: PageDimensions.wp * 0.25, valueGetter: (x: any) => x.Priority ?? '' },
        {
            headerName: 'Gözlem',
            headerWidth: PageDimensions.wp * 0.2,
            buttonConfig: {
                text: 'Gözlem',
                onPress: (selectedRow: any) => onDetailButtonClicked(selectedRow),
            },
        },
    ];

    const onDetailButtonClicked = (selectedRow: any) => {
        console.log("Selected row: ", selectedRow);
    };


    useEffect(() => {
        async function pageLoad() {
            try {
                const companyList_ = await blsCore.services.parameterService.getCompanyList();
                slcInstitution.setOptionList(companyList_.sort((a: any, b: any) => a - b));

                const taskStatus = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.TASK_ERROR_STATUS);
                slcTaskOrErrorStatus.setOptionList(taskStatus.sort((a: any, b: any) =>  a.ParameterName - b.ParameterName));

                const priorityList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.PRIORITY);
                slcPriority.setOptionList(priorityList.sort((a: any, b: any) =>  a.ParameterName - b.ParameterName));
            } catch (e) {
                console.log("e", e);
            }
        }
        pageLoad();
    }, []);


    
    const filterListByTaskOrErrorNo = (value: any) => {
        const allDataList = allTaskList.slice();
        if (value) {
            const filteredList = allDataList.filter((x: any) => x.No.toString().startsWith(value.toString()));
            setTaskOrErrorList(filteredList);
        } else {
            setTaskOrErrorList(allDataList);
        }
    };



    const handleDelete = () => {
        console.log("Delete action triggered");
    };

    const handleSearch = async () => {//buradaki gibi user bağla
        try {
          const queryRequest: TaskAndErrorListByCriteriaRequest = {}
    
          queryRequest.UserOid = 0

    
          if (slcPriority.value)
            queryRequest.Priority = slcPriority.value.ParameterCode.toString()
    
          if (slcInstitution.value) {
            queryRequest.CompanyOid = slcInstitution.value.Oid
          }
          else {
            // toast.warning('Kurum seçimi zorunludur.')
            return
          }
    
          const queryList = await blsCore.services.taskAndErrorService.getCompanyTaskAndErrorListByCriteria(queryRequest)
          console.log("🚀 ~ handleSearch ~ queryList:", queryList)
          setTaskOrErrorList(queryList);
    
        }
        catch (e) {
          console.log("🚀 ~ handleSearch ~ e:", e)
        }
      }
    return (
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

            <View style={styles.contentContainer}>
                <View style={styles.slcContainer}>
                    <ImpSelect selectState={slcInstitution} searchStyle={styles.select} searchStyle={{ width: '95%' }} />
                </View>


                <View style={styles.inputContainer} inputStyle={{ width: '100%' }}>
                    <ImpInput inputState={txtTaskOrErrorNo} onChange={filterListByTaskOrErrorNo} inputStyle={{ width: '100%' }} />
                </View>

                {/* Select Fields */}

                <View style={styles.row}>
                    <ImpSelect selectState={slcTaskOrErrorStatus} searchStyle={styles.select} />
                    <ImpSelect selectState={slcPriority} searchStyle={styles.select} />
                </View>

                <View style={styles.buttonContainer}>
                    <ImpButton type='delete' onPress={handleDelete} />
                    <ImpButton type='search' onPress={handleSearch} />
                </View>

              
                <View style={styles.tableContainer}>
                    <ImpTable
                        width={PageDimensions.wp * 0.98}
                        columns={columnDef}
                        rowsData={taskOrErrorList}
                        tableHeader='Task and Error List'
                        tableContainerHeight={getResponsiveSize(500)}
                        tableHeight={getResponsiveSize(500)}
                    />
                </View>
            </View>
        </LinearGradient>
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
    contentContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
        
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingHorizontal: 16,
    },
    checkbox: {
        flex: 1,
        marginHorizontal: 5,
    },
    slcContainer: {
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 16,
     
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 16,
     
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    select: {
        width: '48%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 15,
    },
    tableContainer: {
       alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        maxHeight: '100%',
    },
});

export default TaskErrorListBasedCompany;
