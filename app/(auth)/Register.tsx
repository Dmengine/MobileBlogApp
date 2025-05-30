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
        if (data.token) {
          await AsyncStorage.setItem('token', JSON.stringify(data.token));
        }
        if (data.data) {
          await AsyncStorage.setItem('user', JSON.stringify(data.data));
        }
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
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 40, color: '#2563eb', fontWeight: 'bold', marginTop: 40, letterSpacing: 2, marginBottom: 10 }}>
          Register
        </Text>
        <Text style={{ color: '#64748b', fontSize: 16, marginBottom: 30 }}>
          Create your account to get started
        </Text>
        <View style={{ marginTop: 10, width: 340 }}>
          <Text style={{ marginBottom: 4, color: '#334155', fontWeight: '600' }}>Name</Text>
          <Controller 
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                placeholder="Enter your name"
                style={{ backgroundColor: '#fff', marginBottom: 2 }}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.name}
                outlineColor="#cbd5e1"
                activeOutlineColor="#2563eb"
              />
            )}
          />
          {errors.name && (
            <Text style={{ color: '#ef4444', marginBottom: 4 }}>{errors.name.message}</Text>
          )}
        </View>
        <View style={{ marginTop: 16, width: 340 }}>
          <Text style={{ marginBottom: 4, color: '#334155', fontWeight: '600' }}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                placeholder="Enter your email"
                style={{ backgroundColor: '#fff', marginBottom: 2 }}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.email}
                autoCapitalize="none"
                keyboardType="email-address"
                outlineColor="#cbd5e1"
                activeOutlineColor="#2563eb"
              />
            )}
          />
          {errors.email && (
            <Text style={{ color: '#ef4444', marginBottom: 4 }}>{errors.email.message}</Text>
          )}
        </View>
        <View style={{ marginTop: 16, marginBottom: 24, width: 340 }}>
          <Text style={{ marginBottom: 4, color: '#334155', fontWeight: '600' }}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                placeholder="Enter your password"
                secureTextEntry={true}
                style={{ backgroundColor: '#fff', marginBottom: 2 }}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.password}
                outlineColor="#cbd5e1"
                activeOutlineColor="#2563eb"
              />
            )}
          />
          {errors.password && (
            <Text style={{ color: '#ef4444', marginBottom: 4 }}>{errors.password.message}</Text>
          )}
        </View>
        <Button 
          mode='contained'
          onPress={handleSubmit(onSubmit)}
          style={{
            width: 340,
            height: 64,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: '#2563eb',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            marginBottom: 10,
          }}
          labelStyle={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 1, color: '#fff' }}
        >
          Register
        </Button>
        <Text style={{ color: '#64748b', marginTop: 8 }}>
          Already have an account?{' '}
          <Text
            style={{ color: '#2563eb', fontWeight: 'bold' }}
            onPress={() => router.push('/(auth)/Login')}
          >
            Login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  </SafeAreaProvider>
  )
}

export default index

const styles = StyleSheet.create({})