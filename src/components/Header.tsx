import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

interface Props {
  icon?: boolean;
}

const Header = ({icon}: Props) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`bg-white mt-4`}>
      <StatusBar barStyle="light-content" />
      <View style={tw`px-4 flex flex-row items-center justify-between pb-2`}>
        <View>
          {icon ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ) : (
            <Text style={tw`font-semibold uppercase`}>News</Text>
          )}
        </View>
        <View style={tw`flex flex-row`}>
          <View style={tw`bg-black px-2 ml-4`}>
            <Text style={tw`text-white text-xl`}>B</Text>
          </View>
          <View style={tw`bg-black px-2 ml-4`}>
            <Text style={tw`text-white text-xl`}>B</Text>
          </View>
          <View style={tw`bg-black px-2 ml-4`}>
            <Text style={tw`text-white text-xl`}>C</Text>
          </View>
        </View>
        <TouchableOpacity style={tw`flex-row items-center`}>
          <Text style={{marginRight: 5}}>Sign in</Text>
          <Ionicons name="person" size={16} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
