/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle} from 'react-native-svg';
import {
  ImpInput,
  ImpSelect,
  ImpButton,
  ImpTable,
  useImpInput,
  useImpSelect,
  ImpPageContainer,
} from '../../components/BasicComponents';
import PageDimensions from '../../constants/pageDimensions';
import {getResponsiveSize} from '../../utilMethods';
import blsCore from '../../core';
import {ParametrConstants} from '../../constants/ParametrConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

function UserTaskErrorList() {
    const navigation = useNavigation();

  const [allTaskList, setAllTaskList] = useState<TaskErrorListByCriteriaResponse[]>([]);
  const [taskOrErrorList, setTaskOrErrorList] = useState<TaskErrorListByCriteriaResponse[]>([]);
  const txtTaskOrErrorNo = useImpInput({label: 'Talep/Hata No'});
  const [loading, setLoading] = useState(false);
  const slcInstitution = useImpSelect({
    label: 'Kurum Seçiniz',
    optionLabel: 'CompanyName',
    optionValue: 'Oid',
    allowBlank: false,
  });
  const slcTaskOrErrorStatus = useImpSelect({
    label: 'Hata Talep Durumu Seçiniz',
    optionLabel: 'ParameterName',
    optionValue: 'ParameterCode',
    allowBlank: false,
  });
  const slcPriority = useImpSelect({
    label: 'Önem Derecesi Seçiniz',
    optionLabel: 'ParameterName',
    optionValue: 'Oid',
    allowBlank: false,
  });

  const columnDef = [
    {
      headerName: 'No',
      headerWidth: PageDimensions.wp * 0.15,
      valueGetter: (x: any) => x.No ?? '',
    },
    {
      headerName: 'Başlık',
      headerWidth: PageDimensions.wp * 0.4,
      textAlign:'left',
      valueGetter: (x: any) => x.Title ?? '',
    },
    {
      headerName: 'Önem Derecesi',
      headerWidth: PageDimensions.wp * 0.2,
      valueGetter: (x: any) => x.Priority ?? '',
    },
    {
      headerName: 'Gözlem',
      headerWidth: PageDimensions.wp * 0.25,
      buttonConfig: {
        text: 'Gözlem',
        onPress: (selectedRow: any) => onDetailButtonClicked(selectedRow),
      },
    },
  ];

  const onDetailButtonClicked = (selectedRow: any) => {
    console.log('Selected row: ', selectedRow);
    if (selectedRow.Type === '1'){
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

  useFocusEffect(
    useCallback(() => {
      pageLoad();
    }, [])
  );

  useEffect(() => {
    pageLoad();
  }, []);

  async function pageLoad() {
    try {
      setLoading(true);
      const companyList_ = await blsCore.services.parameterService.getCompanyList();
      slcInstitution.setOptionList(
        companyList_.sort((a: any, b: any) => a - b),
      );

      const taskStatus = await blsCore.services.parameterService.getGeneralParameterList(
          ParametrConstants.TASK_ERROR_STATUS,
        );
      slcTaskOrErrorStatus.setOptionList(
        taskStatus.sort(
          (a: any, b: any) => a.ParameterName - b.ParameterName,
        ),
      );

      const priorityList = await blsCore.services.parameterService.getGeneralParameterList(ParametrConstants.PRIORITY);
      slcPriority.setOptionList(priorityList.sort((a: any, b: any) => a.ParameterName - b.ParameterName));
      await handleSearch();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('e', e);
    }
  }

  const handleSearch = async () => {
    //buradaki gibi user bağla
    try {
      const userDataSession = await AsyncStorage.getItem('UserInfo');
      let userInfo: any = {Oid: 0};
      if (userDataSession) {
        userInfo = JSON.parse(userDataSession);
      }
      const queryRequest: TaskAndErrorListByCriteriaRequest = {};
      queryRequest.UserOid = userInfo.Oid;
      const queryList = await blsCore.services.taskAndErrorService.getUserTaskAndErrorListByCriteria(queryRequest,);
      setTaskOrErrorList(queryList.sort((a: any, b: any) => b.No - a.No));
      setAllTaskList(queryList);
    } catch (e) {
      console.log('🚀 ~ handleSearch ~ e:', e);
    }
  };

  const filterListByTaskOrErrorNo = (value: any) => {
    const allDataList = allTaskList.slice();
    if (value) {
      const filteredList = allDataList.filter((x: any) =>
        x.No.toString().startsWith(value.toString()),
      );
      setTaskOrErrorList(filteredList);
    } else {
      setTaskOrErrorList(allDataList);
    }
  };

  const filterList = () => {
    try {
      const allDataList = allTaskList.slice();
      let filteredList = allDataList;

      if (slcPriority.value) {
        filteredList = allDataList.filter(
          (x: any) => x.Priority === slcPriority.value.ParameterCode,
        );
      }
      if (slcInstitution.value) {
        filteredList = allDataList.filter(
          (x: any) => x.CompanyOid === slcInstitution.value.Oid,
        );
      }
      setTaskOrErrorList(filteredList);
    } catch (e) {
      console.log('e', e);
    }
  };

  const getAllList = () => {
    setTaskOrErrorList(allTaskList);
  };
  return (
    <ImpPageContainer systemLoading={loading}>
    <LinearGradient
      colors={['#0A1F44', '#0D284E', '#0e6e49']}
      style={styles.gradientContainer}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
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
          <View style={styles.contentContainer}>
            <View style={styles.slcContainer}>
              <ImpSelect
                selectState={slcInstitution}
                searchStyle={styles.select}
              />
              <ImpInput
                inputState={txtTaskOrErrorNo}
                onChange={filterListByTaskOrErrorNo}
                width={PageDimensions.wp * 0.4}
              />
            </View>

            <View style={styles.buttonContainer}>
              <ImpButton type="clear" onPress={getAllList}>
                Temizle
              </ImpButton>
              <ImpButton type="search" onPress={filterList}>
                Filtrele
              </ImpButton>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tableContainer}>
          <ImpTable
            width={PageDimensions.wp * 0.98}
            columns={columnDef as any}
            rowsData={taskOrErrorList}
            tableHeader="Hata-Talep Listem"
            tableContainerHeight={getResponsiveSize(500)}
            tableHeight={getResponsiveSize(500)}
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
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  checkbox: {
    flex: 1,
    marginHorizontal: 5,
  },
  slcContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
    flexDirection:'row',
    display:'flex',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  select: {
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  tableContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    maxHeight: '100%',
  },
});

export default UserTaskErrorList;
