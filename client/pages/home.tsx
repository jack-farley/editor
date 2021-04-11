import Link from 'next/link';
import { getDocIds } from '../lib/files';

export default function Home ({ allDocIds }) {

  return (
    <div>
      <h1>Documents</h1>

      <ul>
        {allDocIds.map((docId, index) => {
          <li key={docId}>
            {docId}
          </li>
        })}
      </ul>

      <Link href="documents/document">
        <a>this page</a>
      </Link>
    </div>
  )
}

export async function getStaticProps() {
  const allDocIds = await getDocIds();
  return {
    props: {
      allDocIds
    }
  }
}