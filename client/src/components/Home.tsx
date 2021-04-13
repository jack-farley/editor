import React, { useEffect, useState } from 'react';
import { getDocIds } from '../lib/files';
import { Link } from 'react-router-dom';
import { Form, Button} from 'react-bootstrap';
import { createDocument } from '../lib/files';

import './Home.css';

export default function Home () {

  const [docIds, setDocIds] = useState<string[]>([]);
  const [name, setName] = useState<string>();
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    getDocIds().then(response => setDocIds(response));
  }, [refresh]);

  const onSubmit = (event : any) => {
    event.preventDefault();
    if (name) {
      createDocument(name, "");
    }
    setName("");
    setRefresh(!refresh);
  }

  const onInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }


  console.log(docIds);

  return (
    <div>
      <h1>Documents</h1>

      <ul>
        {docIds.map((docId) => {
          return (
            <li key={docId}>
              <Link to={`/${docId}`}>
              {docId}
              </Link>
            </li>
          );
        })}
      </ul>

      <h2 className="create">Create Document</h2>

      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Document name"
            value={name}
            onChange={onInput}
          />

        </Form.Group>

        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  )
}