import { useArmy } from '@/contexts/ArmyContext';

export default function AppHeader() {
  const { createNewArmy, saveArmy, openModal } = useArmy();

  return (
    <header className="bg-dark-400 border-b border-dark-100 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-primary">
          <span className="text-white">War</span>Forge
        </h1>
        <div className="flex space-x-4">
          <button 
            className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition duration-150 ease-in-out flex items-center"
            onClick={createNewArmy}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Army
          </button>
          <button 
            className="bg-dark-300 hover:bg-dark-200 text-white px-4 py-2 rounded text-sm transition duration-150 ease-in-out flex items-center"
            onClick={saveArmy}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </button>
          <button 
            className="bg-dark-300 hover:bg-dark-200 text-white px-4 py-2 rounded text-sm transition duration-150 ease-in-out flex items-center"
            onClick={openModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Load
          </button>
        </div>
      </div>
    </header>
  );
}
