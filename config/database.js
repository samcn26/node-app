// env
if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongoURL: "mongodb+srv://sam:<password>@test-node-app-ellg3.mongodb.net/test?retryWrites=true"
    }
} else {
    module.exports = {
        mongoURL: "mongodb://mongodb/node-app"
    }
}