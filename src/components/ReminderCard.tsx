import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Reminder } from '../types';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (reminderId: string) => void;
  onDelete: (reminderId: string) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ 
  reminder, 
  onToggle, 
  onDelete 
}) => {
  const getStatusColor = () => {
    return reminder.isCompleted ? '#10b981' : '#6b7280';
  };

  const getStatusIcon = () => {
    return reminder.isCompleted ? 'check-circle' : 'radio-button-unchecked';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => onToggle(reminder.id)}
      >
        <View style={styles.leftContent}>
          <Icon 
            name={getStatusIcon()} 
            size={24} 
            color={getStatusColor()} 
          />
          
          <View style={styles.textContent}>
            <Text 
              style={[
                styles.title,
                reminder.isCompleted && styles.completedTitle
              ]}
            >
              {reminder.title}
            </Text>
            
            {reminder.description && (
              <Text style={styles.description}>
                {reminder.description}
              </Text>
            )}
            
            {reminder.completedAt && (
              <View style={styles.completedInfo}>
                <Icon name="check" size={16} color="#10b981" />
                <Text style={styles.completedText}>
                  Concluído em {formatDate(reminder.completedAt)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(reminder.id)}
      >
        <Icon name="delete" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContent: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 4,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReminderCard;
