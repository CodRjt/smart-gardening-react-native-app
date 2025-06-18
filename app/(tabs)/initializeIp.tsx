import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
export default function initIp() {
    const [deviceId,setDeviceId]=useState<string>("")
    const registerFCM=async (deviceId : string)=>{
        if (Device.isDevice){
            try{
                const {status : exsistingStatus}=await Notifications.getPermissionsAsync();
                let finalStatus=exsistingStatus
                if (exsistingStatus !== "granted"){
                    const {status}=await Notifications.requestPermissionsAsync()
                    finalStatus=status
                }
                
                if (finalStatus!=='granted'){
                    console.log("permission not granted");
                    return
                }
                const mToken= (await Notifications.getExpoPushTokenAsync()).data;
                console.log("messaging token",mToken);
                try {
                const response = await fetch('http://doctor-url/add_token', {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({
                    device_id:deviceId,
                    token:mToken
                }),
                });
                if (!response.ok){
                    const errorText= await response.text();
                    throw new Error(`server responded with ${response.status}: ${errorText} `)
                }
                const data= await response.json();
                console.log("fms token initialized successfully ",data)
            } catch (error) {
                console.error(error);
            }
    }   
         catch(err: any){
            console.error("Error registering token:",err.message)
         }
        } else{
            alert(' Push notifications are allowed on physical devices only')
        }
    }
    const checkIfIpExsists=async(ip:string):Promise<boolean>=>{
    const controller= new AbortController();
    const timeout=setTimeout(()=>controller.abort(),3000)
      try{
    const response= await fetch(`http:\\${Ip}:5000`,{
      method:'GET',
      signal:controller.signal,
    });
    if (response.ok) {
        const data=await response.json()
        setDeviceId(data.device_id)
        registerFCM(deviceId)
    }

        
    clearTimeout(timeout)
    return response.ok;
  }catch(error){
    clearTimeout(timeout)
    return false
  }
}
    const [Ip, setIp] = useState<string>("192.168.39.34")
    return (
        <>
            <View style={{ flex: 1, alignSelf: "center", height: 10, width: "90%", marginTop: 20, justifyContent: "center" }}>
                <TextInput
                    value={Ip}
                    label={"IP Address"}
                    placeholder="Enter IP of Raspberry Pi"
                    onChangeText={setIp}
                    mode="outlined"
                />
                <Button style={{ marginTop: 10 }}
                    mode="contained"
                    onPress={async () => {
                        const response=await checkIfIpExsists(Ip)
                        if (response) {
                            // Save the IP address to storage or state management
                            router.replace({
                                pathname: "/",
                                params: { ip: Ip },
                            });
                        } else {
                            console.error("Please enter a valid IP address.");
                        }
                    }}
                >
                    Initialize
                </Button>
            </View>

        </>
    )
}
