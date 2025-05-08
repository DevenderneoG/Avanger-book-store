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


async function bookReadUpdate(bookId, dataToUpdate) {
  try {
    const updatedBook = await BookStore.findByIdAndUpdate(
      bookId,
      { $set: { isRead: dataToUpdate.isRead } }, 
      { new: true }
    );
    return updatedBook;
  } catch (error) {
    console.error("Error in updating Book data:", error);
    throw error;
  }
}

app.patch("/books/:bookId/toggle-read", async (req, res) => {
  try {
    const bookUpdatedById = await bookReadUpdate(req.params.bookId, req.body);
    if (bookUpdatedById) {
      res.status(200).json({
        message: "Book read status updated successfully.",
        bookUpdatedById,
      });
    } else {
      res.status(404).json({ message: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book read status." });
  }
});



const PORT = 3000;
app.listen(PORT, ()=> {
  console.log("Server running on port", PORT)
})