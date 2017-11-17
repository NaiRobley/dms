module.exports = {
    // Test variables
    sampleAdmin: {
        username: 'sampleAdmin',
        password: 'sampleAdminPassword',
        email: 'sample@admin.com',
        role: 'admin',
        bio: 'A sample admin'
    },
    sampleNormal: {
        username: 'sampleNormal',
        password: 'sampleNormalPassword',
        email: 'sample@normal.com',
        role: 'normal',
        bio: 'A sample normal user'
    },
    samplePrivateDocument: {
        title: 'Sample private document',
        content: 'This is a sample private document for testing purposes',
        access: 'private'
    },
    samplePublicDocument: {
        title: 'Sample public document',
        content: 'This is a sample public document for testing purposes',
        access: 'public'
    },
    sampleAdminDocument: {
        title: 'Sample admin document',
        content: 'This is a sample role document for testing purposes',
        access: 'admin'
    },
    sampleAdminDocumentA: {
        title: 'Sample Admin Document A',
        content: 'The content for sample admin document a',
        access: 'public'
    },
    sampleAdminDocumentB: {
        title: 'Sample Admin Document B',
        content: 'The content for sample admin document b',
        access: 'private'            
    }
};