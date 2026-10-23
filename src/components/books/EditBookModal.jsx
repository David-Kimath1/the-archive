import { useEffect, useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import './EditBookModal.css';

const GENRES = [
  'Fantasy',
  'Science Fiction',
  'Literary Fiction',
  'Non-fiction',
  'Memoir',
  'Mystery',
  'Romance',
  'History',
  'Biography',
  'Poetry',
];

const STATUSES = [
  { value: 'want', label: 'Want to Read' },
  { value: 'reading', label: 'Currently Reading' },
  { value: 'finished', label: 'Finished' },
  { value: 'dropped', label: 'Dropped' },
];

export default function EditBookModal({ open, book, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: 'Fantasy',
    pages: 0,
    pagesRead: 0,
    status: 'want',
    rating: 0,
    publisher: '',
    publicationDate: '',
    isbn: '',
    description: '',
  });

  useEffect(() => {
    if (open && book) {
      setForm({
        title: book.title ?? '',
        author: book.author ?? '',
        genre: book.genre ?? 'Fantasy',
        pages: book.pages ?? 0,
        pagesRead: book.pagesRead ?? 0,
        status: book.status ?? 'want',
        rating: book.rating ?? 0,
        publisher: book.publisher ?? '',
        publicationDate: book.publicationDate ?? '',
        isbn: book.isbn ?? '',
        description: book.description ?? '',
      });
    }
  }, [open, book]);

  const set = (key) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [key]: v }));
  };

  const setNum = (key) => (e) => {
    const v = Number(e.target.value) || 0;
    setForm((f) => ({ ...f, [key]: v }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      pages: Number(form.pages) || 0,
      pagesRead: Math.min(Number(form.pagesRead) || 0, Number(form.pages) || 0),
      rating: Number(form.rating) || 0,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Book"
      description="Update details for this book."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="edit-book-form">
            Save Changes
          </Button>
        </>
      }
    >
      <form id="edit-book-form" className="edit-form" onSubmit={handleSubmit}>
        <div className="edit-form__row edit-form__row--full">
          <label className="edit-form__label">
            <span>Title</span>
            <input type="text" value={form.title} onChange={set('title')} required />
          </label>
        </div>
        <div className="edit-form__row">
          <label className="edit-form__label">
            <span>Author</span>
            <input type="text" value={form.author} onChange={set('author')} required />
          </label>
          <label className="edit-form__label">
            <span>Genre</span>
            <select value={form.genre} onChange={set('genre')}>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="edit-form__row">
          <label className="edit-form__label">
            <span>Publisher</span>
            <input type="text" value={form.publisher} onChange={set('publisher')} />
          </label>
          <label className="edit-form__label">
            <span>Publication Date</span>
            <input
              type="date"
              value={form.publicationDate?.slice(0, 10) ?? ''}
              onChange={set('publicationDate')}
            />
          </label>
        </div>
        <div className="edit-form__row">
          <label className="edit-form__label">
            <span>ISBN</span>
            <input type="text" value={form.isbn} onChange={set('isbn')} />
          </label>
          <label className="edit-form__label">
            <span>Pages</span>
            <input type="number" min="0" value={form.pages} onChange={setNum('pages')} />
          </label>
        </div>
        <div className="edit-form__row">
          <label className="edit-form__label">
            <span>Pages Read</span>
            <input
              type="number"
              min="0"
              max={form.pages}
              value={form.pagesRead}
              onChange={setNum('pagesRead')}
            />
          </label>
          <label className="edit-form__label">
            <span>Status</span>
            <select value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="edit-form__row edit-form__row--full">
          <label className="edit-form__label">
            <span>Rating</span>
            <select value={form.rating} onChange={setNum('rating')}>
              <option value={0}>Not rated</option>
              <option value={1}>1 star</option>
              <option value={2}>2 stars</option>
              <option value={3}>3 stars</option>
              <option value={4}>4 stars</option>
              <option value={5}>5 stars</option>
            </select>
          </label>
        </div>
        <div className="edit-form__row edit-form__row--full">
          <label className="edit-form__label">
            <span>Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={set('description')}
            />
          </label>
        </div>
      </form>
    </Modal>
  );
}
