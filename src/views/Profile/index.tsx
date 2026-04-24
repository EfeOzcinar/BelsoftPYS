import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import blsCore from '../../core';

const { width, height } = Dimensions.get('window');

// Flaticon URL'si
const iconUrl = 'https://cdn-icons-png.flaticon.com/512/1156/1156342.png';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    TotalErrorNumber: 0,
    TotalClosedErrorNumber: 0,
    TotalTaskNumber: 0,
    TotalClosedTaskNumber: 0,
  });

  const profileData = {
    name: 'Veysel Turan',
    position: 'Yönetici',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnK9wEie8rYi38UBdXTTnUsghoayhMWaucTY1QU77ehXuvkxxPkbpLozlIPyJXkK1IZEk&usqp=CAU',
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userDataSession = await AsyncStorage.getItem('UserInfo');
      if (userDataSession) {
        const userInfo = JSON.parse(userDataSession);
        const queryData = { UserOid: userInfo.Oid };

        const statsData = await blsCore.services.taskAndErrorService.getUserIstatisticInfo(queryData);

        setStats({
          TotalErrorNumber: Number(statsData.TotalErrorNumber) || 0,
          TotalClosedErrorNumber: Number(statsData.TotalClosedErrorNumber) || 0,
          TotalTaskNumber: Number(statsData.TotalTaskNumber) || 0,
          TotalClosedTaskNumber: Number(statsData.TotalClosedTaskNumber) || 0,
        });
      }
    } catch (e) {
      console.error('Error fetching user info:', e);
    } finally {
      setLoading(false);
    }
  };

  const cardData = [
    { id: '1', title: 'Toplam Hata Sayısı', count: stats.TotalErrorNumber },
    { id: '2', title: 'Çözülen Hata Sayısı', count: stats.TotalClosedErrorNumber },
    { id: '3', title: 'Toplam Talep Sayısı', count: stats.TotalTaskNumber },
    { id: '4', title: 'Tamamlanan Talep Sayısı', count: stats.TotalClosedTaskNumber },
  ];

  return (
    <LinearGradient colors={['#0A1F44', '#0D284E', '#0e6e49']} style={styles.gradientContainer}>
      <Svg height={height * 0.3} width={width * 0.6} style={styles.svgStyle}>
        <Circle cx={-width * 0.1} cy={-height * 0.1} r={width * 0.5} fill="#1C3F7C" fillOpacity="0.6" />
      </Svg>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: profileData.imageUrl }}
                style={styles.profileImage}
              />
              <Text style={styles.name}>{profileData.name}</Text>
              <Text style={styles.position}>{profileData.position}</Text>
            </View>

            <View style={styles.statsContainer}>
              {cardData.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.count}>{item.count}</Text>
                  {/* İkonu ekleme */}
                  <Image source={{ uri: iconUrl }} style={styles.icon} />
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </LinearGradient>
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
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
    color: '#fff',
  },
  position: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 150,
    height: 140,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 5,
  },
});

export default Profile;
