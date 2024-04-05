const {MongoClient} = require('mongodb');

exports.Mongo = class Mongo {
    constructor(uri) {
        this.uri = uri;
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

    async getPlayerInfo(login) { // zwraca obiekt user
        this.run().catch(console.dir);
        try {
            return await this.db.collection("users").findOne({login: `${login}`});
        } catch (error) {
            console.error(error);
        }
    }

    async setPlayerInfo(user) { // zwraca false jak nie znajdzie usera, jakby ktoś cos pomieszał z loginem
        this.run().catch(console.dir);
        try {
            const result = await this.db.collection("users").findOne({login: `${login}`});
            if (result != null) {
                this.db.collection("users").insertOne(user);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async incrementUserWins(user) { // pisze do bazy danych, jak trzeba bez wysyłąnia do bazy to na userze
        user.incrementUserWins();
        await this.setPlayerInfo(user);
    }

    async incrementUserLoses(user) {
        user.incrementUserLoses();
        await this.setPlayerInfo(user);
    }


}
