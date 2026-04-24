import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { convertDateToInt, convertDateToNumber, getResponsiveSize } from '../../utilMethods';
import { Dimensions } from 'react-native';
import PieChart from "react-native-chart-kit/dist/PieChart";
import AllWorkDoneModal from '../../components/BussinessComponents/AllWorkDoneModal';
import blsCore from '../../core';
import { useRoute } from '@react-navigation/native';
import { ParametrConstants } from '../../constants/ParametrConstants';
import moment from 'moment';
import UserTaskListModal from '../../components/BussinessComponents/UserTaskListModal';
import DailyErrorTaskListInProcessModal from '../../components/BussinessComponents/DailyErrorTaskListInProcessModal';

const { width, height } = Dimensions.get('window');

function PersonelDutyDetails() {
    const route = useRoute<any>();
    const [ShowUserTaskListModal, setShowUserTaskListModal] = useState(false);
    const [ShowAllWorkDoneModal, setShowAllWorkDoneModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ShowDailyErrorTaskListInProcessModal, setShowDailyErrorTaskListInProcessModal] = useState(false);
    const [dataInfo, setDataInfo] = useState();
    const [taskAndErrorListInProcess, setTaskAndErrorListInProcess] = useState<any>({});
    const [taskAndErrorsInProcessCompanyInfo, setTaskAndErrorsInProcessCompanyInfo] = useState<any>({});
    const [userStatistic, setUserStatistic] = useState<any>({});
    const [taskAndErrorsInProcessPriorityInfo, setTaskAndErrorsInProcessPriorityInfo] = useState<any>({});
    const [dailyErrorTaskListInProcess, setDailyErrorTaskListInProcess] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [userTaskList, setUserTaskList] = useState<TaskErrorListByCriteriaResponse[]>([])
    const [allTaskList, setAllTaskList] = useState<TaskErrorListByCriteriaResponse[]>([])
    const [priorityList, setPriorityList] = useState<any>([]);
    const [requestStatusList, setRequestStatusList] = useState<any>([]);
    const [personnelList, setPersonnelList] = useState<any>([]);
    const [companyList, setCompanyList] = useState<any>([]);
    const taskAndErrorListByDateRef = useRef<any[]>([])

    useEffect(() => {
        try {
            async function PageLoad() {
                setLoading(true);

                const { data } = route.params;
                setDataInfo(data.FullName);

                const taskAndErrorsInProcess = await blsCore.services.taskAndErrorService.getTaskAndErrorListInProcess();
                const userTaskInProcess = taskAndErrorsInProcess.find((x: any) => x.SendUserOid === data.Oid);
                if (userTaskInProcess) {
                    setTaskAndErrorListInProcess(userTaskInProcess);
                    const priorityList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.PRIORITY);
                    const taskAndErrorsInProcessPriorityInfo = priorityList.find((x: any) => x.ParameterCode === Number(userTaskInProcess.Priority));
                    setTaskAndErrorsInProcessPriorityInfo(taskAndErrorsInProcessPriorityInfo);
                }

                const companyList = await blsCore.services.parameterService.getCompanyList();
                const taskAndErrorsInProcessCompanyInfo = companyList.find((x: any) => x.Oid === data.CompanyOid);
                if (userTaskInProcess) {
                    setTaskAndErrorsInProcessCompanyInfo(taskAndErrorsInProcessCompanyInfo);
                }
                setCompanyList(companyList);

                const obj: TaskAndErrorListByCriteriaRequest = {};
                obj.UserOid = data.Oid;
                const getUserIstatisticInfo = await blsCore.services.taskAndErrorService.getUserIstatisticInfo(obj);
                setUserStatistic(getUserIstatisticInfo);

                const personnel = await blsCore.services.authService.getUserList();
                setPersonnelList(personnel);

                //const projectList = await blsCore.services.parameterService.getProjectList();

                //const allModuleList = await blsCore.services.parameterService.getAllModuleList();

                const requestStatusList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.TASK_ERROR_STATUS);
                setRequestStatusList(requestStatusList);

                console.log("moment().format('DD.MM.YYYY')", typeof Number(moment().format('DD.MM.YYYY')));
            };
            PageLoad();
        }
        catch (error) {

        }
    }, []);

    //iş sıralaması tablosu
    const getUserTaskAndErrorListByCriteria = async () => {
        const { data } = route.params;
        if (data.Oid) {
            const queryRequest: TaskAndErrorListByCriteriaRequest = {};
            queryRequest.UserOid = data.Oid;

            const queryList = await blsCore.services.taskAndErrorService.getUserTaskAndErrorListByCriteria(queryRequest);
            const workScheduleList = await blsCore.services.taskAndErrorService.getWorkScheduleByUserOid(queryRequest);
            const priorityList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.PRIORITY);

            if (queryList && queryList.length > 0) {
                const filteredArray = queryList.filter(
                    (item1: any) => !workScheduleList.some(item2 => item1.Oid === item2.Oid),
                )
                const list = filteredArray.sort((a: any, b: any) => b.No - a.No);
                const testList = list.map(item => ({ ...item, id: item.Oid.toString() }));
                const containerList = workScheduleList.filter((x: any) => x.SendUserOid === data.Oid && x.ClosedDate <= 0);
                const listtwo = containerList.map(item => ({ ...item, id: item.Oid.toString() }));

                setPriorityList(priorityList);
                setUserTaskList([...listtwo, ...testList]);
            }
            else {
                setUserTaskList([]);
            }
        }
        else {
            setUserTaskList([]);
        }
    };

    //yapılan tüm işler tablosu
    const getUserTaskAndErrorDetailListWithDuration = async () => {
        try {
            const { data } = route.params;
            setLoading(true);
            const obj: TaskAndErrorListByCriteriaRequest = {};
            obj.UserOid = data.Oid;
            const list = await blsCore.services.taskAndErrorService.getUserTaskAndErrorDetailListWithDuration(obj);
            const priorityList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.PRIORITY);
            setAllTaskList(list.sort((a: any, b: any) => b.No - a.No));
            setPriorityList(priorityList);
        }
        catch (e) {
            setLoading(false);
        }
    };

    //bugün işleme alınan tablosu
    const getTaskAndErrorListByDate = async () => {
        try {
            const { data } = route.params;
            setLoading(true)

            const queryRequest: TaskAndErrorListByCriteriaRequest = {}

            queryRequest.UserOid = data.Oid;
            const currentDate = moment().format('DD.MM.YYYY')
            queryRequest.StartDate = convertDateToInt(currentDate, true)
            queryRequest.EndDate = convertDateToInt(currentDate, false, true)
            console.log("queryRequest", queryRequest)
            const queryList = await blsCore.services.taskAndErrorService.getTaskAndErrorListByDate(queryRequest)

            if (queryList && queryList.length > 0) {
                const list = queryList.filter((x: any) => x.StatusCode !== ParametrConstants.TASK_ERROR_STATUS).sort((a: any, b: any) => b.No - a.No)
                taskAndErrorListByDateRef.current = list;
                setDailyErrorTaskListInProcess(list)
            }
            else {
                setDailyErrorTaskListInProcess([])
            }

            setLoading(false)
        }
        catch (e) {
            console.log("error", e);
            setLoading(false)
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://img.freepik.com/free-vector/gradient-futuristic-background-with-connection-concept_23-2149104857.jpg' }}
                style={styles.backgroundImage}
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.nameText}>{dataInfo}</Text>
                    <Text style={styles.titleText}>Yazılım</Text>
                </View>

                <View style={styles.cardContainer}>
                    <Text style={styles.cardTitleText}>Şu An İncelenen Hata/Talep</Text>
                    <View style={{ alignItems: 'center', }}>
                        <View style={styles.cardField}>
                            <Text style={styles.cardFieldText}>Hata/Talep No</Text>
                            <Text style={styles.cardFieldValueText}>{taskAndErrorListInProcess.No}</Text>
                        </View>
                        <View style={styles.cardField}>
                            <Text style={styles.cardFieldText}>Hata/Talep Adı</Text>
                            <Text style={styles.cardFieldValueText}
                                numberOfLines={2}
                            >{taskAndErrorListInProcess.Title}</Text>
                        </View>
                        <View style={styles.cardField}>
                            <Text style={styles.cardFieldText}>Kurum Adı</Text>
                            <Text style={styles.cardFieldValueText}>{taskAndErrorsInProcessCompanyInfo.CompanyName}</Text>
                        </View>
                        <View style={styles.cardField}>
                            <Text style={styles.cardFieldText}>Önem Derecesi</Text>
                            <Text style={styles.cardFieldValueText}>{taskAndErrorsInProcessPriorityInfo.ParameterName}</Text>
                        </View>
                        <View style={styles.cardField}>
                            <Text style={styles.cardFieldText}>Harcanan Süre(Dk)</Text>
                            <Text style={styles.cardFieldValueText}>{taskAndErrorListInProcess.Duration}</Text>
                        </View>
                        <View style={styles.cardField}>
                            <Text style={styles.cardFieldText}>Tahmini Bitiş Tarihi</Text>
                            <Text style={styles.cardFieldValueText}>{taskAndErrorListInProcess.EstimatedFinishDate}</Text>
                        </View>
                    </View>
                </View >

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ textAlign: "center", fontSize: 20, marginBottom: 10, color: 'white' }}>Grafiksel Dağılım</Text>
                    <PieChart
                        data={[
                            { name: "Aktif Hata Sayısı", population: userStatistic.TotalActiveErrorNumber || 0, color: "#ec7063", legendFontColor: "#7F7F7F", legendFontSize: 13 },
                            { name: "Aktif Talep Sayısı", population: userStatistic.TotalActiveTaskNumber || 0, color: "#f4d03f", legendFontColor: "#7F7F7F", legendFontSize: 13 },
                            { name: "Çözülen Hata Sayısı", population: userStatistic.TotalClosedErrorNumber || 0, color: "#5dade2", legendFontColor: "#7F7F7F", legendFontSize: 13 },
                            { name: "Çözülen Talep Sayısı", population: userStatistic.TotalClosedTaskNumber || 0, color: "#52be80", legendFontColor: "#7F7F7F", legendFontSize: 13 },
                        ]}
                        width={Dimensions.get("window").width - 50}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"2"}
                        absolute
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <View style={{ flexDirection: 'column', backgroundColor: '#285A8C', width: getResponsiveSize(80), height: getResponsiveSize(80), borderRadius: getResponsiveSize(40), justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity style={styles.button} onPress={async () => {
                            await getUserTaskAndErrorListByCriteria();
                            setShowUserTaskListModal(true);
                        }}>
                            <Text style={styles.buttonText}>İş sıralaması</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'column', backgroundColor: '#285A8C', width: getResponsiveSize(80), height: getResponsiveSize(80), borderRadius: getResponsiveSize(40), justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity style={styles.button} onPress={async () => {
                            await getUserTaskAndErrorDetailListWithDuration();
                            setShowAllWorkDoneModal(true)
                        }}>
                            <Text style={styles.buttonText}>Yapılan tüm işler</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'column', backgroundColor: '#285A8C', width: getResponsiveSize(80), height: getResponsiveSize(80), borderRadius: getResponsiveSize(40), justifyContent: 'center', alignItems: 'center', }}>
                        <TouchableOpacity style={styles.button} onPress={async () => {
                            await getTaskAndErrorListByDate();
                            setShowDailyErrorTaskListInProcessModal(true);
                        }}>
                            <Text style={styles.buttonText}>Bugün İşleme Alınanlar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {ShowUserTaskListModal &&
                    <UserTaskListModal
                        closePopup={(e: boolean) => setShowUserTaskListModal(!e)}
                        userTaskListModal={userTaskList}
                        priorityInfo={priorityList}
                        statusInfo={requestStatusList}
                        personnelInfo={personnelList}
                        companyInfo={companyList}
                    />
                }
                {ShowAllWorkDoneModal &&
                    <AllWorkDoneModal
                        closePopup={(e: boolean) => setShowAllWorkDoneModal(!e)}
                        allWorkDoneModal={allTaskList}
                        priorityInfo={priorityList}
                        statusInfo={requestStatusList}
                        personnelInfo={personnelList}
                        companyInfo={companyList}
                    />
                }
                {ShowDailyErrorTaskListInProcessModal &&
                    <DailyErrorTaskListInProcessModal
                        closePopup={(e: boolean) => setShowDailyErrorTaskListInProcessModal(!e)}
                        statusInfo={requestStatusList}
                        personnelInfo={personnelList}
                        companyInfo={companyList}
                        taskAndErrorList={taskAndErrorListByDateRef.current}
                    />
                }

            </ImageBackground >
        </View >
    );
};

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
    headerContainer: { alignItems: 'center', marginTop: '8%' },
    nameText: {
        color: 'white',
        fontSize: 25,
    },
    titleText: {
        color: '#30D5C8',
        fontSize: 16,
        marginTop: 5,
    },
    cardContainer: { backgroundColor: '#D3D3D3', width: '90%', marginLeft: '5%', padding: '2%', borderRadius: getResponsiveSize(5), marginTop: '8%', marginBottom: '3%' },
    cardTitleText: { width: '100%', fontSize: getResponsiveSize(15), fontWeight: 'bold', textAlign: 'center', marginBottom: '2.5%' },
    cardField: { justifyContent: 'space-between', width: '90%', flexDirection: 'row', },
    cardFieldText: { fontWeight: 'bold', fontSize: getResponsiveSize(11) },
    cardFieldValueText: { fontSize: getResponsiveSize(11) },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%', marginLeft: '10%', marginTop: '10%' },
    button: { backgroundColor: '#D3D3D3', width: getResponsiveSize(70), height: getResponsiveSize(70), borderRadius: getResponsiveSize(35), justifyContent: 'center', alignItems: 'center', },
    buttonText: { color: '#285A8C', fontSize: getResponsiveSize(10), textAlign: 'center' },
});

export default PersonelDutyDetails;