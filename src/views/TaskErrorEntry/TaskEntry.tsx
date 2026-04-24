/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-catch-shadow */
/* eslint-disable keyword-spacing */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, FlatList, Text } from 'react-native';
import { ImpButton, ImpDateInput, ImpInput, ImpPageContainer, ImpSelect, ImpTable, useImpDateInput, useImpInput, useImpSelect, ImpRichEditor, useImpRichEditor } from '../../components/BasicComponents';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import PageDimensions from '../../constants/pageDimensions';
import ImpImagePicker from '../../components/BasicComponents/ImpImagePicker';
import blsCore from '../../core';
import { ParametrConstants } from '../../constants/ParametrConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResponsiveSize } from '../../utilMethods';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { SaveTaskRequest } from '../../core/Services/TaskService/interfaces';
import { useImpButton } from '../../components/BasicComponents/ImpButton';


const { width, height } = Dimensions.get('window');

function TaskEntry() {

    const columnDef = [
        { headerName: 'Dosya Adı', headerWidth: PageDimensions.wp * 0.50, valueGetter: (x: any) => x.fileName ?? '' },
        { headerName: 'Tipi', headerWidth: PageDimensions.wp * 0.25, valueGetter: (x: any) => x.type ?? '' },
        {
            headerName: 'Detay',
            headerWidth: PageDimensions.wp * 0.2,
            buttonConfig: {
                text: 'Sil',
                onPress: (selectedRow: any) => onDetailButtonClicked(selectedRow),
            },
        },
    ];

    const onDetailButtonClicked = (selectedRow: any) => {
        if (selectedRow) {
            const filter = imageList.filter((x: any) => x.fileName !== selectedRow.fileName)
            setImageList(filter)
        }
    }

    // Left side select inputs
    const slcProject = useImpSelect({ label: 'Proje Adı Seçiniz', optionLabel: 'ProjectName', optionValue: 'Oid' });
    const slcInstitution = useImpSelect({ label: 'Kurum Adı Seçiniz', optionLabel: 'CompanyName', optionValue: 'Oid' });
    const slcAssignedUser = useImpSelect({ label: 'Atanan Kullanıcı', optionLabel: (option: any) => `${option.Name} ${option.SurName}`, optionValue: 'Oid', allowBlank: false })

    const slcEstimateFinishDate = useImpDateInput({ label: 'Tahmini Bitiş Tarihi' });

    // Right side select inputs
    const slcMainModule = useImpSelect({ label: 'Ana Modül Seçiniz', optionLabel: 'ModuleName', optionValue: 'Oid' });
    const slcModule = useImpSelect({ label: 'Modül Seçiniz', optionLabel: 'ModuleName', optionValue: 'Oid' });
    const slcSubModule = useImpSelect({ label: 'Alt Modül Seçiniz', optionLabel: 'ModuleName', optionValue: 'Oid' });
    const slcPriority = useImpSelect({ label: 'Önem Derecesi Seçiniz', optionLabel: 'ParameterName', optionValue: 'Oid' });
    const [imageList, setImageList] = useState<any[]>([])
    const txtRichEditor = useImpRichEditor({ label: '' })
    const btnSave = useImpButton({});
    const [loading, setLoading] = useState(false)

    const txtErrorTitle = useImpInput({
        label: 'Talep Başlığı',
        allowBlank: false,
    });


    useEffect(() => {
        getParameterList();
    }, [])

    const getParameterList = async () => {
        try {
            const projects_ = await blsCore.services.parameterService.getProjectList()
            slcProject.setOptionList(projects_.sort((a: any, b: any) => a - b))

            const companyList_ = await blsCore.services.parameterService.getCompanyList()
            slcInstitution.setOptionList(companyList_.sort((a: any, b: any) => a - b))

            const modules = await blsCore.services.parameterService.getModuleList()
            slcMainModule.setOptionList(modules.sort((a: any, b: any) => a - b))

            const users = await blsCore.services.authService.getUserList()
            users.sort((a: { Name: string }, b: { Name: string }) => {
                const [aName, aSurname] = a.Name.split(' ')
                const [bName, bSurname] = b.Name.split(' ')

                const nameComparison = aName.localeCompare(bName)
                if (nameComparison !== 0) {
                    return nameComparison
                }

                return aSurname ? aSurname.localeCompare(bSurname) : 0
            })
            //slcAssignedUser.setOptionList(users) tüm yazılımcılara talep açılabilir
            slcAssignedUser.setOptionList(users.filter((x: any) => x.TitleCode !== 2))

            const priorityList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.PRIORITY)
            slcPriority.setOptionList(priorityList.sort((a: any, b: any) => a - b))
        }
        catch (e) {
            console.log('e', e)
        }
    }

    const handleImageListChange = (images: any) => {
        setImageList(prev => [...prev, ...images])
    };

    const checkRequiredFields = () => {
        if (!slcProject.value) {
            Toast.show({ type: 'error', text1: 'Proje seçiniz' });
            return false
        }
        if (!slcInstitution.value) {
            Toast.show({ type: 'error', text1: 'Kurum seçiniz' });
            return false
        }
        if (!slcAssignedUser.value) {
            Toast.show({ type: 'error', text1: 'Atanacak Kullanıcı seçiniz' });
            return false
        }
        if (!slcPriority.value) {
            Toast.show({ type: 'error', text1: 'Önem derecesi seçiniz' });
            return false
        }
        if (!slcMainModule.value) {
            Toast.show({ type: 'error', text1: 'Modül seçiniz' });
            return false
        }
        return true
    }
    const saveTask = async () => {
        try {
            btnSave.disable();
            const checkRequiredValues = checkRequiredFields()
            if (!checkRequiredValues) {
                btnSave.enable();
                return
            }
            setLoading(true)
            const userDataSession = await AsyncStorage.getItem('UserInfo');
            let userInfo: any = { Oid: 0 }
            if (userDataSession) {
                userInfo = JSON.parse(userDataSession)
            }

            const documentList: any = []
            if (imageList && imageList.length > 0) {
                await Promise.all(imageList.map(async (element: any) => {
                    const fileExtension = `.${element.fileName.split('.').pop()}`
                    const fileName = `${element.fileName.slice(0, element.fileName.length - fileExtension.length)}_${moment().format('YYYYMMDDHHmmss')}`
                    const fileLength = element?.size ?? 0

                    try {
                        const fileObj: any = {};
                        fileObj.FileName = fileName;
                        fileObj.FileExtension = fileExtension;
                        fileObj.Extension = fileExtension;
                        fileObj.Length = fileLength;
                        fileObj.Base64String = element.base64;
                        fileObj.ModuleName = 'Requests'
                        fileObj.ProcessDate = moment().format();
                        fileObj.FileExplanation = '';
                        fileObj.Oid = 0;

                        const documentObj: any = {};
                        documentObj.IsActive = true;
                        documentObj.SourceDirectory = '';
                        documentObj.FileName = fileName;
                        documentObj.ModuleName = 'Requests'
                        documentObj.Title = fileName;
                        documentObj.OriginalFileName = fileName;
                        documentObj.FileExtension = fileExtension;
                        documentObj.Extension = fileExtension;
                        documentObj.FileFullPath = '';
                        documentObj.IsConverted = false;
                        documentObj.TemporaryFileName = fileName;
                        documentObj.Oid = 0;
                        documentList.push(documentObj)
                        const data = {
                            UserName: userInfo.username,
                            Request: fileObj,
                        }
                        await blsCore.services.fileService.uploadFile(data)
                    }
                    catch (e) {
                        throw new Error('Dosya yüklenirken bir hata ile karşılaşıldı. İşleme devam edilemiyor.')
                    }
                }))
            }

            const obj: any = {};

            obj.TaskTitle = txtErrorTitle.value;
            obj.TaskExplanation = txtRichEditor.value;
            obj.Priority = slcPriority.value.ParameterCode.toString();
            obj.CompanyOid = slcInstitution.value.Oid;
            obj.ProjectOid = slcProject.value.Oid;
            if (slcMainModule.value && !slcModule.value && !slcSubModule.value) {
                obj.ModuleOid = slcMainModule.value.Oid
            }
            else if (slcMainModule.value && slcModule.value && !slcSubModule.value) {
                obj.ModuleOid = slcModule.value.Oid
            }
            else if (slcMainModule.value && slcModule.value && slcSubModule.value) {
                obj.ModuleOid = slcSubModule.value.Oid
            }
            else {
                obj.ModuleOid = 0;
            }
            obj.TaskStatusCode = ParametrConstants.TASK_STATUS_PENDING;
            obj.CreatedUserOid = userInfo.Oid;
            obj.UpdatedDate = 0;
            obj.UpdateUserOid = 0;
            obj.DeletedDate = 0;
            obj.DeleteUserOid = 0;
            obj.ClosedDate = 0;
            obj.CloseUserOid = 0;
            obj.IsTaskClosed = false;
            obj.EstimatedFinishDate = 0;
            obj.TaskDocumentList = documentList;
            obj.TaskDetail = {
                Description: 'Yeni Talep Alındı',
                CreatedUserOid: userInfo.Oid,
                SendUserOid: slcAssignedUser.value.Oid,
                TaskStatusCode: ParametrConstants.TASK_STATUS_PENDING,
                InProgress: '1',
                TaskOid: 0,
            } as any;
            const taskResponse = await blsCore.services.taskService.saveTask(obj)
            if (taskResponse && taskResponse.Oid > 0) {
                Toast.show({ type: 'success', text1: `Talebiniz alınmıştır. Talep numaranız ${taskResponse?.TaskNo.toString()}` });
            }
            setLoading(false)
        }
        catch (e) {
            setLoading(false)
            btnSave.enable();
            Toast.show({ type: 'error', text1: 'Kayıt sırasın bir hata oluştu' });
        }
    }

    const onParentModuleChange = async (e: any) => {
        if (e) {
            try {
                slcModule.clear()
                const modules = await blsCore.services.parameterService.getModuleListByParentOid(e.Oid)
                slcModule.setOptionList(modules.sort((a: any, b: any) => a - b))
            }
            catch (err) {
                console.log('🚀 ~ onParentModuleChange ~ e:', err)
            }
        }
    }

    const onModuleChange = async (e: any) => {
        if (e) {
            try {
                slcSubModule.clear()
                const modules = await blsCore.services.parameterService.getModuleListByParentOid(e.Oid)
                slcSubModule.setOptionList(modules.sort((a: any, b: any) => a - b))
            }

            catch (err) {
                console.log('🚀 ~ onModuleChange ~ e:', e)
            }
        }
    }

    const clearAllFields = () => {
        slcPriority.clear();
        slcProject.clear();
        slcInstitution.clear();
        slcAssignedUser.clear();
        slcEstimateFinishDate.clear();
        slcMainModule.clear();
        slcModule.clear();
        slcSubModule.clear();
        txtRichEditor.clear();
        txtErrorTitle.clear();
        setImageList([]);
    }

    return (
        <ImpPageContainer systemLoading={loading}>
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
                <FlatList
                    data={[{ id: '1' }]}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        <View style={styles.scrollView}>
                            <ImpInput
                                inputState={txtErrorTitle}
                                width={PageDimensions.wp * 0.9}
                                height={PageDimensions.hp * 0.06}
                                containerStyle={{ marginLeft: PageDimensions.wp * 0.05, backgroundColor: 'white' }}
                            />
                            <ImpRichEditor textState={txtRichEditor}
                                containerStyle={{ marginLeft: PageDimensions.wp * 0.05, height: getResponsiveSize(200), width: PageDimensions.wp * 0.9 }} />

                            <View style={styles.row}>
                                <ImpSelect selectState={slcProject} searchStyle={styles.select} />
                                <ImpSelect selectState={slcMainModule} searchStyle={styles.select} onChange={(e: any) => onParentModuleChange(e)} />
                            </View>
                            <View style={styles.row}>
                                <ImpSelect selectState={slcInstitution} searchStyle={styles.select} />
                                <ImpSelect selectState={slcModule} searchStyle={styles.select} onChange={(e: any) => onModuleChange(e)} />
                            </View>
                            <View style={styles.row}>
                                <ImpSelect selectState={slcAssignedUser} searchStyle={styles.select} />
                                <ImpSelect selectState={slcSubModule} searchStyle={styles.select} />
                            </View>
                            <View style={styles.row}>
                                <View style={styles.halfWidth}>
                                    <ImpDateInput inputState={slcEstimateFinishDate} />
                                </View>
                                <View style={[styles.halfWidth, styles.marginLeft]}>
                                    <ImpSelect selectState={slcPriority} searchStyle={styles.fullWidth} />
                                </View>
                            </View>

                            <View style={styles.buttonRow}>
                                <ImpButton type="clear" onPress={clearAllFields} buttonStyle={{ width: '30%' }} />
                                <ImpButton type="save" onPress={saveTask} buttonStyle={{ width: '30%' }} buttonState={btnSave} />
                                <ImpImagePicker imageList={handleImageListChange} buttonStyle={{ width: '30%' }} />
                            </View>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.tableContainer}>
                            <ImpTable
                                columns={columnDef as any}
                                rowsData={imageList}
                                tableHeader="Döküman Listesi"
                                tableContainerHeight={200}
                                tableHeight={80}
                            />
                        </View>
                    )}
                />

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
    scrollView: {
        flex: 1,
    },
    multilineContainer: {
        marginBottom: 20,
        marginLeft: PageDimensions.wp * 0.05,
    },
    multilineInput: {
        textAlignVertical: 'top',
        maxHeight: PageDimensions.hp * 0.3,
        minHeight: PageDimensions.hp * 0.1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8,
        marginBottom: 0,
        marginTop: 4,
    },
    select: {
        width: '45%',
    },
    halfWidth: {
        width: '45%',
    },
    marginLeft: {
        marginLeft: '10%',
    },
    fullWidth: {
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 6,
    },
    imagePickerRow: {
        marginLeft: 3,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    tableContainer: {
        marginTop: 20,
        marginLeft: 10,
    },
});

export default TaskEntry;
