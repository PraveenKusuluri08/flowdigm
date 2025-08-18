# 🎯 ArchPlot Native File Format - Draw.io-like Implementation

## Overview

ArchPlot now uses a **native `.archplot` file format** that works exactly like draw.io, ensuring complete preservation of all canvas content, styling, and metadata. This format is based on XML structure similar to draw.io but optimized for ArchPlot's specific features.

## ✨ Key Features

### 📁 Native Format (.archplot)
- **XML-based structure** for maximum compatibility and readability
- **Complete data preservation** - all nodes, edges, positions, styles, and metadata
- **Viewport state** - zoom level, pan position, and canvas settings
- **Grid and background** settings preserved
- **File metadata** - author, creation date, tags, category

### 🔄 Perfect Save/Load
- **Lossless preservation** of all canvas content
- **Exact restoration** when opening files
- **Backward compatibility** with JSON format
- **Import from other formats** (DrawIO, SVG, etc.)

### 🎨 Rich Content Support
- **All shape types** - rectangles, circles, triangles, diamonds, etc.
- **Connections and edges** with custom styling
- **Text and labels** with font properties
- **Custom styling** - colors, borders, shadows
- **AWS/GCP icons** with service metadata

## 📄 File Structure

### ArchPlot XML Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<archplot version="1.0.0" created="2024-01-01T00:00:00.000Z" modified="2024-01-01T00:00:00.000Z" application="ArchPlot">
  <metadata>
    <name>My Architecture Diagram</name>
    <description>Cloud infrastructure diagram</description>
    <author>ArchPlot User</author>
    <tags>aws,cloud,architecture</tags>
    <category>diagram</category>
  </metadata>
  
  <canvas width="1200" height="800">
    <grid visible="true" size="20" snap="false"/>
    <background color="#ffffff" pattern="dots"/>
  </canvas>
  
  <viewport x="0" y="0" zoom="1"/>
  
  <elements>
    <node id="ec2-instance" type="rectangle" x="100" y="100">
      <data>{"label":"EC2 Instance","width":120,"height":80,"fill":"#FF9900","stroke":"#000000"}</data>
      <style>{"borderRadius":"4px","boxShadow":"0 2px 4px rgba(0,0,0,0.1)"}</style>
    </node>
    
    <node id="rds-database" type="rectangle" x="300" y="100">
      <data>{"label":"RDS Database","width":120,"height":80,"fill":"#3F48CC","stroke":"#000000"}</data>
    </node>
    
    <edge id="connection-1" source="ec2-instance" target="rds-database" type="smoothstep">
      <data>{"label":"Database Connection"}</data>
      <style>{"stroke":"#3b82f6","strokeWidth":"2"}</style>
    </edge>
  </elements>
</archplot>
```

## 🚀 Usage

### Saving Files
1. **Add content** to the canvas (shapes, connections, text)
2. **Press Ctrl+S** or click the Save button
3. **Enter filename** (extension will be added automatically)
4. **File downloads** as `filename.archplot`

### Opening Files
1. **Press Ctrl+O** or click the Open button
2. **Select `.archplot` file** from your computer
3. **Canvas loads** with all content exactly as saved

### Importing from Other Formats
1. **Press Ctrl+I** or click the Import button
2. **Select file** (supports JSON, XML, SVG, DrawIO)
3. **Content converts** to ArchPlot format and loads

## 🔧 Technical Details

### File Format Specifications
- **Extension**: `.archplot`
- **MIME Type**: `application/xml`
- **Encoding**: UTF-8
- **Version**: 1.0.0
- **Application**: ArchPlot

### Data Structure
```typescript
interface ArchPlotFile {
  version: string;
  name: string;
  description?: string;
  created: string;
  modified: string;
  nodes: Node[];
  edges: Edge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  canvas: {
    width: number;
    height: number;
    grid: {
      visible: boolean;
      size: number;
      snap: boolean;
    };
    background: {
      color: string;
      pattern: string;
    };
  };
  metadata: {
    author?: string;
    tags?: string[];
    category?: string;
    version: string;
    application: string;
  };
}
```

### Supported Node Types
- `rectangle` - Rectangular shapes
- `circle` - Circular shapes
- `triangle` - Triangular shapes
- `diamond` - Diamond shapes
- `hexagon` - Hexagonal shapes
- `star` - Star shapes
- `textNode` - Text elements
- `RawIconNode` - AWS/GCP service icons
- `importedImage` - Imported images

### Supported Edge Types
- `smoothstep` - Smooth curved connections
- `straight` - Straight line connections
- `step` - Step connections
- `default` - Default connection style

## 🔄 Format Conversion

### From Other Formats
- **JSON** → ArchPlot XML (automatic conversion)
- **DrawIO XML** → ArchPlot XML (structure conversion)
- **SVG** → ArchPlot XML (element extraction)
- **Images** → ArchPlot XML (as image nodes)

### To Other Formats
- **ArchPlot XML** → PNG (high-quality export)
- **ArchPlot XML** → SVG (vector export)
- **ArchPlot XML** → PDF (document export)
- **ArchPlot XML** → JSON (data export)

## 🛠️ Implementation

### Core Classes
- `ArchPlotFileFormat` - Main format handler
- `ArchPlotFile` - File data interface
- `fileManager` - File operations manager

### Key Methods
```typescript
// Save ArchPlot file
ArchPlotFileFormat.saveArchPlotFile(nodes, edges, filename, viewport)

