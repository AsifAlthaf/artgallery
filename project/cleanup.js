import fs from 'fs';
import path from 'path';

const pagesDir = 'c:/Users/asifs/Downloads/ArtBloom/project/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

// Strip manual Navbar/Footer imports
files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  content = content.replace(/import Navbar from ["'](\.\.\/)*components\/Navbar["'](?:;?)\s*/g, '');
  content = content.replace(/import Navbar from ["']@\/components\/Navbar["'](?:;?)\s*/g, '');
  content = content.replace(/import Footer from ["'](\.\.\/)*components\/Footer["'](?:;?)\s*/g, '');
  content = content.replace(/import Footer from ["']@\/components\/Footer["'](?:;?)\s*/g, '');
  
  content = content.replace(/<Navbar \/>\s*/g, '');
  content = content.replace(/<Footer \/>\s*/g, '');

  fs.writeFileSync(filePath, content);
});

// Update App.jsx to globally inject Navbar/Footer
const appPath = 'c:/Users/asifs/Downloads/ArtBloom/project/src/App.jsx';
let appContent = fs.readFileSync(appPath, 'utf-8');
if (!appContent.includes('import Navbar')) {
    appContent = appContent.replace(
        'import { BrowserRouter, Routes, Route } from "react-router-dom";',
        'import { BrowserRouter, Routes, Route } from "react-router-dom";\nimport Navbar from "@/components/Navbar";\nimport Footer from "@/components/Footer";'
    );
    appContent = appContent.replace(
        /<Routes>/,
        '<div className="min-h-screen flex flex-col">\n            <Navbar />\n            <main className="flex-grow">\n            <Routes>'
    );
    appContent = appContent.replace(
        /<\/Routes>/,
        '</Routes>\n            </main>\n            <Footer />\n          </div>'
    );
    fs.writeFileSync(appPath, appContent);
}

// Ensure lazy loading on all images
function addLazyLoading(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      addLazyLoading(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      // Only inject if not already present, avoiding double insertion
      const original = content;
      content = content.replace(/<img(?![^>]*loading=)/g, '<img loading="lazy"');
      if (original !== content) {
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}
addLazyLoading('c:/Users/asifs/Downloads/ArtBloom/project/src');
console.log('Cleanup and global enhancements injected successfully!');
