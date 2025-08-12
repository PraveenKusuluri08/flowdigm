import { useState } from 'react';

export default function AppSimple() {
  const [message, setMessage] = useState('App loading successfully!');

  const testCloudAuth = () => {
    setMessage('Testing cloud authentication...');
    // Just a test - we'll add real OAuth later
    setTimeout(() => {
      setMessage('Cloud services ready for OAuth implementation!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">FlowDigm Viewer</h1>
            <nav className="flex space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm">
                Home
              </button>
              <button 
                onClick={testCloudAuth}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Test Cloud Import
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cloud Integration Dashboard
          </h2>
          <p className="text-lg text-gray-600 mb-6">{message}</p>
          
          {/* Cloud Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {/* Google Drive */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <h3 className="font-medium text-gray-900">Google Drive</h3>
              <p className="text-sm text-gray-500 mt-1">Ready for OAuth</p>
            </div>

            {/* OneDrive */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <h3 className="font-medium text-gray-900">OneDrive</h3>
              <p className="text-sm text-gray-500 mt-1">Ready for OAuth</p>
            </div>

            {/* Dropbox */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-700 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <h3 className="font-medium text-gray-900">Dropbox</h3>
              <p className="text-sm text-gray-500 mt-1">Ready for OAuth</p>
            </div>

            {/* GitHub */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gray-800 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">GH</span>
              </div>
              <h3 className="font-medium text-gray-900">GitHub</h3>
              <p className="text-sm text-gray-500 mt-1">Ready for OAuth</p>
            </div>

            {/* GitLab */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold">GL</span>
              </div>
              <h3 className="font-medium text-gray-900">GitLab</h3>
              <p className="text-sm text-gray-500 mt-1">Ready for OAuth</p>
            </div>
          </div>

          {/* Status Section */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-green-800 font-medium">✅ Application Status</h4>
            <p className="text-green-700 mt-1">React app loaded successfully with Tailwind CSS</p>
            <p className="text-green-700">Cloud services OAuth implementation ready</p>
          </div>
        </div>
      </main>
    </div>
  );
}
