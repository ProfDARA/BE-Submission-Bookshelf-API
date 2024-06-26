const books =require('./books');
const { nanoid } = require('nanoid');

const addBookHandler = (request, h) =>{
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } =request.payload;

    if(!name){
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            }) 
            .code(400);
        return response;
    }


    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount ===readPage;



    if (readPage > pageCount){
        const response = h
            .response({
                status:'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            })
            .code(400);
        return response;
    }



    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };




    books.push(newBook);
    const isSuccess = books.filter((book) => book.id).length >0;

    if(isSuccess){
        const response = h
            .response({
                status:'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                }
            })
            .code(201);
        return response;
    }

    const response = h
        .response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku', 
        })
        .code(500);
    return response;

};





const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const filteredBooksName = books.filter((book) => {
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(book.name);
    });

    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
    return response;
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    const filteredBooksReading = books.filter(
      (book) => book.reading === isReading
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    const filteredBooksFinished = books.filter(
      (book) => book.finished === isFinished
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  const response = h
    .response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);

  return response;
};


const editBookByHandler = (request, h) => {
    const { bookId } = request.params;
  
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
  

    if (!name) {
      const response = h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
      return response;
    }
  

    if (readPage > pageCount) {
      const response = h
        .response({
          status: 'fail',
          message:
            'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
      return response;
    }
  
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
  
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      };
  
      const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        })
        .code(200);
      return response;
    }
  

    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
    return response;
};

const getBookByIdHandler = (request, h) => {
    
  const { bookId } = request.params;
  const book = books.filter((note) => note.id === bookId)[0];

  if (book) {
    const response = h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return response;

}


const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
  
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books.splice(index, 1);
  
      const response = h
        .response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        })
        .code(200);
      return response;
    }
  

    const response = h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByHandler,
    deleteBookByIdHandler,
};