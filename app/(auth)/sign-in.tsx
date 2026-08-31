import { useAuth, useSignIn } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import React, { Reducer, useReducer } from 'react'
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

type State = {
   
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

const SignIn = () => {
    const {signIn, errors, fetchStatus} = useSignIn()
    const {isSignedIn} = useAuth()
    const [state, dispatch] = useReducer(reducer, initialState)
    const router = useRouter();
    const isLoading = fetchStatus === "fetching"

  

    const onSignInPress = async ()=>{
        const {error} = await signIn.password({
            emailAddress: state.email,
            password: state.password,
        })
        if(error){
            alert(error.message)
            return
        }
        if(signIn.status === "complete"){
          await signIn.finalize({
            navigate: ({session, decorateUrl})=>{

              if(session?.currentTask){
                console.log(session.currentTask)
                return
              }
              const url = decorateUrl("/(tabs)")
              router.replace(url as any)

            }
          })
        }else if (signIn.status === "needs_second_factor"){
          await signIn.mfa.sendPhoneCode()
        }else if(signIn.status === "needs_client_trust"){
          const emailCodeFactor = signIn.supportedSecondFactors.find(
            (factor)=> factor.strategy === "email_code"
          )
          if(emailCodeFactor){
            await signIn.mfa.sendEmailCode();
          }
        }else{
          console.error("Sign-in attempt not complete", signIn)
        }
    }
    const onVerifyPress = async ()=>{

        await signIn.mfa.verifyEmailCode({
            code: state.code
        })

        if(signIn.status === "complete"){
           await signIn.finalize({
            navigate: ({session, decorateUrl})=>{

              if(session?.currentTask){
                console.log(session.currentTask)
                return
              }
              const url = decorateUrl("/(tabs)")
              router.replace(url as any)

            }
          })
        }

    }

     if(signIn.status === "needs_client_trust"
          
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
                    onPress={()=> signIn.mfa.sendEmailCode()}
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
                Welcome back
            </Text>
            <Text className=' text-gray-800 mb-2'>
               Sign in to your account
            </Text>
            
            
            

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
                errors.fields.identifier && (
                    <Text className='text-red-500 mb-4'>
                        {errors.fields.identifier.message}
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
                onPress={onSignInPress}
                disabled={isLoading}
                className='w-full bg-blue-500 py-4 rounded-xl items-center mb-4'
            >
                {
                    isLoading? <ActivityIndicator color="white" />
                    : (
                        <Text className='text-white font-bold text-base'>Sign in</Text>
                    )
                }

            </TouchableOpacity>
            <View className='flex-row justify-center gap-1'>
               
                <Link href={"/sign-up"}>
                    <Text className='text-blue-600 font-semibold'>Don't have an account? Sign Up</Text>
                </Link>

            </View>
            

            <View nativeID='clerk-captcha' />


        </View>

    </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default SignIn