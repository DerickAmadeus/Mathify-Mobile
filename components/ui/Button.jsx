import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ 
  label, 
  type = 'number', 
  color, 
  flex = 1, 
  onPress, 
  style,
  textStyle 
}) => {
  let bgStyle = styles.btnNumber;
  let defaultTextStyle = styles.btnText;

  if (type === 'operator') {
    bgStyle = styles.btnOperator;
    defaultTextStyle = styles.btnTextOperator;
  } else if (type === 'function') {
    bgStyle = styles.btnFunction;
    defaultTextStyle = styles.btnTextFunction;
  } else if (type === 'action') { 
    bgStyle = styles.btnAction;
    defaultTextStyle = styles.btnTextAction;
  } else if (type === 'equal') {
    bgStyle = styles.btnEqual;
    defaultTextStyle = styles.btnTextEqual;
  }

  return (
    <TouchableOpacity 
      style={[styles.button, bgStyle, { flex }, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[defaultTextStyle, color && { color }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  btnNumber: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  btnText: {
    color: 'white',
    fontSize: 22,
  },
  
  btnFunction: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  btnTextFunction: {
    color: '#a5a1c9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  btnOperator: {
    backgroundColor: 'rgba(48, 43, 99, 0.8)',
  },
  btnTextOperator: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  
  btnAction: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
  btnTextAction: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  btnEqual: {
    backgroundColor: 'white',
  },
  btnTextEqual: {
    color: '#302b63',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Button;