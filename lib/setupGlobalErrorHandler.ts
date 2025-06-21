import Toast from 'react-native-toast-message'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()
export const setupGlobalErrorHandler=()=>{
    if (!global.ErrorUtils?._customHandlerSet){
        const defaultHandler=global.ErroUtils?.getGlobalHandler?.()
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
        else if (message.includes("IP")){
            Toast.show({
                type:"error",
                text1:"IP Error",
                text2:"Please enter a vaild IP address"
            })
        }
    originalConsoleError(...args)
    }
}