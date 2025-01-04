import movieModel from './movieModel';
import asyncHandler from 'express-async-handler';
import express from 'express';
import { getUpcomingMovies, getGenres, getMovies, getNowPlayingMovies, getPopularMovies, getSimilarMovies, getRecommendMovies, 
    getMovie, getLanguages, getMovieImages, getMovieReviews
} from '../tmdb-api';


const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const movies = await getMovies();
    console.log(movies)
    res.status(200).json(movies);
}));

// Get movie details
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movie = await movieModel.findByMovieDBId(id);
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).json({message: 'The movie you requested could not be found.', status_code: 404});
    }
}));

router.get('/tmdb/genres', asyncHandler(async (req, res) => {
    const movieGenres = await getGenres();
    res.status(200).json(movieGenres);
}));

router.get('/tmdb/languages', asyncHandler(async (req, res) => {
    const languages = await getLanguages();
    res.status(200).json(languages);
}));

router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    const upcomingMovies = await getUpcomingMovies();
    res.status(200).json(upcomingMovies);
}));

router.get('/tmdb/nowplaying', asyncHandler(async (req, res) => {
    const nowPlayingMovies = await getNowPlayingMovies();
    res.status(200).json(nowPlayingMovies);
}));

router.get('/tmdb/popular', asyncHandler(async (req, res) => {
    const popularMovies = await getPopularMovies();
    res.status(200).json(popularMovies);
}));

router.get('/tmdb/:id/similar', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const similarMovies = await getSimilarMovies(id);
    res.status(200).json(similarMovies);
}));

router.get('/tmdb/:id/recommendations', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const recommendMovies = await getRecommendMovies(id);
    res.status(200).json(recommendMovies);
}));

router.get('/tmdb/:id/images', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const movieImages = await getMovieImages(id);
    res.status(200).json(movieImages);
}));

router.get('/tmdb/:id/reviews', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const movieReviews = await getMovieReviews(id);
    res.status(200).json(movieReviews);
}));


export default router;
