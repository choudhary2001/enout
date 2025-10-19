// Platform-specific storage adapter
import { Platform } from 'react-native';

// Import the appropriate storage implementation
const { storage } = Platform.OS === 'web' 
  ? require('./storage.web')
  : require('./storage.native');

export { storage };
