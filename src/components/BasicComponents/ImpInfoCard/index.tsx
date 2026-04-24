/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, Text, View } from 'react-native';
import {
    accrumentIcon,
    accrumentSummaryIcon,
    classBasedListIcon,
    collectedPaymentIcon,
    controlHomeworkIcon,
    controlHomeworkListIcon,
    curriculumAddIcon,
    curriculumObservationIcon,
    editAttendanceIcon,
    examListIcon,
    graphIcon,
    homeworkIcon,
    informationListIcon,
    lateDebtIcon,
    medalIcon,
    nonAttendanceMenuIcon,
    questionResultsIcon,
    resultsIcon,
    studentRatingIcon,
    submitHomeworkIcon,
    takeAttendanceIcon,
} from '../../../assets/icons';
import {
    attendanceHistory,
    classHomework,
    examAnxiety,
    individualHomework,
    psikoTest,
    studentSchedule,
    teacherAnalysis,
    teacherSchedule,
} from '../../../assets/images';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';
import { getResponsiveSize } from '../../../utilMethods';

interface RouteCardProps {
    onPress?: any;
    buttonStyle?: any;
    iconBgColor?: string;
    name?: string;
    icon?: any;
    imageStyle?: any;
    imageContainerStyle?: any;
    children?: any;
}

function ImpInfoCard({
    buttonStyle,
    iconBgColor = 'orange',
    name = 'Menu',
    icon = 'psiko-test',
    imageStyle,
    imageContainerStyle,
    children,
}: RouteCardProps) {
    const buttonTypes = [
        {
            type: 'psiko-test',
            icon: psikoTest,
        },
        {
            type: 'exam-anxiety',
            icon: examAnxiety,
        },
        {
            type: 'exam-graph',
            icon: graphIcon,
        },
        {
            type: 'teacher-analysis',
            icon: teacherAnalysis,
        },
        {
            type: 'student-schedule',
            icon: studentSchedule,
        },
        {
            type: 'teacher-schedule',
            icon: teacherSchedule,
        },
        {
            type: 'take-attendance',
            icon: takeAttendanceIcon,
        },
        {
            type: 'edit-attendance',
            icon: editAttendanceIcon,
        },
        {
            type: 'history-attendance',
            icon: attendanceHistory,
        },
        {
            type: 'homework',
            icon: homeworkIcon,
        },
        {
            type: 'exam-result',
            icon: examListIcon,
        },
        {
            type: 'student-information',
            icon: informationListIcon,
        },
        {
            type: 'individualHomework',
            icon: individualHomework,
        },
        {
            type: 'classHomework',
            icon: classHomework,
        },
        {
            type: 'submitHomework',
            icon: submitHomeworkIcon,
        },
        {
            type: 'controlHomework',
            icon: controlHomeworkIcon,
        },
        {
            type: 'homeworkControl',
            icon: controlHomeworkListIcon,
        },
        {
            type: 'curriculumAdd',
            icon: curriculumAddIcon,
        },
        {
            type: 'curriculumObservation',
            icon: curriculumObservationIcon,
        },
        {
            type: 'studentRating',
            icon: studentRatingIcon,
        },
        {
            type: 'testResults',
            icon: questionResultsIcon,
        },
        {
            type: 'testAnalysis',
            icon: resultsIcon,
        },
        {
            type: 'nonAttendance',
            icon: nonAttendanceMenuIcon,
        },
        {
            type: 'performance',
            icon: medalIcon,
        },
        {
            type: 'classBasedList',
            icon: classBasedListIcon,
        },
        {
            type: 'accrument',
            icon: accrumentIcon,
        },
        {
            type: 'collectedPayment',
            icon: collectedPaymentIcon,
        },
        {
            type: 'late-debt',
            icon: lateDebtIcon,
        },
        {
            type: 'accrument-summary',
            icon: accrumentSummaryIcon,
        },
    ];

    let buttonType = buttonTypes.find(t => t.type === icon);
    const { themeColor } = useAppContext();

    return (
        <View>
            <View
                style={{
                    ...pageStyle.cardStyle,
                    ...buttonStyle,
                }}>
                <View
                    style={{
                        backgroundColor: iconBgColor,
                        borderRadius: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        ...imageContainerStyle,
                    }}>
                    <Image
                        source={buttonType?.icon}
                        resizeMode="contain"
                        style={{
                            width: PageDimensions.wp * 0.3,
                            height: getResponsiveSize(60),
                            ...imageStyle,
                        }}
                    />
                </View>
                <View
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        height: getResponsiveSize(55),
                    }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: themeColor.black30,
                            fontSize: getResponsiveSize(12),
                        }}>
                        {name}
                    </Text>
                    <Text style={{ marginTop: '4%' }}>{children}</Text>
                </View>
                <View />
            </View>
        </View>
    );
}

const pageStyle = {
    cardStyle: {
        borderRadius: 10,
        height: getResponsiveSize(130),
        width: getResponsiveSize(114),
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12.32,
        elevation: 12,
        backgroundColor: '#fff',
    },
    image: {
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        justifyContent: 'center',
    },
};

export default ImpInfoCard;
