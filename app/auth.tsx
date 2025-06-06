import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context"; // Adjust the import path as necessary
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform,StyleSheet,Text} from "react-native";
import { TextInput ,Button,useTheme} from "react-native-paper";
export default function auth() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const theme = useTheme();
    const {user,signin,signup} = useAuth(); // Assuming you have a useAuth hook to handle authentication
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Replace with your authentication logic
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        // Check if the user is authenticated
        if (user) {
            setIsAuthenticated(true);
        }
    }, [user]);

   async function handleLogin() {
    (email && password) ? setError(null) : setError("Please fill in all fields");
    console.log("email:", email, "password:", password);
    console.log("isAuthenticated:", user);
    if(isAuthenticated) {
       const error=await signup(email, password);
       if(error) {
           setError(error);
       }
    }
   
    else{
         const error=await signin(email, password);
         if(error) {
              setError(error);
         }
         else{
              router.push("/auth");
         }
    }
}
    function handleSwitchMode(){
        setIsAuthenticated(prev => !prev);
    }

    return (
        <>
           
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    label={"Email"}
                    placeholder="example@gmail.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    mode="outlined"
                placeholderTextColor={"#999"}
                style={styles.input}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                label="Password"
                placeholder="Password"
                secureTextEntry={!showPassword}
                mode="outlined"
                placeholderTextColor={"#999"}
                style={styles.input}
                right={
                    <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            {error && <Text style={{ color: "red" }}>{error}</Text>}
               <Button mode="contained" style={styles.button} onPress={handleLogin}   >
                    {isAuthenticated ? "Sign Up" : "Login"}
               </Button>
                <Button  onPress={handleSwitchMode}>
                    {isAuthenticated ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </Button>
        </KeyboardAvoidingView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        width: "80%",
        marginBottom: 16,
        
        alignSelf: "center",
    },
    button: {
        width: "80%",
        marginTop: 16,
        alignSelf: "center",
    },
})