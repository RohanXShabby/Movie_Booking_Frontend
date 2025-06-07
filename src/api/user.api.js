import axiosInstance from "../Services/axiosInstance";


export const getAllMovie = async () => {
    const request = await axiosInstance.get('/movies');
    const response = await request.data?.movies;
    return [...response];
}

export const getMovieById = async ({ params }) => {
    const { id } = params
    const request = await axiosInstance.get(`/movies/${id}`)
    const data = await request.data.data
    return data
}

export const getTheatersByMovie = async ({ params }) => {
    try {
        const res = await axiosInstance(`/theaters/movie/${params.id}`);
        return res.data.theaters || [];
    } catch (err) {
        return [];
    }
};