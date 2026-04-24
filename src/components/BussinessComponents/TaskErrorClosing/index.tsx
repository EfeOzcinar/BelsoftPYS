/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-trailing-spaces */
/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import blsCore from '../../../core';
import { getResponsiveSize } from '../../../utilMethods';
import Toast from 'react-native-toast-message';
import { ParametrConstants } from '../../../constants/ParametrConstants';

interface DetailDialogProps {
    showDialog: boolean
    dialogName: string
    isCompanyRequest?: boolean
    checkIsTaskOrErrorInProcess?: boolean
    taskErrorInfo?: any
    closeDialog:any
    statusList:any[]
    userList:any[]
    userInfo:any
  }

function TaskErrorClosing({
    showDialog,
    closeDialog,
    dialogName,
    taskErrorInfo,userInfo}:DetailDialogProps) {

    const [explanataion, setExplanation] = useState('');
    const taskStatusRef = useRef<any>(null);
    
    useEffect(()=>{
        taskStatusRef.current = ParametrConstants.TASK_STATUS_COMPLETED;
    },[])


    const onCloseTask = async () => {
        if (taskStatusRef.current) {
          try {
            if (dialogName === 'requestDialog') {
              const closeTask = await blsCore.services.taskService.closeTask({
                TaskOid: taskErrorInfo.Oid ?? 0,
                TaskStatusCode: Number.parseInt(taskStatusRef.current),
                CloseUserOid: userInfo.userOid,
                Closedexplanation: explanataion,
              })
    
              if (closeTask) {
                Toast.show({type: 'success', text1: 'Talep başarıyla kapandı.'});
                closeDialog(true)
              }
            }
            else if (dialogName === 'errorDialog') {
              const closeTask = await blsCore.services.errorService.closeError({
                ErrorOid: taskErrorInfo.Oid ?? 0,
                ErrorStatusCode: Number.parseInt(taskStatusRef.current),
                CloseUserOid: userInfo.userOid,
                Closedexplanation: explanataion,
                IsNeedCodeUpdate: false,
              })
    
              if (closeTask) {
                Toast.show({type: 'success', text1: 'Hata başarıyla kapandı.'});
                closeDialog(true)
              }
            }
          }
          catch (e) {
            //ShowError(e)
          }
        }
        else {
            Toast.show({type: 'error', text1: 'Lütfen Talep/Hata Durumun seçiniz.'});
        }
      }
    
      const onReject = () => {
        taskStatusRef.current = ParametrConstants.TASK_STATUS_REJECTED
        setExplanation('Reddedildi')
      }
    
      const onFinish = () => {
        taskStatusRef.current = ParametrConstants.TASK_STATUS_COMPLETED
        setExplanation('Tamamlandı')
      }

    return (
        <Modal visible={showDialog} transparent={true} animationType="slide" onRequestClose={()=>closeDialog(false)}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                   
                    <View style={{justifyContent:'center',alignItems:'center',display:'flex'}}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', display: 'flex',flexDirection:'row' }}>
                        <TouchableOpacity 
                        onPress={onReject}
                        style={{ height: getResponsiveSize(35), width: '35%', backgroundColor: '#E67E22', borderRadius: 5, justifyContent: 'center', alignItems: 'center', display: 'flex', padding: '1%' }}>
                            <Text>Reddedildi.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={onFinish}
                        style={{ height: getResponsiveSize(35), width: '35%',marginLeft:'10%', backgroundColor: '#45B39D', borderRadius: 5, justifyContent: 'center', alignItems: 'center', display: 'flex', padding: '1%' }}>
                            <Text>Tamamlandı.</Text>
                        </TouchableOpacity>
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
                        <TouchableOpacity onPress={()=>closeDialog(false)} style={{backgroundColor:'#d9534f',height:getResponsiveSize(40),width:getResponsiveSize(80),justifyContent:'center',alignItems:'center',borderRadius:getResponsiveSize(5)}}>
                            <Text style={{fontWeight:'bold'}}>Kapat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCloseTask} style={{backgroundColor:'#007bff',height:getResponsiveSize(40),width:getResponsiveSize(80),justifyContent:'center',alignItems:'center',borderRadius:getResponsiveSize(5)}}>
                            <Text style={{fontWeight:'bold'}}>Kaydet</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        marginTop:'5%'
    },
    timeInput: {
        fontSize: 13,
        color:'white',
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
        color:'white',
        textAlignVertical: 'top', // Aligns text to the top-left corner
    },

});
export default TaskErrorClosing;