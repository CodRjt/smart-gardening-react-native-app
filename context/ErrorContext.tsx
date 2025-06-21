// import React,{useContext,createContext,useState, SetStateAction, Children} from "react";
// import { ErrorInfo} from "@/types/types";

// const ErrorContext =createContext<{
//     errorInfo:ErrorInfo|null;
//     setErrorInfo:React.Dispatch<SetStateAction<ErrorInfo|null>>;
// }>({
//     errorInfo:null,
//     setErrorInfo:()=>{},

// })  
// export const ErrorProvider=({children}:{children:React.ReactNode})=>{
//     const [errorInfo,setErrorInfo]=useState<ErrorInfo|null>(null)
//     global.__CUSTOM_ERROR_HANDLER=(error:Error,isFatal:boolean)=>{
//         setErrorInfo({error,isFatal})
//     }
//     return (
//         <ErrorContext.Provider value={{errorInfo,setErrorInfo}}>
//             {children}
//         </ErrorContext.Provider>
//     )
// }
// export function useGlobalError(){
//     const ucontext=useContext(ErrorContext);
//     if(!ucontext){
//         throw new Error(
//             "useGlobalError must be initialized within ErrorProvider"
//         )
//     }
//     return ucontext
// }