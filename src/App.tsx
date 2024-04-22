import MenuBar from './components/MenuBar';
import { ModelViewer } from './components/ModelViewer';
import { ThemeProvider } from './core/theme';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="h-screen border rounded">
        <MenuBar />
        <div className="md:hidden"></div>
        <div className="hidden flex-col md:flex h-95">
          <ModelViewer />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
