
import React from 'react';
import { useRouter } from 'next/router';

export default function ArtikelDetail() {
  const router = useRouter();
  const { id } = router.query;
  return <h1>Artikel ID: {id}</h1>;
}
