import ArtworkTable from './components/ArtworkTable';

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4 sm:px-6">
      <section className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 transition-all">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-800 tracking-tight">
            🎨 Artworks Gallery
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Browse and manage artworks using server-side pagination with smart selection tools.
          </p>
        </header>
        <ArtworkTable />
      </section>
    </main>
  );
}

export default App;
