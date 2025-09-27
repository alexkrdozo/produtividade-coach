import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Activity, Goal } from '../types';

interface ActivityCardProps {
  activity: Activity;
  goal?: Goal;
  onToggle: (activityId: string) => void;
  onDelete: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  goal, 
  onToggle, 
  onDelete 
}) => {
  const getFrequencyText = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return activity.frequency.map(day => days[day]).join(', ');
  };

  const getStatusColor = () => {
    return activity.isCompleted ? '#10b981' : '#6b7280';
  };

  const getStatusIcon = () => {
    return activity.isCompleted ? 'check-circle' : 'radio-button-unchecked';
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => onToggle(activity.id)}
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
                activity.isCompleted && styles.completedTitle
              ]}
            >
              {activity.title}
            </Text>
            
            {activity.description && (
              <Text style={styles.description}>
                {activity.description}
              </Text>
            )}
            
            <View style={styles.metaInfo}>
              <Icon name="flag" size={16} color="#6366f1" />
              <Text style={styles.goalText}>
                {goal?.title || 'Meta não encontrada'}
              </Text>
            </View>
            
            <View style={styles.frequencyInfo}>
              <Icon name="schedule" size={16} color="#6b7280" />
              <Text style={styles.frequencyText}>
                {getFrequencyText()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(activity.id)}
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
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalText: {
    fontSize: 12,
    color: '#6366f1',
    marginLeft: 4,
    fontWeight: '500',
  },
  frequencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityCard;
