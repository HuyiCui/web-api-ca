import React, {useState} from "react";
import { getUpcomingMovies} from "../api/tmdb-api";
import PageTemplate from '../components/templateMovieListPage';
import { useQuery } from 'react-query';
import Spinner from '../components/spinner';
import AddToMustWatchIcon from "../components/cardIcons/addToMustWatch";

const UpcomingMoviesPage = (props) => {

  const {  data, error, isLoading, isError }  = useQuery('upcoming', getUpcomingMovies)
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

  return (
    <div>
    <button onClick={toggleSortOrder}>
      Sort by Vote Average ({sortOrder === "asc" ? "Ascending" : "Descending"})
    </button>
    
    <PageTemplate
      title="Upcoming Movies"
      movies={currentMovies}
      action={(movie) => {
        return <AddToMustWatchIcon movie={movie} />;
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
export default UpcomingMoviesPage;