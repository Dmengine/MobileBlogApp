import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Dimensions, Image, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useAuth } from '../context/auth.context';

export default function Login() {
    const {width, height} = Dimensions.get('window')
    const { token } = useAuth();
    const router = useRouter();

    if (token) {
        return <Redirect href='/(tabs)'/>
    }

    const schema = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        password: z.string().min(1, { message: "Password is required" }),
    })

    type formSchemaType = z.infer<typeof schema>
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<formSchemaType>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (formData: formSchemaType) => {
        
        console.log('Form Data:', formData);
        try {
        const response = await fetch('http://192.168.0.115:9000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email:formData.name,
                password:formData.password,
            })
        })
        const data = await response.json();
        console.log('Login successful:', data);
       if(data.success === true) {
            await AsyncStorage.setItem('token', JSON.stringify(data.token));
            await AsyncStorage.setItem('user', JSON.stringify(data.data));
            Alert.alert('Login successful')
            router.push('/(tabs)');
        }
        else {
            Alert.alert('Login failed', data.message || 'Please try again');
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
    };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, padding: 22 }}>
            <View className='items-center justify-center'>
                    <View style={{width: width*0.6, height:height*0.4}} className='mx-auto'>
                        <Image
                        resizeMode='cover'
                        className='w-full h-full'
                        source={require('../../assets/images/Mobile login-bro.png')}
                        />
                    <View>
                    <Text className='text-lg font-bold text-black'>Name</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                mode='outlined'
                                placeholder='Enter your name'
                                className='w-full rounded-lg border-2 border-grey-500 outline-none'
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.name && <Text style={{color: 'red'}}>{errors.name.message}</Text>}
                    </View>
                    <View className='mt-4 mb-4'>
                    <Text className='text-lg font-bold text-black'>Password</Text>
                    <Controller 
                        control = {control}
                        name='password'
                        render={({ field: { onChange, onBlur, value }}) => (
                            <TextInput
                            mode='outlined'
                            placeholder='Enter your password'
                            className='w-full rounded-lg border-2 border-grey-500 outline-none'
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            secureTextEntry={true}
                            error={!!errors.password}
                            />
                        )}
                    />
                    {errors.password && <Text style={{color: 'red', marginTop: 4}}>{errors.password.message}</Text>}
                    </View>
                    <Button
                    mode='contained'
                    className='w-full mt-2 rounded-lg items-center justify-center'
                    onPress={handleSubmit(onSubmit)}
                    >Login</Button>
                    <Text style={{ color: '#64748b', marginTop: 8 }}>
                        Don't have an account?{' '}
                        <Text
                        style={{ color: '#2563eb', fontWeight: 'bold' }}
                        onPress={() => router.push('/(auth)/Register')}
                        >
                        Register
                        </Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({})