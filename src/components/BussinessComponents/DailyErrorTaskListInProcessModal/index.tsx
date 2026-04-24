import React, { useEffect, useRef, useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { convertDateToInt, convertIntToDate, getResponsiveSize } from '../../../utilMethods';
import { Button } from 'react-native';
import PageDimensions from '../../../constants/pageDimensions';
import { ImpDatePicker, ImpTable, useImpDatePicker } from '../../BasicComponents';
import DatePicker from 'react-native-date-picker';
import { ParametrConstants } from '../../../constants/ParametrConstants';
import moment from 'moment';
import blsCore from '../../../core';
import { FlatList } from 'react-native-gesture-handler';
import ImpButton, { useImpButton } from '../../BasicComponents/ImpButton';

interface DailyErrorTaskListInProcessProps {
    closePopup: any;
    statusInfo: any;
    personnelInfo: any;
    companyInfo: any;
    taskAndErrorList: any[];
};

function DailyErrorTaskListInProcessModal({ closePopup, statusInfo, personnelInfo, companyInfo, taskAndErrorList }: DailyErrorTaskListInProcessProps) {
    const dtStartDate = useImpDatePicker({ label: 'Başlangıç Tarihi' });
    const dtEndDate = useImpDatePicker({ label: 'Bitiş Tarihi' });
    const [dailyErrorTaskListInProcess, setDailyErrorTaskListInProcess] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [showTaskDetail, setShowTaskDetail] = useState(false);
    const selectedTaskOrErroInfoRef = useRef<any>(null);

    const deatilWindowCancelOperation = () => {
        setShowTaskDetail(false);
    };

    const cancelOperation = () => {
        closePopup(true);
    };

    const columnDefHeader = [
        {
            headerName: 'No',
            headerWidth: PageDimensions.wp * 0.15,
            valueGetter: (x: any) => x.No ?? '',
        },
        {
            headerName: 'Başlık',
            headerWidth: PageDimensions.wp * 0.35,
            valueGetter: (x: any) => x.Title ?? '',
        },
        {
            headerName: 'Kurum Adı',
            headerWidth: PageDimensions.wp * 0.25,
            valueGetter: (x: any) => companyInfo?.find((p: any) => p.Oid === x.CompanyOid)?.CompanyName ?? '',
        },
        {
            headerName: 'Detay',
            headerWidth: PageDimensions.wp * 0.2,
            buttonConfig: {
                text: 'Detay',
                onPress: (selectedRow: any) => onDetailButtonClicked(selectedRow),
            },
        },
    ];

    const onDetailButtonClicked = (selectedRow: any) => {
        if (selectedRow) {
            console.log("selectedRow", selectedRow)
            const obj: any = {};
            obj.Title = selectedRow.Title;
            obj.No = selectedRow.No;
            obj.CompanyName = companyInfo?.find((p: any) => p.Oid === selectedRow.CompanyOid)?.CompanyName ?? '';
            obj.PersonnelInfo = personnelInfo?.find((p: any) => p.Oid === selectedRow.CreatedUserOid)?.Name ?? '',
            obj.Duration = selectedRow.Duration;
            obj.EstimatedFinishDate = convertIntToDate(selectedRow.EstimatedFinishDate) ?? 'Bulunmadı';

            selectedTaskOrErroInfoRef.current = obj;
            setShowTaskDetail(true)
        }
    };

    useEffect(() => {
        setDailyErrorTaskListInProcess(taskAndErrorList);
    }, [taskAndErrorList]);

    return (
        <Modal transparent animationType='slide' >
            <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.modalContainer}>
                    <View style={styles.filterContainer}>
                        <View style={styles.dateFilter}>
                            <ImpDatePicker inputState={dtStartDate} containerStyle={{ borderWidth: 0 }} width={getResponsiveSize(180)} />
                        </View>
                        <View style={styles.dateFilter}>
                            <ImpDatePicker inputState={dtEndDate} containerStyle={{ borderWidth: 0 }} width={getResponsiveSize(180)} />
                        </View>

                        <TouchableOpacity style={styles.filterButton} onPress={async () => {
                            const dateTimeStart = new Date(dtStartDate.value);
                            const formattedDateStart = moment(dateTimeStart).format('YYYY-MM-DD');
                            const dateTimeEnd = new Date(dtEndDate.value);
                            const formattedDateEnd = moment(dateTimeEnd).format('YYYY-MM-DD');
                        }}>
                            <Text style={styles.filterButtonText}>Sorgula</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: '80%' }}>
                        <View style={styles.tableContainer}>
                            <ImpTable
                                width={PageDimensions.wp * 0.95}
                                columns={columnDefHeader as any}
                                rowsData={dailyErrorTaskListInProcess}
                                tableHeader="Bugün İşleme Alınan Hata/Talepler"
                                tableContainerHeight={getResponsiveSize(500)}
                                tableHeight={getResponsiveSize(220)}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={cancelOperation}
                            style={{ ...styles.closeButton, backgroundColor: '#E74C3C' }}>
                            <Text style={styles.closeButtonText}>Kapat</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
            {
                showTaskDetail &&
                <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '80%', height: '50%', backgroundColor: 'white', borderRadius: getResponsiveSize(20) }}>
                        <View style={{
                            display: 'flex',
                            padding: '4%',
                            marginTop: '4%',
                            //flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                            // borderBottomWidth: 1,
                            // borderBottomColor: '#aeaeae',
                            // borderStyle: 'solid'
                        }}>
                            
                            <Text style={{ fontWeight: 'bold', fontSize: getResponsiveSize(12) }}>{selectedTaskOrErroInfoRef.current?.Title}</Text>
                        </View>

                        <View style={{
                            display: 'flex',
                            padding: '4%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderBottomColor: '#aeaeae',
                            borderStyle: 'solid'
                        }}>
                            <Text>No:</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.No}</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            padding: '4%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderBottomColor: '#aeaeae',
                            borderStyle: 'solid'
                        }}>
                            <Text>Talebi Oluşturan:</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.PersonnelInfo}</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            padding: '4%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderBottomColor: '#aeaeae',
                            borderStyle: 'solid'
                        }}>
                            <Text>Süre (Dk):</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.Duration}</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            padding: '4%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderBottomColor: '#aeaeae',
                            borderStyle: 'solid'
                        }}>
                            <Text>Kurum Adı:</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.CompanyName}</Text>
                        </View>
                        <View style={{
                            display: 'flex',
                            padding: '4%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderBottomWidth: 1,
                            borderBottomColor: '#aeaeae',
                            borderStyle: 'solid'
                        }}>
                            <Text>Tahmini Bitiş Tarihi:</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.EstimatedFinishDate}</Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={deatilWindowCancelOperation}
                                style={{ ...styles.closeButton, backgroundColor: '#E74C3C', height: '100%', marginTop: '60%' }}>
                                <Text style={styles.closeButtonText}>Kapat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }
        </Modal>
    )
};

const styles = StyleSheet.create({
    modalContainer: {
        //alignItems: 'center',
        //justifyContent: 'space-between',
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        borderRadius: getResponsiveSize(15),
        padding: '3%',
        borderWidth: getResponsiveSize(1),
        borderColor: '#285A8C',
    },
    buttonContainer: {
        flexDirection: 'row',
        height: '10%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        backgroundColor: '#1E3A78',
        height: '55%',
        width: '30%',
        margin: getResponsiveSize(8),
        borderRadius: getResponsiveSize(3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: getResponsiveSize(12),
    },
    tableContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        // maxHeight: getResponsiveSize(200),
        // height: getResponsiveSize(200),
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '3%',
        height: '10%',
    },
    dateFilter: {
        width: '25%',
        marginRight: '5%',
        borderRadius: getResponsiveSize(5),
        borderWidth: getResponsiveSize(0.5),
        borderColor: '#285A8C',
    },
    filterButton: {
        backgroundColor: '#285A8C',
        width: '25%',
        height: '50%',
        margin: getResponsiveSize(8),
        borderRadius: getResponsiveSize(3),
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterButtonText: {
        color: 'white',
        fontSize: getResponsiveSize(10)
    },

});

export default DailyErrorTaskListInProcessModal;