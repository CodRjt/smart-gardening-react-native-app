import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    isLoadingUser: boolean;
    signin: (email: string, password: string) => Promise<string | null>;
    signup: (email: string, password: string) => Promise<string | null>;
    signout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    const getUser = async () => {
        try {
            const userData = await account.get();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const signin = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email.trim(), password.trim());
            const session = await account.get();
            setUser(session);
            await getUser();
            return null;
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
            return "An unknown error occurred during sign-in.";
        }
    };

    const signup = async (email: string, password: string) => {
        try {
            await account.create(ID.unique(), email.trim(), password.trim());
            await signin(email, password); // Auto-login after signup
            return null;
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
            return "An unknown error occurred during sign-up.";
        }
    };

    const signout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoadingUser, signup, signin, signout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
