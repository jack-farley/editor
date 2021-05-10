import React, { useEffect, useState } from 'react';
import { getDocs } from '../lib/files';
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { createDocument } from '../lib/files';

import './Home.css';

export default function Home () {

  const [docs, setDocs] = useState<{id: string, name: string}[]>([]);
  const [name, setName] = useState<string>();
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    getDocs().then(response => setDocs(response));
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

  return (
    <div className="center-column">
      <div className="title-section">
        <h1>Editor</h1>
      </div>

      <div>
        <ListGroup>
          {docs.map((doc) => {
            return (
              <ListGroup.Item action href={`/${doc.id}`}>
                {doc.name}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>

      <div className="create-section">
        <Form onSubmit={onSubmit}>
          <Row>
            <Col xs={3} sm={2} xl={1}>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control 
                  type="text" 
                  placeholder="Document Name"
                  value={name}
                  onChange={onInput}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}