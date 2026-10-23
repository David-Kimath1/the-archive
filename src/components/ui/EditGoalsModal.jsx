import { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import './EditGoalsModal.css';

export default function EditGoalsModal({ open, onClose, currentGoals, onSave }) {
  const [form, setForm] = useState(currentGoals);

  useEffect(() => {
    if (open) setForm(currentGoals);
  }, [open, currentGoals]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: Number(e.target.value) || 0 }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Reading Goals"
      description="Set your targets for the year and the month."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="edit-goals-form">
            Save Goals
          </Button>
        </>
      }
    >
      <form id="edit-goals-form" className="goals-form" onSubmit={handleSubmit}>
        <div className="goals-form__section">
          <h3 className="goals-form__title">Annual Goals</h3>
          <div className="goals-form__row">
            <label className="goals-form__label">
              <span>Books</span>
              <input type="number" min="0" value={form.annualBooks} onChange={set('annualBooks')} />
            </label>
            <label className="goals-form__label">
              <span>Pages</span>
              <input type="number" min="0" value={form.annualPages} onChange={set('annualPages')} />
            </label>
          </div>
        </div>

        <div className="goals-form__section">
          <h3 className="goals-form__title">Monthly Goals</h3>
          <div className="goals-form__row">
            <label className="goals-form__label">
              <span>Books</span>
              <input type="number" min="0" value={form.monthlyBooks} onChange={set('monthlyBooks')} />
            </label>
            <label className="goals-form__label">
              <span>Pages</span>
              <input type="number" min="0" value={form.monthlyPages} onChange={set('monthlyPages')} />
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
