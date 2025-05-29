import axiosInstance from "../../Services/axiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

const MovieContainer = () => {
    const [movies, setMovies] = useState()

    const fetchedMovie = async () => {
        const request = await axiosInstance.get('/get-movies');
        const response = await request.data?.movies
        setMovies([...response])
    }

    useEffect(() => {
        fetchedMovie()
    }, [])

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8 py-12 px-[5vw]">
            {movies && movies.map((node) => {
                return <Link to={`/movies/${node._id}`} key={node._id}>
                    <MovieCard posterUrl={node.posterUrl} title={node.title} description={node.description} genre={node.genre} />
                </Link>
            })}
        </div>
    )
}

export default MovieContainer
