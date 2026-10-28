
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

const products = require('./data.json');

app.get('/', (req, res) => {
    res.send('服务器运行成功, 试试加上 /search');
});

app.get('/search', (req, res) => {
    try {
        const min = parseFloat(req.query.min) || 0;
        const max = parseFloat(req.query.max) || 99999;
        const category = req.query.category || '';          
        const rating = parseFloat(req.query.rating) || 3.5; 

        const realdata = products.filter(item => {
            const matchPrice = item.price >= min && item.price <= max;
            const matchCategory = category === '' || item.category === category;
            const matchRating = item.rating.rate >= rating;
            return matchPrice && matchCategory && matchRating;
        });

        res.json({
            message: `我们找到了 ${realdata.length} 件商品`,
            filters: { min, max, category, rating },
            data: realdata
        });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误, 请稍后再试~' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`服务器已启动~ 正在监听端口: ${PORT}`);
});