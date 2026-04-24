/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Dimensions, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { convertDateToInt, convertRoleCodeToName, convertTaskStatusCodeToName, getResponsiveSize } from '../utilMethods';
import { CompanyStatisticsResponse } from '../core/Services/ParameterService/interfaces';
import blsCore from '../core';
import { ParametrConstants } from '../constants/ParametrConstants';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlsPicker, { useImpPicker } from '../components/BasicComponents/ImpPicker';
import { CARD_W, fs, QUICK_BTN_W, s, SP, vs } from '../theme/responsive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

function HomePage() {
    const navigation = useNavigation();
    const requestStatusRef = useRef<any[] | null>(null);
    const userListRef = useRef<any[] | null>(null);
    const roleListRef = useRef<any[] | null>(null);

    const slcPersonnel = useImpPicker({ label: '', placeHolder: '', optionLabel: 'FullName', optionValue: 'Oid' });

    const [taskAndErrorListInProcess, setTaskAndErrorListInProcess] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [totalOfErrorsAndTasks, setTotalOfErrorsAndTasks] = useState<any>([]);
    const [companyStatistic, setCompanyStatistic] = useState<CompanyStatisticsResponse[]>([]);
    const [dailyErrorTaskListInProcess, setDailyErrorTaskListInProcess] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [userData, setUserData] = useState<any>({});
    const [isAssignedTab, setIsAssignedTab] = useState<boolean>(true);
    const [assignedTickets, setAssignedTickets] = useState<TaskErrorListByCriteriaResponse[]>([]); // bana açılan
    const [createdTickets, setCreatedTickets] = useState<TaskErrorListByCriteriaResponse[]>([]); // benim açtığım
    const [userTaskAndErrorList, setUserTaskAndErrorList] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [queryTaskList, setQueryTaskList] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [queryErrorList, setQueryErrorList] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [openPendingError, setOpenPendingError] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [openPendingTask, setOpenPendingTask] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [lowPriorityTicket, setLowPriorityTicket] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [mediumPriorityTicket, setMediumPriorityTicket] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [highPriorityTicket, setHighPriorityTicket] = useState<TaskErrorListByCriteriaResponse[]>([]);
    const [criticalPriorityTicket, setCriticalPriorityTicket] = useState<TaskErrorListByCriteriaResponse[]>([]);

    const visibleItems = isAssignedTab ? assignedTickets : createdTickets;

    // Tipe göre ikon ve renk
    const getTypeConfig = (Type: string) => {
        if (Type === "1") return { icon: 'bug', color: '#EF4444', bgColor: '#FEE2E2' };
        return { icon: 'clipboard-text', color: '#3B82F6', bgColor: '#DBEAFE' };
    };

    // Duruma göre stil
    const getStatusStyle = (status: number) => {
        switch (status) {
            case 1: return { color: '#DC2626', bg: '#FEE2E2' };
            case 2: return { color: '#D97706', bg: '#FEF3C7' };
            case 3: return { color: '#7C3AED', bg: '#EDE9FE' };
            case 4: return { color: '#16A34A', bg: '#DCFCE7' };
            default: return { color: '#475569', bg: '#F1F5F9' };
        }
    };


    useEffect(() => {
        async function pageLoad() {
            try {

                const userDataSession = await AsyncStorage.getItem('UserInfo');
                let userInfo: any = { Oid: 0 };
                if (userDataSession) {
                    userInfo = JSON.parse(userDataSession);
                }
                setUserData(userInfo);

                const requestStatusList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.TASK_ERROR_STATUS);
                const roleList_ = await blsCore.services.parameterService.getRoleList();
                roleListRef.current = roleList_
                requestStatusRef.current = requestStatusList
                userListRef.current = await blsCore.services.authService.getUserList()

                const companyRequestsAndErrors = await blsCore.services.parameterService.getCompanyStatistics(0, 0)
                if (companyRequestsAndErrors && companyRequestsAndErrors.length > 0) {
                    const totals = companyRequestsAndErrors.reduce((acc: any, item: any) => {
                        acc.totalErrorCount += item.ErrorCount || 0
                        acc.totalResolvedErrorCount += item.ResolvedErrorCount || 0
                        acc.totalTaskCount += item.TaskCount || 0
                        acc.totalResolvedTaskCount += item.ResolvedTaskCount || 0
                        return acc
                    }, {
                        totalErrorCount: 0,
                        totalResolvedErrorCount: 0,
                        totalTaskCount: 0,
                        totalResolvedTaskCount: 0,
                    })

                    setTotalOfErrorsAndTasks(totals)
                    setCompanyStatistic(companyRequestsAndErrors)
                }

                const personnel = await blsCore.services.authService.getUserList();
                const personnelData = personnel.map(user => ({
                    ...user,
                    FullName: user.Name + " " + user.SurName,
                }));
                //console.log("personnelData", personnelData)
                slcPersonnel.setOptionList(personnelData)

                // setDeveloperStatistic(await projectManagementAndCRMCore.services.parameterServices.getDeveloperStatistics(startDate, endDate))

                const taskAndErrorsInProcess = await blsCore.services.taskAndErrorService.getTaskAndErrorListInProcess()
                setTaskAndErrorListInProcess(taskAndErrorsInProcess)
                await getTaskAndErrorListByDate(moment().format('DD.MM.YYYY'), taskAndErrorsInProcess)

                const queryRequest: TaskAndErrorListByCriteriaRequest = {}
                queryRequest.UserOid = userInfo.Oid
                const queryList = await blsCore.services.taskAndErrorService.getUserTaskAndErrorListByCriteria(queryRequest)
                const UserTaskAndErrorList = await blsCore.services.taskAndErrorService.getActiveErrorsAndTasksListByCreatedUser(queryRequest);

                setQueryErrorList(queryList.filter(x => x.Type === "1" && (x.StatusCode === 1 || x.StatusCode === 2 || x.StatusCode === 3)));
                setOpenPendingError(queryList.filter(x => x.Type === "1" && x.StatusCode === 1));

                setQueryTaskList(queryList.filter(x => x.Type === "2" && (x.StatusCode == 1 || x.StatusCode == 2 || x.StatusCode == 3)));
                setOpenPendingTask(queryList.filter(x => x.Type === "2" && x.StatusCode == 1));

                setAssignedTickets(queryList.filter(x => x.StatusCode === 1 || x.StatusCode === 2 || x.StatusCode === 3).sort((a, b) => b.CreatedDate - a.CreatedDate).slice(0, 5))
                setCreatedTickets(UserTaskAndErrorList.sort((a, b) => b.CreatedDate - a.CreatedDate).slice(0, 5))

                setLowPriorityTicket(queryList.filter(x => (x.StatusCode === 1 || x.StatusCode === 2 || x.StatusCode === 3) && x.Priority === "1")); // düşük
                setMediumPriorityTicket(queryList.filter(x => (x.StatusCode === 1 || x.StatusCode === 2 || x.StatusCode === 3) && x.Priority === "2")); // normal
                setHighPriorityTicket(queryList.filter(x => (x.StatusCode === 1 || x.StatusCode === 2 || x.StatusCode === 3) && x.Priority === "3")); // yüksek
                setCriticalPriorityTicket(queryList.filter(x => (x.StatusCode === 1 || x.StatusCode === 2 || x.StatusCode === 3) && x.Priority === "4")); // kritik
            }
            catch (e) {
                //setLoading(false)
            }
        }
        pageLoad();
    }, []);

    const getPercent = (count: number) => {
        const total =
            lowPriorityTicket.length +
            mediumPriorityTicket.length +
            highPriorityTicket.length +
            criticalPriorityTicket.length;

        if (total === 0) return 0;

        return (count / total) * 100;
    };

    const getTaskAndErrorListByDate = async (startDate: string, taskAndErrorsInProcess: TaskErrorListByCriteriaResponse[]) => {
        try {

            const queryRequest: TaskAndErrorListByCriteriaRequest = {}

            queryRequest.UserOid = 0

            queryRequest.StartDate = convertDateToInt(startDate, true)
            queryRequest.EndDate = convertDateToInt(startDate, false, true)

            const queryList = await blsCore.services.taskAndErrorService.getTaskAndErrorListByDate(queryRequest)

            if (queryList && queryList.length > 0) {
                if (startDate === moment().format('DD.MM.YYYY')) {
                    const newList: any[] = [...taskAndErrorsInProcess, ...queryList]
                    const list = newList.filter((x: any) => x.StatusCode !== ParametrConstants.TASK_STATUS_PENDING).sort((a: any, b: any) => b.No - a.No)
                    const uniqueArray = list.reduce((acc, current) => {
                        // Check if the current oid already exists in the accumulator array
                        if (!acc.some((item: any) => item.Oid === current.Oid)) {
                            acc.push(current)
                        }
                        return acc
                    }, [])
                    setDailyErrorTaskListInProcess(uniqueArray)
                }
                else {
                    const list = queryList.filter((x: any) => x.StatusCode !== ParametrConstants.TASK_STATUS_PENDING).sort((a: any, b: any) => b.No - a.No)
                    setDailyErrorTaskListInProcess(list)
                }
            }
            else {
                setDailyErrorTaskListInProcess([])
            }
        }
        catch (e) {
            // setLoading(false)
        }
    };

    const handleSelectedPersonelDutyDetails = (item: any) => {
        console.log("item", item)
        navigation.navigate({
            name: 'PersonelDutyDetails',
            params: {
                data: item,
            },
            merge: true,
        } as never);
    };

    const summaryData = {
        myActiveTasks: 12,
        myResolvedTasks: 45,
        totalOpenCompanyRequests: 87,
    };

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetingText} allowFontScaling={false}>Merhaba, {userData?.Name}</Text>
                        <Text style={styles.subGreetingText} allowFontScaling={false}>
                            {convertRoleCodeToName(userData.RoleCode, roleListRef.current)}
                        </Text>
                    </View>
                    <View style={styles.notificationBtn}>
                        <View style={styles.pickerContainer}>
                            <BlsPicker
                                selectState={slcPersonnel}
                                onChange={handleSelectedPersonelDutyDetails}
                                containerStyle={{ borderWidth: 0 }}
                                width={getResponsiveSize(35)}
                            />
                        </View>
                        <Icon
                            name="account-search-outline"
                            size={24}
                            color="#334155"
                            style={styles.iconFront}
                        />
                        <View style={styles.badge} />

                    </View>
                </View>

                {/* DURUM ÖZETİ */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitleNoPadding} allowFontScaling={false}>Durum Özeti</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={async () => { console.log("setAssignedTickets", assignedTickets) }}>
                            <Text style={styles.seeAllText} allowFontScaling={false}>Detay</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScrollCompact}>
                        <TouchableOpacity activeOpacity={0.9} onPress={() =>
                            navigation.navigate({
                                name: 'UserTaskErrorList',
                                params: {
                                    data: queryErrorList,
                                },
                                merge: true,
                            } as never)}>
                            <LinearGradient colors={['#10b981', '#059669']} style={[styles.summaryCardCompact, { marginRight: 12 }]}>
                                <View style={styles.cardHeaderCompact}>
                                    <Icon name="briefcase-account-outline" size={22} color="#fff" />
                                    <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.7)" />
                                </View>
                                <Text style={styles.cardNumberCompact} allowFontScaling={false}>{queryErrorList.length}</Text>
                                <Text style={styles.cardLabelCompact} allowFontScaling={false}>Üzerimdeki Açık Hatalar</Text>
                                <Text style={styles.cardSubLabelCompact} allowFontScaling={false}>{openPendingError.length} Beklemede Olan Hatalar</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.9} onPress={() =>
                            navigation.navigate({
                                name: 'UserTaskErrorList',
                                params: {
                                    data: queryErrorList,
                                },
                                merge: true,
                            } as never)}>
                            <LinearGradient colors={['#6366f1', '#4f46e5']} style={[styles.summaryCardCompact, { marginRight: 12 }]}>
                                <View style={styles.cardHeaderCompact}>
                                    <Icon name="briefcase-account-outline" size={22} color="#fff" />
                                    <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.7)" />
                                </View>
                                <Text style={styles.cardNumberCompact} allowFontScaling={false}>{queryTaskList.length}</Text>
                                <Text style={styles.cardLabelCompact} allowFontScaling={false}>Üzerimdeki Açık Talepler</Text>
                                <Text style={styles.cardSubLabelCompact} allowFontScaling={false}>{openPendingTask.length} Beklemede Olan Talepler</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.9}>
                            <LinearGradient
                                colors={['#f97316', '#ea580c']}
                                style={[styles.summaryCardCompact, { marginRight: 12 }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.cardHeaderCompact}>
                                    <Icon name="domain" size={22} color="#fff" />
                                    <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.7)" />
                                </View>
                                <Text style={styles.cardNumberCompact} allowFontScaling={false}>{summaryData.totalOpenCompanyRequests}</Text>
                                <Text style={styles.cardLabelCompact} allowFontScaling={false}>Kurum Açık</Text>
                                <Text style={styles.cardSubLabelCompact} allowFontScaling={false}>Müdahale bekliyor</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.9} onPress={() => { }}>
                            <LinearGradient
                                colors={['#0ea5e9', '#0284c7']}
                                style={styles.summaryCardCompact}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.cardHeaderCompact}>
                                    <Icon name="calendar-clock-outline" size={22} color="#fff" />
                                    <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.7)" />
                                </View>

                                <Text style={styles.cardLabelCompact} allowFontScaling={false}>Yaklaşan</Text>

                                <View style={styles.upcomingMiniRow}>
                                    <Icon name="calendar-check-outline" size={16} color="rgba(255,255,255,0.95)" />
                                    <Text style={styles.upcomingMiniText} numberOfLines={1} allowFontScaling={false}>
                                        Belediye Eğitim Planı • Yarın 10:00
                                    </Text>
                                </View>

                                <View style={[styles.upcomingMiniRow, { marginTop: 8 }]}>
                                    <Icon name="account-group-outline" size={16} color="rgba(255,255,255,0.95)" />
                                    <Text style={styles.upcomingMiniText} numberOfLines={1} allowFontScaling={false}>
                                        Haftalık Koordinasyon • Cuma 14:30
                                    </Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* HIZLI İŞLEMLER */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle} allowFontScaling={false}>Hızlı İşlemler</Text>
                    <View style={styles.gridContainer}>
                        {[
                            {
                                id: '1', name: 'Yeni Talep', icon: 'plus-circle-outline', color: '#4f46e5', bg: '#e0e7ff', onPress: () => navigation.navigate({
                                    name: 'TaskEntry',
                                    merge: true,
                                } as never)
                            },
                            {
                                id: '2', name: 'Yeni Hata', icon: 'plus-circle-outline', color: '#dc2626', bg: '#fee2e2', onPress: () => navigation.navigate({
                                    name: 'ErrorEntry',
                                    merge: true,
                                } as never)
                            },
                            {
                                id: '3', name: 'Bana İletilenler', icon: 'clipboard-list-outline', color: '#16a34a', bg: '#dcfce7', onPress: () => navigation.navigate({
                                    name: 'UserTaskErrorList',
                                    merge: true,
                                } as never)
                            },
                            { id: '4', name: 'Benim İlettiklerim', icon: 'send-outline', color: '#9333ea', bg: '#f3e8ff' },
                            {
                                id: '5', name: 'Kurum Bazlı', icon: 'office-building-outline', color: '#ca8a04', bg: '#fef08a', onPress: () => navigation.navigate({
                                    name: 'TaskErrorListBasedCompany',
                                    merge: true,
                                } as never)
                            },
                            {
                                id: '6', name: 'Tüm Liste', icon: 'view-dashboard-outline', color: '#ea580c', bg: '#ffedd5', onPress: () => navigation.navigate({
                                    name: 'AllTaskErrorList',
                                    merge: true,
                                } as never)
                            },
                            {
                                id: '7',
                                name: 'Çağrı Merkezi',
                                icon: 'phone-outline',
                                color: '#0ea5e9',
                                bg: '#e0f2fe',
                                onPress: () => navigation.navigate({
                                    name: 'CallCenter',
                                    merge: true,
                                } as never)
                            },
                            // { id: '7', name: 'Raporlar', icon: 'chart-box-outline', color: '#0284c7', bg: '#e0f2fe' },
                            // {
                            //     id: '8', name: 'Profil', icon: 'account-circle-outline', color: '#0f766e', bg: '#ccfbf1', onPress: () => navigation.navigate({
                            //         name: 'Profile',
                            //         merge: true,
                            //     } as never)
                            // },
                            // { id: '9', name: 'Çıkış', icon: 'logout', color: '#334155', bg: '#e2e8f0', onPress: () => navigation.navigate('Çıkış' as never) },
                        ].map((item) => (
                            <TouchableOpacity key={item.id} style={styles.actionButton} onPress={item.onPress} activeOpacity={0.7}>
                                <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                                    <Icon name={item.icon} size={28} color={item.color} />
                                </View>
                                <Text style={styles.actionText} allowFontScaling={false}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Son 5 KAYITLAR */}
                <View style={[styles.section, { paddingHorizontal: 24 }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitleNoPadding} allowFontScaling={false}>Son 5 Kayıt</Text>

                        <View style={styles.segmentWrap}>
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => setIsAssignedTab(true)}
                                style={[styles.segmentBtn, isAssignedTab && styles.segmentBtnActive]}
                            >
                                <Text style={[styles.segmentText, isAssignedTab && styles.segmentTextActive]} allowFontScaling={false}>
                                    Bana Açılan
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => setIsAssignedTab(false)}
                                style={[styles.segmentBtn, !isAssignedTab && styles.segmentBtnActive]}
                            >
                                <Text style={[styles.segmentText, !isAssignedTab && styles.segmentTextActive]} allowFontScaling={false}>
                                    Benim Açtıklarım
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.recentListContainer}>
                        {visibleItems.map((item, idx) => {
                            const typeConfig = getTypeConfig(item.Type);
                            const statusStyle = getStatusStyle(item.StatusCode);

                            return (
                                <TouchableOpacity
                                    key={item.Oid}
                                    style={[styles.recentItemCard, idx === visibleItems.length - 1 && { borderBottomWidth: 0 }]}
                                    activeOpacity={0.7}
                                    onPress={() => onDetailButtonClicked(item)}
                                >
                                    <View style={[styles.recentItemIcon, { backgroundColor: typeConfig.bgColor }]}>
                                        <Icon name={typeConfig.icon} size={20} color={typeConfig.color} />
                                    </View>

                                    <View style={styles.recentItemInfo}>
                                        <Text style={styles.recentItemTitle} numberOfLines={1} allowFontScaling={false}>
                                            {item.Title}
                                        </Text>
                                        {/* <Text style={styles.recentItemCompany} numberOfLines={1} allowFontScaling={false}>
                                            {item.company}
                                        </Text> */}
                                    </View>

                                    <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                                        <Text style={[styles.statusPillText, { color: statusStyle.color }]} allowFontScaling={false}>
                                            {convertTaskStatusCodeToName(item.StatusCode, requestStatusRef.current)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ÖNCELİK DAĞILIMI */}
                <View style={[styles.section, { paddingHorizontal: 24 }]}>
                    <Text style={styles.sectionTitleNoPadding} allowFontScaling={false}>Öncelik Dağılımı</Text>
                    <View style={styles.recentListContainer}>

                        <View style={styles.priorityRow}>
                            <Text style={styles.priorityText} allowFontScaling={false}>Kritik</Text>
                            <View style={styles.priorityBarBg}>
                                <View style={[styles.priorityBar, { width: `${getPercent(criticalPriorityTicket.length)}%`, backgroundColor: '#DC2626' }]} />
                            </View>
                        </View>

                        <View style={styles.priorityRow}>
                            <Text style={styles.priorityText} allowFontScaling={false}>Yüksek</Text>
                            <View style={styles.priorityBarBg}>
                                <View style={[styles.priorityBar, { width: `${getPercent(highPriorityTicket.length)}%`, backgroundColor: '#F97316' }]} />
                            </View>
                        </View>

                        <View style={styles.priorityRow}>
                            <Text style={styles.priorityText} allowFontScaling={false}>Normal</Text>
                            <View style={styles.priorityBarBg}>
                                <View style={[styles.priorityBar, { width: `${getPercent(mediumPriorityTicket.length)}%`, backgroundColor: '#4F46E5' }]} />
                            </View>
                        </View>

                        <View style={styles.priorityRow}>
                            <Text style={styles.priorityText} allowFontScaling={false}>Düşük</Text>
                            <View style={styles.priorityBarBg}>
                                <View style={[styles.priorityBar, { width: `${getPercent(lowPriorityTicket.length)}%`, backgroundColor: '#22C55E' }]} />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView >
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#E5E7E9',
        height: getResponsiveSize(40),
        marginTop: '2%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: getResponsiveSize(5),
        justifyContent: 'space-around',
        opacity: 0.9,
    },
    headerIconCard: {
        justifyContent: 'center', alignItems: 'center', display: 'flex',
        backgroundColor: 'white',
        padding: '1.5%',
        borderRadius: 100,
        borderWidth: 0.5,
    },
    headerIcon: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    iconFront: {
        position: "absolute",
        zIndex: 1
    },
    pickerContainer: {
        position: "absolute",
        zIndex: 10
    },
    logoContainer: {
        backgroundColor: 'transparent',
        width: '100%',
        position: 'absolute',
        top: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    transparentView: {
        backgroundColor: 'white',
        opacity: .9,
        width: height * 0.16,
        height: height * 0.16,
        borderRadius: 20
    },
    logo: {
        height: height * 0.15,
        width: width * 0.3,
        position: 'absolute'
    },
    welcomeText: {
        color: 'white',
        fontSize: 18,
    },
    nameText: {
        color: 'white',
        fontSize: 25,
    },
    titleText: {
        color: '#30D5C8',
        fontSize: 16,
        marginTop: 5,
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        backgroundColor: '#E5E7E9',
        width: width * 0.95,
        margin: '2.5%',
        borderRadius: getResponsiveSize(5),
        padding: '2%',
    },
    card: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: width * 0.22,
        height: width * 0.2,
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 40,
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
    },
    tableContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        //marginTop: 10,
        marginBottom: '5%',
        maxHeight: getResponsiveSize(180),
        height: getResponsiveSize(180),
    },
    iconButtonContainer: {
        backgroundColor: '#F39C12',
        borderRadius: getResponsiveSize(5),
        height: getResponsiveSize(45),
        position: 'absolute',
        bottom: getResponsiveSize(65),
        width: width * 0.95,
        marginLeft: '2.5%',
        zIndex: 99999,
    },
    iconButtonCard: { flexDirection: 'row', display: 'flex', width: '100%' },
    iconButton: { width: '33%', height: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' },
    iconButtonText: { textAlign: 'center', fontWeight: 'bold', fontSize: getResponsiveSize(12) },

    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        paddingBottom: vs(40),
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SP.page,
        paddingTop: vs(20),
        paddingBottom: vs(10),
    },

    greetingText: {
        fontSize: fs(24),
        fontWeight: '700',
        color: '#0F172A',
    },
    subGreetingText: {
        fontSize: fs(14),
        color: '#64748B',
        marginTop: vs(4),
    },

    notificationBtn: {
        width: s(48),
        height: s(48),
        borderRadius: s(24),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: vs(2) },
        shadowOpacity: 0.05,
        shadowRadius: s(10),
        elevation: Platform.OS === 'android' ? 2 : 0,
    },
    badge: {
        position: 'absolute',
        top: s(12),
        right: s(12),
        width: s(10),
        height: s(10),
        borderRadius: s(5),
        backgroundColor: '#EF4444',
        borderWidth: s(2),
        borderColor: '#FFFFFF',
        zIndex: 999999,
    },

    // ✅ global spacing standardı
    section: {
        marginTop: SP.sectionTop,
        paddingHorizontal: SP.page,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(16),
    },

    sectionTitle: {
        fontSize: fs(18),
        fontWeight: '600',
        color: '#334155',
        marginBottom: vs(16),
    },
    sectionTitleNoPadding: {
        fontSize: fs(18),
        fontWeight: '600',
        color: '#334155',
    },
    seeAllText: {
        fontSize: fs(14),
        fontWeight: '700',
        color: '#4F46E5',
    },

    // --- ÖZET KARTLARI (KOMPAKT) ---
    cardsScrollCompact: {
        paddingBottom: vs(8),
    },
    summaryCardCompact: {
        width: CARD_W,
        height: vs(160),
        padding: SP.cardPad,
        borderRadius: SP.rLg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: vs(8) },
        shadowOpacity: 0.12,
        shadowRadius: s(10),
        elevation: Platform.OS === 'android' ? 4 : 0,
    },
    cardHeaderCompact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    cardNumberCompact: {
        fontSize: fs(30),
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: vs(2),
    },
    cardLabelCompact: {
        fontSize: fs(14),
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: vs(6),
    },
    cardSubLabelCompact: {
        fontSize: fs(12),
        color: 'rgba(255, 255, 255, 0.85)',
        marginTop: vs(6),
    },
    upcomingMiniRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SP.gapSm,
    },
    upcomingMiniText: {
        flex: 1,
        fontSize: fs(12),
        fontWeight: '600',
        color: 'rgba(255,255,255,0.92)',
    },

    // --- HIZLI İŞLEMLER ---
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: vs(18),
    },
    actionButton: {
        width: QUICK_BTN_W,
        alignItems: 'center',
    },
    iconContainer: {
        width: s(64),
        height: s(64),
        borderRadius: s(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    actionText: {
        fontSize: fs(13),
        fontWeight: '600',
        color: '#475569',
        textAlign: 'center',
    },

    // --- TAB (SEGMENT) ---
    segmentWrap: {
        flexDirection: 'row',
        backgroundColor: '#EEF2FF',
        borderRadius: s(999),
        padding: s(4),
        gap: s(6),
        borderWidth: s(1),
        borderColor: '#E0E7FF',
    },
    segmentBtn: {
        paddingHorizontal: s(12),
        paddingVertical: vs(8),
        borderRadius: s(999),
    },
    segmentBtnActive: {
        backgroundColor: '#4F46E5',
    },
    segmentText: {
        fontSize: fs(12),
        fontWeight: '800',
        color: '#4F46E5',
    },
    segmentTextActive: {
        color: '#FFFFFF',
    },

    // --- LİSTE ---
    recentListContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: SP.rMd,
        paddingVertical: vs(8),
        paddingHorizontal: s(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: vs(4) },
        shadowOpacity: 0.03,
        shadowRadius: s(10),
        elevation: Platform.OS === 'android' ? 2 : 0,
        padding: SP.cardPad,
        marginTop: vs(12),
    },
    recentItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(12),
        paddingHorizontal: s(12),
        borderBottomWidth: s(1),
        borderBottomColor: '#F1F5F9',
    },
    recentItemIcon: {
        width: s(40),
        height: s(40),
        borderRadius: SP.rSm,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: s(12),
    },
    recentItemInfo: {
        flex: 1,
        marginRight: s(8),
    },
    recentItemTitle: {
        fontSize: fs(14),
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: vs(4),
    },
    recentItemCompany: {
        fontSize: fs(12),
        color: '#64748B',
    },
    statusPill: {
        paddingHorizontal: s(10),
        paddingVertical: vs(6),
        borderRadius: s(12),
    },
    statusPillText: {
        fontSize: fs(11),
        fontWeight: '800',
    },

    // --- CHART ---
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: SP.rMd,
        padding: SP.cardPad,
        marginTop: vs(12),
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: s(8),
        elevation: Platform.OS === 'android' ? 2 : 0,
    },
    chartBarsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    chartBarContainer: {
        alignItems: 'center',
        flex: 1,
    },
    chartBar: {
        width: s(14),
        backgroundColor: '#4F46E5',
        borderRadius: s(6),
    },
    chartLabel: {
        marginTop: vs(6),
        fontSize: fs(10),
        color: '#64748B',
    },

    // --- PRIORITY ---
    priorityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: SP.rMd,
        padding: SP.cardPad,
        marginTop: vs(12),
    },
    priorityRow: {
        marginBottom: vs(12),
    },
    priorityText: {
        fontSize: fs(12),
        fontWeight: '700',
        color: '#334155',
        marginBottom: vs(6),
    },
    priorityBarBg: {
        height: vs(8),
        backgroundColor: '#F1F5F9',
        borderRadius: s(4),
    },
    priorityBar: {
        height: vs(8),
        borderRadius: s(4),
    },
});

export default HomePage;
