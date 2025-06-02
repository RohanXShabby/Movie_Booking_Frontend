import { useParams, useLoaderData, Link } from "react-router-dom";
import { useState } from "react";

const SelectTheater = () => {
    const { id } = useParams();
    const theaters = useLoaderData();
    const [selected, setSelected] = useState({ theaterId: null, showIdx: null });

    const grouped = {};
    theaters.forEach(show => {
        const tId = show.theaterId?._id || show.theaterId;
        if (!grouped[tId]) {
            grouped[tId] = {
                theater: show.theaterId,
                shows: []
            };
        }
        grouped[tId].shows.push(show);
    });
    console.log(theaters)
    const groupedTheaters = Object.values(grouped);
    console.log(groupedTheaters)

    return (
        <div className="px-40 py-20 flex flex-col gap-8">
            {groupedTheaters.length === 0 && (
                <div className="text-center text-gray-400">No theaters found for this movie.</div>
            )}
            {groupedTheaters.map((group, i) => (
                <div key={group.theater?._id || i} className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h3 className="font-bold text-lg leading-tight">{group.theater?.name}</h3>
                            <div className="text-gray-400 text-sm flex gap-2 items-center">
                                <span>{group.theater?.address}</span>
                                <span className="mx-1">|</span>
                                <span>Allows cancellation</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {group.shows.map((show, idx) => (
                            <Link
                                to={`/movies/book-tickets/${id}/${group.theater?._id}/${show.screenId}`}
                                key={show._id}
                                onClick={() => setSelected({ theaterId: group.theater?._id, showIdx: idx })}
                                className={`cursor-pointer px-6 py-1 rounded-xl font-semibold text-lg flex flex-col items-center leading-6 min-w-[120px] shadow-sm transition ${selected.theaterId === group.theater?._id && selected.showIdx === idx
                                    ? 'bg-dark-accent text-white'
                                    : 'bg-dark-text text-black hover:bg-dark-accent hover:text-white'}`}
                            >
                                <span>{show.time}</span>
                                {show.format && (
                                    <span className="text-xs font-normal text-gray-500 mt-1">{show.format}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SelectTheater;
