import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Dimensions } from 'react-native';
import { Account, Databases, Query } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';
import Toast from 'react-native-toast-message';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const { height, width} = Dimensions.get('window');

const Friends = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [friendId, setFriendId] = useState<string>('');
  const [friendName, setFriendName] = useState<string>('');
  const [friends, setFriends] = useState<{ id: string, name: string }[]>([]);
  const router = useRouter();

  const account = new Account(client);
  const databases = new Databases(client);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
        loadFriends(user.$id);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    getUser();
  }, []);

  const loadFriends = async (userId: string) => {
    try {
      const response = await databases.listDocuments('67700254003a7728ac47', '67766edb000a2cda3687', [
        Query.equal('userId', userId)
      ]);
      if (response.documents.length > 0) {
        setFriends(response.documents[0].friends.map((friend: string) => JSON.parse(friend)));
      }
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const addFriend = async () => {
    if (!friendId.trim() || !friendName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Friend ID and Name cannot be empty',
      });
      return;
    }

    if (friends.some(friend => friend.id === friendId)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Friend already added',
      });
      return;
    }

    try {
      const updatedFriends = [...friends, { id: friendId, name: friendName }];
      setFriends(updatedFriends);

      const response = await databases.listDocuments('67700254003a7728ac47', '67766edb000a2cda3687', [
        Query.equal('userId', userId as string)
      ]);

      if (response.documents.length > 0) {
        await databases.updateDocument('67700254003a7728ac47', '67766edb000a2cda3687', response.documents[0].$id, {
          friends: updatedFriends.map(friend => JSON.stringify(friend))
        });
      } else {
        await databases.createDocument('67700254003a7728ac47', '67766edb000a2cda3687', 'unique()', {
          userId,
          friends: updatedFriends.map(friend => JSON.stringify(friend))
        });
      }

      Toast.show({
        type: 'success',
        text1: 'Friend Added',
        text2: 'Friend added successfully',
      });
      setFriendId('');
      setFriendName('');
    } catch (error) {
      console.error('Error adding friend:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add friend',
      });
    }
  };

  const removeFriend = async (friendId: string) => {
    Alert.alert(
      'Remove Friend',
      'Are you sure you want to remove this friend?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              const updatedFriends = friends.filter(friend => friend.id !== friendId);
              setFriends(updatedFriends);

              const response = await databases.listDocuments('67700254003a7728ac47', '67766edb000a2cda3687', [
                Query.equal('userId', userId as string)
              ]);

              if (response.documents.length > 0) {
                await databases.updateDocument('67700254003a7728ac47', '67766edb000a2cda3687', response.documents[0].$id, {
                  friends: updatedFriends.map(friend => JSON.stringify(friend))
                });
              }

              Toast.show({
                type: 'success',
                text1: 'Friend Removed',
                text2: 'Friend removed successfully',
              });
            } catch (error) {
              console.error('Error removing friend:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to remove friend',
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const viewFriendStats = (friendId: string) => {
    router.push(`/stats/${friendId}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false}}/>
      <Text></Text>
      <Text></Text>
      
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={32} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Friends</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Friend ID"
        placeholderTextColor="#888"
        value={friendId}
        onChangeText={setFriendId}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Friend Name"
        placeholderTextColor="#888"
        value={friendName}
        onChangeText={setFriendName}
      />
      <TouchableOpacity style={styles.addButton} onPress={addFriend}>
        <Text style={styles.addButtonText}>Add Friend</Text>
      </TouchableOpacity>
      <Text style={styles.friendguide}>Ask your friend to go to their usider app settings and copy & share their i'd with you</Text>
      <Text></Text>
      <Text style={styles.friendguide}>Click on friend name to see their stats!</Text>
      <Text></Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendContainer} key={item.id}>
            <TouchableOpacity onPress={() => viewFriendStats(item.id)}>
              <Text style={styles.friendText}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeFriend(item.id)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Toast />
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#cdd6f4',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#3B4252',
    color: '#D8DEE9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#88C0D0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#2E3440',
    fontWeight: '600',
  },
  friendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(91, 96, 161, 0.2)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  friendText: {
    color: '#D8DEE9',
    fontWeight: '700',
    fontSize: 15,
  },
  friendguide :{
    color: '#ffffff',
    fontWeight : '700',
    fontSize: 14,
    textAlign: 'center',

  },
  removeButton: {
    color: '#BF616A',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    zIndex: 1,
  },
});
