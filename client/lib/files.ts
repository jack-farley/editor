import axios from 'axios';

const url = process.env.API_URL;

export async function getDocIds() {
  try {
    console.log('Loading document ids.');
    const response = await axios.get<string[]>(url + '/documents');
    const docIds = response.data;
    console.log('Done loading document Ids.');

    return docIds;

  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createDocument(name: string, content: string) {

}