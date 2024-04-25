import { useEffect, useState } from 'react';

export default function useScript(src: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
    }

    const handleLoad = () => setLoading(false);
    const handleError = (error: any) => setError(error);

    script.addEventListener('load', handleLoad); // load 이벤트
    script.addEventListener('error', handleError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
  }, [src]);

  return [loading, error];
}
