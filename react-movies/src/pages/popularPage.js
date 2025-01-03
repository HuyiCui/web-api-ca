import React,{useState} from "react";
import { getPopularity } from "../api/tmdb-api";
import PageTemplate from '../components/templateMovieListPage';
import { useQuery } from 'react-query';
import Spinner from '../components/spinner';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites'

const PopularityPage = (props) => {

  const {  data, error, isLoading, isError }  = useQuery('popular', getPopularity)
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1); 
  const moviesPerPage = 10;

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return <h1>{error.message}</h1>
  }  
  const movies = data.results;

  const sortedMovies = [...movies].sort((a, b) => {
    return sortOrder === "asc"
      ? a.vote_average - b.vote_average 
      : b.vote_average - a.vote_average; 
  });

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(sortedMovies.length / moviesPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Redundant, but necessary to avoid app crashing.
  const favorites = movies.filter(m => m.favorite)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  const addToFavorites = (movieId) => true 

  return (
    <div>
    <button onClick={toggleSortOrder}>
      Sort by Vote Average ({sortOrder === "asc" ? "Ascending" : "Descending"})
    </button>
    
    <PageTemplate
      title="Popular Movies"
      movies={currentMovies}
      action={(movie) => {
        return <AddToFavoritesIcon movie={movie} />;
      }}
    />
    <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
  </div>
);
};
export default PopularityPage;