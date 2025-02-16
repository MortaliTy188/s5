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

const NEWS_API_URL = "http://127.0.0.1:3000/news";

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 15000); // Fetch news every 15 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(NEWS_API_URL);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось загрузить новости");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (title) => {
    setNews(
      news.map((article) =>
        article.title === title
          ? { ...article, favorite: !article.favorite }
          : article
      )
    );
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity key={item.title} style={styles.newsItem}>
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.title)}>
            <Ionicons
              name={item.favorite ? "star" : "star-outline"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.newsDescription}>{item.contentSnippet}</Text>
        <View style={styles.newsFooter}>
          <Text style={styles.newsDate}>
            {new Date(item.pubDate).toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.newsContainer}>
          {news.map((item) => renderNewsItem({ item }))}
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
  newsContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  newsItem: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    width: "90%",
    alignSelf: "center",
  },
  newsContent: {
    padding: 10,
  },
  newsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  newsDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  newsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  newsDate: {
    fontSize: 12,
    color: "#999",
  },
});
