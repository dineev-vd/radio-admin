import MarkdownEditor from "@uiw/react-markdown-editor";
import { FC, useState } from "react";
import { Button, Stack, Table } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";

export const NewsView: FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("");

  return (
    <Routes>
      <Route
        path="new"
        element={<MarkdownEditor value={state} onChange={setState} />}
      />
      <Route
        index
        element={
          <Stack gap={4}>
            <h1>Новости</h1>

            <Stack gap={2}>
              <h2>Список новостей</h2>
              <Button onClick={() => navigate("new")}>Добавить новость</Button>
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
        }
      />
    </Routes>
  );
};
