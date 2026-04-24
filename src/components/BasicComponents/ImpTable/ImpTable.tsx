/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import PageDimensions from '../../../constants/pageDimensions';
import { useAppContext } from '../../../context/AppContext';
import { Checkbox, Text, View } from 'react-native-ui-lib';
import { FlatList } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ColumnsProps {
  headerName: string;
  headerWidth?: number;
  headerHeight?: number;
  width?: number;
  field?: any;
  tableHeader?: string;
  rowIndexGetter?: (item: any) => any;
  valueGetter?: (item: any) => any;
  buttonConfig?: {
    text: string;
    icon: any;
    onPress: (item: any) => void;
  };
  textAlign?:'center' | 'left' | 'right';
  checkboxField?: any;
}


interface ImpTableProps {
  width?: number;
  tableContainerHeight?: number;
  tableContainerStyle?: any;
  tableHeader?: string;
  tableHeaderStyle?: any;
  columns: ColumnsProps[];
  rowsData: any[];
  onRowClick?: (item: any) => void;
  selectedRowIndex?: number;
  tableHeight?: any;
  tableStyle?: any;
  ref?: MutableRefObject<any>; 
  onEndReached?:any;
  onEndReachedThreshold?:any;
  ListFooterComponent?:any

}
const ImpTable = forwardRef((props: ImpTableProps, ref) => {
  const {
    width = PageDimensions.wp * 0.95,
    tableContainerHeight = PageDimensions.hp * 0.37,
    tableContainerStyle,
    tableStyle,
    tableHeader = 'Default name',
    tableHeaderStyle,
    columns,
    rowsData,
    onRowClick,
    selectedRowIndex = -1,
    tableHeight = PageDimensions.hp * 0.27,
    onEndReached,
    onEndReachedThreshold,
    ListFooterComponent,
  } = props;

  const { themeColor } = useAppContext();
  const [checkboxStates, setCheckboxStates] = useState<Array<Array<boolean>>>(() =>
    rowsData.map((rowData) => columns.map((column) => !!rowData[column.checkboxField]))
  );

  useEffect(() => {
    if (rowsData.length > 0 && columns.length > 0) {
      const initialCheckboxStates = rowsData.map((rowData) => (
        columns.map((column) => !!rowData[column.checkboxField])
      ));
      setCheckboxStates(initialCheckboxStates);
    }
  }, [rowsData, columns]);
  

  const toggleCheckboxState = (rowIndex: number, checkboxIndex: number) => {
    setCheckboxStates((prevStates: any) => {
      const newCheckboxStates = [...prevStates];
      const newRowCheckboxStates = [...newCheckboxStates[rowIndex]];

      // Toggle the state of the clicked checkbox
      newRowCheckboxStates[checkboxIndex] = !newRowCheckboxStates[checkboxIndex];

      // If the clicked checkbox is now true, set all other checkboxes in the row to false
      if (newRowCheckboxStates[checkboxIndex]) {
        newRowCheckboxStates.forEach((state, index) => {
          if (index !== checkboxIndex) {
            newRowCheckboxStates[index] = false;
          }
        });
      }

      newCheckboxStates[rowIndex] = newRowCheckboxStates;
      return newCheckboxStates;
    });
  };

  const getSelectedRowsData = () => {
    const selectedRowsData: { rowData: any; checkboxFields: string }[] = [];
  
    rowsData.forEach((rowData: any, rowIndex: number) => {
      let checkedFields: string = '';
      columns.forEach((column: ColumnsProps, columnIndex: number) => {
        if (checkboxStates[rowIndex][columnIndex]) {
          checkedFields += column.checkboxField + ', ';
        }
      });
  
      checkedFields = checkedFields.trim().slice(0, -1);
  
      selectedRowsData.push({ rowData, checkboxFields: checkedFields });
    });
  
    return selectedRowsData;
  };
  
  
  

  const getCellValue = (rowData: any, column: ColumnsProps, rowIndex: number) => {
    if (column.rowIndexGetter) {
      return column.rowIndexGetter(rowIndex);
    } else if (column.valueGetter) {
      return column.valueGetter(rowData);
    } else {
      return rowData[column.field];
    }
  };

  const renderItem = ({ item, index }: any) => (
    <View
      key={index}
      style={{
        width: item.headerWidth ? item.headerWidth : PageDimensions.wp * 0.2,
        height: item.headerHeight ? item.headerHeight : PageDimensions.hp * 0.045,
        justifyContent: 'center',
        borderColor: themeColor.inputBorderColor,
        borderWidth: 0.5,
        backgroundColor: themeColor.white,
      }}>
      <Text
        style={{
          fontSize: PageDimensions.hp * 0.016,
          fontWeight: '500',
          textAlign: 'center',
        }}>
        {item.headerName}
      </Text>
    </View>
  );

  const renderRowItem = (rowData: any, rowIndex: number) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', backgroundColor: selectedRowIndex === rowIndex ? '#FDF5F2' : themeColor.white }}
      onPress={(e) => {
        e.stopPropagation(); // Stop
        onRowClick && onRowClick(rowData);
      }}>
      {columns.map((column, index) => (
        <View
          key={index}
          style={{
            width: column.headerWidth ? column.headerWidth : PageDimensions.wp * 0.2,
            height: PageDimensions.hp * 0.045,
            justifyContent: 'center',
            borderColor: themeColor.inputBorderColor,
            borderWidth: 1,
            alignItems: 'center',
          }}>
          {column.checkboxField && (
            <View style={{ marginTop: PageDimensions.hp * 0.022 }}>
              <Checkbox
                value={checkboxStates[rowIndex] ? checkboxStates[rowIndex][index] : !!rowData[column.checkboxField]}
                onValueChange={() => toggleCheckboxState(rowIndex, index)} 
                style={{ borderRadius: PageDimensions.hp * 0.007 }}
              />
            </View>
          )}
          {column.buttonConfig ? (
            <TouchableOpacity
              onPress={() => column.buttonConfig?.onPress(rowData)}
              style={{
                backgroundColor: column.buttonConfig.icon ? "transparent" : themeColor.activeDayCard,
                height: PageDimensions.hp * 0.03,
                width: PageDimensions.hp * 0.08,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: PageDimensions.hp * 0.008,
              }}>
              <Text style={{ color: themeColor.white, fontSize: PageDimensions.hp * 0.016, fontWeight: '600' }}>
                {column.buttonConfig.text}
              </Text>

              {
                column.buttonConfig.icon && 
                <Icon name={column.buttonConfig.icon} size={20} color="red" style={{marginTop: PageDimensions.hp * -0.02}} />
              }
            </TouchableOpacity>
          ) : (
            // Otherwise, text
            <Text
              style={{
                fontSize: PageDimensions.hp * 0.016,
                fontWeight: '500',
                textAlign: column.textAlign ?? 'center',
              }}>
              {getCellValue(rowData, column, rowIndex)}
            </Text>
          )}
        </View>
      ))}
    </TouchableOpacity>
  );

  useImperativeHandle(ref, () => ({
    getSelectedRowsData: () => getSelectedRowsData(),
  }));

  return (
    <View
      style={{
        width: width,
        height: tableContainerHeight,
        marginTop: PageDimensions.hp * 0.01,
        backgroundColor: themeColor.smokeWhite,
        borderColor: themeColor.smokeWhite,
        elevation: 8,
        borderRadius: PageDimensions.hp * 0.01,
        ...tableContainerStyle,
      }}>
      <View style={{ width: PageDimensions.wp * 0.8, marginTop: PageDimensions.hp * 0.01 }}>
        <Text
          style={{
            fontSize: PageDimensions.hp * 0.018,
            fontWeight: '700',
            marginLeft: PageDimensions.wp * 0.02,
            color: themeColor.mainBackgroundColor,
            ...tableHeaderStyle,
          }}>
          {`${tableHeader}`}
        </Text>
      </View>

      {/* Render Headers */}
      <View
        style={{
          width: width,
          height: PageDimensions.hp * 0.045,
          backgroundColor: 'red',
          marginTop: PageDimensions.hp * 0.01,
          marginRight: PageDimensions.wp * 0.04,
        }}>
        <FlatList data={columns} renderItem={renderItem} horizontal={true} showsHorizontalScrollIndicator={false} />
      </View>

      {/* Render Rows */}
      <View
        style={{
          width: width,
          height: tableHeight,
          backgroundColor: themeColor.smokeWhite,
          borderColor: themeColor.inputBorderColor,
          borderWidth: 1,
          borderBottomLeftRadius: PageDimensions.hp * 0.002,
          borderBottomRightRadius: PageDimensions.hp * 0.002,
          ...tableStyle,
        }}>
        <FlatList 
        data={rowsData} 
        renderItem={({ item, index }) => renderRowItem(item, index)} keyExtractor={(item, index) => index.toString()} 
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        nestedScrollEnabled={true} // Enable nested scroll
        ListFooterComponent={ListFooterComponent}/>
      </View>
    </View>
  );
});

export default ImpTable;