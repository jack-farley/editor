import Editor from '../../components/editor';
import { getDocIds } from '../../lib/documents';

export default function Document() {

  return (
    <div>
      <h1>Document</h1>

      <Editor></Editor>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = getDocIds();
  return {
    paths,
    fallback: false
  }
}

export async function getSTaticProps({ params }) {

}