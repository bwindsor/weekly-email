import app from './app'

let port = process.env.PORT || 3000

app.listen(port, 'localhost', () => {
    console.log("Listening on port " + port)
});