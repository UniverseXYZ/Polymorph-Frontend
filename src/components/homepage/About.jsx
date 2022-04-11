import React from 'react';
import OriginalCharactersSection from './OriginalCharactersSection.jsx';
import UniverseProtocolSection from './UniverseProtocolSection.jsx';
import TShirtSection from './TShirtSection.jsx';

const About = () => (
  <div className="describe__section">
    <UniverseProtocolSection />
    <OriginalCharactersSection />
    <TShirtSection />
  </div>
);

export default About;
