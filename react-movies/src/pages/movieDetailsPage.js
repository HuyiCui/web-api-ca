import React from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import MovieDetails from "../components/movieDetails/";
import PageTemplate from "../components/templateMoviePage";
import { getMovie } from '../api/tmdb-api';
import { useQuery } from "react-query";
import Spinner from '../components/spinner';

const MoviePage = () => {
  const { id } = useParams();

  const { data: movie, error, isLoading, isError } = useQuery(
    ["movie", { id }],
    getMovie
  );

  const handleAddToFavorites = async () => {
    const token = localStorage.getItem("token");
    const userId = "user_id";

    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/users/${userId}/favourites`,
        { movieId: movie.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Movie added to favorites!");
    } catch (err) {
      alert("Failed to add movie to favorites");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      {movie ? (
        <PageTemplate movie={movie}>
          <MovieDetails movie={movie} />
          <button onClick={handleAddToFavorites}>Add to Favorites</button>
        </PageTemplate>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
};

export default MoviePage;
