import React from 'react';
import { Alert, StyleSheet, Text, View,} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const index = () => {
  const router = useRouter();

  const schema = z.object({
    name: z.string().min(1, { message: "Name is required"}),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  })

  type formSchemaType = z.infer<typeof schema>;
  const {
    handleSubmit,
    control,
    formState: { errors},
  } = useForm<formSchemaType>({
    resolver: zodResolver(schema),})

    const onSubmit = async (regData: formSchemaType) => {
    console.log('Reg Data:', regData);
    try {
      const response = await fetch('http://192.168.0.115:9000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: regData.name,
          email: regData.email,
          password: regData.password,
        })
      })
      const data = await response.json();
      console.log('Registration successful:', data);
      if(data.success === true) {
        await AsyncStorage.setItem('token', JSON.stringify(data.token));
        await AsyncStorage.setItem('user', JSON.stringify(data.data));
        Alert.alert('Registration successful');
        router.push('/(auth)/Login');
      }
      else {
        Alert.alert('Registration failed', data.message || 'Please try again');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration failed', 'An error occurred. Please try again.');
    }
    }


  return (
    <SafeAreaProvider style={{ flex: 1}}>
      <SafeAreaView style={{ flex: 1}}>
        <View className='items-center justify-center bg-grey-100'>
          <Text className='text-7xl text-blue-500 mt-20'>Register</Text>
          <View className='mt-10'>
            <Text>Name</Text>
            <Controller 
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Enter your name"
                  style={{ width: 300, height: 50 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Text style={{ color: 'red' }}>{errors.name.message}</Text>
            )}
          </View>
          <View className='mt-10'>
            <Text>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Enter your email"
                  style={{ width: 300, height: 50 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={!!errors.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              )}
            />
            {errors.email && (
              <Text style={{ color: 'red' }}>{errors.email.message}</Text>
            )}
          </View>
          <View className='mt-10 mb-8'>
            <Text>Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  style={{ width: 300, height: 50 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={!!errors.password}
                />
              )}
            />
            {errors.password && (
              <Text style={{ color: 'red' }}>{errors.password.message}</Text>
            )}
          </View>
          <Button 
            mode='contained'
            className='w-full'
            onPress={handleSubmit(onSubmit)}
          >
            Register
          </Button>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default index

const styles = StyleSheet.create({})