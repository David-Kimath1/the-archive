import { BookX } from 'lucide-react';
import StatusPageLayout from '../../components/books/StatusPageLayout.jsx';

export default function Dropped() {
  return (
    <StatusPageLayout
      title="Dropped"
      subtitle="Nothing dropped"
      statusKey="dropped"
      icon={BookX}
      emptyTitle="Not everything is for everyone"
      emptyDescription="Books you decide to set aside will live here, kept in your archive."
    />
  );
}
