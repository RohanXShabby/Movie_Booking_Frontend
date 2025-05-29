const Screns = [{
    "_id": "1",
    "name": "PVR Icon Cinemas",
    "city": "Mumbai",
    "address": "3rd Floor, Oberoi Mall, Goregaon East, Mumbai, MH, 400063",
    "screens": [
        {
            "_id": "2",
            "name": "Screen 1",
            "screenType": "IMAX",
            "totalSeats": 90,
            "layout": [
                {
                    "row": "A",
                    "seats": [
                        { "number": "A1", "type": "Premium" },
                        { "number": "A2", "type": "Premium" },
                        { "number": "A3", "type": "Premium" },
                        { "number": "A4", "type": "Premium" },
                        { "number": "A5", "type": "Premium" }
                    ]
                },
                {
                    "row": "B",
                    "seats": [
                        { "number": "B1", "type": "Normal" },
                        { "number": "B2", "type": "Normal" },
                        { "number": "B3", "type": "Normal" },
                        { "number": "B4", "type": "Normal" },
                        { "number": "B5", "type": "Normal" }
                    ]
                },
                {
                    "row": "C",
                    "seats": [
                        { "number": "C1", "type": "Normal" },
                        { "number": "C2", "type": "Normal" },
                        { "number": "C3", "type": "Normal" },
                        { "number": "C4", "type": "Normal" },
                        { "number": "C5", "type": "Normal" }
                    ]
                },
                {
                    "row": "D",
                    "seats": [
                        { "number": "D1", "type": "Recliner" },
                        { "number": "D2", "type": "Recliner" },
                        { "number": "D3", "type": "Recliner" },
                        { "number": "D4", "type": "Recliner" },
                        { "number": "D5", "type": "Recliner" }
                    ]
                }
            ],
            "createdAt": "ISODate",
            "updatedAt": "ISODate"
        },
        {
            "_id": "3",
            "name": "Screen 2",
            "screenType": "Standard",
            "totalSeats": 90,
            "layout": "same_as_screen_1",
            "createdAt": "ISODate",
            "updatedAt": "ISODate"
        },
        {
            "_id": "4",
            "name": "Screen 3",
            "screenType": "Standard",
            "totalSeats": 90,
            "layout": "same_as_screen_1",
            "createdAt": "ISODate",
            "updatedAt": "ISODate"
        }
    ],
    "createdAt": "ISODate",
    "updatedAt": "ISODate"
}

]



const SelectSeats = () => {
    return (
        <div>
            SelectSeats
        </div>
    )
}

export default SelectSeats
SelectSeats