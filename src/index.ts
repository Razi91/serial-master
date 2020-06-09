import express from 'express';
import Serials from './interfaces/serials'

const app = express();

app.get('/', async(req, res) => {
    req;
    const list = await Serials.getPorts()
    res.send(list);
});
async function init() {
    const list = await Serials.getPorts()
    const port = list.find(i => i.productId == "2303")
    if (port == null) {
        throw new Error();
    }
    Serials.connect(port.path)
}
init()


app.listen(3000, () => console.log('Example app listening on port 3000!'));
