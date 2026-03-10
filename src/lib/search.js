import { LIBROS } from '../data/libros';

// Normalizes a text: lowercase, remove accents 
function normalize(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

class SearchEngine {
    constructor() {
        this.paragraphs = [];
        this.isIndexed = false;
    }

    init() {
        if (this.isIndexed) return;

        console.log('Building search index...');

        for (const [bookKey, chapters] of Object.entries(LIBROS)) {
            const volumeMatch = bookKey.match(/Maestros (\d+)/i);
            const volumeId = volumeMatch ? volumeMatch[1] : '';

            for (const chapter of chapters) {
                const paragraphs = chapter.content.split('\n').filter(p => p.trim().length > 20);

                for (let i = 0; i < paragraphs.length; i++) {
                    const para = paragraphs[i];
                    this.paragraphs.push({
                        id: this.paragraphs.length,
                        bookTitle: bookKey,
                        volumeId,
                        chapterTitle: chapter.title,
                        content: para,
                        normalizedContent: normalize(para),
                        preview: para.substring(0, 150) + (para.length > 150 ? '...' : '')
                    });
                }
            }
        }

        this.isIndexed = true;
        console.log(`Search index built: ${this.paragraphs.length} paragraphs indexed.`);
    }

    search(query) {
        if (!this.isIndexed) {
            this.init();
        }

        if (!query || query.trim() === '') return [];

        const terms = normalize(query).split(/\s+/).filter(t => t.length > 2);
        if (terms.length === 0) return [];

        const results = this.paragraphs.filter(para => {
            // All terms must appear in the paragraph
            return terms.every(term => para.normalizedContent.includes(term));
        });

        // Sort by number of matching terms (more matches = more relevant)
        results.sort((a, b) => {
            const aScore = terms.reduce((acc, term) => acc + (a.normalizedContent.split(term).length - 1), 0);
            const bScore = terms.reduce((acc, term) => acc + (b.normalizedContent.split(term).length - 1), 0);
            return bScore - aScore;
        });

        return results.slice(0, 20);
    }
}

// Export a singleton instance
export const librarySearch = new SearchEngine();
