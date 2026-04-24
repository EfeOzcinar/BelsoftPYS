/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import blsCore from '../../../core';
import { ImpPageContainer, ImpSelect, useImpSelect } from '../../BasicComponents';
import { convertTimeToMinutes, getResponsiveSize } from '../../../utilMethods';
import Toast from 'react-native-toast-message';
import { SaveAssignTaskRequest } from '../../../core/Services/TaskService/interfaces';
import { SaveAssignErrorRequest } from '../../../core/Services/ErrorService/interfaces';

interface DetailDialogProps {
    showDialog: boolean
    dialogName: string
    isCompanyRequest?: boolean
    checkIsTaskOrErrorInProcess?: boolean
    taskErrorInfo?: any
    closeDialog: any
    statusList: any[]
    userList: any[]
    userInfo: any
}

function TaskErrorAssignmentDialog({
    showDialog,
    closeDialog,
    statusList,
    userList,
    dialogName,
    checkIsTaskOrErrorInProcess = false,
    taskErrorInfo, userInfo }: DetailDialogProps) {

    const slcAssignedUser = useImpSelect({ label: 'Atanan Kullanıcı', optionLabel: (option: any) => `${option.Name} ${option.SurName}`, optionValue: 'Oid', allowBlank: false })
    const slcTaskOrErrorStatus = useImpSelect({ label: 'Talep Durumu Seçiniz', optionLabel: 'ParameterName', optionValue: 'ParameterCode', allowBlank: false });
    const [duration, setDuration] = useState('');
    const [explanataion, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function pageLoad() {
            setLoading(true);
            try {
                const users = userList;
                slcAssignedUser.setOptionList(users.sort((a: any, b: any) => a.Name.localeCompare(b.Name)));
                slcTaskOrErrorStatus.setOptionList(statusList);
            } finally {
                setLoading(false);
            }
        }
        pageLoad();
    }, []);

    const handleTimeInput = (text: any) => {
        // Sadece sayıları girmeye izin ver ve iki nokta ekle
        let cleaned = text.replace(/[^0-9]/g, ''); // Sadece sayıları tut

        let hours = cleaned.slice(0, 2);  // İlk iki rakam saat
        let minutes = cleaned.slice(2, 4);  // Sonraki iki rakam dakika

        // Saat kısmı 0-23 arasında olmalı
        if (hours.length === 2 && (parseInt(hours) > 23 || parseInt(hours) < 0)) {
            hours = '23';  // Geçersizse maksimum saat olarak 23 atanır
        }

        // Dakika kısmı 0-59 arasında olmalı
        if (minutes.length === 2 && (parseInt(minutes) > 59 || parseInt(minutes) < 0)) {
            minutes = '59';  // Geçersizse maksimum dakika olarak 59 atanır
        }

        // İki rakamdan sonra iki nokta ekle ve geri kalanını dakika olarak ayarla
        let formattedTime = hours;
        if (cleaned.length > 2) {
            formattedTime += ':' + minutes;
        }

        setDuration(formattedTime);  // Formatlanmış saati ayarla
    };

    const onSaveTaskInfo = async () => {
        if (loading) return;

        setLoading(true);
        try {
            if (duration.length > 0 && duration.includes('_')) {
                Toast.show({ type: 'error', text1: 'Geçerli bir süre giriniz.' })
                return
            }
            const minutes = convertTimeToMinutes(duration)
            slcAssignedUser.checkRequired()
            slcTaskOrErrorStatus.checkRequired()

            if (dialogName === 'requestDialog') {
                if (checkIsTaskOrErrorInProcess) {
                    await blsCore.services.taskAndErrorService.stopProcessTaskOrError({
                        TaskOrErrorOid: taskErrorInfo.Oid,
                        TaskOrErrorDetailOid: taskErrorInfo.DetailOid,
                        UserOid: userInfo.Oid,
                        Type: '2',
                    })
                }

                const data: SaveAssignTaskRequest = {
                    Description: explanataion,
                    CreatedUserOid: userInfo.Oid,
                    SendUserOid: slcAssignedUser.value.Oid,
                    InProgress: '1',
                    TaskStatusCode: slcTaskOrErrorStatus.value.ParameterCode,
                    TaskOid: taskErrorInfo.Oid,
                    Duration: minutes,
                }
                const saveResonse = await blsCore.services.taskService.saveAssignTask(data)

                const saveErrorDetailObj: any = {};
                saveErrorDetailObj.ErrorName = taskErrorInfo.Title;
                saveErrorDetailObj.ErrorDetailOid = taskErrorInfo.DetailOid;
                saveErrorDetailObj.AssignedUserName = slcAssignedUser.value.UserName;
                saveErrorDetailObj.UserName = userInfo.Name;
                saveErrorDetailObj.AssignedName = slcAssignedUser.value.Name;
                await blsCore.services.firebaseService.saveTaskDetailOnFirebase(saveErrorDetailObj);

                if (saveResonse) {
                    Toast.show({ type: 'success', text1: 'Hata başarıyla atandı.' });
                    closeDialog(true)
                }
            }
            else if (dialogName === 'errorDialog') {
                if (checkIsTaskOrErrorInProcess) {
                    await blsCore.services.taskAndErrorService.stopProcessTaskOrError({
                        TaskOrErrorOid: taskErrorInfo.Oid,
                        TaskOrErrorDetailOid: taskErrorInfo.DetailOid,
                        UserOid: userInfo.Oid,
                        Type: '1',
                    })
                }

                const data: SaveAssignErrorRequest = {
                    Description: explanataion,
                    CreatedUserOid: userInfo.Oid,
                    SendUserOid: slcAssignedUser.value.Oid,
                    InProgress: '1',
                    ErrorStatusCode: slcTaskOrErrorStatus.value.ParameterCode,
                    ErrorOid: taskErrorInfo.Oid,
                    Duration: minutes,
                }
                const saveResonse = await blsCore.services.errorService.saveAssignError(data)

                const saveErrorDetailObj: any = {};
                saveErrorDetailObj.ErrorName = taskErrorInfo.Title;
                saveErrorDetailObj.ErrorDetailOid = taskErrorInfo.DetailOid;
                saveErrorDetailObj.AssignedUserName = slcAssignedUser.value.UserName;
                saveErrorDetailObj.UserName = userInfo.Name;
                saveErrorDetailObj.AssignedName = slcAssignedUser.value.Name;
                await blsCore.services.firebaseService.saveErrorDetailOnFirebase(saveErrorDetailObj);

                if (saveResonse) {
                    Toast.show({ type: 'success', text1: 'Hata başarıyla atandı.' });
                    closeDialog(true)
                }
            }
            // setLoading(false)
        }
        catch (e: any) {
            console.log('🚀 ~ onSaveTaskInfo ~ e:', e)
            Toast.show({ type: 'error', text1: e?.message ?? 'Beklenmeyen hata' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={showDialog} transparent={true} animationType="slide" onRequestClose={() => closeDialog(false)}>
            <ImpPageContainer systemLoading={loading}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.row}>
                            <ImpSelect selectState={slcAssignedUser} />

                        </View>
                        <View style={styles.row}>
                            <ImpSelect selectState={slcTaskOrErrorStatus} />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                            <View >
                                <View style={styles.timeInputContainer}>
                                    <TextInput
                                        style={styles.timeInput}
                                        placeholder="Süre --:--"
                                        value={duration}
                                        keyboardType="numeric"
                                        placeholderTextColor="#888888"
                                        maxLength={5}  // Maksimum karakter uzunluğunu 5 ile sınırlandırdık (hh:mm formatı)
                                        onChangeText={handleTimeInput}  // Saat formatını kontrol eden fonksiyon
                                    />
                                </View>
                            </View>
                            <View >
                                <View style={styles.timeInputContainer}>
                                    <TextInput
                                        style={styles.textArea}
                                        placeholder="Açıklama"
                                        placeholderTextColor="#888888"
                                        value={explanataion}
                                        multiline
                                        onChangeText={(input) => setExplanation(input)}
                                    />
                                </View>
                            </View>
                            <Text style={styles.counter}>{explanataion.length}/2000</Text>
                        </View>



                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => closeDialog(false)} style={{ backgroundColor: '#d9534f', height: getResponsiveSize(40), width: getResponsiveSize(80), justifyContent: 'center', alignItems: 'center', borderRadius: getResponsiveSize(5) }}>
                                <Text style={{ fontWeight: 'bold' }}>Kapat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onSaveTaskInfo} style={[{ backgroundColor: '#007bff', height: getResponsiveSize(40), width: getResponsiveSize(80), justifyContent: 'center', alignItems: 'center', borderRadius: getResponsiveSize(5) }, loading && { opacity: 0.6 }]} disabled={loading} >
                                <Text style={{ fontWeight: 'bold' }}>Kaydet</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </ImpPageContainer>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Arka planı karartmak için
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#082567',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',

    },
    timeInputContainer: {
        borderWidth: 1,  // Kenarlık ekleyerek kutu şeklinde görünmesini sağlıyoruz
        borderColor: 'white',  // Kenarlığın rengi
        borderRadius: 5,  // Köşeleri yuvarlat
        padding: 5,  // İç boşluk
        width: getResponsiveSize(250),  // Kutunun genişliği
        marginTop: '5%'
    },
    timeInput: {
        fontSize: 13,
        color: 'white',
        height: 34,  // Giriş alanının yüksekliği
    },

    closeButton: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    removeButton: {
        padding: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    counter: {
        textAlign: 'right',
        fontSize: 12,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    textArea: {
        height: 150,
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        color: 'white',
        textAlignVertical: 'top', // Aligns text to the top-left corner
    },

});
export default TaskErrorAssignmentDialog;