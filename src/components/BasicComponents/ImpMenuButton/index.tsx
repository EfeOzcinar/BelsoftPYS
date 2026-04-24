/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity, Image, Platform} from 'react-native';
import {
  checkListIcon,
  scheduleIcon,
  homeworkIcon,
  surveyIcon,
  announcementIcon,
  teacherIcon,
  successIcon,
  contactIcon,
  informationIcon,
  medalIcon,
  graphIcon,
  examResultIcon,
  messageIcon,
  suggestionIcon,
  bookIcon,
  attendanceIcon,
  studentsIcon,
  bookShelfIcon,
  addItemIcon,
  lessonIcon,
  readingIcon,
  nonAttendanceMenuIcon,
  curriculumIcon,
  studentsInsideClassIcon,
  assistantIcon,
  studentRatingIcon,
  profilIcon,
  informationListIcon,
  takeAttendanceIcon,
  examListIcon,
  topicDefinitionIcon,
  goalsIcon,
  studentEvaluationIcon,
  accountingIcon,
  collectedPaymentIcon,
  classBasedListIcon
} from '../../../assets/icons';

import PageDimensions from '../../../constants/pageDimensions';
import {getResponsiveSize} from '../../../utilMethods';

interface MenuProps {
  onPress?: any;
  buttonStyle?: any;
  iconStyle?: any;
  name?: string;
  type?: string;
  labelStyle?: any;
}
const MenuButton = ({
  onPress,
  buttonStyle,
  iconStyle,
  name,
  type = '',
  labelStyle,
}: MenuProps) => {
  const buttonTypes = [
    {
      type: '',
      icon: checkListIcon,
    },
    {
      type: 'schedule',
      icon: scheduleIcon,
    },
    {
      type: 'non-attendance',
      icon: checkListIcon,
    },
    {
      type: 'homework',
      icon: homeworkIcon,
    },
    {
      type: 'survey',
      icon: surveyIcon,
    },
    {
      type: 'announcement',
      icon: announcementIcon,
    },
    {
      type: 'teachers',
      icon: teacherIcon,
    },
    {
      type: 'students',
      icon: studentsIcon,
    },
    {
      type: 'success',
      icon: successIcon,
    },
    {
      type: 'contact',
      icon: contactIcon,
    },
    {
      type: 'information',
      icon: informationIcon,
    },
    {
      type: 'performance',
      icon: medalIcon,
    },
    {
      type: 'graph',
      icon: graphIcon,
    },
    {
      type: 'exam-result',
      icon: examResultIcon,
    },
    {
      type: 'message',
      icon: messageIcon,
    },
    {
      type: 'suggestion',
      icon: suggestionIcon,
    },
    {
      type: 'book',
      icon: bookIcon,
    },
    {
      type: 'attendance',
      icon: attendanceIcon,
    },
    {
      type: 'bookShelf',
      icon: bookShelfIcon,
    },
    {
      type: 'addItem',
      icon: addItemIcon,
    },
    {
      type: 'lessons',
      icon: lessonIcon,
    },
    {
      type: 'reading',
      icon: readingIcon,
    },
    {
      type: 'absenteeism',
      icon: nonAttendanceMenuIcon,
    },
    {
      type: 'curriculum',
      icon: curriculumIcon,
    },
    {
      type: 'studentsInsideClass',
      icon: studentsInsideClassIcon,
    },
    {
      type: 'assistant',
      icon: assistantIcon,
    },
    {
      type: 'studentRating',
      icon: studentRatingIcon,
    },
    {
      type: 'profil',
      icon: profilIcon,
    },
    {
      type: 'informationList',
      icon: informationListIcon,
    },
    {
      type: 'takeAttendance',
      icon: takeAttendanceIcon,
    },
    {
      type: 'examResult',
      icon: examListIcon,
    },
    {
      type: 'topicDefinition',
      icon: topicDefinitionIcon,
    },
    {
      type: 'studentGoals',
      icon: goalsIcon,
    },
    {
      type: 'studentEvaluation',
      icon: studentEvaluationIcon,
    },
    {
      type: 'accounting',
      icon: accountingIcon,
    },
    {
      type: 'collection',
      icon: collectedPaymentIcon,
    },
    {
      type: 'classBasedListIcon',
      icon: classBasedListIcon,
    },
  ];

  let buttonType = buttonTypes.find(t => t.type === type);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{...pageStyle.cardStyle, ...buttonStyle}}>
      {/* brand image */}
      <Image
        source={buttonType?.icon}
        style={{
          width: PageDimensions.wp * 0.15,
          height: PageDimensions.hp * 0.08,
          marginTop: '4%',
          ...iconStyle,
        }}
        resizeMode={'contain'}
      />
      <Text
        numberOfLines={1}
        style={{
          top: '5%',
          fontWeight: '600',
          textAlign: 'center',
          color: 'black',
          fontSize: getResponsiveSize(11),
          ...labelStyle,
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const pageStyle = {
  cardStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '45%',
    borderRadius: 5,
    marginTop: getResponsiveSize(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 10,
    marginLeft: '2.5%',
    ...Platform.select({
      ios: {
        height: getResponsiveSize(82),
      },
      android: {
        height: getResponsiveSize(82),
      },
    }),
  },
  image: {
    flex: 1,
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
};

export default MenuButton;
