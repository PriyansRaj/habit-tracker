import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'all_users';
const CURRENT_USER_KEY = 'current_user';

// Save or update user data
export const saveUser = async (user) => {
  try {
    const allUsers = (await getAllUsers()) || {};
    allUsers[user.id] = user; // Store user by unique ID
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
  } catch (e) {
    console.error('Error saving user:', e);
  }
};

// Get a specific user by ID
export const getUser = async (userId) => {
  try {
    const allUsers = (await getAllUsers()) || {};
    return allUsers[userId] || null;
  } catch (e) {
    console.error('Error fetching user:', e);
  }
};

// Save the currently logged-in user session
export const setCurrentUser = async (userId) => {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, userId);
  } catch (e) {
    console.error('Error setting current user:', e);
  }
};

// Get the currently logged-in user session
export const getCurrentUser = async () => {
  try {
    const userId = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userId ? await getUser(userId) : null;
  } catch (e) {
    console.error('Error getting current user:', e);
  }
};

// Logout the current user
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (e) {
    console.error('Error logging out user:', e);
  }
};

// Get all users (for multi-user support)
export const getAllUsers = async () => {
  try {
    const users = await AsyncStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (e) {
    console.error('Error getting all users:', e);
  }
};
