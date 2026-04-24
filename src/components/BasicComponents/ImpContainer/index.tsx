/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

interface ContainerProps {
  container?: boolean;
  children?: any;
  style?: any;
}
function ImpContainer({container, children, style}: ContainerProps) {
  return (
    <View style={{flexDirection: container ? 'row' : 'column', ...style}}>
      {children}
    </View>
  );
}

export default ImpContainer;
