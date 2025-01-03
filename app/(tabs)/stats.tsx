import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Account, Databases, Query } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pathNames: { [key: string]: string } = {
  '1': 'Lo-fi',
  '2': 'Nature'
};

const pieChartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const StatsPage = () => {
  const [timerData, setTimerData] = useState<any[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [todayTime, setTodayTime] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ labels: string[], datasets: { data: number[], formattedData: string[] }[] }>({ labels: [], datasets: [{ data: [], formattedData: [] }] });
  const [pathSelectionData, setPathSelectionData] = useState<{ name: string, count: number, percentage: number, color: string }[]>([]);
  const [barChartData, setBarChartData] = useState<{ labels: string[], datasets: { data: number[] }[] }>({ labels: [], datasets: [{ data: [] }] });
  const [isOnline, setIsOnline] = useState<boolean>(true);

  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  const account = new Account(client);
  const databases = new Databases(client);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
      } catch (error) {
       
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch user data',
        });
      }
    };
    getUser();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkInternetConnection = async () => {
        const state = await NetInfo.fetch();
        setIsOnline((state.isConnected && state.isInternetReachable) ?? false);
      };

      checkInternetConnection();

      if (userId && isOnline) {
        syncDataToCloud(userId);
      } else if (!isOnline) {
        fetchOfflineData();
        Toast.show({
          type: 'error',
          text1: 'No Internet Connection',
          text2: 'Showing offline data',
        });
      }
    }, [userId, isOnline])
  );

  const syncDataToCloud = async (userId: string) => {
    
    try {
      const offlineData = await AsyncStorage.getItem('timerData');
  
      if (offlineData) {
        const parsedData = JSON.parse(offlineData);
        if (Array.isArray(parsedData)) {
          for (const doc of parsedData) {
            await databases.createDocument('67700254003a7728ac47', '6770037e0017ef452669', 'unique()', {
              userId,
              timerName: doc.timerName,
              totalTime: doc.totalTime,
            });
           
          }
        } else {
          await databases.createDocument('67700254003a7728ac47', '6770037e0017ef452669', 'unique()', {
            userId,
            timerName: parsedData.timerName,
            totalTime: parsedData.totalTime,
          });
          
        }
        await AsyncStorage.removeItem('timerData');
      }
      fetchTimerData(userId);
      fetchPathSelectionData(userId);
    } catch (error) {
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to sync data to cloud',
      });
    }
  };

  const fetchOfflineData = async () => {
    try {
      const offlineData = await AsyncStorage.getItem('timerData');
      
      if (offlineData) {
        const parsedData = JSON.parse(offlineData);
        setTimerData(Array.isArray(parsedData) ? parsedData : [parsedData]);
        calculateTotalTime(parsedData);
        calculateTodayTime(parsedData);
        calculateChartData(parsedData);
        calculateBarChartData(parsedData);
      }
    } catch (error) {
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch offline data',
      });
    }
  };

  const fetchTimerData = async (userId: string) => {
    try {
      const response = await databases.listDocuments('67700254003a7728ac47', '6770037e0017ef452669', [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt') // Ensure the latest data is fetched
      ]);
      setTimerData(response.documents);
      calculateTotalTime(response.documents);
      calculateTodayTime(response.documents);
      calculateChartData(response.documents);
      calculateBarChartData(response.documents);
    } catch (error) {
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch timer data',
      });
    }
  };

  const fetchPathSelectionData = async (userId: string) => {
    try {
      const response = await databases.listDocuments('67700254003a7728ac47', '67712065003e44192265', [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt') // Ensure the latest data is fetched
      ]);
      const pathData = response.documents.reduce((acc: { [key: string]: number }, doc: any) => {
        acc[doc.pathId] = (acc[doc.pathId] || 0) + 1;
        return acc;
      }, {});
      const totalSelections = Object.values(pathData).reduce((acc, count) => acc + count, 0);
      const formattedPathData = Object.entries(pathData).map(([id, count], index) => ({
        name: pathNames[id] || id,
        count,
        percentage: parseFloat(((count / totalSelections) * 100).toFixed(2)),
        color: pieChartColors[index % pieChartColors.length]
      }));
      setPathSelectionData(formattedPathData);
    } catch (error) {
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch path selection data',
      });
    }
  };

  const calculateTotalTime = (documents: any[]) => {
    const total = documents.reduce((acc, doc) => acc + doc.totalTime, 0);
    setTotalTime(total);
  };

  const calculateTodayTime = (documents: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayTotal = documents
      .filter(doc => doc.$createdAt && doc.$createdAt.split('T')[0] === today)
      .reduce((acc, doc) => acc + doc.totalTime, 0);
    setTodayTime(todayTotal);
  };

  const formatTimeValue = (time: number) => {
    if (time >= 3600) {
      return `${(time / 3600).toFixed(1)}h`;
    } else if (time >= 60) {
      return `${(time / 60).toFixed(1)}m`;
    } else {
      return `${time}s`;
    }
  };

  const calculateChartData = (documents: any[]) => {
    const timerMap: { [key: string]: number } = {};

    documents.forEach(doc => {
      if (doc.timerName && doc.totalTime) {
        if (timerMap[doc.timerName]) {
          timerMap[doc.timerName] += doc.totalTime;
        } else {
          timerMap[doc.timerName] = doc.totalTime;
        }
      }
    });

    const sortedTimers = Object.entries(timerMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);

    const labels = sortedTimers.map(([name]) => name);
    const data = sortedTimers.map(([, time]) => time);
    const formattedData = data.map(formatTimeValue);

    setChartData({
      labels,
      datasets: [{ data, formattedData }]
    });
  };

  const calculateBarChartData = (documents: any[]) => {
    const timerMap: { [key: string]: number } = {};

    documents.forEach(doc => {
      if (doc.timerName && doc.totalTime) {
        if (timerMap[doc.timerName]) {
          timerMap[doc.timerName] += doc.totalTime;
        } else {
          timerMap[doc.timerName] = doc.totalTime;
        }
      }
    });

    const sortedTimers = Object.entries(timerMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const labels = sortedTimers.map(([name]) => name);
    const data = sortedTimers.map(([, time]) => time);

    setBarChartData({
      labels,
      datasets: [{ data }]
    });
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Timer Stats</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: chartData.labels,
            datasets: [{ data: chartData.datasets[0].data }]
          }}
          width={Dimensions.get('window').width - 40}
          height={270}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#1e1e2e',
            backgroundGradientFrom: '#1e1e2e',
            backgroundGradientTo: '#1e1e2e',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726'
            }
          }}
          fromZero
          showValuesOnTopOfBars
          verticalLabelRotation={0}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
      <Text style={styles.todayTimeText}>Total Time Spent Today: {formatTime(todayTime)}</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={pathSelectionData.map(item => ({
            name: `${item.name}: ${item.percentage}%`,
            population: item.count,
            color: item.color,
            legendFontColor: '#cdd6f4',
            legendFontSize: 15
          }))}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#1e1e2e',
            backgroundGradientFrom: '#1e1e2e',
            backgroundGradientTo: '#1e1e2e',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
      
      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: barChartData.labels,
            datasets: [{ data: barChartData.datasets[0].data }]
          }}
          width={Dimensions.get('window').width - 40}
          height={270}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#1e1e2e',
            backgroundGradientFrom: '#1e1e2e',
            backgroundGradientTo: '#1e1e2e',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726'
            }
          }}
          fromZero
          showValuesOnTopOfBars
          verticalLabelRotation={20}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
      <Text style={styles.totalTimeText}>Total Time Spent: {formatTime(totalTime)}</Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Toast />
    </ScrollView>
  )
}

export default StatsPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    padding: 20,
    
  },
  title: {
    fontSize: 24,
    color: '#cdd6f4',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  todayTimeText: {
    fontSize: 18,
    color: '#cdd6f4',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    fontFamily: 'Poppins_600SemiBold',
  },
  totalTimeText: {
    fontSize: 18,
    color: '#cdd6f4',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    fontFamily: 'Poppins_600SemiBold',
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    color: '#cdd6f4',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Poppins_600SemiBold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#313244',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    color: '#cdd6f4',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
})