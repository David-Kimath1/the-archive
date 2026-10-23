# The Archive — Feature Roadmap

## 1. Barcode / ISBN Scanner
- **Status**: Implemented in the Add Book flow.
- **Goal**: Allow users to scan a physical book's barcode using their device camera to quickly add it to their library.
- **Tech**: `html5-qrcode` or `@zxing/browser` for scanning.
- **Data**: Fetch title, author, summary, cover, and page count via Open Library API or Google Books API using the scanned ISBN.
- **UI**: A "Scan Book" button in the header or Add Book flow that opens the camera modal.

## 2. External Book API Integration
- **Status**: Implemented using free Open Library and Google Books catalog endpoints.
- **Goal**: Search for books by title/author to add to the library without manual entry.
