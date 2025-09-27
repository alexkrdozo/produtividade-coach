import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SideMenu: React.FC<DrawerContentComponentProps> = (props) => {
  const menuItems = [
    { name: 'Metas', icon: 'flag', route: 'Metas' },
    { name: 'Atividades', icon: 'assignment', route: 'Atividades' },
    { name: 'Lembretes', icon: 'notifications', route: 'Lembretes' },
    { name: 'Refletir', icon: 'psychology', route: 'Refletir' },
  ];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Produtividade Coach</Text>
        </View>
        
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => props.navigation.navigate(item.route)}
          >
            <Icon name={item.icon} size={24} color="#6366f1" />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    paddingTop: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#374151',
  },
});

export default SideMenu;
