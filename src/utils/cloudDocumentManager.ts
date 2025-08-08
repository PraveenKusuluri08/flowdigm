// Cloud Document Manager for Lucidchart and Microsoft Visio

// Stub interfaces
export interface UserCredentials {
  platform: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface DiagramData {
  id: string;
  name: string;
  content: any;
  platform: string;
  lastModified: Date;
  version?: string | number;
  nodes?: any[];
  edges?: any[];
  metadata?: any;
}

// Stub implementation for oauth2Service
const oauth2Service = {
  getValidCredentials: async (credentials: UserCredentials) => credentials
};

export interface CloudDocument {
  id: string;
  name: string;
  platform: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  modifiedAt: Date;
  size?: number;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  permissions: {
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
  };
  metadata: {
    pageCount?: number;
    shapeCount?: number;
    collaborators?: number;
  };
}

export interface DocumentContent {
  document: CloudDocument;
  content: any; // Raw platform-specific content
  diagramData: DiagramData; // Converted to internal format
}

export interface DocumentListOptions {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'name' | 'modified' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export class CloudDocumentManager {
  private apiEndpoints = {
    lucidchart: {
      documents: 'https://api.lucidchart.com/documents',
      document: (id: string) => `https://api.lucidchart.com/documents/${id}`,
      content: (id: string) => `https://api.lucidchart.com/documents/${id}/content`,
      export: (id: string, format: string) => `https://api.lucidchart.com/documents/${id}/export/${format}`
    },
    visio: {
      documents: 'https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'.vsdx\')',
      driveItems: 'https://graph.microsoft.com/v1.0/me/drive/items',
      document: (id: string) => `https://graph.microsoft.com/v1.0/me/drive/items/${id}`,
      content: (id: string) => `https://graph.microsoft.com/v1.0/me/drive/items/${id}/content`
    },
    drawio: {
      documents: 'https://www.googleapis.com/drive/v3/files',
      document: (id: string) => `https://www.googleapis.com/drive/v3/files/${id}`,
      content: (id: string) => `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
      upload: 'https://www.googleapis.com/upload/drive/v3/files',
      search: (query: string) => `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`
    }
  };

  /**
   * Fetch list of documents from a platform
   */
  async fetchDocuments(
    credentials: UserCredentials,
    options: DocumentListOptions = {}
  ): Promise<CloudDocument[]> {
    const validCredentials = await oauth2Service.getValidCredentials(credentials);
    
    switch (credentials.platform) {
      case 'lucidchart':
        return this.fetchLucidchartDocuments(validCredentials, options);
      case 'visio':
        return this.fetchVisioDocuments(validCredentials, options);
      case 'drawio':
        return this.fetchDrawioDocuments(validCredentials, options);
      default:
        throw new Error(`Unsupported platform: ${credentials.platform}`);
    }
  }

  /**
   * Fetch a single document with its content
   */
  async fetchDocument(
    credentials: UserCredentials,
    documentId: string
  ): Promise<DocumentContent> {
    const validCredentials = await oauth2Service.getValidCredentials(credentials);
    
    switch (credentials.platform) {
      case 'lucidchart':
        return this.fetchLucidchartDocument(validCredentials, documentId);
      case 'visio':
        return this.fetchVisioDocument(validCredentials, documentId);
      case 'drawio':
        return this.fetchDrawioDocument(validCredentials, documentId);
      default:
        throw new Error(`Unsupported platform: ${credentials.platform}`);
    }
  }

  /**
   * Save document back to the platform
   */
  async saveDocument(
    credentials: UserCredentials,
    documentId: string,
    diagramData: DiagramData,
    options: { createNew?: boolean; name?: string } = {}
  ): Promise<CloudDocument> {
    const validCredentials = await oauth2Service.getValidCredentials(credentials);
    
    switch (credentials.platform) {
      case 'lucidchart':
        return this.saveLucidchartDocument(validCredentials, documentId, diagramData, options);
      case 'visio':
        return this.saveVisioDocument(validCredentials, documentId, diagramData, options);
      case 'drawio':
        // For Draw.io, we always create a new document (treating documentId as a name)
        return this.saveDrawioDocument(validCredentials, diagramData, options.name || documentId);
      default:
        throw new Error(`Unsupported platform: ${credentials.platform}`);
    }
  }

  // Lucidchart API Implementation

  private async fetchLucidchartDocuments(
    credentials: UserCredentials,
    options: DocumentListOptions
  ): Promise<CloudDocument[]> {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.search) params.append('search', options.search);
    if (options.sortBy) params.append('sort', options.sortBy);

    const response = await fetch(`${this.apiEndpoints.lucidchart.documents}?${params}`, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Lucidchart documents: ${response.statusText}`);
    }

