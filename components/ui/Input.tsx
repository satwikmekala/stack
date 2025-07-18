import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'numeric';
}

export default function Input({ variant = 'default', style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, variant === 'numeric' && styles.numericInput, style]}
      placeholderTextColor="#8E8E93"
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
});