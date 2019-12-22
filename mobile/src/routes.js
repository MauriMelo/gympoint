import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '~/components/Logo';
import Auth from './pages/Auth';
import Checkins from './pages/Checkins';
import HelpOrderList from './pages/HelpOrder/List';
import HelpOrderNewQuestion from './pages/HelpOrder/NewQuestion';
import HelpOrderAnswer from './pages/HelpOrder/Answer';

export default (signed = false) => {
  return createAppContainer(
    createSwitchNavigator(
      {
        Auth,
        App: createBottomTabNavigator(
          {
            Checkins: {
              screen: createStackNavigator(
                {
                  Checkins,
                },
                {
                  defaultNavigationOptions: {
                    headerTitle: () => <Logo />,
                    headerTransparent: true,
                    headerStyle: {
                      backgroundColor: '#fff',
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd',
                    },
                  },
                },
              ),
              navigationOptions: {
                tabBarLabel: 'Check-ins',
                tabBarIcon: (
                  { tintColor }, // eslint-disable-line react/prop-types
                ) => <Icon name="room" size={20} color={tintColor} />,
              },
            },
            HelpOrder: {
              screen: createStackNavigator(
                {
                  HelpOrderList,
                  HelpOrderNewQuestion,
                  HelpOrderAnswer,
                },
                {
                  defaultNavigationOptions: {
                    headerTitle: () => <Logo />,
                    headerTransparent: true,
                    headerLeftContainerStyle: {
                      marginLeft: 10,
                    },
                    headerStyle: {
                      backgroundColor: '#fff',
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd',
                    },
                  },
                },
              ),
              navigationOptions: {
                tabBarLabel: 'Pedir ajuda',
                tabBarIcon: (
                  { tintColor }, // eslint-disable-line react/prop-types
                ) => <Icon name="live-help" size={20} color={tintColor} />,
              },
            },
          },
          {
            tabBarOptions: {
              style: {
                padding: 10,
                height: 70,
              },
              activeTintColor: '#ee4e62',
              inactiveTintColor: '#999',
            },
          },
        ),
      },
      {
        initialRouteName: signed ? 'App' : 'Auth',
      },
    ),
  );
};
