import MenuBar from './components/MenuBar';
import { ModelViewer } from './components/ModelViewer';
import { ThemeProvider } from './core/theme';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main
        className="border h-screen flex flex-col w-100"
        style={{ maxWidth: '100vw', maxHeight: '100vh' }}
      >
        <MenuBar />
        <ModelViewer />
      </main>
    </ThemeProvider>
  );
}

export default App;
