import React from 'react';
import Navbar    from './components/Navbar';
import Hero      from './components/Hero';
import Overview  from './components/Overview';
import Timeline  from './components/Timeline';
import Steps     from './components/Steps';
import Roles     from './components/Roles';
import Quiz      from './components/Quiz';
import Assistant from './components/Assistant';
import Footer    from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <Timeline />
        <Steps />
        <Roles />
        <Quiz />
        <Assistant />
      </main>
      <Footer />
    </>
  );
}
