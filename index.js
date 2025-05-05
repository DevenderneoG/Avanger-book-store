const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");
const BookStore = require("./models/book.models");

app.use(express.json());

initializeDatabase();

// const newHotel = {
//   name: "Sunset Resort",
//   category: "Resort",
//   location: "12 Main Road, Anytown",
//   rating: 4.0,
//   reviews: [],
//   website: "https://sunset-example.com",
//   phoneNumber: "+1299655890",
//   checkInTime: "2:00 PM",
//   checkOutTime: "11:00 AM",
//   amenities: [
//     "Room Service",
//     "Horse riding",
//     "Boating",
//     "Kids Play Area",
//     "Bar"
//   ],
//   priceRange: "$$$$ (61+)",
//   reservationsNeeded: true,
//   isParkingAvailable: true,
//   isWifiAvailable: true,
//   isPoolAvailable: true,
//   isSpaAvailable: true,
//   isRestaurantAvailable: true,
//   photos: [
//     "https://example.com/hotel2-photo1.jpg",
//     "https://example.com/hotel2-photo2.jpg"
//   ]
// };

async function createBook(newBook) {
  try {
    const book = new BookStore(newBook);
    const saveBook = await book.save();
    console.log("New Book Data", saveBook);
  } catch (error) {
    throw error;
  }
}

app.post("/book", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    res.status(201).json({message: "Book Added successfully.", book: savedBook})
  } catch (error) {
    res.status(500).json({error: "Failed to add book."})
  }
})


//to get all the hotels in the database

async function readAllHotels() {
  try {
    const readHotels = await Hotels.find();
    return readHotels;
  } catch (error) {
    throw error
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if(hotels.length != 0) {
      res.json(hotels)
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant." });
  }
})


// readAllHotels();

// find a hotel with a particular name

async function readByHotelName(hotelName) {
  try {
    const hotelsByName = await Hotels.findOne({name: hotelName});
    return hotelsByName;
  } catch (error) {
    console.log(error)
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotelByName = await readByHotelName(req.params.hotelName);
    if(hotelByName.length != 0) {
      res.json(hotelByName)
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant." });
  }
})

// readByHotelName("Lake View");

async function hotelUpdate(hotelId, dataToUpdate) {
  try {
    const updatedHotel = await Hotels.findByIdAndUpdate(hotelId, dataToUpdate, {new: true})
    return updatedHotel;
  } catch (error) {
    console.log("Error in updating Hotel data", error)
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const hotelUpdatedById = await hotelUpdate(req.params.hotelId, req.body);
    if(hotelUpdatedById) {
      res.status(200).json({message: "Hotel updated successfully.", hotelUpdatedById: hotelUpdatedById});
    } else {
      res.status(404).json({message: "Hotel not found."});
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Hotel." });
  }
})

// hotelUpdate("671f74d2f145e1b243c3bf0f", {checkOutTime: "11:00 AM"})

async function deleteHotelById (restaurantId) {
  try {
    const deleteHotel = await Hotels.findByIdAndDelete(restaurantId);
    console.log(deleteHotel);
  } catch (error) {
    console.log("Error in Deleting Hotel data", error)
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotelById(req.params.hotelId);
    if (deletedHotel) {
      res.status(200).json({message: "Hotel deleted successfully."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to delete Hotel."})
  }
})


const PORT = 3000;
app.listen(PORT, ()=> {
  console.log("Server running on port", PORT)
})