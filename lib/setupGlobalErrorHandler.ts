import Toast from 'react-native-toast-message'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()
export const setupGlobalErrorHandler=()=>{
 
    if (!global.ErrorUtils?._customHandlerSet){
        const defaultHandler=global.ErrorUtils?.getGlobalHandler?.()
        global.ErrorUtils?.setGlobalHandler((error:any,isFatal:any)=>{
            Toast.show({
                type:'error',
                text1:'Unexpected Error',
                text2:error.message
            })
            console.error("Global error caught",error);
            if(defaultHandler){defaultHandler(error,isFatal)};
        })
        global.ErrorUtils._customHandlerSet=true;
    }
    const originalConsoleError=console.error;
    console.error=(...args)=>{
        const message=args.join(" ")
        if (message.includes("Realtime")){
            Toast.show({
                type:"error",
                text1:"Network Error",
                text2:"Please check your Internet Connection"
            })
        }
        else if (message.includes("Please enter a valid IP address")){
            Toast.show({
                type:"error",
                text1:"IP Error",
                text2:"Please enter a valid IP address"
            })
        }
        else if (message.includes("Plant cannot be watered without initialzing the IP")){
            Toast.show({
                type:"error",
                text1:"IP uninitialized",
                text2:"Please initialize IP before manual watering"
            })
        }
        else if(message.includes("Network error")){
            Toast.show(
                {
                type:"error",
                text1:"IP error",
                text2:"Please check if IP is correct"
            }
            )
        }
    originalConsoleError(...args)
    }
}