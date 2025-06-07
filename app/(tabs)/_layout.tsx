import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons'
// import url('https://cdn-uicons.flaticon.com/3.0.0/uicons-bold-rounded/css/uicons-bold-rounded.css');
export default function TabsLayout() {
  return (
  <Tabs  >
    <Tabs.Screen name="index" options={{title: 'My Garden' , tabBarIcon: ()=><MaterialCommunityIcons name="flower" size={24} color="black" />}}  />
    <Tabs.Screen name="add" options={{title: 'Add plant' , tabBarIcon: ()=><Ionicons name="add-circle" size={24} color="black" />}} />
    <Tabs.Screen name="initializeIp" options={{title: 'Initialize IP ' , tabBarIcon: ()=><Ionicons name="settings" size={24} color="black" />}} />
  </Tabs>
    );
}
