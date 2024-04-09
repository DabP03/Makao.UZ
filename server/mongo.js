const {MongoClient} = require('mongodb');
const {UserData} = require('./user');

exports.Mongo = class Mongo {
    constructor(uri) {
        this.uri = uri;
        this.client = new MongoClient(this.uri);
        this.db = this.client.db('makao');
    }

    // async run() {
    //     try {
    //         await this.client.connect();

    //     } finally {
    //         // Ensures that the client will close when you finish/error
    //         await this.client.close();
    //     }

    // }

    async logInPlayer(login, password) { // zwraca true jak logowanie się powiodło, false jak nie
        if (login == "debug" && password == "debug") {
            return true;
        }
        try {
            await this.client.connect();
            const result = await this.db.collection("users").findOne({login: `${login}`, password: `${password}`});
            console.log(result);
            if (result != null) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
        } finally {
            await this.client.close();
        }
    }

    async signInPlayer(login, password) { // tak samo jak wyżej
        if (login == "debug" && password == "debug") {
            return true;
        }
        try {
            await this.client.connect();
            const result = await this.db.collection("users").findOne({login: `${login}`});
            if (result != null) {
                this.db.collection("users").insertOne({login: `${login}`, password: `${password}`});
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
        } finally {
            await this.client.close();
        }
    }

    // async getPlayerInfo(login) { // zwraca obiekt user
    //     this.run().catch(console.dir);
    //     try {
    //         return await this.db.collection("userData").findOne({login: `${login}`});
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    async setPlayerInfo(user) { // zwraca false jak nie znajdzie usera, jakby ktoś cos pomieszał z loginem
        const userData = new UserData(user);
        console.log(user);
        console.log(userData);
        try {
            await this.client.connect();
            const result = await this.db.collection("userData").findOne({login: `${userData.login}`});
            if (result != null) {
                await this.db.collection("userData").updateOne(
                    { login: `${userData.login}` },
                    { $set: userData }
                );
                console.log(JSON.stringify(userData.games));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
        } finally {
            await this.client.close();
        }
    }

    // async incrementUserWins(user) { // pisze do bazy danych, jak trzeba bez wysyłąnia do bazy to na userze
    //     user.incrementUserWins();
    //     await this.setPlayerInfo(user);
    // }

    // async incrementUserLoses(user) {
    //     user.incrementUserLoses();
    //     await this.setPlayerInfo(user);
    // }


}
