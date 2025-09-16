import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Home } from '@screens/Home';
import { AddEditTransaction } from '@screens/AddEditTransaction';

type StackRoutes = {
  home: undefined;
  addEditTransaction: {
    transactionId?: number;
  };
};

export type StackNavigatorRouterProps = NativeStackNavigationProp<StackRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<StackRoutes>();

export function StackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="home">
      <Screen name="home" component={Home} />
      <Screen name="addEditTransaction" component={AddEditTransaction} />
    </Navigator>
  );
}
