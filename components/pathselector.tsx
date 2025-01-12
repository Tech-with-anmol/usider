import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import Svg, { Path } from 'react-native-svg';
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import * as Splashscreen from 'expo-splash-screen';
import { Link, router, useFocusEffect } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Account, Databases, Query } from 'react-native-appwrite';
import { client, streakCollectionId } from '@/lib/appwrite';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

Splashscreen.preventAutoHideAsync();

export default function Homescreen() {
      
    const [bgColor2, setBgColor2] = useState('#163431');
    const [bgColor1, setBgColor1] = useState('#255411');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [streak, setStreak] = useState<number>(0);
    
    const btnn = async () => {
      setBgColor1(bgColor1 === '#255411' ? 'transparent' : '#255411');
      await logPathSelection('2');
      router.push('../path/2')
    }
    const btnf = async () => {
      setBgColor2(bgColor2 === '#163431' ? 'transparent' : '#163431');
      await logPathSelection('1');
      router.push('../path/1')
    }

    const [loaded, error] = useFonts({
        DMSerifDisplay_400Regular,
        Poppins_600SemiBold,
    });

    const account = new Account(client);
    const databases = new Databases(client);

    useEffect(() => {
        const getUser = async () => {
          try {
            const user = await account.get();
            setUserId(user.$id);
            updateStreak(user.$id);
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        };
        getUser();
    }, []);

    const logPathSelection = async (pathId: string) => {
      if (!userId) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'User not found',
        });
        return;
      }

      try {
        await databases.createDocument('67700254003a7728ac47', '67712065003e44192265', 'unique()', {
          userId,
          pathId,
        });
      } catch (error) {
        console.error('Error logging path selection:', error);
      }
    };

    const updateStreak = async (userId: string) => {
      try {
        const response = await databases.listDocuments('67700254003a7728ac47', streakCollectionId, [
          Query.equal('userId', userId)
        ]);
        const streakData = response.documents[0];
        const today = new Date().toISOString().split('T')[0];

        if (streakData) {
          const lastLoginDate = streakData.lastLoginDate.split('T')[0];
          if (lastLoginDate === today) {
            setStreak(streakData.streak);
          } else {
            const newStreak = lastLoginDate === new Date(Date.now() - 86400000).toISOString().split('T')[0] ? streakData.streak + 1 : 1;
            await databases.updateDocument('67700254003a7728ac47', streakCollectionId, streakData.$id, {
              streak: newStreak,
              lastLoginDate: new Date().toISOString()
            });
            setStreak(newStreak);
          }
        } else {
          await databases.createDocument('67700254003a7728ac47', streakCollectionId, 'unique()', {
            userId,
            streak: 1,
            lastLoginDate: new Date().toISOString()
          });
          setStreak(1);
        }
      } catch (error) {
        console.error('Error updating streak:', error);
      }
    };
      
    useEffect(() => {
        if(loaded || error) {
          Splashscreen.hideAsync()
          setLoading(false);
        }
    }, [loaded, error]);

    useFocusEffect(
      React.useCallback(() => {
        setBgColor1('#255411');
        setBgColor2('#163431');
      }, [])
    );

    if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f38ba8" />
          </View>
        );
    }

    const imageSize = width * 0.3; 
    const tipTextMarginTop = height * 0.17; 
    const tipTextMarginBottom = height * 0.1; 
  
    return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Paths</Text>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={24} color="orange" />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
            <View style={styles.svgWrapper}>
              <Svg
                viewBox="0 0 300 300"
                preserveAspectRatio="xMidYMid meet"
                style={styles.absoluteSvg}
              >
                <Path
                  d="M 195 0 Q 100 150 80 300"
                  stroke="white"
                  strokeWidth="5"
                  fill="none"
                />
                <Path
                  d="M 195 0 Q 300 150 300 300"
                  stroke="white"
                  strokeWidth="5"
                  fill="none"
                />
              </Svg>

              <Animated.View entering={FadeIn.delay(0).duration(500)} style={styles.leftImageWrapper}>
                <TouchableOpacity
                  onPress={btnn}
                  style={[styles.imageButton, { backgroundColor: bgColor1, width: imageSize, height: imageSize }]}
                >
                  <Image
                    source={require('@/assets/images/nature.png')}
                    style={[styles.image, { width: imageSize, height: imageSize }]}
                  />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View entering={FadeIn.delay(0).duration(500)} style={styles.rightImageWrapper}>
                <TouchableOpacity
                  onPress={btnf}
                  style={[styles.imageButton, { backgroundColor: bgColor2, width: imageSize, height: imageSize }]}
                >
                  <Image
                    source={require('@/assets/images/lofi.png')}
                    style={[styles.image, { width: imageSize, height: imageSize }]}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
            <Text style={[styles.tiptext, { marginTop: tipTextMarginTop, marginBottom: tipTextMarginBottom }]}>        
              💭 : Don't overthink it. Select whatever image resonate with your current mood.
            </Text>  
          </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(14, 10, 5)',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 80, 
  },
  title: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 35,
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  streakText: {
    color: 'orange',
    fontSize: 26,
    marginLeft: 5,
    fontWeight: 600,
  },
  svgWrapper: {
    position: 'relative',
    width: '80%',
    alignSelf: 'flex-start',
    marginLeft: 0, 
    height: 300,
    alignItems: 'center',
    marginTop: -5,  
  },
  absoluteSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  leftImageWrapper: {
    position: 'absolute',
    bottom: -50,  
    left: 20,       
  },
  rightImageWrapper: {
    position: 'absolute',
    bottom: -50,
    right: -45,    
  },
  imageButton: {
    borderRadius: 30,
  },
  image: {
    borderColor: '#006666',
    borderRadius: 30,
    borderWidth: 1,
  },
  tiptext: {
    fontFamily: Platform.select({
      ios: 'Poppins-SemiBold',
      android: 'Poppins_600SemiBold'
    }),
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e2e',
  },
});
