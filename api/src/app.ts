import express, { Request, Response } from 'express'

const app = express();

app.use(express.json());

app.route('/')
.get((req: Request, res: Response) => {
    return res.send("You make a GET request");
})
.post((req: Request, res: Response) => {
    return res.send("You make a POST request");
})
.put((req: Request, res: Response) => {
    return res.send("You make a PUT request");
})
.all((req: Request, res: Response) => {
    return res.send("You make a X request");
})

app.get('/', (req, res) => {
    return res.send('Hello world');
});

const port = process.env.port || 5000;

app.listen(port, () => {
    console.log(`Application listening on port ${port}`)
});

app.post('/api/data', (req, res) => {
    return res.sendStatus(200);
});