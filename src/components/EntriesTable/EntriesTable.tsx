import { FC } from "react";
import { Table } from "react-bootstrap";

type EntriesTableProps = {
  data: (Record<string, string | number> & { id: string | number })[];
  onDelete: (id: string) => void;
  onEntryClick: (id: string) => void;
};

const EntriesTable: FC<EntriesTableProps> = ({
  data,
  onDelete,
  onEntryClick,
}) => {
  return (
    <>
      {data.length && (
        <Table striped>
          <thead>
            <tr>
              {Object.keys(data[0])
                .concat("")
                .map((key, columnIndex) => (
                  <th key={columnIndex}>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                onClick={() => onEntryClick(row.id.toString())}
                key={rowIndex}
              >
                {Object.entries(row).map(([_, value], columnIndex) => (
                  <td key={columnIndex}>{value}</td>
                ))}
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row.id.toString());
                    }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default EntriesTable;
