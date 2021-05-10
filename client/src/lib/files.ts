import axios from 'axios';
import config from '../config';

const url = config.url;

export async function getDocs() {
  try {
    console.log('Loading document ids.');
    const response = await axios.get<{id: string, name: string}[]>(url + '/documents');
    const docs = response.data;

    return docs;

  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createDocument(name: string, content: string) {
  try {
    console.log('Creating document.');
    const response = await axios.post<string>(url + '/documents', {
        name: name,
        conent: content,
      });
    const docId = response.data;

    return docId;

  } catch (err) {
    console.error(err);
  }
}