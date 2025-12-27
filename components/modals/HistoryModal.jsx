import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const HistoryModal = ({ visible, onClose, history, onClearHistory, type = "calculator", onHistoryItemPress }) => {
  const handleHistoryItemPress = (item) => {
    if (onHistoryItemPress) {
      onHistoryItemPress(item);
    }
    onClose();
  };

  const renderHistoryItem = (item, idx) => {
    if (type === "graph") {
      // For graph history - item is string
      return (
        <TouchableOpacity key={idx} style={styles.historyItem} onPress={() => handleHistoryItemPress({ value: item })}>
          <Text style={styles.historyRes}>y = {item}</Text>
        </TouchableOpacity>
      );
    } else {
      // For calculator history - item is object with exp and res
      return (
        <View key={idx} style={styles.historyItem}>
          <Text style={styles.historyExp}>{item.exp}</Text>
          <Text style={styles.historyRes}>= {item.res}</Text>
        </View>
      );
    }
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.historyOverlay}>
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>History</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {history.length === 0 ? (
              <Text style={styles.emptyText}>No history yet</Text>
            ) : (
              history.map((item, idx) => renderHistoryItem(item, idx))
            )}
          </ScrollView>
          
          {history.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={onClearHistory}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  historyOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  historyContainer: {
    height: '50%',
    backgroundColor: '#24243e',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  historyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
  },
  historyItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 5,
  },
  historyExp: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'right',
  },
  historyRes: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  clearBtn: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
});

export default HistoryModal;