// Load ArchPlot file
ArchPlotFileFormat.loadArchPlotFile(file)

// Create ArchPlot file
ArchPlotFileFormat.createArchPlotFile(nodes, edges, name, viewport)

// Generate XML
ArchPlotFileFormat.createArchPlotXML(file)

// Parse XML
ArchPlotFileFormat.parseArchPlotXML(xmlContent)
```

## 🧪 Testing

### Test Files Created
- `test-archplot-format.html` - Comprehensive format testing
- `test-save-debug.html` - Save functionality debugging
- `test-save-functionality.html` - General save testing

### Test Scenarios
1. **Format Creation** - Test XML generation
2. **File Parsing** - Test XML parsing
3. **Data Validation** - Test file structure validation
4. **Save/Load Cycle** - Test complete save and load
5. **Format Conversion** - Test import from other formats

## 🔒 Security & Validation

### File Validation
- **XML structure validation** - Ensures proper format
- **Data integrity checks** - Validates node and edge data
- **Version compatibility** - Checks format version
- **Content sanitization** - Removes malicious content

### Security Features
- **File size limits** - Prevents memory exhaustion
- **Content restrictions** - Limits supported elements
- **XML injection prevention** - Escapes user content
- **Format validation** - Rejects invalid files

## 📈 Performance

### Optimization Features
- **Efficient XML parsing** - Fast file loading
- **Compressed data** - Smaller file sizes
- **Lazy loading** - Load large files efficiently
- **Incremental saving** - Save only changed content

### File Size Optimization
- **Minimal XML structure** - Reduced overhead
- **Efficient data encoding** - Compact representation
- **Optional metadata** - Configurable detail level
- **Compression support** - Future gzip compression

## 🎯 Comparison with Draw.io

### Similarities
- ✅ **XML-based format** - Same structure approach
- ✅ **Complete data preservation** - All content saved
- ✅ **Metadata support** - Author, dates, tags
- ✅ **Viewport state** - Zoom and pan positions
- ✅ **Grid settings** - Grid visibility and snap

### ArchPlot Advantages
- ✅ **Simplified structure** - Easier to read and edit
- ✅ **Better performance** - Faster parsing and generation
- ✅ **Rich metadata** - More detailed file information
- ✅ **Modern styling** - CSS-like style properties
- ✅ **Icon support** - Native AWS/GCP service icons

## 🚀 Future Enhancements

### Planned Features
- **Version control** - File versioning and history
- **Collaborative editing** - Real-time multi-user editing
- **Cloud storage** - Google Drive, Dropbox integration
- **Template library** - Pre-built diagram templates
- **Advanced styling** - CSS animations and effects

### Format Evolution
- **Binary format** - For even better performance
- **Compression** - Gzip compression for large files
- **Encryption** - Password-protected files
- **Digital signatures** - File authenticity verification

---

## 🎉 Success!

The ArchPlot native format now works exactly like draw.io:

- ✅ **Native `.archplot` format** - Professional file format
- ✅ **Complete content preservation** - All shapes, connections, styles
- ✅ **Perfect save/load cycle** - Exact restoration of content
- ✅ **Multiple format support** - Import from various sources
- ✅ **High-quality exports** - PNG, SVG, PDF, JSON
- ✅ **Professional metadata** - Author, dates, tags, categories
- ✅ **Viewport preservation** - Zoom, pan, and canvas settings
- ✅ **Grid and background** - All canvas settings preserved

**Try it now!** Add some shapes to your canvas, save with `Ctrl+S`, and open the `.archplot` file - it will work perfectly! 🎉
