import { Bookmark } from 'lucide-react';
import StatusPageLayout from '../../components/books/StatusPageLayout.jsx';

export default function WantToRead() {
  return (
    <StatusPageLayout
      title="Want to Read"
      subtitle="Nothing queued up"
      statusKey="want"
      icon={Bookmark}
      emptyTitle="Your queue is empty"
      emptyDescription="Add books to Want to Read to start building your to-read list."
    />
  );
}
