import { Document } from 'flexsearch';
import { LIBROS } from '../data/libros';

class SearchEngine {
    constructor() {
        this.index = new Document({
            document: {
                id: 'id',
                index: ['content', 'title'],
                store: ['bookTitle', 'volumeId', 'chapterTitle', 'content', 'preview']
            },
            tokenize: 'full',
            resolution: 9,
            async: true
        });
        this.isIndexed = false;
        this.isIndexing = false;
    }

    async init() {
        if (this.isIndexed || this.isIndexing) return;
        this.isIndexing = true;
        
        console.log("Building search index... (This might take a moment)");
        let globalId = 0;

        for (const [bookKey, chapters] of Object.entries(LIBROS)) {
            // Extract volume from "Vida y Enseñanzas de los Maestros X"
            const volumeMatch = bookKey.match(/Maestros (\d+)/i);
            const volumeId = volumeMatch ? volumeMatch[1] : '';

            for (const chapter of chapters) {
                // Split chapter content into reasonable chunks (paragraphs)
                const paragraphs = chapter.content.split('\n').filter(p => p.trim() !== '');
                
                for (let i = 0; i < paragraphs.length; i++) {
                    const para = paragraphs[i];
                    
                    if (para.length < 20) continue; // Skip very short garbled lines
                    
                    await this.index.addAsync({
                        id: globalId++,
                        bookTitle: bookKey,
                        volumeId: volumeId,
                        chapterTitle: chapter.title,
                        content: para,
                        preview: para.substring(0, 150) + (para.length > 150 ? '...' : '')
                    });
                }
            }
        }
        
        this.isIndexed = true;
        this.isIndexing = false;
        console.log("Search index built successfully.");
    }

    async search(query) {
        if (!this.isIndexed) {
            await this.init();
        }

        const rawResults = await this.index.searchAsync(query, {
            enrich: true,
            limit: 20
        });

        if (!rawResults || rawResults.length === 0) return [];

        // FlexSearch returns results grouped by index field. We want to flatten and deduplicate.
        const deduplicatedResults = new Map();

        rawResults.forEach(fieldResult => {
            fieldResult.result.forEach(item => {
                if (!deduplicatedResults.has(item.id)) {
                    deduplicatedResults.set(item.id, item.doc);
                }
            });
        });

        return Array.from(deduplicatedResults.values());
    }
}

// Export a singleton instance
export const librarySearch = new SearchEngine();
