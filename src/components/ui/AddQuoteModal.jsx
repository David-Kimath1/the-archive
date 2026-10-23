import { useState } from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import './AddQuoteModal.css';

export default function AddQuoteModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    text: '',
    bookTitle: '',
    author: '',
    pageNumber: '',
    note: '',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    onSave({
      ...form,
      pageNumber: Number(form.pageNumber) || 0,
      dateSaved: new Date().toISOString().slice(0, 10),
    });
    setForm({ text: '', bookTitle: '', author: '', pageNumber: '', note: '' });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save a Quote"
      description="Preserve a meaningful passage."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="add-quote-form">
            Save Quote
          </Button>
        </>
      }
    >
      <form id="add-quote-form" className="quote-form" onSubmit={handleSubmit}>
        <label className="quote-form__label">
          <span>Quote Text *</span>
          <textarea
            rows={4}
            value={form.text}
            onChange={set('text')}
            placeholder="Enter the passage…"
            required
          />
        </label>
        <div className="quote-form__row">
          <label className="quote-form__label">
            <span>Book Title</span>
            <input type="text" value={form.bookTitle} onChange={set('bookTitle')} />
          </label>
          <label className="quote-form__label">
            <span>Author</span>
            <input type="text" value={form.author} onChange={set('author')} />
          </label>
        </div>
        <div className="quote-form__row">
          <label className="quote-form__label">
            <span>Page Number</span>
            <input type="number" value={form.pageNumber} onChange={set('pageNumber')} />
          </label>
          <label className="quote-form__label">
            <span>Personal Note</span>
            <input type="text" value={form.note} onChange={set('note')} />
          </label>
        </div>
      </form>
    </Modal>
  );
}
