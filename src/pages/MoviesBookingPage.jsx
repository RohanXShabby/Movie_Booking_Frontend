import axiosInstance from "../Services/axiosInstance"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const MoviesBookingPage = () => {
    const { id } = useParams()
    const [moviesDetails, setMoviesDetails] = useState({});


    const fetchMovieData = async () => {
        const request = await axiosInstance.get(`/movies/${id}`)
        const data = await request.data.data
        return data
    }
    useEffect(() => {
        fetchMovieData().then((data) => {
            setMoviesDetails(data)
        })
    }, []);
    // { console.log(moviesDetails) }

    return (
        <div className="px-24">
            <div className="flex justify-between  py-20 flex-wrap">
                <div className="h-auto   w-[30%]">
                    <img className="h-auto w-full object-center object-cover " src={moviesDetails.posterUrl} alt={moviesDetails.title} />
                </div>
                <div className="w-[70%] px-24 flex flex-col gap-4 justify-center">
                    <h1 className="text-4xl font-bold pointer-events-none">{moviesDetails.title}</h1>
                    <div className="flex gap-4">
                        {moviesDetails.language?.map((e, i) => {
                            return <span className="border-2 border-dark-accent text-lg px-4 py-2 rounded-xl pointer-events-none " key={i} >
                                {e}
                            </span>
                        })}
                    </div>
                    <div className="flex gap-2 pointer-events-none font-semibold text-lg whitespace-nowrap">
                        <span>{moviesDetails.duration} Min</span>
                        <span>•</span>
                        <span>
                            {moviesDetails.genre?.map((e, i) => (
                                <span key={i}>
                                    {e}{i !== moviesDetails.genre.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </span>
                        <span>•</span>
                        <span>{moviesDetails.rating}</span>
                        <span>•</span>
                        <span>{moviesDetails.releaseDate}</span>
                    </div>
                    <div className="w-[50%] text-md text-dark-text">
                        {moviesDetails.description}
                    </div>
                    <div className="mt-24">
                        <Link to={`/movies/book-tickets/${id}`} className="font-bold text-2xl bg-dark-accent px-4 py-2 rounded-lg text-dark-primary cursor-pointer ">Book Ticket</Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MoviesBookingPage
