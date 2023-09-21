const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema);

const writeUser = async (username, password) => {
    try {
        let hashedPassword = await bcrypt.hash(password, 10);

        let user = new User({
            username: username,
            password: hashedPassword
        })

        await user.save();
        console.log('saved successfuly!');
    } catch (err) {
        console.log(err);
    }

}

const validateUser = async (username, password) => {
    try {
        let user = await User.findOne({ username });

        if (user === null) {
            console.log('user does not exist');
            return false;
        }

        user = user.toObject();

        let isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) return true;
        else return false;

    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    writeUser,
    validateUser,
    User
};