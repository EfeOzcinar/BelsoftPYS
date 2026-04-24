/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, FlatList, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { ImpPageContainer, ImpTable } from '../../components/BasicComponents';
import ImpImagePicker from '../../components/BasicComponents/ImpImagePicker';
import PageDimensions from '../../constants/pageDimensions';
import { useRoute } from '@react-navigation/native';
import blsCore from '../../core';
import { ParametrConstants } from '../../constants/ParametrConstants';
import RenderHtml from 'react-native-render-html';
import { convertDateNumberToDateTime, getResponsiveSize, observeSelectedFile } from '../../utilMethods';
import TaskErrorAssignmentDialog from '../../components/BussinessComponents/TaskErrorAssignment';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import TaskErrorClosing from '../../components/BussinessComponents/TaskErrorClosing';
import { starEmptyIcon, startIcon, stopIcon, taskAssignmentIcon, starIcon } from '../../assets/icons';
import DocumentViewer from '../../components/BussinessComponents/DocumentViewer';

const { width, height } = Dimensions.get('window');

function TaskDetail() {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const route = useRoute<any>();
    const [imageList, setImageList] = useState<any[]>([]);
    const [taskDetailList, setTaskDetailList] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false); // Modal görünürlüğü
    const [showAssignmentModal, setShowAssignmentModal] = useState(false); // TaskAssignment Modal
    const [showClosingModal, setShowClosingModal] = useState(false); // TaskClosing Modal

    const userListRef = useRef<any>(null);
    const statusListRef = useRef<any>(null);
    const docInfoRef = useRef<any>(null);

    const showTaskButtonRef = useRef<boolean>(false);
    const hideTaskAssignmentRef = useRef<boolean>(false);
    const isTaskSendUserEqualToCurrentUserRef = useRef<boolean>(false);
    const showTaskUpdateRef = useRef<boolean>(false);

    const [taskExplanation, setTaskExplanation] = useState<any>('<p></p>');
    const [taskData, setTaskData] = useState<any>({});
    const [taskInProcess, setTaskInProcess] = useState<boolean>(false);
    const [showAllDetailList, setShowAllDetailList] = useState(false);
    const [selectedUserInfo, setSelectedUserInfo] = useState<any>({});
    const [isFavourite, setIsFavourite] = useState<boolean>(false);
    const isErrorSendUserEqualToCurrentUserRef = useRef<boolean>(false);
    const hideErrorAssignmentRef = useRef<boolean>(false);


    // Dosya listesi için tablo sütun tanımları
    const columnDef = [
        { headerName: 'Dosya Adı', headerWidth: PageDimensions.wp * 0.50, valueGetter: (x: any) => x.FileDisplayname ?? '' },
        { headerName: 'Tipi', headerWidth: PageDimensions.wp * 0.25, valueGetter: (x: any) => x.FileExtension ?? '' },
        {
            headerName: 'Detay',
            headerWidth: PageDimensions.wp * 0.2,
            buttonConfig: {
                text: 'Gözlem', // Buton metni 'Gözlem' olarak değiştirildi
                onPress: (selectedRow: any) => observeDocument(selectedRow),
            },
        },
    ];

    useEffect(() => {
        async function pageLoad() {
            setLoading(true);
            try {
                const { data } = route.params;
                if (data) {
                    fillArea(data);
                    const userDataSession = await AsyncStorage.getItem('UserInfo');
                    let userInfo: any = { Oid: 0 };
                    if (userDataSession) {
                        userInfo = JSON.parse(userDataSession);
                    }
                    const favouriteList_ = await blsCore.services.taskService.getFavoriteInfoByTaskOid({ UserOid: userInfo.userOid, TaskOid: data.Oid });
                    if (favouriteList_.Oid > 0) {
                        setIsFavourite(favouriteList_.IsActive);
                    }
                    isErrorSendUserEqualToCurrentUserRef.current = userInfo.TitleCode === ParametrConstants.TITLE_MANAGEMENT || userInfo.TitleCode === ParametrConstants.TITLE_TEAM_LEAD;
                    hideErrorAssignmentRef.current = data.ClosedDate > 0 && data.CloseUserOid > 0;
                    setSelectedUserInfo(userInfo);
                    await checkTaskOrtaskInProcess(userInfo.Oid, data.Oid);
                }
            } catch (e) {
                console.log('pageLoad error', e);
            } finally {
                setLoading(false);
            }
        }
        pageLoad();
    }, []);

    // Gözlem modalını açan fonksiyon
    const observeDocument = async (selectedRow: any) => {
        if (loading) return;
        setLoading(true);
        try {
            const docInfo: any = await observeSelectedFile(selectedRow, 'Requests');
            docInfoRef.current = docInfo;
            if (selectedRow && selectedRow.FileUrl) {
                setModalVisible(true);
            }
        } catch (e) {
            console.log('observeDocument error', e);
        } finally {
            setLoading(false);
        }
    };

    // Task assignment modalını açan fonksiyon
    const openTaskErrorAssignmentModal = () => {
        setShowAssignmentModal(true);
    };

    const closeTaskAssingmentModal = (status: boolean) => {
        setShowAssignmentModal(false);
        if (status) {
            navigation.navigate({
                name: 'UserTaskErrorList',
                merge: true,
            } as never);
        }
    };

    const openTaskErrorClosingModal = () => {
        setShowClosingModal(true);
    };

    const closeTaskErrorClosingModal = (status: boolean) => {
        setShowClosingModal(false);
        if (status) {
            navigation.navigate({
                name: 'UserTaskErrorList',
                merge: true,
            } as never);
        }
    };


    const handleImageListChange = (images: any) => {
        setImageList(images);
    };

    const fillArea = async (data: any) => {
        const taskInfo = await blsCore.services.taskService.getTaskInfo(data.Oid);
        const companyList_ = await blsCore.services.parameterService.getCompanyList();
        const priorityList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.PRIORITY);
        const statusList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.TASK_ERROR_STATUS);
        const projects_ = await blsCore.services.parameterService.getProjectList();
        const modules = await blsCore.services.parameterService.getModuleList();
        const users = await blsCore.services.authService.getUserList();
        userListRef.current = users;
        statusListRef.current = statusList;

        const dataObj: any = taskInfo;
        dataObj.ProjectName = projects_.find((x: any) => x.Oid === data.ProjectOid)?.ProjectName;
        dataObj.ModuleName = modules.find((x: any) => x.Oid === data.ModuleOid)?.ModuleName;
        dataObj.CompanyName = companyList_.find((x: any) => x.Oid === data.CompanyOid)?.CompanyName;
        dataObj.AssignedUserName = users.find((x: any) => x.Oid === data.SendUserOid)?.Name;
        dataObj.EstimateFinishDate = data.EstimatedFinishDate;
        dataObj.PriorityName = priorityList.find((x: any) => x.ParameterCode.toString() === data.Priority)?.ParameterName;

        setTaskData(dataObj);

        setTaskDetailList(taskInfo.TaskDetailList ?? []);
        setImageList(taskInfo.TaskDocumentList ?? []);  // imageList tabloya ekleniyor
        setTaskExplanation(data.Explanation);
    };

    const removeRequest = (id: number) => {
        const filteredRequests = taskDetailList.filter((request) => request.Oid !== id);
        setTaskDetailList(filteredRequests);
    };

    const convertUserOidToUserName = (oid: number) => {
        const userInfo = userListRef.current?.find((x: any) => x.Oid === oid);
        return `${userInfo.Name} ${userInfo.SurName}`;
    };

    const convertStatusCodeToStatusName = (statusCode: any) => {
        const statusInfo = statusListRef.current?.find((x: any) => x.ParameterCode === statusCode);
        return statusInfo?.ParameterName ?? '';
    };

    const processTask = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const userDataSession = await AsyncStorage.getItem('UserInfo');
            let userInfo: any = { Oid: 0 };
            if (userDataSession) {
                userInfo = JSON.parse(userDataSession);
            }
            const { data } = route.params;
            if (taskInProcess) {
                await blsCore.services.taskAndErrorService.stopProcessTaskOrError({
                    TaskOrErrorOid: data.Oid,
                    TaskOrErrorDetailOid: data.DetailOid,
                    UserOid: userInfo.Oid,
                    Type: '1',
                });
                setTaskInProcess(false);
                Toast.show({ type: 'success', text1: 'Talebiniz durduruldu.' });
            }
            else {
                await blsCore.services.taskAndErrorService.processTaskOrError({
                    TaskOrErrorOid: data.Oid,
                    TaskOrErrorDetailOid: data.DetailOid,
                    UserOid: userInfo.Oid,
                    Type: '1',
                });
                setTaskInProcess(true);
                Toast.show({ type: 'success', text1: 'Talebiniz işleme alındı.' });
            }
        } catch (error) {
            console.log('processTask error', error);
        } finally {
            setLoading(false);
        }
    };

    const checkTaskOrtaskInProcess = async (userOid: number, taskOid: number) => {
        setLoading(true);
        try {
            const result = await blsCore.services.taskAndErrorService.checkTaskOrErrorInProcess({
                TaskOrErrorOid: taskOid,
                TaskOrErrorDetailOid: taskData.DetailOid,
                UserOid: userOid,
            });
            setTaskInProcess(!!result);
        } catch (error) {
            setTaskInProcess(false);
        } finally {
            setLoading(false);
        }
    };

    const addFavoriteTask = async (isActiveValue: boolean) => {
        if (loading) return;
        setLoading(true);
        try {
            const { data } = route.params;
            const userDataSession = await AsyncStorage.getItem('UserInfo');
            let userInfo: any = { Oid: 0 };
            if (userDataSession) {
                userInfo = JSON.parse(userDataSession);
            }
            await blsCore.services.taskService.addFavoriteTask({
                TaskOid: data.Oid,
                UserOid: userInfo.Oid,
                IsActive: isActiveValue,
            });
            Toast.show({ type: 'success', text1: isActiveValue ? 'Favoriye alındı' : 'Favoriden kaldırıldı' });
        } catch (error) {
            console.log('addFavoriteTask error', error);
        } finally {
            setLoading(false);
        }
    };

    const onFavouriteButtonChange = () => {
        setIsFavourite(((value: any) => {
            const newValue = !value;
            addFavoriteTask(newValue);
            return newValue;
        }));
    };

    const updateError = () => {
        navigation.navigate({
            name: 'TaskUpdate',
            params: {
                data: taskData,
            },
            merge: true,
        } as never);
    };

    // kullanıcının OIDsi, kaydı oluşturan ya da atanan kişiyle eşleşiyorsa butonları göster
    const canShowActionButtons = React.useMemo(() => {
        const userOid = selectedUserInfo?.Oid ?? 0;
        if (!userOid) return false;

        const sendUserOid = taskData?.SendUserOid ?? 0;       // atanan/iletilen
        const createdUserOid = taskData?.CreatedUserOid ?? 0; // ben açtıysam

        const isMine = userOid === sendUserOid || userOid === createdUserOid;

        return isMine;
    }, [selectedUserInfo, taskData]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://img.freepik.com/free-vector/gradient-futuristic-background-with-connection-concept_23-2149104857.jpg' }}
                style={styles.backgroundImage}
            >
                <ImpPageContainer systemLoading={loading}>
                    <Svg height={height * 0.3} width={width * 0.6} style={styles.svgStyle}>
                        <Circle cx={-width * 0.1} cy={-height * 0.1} r={width * 0.5} fill="#1C3F7C" fillOpacity="0.6" />
                    </Svg>
                    {/* İkon Butonlar Bölümü */}
                    {canShowActionButtons && (
                        <View style={styles.iconButtonContainer}>
                            <TouchableOpacity style={styles.iconButton} onPress={processTask}>
                                <Image source={taskInProcess ? stopIcon : startIcon} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={openTaskErrorAssignmentModal}>
                                <Image source={taskAssignmentIcon} style={styles.icon} />
                            </TouchableOpacity>
                            {
                                !hideErrorAssignmentRef.current && isErrorSendUserEqualToCurrentUserRef.current
                                && (
                                    <TouchableOpacity style={styles.iconButton} onPress={openTaskErrorClosingModal}>
                                        <Image source={require('../../assets/icons/taskClosing.png')} style={styles.icon} />
                                    </TouchableOpacity>
                                )
                                // onPress={updateError}
                            }
                            <TouchableOpacity style={styles.iconButton} >
                                <Image source={require('../../assets/icons/taskEdit.png')} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={onFavouriteButtonChange}>
                                <Image source={isFavourite ? starIcon : starEmptyIcon} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                    )}

                    <FlatList
                        data={[{ id: '1' }]}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={
                            <View>
                                {modalVisible && <DocumentViewer
                                    modalVisible={modalVisible}
                                    base64String={docInfoRef?.current?.docUrl}
                                    type={docInfoRef?.current?.docType}
                                    kind={docInfoRef?.current?.docKind}
                                    closeModal={() => setModalVisible(false)} />}



                                {/* Task Assignment Modal */}
                                {
                                    showAssignmentModal &&
                                    <TaskErrorAssignmentDialog
                                        showDialog={showAssignmentModal}
                                        closeDialog={(e: boolean) => closeTaskAssingmentModal(e)}
                                        statusList={statusListRef.current}
                                        userList={userListRef.current}
                                        taskErrorInfo={route.params?.data}
                                        userInfo={selectedUserInfo}
                                        dialogName="requestDialog"
                                        checkIsTaskOrErrorInProcess={taskInProcess}
                                    />
                                }

                                {
                                    showClosingModal &&
                                    <TaskErrorClosing
                                        showDialog={showClosingModal}
                                        closeDialog={(e: boolean) => closeTaskErrorClosingModal(e)}
                                        statusList={statusListRef.current}
                                        userList={userListRef.current}
                                        taskErrorInfo={route.params?.data}
                                        userInfo={selectedUserInfo}
                                        dialogName="requestDialog"
                                        checkIsTaskOrErrorInProcess={taskInProcess}
                                    />
                                }


                                {/* Başlık ve Form Alanları */}
                                <View style={styles.fieldContainer}>
                                    <View style={styles.textAreaContainer2}>
                                        <Text style={styles.value}>{taskData?.TaskTitle}</Text>
                                    </View>
                                </View>

                                {/* Tek Kutucuk İçinde Alanlar */}
                                <View style={styles.combinedFieldContainer}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Proje Adı:</Text>
                                        <Text style={styles.value}>{taskData?.ProjectName}</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Kurum Adı:</Text>
                                        <Text style={styles.value}>{taskData?.CompanyName}</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Talep No:</Text>
                                        <Text style={styles.value}>{taskData?.TaskNo}</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Atanan Kullanıcı:</Text>
                                        <Text style={styles.value}>{taskData?.AssignedUserName}</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Modül:</Text>
                                        <Text style={styles.value}>{taskData?.ModuleName}</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Tahmini Bitiş Tarihi:</Text>
                                        <Text style={styles.value}>{taskData?.EstimatedFinishDate}</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Önem Derecesi:</Text>
                                        <Text style={styles.value}>{taskData?.PriorityName}</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldContainer}>
                                    <View style={styles.textAreaContainer}>
                                        <Text style={styles.label1}>Açıklama:</Text>
                                        <ScrollView>
                                            <RenderHtml
                                                contentWidth={width}
                                                source={{ html: taskExplanation }}
                                                tagsStyles={{
                                                    p: { color: 'black', fontSize: 12 }, // Paragraf stilleri
                                                }}
                                            />
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <View style={styles.tableContainer}>

                                <View style={{ position: 'absolute', right: getResponsiveSize(11), zIndex: 99 }}>
                                    <ImpImagePicker imageList={handleImageListChange} buttonStyle={{ height: getResponsiveSize(30) }} />
                                </View>
                                <ImpTable
                                    columns={columnDef as any}
                                    rowsData={imageList}  // Dosya listesi (ErrorDocumentList)
                                    tableHeader="Dosya Listesi"
                                    tableContainerHeight={135}
                                    tableHeight={80}
                                />
                            </View>
                        )}
                        ListFooterComponent={
                            <View style={styles.requestHistoryContainer}>
                                <View style={{ flexDirection: 'row', display: 'flex' }}>
                                    <Text style={styles.historyHeaderText}>Talep Geçmişi</Text>
                                    {taskDetailList.length > 1 && (
                                        <TouchableOpacity onPress={() => setShowAllDetailList(!showAllDetailList)} style={styles.toggleButton}>
                                            <Text style={{ color: 'white', textAlign: 'center' }}>{showAllDetailList ? 'Gizle' : 'Tümünü Göster'}</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {taskDetailList.length > 0 ? (
                                    taskDetailList.slice(0, showAllDetailList ? taskDetailList.length : 1).map((request) => (
                                        <View key={request.Oid} style={styles.requestItem}>
                                            <View style={styles.requestDetails}>
                                                <Text style={styles.requestDate}>
                                                    {convertUserOidToUserName(request.CreatedUserOid)} {'=>'} {convertUserOidToUserName(request.SendUserOid)}
                                                </Text>
                                                <Text style={styles.requestStatus}>
                                                    {convertDateNumberToDateTime(request.CreatedDate)} Hata Durumu: {convertStatusCodeToStatusName(request.ErrorStatusCode)}
                                                </Text>
                                                <Text style={{ ...styles.requestStatus, marginTop: '2%' }}>Açıklama: {request.Description}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => removeRequest(request.Oid)} style={styles.removeButton}>
                                                <Text style={styles.removeButtonText}>✖</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noHistoryText}>Henüz bir talepte bulunulmamış.</Text>
                                )}
                            </View>
                        }
                    />
                </ImpPageContainer>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D3D3D3',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: height,
    },
    gradientContainer: {
        flex: 1,
    },
    svgStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    combinedFieldContainer: {
        backgroundColor: '#d4d7ce', // Yeni kutucuk arka plan rengi
        borderRadius: 10,
        padding: 1,
        marginHorizontal: 10,
        marginBottom: 10,
    },

    iconButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2C3E50', // Lacivert tonlarına uyumlu bir renk
        height: 50,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 6,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '15%',
        marginVertical: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    fieldContainer: {
        marginBottom: 5,
        marginTop: 0.5,
    },
    label: {
        color: 'black',
        fontSize: 12,
        marginRight: 10,
        marginLeft: 10,
    },
    label1: {
        color: 'black',
        fontSize: 12,
        marginRight: 10,
        marginLeft: 10,
    },
    value: {
        color: 'black',
        fontSize: getResponsiveSize(10),
    },
    textAreaContainer2: {
        backgroundColor: '#f4c430',
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        height: 39,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAreaContainer: {
        backgroundColor: '#f4c430',
        marginRight: 10,
        marginLeft: 10,
        padding: 10,
        height: 'auto', // Yükseklik otomatik ayarlansın
        justifyContent: 'center',
        marginBottom: 18,
        marginTop: 10,
    },
    scrollView: {
        paddingVertical: 10,
    },
    divider: {
        height: 0.7,
        backgroundColor: 'gray',
        marginVertical: 1,
        marginRight: 10,
        marginLeft: 10,
    },
    tableContainer: {
        marginLeft: 6,
        marginTop: 1,
        marginBottom: 18,
    },

    timeInputContainer: {
        borderWidth: 1,  // Kenarlık ekleyerek kutu şeklinde görünmesini sağlıyoruz
        borderColor: 'white',  // Kenarlığın rengi
        borderRadius: 5,  // Köşeleri yuvarlat
        padding: 5,  // İç boşluk
        width: 310,  // Kutunun genişliği
        marginRight: 45,
        marginTop: 3,

    },
    timeInput: {
        fontSize: 13,
        height: 34,  // Giriş alanının yüksekliği
    },
    textBox: {
        borderWidth: 1,  // Kenarlık ekleyerek kutu şeklinde görünmesini sağlıyoruz
        borderColor: 'white',  // Kenarlığın rengi
        borderRadius: 5,  // Köşeleri yuvarlat
        padding: 5,  // İç boşluk
        width: 310,  // Kutunun genişliği
        marginRight: 75,
        marginTop: 3,



    },
    imagePreview: {
        width: '100%',
        height: 300, // Resim için genişlik ve yükseklik
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#000000',
        fontSize: 16,
    },
    requestHistoryContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    historyHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
        width: '65%'
    },
    requestItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)', // Şeffaf beyaz arka plan
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row', // Çarpı butonunu sağa yerleştirmek için
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    requestDetails: {
        flex: 1, // Çarpı butonu ile metin arasındaki alanı kullan
    },
    requestDate: {
        fontSize: 14,
        color: '#000000',
    },
    requestStatus: {
        fontSize: 14,
        color: '#c0c0c0',
    },
    removeButton: {
        padding: 4,
    },
    removeButtonText: {
        fontSize: 18,
        color: '#800000', // Çarpı butonunun rengi
    },
    noHistoryText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
    },
    textArea: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        marginVertical: 10,
        height: 80,
        textAlignVertical: 'top',
    },
    counter: {
        textAlign: 'right',
        fontSize: 12,
        color: 'gray',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    toggleButton: {
        backgroundColor: 'transparent',
        padding: '2%',
        width: '30%',
        borderRadius: 3,
        borderColor: 'orange',
        borderWidth: 1,
        borderStyle: 'solid'
    }

});

export default TaskDetail;
