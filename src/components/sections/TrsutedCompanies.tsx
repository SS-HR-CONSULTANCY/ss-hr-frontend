import React, { useState, useMemo } from 'react';
import { MOCK_COMPANIES } from '@/utils/dummyData';


const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const filteredCompanies = useMemo(() => {
    if (!query) {
      return MOCK_COMPANIES;
    }
    const lowerCaseQuery = query.toLowerCase();
    return MOCK_COMPANIES.filter((c) =>
      c.name.toLowerCase().includes(lowerCaseQuery) ||
      c.industries.some((industry) => industry.toLowerCase().includes(lowerCaseQuery))
    );
  }, [query]);

  return (
    <div className="min-h-screen font-sans py-16">
      <div className="sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-0 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Trusted Companies</h1>
              <p className="text-sm ">Discover top companies by name or industry.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies or industries"
              className="w-full md:w-80 rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((c) => (
              <div
                key={c.id}
                className="group rounded-2xl border p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="size-16 mb-4 rounded-xl grid place-items-center overflow-hidden border">
                    <img src={c.logo} alt={c.name} className="w-12 h-12 object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg truncate mb-1">{c.name}</h3>
                    <p className="text-sm truncate">{c.tagline}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-lg">
              No companies found for your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
