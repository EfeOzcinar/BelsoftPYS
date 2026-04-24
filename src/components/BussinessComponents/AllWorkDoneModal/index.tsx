import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { convertIntToDate, getResponsiveSize } from '../../../utilMethods';
import { Button } from 'react-native';
import PageDimensions from '../../../constants/pageDimensions';
import { ImpTable } from '../../BasicComponents';

interface AllWorkDoneModalProps {
    closePopup: any;
    allWorkDoneModal: any;
    priorityInfo: any;
    statusInfo: any;
    personnelInfo: any;
    companyInfo: any;
};

function AllWorkDoneModal({ closePopup, allWorkDoneModal, priorityInfo, statusInfo, personnelInfo, companyInfo }: AllWorkDoneModalProps) {
    const [allWorkDoneDataModal, setAllWorkDoneDataModal] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [showTaskDetail, setShowTaskDetail] = useState(false);
    const selectedTaskOrErroInfoRef = useRef<any>(null);

    const cancelOperation = () => {
        closePopup(true);
    };

    const deatilWindowCancelOperation = () => {
        setShowTaskDetail(false);
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

    useEffect(() => {
        console.log("priorityInfo====", priorityInfo);

        setAllWorkDoneDataModal(allWorkDoneModal);

    }, [allWorkDoneModal]);

    const onDetailButtonClicked = (selectedRow: any) => {
        if (selectedRow) {
            console.log("selectedRow", selectedRow)
            const obj: any = {};
            obj.Title = selectedRow.Title;
            obj.No = selectedRow.No;
            obj.Type = selectedRow.Type === '1' ? 'Hata' : 'Talep';
            obj.CompanyName = companyInfo?.find((p: any) => p.Oid === selectedRow.CompanyOid)?.CompanyName ?? '';
            obj.SendUser = personnelInfo?.find((p: any) => p.Oid === selectedRow.CreatedUserOid)?.Name ?? '';
            obj.Duration = selectedRow.Duration;
            obj.EstimatedFinishDate = convertIntToDate(selectedRow.EstimatedFinishDate) ?? 'Bulunmadı';
            obj.PriorityInfo = priorityInfo?.find((p: any) => p.ParameterCode === Number(selectedRow.Priority))?.ParameterName ?? '';
            obj.StatusInfo = statusInfo?.find((p: any) => p.ParameterCode === selectedRow.StatusCode)?.ParameterName ?? '';
            obj.SenderUser = personnelInfo?.find((p: any) => p.Oid === selectedRow.SenderUserOid)?.Name ?? '';

            selectedTaskOrErroInfoRef.current = obj;
            setShowTaskDetail(true);
        }
    };

    return (
        <Modal transparent animationType='slide' >
            <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.modalContainer}>
                    <View style={styles.tableContainer}>
                        <ImpTable
                            width={PageDimensions.wp * 0.95}
                            columns={columnDefHeader as any}
                            rowsData={allWorkDoneDataModal}
                            tableHeader="Yapılan Tüm İşler"
                            tableContainerHeight={getResponsiveSize(500)}
                            tableHeight={getResponsiveSize(220)}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={cancelOperation}
                            style={{ ...styles.closeButton, backgroundColor: '#E74C3C', marginTop: '40%' }}>
                            <Text style={styles.closeButtonText}>Kapat</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            {
                showTaskDetail &&
                <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '80%', height: '62%', backgroundColor: 'white', borderRadius: getResponsiveSize(20) }}>
                        <View style={{
                            display: 'flex',
                            padding: '4%',
                            marginTop: '4%',
                            justifyContent: 'center',
                            alignItems: 'center'
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
                            <Text>Hata/Talep:</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.Type}</Text>
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
                            <Text>Önem Derecesi:</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.PriorityInfo}</Text>
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
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.SendUser}</Text>
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
                            <Text>Atayan Kullanıcı:</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.SenderUser}</Text>
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
                            <Text>Hata/Talep Durumu:</Text>
                            <Text style={{ fontWeight: 'bold' }}>{selectedTaskOrErroInfoRef.current?.StatusInfo}</Text>
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
                                style={{ ...styles.closeButton, backgroundColor: '#E74C3C', height: '80%', marginTop: '10%' }}>
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

export default AllWorkDoneModal;