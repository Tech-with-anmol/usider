import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Account, Databases, Query } from 'react-native-appwrite'
import { client } from '@/lib/appwrite'
import Toast from 'react-native-toast-message'
import { useFocusEffect } from '@react-navigation/native'
import { LineChart } from 'react-native-chart-kit'

const StatsPage = () => {
  const [timerData, setTimerData] = useState<any[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [todayTime, setTodayTime] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  const account = new Account(client);
  const databases = new Databases(client);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
        fetchTimerData(user.$id);
      } catch (error) {
        console.error('Error fetching user:', error);
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
      if (userId) {
        fetchTimerData(userId);
      }
    }, [userId])
  );

  const fetchTimerData = async (userId: string) => {
    try {
      const response = await databases.listDocuments('67700254003a7728ac47', '6770037e0017ef452669', [
        Query.equal('userId', userId)
      ]);
      setTimerData(response.documents);
      calculateTotalTime(response.documents);
      calculateTodayTime(response.documents);
    } catch (error) {
      console.error('Error fetching timer data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch timer data',
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
      .filter(doc => doc.creationTime.split('T')[0] === today)
      .reduce((acc, doc) => acc + doc.totalTime, 0);
    setTodayTime(todayTotal);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.timerName}</Text>
      <Text style={styles.itemText}>{formatTime(item.totalTime)}</Text>
    </View>
  );

  const chartData = {
    labels: ['0h', '4h', '8h', '12h', '16h', '20h', '24h'],
    datasets: [
      {
        data: [0, 2, 4, 6, 8, 10, 12], // Replace with actual data
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ['Time Spent Today'] // optional
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Timer Stats</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
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
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
      <Text style={styles.todayTimeText}>Total Time Spent Today: {formatTime(todayTime)}</Text>
      <FlatList
        data={timerData}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Total Time Spent: {formatTime(totalTime)}</Text>
          </View>
        )}
      />
      <Toast />
    </View>
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
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    color: '#cdd6f4',
    textAlign: 'center',
    fontWeight: '500',
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
  },
})