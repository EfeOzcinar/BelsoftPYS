/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable keyword-spacing */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
import React, { useContext, useEffect, useState } from 'react';

import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer, NavigationProp, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomePage from '.';
import Login from './Auth/Login';
import Profile from './Profile';
import TaskEntry from './TaskErrorEntry/TaskEntry';
import ErrorEntry from './TaskErrorEntry/ErrorEntry';
import UserTaskErrorList from './TaskErrorObservation/UserTaskErrorList';
import TaskErrorListBasedCompany from './TaskErrorObservation/TaskErrorListBasedCompany';
import AllTaskErrorList from './TaskErrorObservation/AllTaskErrorList';
import TaskDetail from './TaskErrorObservation/TaskDetail';
import ErrorDetail from './TaskErrorObservation/ErrorDetail';
import ErrorUpdate from './TaskErrorEntry/ErrorUpdate';
import ErrorDetailObservation from './TaskErrorObservation/ErrorDetailObservation';
import TaskDetailObservation from './TaskErrorObservation/TaskDetailObservation';
import CallCenter from './TaskErrorObservation/CallCenter';



import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';

import { Dimensions, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import PageDimensions from '../constants/pageDimensions';
import { sideMenuBackground } from '../assets/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigatorGoBackButton from '../components/BussinessComponents/NavigatorGoBackButton';
import PersonelDutyDetails from './PersonelDutyDetails';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const dimension = Dimensions.get('window');


type RootStackParamList = {
  Home: undefined; // Screen "Home" does not accept any params
  Profile: { userId: string }; // Screen "Profile" accepts a userId parameter of type string
  Settings: { showNotifications: boolean }; // Screen "Settings" accepts a showNotifications parameter of type boolean
};

const NavigationDrawerStructure = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const openDrawerMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={openDrawerMenu}>
        {/*Donute Button Image */}
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png' }}
          style={{ width: 30, height: 30, marginLeft: 0 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#285A8C',
      },
      headerShown: false,
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="HomePage"
      component={HomePage}
      options={({ navigation, route }) => ({
        headerShown: true,
        title: 'Anasayfa',
        headerRight: () => (
          <NavigationDrawerStructure />
        ),
      })}
    />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#285A8C',
      },
      headerShown: false,
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="HomePage"
      component={HomePage}
      options={({ navigation, route }) => ({
        headerShown: true,
        title: 'Anasayfa',
        headerRight: () => (
          <NavigationDrawerStructure />
        ),
      })}
    />
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{ title: 'Profil', headerShown: true }}
    />
    <Stack.Screen
      name="TaskEntry"
      component={TaskEntry}
      options={{ title: 'Talep Giriş', headerShown: true }}
    />
    <Stack.Screen name="CallCenter" 
    component={CallCenter} 
    options={{ title: 'Çağrı Merkezi', headerShown: true }}
    />

    <Stack.Screen
      name="ErrorEntry"
      component={ErrorEntry}
      options={{ title: 'Hata Giriş', headerShown: true }}
    />
    <Stack.Screen
      name="TaskErrorListBasedCompany"
      component={TaskErrorListBasedCompany}
      options={{ title: 'Kurum Bazlı Hata-Talep', headerShown: true }}
    />
    <Stack.Screen
      name="UserTaskErrorList"
      component={UserTaskErrorList}
      options={{ title: 'Hata Talep Listem', headerShown: true }}
    />
    <Stack.Screen
      name="AllTaskErrorList"
      component={AllTaskErrorList}
      options={{ title: 'Tüm Liste', headerShown: true }}
    />
    <Stack.Screen
      name="ErrorDetail"
      component={ErrorDetail}
      options={{ title: 'Hata Detay', headerShown: true }}
    />
    <Stack.Screen
      name="ErrorDetailObservation"
      component={ErrorDetailObservation}
      options={{ title: 'Hata Detay Gözlem', headerShown: true }}
    />
    <Stack.Screen
      name="TaskDetail"
      component={TaskDetail}
      options={{ title: 'Talep Detay', headerShown: true }}
    />
    <Stack.Screen
      name="TaskDetailObservation"
      component={TaskDetailObservation}
      options={{ title: 'Talep Detay Gözlem', headerShown: true }}
    />
    <Stack.Screen
      name="ErrorUpdate"
      component={ErrorUpdate}
      options={{ title: 'Hata Düzenleme', headerShown: true }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="PersonelDutyDetails"
      component={PersonelDutyDetails}
      options={{ title: 'Personel Görev Detayları', headerShown: true }}
    />
  </Stack.Navigator>
);

