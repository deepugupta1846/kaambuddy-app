import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './SearchBar.styles';

const SearchBar = ({ placeholder = "Search for 'AC service'", onSearch, onFocus }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#999" solid style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
          onFocus={onFocus}
          returnKeyType="search"
        />
      </View>
    </View>
  );
};

export default SearchBar;

