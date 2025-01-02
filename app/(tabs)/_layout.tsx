import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'

const TabLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{
      headerShown:false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
      
    </Tabs>
  )
}

export default TabLayout