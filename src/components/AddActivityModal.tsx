import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Activity, Goal } from '../types';

interface AddActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (activity: Omit<Activity, 'id' | 'createdAt' | 'isCompleted'>) => void;
  goals: Goal[];
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({ 
  visible, 
  onClose, 
  onAdd, 
  goals 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const daysOfWeek = [
    { id: 0, name: 'Dom', label: 'Domingo' },
    { id: 1, name: 'Seg', label: 'Segunda' },
    { id: 2, name: 'Ter', label: 'Terça' },
    { id: 3, name: 'Qua', label: 'Quarta' },
    { id: 4, name: 'Qui', label: 'Quinta' },
    { id: 5, name: 'Sex', label: 'Sexta' },
    { id: 6, name: 'Sáb', label: 'Sábado' },
  ];

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return;
    }

    if (!selectedGoalId) {
      Alert.alert('Erro', 'Selecione uma meta');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um dia da semana');
      return;
    }

    onAdd({
      title: title.trim(),
      description: description.trim(),
      goalId: selectedGoalId,
      frequency: selectedDays,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedGoalId('');
    setSelectedDays([]);
  };

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova Atividade</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título da atividade"
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Descreva a atividade"
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta relacionada *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {goals.map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.goalOption,
                      selectedGoalId === goal.id && styles.selectedGoalOption
                    ]}
                    onPress={() => setSelectedGoalId(goal.id)}
                  >
                    <Text style={[
                      styles.goalOptionText,
                      selectedGoalId === goal.id && styles.selectedGoalOptionText
                    ]}>
                      {goal.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dias da semana *</Text>
              <View style={styles.daysContainer}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day.id) && styles.selectedDayButton
                    ]}
                    onPress={() => toggleDay(day.id)}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      selectedDays.includes(day.id) && styles.selectedDayButtonText
                    ]}>
                      {day.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  goalOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
    backgroundColor: '#ffffff',
  },
  selectedGoalOption: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  goalOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedGoalOptionText: {
    color: '#ffffff',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  selectedDayButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  selectedDayButtonText: {
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default AddActivityModal;
