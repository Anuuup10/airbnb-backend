// Fake Database
const registeredHomes = [];

module.exports = class Home{
    constructor(houseName, price, location, rating, photoUrl, description){
        this.houseName = houseName;
        this.price = price;
        this.location = location;
        this.rating = rating;
        this.photoUrl = photoUrl;
        this.description = description;
    }

    save(){
        registeredHomes.push(this);
    }

    static fetchAll(){
        return registeredHomes;
    }
}