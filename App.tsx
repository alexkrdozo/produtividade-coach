import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';

// Import screens
import GoalsScreen from './src/screens/GoalsScreen';
import ActivitiesScreen from './src/screens/ActivitiesScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import ReflectScreen from './src/screens/ReflectScreen';
import SideMenu from './src/components/SideMenu';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Drawer.Navigator
          drawerContent={(props) => <SideMenu {...props} />}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: '#f8f9fa',
              width: 280,
            },
          }}
        >
          <Drawer.Screen name="Metas" component={GoalsScreen} />
          <Drawer.Screen name="Atividades" component={ActivitiesScreen} />
          <Drawer.Screen name="Lembretes" component={RemindersScreen} />
          <Drawer.Screen name="Refletir" component={ReflectScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
