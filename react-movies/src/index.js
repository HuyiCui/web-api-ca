import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import MoviePage from "./pages/movieDetailsPage";
import FavoriteMoviesPage from "./pages/favoriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import SiteHeader from './components/siteHeader'
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import MoviesContextProvider from "./contexts/moviesContext";
import AddMovieReviewPage from './pages/addMovieReviewPage'
import UpcomingMoviesPage from './pages/upcomingMoviesPage'
import NowPlayingPage from "./pages/nowPlayingPage";
import PopularityPage from "./pages/popularPage";
import SimilarMoviePage from "./pages/similarMoviePage";
import RecommendMoviePage from "./pages/recommendMoviePage"
import LoginPage from "./pages/loginPage"
import ProtectedRoutes from "./protectedRoutes";
import AuthContextProvider from "./contexts/authContext";
import SignUpPage from "./pages/signUpPage";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000, 
      refetchOnWindowFocus: false
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContextProvider>
        <SiteHeader />
        <MoviesContextProvider>
          <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/movies/favorites" element={<FavoriteMoviesPage />} />
            <Route path="/reviews/:id" element={ <MovieReviewPage /> } />
            <Route path="/movies/:id" element={<MoviePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={ <Navigate to="/" /> } />
            <Route path="/reviews/form" element={ <AddMovieReviewPage /> } />
            <Route path="/movies/upcoming" element={<UpcomingMoviesPage />} />
            <Route path="/movies/nowplaying" element={<NowPlayingPage />} />
            <Route path="/movies/popularity" element={<PopularityPage />} />
            <Route path="/similar/:id" element={<SimilarMoviePage />} />
            <Route path="/recommend/:id" element={<RecommendMoviePage />} />
            </Route>
            <Route path="/signup" element={ <SignUpPage /> } />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MoviesContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const rootElement = createRoot( document.getElementById("root") )
rootElement.render(<App />);