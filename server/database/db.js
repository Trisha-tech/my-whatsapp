import mongoose from 'mongoose';

//6BFdVIYrJQkh1dKi    -----Mongodb Password 1 Jan 2023

const Connection = async (username, password) => {
   // const URL = `mongodb://${username}:${password}@chatapp-shard-00-00.1lequ.mongodb.net:27017,chatapp-shard-00-01.1lequ.mongodb.net:27017,chatapp-shard-00-02.1lequ.mongodb.net:27017/WHATSAPPCLONE?ssl=true&replicaSet=atlas-78i8sb-shard-0&authSource=admin&retryWrites=true&w=majority`;
    const URL=`mongodb+srv://${username}:${password}@my-whatsapp.thbrfei.mongodb.net/?retryWrites=true&w=majority`
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Database Connected Succesfully');
    } catch(error) {
        console.log('Error: ', error.message);
    }

};
 
export default Connection;