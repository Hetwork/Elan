import { Tabs } from 'expo-router';
import {FontAwesome} from '@expo/vector-icons';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#1d304b',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#DFE0ED' },
        tabBarInactiveTintColor: '#abb5c3',
        tabBarActiveTintColor: '#104A9c',
        
      }}>
      <Tabs.Screen
        name="AdminHome"
        options={{
          title: "home",
          tabBarIcon: ({ color }) => <FontAwesome name="cab" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="AdminProfile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color}/>,
        }}
      />
      
    </Tabs>
  );
}
