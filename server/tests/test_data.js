// Test data
module.exports = {
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
    samplePrivateDocumentA: {
        title: 'Sample private document A',
        content: 'This is a sample private document A for testing purposes',
        access: 'private'
    },
    samplePrivateDocumentB: {
        title: 'Sample private document B',
        content: 'This is a sample private document B for testing purposes',
        access: 'private'
    },    
    samplePublicDocumentA: {
        title: 'Sample public document A',
        content: 'This is a sample public document A for testing purposes',
        access: 'public'
    },
    samplePublicDocumentB: {
        title: 'Sample public document B',
        content: 'This is a sample public document B for testing purposes',
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