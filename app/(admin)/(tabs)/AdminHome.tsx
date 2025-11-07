import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const AdminHome = () => {
  // Dummy data
  const stats = [
    { title: 'Total Users', value: 1500 },
    { title: 'Total Profit', value: '$12,450' },
    { title: 'Total Products', value: 320 },
    { title: 'Total Orders', value: 870 },
    { title: 'Pending Deliveries', value: 45 },
    { title: 'New Messages', value: 23 },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <View style={styles.cardsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{stat.title}</Text>
            <Text style={styles.cardValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});
