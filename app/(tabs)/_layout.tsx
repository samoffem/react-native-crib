import { Ionicons } from "@expo/vector-icons";

import { Tabs } from "expo-router";
import { View } from "react-native";


const TabLayout = ()=>{



    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 20,
                    height: 70,
                    marginHorizontal: 20,
                    backgroundColor: "#ffffff",
                    borderRadius: 32,
                    borderTopWidth: 0,
                    elevation: 0,

                },
                tabBarIconStyle: {
                    width: 40,
                    height: 40,
                    alignItems: "center",
                },
                 tabBarItemStyle: {
                    paddingVertical: 10
                }
               

            }}
            
        >
           
                <Tabs.Screen 
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ focused, color, size }) => (
                            <View
                                className={`rounded-[32px] w-20 h-[40px] p-2 items-center justify-center ${
                                focused ? "bg-black/10" : "bg-transparent"
                                }`}
                            >
                                <Ionicons name="home" color={color} size={size} />
                            </View>
                    )
                    }} 
                />
                <Tabs.Screen 
                    name="search"
                    options={{
                        title: "Search",
                        tabBarIcon: ({ focused, color, size }) => (
                           
                             <View
                                className={`rounded-[32px] w-20 h-[40px] p-2 items-center justify-center ${
                                focused ? "bg-black/10" : "bg-transparent"
                                }`}
                            >
                                <Ionicons name="search" color={color} size={size} />

                            </View>
                           
                    )
                    }} 
                />
                <Tabs.Screen 
                    name="saved"
                    options={{
                        title: "Saved",
                        tabBarIcon: ({ focused, color, size }) => (
                             <View
                                className={`rounded-[32px] w-20 h-[40px] p-2 items-center justify-center ${
                                focused ? "bg-black/10" : "bg-transparent"
                                }`}
                            >

                                <Ionicons name="heart" color={color} size={size} />
                            </View>
                    )
                    }} 
                />
                <Tabs.Screen 
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ focused, color, size }) => (
                             <View
                                className={`rounded-[32px] w-20 h-[40px] p-2 items-center justify-center ${
                                focused ? "bg-black/10" : "bg-transparent"
                                }`}
                            >

                                <Ionicons name="person" ßcolor={color} size={size} />
                            </View>
                    )
                    }} 
                />
               
            
        </Tabs>

    )
}

export default TabLayout
