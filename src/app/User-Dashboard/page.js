import Navbar from './Components/Navbar';

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Home Page</h1>
        <p>This is the home page content.</p>
      </div>
    </div>
  );
};

export default Home;