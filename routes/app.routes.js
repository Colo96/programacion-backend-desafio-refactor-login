const { Router } = require('express');
const router = Router();
const viewsRoutes = require('./views/views.routes');
const sessionsRoutes = require('./sessions/sessions.routes');

router.use('/', viewsRoutes);
router.use('/api/sessions', sessionsRoutes);


module.exports = router;