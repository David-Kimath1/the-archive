import { useEffect, useRef, useState } from 'react';
import { Download, Upload, AlertTriangle, CheckCircle2, FileText, FileSpreadsheet, ImagePlus, LoaderCircle } from 'lucide-react';
import { useBooks } from '../../context/BooksContext.jsx';
import { useGoals } from '../../context/GoalsContext.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { exportData, importData, resetData, parseCSV, downloadCSVTemplate } from '../../utils/storage.js';
import './Settings.css';

export default function Settings() {
  const { books, addBook } = useBooks();
  const { targets, progress } = useGoals();
  const { profile, saveProfile } = useProfile();
  const jsonInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [profileName, setProfileName] = useState(profile.name);

  useEffect(() => {
    setProfileName(profile.name);
  }, [profile.name]);

  const handleProfileSave = (event) => {
    event.preventDefault();
    const name = profileName.trim();
    if (!name) {
      setStatus({ type: 'error', message: 'Please enter a name before saving.' });
      return;
    }
    if (!saveProfile({ ...profile, name })) {
      setStatus({ type: 'error', message: 'Profile could not be saved. Free up browser storage and try again.' });
      return;
    }
    setStatus({ type: 'success', message: 'Profile updated.' });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Choose an image file for your profile picture.' });
      return;
    }
    if (file.size > 1024 * 1024) {
      setStatus({ type: 'error', message: 'Profile pictures must be smaller than 1 MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setStatus({ type: 'error', message: 'The selected image could not be read.' });
        return;
      }
      if (!saveProfile({ ...profile, image: reader.result })) {
        setStatus({ type: 'error', message: 'Profile picture could not be saved. Try a smaller image or free up browser storage.' });
        return;
      }
      setStatus({ type: 'success', message: 'Profile picture updated.' });
    };
    reader.onerror = () => {
      setStatus({ type: 'error', message: 'The selected image could not be read.' });
    };
    reader.readAsDataURL(file);
  };

  const handleExportJSON = () => {
    exportData();
    setStatus({ type: 'success', message: 'JSON data exported successfully.' });
  };

  const handleExportPDF = async () => {
    setStatus({ type: 'loading', message: 'Preparing your PDF report…' });
    try {
      const { exportToPDF } = await import('../../utils/pdfExport.js');
      exportToPDF(books, { ...targets, progress });
      setStatus({ type: 'success', message: 'PDF report generated.' });
    } catch (error) {
      console.error('The PDF report could not be generated.', error);
      setStatus({ type: 'error', message: 'PDF report could not be generated. Please try again.' });
    }
  };

  const handleJSONImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importData(event.target.result);
      if (result.success) {
        setStatus({ type: 'success', message: 'Data imported! Reloading…' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setStatus({ type: 'error', message: `Import failed: ${result.error}` });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCSVImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const newBooks = parseCSV(event.target.result);
        newBooks.forEach(book => addBook(book));
        setStatus({ type: 'success', message: `${newBooks.length} books imported successfully!` });
      } catch (err) {
        setStatus({ type: 'error', message: `CSV Import failed: ${err.message}` });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    resetData();
    setStatus({ type: 'success', message: 'Application reset. Reloading…' });
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="container settings-page">
      <header className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your archive and local data.</p>
      </header>

      {status && (
        <div
          className={`settings-status settings-status--${status.type}`}
          role={status.type === 'error' ? 'alert' : 'status'}
          aria-live={status.type === 'error' ? 'assertive' : 'polite'}
        >
          {status.type === 'success' ? (
            <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
          ) : status.type === 'loading' ? (
            <LoaderCircle size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <AlertTriangle size={16} strokeWidth={2} aria-hidden="true" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <div className="settings-grid">
        <section className="settings-section">
          <h2 className="settings-section__title">Profile</h2>
          <div className="card settings-card settings-profile">
            <div className="settings-profile__photo">
              <div
                className="settings-profile__avatar"
                role="img"
                aria-label={`${profile.name} profile picture`}
              >
                {profile.image
                  ? <img src={profile.image} alt="" />
                  : profile.name.trim().charAt(0).toUpperCase()}
              </div>
              <input
                ref={avatarInputRef}
                className="sr-only"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                aria-label="Choose a profile picture"
              />
              <Button
                variant="secondary"
                icon={ImagePlus}
                onClick={() => avatarInputRef.current?.click()}
              >
                Change picture
              </Button>
              {profile.image && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (saveProfile({ ...profile, image: '' })) {
                      setStatus({ type: 'success', message: 'Profile picture removed.' });
                    } else {
                      setStatus({ type: 'error', message: 'Profile picture could not be removed from saved storage.' });
                    }
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
            <form className="settings-profile__form" onSubmit={handleProfileSave}>
              <label className="settings-profile__label" htmlFor="profile-name">Your name</label>
              <input
                id="profile-name"
                className="settings-profile__input"
                type="text"
                value={profileName}
                maxLength={40}
                autoComplete="name"
                onChange={(event) => setProfileName(event.target.value)}
              />
              <Button type="submit">Save profile</Button>
            </form>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section__title">Export</h2>
          <div className="card settings-card">
            <div className="settings-row">
              <div className="settings-row__info">
                <span className="settings-row__label">Reading Report (PDF)</span>
                <span className="settings-row__desc">
                  Generate a beautifully formatted PDF of your stats, goals, and recent reads.
                </span>
              </div>
              <Button
                variant="secondary"
                icon={FileText}
                onClick={handleExportPDF}
                disabled={status?.type === 'loading'}
              >
                Export PDF
              </Button>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <div className="settings-row__info">
                <span className="settings-row__label">Backup Data (JSON)</span>
                <span className="settings-row__desc">
                  Download a raw backup of your books, quotes, and goals.
                </span>
              </div>
              <Button variant="secondary" icon={Download} onClick={handleExportJSON}>
                Export JSON
              </Button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section__title">Import</h2>
          <div className="card settings-card">

            <div className="settings-row">
              <div className="settings-row__info">
                <span className="settings-row__label">Import Books (CSV)</span>
                <span className="settings-row__desc">
                  Bulk import books using a spreadsheet. Includes Title, Author, Pages, Status, and ISBN.
                </span>
              </div>
              <div className="settings-row__actions">
                <Button variant="ghost" onClick={downloadCSVTemplate}>
                  Template
                </Button>
                <input type="file" accept=".csv" ref={csvInputRef} style={{ display: 'none' }} onChange={handleCSVImport} />
                <Button variant="secondary" icon={FileSpreadsheet} onClick={() => csvInputRef.current?.click()}>
                  Import CSV
                </Button>
              </div>
            </div>

            <div className="settings-divider" />

            <div className="settings-row">
              <div className="settings-row__info">
                <span className="settings-row__label">Restore Backup (JSON)</span>
                <span className="settings-row__desc">
                  Restore your archive from a previously exported JSON file.
                </span>
              </div>
              <input type="file" accept=".json,application/json" ref={jsonInputRef} style={{ display: 'none' }} onChange={handleJSONImport} />
              <Button variant="secondary" icon={Upload} onClick={() => jsonInputRef.current?.click()}>
                Import JSON
              </Button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section__title">Danger Zone</h2>
          <div className="card settings-card settings-card--danger">
            <div className="settings-row">
              <div className="settings-row__info">
                <span className="settings-row__label">Reset Application</span>
                <span className="settings-row__desc">
                  Permanently delete all books, quotes, goals, and preferences. This cannot be undone.
                </span>
              </div>
              <Button variant="danger" icon={AlertTriangle} onClick={() => setResetOpen(true)}>
                Reset
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset the entire Archive?"
        description="This will permanently delete everything you have added."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button variant="danger-solid" onClick={handleConfirmReset}>
              Erase Everything
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          All local storage data will be cleared, and the application will reload with the default sample data.
        </p>
      </Modal>
    </div>
  );
}