    const data = await response.json();
    return data.documents.map((doc: any) => this.normalizeLucidchartDocument(doc));
  }

  private async fetchLucidchartDocument(
    credentials: UserCredentials,
    documentId: string
  ): Promise<DocumentContent> {
    // Fetch document metadata
    const docResponse = await fetch(this.apiEndpoints.lucidchart.document(documentId), {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!docResponse.ok) {
      throw new Error(`Failed to fetch Lucidchart document: ${docResponse.statusText}`);
    }

    const docData = await docResponse.json();
    const document = this.normalizeLucidchartDocument(docData);

    // Fetch document content
    const contentResponse = await fetch(this.apiEndpoints.lucidchart.content(documentId), {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!contentResponse.ok) {
      throw new Error(`Failed to fetch Lucidchart content: ${contentResponse.statusText}`);
    }

    const content = await contentResponse.json();
    const diagramData = this.convertLucidchartToDiagram(content);

    return { document, content, diagramData };
  }

  private async saveLucidchartDocument(
    credentials: UserCredentials,
    documentId: string,
    diagramData: DiagramData,
    options: { createNew?: boolean; name?: string }
  ): Promise<CloudDocument> {
    const lucidchartContent = this.convertDiagramToLucidchart(diagramData);
    
    const url = options.createNew 
      ? this.apiEndpoints.lucidchart.documents
      : this.apiEndpoints.lucidchart.content(documentId);

    const method = options.createNew ? 'POST' : 'PUT';
    const body = options.createNew 
      ? { name: options.name || 'New Diagram', content: lucidchartContent }
      : lucidchartContent;

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Failed to save Lucidchart document: ${response.statusText}`);
    }

    const savedDoc = await response.json();
    return this.normalizeLucidchartDocument(savedDoc);
  }

  // Microsoft Graph API Implementation

  private async fetchVisioDocuments(
    credentials: UserCredentials,
    options: DocumentListOptions
  ): Promise<CloudDocument[]> {
    let url = this.apiEndpoints.visio.documents;
    
    // Add query parameters for filtering and sorting
    const params = new URLSearchParams();
    if (options.limit) params.append('$top', options.limit.toString());
    if (options.offset) params.append('$skip', options.offset.toString());
    if (options.sortBy) {
      const sortField = options.sortBy === 'modified' ? 'lastModifiedDateTime' : 
                       options.sortBy === 'created' ? 'createdDateTime' : 'name';
      params.append('$orderby', `${sortField} ${options.sortOrder || 'desc'}`);
    }

    if (params.toString()) {
      url += (url.includes('?') ? '&' : '?') + params.toString();
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Visio documents: ${response.statusText}`);
    }

    const data = await response.json();
    return data.value.map((item: any) => this.normalizeVisioDocument(item));
  }

