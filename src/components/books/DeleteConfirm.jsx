import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

export default function DeleteConfirm({ open, book, onClose, onConfirm }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete this book?"
      description={
        book
          ? `"${book.title}" will be permanently removed from The Archive.`
          : undefined
      }
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger-solid" onClick={onConfirm}>
            Delete permanently
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
        This action cannot be undone.
      </p>
    </Modal>
  );
}
