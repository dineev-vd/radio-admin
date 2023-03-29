import { Button, Col, Table } from "react-bootstrap";
import styles from "./EntriesTable.module.css";

type EntriesTableProps<
  T extends Record<string, string | number> & { id: string | number }
> = {
  data: T[];
  onDelete?: (id: string) => void;
  onEntryClick?: (id: string, entry: T) => void;
};

const EntriesTable = <
  T extends Record<string, string | number> & { id: string | number }
>({
  data,
  onDelete,
  onEntryClick,
}: EntriesTableProps<T>) => {
  return (
    <>
      {data.length && (
        <Col className={styles.scroll}>
          <div>
            <Table striped hover className={styles.table}>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key, columnIndex) => (
                    <th key={columnIndex}>{key}</th>
                  ))}
                  {onDelete && <th></th>}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    onClick={() => onEntryClick?.(row.id.toString(), row)}
                    key={rowIndex}
                  >
                    {Object.entries(row).map(([_, value], columnIndex) => (
                      <td key={columnIndex}>{value}</td>
                    ))}
                    {onDelete && (
                      <td>
                        <Button
                          variant="outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(row.id.toString());
                          }}
                        >
                          Удалить
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      )}
    </>
  );
};

export default EntriesTable;
