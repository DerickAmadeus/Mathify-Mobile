import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Modul = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soal / Modul</Text>
      <Text style={styles.subtitle}>Coming Soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
  },
});

export default Modul;