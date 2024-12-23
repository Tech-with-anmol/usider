import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useFocusEffect } from 'expo-router'
import Timer from '@/components/timer'
import { getRandomFileFromBucket } from '@/lib/appwrite'

type Props = {}

const Pathsresult = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [randomFile, setRandomFile] = useState<{ url: string } | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(false);
  const isLoopingRef = useRef(isLooping);
  const [showControls, setShowControls] = useState(true);
  const [timerPaused, setTimerPaused] = useState(false);

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

  const fetchRandomFile = async () => {
    try {
      const bucketId = id === '1' ? '676812e900174837d6be' : '6768e40f002fa8da3469';
      const file = await getRandomFileFromBucket(bucketId);
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
                    <Timer paused={timerPaused} />
                    {showControls && (
                      <>
                        <LinearGradient
                          colors={['rgba(0,0,0,0.5)', 'transparent']}
                          style={styles.controls}
                        >
                          <TouchableOpacity onPress={handleRepeat}>
                            <Ionicons name="repeat" size={32} color={isLooping ? "yellow" : "white"} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handlePausePlay}>
                            <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleSkip}>
                            <Ionicons name="play-skip-forward" size={32} color="white" />
                          </TouchableOpacity>
                        </LinearGradient>
                        <TouchableOpacity style={styles.timerControl} onPress={handleTimerPause}>
                          <Ionicons name={timerPaused ? "play" : "pause"} size={32} color="white" />
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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {renderContent()}
      </View>
    </>
  )
}

export default Pathsresult

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // darker background color
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    borderRadius: 50
  },
  timerControl: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
})