import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getActivities, getGoals } from '../utils/storage';
import { Activity, Goal } from '../types';

const ReflectScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isReflecting, setIsReflecting] = useState(false);

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

  const handleStartReflection = () => {
    Alert.alert(
      'Iniciar Reflexão',
      'Você está prestes a iniciar uma sessão de reflexão sobre suas atividades do dia. Isso ajudará você a avaliar seu progresso e identificar áreas de melhoria.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          onPress: () => {
            setIsReflecting(true);
            startReflectionSession();
          },
        },
      ]
    );
  };

  const startReflectionSession = () => {
    // TODO: Implementar lógica de reflexão
    Alert.alert(
      'Sessão de Reflexão',
      'Funcionalidade de reflexão será implementada em breve. Aqui você poderá:\n\n• Avaliar suas atividades do dia\n• Responder perguntas sobre seu progresso\n• Receber insights personalizados\n• Definir objetivos para o próximo dia',
      [
        {
          text: 'OK',
          onPress: () => setIsReflecting(false),
        },
      ]
    );
  };

  const getTodayStats = () => {
    const today = new Date();
    const todayActivities = activities.filter(activity => 
      activity.frequency.includes(today.getDay())
    );
    
    const completedToday = todayActivities.filter(activity => 
      activity.isCompleted && 
      activity.completedAt && 
      activity.completedAt.toDateString() === today.toDateString()
    );

    return {
      total: todayActivities.length,
      completed: completedToday.length,
      progress: todayActivities.length > 0 
        ? Math.round((completedToday.length / todayActivities.length) * 100) 
        : 0,
    };
  };

  const stats = getTodayStats();

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
          <Text style={styles.title}>Refletir</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Resumo do Dia</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total - stats.completed}</Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.progress}%</Text>
              <Text style={styles.statLabel}>Progresso</Text>
            </View>
          </View>
        </View>

        <View style={styles.reflectionContainer}>
          <Icon name="psychology" size={80} color="#6366f1" />
          
          <Text style={styles.reflectionTitle}>
            {isReflecting ? 'Refletindo...' : 'Hora de Refletir'}
          </Text>
          
          <Text style={styles.reflectionDescription}>
            {isReflecting 
              ? 'Analisando suas atividades e preparando perguntas personalizadas...'
              : 'Reserve alguns minutos para refletir sobre seu dia, avaliar seu progresso e planejar o amanhã.'
            }
          </Text>

          {!isReflecting && (
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartReflection}
            >
              <Icon name="play-arrow" size={24} color="#ffffff" />
              <Text style={styles.startButtonText}>Iniciar Sessão</Text>
            </TouchableOpacity>
          )}

          {isReflecting && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          )}
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Dicas para uma boa reflexão:</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Icon name="check" size={16} color="#10b981" />
              <Text style={styles.tipText}>Seja honesto sobre seus resultados</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="check" size={16} color="#10b981" />
              <Text style={styles.tipText}>Identifique o que funcionou bem</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="check" size={16} color="#10b981" />
              <Text style={styles.tipText}>Pense em como melhorar amanhã</Text>
            </View>
            <View style={styles.tipItem}>
              <Icon name="check" size={16} color="#10b981" />
              <Text style={styles.tipText}>Celebre suas conquistas</Text>
            </View>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  reflectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  reflectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  reflectionDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    marginTop: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
    marginHorizontal: 4,
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  tipsContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
    flex: 1,
  },
});

export default ReflectScreen;
