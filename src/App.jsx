import GalaxyHero from './components/GalaxyHero';
import About from "./components/About";
import Work from "./components/Work" ;
import Skills from "./components/Skills" ;
import Credentials from "./components/Credentials" ;
import Contact from './components/Contact';
import Header from "./components/Header"

function App() {
  return (
    <div>
      <GalaxyHero />
      <Header />
      <About />
      <Work />
      <Skills />
      <Credentials />
      <Contact />
    </div>
  );
}

export default App;