function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Exam Crack</div>
        <div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
            Zaloguj się
          </button>
          <button className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105">
            Zarejestruj się
          </button>
        </div>
      </nav>
      <div className="flex items-center justify-center mt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Witamy na Exam Crack</h1>
          <p className="text-lg mb-6">Twoja platforma do quizów i fiszek!</p>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
            Rozpocznij
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
