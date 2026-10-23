import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Bookmark,
  BookX,
  Pencil,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import Button from '../ui/Button.jsx';
import './BookActions.css';

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookActions({
  book,
  onUpdate,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  const startReading = () => {
    onUpdate(book.id, {
      status: 'reading',
      dateStarted: book.dateStarted ?? isoDate(),
    });
  };

  const markFinished = () => {
    onUpdate(book.id, {
      status: 'finished',
      dateFinished: isoDate(),
      pagesRead: book.pages,
    });
  };

  const moveToWant = () => {
    onUpdate(book.id, {
      status: 'want',
      pagesRead: 0,
      dateStarted: null,
      dateFinished: null,
    });
  };

  const drop = () => {
    onUpdate(book.id, { status: 'dropped' });
  };

  return (
    <div className="book-actions">
      {book.status === 'want' && (
        <Button variant="primary" icon={BookOpen} onClick={startReading}>
          Start Reading
        </Button>
      )}

      {book.status === 'reading' && (
        <>
          <Button
            variant="primary"
            icon={ArrowRight}
            onClick={() => navigate('/currently-reading')}
          >
            Continue Reading
          </Button>
          <Button
            variant="secondary"
            icon={CheckCircle2}
            onClick={markFinished}
          >
            Mark as Finished
          </Button>
          <Button variant="secondary" icon={BookX} onClick={drop}>
            Drop
          </Button>
        </>
      )}

      {book.status === 'finished' && (
        <>
          <Button variant="secondary" icon={Bookmark} onClick={moveToWant}>
            Move to Want to Read
          </Button>
        </>
      )}

      {book.status === 'dropped' && (
        <>
          <Button variant="primary" icon={BookOpen} onClick={startReading}>
            Start Reading
          </Button>
          <Button variant="secondary" icon={Bookmark} onClick={moveToWant}>
            Move to Want to Read
          </Button>
        </>
      )}

      <Button variant="ghost" icon={Pencil} onClick={onEdit}>
        Edit
      </Button>
      <Button variant="danger" icon={Trash2} onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
