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
        const documents = await collection.find({}).toArray();
        return documents;
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
}
async function addNewCompany(newCompany) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        console.log("New Company",newCompany)
        // Assume newCompany has a unique identifier, like companyName
        const query = { _id: newCompany._id, name: newCompany.name};

        // Update operation
        const update = {
            $push: {
                ratings: newCompany.ratings[0],
            },
        };

        // Upsert option
        const options = { upsert: true };

        const result = await collection.updateOne(query, update, options);
        console.log(result);
        return result;
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
}
module.exports = {
    getAllDocuments,
    addNewCompany
};

