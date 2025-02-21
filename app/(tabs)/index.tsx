import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const NEWS_API_URL = "http://127.0.0.1:4444/news";

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(NEWS_API_URL);
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      const items = xml.getElementsByTagName("item");

      const newsData = Array.from(items).map((item) => ({
        title: item.getElementsByTagName("title")[0].textContent,
        date: item.getElementsByTagName("date")[0].textContent,
        description: item.getElementsByTagName("description")[0].textContent,
        image: `http://127.0.0.1:4444/${
          item.getElementsByTagName("image")[0].textContent
        }`,
      }));

      setNews(newsData);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось загрузить новости");
    } finally {
      setLoading(false);
    }
  };

  const handleNextNews = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < news.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevNews = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : news.length - 1
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const currentNews = news[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.newsContainer}>
        <TouchableOpacity onPress={handlePrevNews} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.newsItem}>
          <Image source={{ uri: currentNews.image }} style={styles.newsImage} />
          <Text style={styles.newsTitle}>{currentNews.title}</Text>
          <Text style={styles.newsDescription}>{currentNews.description}</Text>
          <Text style={styles.newsDate}>{currentNews.date}</Text>
        </View>
        <TouchableOpacity onPress={handleNextNews} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFFFD6",
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.95,
    justifyContent: "space-between",
  },
  newsItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    width: width * 0.75,
    padding: 10,
    alignSelf: "center",
    alignItems: "center",
    position: "relative",
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  newsDate: {
    fontSize: 12,
    color: "#999",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  newsImage: {
    width: "100%",
    height: height * 0.25,
    borderRadius: 10,
  },
  newsDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },
  arrowButton: {
    padding: 10,
  },
});
