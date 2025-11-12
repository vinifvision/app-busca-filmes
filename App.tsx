import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

type Movie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

const API_URL = "https://www.omdbapi.com/";
const API_KEY = "96bb7bba";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchMovies() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}?apikey=${API_KEY}&s=${query}&type=movie`
      );
      const data = await res.json();

      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🎬 Buscar Filmes</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Digite o nome do filme..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchMovies}
          style={styles.input}
        />
        <TouchableOpacity onPress={searchMovies} style={styles.button}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.muted}>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          ListEmptyComponent={
            <Text style={[styles.muted, styles.empty]}>
              {query ? "Nenhum filme encontrado." : "Pesquise um filme acima."}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{
                  uri:
                    item.Poster !== "N/A"
                      ? item.Poster
                      : "https://via.placeholder.com/100x150.png?text=No+Image",
                }}
                style={styles.poster}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.Title}</Text>
                <Text style={styles.cardYear}>Ano: {item.Year}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7F9" },
  header: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 80,
    marginBottom: 8,
    color: "#222",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    borderColor: "#DDD",
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: { color: "#FFF", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  muted: { color: "#888" },
  empty: { textAlign: "center", marginTop: 30 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    borderColor: "#EEE",
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 1,
  },
  poster: {
    width: 60,
    height: 90,
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: "#DDD",
  },
  cardTitle: { fontWeight: "700", fontSize: 16, color: "#333" },
  cardYear: { color: "#666", marginTop: 4 },
});
