// pages/index.js
"use client"
import { useState } from 'react';

const Page = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState();
  const [activeContent, setActiveContent] = useState('Content 1');
  const [mainContent, setMainContent] = useState('Default Main Content');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSidebarItemClick = (content) => {
    setIsDrawerOpen(false); // Close the drawer after clicking on sidebar item
    setActiveContent(content);

    // Set main content based on sidebar item clicked
    if (content === 'Content 1') {
      setMainContent('Content 1: This is the content for Sidebar Item 1.');
    } else if (content === 'Content 2') {
      setMainContent('Content 2: This is the content for Sidebar Item 2.');
    }
  };

  const handleMainContentToggle = () => {
    if (mainContent === 'Default Main Content') {
      setMainContent('Alternative Main Content');
    } else {
      setMainContent('Default Main Content');
    }
  };

  return (
    <div className="min-h-screen drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button" onClick={toggleDrawer}>
          {isDrawerOpen ? 'Close drawer' : 'Open drawer'}
        </label>
        {/* Page content here */}
        <div className="p-8">
          <h1 className="mb-4 text-3xl font-bold">Main Content</h1>
          <div>
            <p>{mainContent}</p>
            <button className="mt-4 btn btn-secondary" onClick={handleMainContentToggle}>Toggle Main Content</button>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className={`drawer-overlay ${isDrawerOpen ? 'block' : 'hidden'}`} onClick={toggleDrawer}></label>
        <ul className={`min-h-full p-4 menu w-80 bg-base-200 text-base-content ${isDrawerOpen ? 'block' : 'hidden'}`}>
          {/* Sidebar content here */}
          <li><button className={`sidebar-item ${activeContent === 'Content 1' ? 'active' : ''}`} onClick={() => handleSidebarItemClick('Content 1')}>Sidebar Item 1</button></li>
          <li><button className={`sidebar-item ${activeContent === 'Content 2' ? 'active' : ''}`} onClick={() => handleSidebarItemClick('Content 2')}>Sidebar Item 2</button></li>
        </ul>
      </div>
    </div>
  );
};

export default Page;


