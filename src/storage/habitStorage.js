import AsyncStorage from '@react-native-async-storage/async-storage';

const HABIT_KEY = 'habits';
const HISTORY_KEY = 'habit_history';

/** Get all habits */
export const getHabits = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABIT_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting habits:', e);
    return [];
  }
};

/** Save all habits */
export const saveHabit = async (habits) => {
  try {
    await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('Error saving habits:', e);
  }
};

/** Get habit history */
export const getHabitHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : {};
  } catch (e) {
    console.error('Error retrieving habit history:', e);
    return {};
  }
};

/** Save habit history */
export const saveHabitHistory = async (history) => {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving habit history:', e);
  }
};

/** Log habit completion or skip */
export const logHabitActivity = async (habitId, habitName, completed) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const history = await getHabitHistory();

    if (!history[today]) {
      history[today] = [];
    }

    history[today].push({
      id: habitId,
      name: habitName,
      completed: completed, // true = completed, false = skipped
    });

    await saveHabitHistory(history);
  } catch (e) {
    console.error('Error logging habit activity:', e);
  }
};
