import Link from 'next/link';

export default function Home () {

  return (
    <div>
      <h1>Documents</h1>

      <Link href="documents/document">
        <a>this page</a>
      </Link>
    </div>
  )
}