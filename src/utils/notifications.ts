import PushNotification from 'react-native-push-notification';
import { Activity, Goal } from '../types';

// Configure push notifications
export const configureNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
};

// Schedule daily reminder notifications
export const scheduleDailyReminders = (activities: Activity[]) => {
  // Clear existing notifications
  PushNotification.cancelAllLocalNotifications();

  const today = new Date().getDay();
  const todayActivities = activities.filter(activity => 
    activity.frequency.includes(today) && !activity.isCompleted
  );

  // Schedule notifications for today's activities
  todayActivities.forEach((activity, index) => {
    const notificationTime = new Date();
    notificationTime.setHours(9 + index, 0, 0, 0); // Start at 9 AM, space them out

    PushNotification.localNotificationSchedule({
      message: `Lembrete: ${activity.title}`,
      date: notificationTime,
      repeatType: 'day',
      soundName: 'default',
      vibrate: true,
      vibration: 300,
      actions: ['Fazer agora', 'Adiar'],
    });
  });
};

// Schedule goal progress notifications
export const scheduleGoalProgressNotifications = (goals: Goal[]) => {
  goals.forEach(goal => {
    const daysRemaining = Math.ceil(
      (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    // Notify when goal is 50% complete
    if (goal.progress >= 50 && goal.progress < 60) {
      PushNotification.localNotification({
        title: 'Meta em Progresso! 🎯',
        message: `Você está ${goal.progress}% completo com "${goal.title}". Continue assim!`,
        soundName: 'default',
        vibrate: true,
      });
    }

    // Notify when goal is 80% complete
    if (goal.progress >= 80 && goal.progress < 90) {
      PushNotification.localNotification({
        title: 'Quase lá! 🚀',
        message: `Você está ${goal.progress}% completo com "${goal.title}". Falta pouco!`,
        soundName: 'default',
        vibrate: true,
      });
    }

    // Notify when goal is completed
    if (goal.progress >= 100) {
      PushNotification.localNotification({
        title: 'Parabéns! 🎉',
        message: `Você completou a meta "${goal.title}"! Você é incrível!`,
        soundName: 'default',
        vibrate: true,
      });
    }

    // Notify about approaching deadline
    if (daysRemaining <= 3 && daysRemaining > 0) {
      PushNotification.localNotification({
        title: 'Prazo se aproximando ⏰',
        message: `A meta "${goal.title}" vence em ${daysRemaining} dias. Foco!`,
        soundName: 'default',
        vibrate: true,
      });
    }
  });
};

// Schedule motivational notifications
export const scheduleMotivationalNotifications = () => {
  const motivationalMessages = [
    "Bom dia! 🌅 Que tal começar o dia com uma atividade?",
    "Você está indo muito bem! 💪 Continue assim!",
    "Lembre-se: cada pequeno passo conta! 🚶‍♂️",
    "Hoje é um novo dia para conquistar seus objetivos! 🌟",
    "Você é mais forte do que pensa! 💪",
    "A consistência é a chave do sucesso! 🔑",
    "Pequenos progressos diários levam a grandes resultados! 📈",
    "Você está construindo o futuro que deseja! 🏗️",
  ];

  // Schedule random motivational message at 8 AM
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  
  PushNotification.localNotificationSchedule({
    message: randomMessage,
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow at 8 AM
    repeatType: 'day',
    soundName: 'default',
    vibrate: true,
  });
};

// Schedule evening reflection reminder
export const scheduleReflectionReminder = () => {
  PushNotification.localNotificationSchedule({
    title: 'Hora de Refletir 🌙',
    message: 'Que tal fazer uma reflexão sobre seu dia? Isso ajudará você a crescer!',
    date: new Date(Date.now() + 12 * 60 * 60 * 1000), // 8 PM
    repeatType: 'day',
    soundName: 'default',
    vibrate: true,
  });
};

// Initialize all notifications
export const initializeNotifications = (activities: Activity[], goals: Goal[]) => {
  configureNotifications();
  scheduleDailyReminders(activities);
  scheduleGoalProgressNotifications(goals);
  scheduleMotivationalNotifications();
  scheduleReflectionReminder();
};
