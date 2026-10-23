import { BookOpen } from 'lucide-react';
import StatusPageLayout from '../../components/books/StatusPageLayout.jsx';

export default function CurrentlyReading() {
  return (
    <StatusPageLayout
      title="Currently Reading"
      subtitle="No books in progress"
      statusKey="reading"
      icon={BookOpen}
      emptyTitle="Nothing on your bedside table"
      emptyDescription="Start a book from your Want to Read list, or add a new one."
    />
  );
}
