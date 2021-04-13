import axios from 'axios';
import config from '../config';

const url = config.url;

export async function getDocIds() {
  try {
    console.log('Loading document ids.');
    const response = await axios.get<string[]>(url + '/documents');
    const docIds = response.data;

    return docIds;

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