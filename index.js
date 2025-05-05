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
async function readAllBooks() {
  try {
    const readBooks = await BookStore.find();
    return readBooks;
  } catch (error) {
    throw error
  }
} 

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();
    if(books.length != 0) {
      res.json(books)
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
    
  }
})

async function deleteBookById (bookId) {
  try {
    const deleteBook = await BookStore.findByIdAndDelete(bookId);
    console.log(deleteBook);
  } catch (error) {
    console.log("Error in Deleting Book data", error)
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBookById(req.params.bookId);
    if (deletedBook) {
      res.status(200).json({message: "Book deleted successfully."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to delete Book."})
  }
})


// readAllHotels();

// async function hotelUpdate(hotelId, dataToUpdate) {
//   try {
//     const updatedHotel = await Hotels.findByIdAndUpdate(hotelId, dataToUpdate, {new: true})
//     return updatedHotel;
//   } catch (error) {
//     console.log("Error in updating Hotel data", error)
//   }
// }

// app.post("/hotels/:hotelId", async (req, res) => {
//   try {
//     const hotelUpdatedById = await hotelUpdate(req.params.hotelId, req.body);
//     if(hotelUpdatedById) {
//       res.status(200).json({message: "Hotel updated successfully.", hotelUpdatedById: hotelUpdatedById});
//     } else {
//       res.status(404).json({message: "Hotel not found."});
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update Hotel." });
//   }
// })

// hotelUpdate("671f74d2f145e1b243c3bf0f", {checkOutTime: "11:00 AM"})




const PORT = 3000;
app.listen(PORT, ()=> {
  console.log("Server running on port", PORT)
})