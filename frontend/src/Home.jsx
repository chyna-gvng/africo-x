import './Home.css';

const Home = () => {
  return (
    <section>
      {/* Hero's Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Transforming Carbon <br/> Trading In Africa</h1>
          <p>We are on a mission to revolutionize carbon trading by leveraging blockchain technology. Our platform provides an accessible, transparent marketplace that empowers local communities and small-scale sustainability projects.</p>
        </div>
        <div>
          <img src="/climate-change-concept.svg" alt="hero" />
        </div>
      </div>

      {/* Highlight Cards */}
      <div className="highlight-cards">
        <div className="card">
          <img src="/affordable.svg" alt="affordable" />
          <p>Trade tons of carbon offsets with minimal transaction fees, making carbon trading accessible to all.</p>
        </div>
        <div className="card">
          <img src="/secure-transparent.svg" alt="secure-transparent" />
          <p>Built on Ethereum blockchain technology, ensuring complete traceability and security for every transaction.</p>
        </div>
        <div className="card">
          <img src="/community.svg" alt="community" />
          <p>Empowering local communities and small-scale projects to participate in the global carbon market.</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li><b>Sign Up:</b> Register and choose your role—Buyer or Project Owner.</li>
          <li><b>Submit or Vote:</b> Project Owners submit carbon offset projects; Buyers vote to verify them.</li>
          <li><b>Trade:</b> Purchase verified carbon credits directly from projects using ETH.</li>  
          <li><b>Offset:</b> Let the smart contracts handle it, automate your carbon footprint reduction with our depletion feature.</li>
        </ol>
      </div>
    </section>
  );
};

export default Home;
