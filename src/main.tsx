
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add this to ensure JSX style element works
declare global {
  namespace JSX {
    interface IntrinsicElements {
      style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>
    }
  }
}

createRoot(document.getElementById("root")!).render(<App />);
