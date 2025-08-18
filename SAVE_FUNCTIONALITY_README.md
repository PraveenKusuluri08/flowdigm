# 🎯 FlowDigm Save Functionality - Draw.io-like Implementation

## Overview

This implementation provides a comprehensive save, load, import, and export system similar to draw.io, ensuring that all canvas content (nodes, edges, positions, styles) is properly saved and restored.

## ✨ Key Features

### 🔄 Auto-Save
- **Automatic saving** every 30 seconds when changes are detected
- **Auto-recovery** of unsaved work if the browser crashes or closes unexpectedly
- **Local storage backup** with configurable retention limits

### 💾 Save/Load Operations
- **Native FlowDigm format** (.flowdigm) for complete data preservation
- **Recent files list** with quick access to previously opened diagrams
- **File metadata** including creation date, modification date, and author information
- **Viewport state** preservation (zoom level, pan position)

### 📤 Import/Export Support
- **Multiple formats**: PNG, SVG, PDF, JSON, DrawIO XML, HTML
- **High-quality exports** with configurable resolution and quality settings
- **Format-specific options** (background color, transparency, metadata inclusion)
- **Batch export** capabilities

### ⌨️ Keyboard Shortcuts
- `Ctrl+S` - Save diagram
- `Ctrl+O` - Open diagram
- `Ctrl+E` - Export diagram
- `Ctrl+I` - Import file

## 🏗️ Architecture

### File Manager (`src/utils/fileManager.ts`)
The core file management system that handles:
- File creation, saving, and loading
- Auto-save functionality
- Format conversion and validation
- Recent files management

### File Dialog (`src/components/FileDialog.tsx`)
A comprehensive dialog component that provides:
- Save dialog with filename input and options
- Load dialog with recent files and search
- Import dialog with format selection
- Export dialog with quality and format options

### Canvas Integration (`src/components/CanvasEditor/DrawingCanvas.tsx`)
Enhanced canvas component that:
- Tracks changes for auto-save
- Integrates with file management system
- Provides keyboard shortcuts
- Maintains viewport state

## 🚀 Usage

### Basic Save/Load
1. **Add content** to the canvas (shapes, connections, text)
2. **Press Ctrl+S** or click the Save button
3. **Enter filename** and click Save
4. **File downloads** automatically as `.flowdigm` format

### Opening Files
1. **Press Ctrl+O** or click the Open button
2. **Select from recent files** or choose a new file
3. **Canvas loads** with all content and positions restored

### Importing from Other Formats
1. **Press Ctrl+I** or click the Import button
2. **Select file** (supports JSON, XML, SVG, DrawIO formats)
3. **Content converts** and loads into canvas

### Exporting to Different Formats
1. **Press Ctrl+E** or click the Export button
2. **Choose format** (PNG, SVG, PDF, etc.)
3. **Configure options** (quality, scale, background)
4. **Download file** in selected format

## 📁 File Formats

### Native Format (.flowdigm)
```json
{
  "version": "1.0.0",
  "name": "My Diagram",
  "created": "2024-01-01T00:00:00.000Z",
  "modified": "2024-01-01T00:00:00.000Z",
  "nodes": [...],
  "edges": [...],
  "viewport": {
    "x": 0,
    "y": 0,
    "zoom": 1
  },
  "metadata": {
    "author": "FlowDigm User",
    "tags": [],
    "category": "diagram"
  }
}
```

### Supported Import Formats
- **JSON** - Standard ReactFlow format
- **DrawIO XML** - Draw.io compatible format
- **SVG** - Scalable Vector Graphics
- **Images** - PNG, JPG, JPEG (creates image nodes)

### Supported Export Formats
- **PNG** - High-quality raster image
- **SVG** - Scalable vector format
- **PDF** - Document format with metadata
- **JSON** - Data format for sharing
- **DrawIO XML** - Draw.io compatible
- **HTML** - Standalone web page

## 🔧 Configuration

### Auto-Save Settings
```typescript
const fileManager = new FileManager({
  autoSave: true,              // Enable auto-save
  autoSaveInterval: 30000,     // 30 seconds
  maxAutoSaveFiles: 10,        // Keep 10 auto-saves
  enableVersioning: true,      // Enable file versioning
  compression: true            // Enable compression
});
```

### Export Options
```typescript
const exportOptions = {
  quality: 100,                // Export quality (50-100)
  scale: 2,                    // Resolution multiplier
  backgroundColor: '#ffffff',  // Background color
  includeMetadata: true,       // Include file metadata
  transparent: false,          // Transparent background
  border: 0                    // Border padding
};
```

## 🐛 Troubleshooting

### Save Not Working
1. **Check console** for error messages
2. **Verify canvas content** - empty canvas won't save
3. **Check browser permissions** for file downloads
4. **Clear browser cache** if issues persist

### Import Issues
1. **Verify file format** is supported
2. **Check file size** - large files may timeout
3. **Try different format** if import fails
4. **Check console** for detailed error messages

### Auto-Save Not Working
1. **Check localStorage** is available
2. **Verify auto-save settings** are enabled
3. **Check for browser storage limits**
4. **Clear old auto-saves** if storage is full

## 🧪 Testing

Use the provided test file (`test-save-functionality.html`) to verify functionality:

1. **Open test file** in browser
2. **Run automated tests** using the test buttons
3. **Check console logs** for detailed information
4. **Verify file operations** work as expected

## 📝 Development Notes

### Adding New Formats
1. **Update fileManager.ts** with new format handlers
2. **Add format detection** logic
3. **Implement conversion functions**
4. **Update FileDialog** component
5. **Add format to supported types**

### Customizing Auto-Save
1. **Modify FileManagerOptions** interface
2. **Update auto-save logic** in fileManager
3. **Add custom storage** providers if needed
4. **Implement custom recovery** mechanisms

### Performance Optimization
1. **Debounce change tracking** for large diagrams
2. **Compress file data** for storage efficiency
3. **Implement lazy loading** for large files
4. **Add progress indicators** for long operations

## 🔒 Security Considerations

- **File validation** prevents malicious file uploads
- **Content sanitization** removes potentially harmful content
- **Size limits** prevent memory exhaustion
- **Format restrictions** limit supported file types

## 📈 Future Enhancements

- **Cloud storage** integration (Google Drive, Dropbox)
- **Collaborative editing** with real-time sync
- **Version control** with diff visualization
- **Template library** with pre-built diagrams
- **Advanced export** with custom styling options

---

## 🎉 Success!

The save functionality now works exactly like draw.io:
- ✅ **All canvas content is saved** (shapes, connections, positions, styles)
- ✅ **Auto-save prevents data loss**
- ✅ **Multiple format support** for import/export
- ✅ **Keyboard shortcuts** for quick access
- ✅ **Recent files** for easy access
- ✅ **High-quality exports** with customization options

Try it out by adding some shapes to the canvas and pressing `Ctrl+S` to save!
