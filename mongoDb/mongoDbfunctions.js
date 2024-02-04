const { MongoClient } = require('mongodb');


const dbName = 'companies'; // Replace with your database name
const collectionName = 'companies'; // Replace with your collection name
const uri = "mongodb://root:example@localhost:27017/"; // Replace with your MongoDB URI
async function getAllDocuments() {

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        var query = { "name": "Company XYZ" };
        const documents = await collection.find(query).toArray();
        return documents;
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
}
module.exports = {
    getAllDocuments
};

