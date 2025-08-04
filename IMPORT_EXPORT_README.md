# Import/Export Functionality

This document describes the import and export functionality implemented in the FlowDigm application.

## Features

### Export Options
The application supports exporting diagrams in the following formats:

1. **PNG** - High-quality image export
2. **JPEG** - Compressed image export
3. **SVG** - Scalable vector graphics
4. **JSON** - Complete diagram data (recommended for sharing/backup)

### Import Options
- **JSON** - Import previously exported diagram files

## How to Use

### Exporting a Diagram

1. **Via Menu Bar:**
   - Click on "File" in the menu bar
   - Select "Export as..."
   - Choose your desired format (PNG, JPEG, SVG, or JSON)

2. **Keyboard Shortcuts:**
   - PNG: `Ctrl+Shift+P`
   - JPEG: `Ctrl+Shift+J`
   - SVG: `Ctrl+Shift+S`
   - JSON: `Ctrl+Shift+J`

### Importing a Diagram

1. **Via Menu Bar:**
   - Click on "File" in the menu bar
   - Select "Import from..."
   - Choose a JSON file that was previously exported

## File Formats

### JSON Format
The JSON export contains all diagram data including:
- Node positions and properties
- Edge connections
- Viewport settings (zoom, pan)
- Grid settings
- File metadata

Example JSON structure:
```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "rectangle",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "My Rectangle",
        "width": 80,
        "height": 60,
        "fill": "#ffffff",
        "stroke": "#000000"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "type": "smoothstep"
    }
  ],
  "viewport": {
    "x": 0,
    "y": 0,
    "zoom": 1
  },
  "grid": {
    "visible": true,
    "size": 20,
    "snap": false
  },
  "fileName": "My Diagram",
  "version": "1.0"
}
```

### Image Formats (PNG/JPEG/SVG)
These formats export the visual representation of the diagram as an image file, suitable for:
- Presentations
- Documentation
- Sharing with non-users
- Printing

## Technical Implementation

### Key Files
- `src/utils/importExportUtils.ts` - Core import/export logic
- `src/context/CanvasEditorProvider.tsx` - Canvas context with import/export functions
- `src/components/Layout/Header.tsx` - UI integration for import/export

### Dependencies
- `html2canvas` - For PNG/JPEG export functionality
- `reactflow` - For canvas data structure

### Export Process
1. User selects export format from menu
2. Canvas data is converted to appropriate format
3. File is generated and downloaded automatically
4. User receives the exported file

### Import Process
1. User selects "Import from..." from menu
2. File picker opens for JSON file selection
3. File is read and parsed
4. Canvas is updated with imported data
5. Diagram is restored to previous state

## Best Practices

### For Exporting
- Use JSON format for sharing with other users or backing up your work
- Use PNG/SVG for presentations and documentation
- Use JPEG for web sharing (smaller file size)

### For Importing
- Only import JSON files that were exported from this application
- Backup your current work before importing
- Verify the imported diagram matches your expectations

## Troubleshooting

### Common Issues

1. **Export fails:**
   - Ensure the canvas has content to export
   - Check browser permissions for file downloads
   - Try a different export format

2. **Import fails:**
   - Verify the file is a valid JSON format
   - Ensure the file was exported from this application
   - Check file size (should be reasonable for a diagram)

3. **Image quality issues:**
   - PNG provides the best quality
   - SVG is scalable and good for printing
   - JPEG is compressed but smaller file size

### Support
If you encounter issues with import/export functionality, please check:
1. Browser console for error messages
2. File format compatibility
3. Browser permissions for file access

## Future Enhancements

Potential improvements for future versions:
- Support for more export formats (PDF, XML)
- Import from other diagram formats
- Cloud storage integration
- Collaborative sharing features
- Version history and diffing 