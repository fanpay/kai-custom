
import type { ContentType } from '@/types';

interface ContentTypeListProps {
  contentTypes: ContentType[];
  selectedTypes: string[];
  onSelectionChange: (selectedCodenames: string[]) => void;
  isLoading?: boolean;
}

export function ContentTypeList({
  contentTypes,
  selectedTypes,
  onSelectionChange,
  isLoading = false,
}: Readonly<ContentTypeListProps>) {
  const handleSelectAll = () => {
    if (selectedTypes.length === contentTypes.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(contentTypes.map(ct => ct.codename));
    }
  };

  const handleToggleType = (codename: string) => {
    if (selectedTypes.includes(codename)) {
      onSelectionChange(selectedTypes.filter(ct => ct !== codename));
    } else {
      onSelectionChange([...selectedTypes, codename]);
    }
  };

  if (isLoading) {
    return (
      <div className="kontent-card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kontent-primary"></div>
          <span className="ml-2 text-gray-600">Loading content types...</span>
        </div>
      </div>
    );
  }

  if (contentTypes.length === 0) {
    return (
      <div className="kontent-card">
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No content types found in the source environment</p>
        </div>
      </div>
    );
  }

  const allSelected = selectedTypes.length === contentTypes.length;
  const someSelected = selectedTypes.length > 0 && selectedTypes.length < contentTypes.length;

  return (
    <div className="kontent-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Content Types ({contentTypes.length} total)</h3>
        <button
          onClick={handleSelectAll}
          className="text-sm text-kontent-primary hover:text-orange-600 font-medium"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Selection Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) input.indeterminate = someSelected;
            }}
            onChange={handleSelectAll}
            className="h-4 w-4 text-kontent-primary focus:ring-kontent-primary border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            {selectedTypes.length} of {contentTypes.length} content types selected
          </span>
        </div>
      </div>

      {/* Content Types List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {contentTypes.map((contentType) => (
          <div
            key={contentType.id}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedTypes.includes(contentType.codename)
                ? 'border-kontent-primary bg-orange-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleToggleType(contentType.codename)}
          >
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={selectedTypes.includes(contentType.codename)}
                onChange={() => handleToggleType(contentType.codename)}
                className="mt-1 h-4 w-4 text-kontent-primary focus:ring-kontent-primary border-gray-300 rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {contentType.name}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {contentType.elements.length} elements
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-mono">
                  {contentType.codename}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last modified: {contentType.last_modified.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Types Summary */}
      {selectedTypes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Selected content types:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((codename) => {
              const contentType = contentTypes.find(ct => ct.codename === codename);
              return (
                <span
                  key={codename}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-kontent-primary text-white"
                >
                  {contentType?.name || codename}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleType(codename);
                    }}
                    className="ml-1 hover:bg-orange-600 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}