  private async fetchVisioDocument(
    credentials: UserCredentials,
    documentId: string
  ): Promise<DocumentContent> {
    // Fetch document metadata
    const docResponse = await fetch(this.apiEndpoints.visio.document(documentId), {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!docResponse.ok) {
      throw new Error(`Failed to fetch Visio document: ${docResponse.statusText}`);
    }

    const docData = await docResponse.json();
    const document = this.normalizeVisioDocument(docData);

    // Fetch document content (binary VSDX file)
    const contentResponse = await fetch(this.apiEndpoints.visio.content(documentId), {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`
      }
    });

    if (!contentResponse.ok) {
      throw new Error(`Failed to fetch Visio content: ${contentResponse.statusText}`);
    }

    const content = await contentResponse.arrayBuffer();
    const diagramData = await this.convertVisioToDiagram(content);

    return { document, content, diagramData };
  }

  private async saveVisioDocument(
    credentials: UserCredentials,
    documentId: string,
    diagramData: DiagramData,
    options: { createNew?: boolean; name?: string }
  ): Promise<CloudDocument> {
    const visioContent = await this.convertDiagramToVisio(diagramData);
    
    let url: string;
    let method: string;

    if (options.createNew) {
      const fileName = (options.name || 'New Diagram') + '.vsdx';
      url = `${this.apiEndpoints.visio.driveItems}:/${fileName}:/content`;
      method = 'PUT';
    } else {
      url = this.apiEndpoints.visio.content(documentId);
      method = 'PUT';
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Content-Type': 'application/octet-stream'
      },
      body: visioContent
    });

    if (!response.ok) {
      throw new Error(`Failed to save Visio document: ${response.statusText}`);
    }

    const savedDoc = await response.json();
    return this.normalizeVisioDocument(savedDoc);
  }

  // Document normalization methods

  private normalizeLucidchartDocument(doc: any): CloudDocument {
    return {
      id: doc.id,
      name: doc.title || doc.name,
      platform: 'lucidchart',
      url: doc.editUrl || `https://lucidchart.com/documents/edit/${doc.id}`,
      thumbnailUrl: doc.thumbnailUrl,
      createdAt: new Date(doc.createdDate),
      modifiedAt: new Date(doc.modifiedDate),
      size: doc.size,
      owner: {
        id: doc.owner?.id || doc.createdBy?.id,
        name: doc.owner?.name || doc.createdBy?.name,
        email: doc.owner?.email || doc.createdBy?.email
      },
      permissions: {
        canEdit: doc.permissions?.canEdit !== false,
        canShare: doc.permissions?.canShare !== false,
        canDelete: doc.permissions?.canDelete !== false
      },
      metadata: {
        pageCount: doc.pageCount,
        shapeCount: doc.shapeCount,
        collaborators: doc.collaborators?.length
      }
    };
  }

  private normalizeVisioDocument(item: any): CloudDocument {
    return {
      id: item.id,
      name: item.name.replace('.vsdx', ''),
      platform: 'visio',
      url: item.webUrl,
      thumbnailUrl: item.thumbnails?.[0]?.large?.url,
      createdAt: new Date(item.createdDateTime),
      modifiedAt: new Date(item.lastModifiedDateTime),
      size: item.size,
      owner: {
        id: item.createdBy?.user?.id,
        name: item.createdBy?.user?.displayName,
        email: item.createdBy?.user?.email
      },
      permissions: {
        canEdit: !item.permissions?.find((p: any) => p.role === 'read'),
        canShare: true, // Assume sharing is allowed
        canDelete: item.permissions?.some((p: any) => p.role === 'owner')
      },
      metadata: {
        // Visio metadata will be extracted from file content
      }
    };
  }

  // Draw.io API Implementation (using Google Drive backend)

  private async fetchDrawioDocuments(
    credentials: UserCredentials,
    options: DocumentListOptions
  ): Promise<CloudDocument[]> {
    // Search for Draw.io files in Google Drive (.drawio, .xml, .svg)
    const searchQueries = [
      "name contains '.drawio'",
      "name contains '.xml' and (name contains 'diagram' or name contains 'draw')",
      "mimeType='application/vnd.google-apps.drawing'"
    ];
    
    const allDocuments: CloudDocument[] = [];
    
    for (const query of searchQueries) {
      const params = new URLSearchParams({
        q: query,
        fields: 'files(id,name,webViewLink,thumbnailLink,createdTime,modifiedTime,size,owners,permissions)',
        orderBy: options.sortBy === 'name' ? 'name' : 'modifiedTime desc'
      });
      
      if (options.limit) {
        params.append('pageSize', Math.min(options.limit, 100).toString());
      }

      const response = await fetch(`${this.apiEndpoints.drawio.documents}?${params}`, {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch Draw.io documents with query "${query}": ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      const documents = data.files?.map((file: any) => this.normalizeDrawioDocument(file)) || [];
      allDocuments.push(...documents);
    }

    // Remove duplicates and apply search filter
    const uniqueDocuments = allDocuments.filter((doc, index, arr) => 
      arr.findIndex(d => d.id === doc.id) === index
    );

    // Apply search filter if provided
    let filteredDocuments = uniqueDocuments;
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredDocuments = uniqueDocuments.filter(doc => 
        doc.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply limit and offset
    const startIndex = options.offset || 0;
    const endIndex = options.limit ? startIndex + options.limit : undefined;
    
    return filteredDocuments.slice(startIndex, endIndex);
  }

  private async fetchDrawioDocument(
    credentials: UserCredentials,
    documentId: string
  ): Promise<DocumentContent> {
    // Fetch document metadata
    const metadataResponse = await fetch(this.apiEndpoints.drawio.document(documentId), {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!metadataResponse.ok) {
      throw new Error(`Failed to fetch Draw.io document metadata: ${metadataResponse.statusText}`);
    }

    const metadata = await metadataResponse.json();
    const document = this.normalizeDrawioDocument(metadata);

    // Fetch document content
    const contentResponse = await fetch(this.apiEndpoints.drawio.content(documentId), {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`
      }
    });

    if (!contentResponse.ok) {
      throw new Error(`Failed to fetch Draw.io document content: ${contentResponse.statusText}`);
    }

    const content = await contentResponse.text();
    const diagramData = this.convertDrawioToDiagram(content);

    return {
      document,
      content,
      diagramData
    };
  }

  private async saveDrawioDocument(
    credentials: UserCredentials,
    diagramData: DiagramData,
    fileName: string
  ): Promise<CloudDocument> {
    const drawioXml = this.convertDiagramToDrawio(diagramData);
    
    // Create metadata for the file
    const metadata = {
      name: fileName.endsWith('.drawio') ? fileName : `${fileName}.drawio`,
      parents: [] // Upload to root folder
    };

    // Upload file using Google Drive API
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', new Blob([drawioXml], { type: 'application/xml' }));

    const response = await fetch(this.apiEndpoints.drawio.upload + '?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to save Draw.io document: ${response.statusText}`);
    }

    const savedFile = await response.json();
    return this.normalizeDrawioDocument(savedFile);
  }

  private normalizeDrawioDocument(file: any): CloudDocument {
    return {
      id: file.id,
      name: file.name.replace(/\.(drawio|xml)$/, ''),
      platform: 'drawio',
      url: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
      thumbnailUrl: file.thumbnailLink,
      createdAt: new Date(file.createdTime),
      modifiedAt: new Date(file.modifiedTime),
      size: parseInt(file.size) || 0,
      owner: {
        id: file.owners?.[0]?.permissionId || 'unknown',
        name: file.owners?.[0]?.displayName || 'Unknown',
        email: file.owners?.[0]?.emailAddress || 'unknown@example.com'
      },
      permissions: {
        canEdit: file.permissions?.some((p: any) => p.role === 'writer' || p.role === 'owner') !== false,
        canShare: file.permissions?.some((p: any) => p.role === 'owner') !== false,
        canDelete: file.permissions?.some((p: any) => p.role === 'owner') !== false
      },
      metadata: {
        // Draw.io metadata can be extracted from XML content
      }
    };
  }

  // Content conversion methods (to be implemented based on platform schemas)

  private convertLucidchartToDiagram(content: any): DiagramData {
    // Convert Lucidchart JSON format to internal DiagramData format
    const nodes = content.pages?.[0]?.objects?.map((obj: any) => ({
      id: obj.id,
      type: 'custom',
      position: { x: obj.boundingBox?.x || 0, y: obj.boundingBox?.y || 0 },
      data: {
        label: obj.text || obj.title || '',
        shapeId: this.mapLucidchartShape(obj.definition?.type),
        properties: {
          originalType: obj.definition?.type,
          platform: 'lucidchart'
        },
        style: {
          width: obj.boundingBox?.width || 100,
          height: obj.boundingBox?.height || 50,
          backgroundColor: obj.style?.fill?.color,
          borderColor: obj.style?.stroke?.color,
          borderWidth: obj.style?.stroke?.width
        }
      },
      platformSpecific: {
        lucidchart: obj
      }
    })) || [];

    const edges = content.pages?.[0]?.lines?.map((line: any) => ({
      id: line.id,
      source: line.endpoint1?.connection?.objectId,
      target: line.endpoint2?.connection?.objectId,
      data: {
        label: line.text || '',
        style: {
          strokeColor: line.style?.stroke?.color,
          strokeWidth: line.style?.stroke?.width
        }
      },
      platformSpecific: {
        lucidchart: line
      }
    })) || [];

    return {
      id: content.id || 'imported-' + Date.now(),
      name: content.title || 'Imported Diagram',
      platform: 'lucidchart',
      lastModified: new Date(),
      version: 1,
      nodes,
      edges,
      metadata: {
        title: content.title || 'Imported Diagram',
        author: content.author || 'Unknown',
        tags: ['imported', 'lucidchart'],
        version: '1.0',
        platform: 'lucidchart',
        syncStatus: 'synced',
        lastSyncTime: new Date()
      }
    };
  }

  private async convertVisioToDiagram(content: ArrayBuffer): Promise<DiagramData> {
    // Note: This is a simplified implementation
    // In a real implementation, you would need a VSDX parser library
    // or convert the file server-side and return JSON
    
    console.log('Converting Visio file (size:', content.byteLength, 'bytes)');
    
    // For now, return a placeholder that indicates Visio content was received
    return {
      id: 'visio-import-' + Date.now(),
      name: 'Imported Visio Document',
      platform: 'visio',
      lastModified: new Date(),
      version: 1,
      nodes: [{
        id: 'visio-placeholder',
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
          label: 'Visio Document (Conversion in Progress)',
          shapeId: 'basic-rectangle',
          properties: {
            platform: 'visio',
            note: 'Full Visio parsing requires server-side processing',
            contentSize: content.byteLength
          }
        },
        platformSpecific: {
          visio: {
            originalFormat: 'vsdx',
            contentSize: content.byteLength
          }
        }
      }],
      edges: [],
      metadata: {
        title: 'Imported Visio Document',
        author: 'Unknown',
        tags: ['imported', 'visio'],
        version: '1.0',
        platform: 'visio',
        syncStatus: 'pending',
        lastSyncTime: new Date()
      }
    };
  }

  private convertDiagramToLucidchart(diagramData: DiagramData): any {
    return {
      pages: [{
        id: 'page1',
        objects: diagramData.nodes.map(node => ({
          id: node.id,
          definition: {
            type: this.mapShapeToLucidchart(node.data.shapeId)
          },
          boundingBox: {
            x: node.position.x,
            y: node.position.y,
            width: node.data.style?.width || 100,
            height: node.data.style?.height || 50
          },
          text: node.data.label,
          style: {
            fill: { color: node.data.style?.backgroundColor },
            stroke: { 
              color: node.data.style?.borderColor,
              width: node.data.style?.borderWidth
            }
          }
        })),
        lines: diagramData.edges.map(edge => ({
          id: edge.id,
          endpoint1: { connection: { objectId: edge.source } },
          endpoint2: { connection: { objectId: edge.target } },
          text: edge.data?.label,
          style: {
            stroke: {
              color: edge.data?.style?.strokeColor,
              width: edge.data?.style?.strokeWidth
            }
          }
        }))
      }]
    };
  }

  private async convertDiagramToVisio(diagramData: DiagramData): Promise<ArrayBuffer> {
    // Note: This is a placeholder implementation
    // Converting to VSDX format requires complex XML generation and ZIP packaging
    // In a real implementation, this would be done server-side
    
    const placeholder = new TextEncoder().encode(JSON.stringify({
      message: 'Visio conversion requires server-side processing',
      diagramData,
      convertedAt: new Date()
    }));
    
    return placeholder.buffer;
  }

  private convertDrawioToDiagram(content: string): DiagramData {
    // Parse Draw.io XML format to internal DiagramData format
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');
      
      // Draw.io stores diagram data in mxGraphModel
      const mxGraphModel = xmlDoc.querySelector('mxGraphModel');
      if (!mxGraphModel) {
        throw new Error('Invalid Draw.io format: missing mxGraphModel');
      }

      const root = mxGraphModel.querySelector('root');
      if (!root) {
        throw new Error('Invalid Draw.io format: missing root element');
      }

      const cells = Array.from(root.querySelectorAll('mxCell'));
      const nodes: any[] = [];
      const edges: any[] = [];

      cells.forEach(cell => {
        const id = cell.getAttribute('id');
        const parent = cell.getAttribute('parent');
        const source = cell.getAttribute('source');
        const target = cell.getAttribute('target');
        const style = cell.getAttribute('style') || '';
        const value = cell.getAttribute('value') || '';

        if (source && target) {
          // This is an edge
          edges.push({
            id,
            source,
            target,
            label: value,
            type: 'default',
            data: { style }
          });
        } else if (id !== '0' && id !== '1' && parent === '1') {
          // This is a node (exclude root cells)
          const geometry = cell.querySelector('mxGeometry');
          const x = parseFloat(geometry?.getAttribute('x') || '0');
          const y = parseFloat(geometry?.getAttribute('y') || '0');
          const width = parseFloat(geometry?.getAttribute('width') || '100');
          const height = parseFloat(geometry?.getAttribute('height') || '100');

          nodes.push({
            id,
            type: 'custom',
            position: { x, y },
            data: {
              label: value,
              shapeId: this.mapDrawioShape(style),
              properties: {
                style,
                width,
                height
              }
            }
          });
        }
      });

      return {
        id: 'drawio-import-' + Date.now(),
        name: 'Draw.io Import',
        platform: 'drawio',
        lastModified: new Date(),
        version: 1.0,
        nodes,
        edges,
        metadata: {
          platform: 'drawio',
          version: '1.0',
          title: 'Draw.io Import',
          tags: [],
          syncStatus: 'synced'
        }
      };
    } catch (error) {
      console.error('Error converting Draw.io content:', error);
      throw new Error(`Failed to convert Draw.io content: ${(error as Error).message}`);
    }
  }

  private convertDiagramToDrawio(diagramData: DiagramData): string {
    // Convert internal DiagramData format to Draw.io XML format
    const nodes = diagramData.nodes || [];
    const edges = diagramData.edges || [];

    // Create XML structure
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<mxfile host="app.diagrams.net" modified="' + new Date().toISOString() + '" version="20.3.0">\n';
    xml += '  <diagram name="Page-1" id="page1">\n';
    xml += '    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">\n';
    xml += '      <root>\n';
    xml += '        <mxCell id="0" />\n';
    xml += '        <mxCell id="1" parent="0" />\n';

    // Add nodes
    nodes.forEach(node => {
      const x = node.position?.x || 0;
      const y = node.position?.y || 0;
      const width = node.data?.properties?.width || 100;
      const height = node.data?.properties?.height || 50;
      const label = node.data?.label || '';
      const style = this.mapShapeToDrawio(node.data?.shapeId || 'basic-rectangle');

      xml += `        <mxCell id="${node.id}" value="${this.escapeXml(label)}" style="${style}" vertex="1" parent="1">\n`;
      xml += `          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />\n`;
      xml += '        </mxCell>\n';
    });

    // Add edges
    edges.forEach(edge => {
      const label = edge.data?.label || '';
      xml += `        <mxCell id="${edge.id}" value="${this.escapeXml(label)}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="${edge.source}" target="${edge.target}">\n`;
      xml += '          <mxGeometry relative="1" as="geometry" />\n';
      xml += '        </mxCell>\n';
    });

    xml += '      </root>\n';
    xml += '    </mxGraphModel>\n';
    xml += '  </diagram>\n';
    xml += '</mxfile>';

    return xml;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Shape mapping methods

  private mapLucidchartShape(lucidchartType: string): string {
    const mapping: Record<string, string> = {
      'Rectangle': 'basic-rectangle',
      'Circle': 'basic-circle',
      'Diamond': 'basic-diamond',
      'Triangle': 'basic-triangle',
      'Cylinder': 'basic-cylinder',
      'Cloud': 'basic-cloud',
      'Process': 'bpmn-task',
      'Decision': 'bpmn-gateway-exclusive',
      'StartEvent': 'bpmn-start-event',
      'EndEvent': 'bpmn-end-event'
    };
    return mapping[lucidchartType] || 'basic-rectangle';
  }

  private mapShapeToLucidchart(shapeId: string): string {
    const mapping: Record<string, string> = {
      'basic-rectangle': 'Rectangle',
      'basic-circle': 'Circle',
      'basic-diamond': 'Diamond',
      'basic-triangle': 'Triangle',
      'basic-cylinder': 'Cylinder',
      'basic-cloud': 'Cloud',
      'bpmn-task': 'Process',
      'bpmn-gateway-exclusive': 'Decision',
      'bpmn-start-event': 'StartEvent',
      'bpmn-end-event': 'EndEvent'
    };
    return mapping[shapeId] || 'Rectangle';
  }

  private mapDrawioShape(style: string): string {
    // Map Draw.io styles to internal shape types
    if (style.includes('ellipse')) return 'basic-circle';
    if (style.includes('rhombus')) return 'basic-diamond';
    if (style.includes('triangle')) return 'basic-triangle';
    if (style.includes('cylinder')) return 'basic-cylinder';
    if (style.includes('cloud')) return 'basic-cloud';
    if (style.includes('process')) return 'bpmn-task';
    if (style.includes('decision')) return 'bpmn-gateway-exclusive';
    if (style.includes('start')) return 'bpmn-start-event';
    if (style.includes('end')) return 'bpmn-end-event';
    return 'basic-rectangle'; // default
  }

  private mapShapeToDrawio(shapeType: string): string {
    const mapping: Record<string, string> = {
      'basic-rectangle': 'rounded=0;whiteSpace=wrap;html=1;',
      'basic-circle': 'ellipse;whiteSpace=wrap;html=1;',
      'basic-diamond': 'rhombus;whiteSpace=wrap;html=1;',
      'basic-triangle': 'triangle;whiteSpace=wrap;html=1;direction=north;',
      'basic-cylinder': 'cylinder;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;',
      'basic-cloud': 'cloud;whiteSpace=wrap;html=1;',
      'bpmn-task': 'rounded=0;whiteSpace=wrap;html=1;',
      'bpmn-gateway-exclusive': 'rhombus;whiteSpace=wrap;html=1;',
      'bpmn-start-event': 'ellipse;whiteSpace=wrap;html=1;',
      'bpmn-end-event': 'ellipse;whiteSpace=wrap;html=1;'
    };
    return mapping[shapeType] || 'rounded=0;whiteSpace=wrap;html=1;';
  }
}

// Export singleton instance
export const cloudDocumentManager = new CloudDocumentManager();
