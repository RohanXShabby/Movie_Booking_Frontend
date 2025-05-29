import { useState, useEffect } from "react";

const DateBar = () => {
    const [days, setDays] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const today = new Date();
        const newDays = Array.from({ length: 7 }, (_, i) => {
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + i);

            return {
                day: futureDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(), // "MON"
                date: futureDate.getDate(), // 29
                month: futureDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), // "MAY"
            };
        });

        setDays(newDays);
    }, []);

    const handleActive = (index) => {
        setActiveIndex(index);
    };

    return (
        <div className="flex justify-start gap-4 bg-dark-primary px-10 md:px-40 rounded-lg shadow-md text-dark-text overflow-x-auto">
            {days.map(({ day, date, month }, index) => (
                <div
                    key={index}
                    onClick={() => handleActive(index)}
                    className={`flex flex-col items-center px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${activeIndex === index
                        ? 'bg-dark-accent text-white'
                        : 'text-dark-text hover:bg-dark-secondary transition'
                        }`}
                >
                    <span className="text-xs font-semibold">{day}</span>
                    <span className="text-xl font-bold">{date}</span>
                    <span className="text-xs">{month}</span>
                </div>
            ))}
        </div>
    );
};

export default DateBar;
