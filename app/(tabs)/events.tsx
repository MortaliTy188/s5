import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Calendar from "expo-calendar";

const EVENTS_API_URL = "http://127.0.0.1:4444/events";

export default function EventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(EVENTS_API_URL);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось загрузить события");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = async (item) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const defaultCalendar = calendars.find((calendar) => calendar.isPrimary);

      if (defaultCalendar) {
        await Calendar.createEventAsync(defaultCalendar.id, {
          title: item.title,
          startDate: new Date(item.date),
          endDate: new Date(item.date),
          notes: item.description,
        });
        Alert.alert("Событие добавлено в календарь");
      }
    } else {
      Alert.alert("Разрешение на доступ к календарю не предоставлено");
    }
  };

  const toggleFavorite = (id) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, favorite: !event.favorite } : event
    ));
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity key={item.title} style={styles.eventItem}>
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => {
            handleAddToCalendar(item);
            toggleFavorite(item.title);
          }}>
            <Ionicons name={item.favorite ? "star" : "star-outline"} size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <View style={styles.eventFooter}>
          <Text style={styles.eventDate}>{item.date}</Text>
          <Text style={styles.eventAuthor}>{item.author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.eventContainer}>
          {events.map((item) => renderEventItem({ item }))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFFFD6",
    justifyContent: "center",
    alignItems: "center",
  },
  eventContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  eventItem: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    width: "90%",
    alignSelf: "center",
  },
  eventContent: {
    padding: 10,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  eventDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  eventDate: {
    fontSize: 12,
    color: "#999",
  },
  eventAuthor: {
    fontSize: 12,
    color: "#999",
  },
});