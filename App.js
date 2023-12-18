import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './ChatScreen';
import OmegleScreen from './OmegleScreen';

function HomeScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Text>Welcome to Home Screen!</Text>
        <Button
          title="Group Chat"
          onPress={() => navigation.navigate('Chat')}
        />
        <Button
          title="Text Chat"
          onPress={() => navigation.navigate('Omegle')}
        />
      </View>
    );
  }
  
  const Stack = createStackNavigator();
  
  export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Omegle" component={OmegleScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });