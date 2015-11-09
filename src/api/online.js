import { join } from 'path';
import { Router } from 'express';

const router = new Router();

router.get('/', async (req, res, next) => {
    res.status(200).send('online');
    return;
});

export default router;

