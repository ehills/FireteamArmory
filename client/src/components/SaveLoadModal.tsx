import { useArmy } from '@/contexts/ArmyContext';

export default function SaveLoadModal() {
  const { savedArmies, loadArmy, deleteArmy, closeModal } = useArmy();

  return (
    <div className="fixed inset-0 bg-dark-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-dark-300 rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-display font-semibold">Saved Armies</h3>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={closeModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4 max-h-96 overflow-y-auto scrollbar-thin">
          {savedArmies.length > 0 ? (
            savedArmies.map((army) => (
              <div key={army.id} className="bg-dark-400 rounded p-3 mb-2 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{army.name}</h4>
                  <div className="text-xs text-gray-400 mt-1">
                    {army.totalPoints} pts · {army.units.length} unit{army.units.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-primary hover:text-blue-400"
                    onClick={() => loadArmy(army.id)}
                  >
                    Load
                  </button>
                  <button 
                    className="text-gray-400 hover:text-danger"
                    onClick={() => deleteArmy(army.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              No saved armies found
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button 
            className="bg-dark-200 hover:bg-dark-100 text-white px-4 py-2 rounded text-sm transition duration-150"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
