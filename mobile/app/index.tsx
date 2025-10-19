import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to public splash screen
    router.replace('/(public)/splash');
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F9B24E" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9B24E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
