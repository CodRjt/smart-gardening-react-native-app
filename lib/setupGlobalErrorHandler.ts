import Toast from 'react-native-toast-message'    //ErrorUtils might be shown as red in your IDE ,but ignore it as it will be handled by react-native at runtime 
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()    // ignoring the errors shown by LogBox :::   this is relevant only during development as LogBox errors are automatically snoozed by react-native in production 
export const setupGlobalErrorHandler=()=>{   // below is a custom setup to implement a Error handler at client side using the error display in production
    
    if (!global.ErrorUtils?._customHandlerSet){
        const defaultHandler=global.ErrorUtils?.getGlobalHandler?.()
        global.ErrorUtils?.setGlobalHandler((error:any,isFatal:any)=>{ // custom error handler
            Toast.show({
                type:'error',
                text1:'Unexpected Error',
                text2:error.message
            })
            console.error("Global error caught",error);
            if(defaultHandler){defaultHandler(error,isFatal)};  // calling the defaultHandler only if it existed
        })
        global.ErrorUtils._customHandlerSet=true;
    }
    const originalConsoleError=console.error; // adding the custom error display in the working of default error display
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
    originalConsoleError(...args)  // return to original Console Error to keep the default behaviour of error displaying
    }
}