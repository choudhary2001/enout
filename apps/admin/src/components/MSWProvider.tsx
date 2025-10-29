'use client';

import { useEffect } from 'react';

export function MSWProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('../mocks/init').then(({ initMocks }) => {
        initMocks().catch(console.error);
      });
    }
  }, []);

  return null;
}
