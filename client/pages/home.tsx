import Link from 'next/link';
import { getDocIds } from '../lib/files';

type HomeProps = {
  allDocIds: string[]
}

export default function Home ({ allDocIds }: HomeProps) {

  console.log(allDocIds);

  return (
    <div>
      <h1>Documents</h1>

      <ul>
        {allDocIds.map((docId) => {
          return (
            <li key={docId}>
              <Link href={`/documents/${docId}`}>
              {docId}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const allDocIds = await getDocIds();
  console.log(allDocIds);
  return {
    props: {
      allDocIds
    }
  }
}