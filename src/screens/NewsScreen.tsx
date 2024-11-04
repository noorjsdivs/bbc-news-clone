import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {
  RootStackParamList,
  NewsData,
  HomeScreenNavigationProp,
} from '../../type';
import {NEWS_API_KEY} from '../../config';
import WebView from 'react-native-webview';

type NewsScreenRouteProp = RouteProp<RootStackParamList, 'News'>;

const NewsScreen = () => {
  const route = useRoute<NewsScreenRouteProp>();
  const {item} = route.params;
  const [trendingNews, setTrendingNews] = useState<NewsData[]>([]); // Specify NewsData type for state
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=science&apiKey=${NEWS_API_KEY}&pageSize=5`,
        );
        const data = await response.json();
        if (data.status === 'ok') {
          setTrendingNews(data.articles);
        }
      } catch (error) {
        console.error('Error fetching trending news:', error);
      }
    };

    fetchTrendingNews();
  }, []);

  // Explicitly define the type for item
  const renderTrendingNewsCard = ({item}: {item: NewsData}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('News', {item})} // Navigate to NewsScreen with selected item
      style={styles.trendingCard}>
      {item.urlToImage && (
        <Image source={{uri: item.urlToImage}} style={styles.trendingImage} />
      )}
      <Text style={styles.trendingTitle}>{item.title}</Text>
      <Text style={styles.trendingAuthor}>
        By {item.author || 'Unknown Author'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header icon={true} />
      {/* <WebView source={{uri: item?.url}} style={{flex: 1}} /> */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {item.urlToImage && (
          <Image source={{uri: item.urlToImage}} style={styles.image} />
        )}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>By {item.author || 'Unknown Author'}</Text>
        <Text style={styles.publishedAt}>
          Published at: {new Date(item.publishedAt).toLocaleString()}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.content}>{item.content}</Text>

        <Text style={styles.recommendationTitle}>Trending News</Text>
        <FlatList
          data={trendingNews}
          renderItem={renderTrendingNewsCard}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingList}
        />
      </ScrollView>
    </View>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  // Your existing styles remain unchanged
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  publishedAt: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#333',
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  trendingList: {
    paddingVertical: 8,
  },
  trendingCard: {
    marginRight: 16,
    width: 150,
  },
  trendingImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  trendingAuthor: {
    fontSize: 12,
    color: '#666',
  },
});
