import { CheckCircle2 } from 'lucide-react';
import StatusPageLayout from '../../components/books/StatusPageLayout.jsx';

export default function Finished() {
  return (
    <StatusPageLayout
      title="Finished"
      subtitle="No finished books yet"
      statusKey="finished"
      icon={CheckCircle2}
      emptyTitle="The first one is the best one"
      emptyDescription="When you finish a book it will appear here, ready to revisit."
    />
  );
}
