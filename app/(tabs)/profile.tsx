import { useAuth } from '@clerk/expo'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  const {signOut} = useAuth()
  const router = useRouter()

  const handleSignout = async ()=>{
    try {
      await signOut()
      router.replace("/sign-in")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }
  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <TouchableOpacity onPress={handleSignout}>
        <Text>Signout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Profile