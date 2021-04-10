import React, { useState, useEffect } from 'react';

import Editor from '../../components/editor';
import { getDocIds } from '../../lib/files';
import getConfig from 'next/config';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
const endpoint = serverRuntimeConfig.backendApi;

export default function Document() {

  const loadDoc = () => {
    
  }

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

export async function getStaticProps({ params }) {

}