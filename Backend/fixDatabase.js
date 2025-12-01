const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function fixDatabaseIndexes() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check the usersignupmodels collection specifically
        const collection = mongoose.connection.collection('usersignupmodels');
        
        const indexes = await collection.getIndexes();
        console.log('\n📊 usersignupmodels collection indexes:', Object.keys(indexes));

        // Drop password indexes if they exist
        for (const [indexName, indexSpec] of Object.entries(indexes)) {
            console.log(`Index: ${indexName}`, indexSpec);
            if (indexName.includes('password') && indexName !== '_id_') {
                try {
                    await collection.dropIndex(indexName);
                    console.log(`✅ Dropped index: ${indexName}`);
                } catch (err) {
                    console.log(`⚠️ Could not drop ${indexName}: ${err.message}`);
                }
            }
        }

        console.log('\n✅ Database index check completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixDatabaseIndexes();
