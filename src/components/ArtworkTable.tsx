import { useEffect, useRef, useState } from 'react';
import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import axios from 'axios';

type Artwork = {
  id: string;
  title: string;
  name: string;
  category: string;
};

const PAGE_SIZE = 5;

export default function ArtworkTable() {
  const [data, setData] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<{ [id: string]: Artwork }>({});
  const [selectAllPage, setSelectAllPage] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = async (page: number = 0) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page + 1}`);
      const artworks = res.data.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        name: item.artist_display,
        category: item.place_of_origin || 'Unknown',
      }));
      setData(artworks);
      setTotalRecords(res.data.pagination.total);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const onPageChange = (e: DataTablePageEvent) => {
    setCurrentPage(e.page ?? 0);
    setSelectAllPage(false);
  };

  const onCheckboxChange = (e: any, row: Artwork) => {
    const updated = { ...selectedRows };
    if (e.checked) {
      updated[row.id] = row;
    } else {
      delete updated[row.id];
    }
    setSelectedRows(updated);
  };

  const isRowSelected = (row: Artwork) => {
    return !!selectedRows[row.id];
  };

  const onSelectAllChange = (e: any) => {
    const checked = e.checked;
    setSelectAllPage(checked);
    const updated = { ...selectedRows };

    data.forEach((row) => {
      if (checked) {
        updated[row.id] = row;
      } else {
        delete updated[row.id];
      }
    });
    setSelectedRows(updated);
  };

  const handleSubmit = () => {
    const selected = Object.values(selectedRows);
    console.log('Submitted:', dropdownValue, selected);
    alert(`Submitted ${selected.length} rows with dropdown: ${dropdownValue}`);
  };

  const dropdownOptions = [
    { label: 'Select rows...', value: '' },
    { label: 'Export CSV', value: 'csv' },
    { label: 'Mark Reviewed', value: 'reviewed' },
  ];

  const renderHeader = () => (
    <div className="flex justify-between items-center gap-4 bg-indigo-50 border border-indigo-200 rounded-md p-4 shadow-sm mb-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectAllPage}
          onChange={onSelectAllChange}
          className="p-1"
        />
        <span className="font-medium text-gray-700">Select All on Page</span>
      </div>
      <div className="flex items-center gap-2" ref={dropdownRef}>
        <Dropdown
          value={dropdownValue}
          options={dropdownOptions}
          onChange={(e) => setDropdownValue(e.value)}
          placeholder="Actions"
          className="w-48"
        />
        <Button
          label="Submit"
          icon="pi pi-check"
          className="p-button-sm"
          disabled={!dropdownValue || Object.keys(selectedRows).length === 0}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <DataTable
        value={data}
        paginator
        rows={PAGE_SIZE}
        totalRecords={totalRecords}
        loading={loading}
        lazy
        first={currentPage * PAGE_SIZE}
        onPage={onPageChange}
        header={renderHeader()}
        className="rounded-lg"
      >
        <Column
          header="✔️"
          body={(row) => (
            <Checkbox
              inputId={row.id}
              checked={isRowSelected(row)}
              onChange={(e) => onCheckboxChange(e, row)}
              className="p-1"
            />
          )}
          style={{ width: '60px' }}
        />
        <Column field="title" header="Title" sortable style={{ minWidth: '200px' }} />
        <Column field="category" header="Category" sortable style={{ minWidth: '160px' }} />
      </DataTable>
    </div>
  );
}