const AppNavigator: React.FC = () => {


  const { userInfo, themeColor } = useContext(AppContext);
  const [userType, setUserType] = useState('');
  const [userData, setUserData] = useState<any>(userInfo)
  const [studentLevel, setStudentLevel] = useState<string>('');
  const [studentGender, setStudentGender] = useState<string>('');

  const dimensions = useWindowDimensions();

  useEffect(() => {
    async function pageLoad() {
      const userDataSession = await AsyncStorage.getItem('UserInfo');
      if (userDataSession) {
        try {
          const userData_ = JSON.parse(userDataSession)
          setUserData(userData_)
        }
        catch (e) {
          console.log('asdasd', e)
        }
      }
    }
    pageLoad();
  }, [])

  useEffect(() => {
    if (userInfo) {
      setUserData(userInfo)
    }
  }, [userInfo]);

  if (userData) {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={
            (props) => {
              return (
                <SafeAreaView>
                  <ImageBackground
                    source={sideMenuBackground}
                    style={{
                      height: PageDimensions.hp * 0.22,
                      alignItems: 'center',
                      borderBottomColor: '#f4f4f4',
                      borderBottomWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: PageDimensions.hp * 0.022,
                        marginTop: PageDimensions.hp * 0.04,
                        fontWeight: 'bold',
                        color: themeColor.white,

                      }}
                    >{`${userData?.Name} ${userData?.SurName}`}</Text>
                    <Text
                      style={{
                        fontSize: PageDimensions.hp * 0.018,
                        fontWeight: '400',
                        color: themeColor.white,
                        marginTop: PageDimensions.hp * 0.01,
                      }}
                    >
                      ...
                    </Text>
                  </ImageBackground>

                  <View style={{
                    height: PageDimensions.hp * 0.77,
                  }}
                  >
                    <ScrollView>
                      <DrawerItemList {...props} />
                    </ScrollView>
                  </View>
                </SafeAreaView>
              )
            }
          }

          screenOptions={{
            drawerType: dimensions.width >= dimension.width * 1.01 ? 'permanent' : 'front',
            drawerStyle: { backgroundColor: '#fff', },
            headerStyle: {
              backgroundColor: '#342D54',
            },
            headerShown: false,
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerLabelStyle: {
              top: 0,
              padding: 0,
              margin: 0,
              color: themeColor.mainBackgroundColor,
              fontWeight: '600',
              marginTop: PageDimensions.hp * 0.001,
              fontSize: PageDimensions.hp * 0.018,
              height: PageDimensions.hp * 0.03,
              width: PageDimensions.hp * 0.2,
              marginLeft: PageDimensions.wp * -0.05,
            },
            drawerItemStyle: {
              top: 0,
              padding: 0,
              margin: 0,
              height: PageDimensions.hp * 0.05,
              display: 'flex',
              justifyContent: 'center',
            },
          }}

        >
          <Drawer.Screen
            component={HomeStack}
            name={'Anasayfa'}
            options={{
              drawerLabel: 'Anasayfa',
              title: 'Anasayfa',
              drawerIcon: () => (
                <Icon
                  style={styles.sideMenuIcon}
                  name="home-outline"
                  size={PageDimensions.hp * 0.03}
                  color={themeColor.mainBackgroundColor}
                />
              ),
            }}
          />
          <Drawer.Screen
            component={Profile}
            name={'Profile'}
            options={{
              headerShown: true,
              headerLeft: () => <NavigatorGoBackButton />,
              drawerLabel: 'Profil',
              title: 'Profil',
              drawerIcon: () => (
                <Icon
                  style={styles.sideMenuIcon}
                  name="home-outline"
                  size={PageDimensions.hp * 0.03}
                  color={themeColor.mainBackgroundColor}
                />
              ),
            }}
          />
          <Drawer.Screen
            component={ErrorEntry}
            name={'ErrorEntry'}
            options={{
              headerShown: true,
              headerLeft: () => <NavigatorGoBackButton />,
              drawerLabel: 'Hata Giriş',
              title: 'Hata Giriş',
              drawerIcon: () => (
                <Icon
                  style={styles.sideMenuIcon}
                  name="home-outline"
                  size={PageDimensions.hp * 0.03}
                  color={themeColor.mainBackgroundColor}
                />
              ),
            }}
          />
            <Drawer.Screen
            component={TaskEntry}
            name={'TaskEntry'}
            options={{
              headerShown: true,
              headerLeft: () => <NavigatorGoBackButton />,
              drawerLabel: 'Talep Giriş',
              title: 'Talep Giriş',
              drawerIcon: () => (
                <Icon
                  style={styles.sideMenuIcon}
                  name="home-outline"
                  size={PageDimensions.hp * 0.03}
                  color={themeColor.mainBackgroundColor}
                />
              ),
            }}
          />
          <Drawer.Screen
            component={AllTaskErrorList}
            name={'AllTaskErrorList'}
            options={{
              headerShown: true,
              headerLeft: () => <NavigatorGoBackButton />,
              drawerLabel: 'Tüm Liste',
              title: 'Tüm Liste',
              drawerIcon: () => (
                <Icon
                  style={styles.sideMenuIcon}
                  name="home-outline"
                  size={PageDimensions.hp * 0.03}
                  color={themeColor.mainBackgroundColor}
                />
              ),
            }}
          />
          <Drawer.Screen
            component={UserTaskErrorList}
            name={'UserTaskErrorList'}
            options={{
              headerShown: true,
              headerLeft: () => <NavigatorGoBackButton />,
              drawerLabel: 'Hata Taleplerim',
              title: 'Hata Taleplerim',
              drawerIcon: () => (
                <Icon
                  style={styles.sideMenuIcon}
                  name="home-outline"
                  size={PageDimensions.hp * 0.03}
                  color={themeColor.mainBackgroundColor}
                />
              ),
            }}
          />
          <Drawer.Screen
            component={TaskErrorListBasedCompany}
            name={'TaskErrorListBasedCompany'}
            options={{
              headerShown: true,
              headerLeft: () => <NavigatorGoBackButton />,
              drawerLabel: 'Kurum Bazlı Liste',
              title: 'Kurum Bazlı Liste',
              drawerIcon: () => (
                <Icon
                  style={styles.sideMenuIcon}
                  name="home-outline"
                  size={PageDimensions.hp * 0.03}
                  color={themeColor.mainBackgroundColor}
                />
              ),
            }}
          />

          <Drawer.Screen
            component={Login}
            name="Çıkış"
            options={{
              headerShown: false,
              swipeEnabled: false,
              drawerIcon: () => (
                <Icon
                  style={styles.sideMenuIcon}
                  name="logout-variant"
                  size={PageDimensions.hp * 0.03}
                  color={themeColor.mainBackgroundColor}
                />
              ),
            }}
            listeners={() => ({
              focus: async (e) => {
                await AsyncStorage.removeItem('fcmtoken');
                await AsyncStorage.removeItem('UserInfo');

                await AsyncStorage.removeItem('InstitutionId');
                await AsyncStorage.removeItem('InstitutionInfo');
                await AsyncStorage.removeItem('CurrentTermCode');
              },
            })}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    );

  }
  else {
    return (
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            component={AuthStack}
            name="Home"
            options={{ headerShown: false, swipeEnabled: false }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    );

  }

};

const styles = StyleSheet.create({
  sideMenuIcon: {
    width: '12%',
    marginTop: '-2%',
    marginRight: '3%',
  },
});

export default AppNavigator;
