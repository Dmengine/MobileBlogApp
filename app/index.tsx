import { Redirect } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function index() {
  return (
    <View>
      {/* <Text className='text-red-500 text-lg'>index tab</Text> */}
      <Redirect href={"/(auth)/Login"}/>
    </View>
  )
}

const styles = StyleSheet.create({})