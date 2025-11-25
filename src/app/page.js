// Home.jsx
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero'; // Add this import
import AboutUs from '../Components/AboutUs';
import Services from '../Components/Services';
import Contact from '../Components/Contact';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-500 font-sans dark:bg-black text-gray-800">
      <Navbar />
      <main>
        {/* Hero Banner Carousel */}
        <Hero />
        
        <section className="py-16 bg-blue-100 text-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-4">Welcome to Ecom Store</h1>
            <p className="text-lg">Discover amazing products at great prices.</p>
          </div>
        </section>
        
        <AboutUs />
        <Services />
        <Contact />
      </main>
    </div>
  );
}