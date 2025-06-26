"use client";

import Head from 'next/head';
import ImageProcessor from '../Components/ImageProcessor';

const META_DATA = {
  title: "Background Remover | Instant AI-Powered Background Removal",
  description: "Remove backgrounds from your images instantly with our AI-powered tool. Fast, free, and no signup required.",
  keywords: "background remover, remove bg, transparent background, image editor",
  ogTitle: "Background Remover | Instant AI-Powered Background Removal",
  ogDescription: "Remove backgrounds from your images instantly with our AI-powered tool.",
  ogType: "website",
  url: "https://bg.jessejesse.com",
  image: "https://bg.jessejesse.com/preview.png",
  author: "JesseJesse.com",
};

const FEATURES = [
  { label: 'Automatic', value: '100%' },
  { label: 'Zero Cost', value: 'Free' },
  { label: 'Seconds', value: 'Fast' },
  { label: 'Browser', value: 'Private' }
];

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <title>{META_DATA.title}</title>
        <meta name="title" content="Image Background Removal" />
        <meta name="description" content={META_DATA.description} />
        <meta name="keywords" content={META_DATA.keywords} />
        <meta name="author" content={META_DATA.author} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={META_DATA.ogType} />
        <meta property="og:url" content={META_DATA.url} />
        <meta property="og:title" content={META_DATA.ogTitle} />
        <meta property="og:description" content={META_DATA.ogDescription} />
        <meta property="og:image" content={META_DATA.image} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={META_DATA.url} />
        <meta property="twitter:title" content={META_DATA.ogTitle} />
        <meta property="twitter:image" content={META_DATA.image} />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <HeaderSection />
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
            <ImageProcessor />
          </div>
        </div>
      </main>
    </>
  );
}

function HeaderSection() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Background Removal
      </h1>

      <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mt-2 font-medium">
        quickly <span className="text-indigo-600 dark:text-indigo-400 font-semibold">remove backgrounds</span> with <span className="text-pink-600 dark:text-pink-400 font-semibold">accuracy</span> and <span className="text-green-600 dark:text-green-400 font-semibold">privacy</span>
      </p>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto">
        {FEATURES.map(({ label, value }) => (
          <FeatureCard key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-col items-center text-center transition-transform duration-200 hover:scale-105 hover:shadow-md">
      <div className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
}

