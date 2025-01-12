import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, TouchableOpacity, Platform, AppState, AppStateStatus } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useFocusEffect, useRouter, Stack } from 'expo-router';
import Timer from '@/components/timer';
import { getRandomFileFromBucket, client } from '@/lib/appwrite';
import Toast from 'react-native-toast-message';
import MusicControls from '@/components/MusicControls';
import NamingModal from '@/components/NamingModal';
import CustomDurationModal from '@/components/CustomDurationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(Math.min(parseInt(duration) || 0, 64 * 60 * 60)); 
  const [currentTimerTime, setCurrentTimerTime] = useState<number>(Math.min(parseInt(duration) || 0, 64 * 60 * 60)); 
  const [customDurationModalVisible, setCustomDurationModalVisible] = useState(false);
  const [customDuration, setCustomDuration] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (id === '1' || id === '2') {
        setLoading(true);
        await fetchRandomFile();
        await fetchRandomMusic();
      }
    };

    fetchData();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      saveElapsedTime();
    };
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (sound) {
          sound.stopAsync();
        }
        saveElapsedTime();
      };
    }, [sound])
  );

  const fetchRandomFile = async () => {
    try {
      const bucketId = id === '1' ? '676812e900174837d6be' : '6768e40f002fa8da3469';
      const file: any = await getRandomFileFromBucket(bucketId);
      setRandomFile({ url: file.url });
    } catch (error) {
      
    }
  };

  const fetchRandomMusic = async () => {
    try {
      const bucketId = id === '1' ? '6767af7f002716ba13c4' : '6768e2f000172f70dad6';
      const musicFile = await getRandomFileFromBucket(bucketId);
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: musicFile.url });
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (isLoopingRef.current) {
            await newSound.replayAsync();
          } else {
            await fetchRandomMusic();
          }
        }
      });
      await newSound.playAsync();
    } catch (error) {
      
    }
  };

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

  const saveElapsedTime = async () => {
    const elapsed = totalDuration - currentTimerTime;
    setElapsedTime(elapsed);
    if (timerName.trim() && elapsed > 0) {
      const timerData = { timerName, totalTime: elapsed };
    
      await AsyncStorage.setItem('timerData', JSON.stringify(timerData));
    }
  };

  useEffect(() => {
    saveElapsedTime();
  }, [currentTimerTime]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showControls]);

  const handleScreenTap = () => {
    setShowControls(true);
  };

  useEffect(() => {
    if (currentTimerTime <= 0) {
      setIsNaming(true);
    }
  }, [currentTimerTime]);

  const handleTimerUpdate = useCallback((time: number) => {
    setCurrentTimerTime(time);
    if (time <= 0) {
      setIsNaming(true);
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

  const handleBackPress = async () => {
    if (sound) {
      await sound.stopAsync();
    }
    await saveElapsedTime();
    router.back();
  };

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
                        <MusicControls
                          isPlaying={isPlaying}
                          isLooping={isLooping}
                          handlePausePlay={handlePausePlay}
                          handleSkip={handleSkip}
                          handleRepeat={handleRepeat}
                        />
                        <TouchableOpacity style={styles.timerControl} onPress={handleTimerPause}>
                          <Ionicons name={timerPaused ? "play" : "pause"} size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
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
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>
      <NamingModal
        key="naming-modal"
        isVisible={isNaming}
        timerName={timerName}
        setTimerName={setTimerName}
        setIsNaming={setIsNaming}
        setTotalDuration={setTotalDuration}
        setCurrentTimerTime={setCurrentTimerTime}
        handleCustomDuration={handleCustomDuration}
      />
      <CustomDurationModal
        key="custom-duration-modal"
        isVisible={customDurationModalVisible}
        customDuration={customDuration}
        setCustomDuration={setCustomDuration}
        handleCustomDurationSave={handleCustomDurationSave}
        setCustomDurationModalVisible={setCustomDurationModalVisible}
      />
      <Toast />
    </View>
  );
};

export default Pathsresult;

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
});


