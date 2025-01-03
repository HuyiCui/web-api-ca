import React, {useState, useEffect}  from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import img from '../../images/pexels-dziana-hasanbekava-5480827.jpg'
import { getGenres } from "../../api/tmdb-api";
import { getLanguages } from "../../api/tmdb-api";
import { useQuery } from "react-query";
import Spinner from '../spinner'

const formControl = 
  {
    margin: 1,
    minWidth: "90%",
    backgroundColor: "rgb(255, 255, 255)"
  };

export default function FilterMoviesCard(props) {

  const { data, error, isLoading, isError } = useQuery("genres", getGenres);
  const { data: languagesData, isLoading: languagesLoading } = useQuery("languages", getLanguages);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const genres = data.genres;
  if (genres[0].name !== "All"){
    genres.unshift({ id: "0", name: "All" });
  }

  const languages = languagesData || [];
    if (languages[0]?.english_name !== "All") {
        languages.unshift({ iso_639_1: "all", english_name: "All" });
    }

  const handleChange = (e, type, value) => {
    e.preventDefault();
    props.onUserInput(type, value); // NEW
  };

  const handleTextChange = (e, props) => {
    handleChange(e, "name", e.target.value);
  };

  const handleGenreChange = (e) => {
    handleChange(e, "genre", e.target.value);
  };

  const handleLanguageChange = (e) => {
    handleChange(e, "language", e.target.value);
};

  return (
    <Card 
      sx={{
        backgroundColor: "rgb(204, 204, 204)"
      }} 
      variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1">
          <SearchIcon fontSize="large" />
          Filter the movies.
        </Typography>
        <TextField
            sx={{...formControl}}
            id="filled-search"
            label="Search field"
            type="search"
            variant="filled"
            value={props.titleFilter}
            onChange={handleTextChange}
        />
        <FormControl sx={{...formControl}}>
          <InputLabel id="genre-label"></InputLabel>
            <Select
                labelId="genre-label"
                id="genre-select"
                defaultValue=""
                value={props.genreFilter}
                onChange={handleGenreChange}
            >
            {genres.map((genre) => {
              return (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              );
            })}
          </Select>
          <InputLabel id="language-label"></InputLabel>
            <Select
                labelId="language-label"
                id="language-select"
                value={props.languageFilter}
                onChange={handleLanguageChange}
            >
                {languages.map((lang) => (
                    <MenuItem key={lang.iso_639_1} value={lang.iso_639_1}>
                        {lang.english_name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
      </CardContent>
      <CardMedia
        sx={{ height: 300 }}
        image={img}
        title="Filter"
      />
      <CardContent>
        <Typography variant="h5" component="h1">
          <SearchIcon fontSize="large" />
          Filter the movies.
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
}
