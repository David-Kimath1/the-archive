/**
 * Seed data for quotes. When the user adds or deletes a quote,
 * it is stored in localStorage via QuotesContext.
 */
export const initialQuotes = [
  {
    id: 'q1',
    text: 'A reader lives a thousand lives before he dies. The man who never reads lives only one.',
    bookTitle: 'A Dance with Dragons',
    author: 'George R.R. Martin',
    pageNumber: 420,
    note: 'The ultimate argument for reading.',
    dateSaved: '2026-08-14',
  },
  {
    id: 'q2',
    text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    bookTitle: 'Pride and Prejudice',
    author: 'Jane Austen',
    pageNumber: 1,
    note: 'The greatest opening line in English literature.',
    dateSaved: '2026-09-02',
  },
  {
    id: 'q3',
    text: 'We are what we pretend to be, so we must be careful about what we pretend to be.',
    bookTitle: 'Mother Night',
    author: 'Kurt Vonnegut',
    pageNumber: 112,
    note: '',
    dateSaved: '2026-10-10',
  },
  {
    id: 'q4',
    text: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    bookTitle: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    pageNumber: 180,
    note: 'Devastating.',
    dateSaved: '2026-06-21',
  },
  {
    id: 'q5',
    text: 'The man who does not read good books has no advantage over the man who cannot read them.',
    bookTitle: 'The Autobiography of Mark Twain',
    author: 'Mark Twain',
    pageNumber: 204,
    note: '',
    dateSaved: '2026-07-15',
  },
];
