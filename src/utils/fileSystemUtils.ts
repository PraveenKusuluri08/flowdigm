// utils/fileSystemUtils.ts
import type { CanvasData } from '../types/importExport';

// Check if the File System Access API is available
const isFileSystemAccessSupported = () => {
  return 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
};

// Save file using native file picker
export const saveFileToDevice = async (canvasData: CanvasData, defaultName: string = 'Untitled Diagram'): Promise<void> => {
  try {
    if (isFileSystemAccessSupported()) {
      // Use modern File System Access API
      const handle = await window.showSaveFilePicker({
        suggestedName: `${defaultName}.json`,
        types: [{
          description: 'FlowDigm Diagram',
          accept: {
            'application/json': ['.json']
          }
        }]
      });
      
      const writable = await handle.createWritable();
      const jsonContent = JSON.stringify(canvasData, null, 2);
      await writable.write(jsonContent);
      await writable.close();
      
      console.log('File saved successfully using File System Access API');
    } else {
      // Fallback to download method
      const jsonContent = JSON.stringify(canvasData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = `${defaultName}.json`;
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
      console.log('File saved using download method');
    }
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
};

// Load file using native file picker
export const loadFileFromDevice = async (): Promise<CanvasData> => {
  try {
    if (isFileSystemAccessSupported()) {
      // Use modern File System Access API
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'FlowDigm Diagram',
          accept: {
            'application/json': ['.json']
          }
        }],
        multiple: false
      });
      
      const file = await fileHandle.getFile();
      const content = await file.text();
      const canvasData = JSON.parse(content) as CanvasData;
      
      // Validate the imported data
      if (!canvasData.nodes || !canvasData.edges) {
        throw new Error('Invalid file format: missing nodes or edges');
      }
      
      console.log('File loaded successfully using File System Access API');
      return canvasData;
    } else {
      // Fallback to file input method
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (event) => {
          const target = event.target as HTMLInputElement;
          const file = target.files?.[0];
          if (file) {
            try {
              const content = await file.text();
              const canvasData = JSON.parse(content) as CanvasData;
              
              // Validate the imported data
              if (!canvasData.nodes || !canvasData.edges) {
                throw new Error('Invalid file format: missing nodes or edges');
              }
              
              console.log('File loaded using file input method');
              resolve(canvasData);
            } catch (error) {
              reject(new Error('Failed to parse file'));
            }
          } else {
            reject(new Error('No file selected'));
          }
        };
        input.click();
      });
    }
  } catch (error) {
    console.error('Error loading file:', error);
    throw new Error('Failed to load file');
  }
};

// Auto-save functionality
export const setupAutoSave = (canvasData: CanvasData, fileName: string) => {
  // Save to localStorage for auto-recovery
  try {
    const autoSaveData = {
      canvasData,
      fileName,
      timestamp: Date.now()
    };
    localStorage.setItem('flowdigm-autosave', JSON.stringify(autoSaveData));
    console.log('Auto-save completed');
  } catch (error) {
    console.warn('Auto-save failed:', error);
  }
};

// Load auto-saved data
export const loadAutoSave = (): { canvasData: CanvasData; fileName: string } | null => {
  try {
    const autoSaveData = localStorage.getItem('flowdigm-autosave');
    if (autoSaveData) {
      const parsed = JSON.parse(autoSaveData);
      const timeSinceSave = Date.now() - parsed.timestamp;
      
      // Only load if auto-save is less than 24 hours old
      if (timeSinceSave < 24 * 60 * 60 * 1000) {
        console.log('Auto-save data found and loaded');
        return {
          canvasData: parsed.canvasData,
          fileName: parsed.fileName
        };
      } else {
        // Clear old auto-save data
        localStorage.removeItem('flowdigm-autosave');
      }
    }
  } catch (error) {
    console.warn('Failed to load auto-save:', error);
  }
  return null;
};

// Clear auto-save data
export const clearAutoSave = () => {
  try {
    localStorage.removeItem('flowdigm-autosave');
    console.log('Auto-save data cleared');
  } catch (error) {
    console.warn('Failed to clear auto-save:', error);
  }
};

// Check if there's unsaved work
export const hasUnsavedWork = (): boolean => {
  try {
    const autoSaveData = localStorage.getItem('flowdigm-autosave');
    return autoSaveData !== null;
  } catch (error) {
    return false;
  }
}; 