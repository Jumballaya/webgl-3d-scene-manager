import MenuBar from './components/MenuBar';
import { ModelViewer } from './components/ModelViewer';
import { ThemeProvider } from './core/theme';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="h-screen border rounded">
        <MenuBar />
        <div className="flex-col md:flex h-full">
          <ModelViewer />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
