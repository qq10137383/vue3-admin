export type MimeType = 'jpg' | 'png' | 'gif' | 'svg' | 'psd'

const mimes: Record<MimeType, string> = {
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'psd': 'image/photoshop'
};

export default mimes