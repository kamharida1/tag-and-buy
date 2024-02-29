import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { StatusBar } from 'expo-status-bar';

export const LogoutButton = () => {
	const { signOut } = useAuth();

	const doLogout = () => {
		signOut();
	};

	return (
		<Pressable onPress={doLogout} style={{ marginRight: 10 }}>
			<Ionicons name="log-out-outline" size={24} color={'#fff'} />
		</Pressable>
	);
};

const TabsPage = () => {
	const { isSignedIn } = useAuth();

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            fontFamily: "airMedium",
            fontSize: 12,
          },
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#777",
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />

        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
            tabBarLabel: "Home",
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="orders"
          options={{
            headerTitle: "Orders",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
            tabBarLabel: "Cart",
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: "My Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
            tabBarLabel: "My Profile",
            headerRight: () => <LogoutButton />,
          }}
          redirect={!isSignedIn}
        />
      </Tabs>
    </>
  );
};

export default TabsPage;