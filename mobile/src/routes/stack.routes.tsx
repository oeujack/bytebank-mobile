import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Home } from '@screens/Home';
import { AddEditTransaction } from '@screens/AddEditTransaction';
import DashboardScreen from '@screens/DashboardScreen';

type StackRoutes = {
  home: undefined;
  addEditTransaction: {
    transactionId?: number;
  };
  dashboard: undefined;
};

export type StackNavigatorRouterProps = NativeStackNavigationProp<StackRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<StackRoutes>();

export function StackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="home">
      <Screen name="home" component={Home} />
      <Screen name="addEditTransaction" component={AddEditTransaction} />
      <Screen name="dashboard" component={DashboardScreen} />
    </Navigator>
  );
}
