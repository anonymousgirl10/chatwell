import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { v4 as uuidv4 } from 'uuid';
import { View, Text, Button, TextInput, ScrollView, StyleSheet } from 'react-native';


const firebaseConfig = {
    apiKey: "AIzaSyCR8YftV3NFxj4EOWK9CUg7qyBYUIQDJxw",
    authDomain: "chatwell-f6d64.firebaseapp.com",
    databaseURL: "https://chatwell-f6d64-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chatwell-f6d64",
    storageBucket: "chatwell-f6d64.appspot.com",
    messagingSenderId: "840890098692",
    appId: "1:840890098692:web:2964f92d61f78f2c5f4151",
    measurementId: "G-HFFK6220FT"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  const db = firebase.firestore();
  
  const App = () => {
    const [userId, setUserId] = useState('');
    const [chatRoomId, setChatRoomId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      const id = Math.random().toString(36).substring(2);
      setUserId(id);
      db.collection('users').doc(id).set({});
    }, []);
  
    useEffect(() => {
      if (chatRoomId) {
        const unsubscribe = db.collection('chatRooms').doc(chatRoomId).collection('messages')
          .orderBy('createdAt')
          .onSnapshot((snapshot) => {
            const newMessages = snapshot.docs.map((doc) => doc.data());
            setMessages(newMessages);
          });
        return unsubscribe;
      }
    }, [chatRoomId]);
  
    const startChat = async () => {
      const chatRoomsRef = db.collection('chatRooms');
      const snapshot = await chatRoomsRef.where('userCount', '<', 2).limit(1).get();
      if (!snapshot.empty) {
        // Join the existing chat room
        const chatRoomRef = snapshot.docs[0].ref;
        await chatRoomRef.update({
          userCount: firebase.firestore.FieldValue.increment(1),
        });
        setChatRoomId(chatRoomRef.id);
      } else {
        // Create a new chat room
        const chatRoomRef = await chatRoomsRef.add({ userCount: 1, messages: [] });
        setChatRoomId(chatRoomRef.id);
      }
    };
  
    const sendMessage = async () => {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const newMessage = { text: message, createdAt: timestamp };
      await db.collection('chatRooms').doc(chatRoomId).collection('messages').add(newMessage);
      setMessage('');
    };
  
    const endChat = async () => {
      await db.collection('chatRooms').doc(chatRoomId).update({
        userCount: firebase.firestore.FieldValue.increment(-1),
      });
      setMessages([]);
      setChatRoomId('');
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>User ID: {userId}</Text>
          <Text style={styles.headerText}>Chat Room ID: {chatRoomId}</Text>
          <Button title="Start Chat" onPress={startChat} style={styles.startButton} />
        </View>
        <ScrollView style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <View key={index} style={styles.messageBox}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            value={message} 
            onChangeText={setMessage} 
            placeholder="Type your message here..." 
          />
          <View style={styles.buttonContainer}>
            <Button title="Send Message" onPress={sendMessage} style={styles.sendButton} />
            <Button title="End Chat" onPress={endChat} style={styles.endButton} />
          </View>
        </View>
      </View>
    );
    
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#f5f5f5',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 5,
    },
    headerText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    startButton: {
      backgroundColor: '#4CAF50',
      color: '#fff',
    },
    messagesContainer: {
      flex: 1,
      marginTop: 10,
    },
    messageBox: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 10,
      marginVertical: 5,
      borderColor: '#ddd',
      borderWidth: 1,
    },
    messageText: {
      fontSize: 14,
      color: '#333',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 5,
    },
    input: {
      flex: 1,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      backgroundColor: '#f5f5f5',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    sendButton: {
      backgroundColor: '#4CAF50',
      color: '#fff',
    },
    endButton: {
      backgroundColor: '#f44336',
      color: '#fff',
    },
  });
  
  export default App;