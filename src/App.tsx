import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollNavigation from './components/ScrollNavigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import WhyAttendSection from './components/WhyAttendSection';
import LocationSection from './components/LocationSection';
import TravelSection from './components/TravelSection';
import AgendaSection from './components/AgendaSection';
import SpeakersSection from './components/SpeakersSection';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const sections = [
  'Hero',
  'About',
  'Why Attend',
  'Location', 
  'Travel',
  'Agenda',
  'Speakers',
];
const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
  const [activeSection, setActiveSection] = useState(0);

  const scrollToSection = (sectionIndex: number) => {
    const element = document.getElementById(`section-${sectionIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToNext = () => {
    if (activeSection < sections.length - 1) {
      scrollToSection(activeSection + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentSection = Math.floor(scrollPosition / windowHeight);
      
      if (currentSection !== activeSection && currentSection < sections.length) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div className="relative">
      <button onClick={createTodo}>+ new</button>
      <ScrollNavigation
        sections={sections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div id="section-0">
          <HeroSection onScrollToNext={scrollToNext} />
        </div>
        
        <div id="section-1">
          <AboutSection />
        </div>
        
        <div id="section-2">
          <WhyAttendSection />
        </div>
        
        <div id="section-3">
          <LocationSection />
        </div>
        
        <div id="section-4">
          <TravelSection />
        </div>
        
        <div id="section-5">
          <AgendaSection />
        </div>
        
        <div id="section-6">
          <SpeakersSection />
        </div>
      </motion.div>
    </div>
  );
}

export default App;