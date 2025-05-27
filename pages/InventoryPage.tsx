
import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Table, { ColumnDefinition } from '../components/common/Table';
import { ICONS, MOCK_INVENTORY, formatShortDate } from '../constants';
import { InventoryItem, InventoryCategory } from '../types';

const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<InventoryItem> | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | ''>('');

  const openModal = (item?: InventoryItem) => {
    setCurrentItem(item ? { ...item } : { quantity: 0, reorderLevel: 0, category: InventoryCategory.MEDICAL_SUPPLIES, unit: 'unidade' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleSave = () => {
    if (!currentItem) return;
    if (currentItem.id) {
      setInventory(inventory.map(item => item.id === currentItem.id ? currentItem as InventoryItem : item));
    } else {
      setInventory([{ ...currentItem, id: `inv-${Date.now()}` } as InventoryItem, ...inventory]);
    }
    closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!currentItem) return;
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: (name === 'quantity' || name === 'reorderLevel' || name === 'purchasePrice') ? parseFloat(value) : value });
  };
  
  const filteredInventory = inventory
    .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter ? item.category === categoryFilter : true)
    )
    .sort((a,b) => a.name.localeCompare(b.name));


  const columns: ColumnDefinition<InventoryItem, keyof InventoryItem>[] = [
    { key: 'name', header: 'Nome do Item', width: 'w-1/3' },
    { key: 'category', header: 'Categoria', width: 'w-1/6' },
    { key: 'quantity', header: 'Qtd.', render: item => 
        <span className={item.quantity <= item.reorderLevel ? 'font-bold text-red-600' : ''}>{item.quantity} {item.unit}</span>, 
      width: 'w-1/12' 
    },
    { key: 'reorderLevel', header: 'Nível Reposição', render: item => `${item.reorderLevel} ${item.unit}`, width: 'w-1/6' },
    { key: 'supplier', header: 'Fornecedor', render: item => item.supplier || 'N/A', width: 'w-1/6' },
    { key: 'lastPurchaseDate', header: 'Última Compra', render: item => formatShortDate(item.lastPurchaseDate), width: 'w-1/6' },
    {
      key: 'id',
      header: 'Ações',
      render: (item) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => openModal(item)} leftIcon={ICONS.EDIT}>Editar</Button>
        </div>
      ),
      width: 'w-auto'
    }
  ];

  return (
    <>
      <PageHeader title="Gerenciamento de Estoque" actionButton={
        <Button onClick={() => openModal()} leftIcon={ICONS.PLUS}>Novo Item</Button>
      }/>
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <input
            type="text"
            placeholder="Buscar por nome do item..."
            className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as InventoryCategory | '')}
          >
            <option value="">Todas Categorias</option>
            {Object.values(InventoryCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </Card>
      <Card>
        <Table columns={columns} data={filteredInventory} emptyStateMessage="Nenhum item no estoque."/>
      </Card>

      {isModalOpen && currentItem && (
        <Modal title={currentItem.id ? "Editar Item de Estoque" : "Novo Item de Estoque"} isOpen={isModalOpen} onClose={closeModal}
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Item</label>
              <input type="text" id="name" name="name" value={currentItem.name || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
              <select id="category" name="category" value={currentItem.category || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                {Object.values(InventoryCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidade</label>
              <input type="text" id="unit" name="unit" value={currentItem.unit || ''} onChange={handleChange} placeholder="ex: caixa, frasco, unidade" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade em Estoque</label>
              <input type="number" id="quantity" name="quantity" value={currentItem.quantity || 0} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700">Nível de Reposição</label>
              <input type="number" id="reorderLevel" name="reorderLevel" value={currentItem.reorderLevel || 0} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Fornecedor (opcional)</label>
              <input type="text" id="supplier" name="supplier" value={currentItem.supplier || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">Preço de Compra (opcional)</label>
              <input type="number" step="0.01" id="purchasePrice" name="purchasePrice" value={currentItem.purchasePrice || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="lastPurchaseDate" className="block text-sm font-medium text-gray-700">Data da Última Compra (opcional)</label>
              <input type="date" id="lastPurchaseDate" name="lastPurchaseDate" value={currentItem.lastPurchaseDate ? currentItem.lastPurchaseDate.split('T')[0] : ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default InventoryPage;
