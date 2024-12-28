import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, TouchableOpacity, Platform, TextInput } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useFocusEffect, useRouter, Stack } from 'expo-router'
import Timer from '@/components/timer'
import { getRandomFileFromBucket } from '@/lib/appwrite'
import { SQLiteProvider, useSQLiteContext , type SQLiteDatabase} from 'expo-sqlite'


type Props  = {}


const Pathsresult = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [randomFile, setRandomFile] = useState<{ url: string } | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(false);
  const isLoopingRef = useRef(isLooping);
  const [showControls, setShowControls] = useState(true);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerName, setTimerName] = useState('');
  const [isNaming, setIsNaming] = useState(true);


  
    const createIFNeeded = async (db : SQLiteDatabase) => {
      db.execAsync(
        'CREATE TABLE IF NOT EXISTS timers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, totaltime INTEGER);'
      );
    };


  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        if (id === '1' || id === '2') {
          setLoading(true);
          await fetchRandomFile();
          await fetchRandomMusic();
        }
      };

      fetchData();

      return () => {
        isActive = false;
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [id])
  );
  
  const settimertxt = async (db : SQLiteDatabase) => {
    const datas = await db.runAsync(
      'INSERT INTO timers (name, totaltime) VALUES (?, ?):',
      [timerName, 0]
    )
    console.log(datas.lastInsertRowId, datas.changes);
  }
  const fetchRandomFile = async () => {
    try {
      const bucketId = id === '1' ? '676812e900174837d6be' : '6768e40f002fa8da3469';
      const file : any = await getRandomFileFromBucket(bucketId);
      setRandomFile({ url: file.url });
    } catch (error) {
      console.error('Error fetching random file:', error);
    }
  }

  const fetchRandomMusic = async () => {
    try {
      const bucketId = id === '1' ? '6767af7f002716ba13c4' : '6768e2f000172f70dad6';
      const musicFile = await getRandomFileFromBucket(bucketId);
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: musicFile.url });
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log('Playback finished. isLooping:', isLoopingRef.current);
          if (isLoopingRef.current) {
            
            await newSound.replayAsync();
          } else {
           
            await fetchRandomMusic();
          }
        }
      });
      await newSound.playAsync();
    } catch (error) {
      console.error('Error fetching random music:', error);
    }
  }

  const handlePausePlay = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = async () => {
    if (sound) {
      await sound.stopAsync();
      await fetchRandomMusic();
    }
  };

  const handleRepeat = async () => {
    if (sound) {
      const newLoopState = !isLooping;
      setIsLooping(newLoopState);
      isLoopingRef.current = newLoopState;
      await sound.setIsLoopingAsync(newLoopState);
    }
  };

  const handleTimerPause = () => {
    setTimerPaused(!timerPaused);
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showControls]);

  const handleScreenTap = () => {
    setShowControls(true);
  };

  const renderContent = () => {
    switch (id) {
      case '1':
      case '2':
        return (
          randomFile ? (
            <SQLiteProvider databaseName='timer.db' onInit={createIFNeeded}>
            <TouchableOpacity
              style={styles.backgroundImage}
              activeOpacity={1}
              onPress={handleScreenTap}
            >
              
              <ImageBackground
                source={{ uri: randomFile.url }}
                style={styles.backgroundImage}
                onLoadStart={() => setLoading(true)}
              >

                {loading ? (
                  
                  <View style={styles.loadingContainer}>
                 
                    
                    <View >
                    <TextInput
                    style={styles.input}
                    placeholder="What work you will be doing?"
                    placeholderTextColor="#aaa"
                    value={timerName}
                    onChangeText={setTimerName}
                    ></TextInput>
                    <TouchableOpacity style={styles.savebtn}>
                      <Text style={styles.savebtntxt}>Save</Text>
                    </TouchableOpacity>   
                  </View>    
                  </View>
                ) : (
                  <>
                    <Timer paused={timerPaused} />
                    {showControls && (
                      <>
                        <LinearGradient
                          colors={['rgba(0,0,0,0.5)', 'transparent']}
                          style={styles.controls}
                        >
                          <TouchableOpacity onPress={handleRepeat} style={styles.controlButton}>
                            <Ionicons name="repeat" size={32} color={isLooping ? "yellow" : "white"} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handlePausePlay} style={styles.controlButton}>
                            <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleSkip} style={styles.controlButton}>
                            <Ionicons name="play-skip-forward" size={32} color="white" />
                          </TouchableOpacity>
                        </LinearGradient>
                        <TouchableOpacity style={styles.timerControl} onPress={handleTimerPause}>
                          <Ionicons name={timerPaused ? "play" : "pause"} size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                          <Ionicons name="chevron-back-outline" size={32} color="white" />
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )} 
                </ImageBackground>
            </TouchableOpacity>
            </SQLiteProvider>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              
            </View>
          )
        );
      default:
        return <Text>wrong route</Text>;
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false}}/>
      
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>
    </View>
  )
}

export default Pathsresult

export const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.81)',
    width: '100%',
  },
  namingContainer : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input : {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom : 20,
    paddingHorizontal : 10,
    color: 'white',

  },
  savebtn : {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
  },
  savebtntxt : {
    color: 'white'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginBottom: 40,
    padding: 20,
    borderRadius: 50,
    width: '80%',
    marginTop: 40,
  },
  controlButton: {
    marginHorizontal: 10, 
  },
  timerControl: {
    position: 'absolute',
    top: Platform.OS  === 'ios' ? 60 : 30,
    left: 60,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS  === 'ios' ? 60 : 30,
    left: 20,
  },
  
})