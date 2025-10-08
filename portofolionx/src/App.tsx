import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import Footer from "./components/Footer";
import About from "./sections/About.tsx";
import Services from "./sections/Services.tsx";
import Work from "./sections/Work.tsx";
import Contact from "./sections/Contact.tsx";

function App() {
    return (
        <>
            <Navbar />
            <Hero />
            {/* Les autres sections viendront ici */}
            <About />
            <Services />
            <Work />
            <Contact />
            <Footer />
        </>
    )
}

export default App