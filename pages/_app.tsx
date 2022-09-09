import type { AppProps } from 'next/app'
import '@ahaui/css/dist/index.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
