import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Databases, Query } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';
import Toast from 'react-native-toast-message';
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

const pathNames: { [key: string]: string } = {
  '1': 'Lo-fi',
  '2': 'Nature'
};

const pieChartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const FriendStatsPage = () => {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const [timerData, setTimerData] = useState<any[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [todayTime, setTodayTime] = useState<number>(0);
  const [chartData, setChartData] = useState<{ labels: string[], datasets: { data: number[], formattedData: string[] }[] }>({ labels: [], datasets: [{ data: [], formattedData: [] }] });
  const [pathSelectionData, setPathSelectionData] = useState<{ name: string, count: number, percentage: number, color: string }[]>([]);
  const [barChartData, setBarChartData] = useState<{ labels: string[], datasets: { data: number[] }[] }>({ labels: [], datasets: [{ data: [] }] });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  const databases = new Databases(client);

  useEffect(() => {
    if (friendId) {
      fetchTimerData(friendId);
      fetchPathSelectionData(friendId);
    }
  }, [friendId]);

  useFocusEffect(
    React.useCallback(() => {
      const checkInternetConnection = async () => {
        const state = await NetInfo.fetch();
        setIsOnline((state.isConnected && state.isInternetReachable) ?? false);
      };

      checkInternetConnection();
    }, [])
  );

  const fetchTimerData = async (userId: string) => {
    try {
      const response = await databases.listDocuments('67700254003a7728ac47', '6770037e0017ef452669', [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt') 
      ]);
      setTimerData(response.documents);
      calculateTotalTime(response.documents);
      calculateTodayTime(response.documents);
      calculateChartData(response.documents);
      calculateBarChartData(response.documents);
    } catch (error) {
      console.error('Error fetching timer data:', error);
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
        Query.orderDesc('$createdAt') 
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
      console.error('Error fetching path selection data:', error);
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
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Friend's Timer Stats</Text>
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
        <Toast />
      </ScrollView>
    </View>
  );
};

export default FriendStatsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
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
});
