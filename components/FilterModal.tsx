import { PropertyType, useFilterStore } from '@/store/filterState'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

const TYPES: {label: string, value: PropertyType}[] = [
    {label: "All", value: null},
    {label: "Apartment", value: "apartment"},
    {label: "House", value: "house"},
    {label: "Villa", value: "villa"},
    {label: "Studio", value: "studio"},
]

const BEDS = [
    {label: "Any", value: null},
    {label: "1", value: 1},
    {label: "2", value: 2},
    {label: "3", value: 3},
    {label: "4", value: 4},
    {label: "5+", value: 5},
]

const PRICE_PRESETS = [
    {label: "Under N500000", min: null, max: 500000},
    {label: "N500000 - N1000000", min: 500000, max: 1000000},
    {label: "N1000000 - N2000000", min: 1000000, max: 2000000},
    {label: "N2000000 - N5000000", min: 2000000, max: 5000000},
    {label: "N5000000+", min: 5000000, max: null},
]

const chip = (active: boolean) => `
    px-4 py-2 rounded-full border 
    ${active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"}
`

const chipText = (active: boolean) => `
    text-sm font-semibold 
    ${active ? "text-white" : "text-gray-600"}
`

const FilterModal = ({
    visible, 
    onClose}: {
        visible: boolean, 
        onClose: () => void
    }) => {

     const {search, type, bedrooms,
      minPrice, maxPrice, setSearch, setType, 
      setBedrooms, setMinPrice, setMaxPrice, resetFilters
      } 
      = useFilterStore()

      const [localMin, setLocalMin] = useState<string>(minPrice ? minPrice.toString() : "")
      const [localMax, setLocalMax] = useState<string>(maxPrice ? maxPrice.toString() : "")

      const activeFilterCount = [
        type,
        bedrooms,
        minPrice,
        maxPrice
      ].filter(v=> v !== null).length

      const handleApply= ()=>{
        setMinPrice(localMin ? parseInt(localMin) : null)
        setMaxPrice(localMax ? parseInt(localMax) : null)
        onClose()   
      }

      const handleReset = () => {
        setLocalMin("")
        setLocalMax("") 
        resetFilters()
        onClose()
      }
  return (
    <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
       
    >
        <View className="flex-1 bg-gray-50">
            <View className="flex-row items-center justify-between px-5 pt-6">

                <TouchableOpacity onPress={onClose} className="p-1">
                    <Ionicons name="close" size={24} colo={"#374151"}/>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900">Filters</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text className="text-blue-600 font-semibold text-sm">Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{padding: 20, paddingBottom: 40}}
                showsVerticalScrollIndicator={false}
            >

                <Text className="flex-row flex-wrap gap-2 mb-6 font-semibold">
                    Property Type
                </Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                    {TYPES.map((t)=>(
                        <TouchableOpacity 
                            key={t.value}
                            onPress={()=> setType(t.value)}
                            className={chip(type === t.value)}
                        >
                            <Text className={chipText(type === t.value)}>{t.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text className="flex-row flex-wrap gap-2 mb-4 font-semibold">
                    Bedrooms
                </Text>
                 <View className="flex-row flex-wrap gap-2 mb-6">
                    {BEDS.map((t)=>(
                        <TouchableOpacity 
                            key={t.value}
                            onPress={()=> setBedrooms(t.value)}
                            className={` flex-1 items-center py-2 rounded-2xl border
                                 ${chip(bedrooms === t.value)}`
                                }
                        >
                            <Text 
                                className={` text-sm font-bold ${chipText(bedrooms === t.value)}`}>
                                    {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text className="flex-row flex-wrap gap-2 mb-4 font-semibold">
                    Price Range
                </Text>
                <View className="flex-row gap-3 mb-3">
                    {
                        [
                            {
                                label: "Min Price",
                                value: localMin,
                                onChange: setLocalMin,
                                placholder: "0"
                            },
                            {
                                label: "Max Price",
                                value: localMax,
                                onChange: setLocalMax,
                                placholder: "0"
                            }
                        ].map(({label, value, onChange, placholder})=>(
                            <View key={label} className="flex-1">
                                <Text className="text-sm font-semibold text-gray-500 mb-1.5">
                                    {label}
                                </Text>
                                <View 
                                    className="flex-row items-center bg-white 
                                    rounded-2xl px-3 border border-gray-200"
                                >
                                    <Text className="text-gray-400 text-sm mr-1">
                                        N
                                    </Text>
                                    <TextInput 
                                        className="flex-1 py-3 text-gray-800"
                                        placeholder={placholder}
                                        placeholderTextColor="#9CA3AF"
                                        value={value}
                                        onChangeText={onChange}
                                        keyboardType="numeric"
                                    >

                                    </TextInput>

                                </View>
                            </View>
                        ))
                    }
                </View>
                 <View className="flex-row flex-wrap gap-2 mb-6">
                    {PRICE_PRESETS.map((p)=>{
                        const active = minPrice === p.min && maxPrice === p.max
                        return (
                         <TouchableOpacity 
                            key={p.label}
                            onPress={()=> {
                                setLocalMin(p.min ? String(p.min) : "")
                                setLocalMax(p.max ? String(p.max) : "")
                                setMinPrice(p.min)
                                setMaxPrice(p.max)
                            }}
                            className={` 
                                px-3 py-1.5 rounded-full border
                                 ${
                                    active ? "bg-blue-50 border-blue-300"
                                            : "bg-white border-gray-200"
                                 }`
                                }
                        >
                            <Text 
                                className={` text-sm font-medium 
                                   ${active ? "text-blue-600" : "text-gray-500"}
                                `}
                            >
                                    {p.label}
                            </Text>
                        </TouchableOpacity>)
                    })}
                </View>

            </ScrollView>
            <View className="px-5 pb-8 pt-4 bg-white border-t border-gray-100">
                <TouchableOpacity
                    onPress={handleApply}
                    className="bg-blue-600 rounded-2xl py-4 items-center"
                    style={{
                        shadowColor: "#2563EB",
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                    }}
                >
                    <Text className="text-white font-bold text-base">
                        Apply Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>       
        
    </Modal>
  )
}

export default FilterModal