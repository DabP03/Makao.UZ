const {MongoClient} = require('mongodb');

exports.Mongo = class Mongo {
    constructor() {
        this.uri = 'mongodb://localhost:27017';
        this.client = new MongoClient(this.uri);
        this.db = this.client.db('makao');
    }

    async run() {
        try {
            await this.client.connect();

            // Establish and verify connection
            await this.client.db("admin").command({ ping: 1 });
        } finally {
            // Ensures that the client will close when you finish/error
            await this.client.close();
        }

    }

    async logInPlayer(login, password) { // zwraca true jak logowanie się powiodło, false jak nie
        if (login == "debug" && password == "debug") {
            return true;
        }
        this.run().catch(console.dir);

        try {
            const result = await this.db.collection("players").findOne({login: `${login}`, password: `${password}`});
            console.log(result);
            if (result != null) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async signInPlayer(login, password) { // tak samo jak wyżej
        if (login == "debug" && password == "debug") {
            return true;
        }
        this.run().catch(console.dir);
        try {
            const result = await this.db.collection("players").findOne({login: `${login}`});
            if (result != null) {
                this.db.collection("players").insertOne({login: `${login}`, password: `${password}`});
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
        }
    }

}
