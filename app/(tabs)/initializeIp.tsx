import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
export default function initIp() {
    const checkIfIpExsists=async(ip:string):Promise<boolean>=>{
    const controller= new AbortController();
    const timeout=setTimeout(()=>controller.abort(),3000)  // abort quickly if the IP is invalid , does not make the user to wait for too long
      try{
    const response= await fetch(`http:\\${Ip}:5000`,{
      method:'GET',
      signal:controller.signal,// controller sends a signal and aborts the fetch request if timeout is reached
    });
    clearTimeout(timeout)//clear the timeout if the request is accepted withing 3 sec
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
                                params: { ip: Ip },// send the ip address as a parameter
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
