'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useTheme } from '../app/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  useEffect(() => {
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-8 md:space-y-0">
          <div className="md:w-2/3 text-gray-700 dark:text-gray-300">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Background Removal Tool</h3>
            <p className="text-sm leading-relaxed">
              AI-powered image background removal presented by Next.js. Upload an image, remove the background, and export with confidence.
              This tool processes everything in browser — no uploads or data storage, so your images remain private.
            </p>
          </div>

          <div className="flex space-x-12 text-gray-600 dark:text-gray-400 text-sm">
            <div>
              <h4 className="font-semibold uppercase mb-2 tracking-wide">Frameworks</h4>
              <ul className="space-y-1">
                <li>
                  <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
                    Next.js
                  </a>
                </li>
                <li>
                  <a href="https://deepseek.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
                    DeepSeek
                  </a>
                </li>
                <li>
                  <a href="https://img.ly/showcases/cesdk/background-removal/web" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
                    @imgly
                  </a>
                </li>
                <li>
                  <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
                    Tailwind
                  </a>
                </li>
                <li>
                  <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
                    Vercel
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold uppercase mb-2 tracking-wide">Developer</h4>
              <ul className="space-y-1">
                <li>
                  <a href="https://jessejesse.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
                    About Me
                  </a>
                </li>
                <li>
                  <a href="mailto:email@jessejesse.com" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="https://cash.app/$iLostmyipod" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
                    Donations
                  </a>
                </li>
                <li>
                  <a href="https://github.com/sudo-self/ai-bg-removal" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition">
                    Source Code
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-500 dark:text-gray-400 text-xs">
          <p>
            © <span className="current-year">2023</span>bg.JesseJesse.com
          </p>
          <div className="mt-3 md:mt-0 text-center md:text-right">
            <a href="https://bg.jessejesse.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              bg.JesseJesse.com
            </a>{' '}
            is lisenced{' '}
            <a href="https://github.com/sudo-self/ai-bg-removal" target="_blank" rel="noopener noreferrer" className="hover:underline">
              CC
            </a>{' '}
            is marked{' '}
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              CC0 1.0
            </a>
            <img
              src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
              alt="CC"
              style={{ maxWidth: '1em', maxHeight: '1em', marginLeft: '.2em', display: 'inline' }}
            />
            <img
              src="https://mirrors.creativecommons.org/presskit/icons/zero.svg"
              alt="CC0"
              style={{ maxWidth: '1em', maxHeight: '1em', marginLeft: '.2em', display: 'inline' }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
