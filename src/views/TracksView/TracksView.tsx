import { FC } from "react";
import { Form, Stack, Table } from "react-bootstrap";

export const TracksView: FC = () => {
  return (
    <Stack gap={4}>
      <h1>Треки</h1>
      <Stack gap={2}>
        <h2>Загрузка трека</h2>
        <Form>
          <Form.Group>
            <Form.Label>
              Выберите файл и загрузите его для добавления трека в список
            </Form.Label>
            <Form.Control type={"file"} />
          </Form.Group>
        </Form>
      </Stack>

      <Stack gap={2}>
        <h2>Список треков</h2>
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </Stack>
    </Stack>
  );
};
