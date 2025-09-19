import 'react-native-url-polyfill/auto';
/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import './src/global.css';

AppRegistry.registerComponent(appName, () => App);
