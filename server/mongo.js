const {MongoClient} = require('mongodb');
const {UserData} = require('./user');
const settings = require('../serverConfig.json');

exports.Mongo = class Mongo {
    constructor(uri) {
        this.uri = uri;
        this.client = new MongoClient(this.uri);
        this.db = this.client.db('makao');
        if (settings.createCollections) { // tworzy kolekcje jeżeli createCollections w serverConfig jest true
            this.createCollections();
        }
        
    }

    async createCollections() { 
        try {
            await this.client.connect();
            await this.db.createCollection("users");
            await this.db.createCollection("userData");
        } catch (error) {
            console.error(error);
        } finally {
            await this.client.close();
        }
    }

    async logInPlayer(login, password) { // zwraca userData jak logowanie się powiodło, null jak nie
        if (login == "debug" && password == "debug") {
            return new UserData("debug");
        }
        try {
            await this.client.connect();
            const result = await this.db.collection("users").findOne({
                login: `${login}`,
                password: `${password}`
            });
            console.log(result);
            if (result != null) {
                return await this.db.collection("userData").findOne({
                    login: `${result.login}`
                });
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
        } finally {
            await this.client.close();
        }
    }

    async signInPlayer(login, password) { // tak samo jak wyżej tylko że true i false
        if (login == "debug" && password == "debug") {
            return true;
        }
        try {
            await this.client.connect();
            const result = await this.db.collection("users").findOne({
                login: `${login}`
            });
            if (result != null) {
                await this.db.collection("users").insertOne({
                    login: `${login}`,
                    password: `${password}`
                });
                await this.db.collection("userData").insertOne(new UserData(login));
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

    async setPlayerInfo(user) { // zwraca false jak nie znajdzie usera, jakby ktoś cos pomieszał z loginem
        const userData = new UserData(user);
        try {
            await this.client.connect();
            const result = await this.db.collection("userData").findOne({login: `${userData.login}`});
            if (result != null) {
                await this.db.collection("userData").updateOne(
                    { login: `${userData.login}` },
                    { $set: userData }
                );
                console.log(`${user.login} has been updated`);
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
}
