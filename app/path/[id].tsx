import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, TouchableOpacity, Platform, TextInput, Modal } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useFocusEffect, useRouter, Stack } from 'expo-router'
import Timer from '@/components/timer'
import { getRandomFileFromBucket, client } from '@/lib/appwrite'
import { Account, Databases, Query } from 'react-native-appwrite'
import Toast from 'react-native-toast-message'
import PushNotification from 'react-native-push-notification'
import BackgroundTimer from 'react-native-background-timer'


// Custom debounce function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Pathsresult = () => {
  const { id, duration } = useLocalSearchParams<{ id: string, duration: string }>();
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
  const [userId, setUserId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(Math.min(parseInt(duration) || 0, 64 * 60 * 60)); // Ensure totalDuration is within valid range
  const [currentTimerTime, setCurrentTimerTime] = useState<number>(Math.min(parseInt(duration) || 0, 64 * 60 * 60)); // Ensure currentTimerTime is within valid range
  const [customDurationModalVisible, setCustomDurationModalVisible] = useState(false);
  const [customDuration, setCustomDuration] = useState('');

  const account = new Account(client);
  const databases = new Databases(client);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);

      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    getUser();
  }, []);

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
        saveElapsedTime();
        saveTimerData(); // Save timer data when the user navigates away
      };
    }, [id])
  );

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
        saveElapsedTime();
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
      saveElapsedTime();
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
    saveElapsedTime();
  };

  const saveElapsedTime = () => {
    const elapsed = totalDuration - currentTimerTime;
    setElapsedTime(elapsed);
    console.log('Elapsed Time:', elapsed);
  };

  useEffect(() => {
    saveElapsedTime();
  }, [currentTimerTime]);

  const saveTimerData = async () => {
    saveElapsedTime(); // Ensure elapsed time is saved before storing in the database

    if (!timerName.trim()) {
      return; // Do not show toast here
    }

    try {
      // Create a new timer without creation time
      await databases.createDocument('67700254003a7728ac47', '6770037e0017ef452669', 'unique()', {
        userId,
        timerName,
        totalTime: elapsedTime,
      });

      setIsNaming(false);
    } catch (error) {
      console.error('Error saving timer data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save timer data',
      });
    }
  };

  const debouncedSaveTimerData = useCallback(
    debounce(saveTimerData, 1000), // Debounce interval of 1 second
    [elapsedTime, userId, timerName]
  );

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      saveElapsedTime();
      saveTimerData(); // Save timer data when the component unmounts
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
    debouncedSaveTimerData();
  };

  const handleTimerUpdate = useCallback((time: number) => {
    setCurrentTimerTime(time);
    if (time <= 0) {
      setIsNaming(true); // Show the naming modal when the timer completes
    }
  }, []);

  const handleCustomDuration = () => {
    setCustomDurationModalVisible(true);
  };

  const handleCustomDurationSave = () => {
    const durationInSeconds = parseInt(customDuration) * 60;
    if (durationInSeconds > 64 * 60 * 60) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Duration exceeds the maximum allowed value of 64 hours',
      });
    } else {
      setTotalDuration(durationInSeconds);
      setCurrentTimerTime(durationInSeconds);
      setCustomDurationModalVisible(false);
    }
  };

  useEffect(() => {
    if (!timerPaused) {
      BackgroundTimer.runBackgroundTimer(() => {
        setCurrentTimerTime(prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            BackgroundTimer.stopBackgroundTimer();
            return 0;
          }
        });
      }, 1000);
    } else {
      BackgroundTimer.stopBackgroundTimer();
    }

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [timerPaused]);

  useEffect(() => {
    if (currentTimerTime > 0) {
      PushNotification.localNotification({
        channelId: "timer-channel",
        title: "Timer Running",
        message: `Time left: ${Math.floor(currentTimerTime / 60)}:${currentTimerTime % 60}`,
        playSound: false,
        soundName: 'default',
        importance: 'high',
        vibrate: false,
      });
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  }, [currentTimerTime]);

  const renderContent = () => {
    switch (id) {
      case '1':
      case '2':
        return (
          randomFile ? (
            <TouchableOpacity
              style={styles.backgroundImage}
              activeOpacity={1}
              onPress={handleScreenTap}
            >
              <ImageBackground
                source={{ uri: randomFile.url }}
                style={styles.backgroundImage}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                  </View>
                ) : (
                  <>
                    <Timer paused={timerPaused} totalDuration={totalDuration} onUpdate={handleTimerUpdate} onEnd={() => setIsNaming(true)} />
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
                        <TouchableOpacity onPress={() => {
                          saveTimerData();
                          router.back();
                        }} style={styles.backButton}>
                          <Ionicons name="chevron-back-outline" size={32} color="white" />
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}
              </ImageBackground>
            </TouchableOpacity>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNaming}
        onRequestClose={() => setIsNaming(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="What work you will be doing?"
              placeholderTextColor="#cdd6f4"
              value={timerName}
              onChangeText={setTimerName}
            />
            <Text style={styles.durationText}>Select Duration:</Text>
            <View style={styles.durationOptions}>
              <TouchableOpacity style={[styles.durationButton, totalDuration === 15 * 60 && styles.selectedButton]} onPress={() => {
                setTotalDuration(15 * 60);
                setCurrentTimerTime(15 * 60);
              }}>
                <Text style={styles.durationButtonText}>15 Minutes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.durationButton, totalDuration === 30 * 60 && styles.selectedButton]} onPress={() => {
                setTotalDuration(30 * 60);
                setCurrentTimerTime(30 * 60);
              }}>
                <Text style={styles.durationButtonText}>30 Minutes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.durationButton, totalDuration === 60 * 60 && styles.selectedButton]} onPress={() => {
                setTotalDuration(60 * 60);
                setCurrentTimerTime(60 * 60);
              }}>
                <Text style={styles.durationButtonText}>60 Minutes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.durationButton, totalDuration && ![15 * 60, 30 * 60, 60 * 60].includes(totalDuration) ? styles.selectedButton : null]} onPress={handleCustomDuration}>
                <Text style={styles.durationButtonText}>Custom</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.savebtn} onPress={() => {
              if (!timerName.trim()) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Timer name cannot be empty',
                });
                return;
              }
              setIsNaming(false);
              setTimerPaused(false);
              setElapsedTime(totalDuration - currentTimerTime); // Ensure elapsed time is set correctly
            }}>
              <Text style={styles.savebtntxt}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={customDurationModalVisible}
        onRequestClose={() => setCustomDurationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter custom duration in minutes"
              placeholderTextColor="#cdd6f4"
              keyboardType="numeric"
              value={customDuration}
              onChangeText={setCustomDuration}
            />
            <TouchableOpacity style={styles.savebtn} onPress={handleCustomDurationSave}>
              <Text style={styles.savebtntxt}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  )
}

export default Pathsresult

const styles = StyleSheet.create({
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
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 60,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 54, 54, 0.16)',
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#cdd6f4',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#cdd6f4',
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#313244',
    borderTopColor: 'rgb(253, 250, 250)'
  },
  durationText: {
    color: '#cdd6f4',
    fontSize: 17,
    marginBottom: 10,
    fontWeight: '700'
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  durationButton: {
    backgroundColor: 'rgba(36, 189, 125, 0.4)',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    borderWidth: 3,
    borderColor: 'rgba(29, 160, 106, 0.8)',
    
  },
  selectedButton: {
    backgroundColor: 'rgba(24, 202, 84, 0.8)',
  },
  durationButtonText: {
    color: 'rgb(248, 250, 249)',
    fontWeight: '500',
  },
  savebtn: {
    backgroundColor: 'rgba(32, 207, 134, 0.4)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'rgba(36, 189, 125, 0.8)',
  },
  savebtntxt: {
    color: 'rgb(248, 250, 249)',
    fontWeight: '500',
  },

})