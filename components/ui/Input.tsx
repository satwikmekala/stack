import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'numeric' | 'underline';
}

export default function Input({ variant = 'default', style, ...props }: InputProps) {
  return (
    <TextInput
      style={[
        styles.input, 
        variant === 'numeric' && styles.numericInput, 
        variant === 'underline' && styles.underlineInput,
        style
      ]}
      placeholderTextColor={variant === 'underline' ? '#A9A9A9' : '#8E8E93'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3A3A3C',
    minHeight: 44,
  },
  numericInput: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  underlineInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#A9A9A9',
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 12,
    paddingBottom: 8,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Open Sans Hebrew',
  },
});