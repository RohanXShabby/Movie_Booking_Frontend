const MovieCard = ({ posterUrl, title, description, genre }) => {
    return (
        <div className='border border-dark-secondary flex flex-col justify-center py-4 rounded-2xl h-full items-center text-dark-text'>
            <div className=' flex flex-col gap-4 p-3 h-full'>
                <div className="h-[80%]">
                    <img className='w-full h-full object-cover object-center' src={posterUrl} alt={title} />
                </div>
                <div className='flex flex-col gap-2 h-[20%]'>
                    <div className='flex flex-col gap-1'>
                        <div className='font-semibold text-2xl whitespace-nowrap'>
                            {title}
                        </div>
                        <div className='text-dark-text/60'>
                            {genre.map((e, i) => <span key={i} className='border border-dark-secondary px-2 mx-1'>{e}</span>)}
                        </div>
                    </div>
                    <div className='line-clamp-2 font-medium text-sm text-dark-text/80'>
                        {description}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MovieCard
