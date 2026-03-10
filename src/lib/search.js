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

            // Track paragraph index within each volume (must match ManuscriptView.jsx logic)
            let paragraphIndexInVolume = 0;

            for (const chapter of chapters) {
                // Add title as a paragraph (to match ManuscriptView structure)
                const titlePara = chapter.title;
                this.paragraphs.push({
                    id: this.paragraphs.length,
                    bookTitle: bookKey,
                    volumeId,
                    chapterTitle: chapter.title,
                    content: titlePara,
                    normalizedContent: normalize(titlePara),
                    preview: titlePara.substring(0, 150) + (titlePara.length > 150 ? '...' : ''),
                    paragraphIndex: paragraphIndexInVolume,
                    isTitle: true
                });
                paragraphIndexInVolume++;

                // Split content paragraphs - must match ManuscriptView.jsx exactly
                const paragraphs = chapter.content.split('\n').filter(p => p.trim() !== '');

                for (let i = 0; i < paragraphs.length; i++) {
                    const para = paragraphs[i];
                    this.paragraphs.push({
                        id: this.paragraphs.length,
                        bookTitle: bookKey,
                        volumeId,
                        chapterTitle: chapter.title,
                        content: para,
                        normalizedContent: normalize(para),
                        preview: para.substring(0, 150) + (para.length > 150 ? '...' : ''),
                        paragraphIndex: paragraphIndexInVolume,
                        isTitle: false
                    });
                    paragraphIndexInVolume++;
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

        // Sort by: 1) content paragraphs first, 2) number of matching terms
        results.sort((a, b) => {
            // Prefer content over titles
            if (a.isTitle && !b.isTitle) return 1;
            if (!a.isTitle && b.isTitle) return -1;
            
            // Then sort by relevance (number of term matches)
            const aScore = terms.reduce((acc, term) => acc + (a.normalizedContent.split(term).length - 1), 0);
            const bScore = terms.reduce((acc, term) => acc + (b.normalizedContent.split(term).length - 1), 0);
            return bScore - aScore;
        });

        return results.slice(0, 20);
    }
}

// Export a singleton instance
export const librarySearch = new SearchEngine();
