const MovieCard = ({ posterUrl, title, description, genre, rating = "N/A" }) => {
    return (
        <div className='group border border-dark-secondary hover:border-dark-accent transition-all duration-300 flex flex-col justify-between p-3 sm:p-4 rounded-2xl h-full shadow-lg hover:shadow-xl bg-dark-primary/50 backdrop-blur'>
            {/* Image Container */}
            <div className="relative w-full pb-[140%] overflow-hidden rounded-lg mb-4">
                <img
                    className='absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300'
                    src={posterUrl}
                    alt={title}
                    loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-dark-accent text-white px-2 py-1 rounded-full text-sm font-semibold">
                    ★ {rating}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <button className="w-full bg-dark-accent text-white py-2 rounded-lg font-semibold hover:bg-dark-accent/90 transition-colors">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className='flex flex-col gap-3'>
                {/* Title and Rating */}
                <div className="flex justify-between items-start">
                    <h3 className='font-semibold text-lg sm:text-xl md:text-2xl line-clamp-1 group-hover:text-dark-accent transition-colors flex-1'>
                        {title}
                    </h3>
                </div>

                {/* Genres */}
                <div className='flex flex-wrap gap-2'>
                    {genre.map((g, i) => (
                        <span
                            key={i}
                            className='text-xs sm:text-sm px-2 py-1 rounded-full border border-dark-secondary bg-dark-secondary/30 text-dark-text/80'
                        >
                            {g}
                        </span>
                    ))}
                </div>

                {/* Description */}
                <p className='line-clamp-2 text-xs sm:text-sm text-dark-text/70 font-medium'>
                    {description}
                </p>
            </div>
        </div>
    )
}

export default MovieCard
