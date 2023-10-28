import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from './CartContext';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ShoppingCart } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';


const BookCard = ({ book, addToCart }) => (
  <Paper key={book._id} elevation={3} style={{ width: '18rem', padding: '16px', marginBottom:'20px' }}>
    <Link to={`/books/${book._id}`} className="card-link">
      <img src={book.coverImage} alt={book.title} style={{ maxWidth: '100px' }} />
      <div className="card-body" style={{ minHeight: '180px' }}>
        <h5 className="card-title">{book.title}</h5>
        <p className="card-text">Author: {book.author}</p>
        <p className="card-text">₹{book.price}</p>
      </div>
      <div className="card-footer" style={{ marginTop: 'auto' }}>
        <Button
          onClick={() => addToCart(book)}
          variant="contained"
          color="primary"
          startIcon={<ShoppingCart />}
        >
          Add to Cart
        </Button>
      </div>
    </Link>
  </Paper>
);




const BookList = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');

  const { addToCart } = useCart(); // Access addToCart function from the context

  const booksPerPage = 4;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Calculate indexes for books to display on the current page
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  // Apply search and filter to books
  let filteredBooks = [...books];
  if (searchTerm.trim() !== '') {
    filteredBooks = filteredBooks.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterAuthor.trim() !== '') {
    filteredBooks = filteredBooks.filter(
      (book) => book.author.toLowerCase() === filterAuthor.toLowerCase()
    );
  }

  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container maxWidth="md" className="container-typo">
      <div className="filters">
        <TextField
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setCurrentPage(1);
            setSearchTerm(e.target.value);
          }}
          placeholder="Search"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setSearchTerm('')} edge="end">
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <TextField
          type="text"
          value={filterAuthor}
          onChange={(e) => {
            setCurrentPage(1);
            setFilterAuthor(e.target.value);
          }}
          placeholder="Filter by Author"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setFilterAuthor('')} edge="end">
                <FilterListIcon />
              </IconButton>
            ),
          }}
        />
      </div>
      <div className="book-list">
        {currentBooks.map((book) => (
          <BookCard key={book._id} book={book} addToCart={addToCart} />
        ))}
      </div>
      <Pagination
        booksPerPage={booksPerPage}
        totalBooks={filteredBooks.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </Container>
  );
};

const Pagination = ({ booksPerPage, totalBooks, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBooks / booksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <div className="pagination">
        {pageNumbers.map((number) => (
          <div key={number} className={number === currentPage ? 'active' : ''}>
            <button onClick={() => paginate(number)} className="pagination-btn">
              {number}
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default BookList;
