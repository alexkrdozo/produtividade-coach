import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Goal } from '../types';
import { getGoals, saveGoals } from '../utils/storage';
import GoalCard from '../components/GoalCard';
import AddGoalModal from '../components/AddGoalModal';

const GoalsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const savedGoals = await getGoals();
      setGoals(savedGoals);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  };

  const handleAddGoal = async (newGoal: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'activities'>) => {
    try {
      const goal: Goal = {
        ...newGoal,
        id: Date.now().toString(),
        createdAt: new Date(),
        progress: 0,
        activities: [],
      };
      
      const updatedGoals = [...goals, goal];
      setGoals(updatedGoals);
      await saveGoals(updatedGoals);
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a meta');
    }
  };

  const handleUpdateGoal = async (updatedGoal: Goal) => {
    try {
      const updatedGoals = goals.map(goal => 
        goal.id === updatedGoal.id ? updatedGoal : goal
      );
      setGoals(updatedGoals);
      await saveGoals(updatedGoals);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a meta');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedGoals = goals.filter(goal => goal.id !== goalId);
              setGoals(updatedGoals);
              await saveGoals(updatedGoals);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a meta');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            // @ts-ignore
            navigation.openDrawer && navigation.openDrawer();
          }}
        >
          <Icon name="menu" size={24} color="#6366f1" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Metas</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="flag" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Nenhuma meta criada ainda</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para criar sua primeira meta
            </Text>
          </View>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Icon name="add" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Goal Modal */}
      <AddGoalModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddGoal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: '14.28%', // 1/7 da tela
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40, // Compensar o botão do menu
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default GoalsScreen;
