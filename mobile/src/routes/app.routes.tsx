import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { StackRoutes } from './stack.routes';
import { gluestackUIConfig } from '../../config/gluestack-ui.config';

import HomeSvg from '@assets/home.svg';
import { Platform } from 'react-native';

type AppRoutesProps = {
  home: undefined;
};

export type AppNavigatorRouterProps = BottomTabNavigationProp<AppRoutesProps>;

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { tokens } = gluestackUIConfig;
  const iconSize = tokens.space['6'];
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tokens.colors.green500,
        tabBarInactiveTintColor: tokens.colors.gray200,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          backgroundColor: tokens.colors.gray600,
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: tokens.space['10'],
          paddingTop: tokens.space['6'],
        },
      }}
    >
      <Screen
        name="home"
        component={StackRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          ),
        }}
      />
    </Navigator>
  );
}
