import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons'
export default function TabsLayout() {
  return (
  <Tabs  >
    <Tabs.Screen name="index" options={{title: 'My Garden' ,headerShown:false, tabBarIcon: ()=><MaterialCommunityIcons name="flower" size={24} color="black" />}}  />
    <Tabs.Screen name="add" options={{title: 'Add plant' ,headerShown:false,tabBarIcon: ()=><Ionicons name="add-circle" size={24} color="black" />}} />
    <Tabs.Screen name="initializeIp" options={{title: 'Initialize IP ' , tabBarIcon: ()=><Ionicons name="settings" size={24} color="black" />}} />
  </Tabs>
    );
}
