import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Activity, Goal } from '../types';
import { getActivities, saveActivities, getGoals } from '../utils/storage';
import ActivityCard from '../components/ActivityCard';
import AddActivityModal from '../components/AddActivityModal';

const ActivitiesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedActivities, savedGoals] = await Promise.all([
        getActivities(),
        getGoals(),
      ]);
      setActivities(savedActivities);
      setGoals(savedGoals);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleAddActivity = async (newActivity: Omit<Activity, 'id' | 'createdAt' | 'isCompleted'>) => {
    try {
      const activity: Activity = {
        ...newActivity,
        id: Date.now().toString(),
        createdAt: new Date(),
        isCompleted: false,
      };
      
      const updatedActivities = [...activities, activity];
      setActivities(updatedActivities);
      await saveActivities(updatedActivities);
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a atividade');
    }
  };

  const handleToggleActivity = async (activityId: string) => {
    try {
      const updatedActivities = activities.map(activity => {
        if (activity.id === activityId) {
          const updated = {
            ...activity,
            isCompleted: !activity.isCompleted,
            completedAt: !activity.isCompleted ? new Date() : undefined,
          };
          
          // Atualizar progresso da meta relacionada
          updateGoalProgress(activity.goalId, activity.isCompleted ? -1 : 1);
          
          return updated;
        }
        return activity;
      });
      
      setActivities(updatedActivities);
      await saveActivities(updatedActivities);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a atividade');
    }
  };

  const updateGoalProgress = async (goalId: string, progressChange: number) => {
    try {
      const updatedGoals = goals.map(goal => {
        if (goal.id === goalId) {
          const newProgress = Math.max(0, Math.min(100, goal.progress + progressChange));
          return { ...goal, progress: newProgress };
        }
        return goal;
      });
      setGoals(updatedGoals);
      // TODO: Salvar metas atualizadas
    } catch (error) {
      console.error('Erro ao atualizar progresso da meta:', error);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta atividade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedActivities = activities.filter(activity => activity.id !== activityId);
              setActivities(updatedActivities);
              await saveActivities(updatedActivities);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a atividade');
            }
          },
        },
      ]
    );
  };

  const getTodayActivities = () => {
    const today = new Date().getDay();
    return activities.filter(activity => 
      activity.frequency.includes(today) && !activity.isCompleted
    );
  };

  const getCompletedToday = () => {
    const today = new Date();
    return activities.filter(activity => 
      activity.isCompleted && 
      activity.completedAt && 
      activity.completedAt.toDateString() === today.toDateString()
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            // Fallback for navigation.openDrawer() type error
            // @ts-ignore
            navigation.openDrawer && navigation.openDrawer();
          }}
        >
          <Icon name="menu" size={24} color="#6366f1" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Atividades</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getTodayActivities().length}</Text>
          <Text style={styles.statLabel}>Hoje</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getCompletedToday().length}</Text>
          <Text style={styles.statLabel}>Concluídas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activities.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activities.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="assignment" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Nenhuma atividade criada ainda</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para criar sua primeira atividade
            </Text>
          </View>
        ) : (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              goal={goals.find(g => g.id === activity.goalId)}
              onToggle={handleToggleActivity}
              onDelete={handleDeleteActivity}
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

      {/* Add Activity Modal */}
      <AddActivityModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddActivity}
        goals={goals}
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
    marginRight: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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

export default ActivitiesScreen;
