'use client';
import React, { useState } from 'react';
import { Floor } from '@/app/shared/interfaces/tables';
import ConfirmationModal from './ConfirmationModal';
import AddTableModal from './AddTableModal';
import useTable from '../hooks/useTables';
import Swal from 'sweetalert2';

interface FloorTablesProps {
  floors: Floor[];
}

const FloorTables: React.FC<FloorTablesProps> = ({ floors }) => {
  const { tables, createTable, toggleTableAvailability } = useTable();
  const [addTableModalOpen, setAddTableModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  const handleToggleAvailability = (tableId: number) => {
    setSelectedTableId(tableId);
    setModalOpen(true);
  };

  const confirmToggle = async () => {
    if (selectedTableId !== null) {
      const table = tables.find(t => t.idTable === selectedTableId);
      if (table) {
        const updatedTable = {
          ...table,
          disponibility: !table.disponibility,
          available: !table.available,
        };
        
        const success = await toggleTableAvailability(updatedTable);
        if (success) {
          Swal.fire('Success', `Table ${selectedTableId} availability updated!`, 'success');
        } else {
          Swal.fire('Error', 'Failed to update table availability.', 'error');
        }
      }
    }
    setModalOpen(false);
    setSelectedTableId(null);
  };

  const cancelToggle = () => {
    setModalOpen(false);
    setSelectedTableId(null);
  };

  const getFloorFromId = (id: number) => {
    if (id >= 101 && id < 200) return 1; // IDs 101-199 son del piso 1
    if (id >= 201 && id < 300) return 2; // IDs 201-299 son del piso 2
    if (id >= 300 && id < 400) return 3; // IDs 300-399 son el piso 3
    if (id >= 401 && id < 500) return 4; // IDs 401-499 son del piso 4
    if (id >= 501 && id < 600) return 5; // IDs 501-599 son del piso 5
    if (id >= 601 && id < 700) return 6; // IDs 601-699 son del piso 6
    if (id >= 701 && id < 800) return 7; // IDs 701-799 son del piso 7
    if (id >= 801 && id < 900) return 8; // IDs 801-899 son del piso 8
    if (id >= 901 && id < 1000) return 9; // IDs 901-999 son del piso 9
    if (id >= 1000 && id < 1100) return 10; // IDs 1000-1099 son del piso 10
    return 0; // Pisos no definidos
  };

  return (
    <div>
      <button onClick={() => setAddTableModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add Table
      </button>

      {floors.sort((a, b) => a.floorNumber - b.floorNumber).map((floor) => (
        <div key={floor.floorNumber} className="mb-4">
          <h2 className="text-xl font-bold">Floor {floor.floorNumber}</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Table ID</th>
                <th className="py-2 px-4 border-b">Chairs</th>
                <th className="py-2 px-4 border-b">Availability</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables
                .filter((table) => getFloorFromId(table.idTable) === floor.floorNumber) // Filtra las mesas por piso
                .map((table) => (
                  <tr key={table.idTable} className={table.available ? 'bg-blue-100' : 'bg-red-100'}>
                    <td className="py-2 px-4 border-b">{table.idTable}</td>
                    <td className="py-2 px-4 border-b">{table.numberOfChairs}</td>
                    <td className="py-2 px-4 border-b">
                      {table.disponibility ? 'Available' : 'Not Available'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button onClick={() => handleToggleAvailability(table.idTable)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                        Toggle Availability
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}

      <AddTableModal
        isOpen={addTableModalOpen}
        onClose={() => setAddTableModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={modalOpen}
        onConfirm={confirmToggle}
        onCancel={cancelToggle}
        message={`Are you sure you want to change the status of table ${selectedTableId}?`}
      />
    </div>
  );
};

export default FloorTables;
