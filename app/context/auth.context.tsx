import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, ReactNode, useEffect} from 'react'

interface AuthContextType {
    // user: string | null;
    // login: (username: string) => void;
    // logout: () => void;
    token: string | null;
    
}

interface AuthProviderProps {
    _id: string,
    name: string,
    email: string,
    password: string,
    createdAt: string,
    updatedAt: string,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children } : {children: ReactNode}) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthProviderProps | null>(null);

    const userInfo = async () => {
        const user = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');

        if( user && token) {
            setUser(JSON.parse(user));
            setToken(token);
        }

        console.log('userInfo', user, token);
    }

    useEffect(() => {
        userInfo();
    }, [])
    

    // const login = (username: string) => {
    //     setUser(username);
    // }

    // const logout = () => {
    //     setUser(null);
    // }
  return (
    <AuthContext.Provider value={{ token }}>
        {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}