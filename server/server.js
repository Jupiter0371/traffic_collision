const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use(express.json());
// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/author/:type', routes.author);
app.get('/random', routes.random);
app.get('/collisions_basics/:case_id', routes.collisions_basics);
app.get('/top_killed_injured', routes.top_killed_injured);
app.get('/:collision_info_type/:case_id', routes.collisionDetails);
app.post('/generate-query', routes.dynamicQuery);
app.post('/all_time_infor/:year/:month/:timeperiod',routes.all_time_infor);
app.post('/party_number_collision_type/:collisionType/:partyNumber',routes.party_num_type);
app.get('/time_infor_stats', routes.time_infor_stats);
app.get('/alcohol_involved_stats',routes.alcohol_involved_stats);
app.get('/Top10_collision_type', routes.Top10_collision_type);
app.get('/collision_type_victims',routes.collision_type_victims)




app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
