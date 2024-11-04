import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {HomeScreenNavigationProp, NewsData} from '../../type';
import {NEWS_API_KEY} from '../../config';
import tw from 'twrnc';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import Loader from '../components/Loader';

const TABS = ['Top Stories', 'Business', 'Politics', 'Science', 'Technology'];

type Tab = (typeof TABS)[number];

const CATEGORY_MAP: Record<Tab, string> = {
  'Top Stories': 'general',
  Business: 'business',
  Politics: 'politics',
  Science: 'science',
  Technology: 'technology',
};

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsData[]>([]);
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // Items per page
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    setPage(1); // Reset page on tab change
    setNews([]); // Clear current news data
    getData(1); // Fetch first page for the selected tab
  }, [selectedTab]);

  const getData = async (page: number) => {
    try {
      setLoading(true);
      const category = CATEGORY_MAP[selectedTab]; // Get category from map
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${NEWS_API_KEY}&page=${page}&pageSize=${perPage}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        },
      );

      const data = await response.json();

      if (data?.status === 'ok') {
        setNews(prevNews =>
          page === 1 ? data.articles : [...prevNews, ...data.articles],
        );
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) {
      getData(page);
    }
  }, [page]);

  const renderNewsCard = ({item}: {item: NewsData}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('News', {item})}
      style={[styles.card, tw`mb-4 rounded-lg overflow-hidden`]}>
      {item.urlToImage && (
        <Image source={{uri: item.urlToImage}} style={styles.image} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.publishedAt}>
          Published at: {new Date(item.publishedAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderTab = ({item}: {item: string}) => (
    <TouchableOpacity onPress={() => setSelectedTab(item)} style={styles.tab}>
      <Text
        style={[styles.tabText, item === selectedTab && styles.tabTextActive]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`bg-gray-50`}>
      <Header />
      <FlatList
        data={TABS}
        renderItem={renderTab}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      />

      {loading && page === 1 ? (
        <Loader />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderNewsCard}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && page > 1 ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={{marginVertical: 5}}
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    backgroundColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tabContainer: {
    // paddingVertical: 10,
    marginVertical: 1,
    paddingHorizontal: 16,
  },
  tab: {
    marginRight: 20,
  },
  tabText: {
    color: '#000',
    fontSize: 16,
  },
  tabTextActive: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00000050',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  publishedAt: {
    fontSize: 12,
    color: '#666',
  },
});
