import { useAuth, useSignUp } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import React, { Reducer, useReducer } from 'react'
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

type State = {
    firstName: string
    lastName: string
    email: string
    password: string
    code: string
}
type Action = {
    type: "set-data",
    name: keyof State
    value: string
}

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    code: ""
}

const reducer: Reducer<State, Action> = (state, action)=>{

    switch(action.type){
        case 'set-data':
            return {
                ...state,
                [action.name]: action.value
            }
        default: 
            return state
    }


}

const SignUp = () => {
    const {signUp, errors, fetchStatus} = useSignUp()
    const {isSignedIn} = useAuth()
    const [state, dispatch] = useReducer(reducer, initialState)
    const router = useRouter();
    const isLoading = fetchStatus === "fetching"

    if(signUp.status === "complete" || isSignedIn){
        return null
    }

    const onSignupPress = async ()=>{
        const {error} = await signUp.password({
            emailAddress: state.email,
            password: state.password,
            firstName: state.firstName,
            lastName: state.lastName
        })
        if(error){
            alert(error.message)
            return
        }
        if(!error){
             await signUp.verifications.sendEmailCode()
        }
    }

    const onVerifyPress = async ()=>{

        await signUp.verifications.verifyEmailCode({
            code: state.code
        })

        if(signUp.status === "complete"){
            await signUp.finalize({
                navigate: ({decorateUrl})=>{
                    const url = decorateUrl("/")
                    router.replace(url as any)
                }
            })
        }

    }

    const resetSignUp = async ()=>{
        await signUp.reset()
    }
  

    if(signUp.status === "missing_requirements"
        && signUp.unverifiedFields.includes("email_address") &&
        signUp.missingFields.length === 0
    ){
        return (
            <View className='flex-1 justify-center px-6 py-12'>
            <Image 
                source={require("../../assets/images/kribb.png")}
                className='w-32 h-16 mb-8'
                resizeMode='contain'
            
            />
            <Text className='text-3xl font-bold text-gray-800 mb-2'>
               Verify your account(" ")
            </Text>
            <Text className=' text-gray-800 mb-2'>
                We sent an email to {state.email}
            </Text>
            
            
            <View className='flex-row gap-3 mb-4'>
                <TextInput 
                    className='flex-1 border border-gray-300 rounded-xl px-4 py-3'
                    placeholder='Enter verification code'
                    placeholderTextColor={"#9CA3AF"}
                    keyboardType='number-pad'
                    value={state.code}
                    onChangeText={(e)=> dispatch({type: "set-data", name:"code", value: e}) }
                    
                />
                 {
                errors.fields.code && (
                    <Text className='text-red-500 mb-4'>
                        {errors.fields.code.message}
                    </Text>
                )
            }
            </View>
            <TouchableOpacity
                onPress={onVerifyPress}
                disabled={isLoading}
                className='w-full bg-blue-500 py-4 rounded-xl items-center mb-4'
            >
                {
                    isLoading? <ActivityIndicator color="white" />
                    : (
                        <Text className='text-white font-bold text-base'>Verify</Text>
                    )
                }

            </TouchableOpacity>
            <TouchableOpacity
                onPress={()=> signUp.verifications.sendEmailCode()}
                disabled={isLoading}
                className='py-2'
            >
                {
                    isLoading? <ActivityIndicator color="white" />
                    : (
                        <Text className='text-gray-700 font-bold text-base'>Resend code</Text>
                    )
                }

            </TouchableOpacity>
            <TouchableOpacity
                onPress={resetSignUp}
                disabled={isLoading}
                className='py-2'
            >
                {
                    isLoading? <ActivityIndicator color="white" />
                    : (
                        <Text className='text-gray-700 font-bold text-base'>Use a different email</Text>
                    )
                }

            </TouchableOpacity>
        </View>
                
        )
    }
  return (
    <KeyboardAvoidingView
    className="flex-1"
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView contentContainerStyle={{flexGrow: 1}}
        className='bg-white'
        keyboardShouldPersistTaps="handled"
    >
        <View className='flex-1 justify-center px-6 py-12'>
            <Image 
                source={require("../../assets/images/kribb.png")}
                className='w-32 h-16 mb-8'
                resizeMode='contain'
            
            />
            <Text className='text-3xl font-bold text-gray-800 mb-2'>
                Create account
            </Text>
            <Text className=' text-gray-800 mb-2'>
                Find you dream home today
            </Text>
            
            
            <View className='flex-row gap-3 mb-4'>
                <TextInput 
                    className='flex-1 border border-gray-300 rounded-xl px-4 py-3'
                    placeholder='First name'
                    placeholderTextColor={"#9CA3AF"}
                    autoCapitalize='words'
                    value={state.firstName}
                    onChangeText={(e)=> dispatch({type: "set-data", name:"firstName", value: e}) }
                    
                />
                <TextInput 
                    className='flex-1 border border-gray-300 rounded-xl px-4 py-3'
                    placeholder='Last name'
                    placeholderTextColor={"#9CA3AF"}
                    autoCapitalize='words'
                    value={state.lastName}
                    onChangeText={(e)=> dispatch({type: "set-data", name:"lastName", value: e}) }
                    
                />
            </View>

            <TextInput 
                className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-4'
                placeholder='Email Address'
                placeholderTextColor={"#9CA3AF"}
                autoCapitalize='none'
                value={state.email}
                onChangeText={(e)=> dispatch({type: "set-data", name:"email", value: e}) }
                keyboardType='email-address'

                
            />
            {
                errors.fields.emailAddress && (
                    <Text className='text-red-500 mb-4'>
                        {errors.fields.emailAddress.message}
                    </Text>
                )
            }

             <TextInput 
                className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-4'
                placeholder='Password'
                placeholderTextColor={"#9CA3AF"}
               
                value={state.password}
                onChangeText={(e)=> dispatch({type: "set-data", name:"password", value: e}) }
                secureTextEntry

                
            />
             {
                errors.fields.password && (
                    <Text className='text-red-500 mb-4'>
                        {errors.fields.password.message}
                    </Text>
                )
            }
            <TouchableOpacity
                onPress={onSignupPress}
                disabled={isLoading}
                className='w-full bg-blue-500 py-4 rounded-xl items-center mb-4'
            >
                {
                    isLoading? <ActivityIndicator color="white" />
                    : (
                        <Text className='text-white font-bold text-base'>Sign Up</Text>
                    )
                }

            </TouchableOpacity>
            <View className='flex-row justify-center gap-1'>
               
                <Link href={"/sign-in"}>
                    <Text className='text-blue-600 font-semibold'>Already have an account? Sign In</Text>
                </Link>

            </View>
            

            <View nativeID='clerk-captcha' />


        </View>

    </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignUp