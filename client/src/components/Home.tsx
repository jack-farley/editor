import React, { useEffect, useState } from 'react';
import { getDocIds } from '../lib/files';
import { Link } from 'react-router-dom';

export default function Home () {

  const [docIds, setDocIds] = useState<string[]>([]);

  useEffect(() => {
    getDocIds().then(response => setDocIds(response));
  }, []);


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
    </div>
  )
}