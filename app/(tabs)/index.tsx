import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import { Bell, MessageSquare, Loader as Loader2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WebViewPage() {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [webViewUrl] = useState('https://houseofedtech.in');

  // Schedule notification with delay
  const scheduleNotification = async (title: string, body: string, delay: number) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger: {
          seconds: delay,
        },
      });
      
      Alert.alert(
        'Notification Scheduled',
        `"${title}" will appear in ${delay} seconds`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  const handleWelcomeNotification = () => {
    scheduleNotification(
      'Welcome! 🎉',
      'Thanks for using our WebView app! Hope you enjoy browsing.',
      3
    );
  };

  const handleReminderNotification = () => {
    scheduleNotification(
      'Friendly Reminder 📱',
      'Don\'t forget to check out the Video Player tab for some great content!',
      5
    );
  };

  const handleWebViewLoadEnd = () => {
    setLoading(false);
    // Bonus: Notification when WebView finishes loading
    scheduleNotification(
      'Page Loaded ✅',
      'The website has finished loading successfully!',
      2
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WebView & Notifications</Text>
        <Text style={styles.headerSubtitle}>Browse and get notified</Text>
      </View>

      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          style={styles.webView}
          onLoadEnd={handleWebViewLoadEnd}
          onLoadStart={() => setLoading(true)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading website...</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.welcomeButton]} 
          onPress={handleWelcomeNotification}
          activeOpacity={0.8}
        >
          <Bell size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Welcome Notification</Text>
          <Text style={styles.buttonSubtext}>Triggers in 3 seconds</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.reminderButton]} 
          onPress={handleReminderNotification}
          activeOpacity={0.8}
        >
          <MessageSquare size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Reminder Notification</Text>
          <Text style={styles.buttonSubtext}>Triggers in 5 seconds</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  webViewContainer: {
    flex: 1,
    margin: 15,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 21,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeButton: {
    backgroundColor: '#3B82F6',
  },
  reminderButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
});