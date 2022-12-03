import React from 'react';

function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-center bg-primary mt-4 py-3 px-6">
      <div className="text-sm text-white font-semibold py-1">
        Copyright © <span id="current-year">2022</span>
        <a href="#" className="mx-1 text-white hover:text-secondary">
          Amazona
        </a>
        .
      </div>
    </footer>
  );
}

export default Footer;
