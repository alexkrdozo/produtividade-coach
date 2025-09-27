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
import { Reminder } from '../types';
import { getReminders, saveReminders } from '../utils/storage';
import ReminderCard from '../components/ReminderCard';
import AddReminderModal from '../components/AddReminderModal';

const RemindersScreen: React.FC = () => {
  const navigation = useNavigation();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const savedReminders = await getReminders();
      setReminders(savedReminders);
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
    }
  };

  const handleAddReminder = async (newReminder: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => {
    try {
      const reminder: Reminder = {
        ...newReminder,
        id: Date.now().toString(),
        createdAt: new Date(),
        isCompleted: false,
      };
      
      const updatedReminders = [...reminders, reminder];
      setReminders(updatedReminders);
      await saveReminders(updatedReminders);
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o lembrete');
    }
  };

  const handleToggleReminder = async (reminderId: string) => {
    try {
      const updatedReminders = reminders.map(reminder => {
        if (reminder.id === reminderId) {
          return {
            ...reminder,
            isCompleted: !reminder.isCompleted,
            completedAt: !reminder.isCompleted ? new Date() : undefined,
          };
        }
        return reminder;
      });
      
      setReminders(updatedReminders);
      await saveReminders(updatedReminders);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o lembrete');
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este lembrete?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedReminders = reminders.filter(reminder => reminder.id !== reminderId);
              setReminders(updatedReminders);
              await saveReminders(updatedReminders);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o lembrete');
            }
          },
        },
      ]
    );
  };

  const getCompletedToday = () => {
    const today = new Date();
    return reminders.filter(reminder => 
      reminder.isCompleted && 
      reminder.completedAt && 
      reminder.completedAt.toDateString() === today.toDateString()
    );
  };

  const getPendingReminders = () => {
    return reminders.filter(reminder => !reminder.isCompleted);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Icon name="menu" size={24} color="#6366f1" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Lembretes</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getPendingReminders().length}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getCompletedToday().length}</Text>
          <Text style={styles.statLabel}>Hoje</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{reminders.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="notifications" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Nenhum lembrete criado ainda</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para criar seu primeiro lembrete
            </Text>
          </View>
        ) : (
          <>
            {/* Pending Reminders */}
            {getPendingReminders().length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pendentes</Text>
                {getPendingReminders().map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onToggle={handleToggleReminder}
                    onDelete={handleDeleteReminder}
                  />
                ))}
              </View>
            )}

            {/* Completed Today */}
            {getCompletedToday().length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Concluídos hoje</Text>
                {getCompletedToday().map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onToggle={handleToggleReminder}
                    onDelete={handleDeleteReminder}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Icon name="add" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Reminder Modal */}
      <AddReminderModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddReminder}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
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

export default RemindersScreen;
