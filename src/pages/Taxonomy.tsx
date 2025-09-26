import React, { useState } from 'react';
import { Search, ChevronRight, ChevronDown, TreePine, Fish, Waves } from 'lucide-react';

const Taxonomy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [imageSearchFile, setImageSearchFile] = useState(null);
  const [imageSearchResult, setImageSearchResult] = useState(null);
  const imageInputRef = React.useRef(null);

  const taxonomyTree = [
    {
      id: 'chordata',
      name: 'Chordata',
      level: 'phylum',
      children: [
        {
          id: 'actinopterygii',
          name: 'Actinopterygii',
          level: 'class',
          children: [
            {
              id: 'perciformes',
              name: 'Perciformes',
              level: 'order',
              children: [
                {
                  id: 'scombridae',
                  name: 'Scombridae',
                  level: 'family',
                  children: [
                    { id: 'thunnus', name: 'Thunnus thynnus', level: 'species', common: 'Atlantic Bluefin Tuna' }
                  ]
                }
              ]
            },
            {
              id: 'gadiformes',
              name: 'Gadiformes',
              level: 'order',
              children: [
                {
                  id: 'gadidae',
                  name: 'Gadidae',
                  level: 'family',
                  children: [
                    { id: 'gadus', name: 'Gadus morhua', level: 'species', common: 'Atlantic Cod' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const sampleSearchResults = [
    { species: 'Thunnus thynnus', common: 'Atlantic Bluefin Tuna', confidence: 98, family: 'Scombridae' },
    { species: 'Gadus morhua', common: 'Atlantic Cod', confidence: 94, family: 'Gadidae' },
    { species: 'Salmo salar', common: 'Atlantic Salmon', confidence: 89, family: 'Salmonidae' },
    { species: 'Scomber scombrus', common: 'Atlantic Mackerel', confidence: 87, family: 'Scombridae' }
  ];

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 2) {
      setSearchResults(sampleSearchResults.filter(result => 
        result.species.toLowerCase().includes(term.toLowerCase()) ||
        result.common.toLowerCase().includes(term.toLowerCase())
      ));
    } else {
      setSearchResults([]);
    }
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSearchFile(file);
      // Simulate image analysis
      setTimeout(() => {
        setImageSearchResult({
          species: 'Thunnus thynnus',
          common: 'Atlantic Bluefin Tuna',
          confidence: 92,
          family: 'Scombridae',
          notes: 'High confidence match based on fin structure and body proportions'
        });
      }, 2000);
    }
  };

  const renderTreeNode = (node, level = 0) => {
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    const levelColors = {
      phylum: 'text-purple-800 bg-purple-100',
      class: 'text-blue-800 bg-blue-100',
      order: 'text-green-800 bg-green-100',
      family: 'text-yellow-800 bg-yellow-100',
      species: 'text-[#30345E] bg-[#30345E]/10'
    };

    return (
      <div key={node.id} style={{ marginLeft: `${level * 24}px` }}>
        <div 
          className="flex items-center py-2 px-3 hover:bg-[#F8F9FB] rounded-lg cursor-pointer group"
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          <div className="flex items-center space-x-2 flex-1">
            {hasChildren ? (
              isExpanded ? <ChevronDown className="w-4 h-4 text-[#30345E]" /> : <ChevronRight className="w-4 h-4 text-[#30345E]" />
            ) : (
              <div className="w-4 h-4" />
            )}
            
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelColors[node.level]}`}>
              {node.level}
            </span>
            
            <div className="flex-1">
              <div className="font-medium text-[#30345E] italic">{node.name}</div>
              {node.common && <div className="text-sm text-gray-600">{node.common}</div>}
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-gray-100 ml-6">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-12 px-6 min-h-screen bg-[#F8F9FB]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-[#30345E] mb-4">Shark Species Taxonomy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore marine species classification and search our comprehensive taxonomic database
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#30345E]">Species Search</h2>
            
            {/* Search Input */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by species name or common name..."
                  className="w-full pl-12 pr-4 py-4 border border-[#30345E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30345E]/20"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              {searchTerm && (
                <div className="mt-4 text-sm text-gray-600">
                  Searching for: <span className="font-medium text-[#30345E]">"{searchTerm}"</span>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-[#30345E] mb-4">Search Results</h3>
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div key={index} className="bg-[#F8F9FB] rounded-lg p-4 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-[#30345E] italic">{result.species}</div>
                          <div className="text-sm text-gray-600">{result.common}</div>
                          <div className="text-xs text-gray-500">Family: {result.family}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#30345E]">{result.confidence}%</div>
                          <div className="text-xs text-gray-500">confidence</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-[#30345E] h-1 rounded-full transition-all duration-500"
                          style={{ width: `${result.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Search Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#30345E] mb-4 flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Image-Based Species Identification</span>
              </h3>
              
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center mb-4">
                {imageSearchFile ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-[#30345E] rounded-lg mx-auto flex items-center justify-center">
                      <Fish className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm font-medium text-[#30345E]">{imageSearchFile.name}</p>
                    <p className="text-xs text-gray-500">Analyzing image...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Fish className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Upload a fish image for AI identification</p>
                    <button 
                      onClick={handleImageUpload}
                      className="bg-[#30345E] text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200"
                    >
                      Choose Image
                    </button>
                  </div>
                )}
              </div>
              
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {imageSearchResult && (
                <div className="bg-[#F8F9FB] rounded-lg p-4">
                  <h4 className="font-semibold text-[#30345E] mb-3">Identification Result</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Species:</span>
                      <span className="font-medium italic text-[#30345E]">{imageSearchResult.species}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Common Name:</span>
                      <span className="font-medium text-[#30345E]">{imageSearchResult.common}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Family:</span>
                      <span className="font-medium text-[#30345E]">{imageSearchResult.family}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Confidence:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#30345E] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${imageSearchResult.confidence}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-sm text-[#30345E]">{imageSearchResult.confidence}%</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <span className="text-gray-600">Notes:</span>
                      <p className="text-sm text-gray-700 mt-1">{imageSearchResult.notes}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-3">
                * Image analysis uses AI models trained on marine species datasets. Results are for reference only.
              </p>
            </div>
          </div>

          {/* Taxonomy Tree */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-semibold text-[#30345E]">Taxonomic Tree</h2>
              <TreePine className="w-6 h-6 text-[#30345E]" />
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 max-h-[600px] overflow-y-auto">
              <div className="space-y-1">
                {taxonomyTree.map(node => renderTreeNode(node))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <Fish className="w-8 h-8 text-[#3C7EDB] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#30345E]">2,847</div>
                <div className="text-sm text-gray-600">Species Cataloged</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <Waves className="w-8 h-8 text-[#3C7EDB] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#30345E]">156</div>
                <div className="text-sm text-gray-600">Families</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taxonomy;