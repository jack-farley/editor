import axios from 'axios';
import getConfig from 'next/config';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const address = serverRuntimeConfig.backendApi;

export async function getDocIds() {
  try {
    const docIds : any = await axios.get(address + '/documents');

    return docIds.map((docId : any) => {
      return {
        params: {
          id: docId
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

export async function createDocument(name: string, content: string) {

}