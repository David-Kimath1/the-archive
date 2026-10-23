import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToPDF(books, goals) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- 1. Data Calculation ---
  const finishedBooks = books.filter(b => b.status === 'finished');
  const totalPages = finishedBooks.reduce((sum, b) => sum + (b.pages || 0), 0);
  const ratedBooks = finishedBooks.filter(b => b.rating > 0);
  const avgRating = ratedBooks.length > 0
    ? (ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(1)
    : '—';

  // Sort recent books
  const recentBooks = [...finishedBooks]
    .sort((a, b) => new Date(b.dateFinished) - new Date(a.dateFinished))
    .slice(0, 5);

  // --- 2. Header ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59); // Deep navy
  doc.text("The Archive", 14, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // Muted slate
  doc.text("Reading Report", 14, 29);

  // Date right-aligned
  doc.setFontSize(9);
  doc.text(
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    pageWidth - 14,
    22,
    { align: 'right' }
  );

  // --- 3. Summary Cards ---
  let y = 40;
  const cardWidth = (pageWidth - 28 - 10) / 3; // 3 columns, 10px gap
  const cardHeight = 24;

  const drawCard = (x, label, value) => {
    doc.setDrawColor(226, 232, 240); // Light border
    doc.setFillColor(248, 250, 252); // Very light gray bg
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(label, x + 6, y + 8);

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(String(value), x + 6, y + 18);
  };

  drawCard(14, 'BOOKS FINISHED', finishedBooks.length);
  drawCard(14 + cardWidth + 5, 'PAGES READ', totalPages.toLocaleString());
  drawCard(14 + (cardWidth + 5) * 2, 'AVG RATING', avgRating);

  // --- 4. Reading Goals Table ---
  y += cardHeight + 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text("Reading Goals", 14, y);

  const goalData = [
    ['Annual Books', goals.annualBooks, `${goals.progress.annualBooks} / ${goals.annualBooks}`, `${Math.round((goals.progress.annualBooks / goals.annualBooks) * 100) || 0}%`],
    ['Monthly Books', goals.monthlyBooks, `${goals.progress.monthlyBooks} / ${goals.monthlyBooks}`, `${Math.round((goals.progress.monthlyBooks / goals.monthlyBooks) * 100) || 0}%`],
    ['Annual Pages', goals.annualPages, `${goals.progress.annualPages} / ${goals.annualPages}`, `${Math.round((goals.progress.annualPages / goals.annualPages) * 100) || 0}%`],
    ['Monthly Pages', goals.monthlyPages, `${goals.progress.monthlyPages} / ${goals.monthlyPages}`, `${Math.round((goals.progress.monthlyPages / goals.monthlyPages) * 100) || 0}%`],
  ];

  autoTable(doc, {
    startY: y + 4,
    head: [['GOAL TYPE', 'TARGET', 'PROGRESS', 'COMPLETION']],
    body: goalData,
    theme: 'grid',
    styles: { fontSize: 9, textColor: [30, 41, 59], cellPadding: 4 },
    headStyles: { fillColor: [241, 245, 249], textColor: [100, 116, 139], fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
    },
  });

  // --- 5. Recently Finished Table ---
  y = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text("Recently Finished", 14, y);

  const recentData = recentBooks.map(book => [
    book.title,
    book.author,
    book.dateFinished ? new Date(book.dateFinished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
    book.rating > 0 ? `${book.rating} / 5` : '—'
  ]);

  autoTable(doc, {
    startY: y + 4,
    head: [['BOOK TITLE', 'AUTHOR', 'DATE FINISHED', 'RATING']],
    body: recentData,
    theme: 'grid',
    styles: { fontSize: 9, textColor: [30, 41, 59], cellPadding: 4 },
    headStyles: { fillColor: [241, 245, 249], textColor: [100, 116, 139], fontStyle: 'bold' },
    columnStyles: {
      0: { fontStyle: 'bold' },
      3: { halign: 'center' },
    },
  });

  // --- 6. Footer ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Generated from The Archive PWA · Local Data Export',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save
  doc.save(`The-Archive-Reading-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
