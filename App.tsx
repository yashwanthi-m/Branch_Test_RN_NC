import 'react-native-gesture-handler'; 
import React, { useState, useEffect } from 'react';
import branch, { BranchEvent } from 'react-native-branch'
import type { PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

// Section Component
function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          { color: isDarkMode ? Colors.white : Colors.black },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          { color: isDarkMode ? Colors.light : Colors.dark },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

// Handle Login Event
// Handle Login Event
const handleLogin = async () => {
  try {
    // Define event data for Login
    await branch.setIdentity("unique_user_id_123"); // Set the user's identity

    let params = {
      alias: "login_event_alias",
      transaction_id: "login_event_1234",
      description: "User logged in",
      registration_id: "67890", // Example ID, replace if needed
      customData: {
        Login_Event_Property_Key1: "Login_Event_Property_val1",
        Login_Event_Property_Key2: "Login_Event_Property_val2",
      },
    };

    // Create Login Event
    let event = new BranchEvent(BranchEvent.Login, [], params);

    // Log Login Event
    await event.logEvent();
    Alert.alert('Success', 'Login event logged successfully!');
  } catch (error) {
    console.error('Error during login');
    Alert.alert('Error', 'Failed to log Login event. Please try again.');
  }
};

// Handle Invite Event
const handleInvite = () => {
  try {
    // Define event data for Invite
    let params = {
      alias: "invite_event_alias",
      transaction_id: "invite_event_1234",
      description: "User initiated invite",
      registration_id: "12345", // Example ID, replace if needed
      customData: {
        Invite_Event_Property_Key1: "Invite_Event_Property_val1",
        Invite_Event_Property_Key2: "Invite_Event_Property_val2",
      },
    };

    // Create Invite Event
    let event = new BranchEvent("Invite", [], params);

    // Log Invite Event
    event.logEvent().then(() => {
      Alert.alert('Success', 'Invite event logged successfully!');
    }).catch((error) => {
      console.error('Error logging invite event:', error);
      Alert.alert('Error', 'Failed to log Invite event. Please try again.');
    });
  } catch (error) {
    console.error('Error setting up invite event:', error);
    Alert.alert('Error', 'Failed to set up Invite event.');
  }
};

// App Component
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Stack Navigator
  const Stack = createStackNavigator();

  const LoginScreen = ({ navigation }: { navigation: any }) => {
    useEffect(() => {
      const subscription = branch.subscribe({
        onOpenStart: ({ uri, cachedInitialEvent }) => {
          console.log('subscribe onOpenStart, will open:', uri, cachedInitialEvent);
        },
        onOpenComplete: ({ error, params, uri }) => {
          if (error) {
            console.error('Error from opening uri:', uri, 'error:', error);
            return;
          }
          if (params) {
            if (!params['+clicked_branch_link']) {
              if (params['+non_branch_link']) {
                console.log('Non-branch link:', uri);
                return;
              }
            } else {
              const paramsString = JSON.stringify(params, null, 2);
              Alert.alert('Branch Params', paramsString);
            }
          }
        },
      });
  
      return () => {
        // Cleanup subscription when leaving the screen
        subscription();
      };
    }, []);
  
    return (
      <View style={styles.centeredView}>
        <TouchableOpacity style={styles.button} onPress={() => {
          handleLogin(); // Log Login Event
          navigation.navigate('Details'); // Navigate to Details
        }}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.inviteButton]} onPress={handleInvite}>
          <Text style={styles.buttonText}>Invite</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Details Screen
  const DetailsScreen = () => {
    const [urls] = useState([
      { branch: 'https://yash.devishetty.net/WDSFEy6vAMb' },
      { branch: 'https://yash.devishetty.net/e/baWd1jtcsLb' },
      { branch: 'https://yash.devishetty.net/GYFvXLVIBJb' },
      { branch: 'https://yash.devishetty.net/vfiR8v7ndJb' },
      { branch: 'https://yash.devishetty.net/XmDH7b5ndJb' },
    ]);
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    // const handlePress = async (url: string) => {
    //   try {
    //     setSelectedUrl(url);
    //     if (branch) {
    //       await branch.openURL(url);
    //     } else {
    //       console.error('Branch SDK is not initialized');
    //     }
    //   } catch (error) {
    //     console.error('Error opening URL:', error);
    //   }
    // };

    const handlePress = async (url: string) => {
      try {
        setSelectedUrl(url); // Set the selected URL for UI updates
    
        // Check if Branch SDK is initialized
        if (branch) {
          // Define event data for Complete Registration
          const params = {
            alias: "registration_event_alias",
            transaction_id: "registration_event_1234",
            description: `User completed registration :${url}`,
            registration_id: "54321", // Example ID, replace with actual if necessary
            customData: {
              Registration_Event_Property_Key1: "Registration_Event_Property_val1",
              Registration_Event_Property_Key2: "Registration_Event_Property_val2",
            },
          };
    
          // Create Complete Registration Event
          const event = new BranchEvent(BranchEvent.CompleteRegistration, [], params);
    
          // Log Complete Registration Event
          await event.logEvent();
          Alert.alert('Success', 'Complete Registration event logged successfully!');
        } else {
          console.error('Branch SDK is not initialized');
        }
      } catch (error) {
        console.error('Error triggering Complete Registration event:', error);
        Alert.alert('Error', 'Failed to trigger Complete Registration event.');
      }
    };

    useEffect(() => {
      const subscription = branch.subscribe({
        onOpenStart: ({ uri, cachedInitialEvent }) => {
          console.log('subscribe onOpenStart, will open:', uri, cachedInitialEvent);
        },
        onOpenComplete: ({ error, params, uri }) => {
          if (error) {
            console.error('Error from opening uri:', uri, 'error:', error);
            return;
          }
          if (params) {
            if (!params['+clicked_branch_link']) {
              if (params['+non_branch_link']) {
                console.log('Non-branch link:', uri);
                return;
              }
            } else {
              const paramsString = JSON.stringify(params, null, 2);
              Alert.alert('Branch Params', paramsString);
            }
          }
        },
      });
    }, []);

    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.sectionContainer}>
          {urls.map((urlObj, index) => (
            <View key={index} style={styles.urlContainer}>
              <Text style={styles.urlText}>Link: {urlObj.branch}</Text>
              <TouchableOpacity
                style={styles.urlButton}
                onPress={() => handlePress(urlObj.branch)}
              >
                <Text style={styles.buttonText}>Click</Text>
              </TouchableOpacity>
            </View>
          ))}
          {selectedUrl && (
            <View style={styles.paramsContainer}>
              <Text style={styles.paramsText}>Selected URL: {selectedUrl}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  // Return Navigation Container
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24, // Title font size
    fontWeight: '600', // Bold text
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 16, // Description font size
    fontWeight: '400', // Normal text weight
    lineHeight: 24, // Line height for readability
  },
  urlContainer: {
    marginBottom: 20,
  },
  urlText: {
    fontSize: 14,
  },
  urlButton: {
    backgroundColor: 'grey',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paramsContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  paramsText: {
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.lighter, // Default background color
  },
  inviteButton: {
    backgroundColor: '#34C759',
    marginTop: 20, // Ensure additional space above the "Invite" button
  }
});

export default App;

