const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennkey with your own
  const name = 'Group 19';
  const pennkey = 'GROUP 19';

  // checks the value of type in the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.json({ name: name });
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back a JSON response with the pennkey
    res.json({ pennkey: pennkey });
  } else {
    res.status(400).json({});
  }
}

// 1: GET /random
// day = systems day
const random = async function(req, res) {
  // Get the current date
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // JavaScript months are zero-indexed, SQL months are not
  const currentDay = today.getDate();
  connection.query(`
  SELECT *
  FROM collisions_basics cb
  JOIN collisions_location cl ON cb.case_id = cl.case_id
  JOIN collisions_environment ce ON cb.case_id = ce.case_id
  JOIN collisions_details cd ON cb.case_id = cd.case_id
  WHERE cb.case_id >= (SELECT FLOOR(MAX(case_id) * RAND()) FROM collisions_basics)
  AND MONTH(cb.collision_timestamp) = ? AND DAY(cb.collision_timestamp) = ?
  ORDER BY cb.case_id
  LIMIT 1;

  `, [currentMonth, currentDay],(err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/
//2: GET /collisions_basics/:case_id
const collisions_basics = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Hint: unlike route 2, you can directly SELECT * and just return data[0]
  // Most of the code is already written for you, you just need to fill in the query
  connection.query(`
    SELECT *
    FROM collisions_basics
    WHERE case_id = '${req.params.case_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}


/************************
 * ADVANCED INFO ROUTES *
 ************************/

// 3: GET /top_killed_injured
const top_killed_injured = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ? req.query.page_size : 10;

  if (!page) {//check if the variable page is "falsy"(not defined)
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
    SELECT case_id,
           collision_timestamp,
           killed_victims+injured_victims AS num_of_killed_injured           
    FROM collisions_basics 
    ORDER BY num_of_killed_injured DESC
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
     // replace this with your implementation
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    // return only 10 records, start on record 16 (OFFSET 15)
    // LIMIT 10 OFFSET 15
    const offset = (page - 1) * pageSize;
    connection.query(`
    SELECT case_id,
           collision_timestamp,
           killed_victims+injured_victims AS num_of_killed_injured           
    FROM collisions_basics 
    ORDER BY num_of_killed_injured DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
  }
}

//4. /collisions_basics
const collisionDetails = function(req, res) {
  const { collision_info_type, case_id } = req.params;

  const validTables = ['collisions_basics', 'collisions_location', 'collisions_environment', 'collisions_details'];
  if (!validTables.includes(collision_info_type)) {
      return res.status(400).json({ error: 'Invalid table specified' });
  }

  const query = `
      SELECT *
      FROM ${collision_info_type}
      WHERE case_id = ?;
  `;

  connection.query(query, [case_id], (err, data) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      if (data.length === 0) {
          return res.status(404).json({ error: 'No data found' });
      }
      res.json(data[0]);
  });
};

const dynamicQuery = (req, res) => {
  const { weatherConditions, roadConditions, lightingConditions } = req.body;

  let whereConditions = ['(cb.killed_victims > 0 OR cb.injured_victims > 0)'];

  if (weatherConditions) {
    whereConditions.push(`ce.weather_1 = '${weatherConditions}'`);
  }
  if (roadConditions) {
    whereConditions.push(`ce.road_surface = '${roadConditions}'`);
  }
  if (lightingConditions) {
    whereConditions.push(`ce.lighting = '${lightingConditions}'`);
  }

  const sqlQuery = `
    SELECT
      ce.weather_1, 
      ce.road_surface, 
      ce.lighting,
      COUNT(DISTINCT cb.case_id) AS total_accidents,
      AVG(cb.killed_victims + cb.injured_victims) AS avg_victims_per_accident,
      SUM(CASE WHEN cd.alcohol_involved = 1 THEN 1 ELSE 0 END) / COUNT(cb.case_id) AS proportion_with_alcohol,
      COUNT(DISTINCT CASE WHEN p.party_age < 25 THEN cb.case_id END) AS accidents_involving_young_drivers,
      COUNT(DISTINCT CASE WHEN p.party_age < 25 THEN cb.case_id END)/COUNT(DISTINCT cb.case_id) AS young_driver_accident_percentage
    FROM collisions_environment ce
    JOIN collisions_details cd ON ce.case_id = cd.case_id
    JOIN collisions_basics cb ON ce.case_id = cb.case_id
    JOIN parties p ON cb.case_id = p.case_id
    WHERE ${whereConditions.join(' AND ')}
    GROUP BY ce.weather_1, ce.road_surface, ce.lighting
    ;
  `;

  connection.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    res.json(results[0]); 
  });
};





//5.GET /all_time_infor/:year/:month/:timeperiod
const all_time_infor = function(req, res) {
  // Correctly using req.params
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  const timeperiod = req.params.timeperiod.toLowerCase();
  // Validate the year, month, and timePeriod
  if (![2019, 2020, 2021].includes(year) ||
      ![1,2,3,4,5,6,7,8,9,10,11,12].includes(month) ||
      !['early_morning', 'morning', 'afternoon', 'evening', 'night'].includes(timeperiod)) {
    return res.status(400).json({ error: 'Invalid parameters' });
 
 
  }
  const query = `
    WITH TimeCategorized AS (
      SELECT
          case_id,
          collision_timestamp,
          CASE
              WHEN HOUR(collision_timestamp) BETWEEN 6 AND 8 THEN 'early_morning'
              WHEN HOUR(collision_timestamp) BETWEEN 9 AND 11 THEN 'morning'
              WHEN HOUR(collision_timestamp) BETWEEN 12 AND 14 THEN 'afternoon'
              WHEN HOUR(collision_timestamp) BETWEEN 15 AND 17 THEN 'evening'
              ELSE 'night'
          END AS time_period
      FROM
          collisions_basics
    )
    SELECT
        cb.case_id,
        cb.collision_timestamp,
        cb.killed_victims,
        cb.injured_victims,
        cb.party_count,
        cl.county_location,
        ce.weather_1,
        ce.road_surface,
        ce.road_condition_1,
        ce.lighting,
        cd.primary_collision_factor,
        cd.type_of_collision,
        cd.motor_vehicle_involved_with,
        cd.alcohol_involved,
        cd.pedestrian_killed_count,
        cd.pedestrian_injured_count,
        cd.bicyclist_killed_count,
        cd.bicyclist_injured_count,
        cd.motorcyclist_killed_count,
        cd.motorcyclist_injured_count,
        p.party_number,
        tc.time_period
    FROM TimeCategorized tc
    JOIN collisions_basics cb ON tc.case_id = cb.case_id
    JOIN collisions_location cl ON cb.case_id = cl.case_id
    JOIN collisions_environment ce ON cb.case_id = ce.case_id
    JOIN collisions_details cd ON cb.case_id = cd.case_id
    JOIN (
        SELECT case_id, MAX(party_number) AS max_party_number
        FROM parties
        GROUP BY case_id
    ) max_p ON cb.case_id = max_p.case_id
    JOIN parties p ON p.case_id = max_p.case_id AND p.party_number = max_p.max_party_number
    WHERE YEAR(cb.collision_timestamp) = ${year}
    AND cb.collision_timestamp IS NOT NULL
    AND MONTH(cb.collision_timestamp) = ${month}
    AND tc.time_period = '${timeperiod}';
  `;
 
 
  connection.query(query, [year, month, timeperiod], (err, data) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    res.json(data);
  });
 };

 //6. GET /party_number_collition_type/:collition_type/:party_number
 const party_num_type = async function(req, res) {
  //const party_number = parseInt(req.params.party_number)
  //const collition_type = req.params.collition_type
console.log(req.body)
const {collisionType, partyNumber} = req.body;

  connection.query(`
  SELECT DISTINCT cb.case_id, cb.collision_timestamp, ce.lighting, ce.road_condition_1, ce.road_surface, cb.injured_victims, cb.killed_victims
  FROM collisions_basics cb
  JOIN collisions_details cd ON cb.case_id = cd.case_id
  JOIN collisions_environment ce ON ce.case_id = cb.case_id
  WHERE cd.type_of_collision = '${collisionType}' AND cb.party_count = ${partyNumber}
  ORDER BY collision_timestamp
  `,(err, data) => {
    if (err) {
      console.error('Database error:', err);
      // return res.status(500).json({ error: 'Internal server error' });
      return res.json([partyNumber, collisionType]);
  }
  if (data.length === 0) {
      return res.status(404).json({ error: 'No data found' });
  }
  res.json(data);
});
};


// 7. GET /time_infor_stats
// Assuming this function is in a file that handles routes, e.g., 'routes.js'
const time_infor_stats = function(req, res) {
  const groupBy = req.query.groupBy || 'year';  // Default to grouping by year if not specified

  // Define valid grouping columns
  const validGroupByColumns = ['year', 'month', 'time_period'];
  const sqlColumnMap = {
    year: 'YEAR(cb.collision_timestamp)',
    month: 'MONTH(cb.collision_timestamp)',
    time_period: `CASE
                    WHEN HOUR(cb.collision_timestamp) BETWEEN 6 AND 8 THEN 'early_morning'
                    WHEN HOUR(cb.collision_timestamp) BETWEEN 9 AND 11 THEN 'morning'
                    WHEN HOUR(cb.collision_timestamp) BETWEEN 12 AND 14 THEN 'afternoon'
                    WHEN HOUR(cb.collision_timestamp) BETWEEN 15 AND 17 THEN 'evening'
                    ELSE 'night'
                  END`
  };
  
  if (!validGroupByColumns.includes(groupBy)) {
    return res.status(400).json({ error: 'Invalid group by column specified' });
  }
  
  // Initialize the WHERE clause depending on the groupBy parameter
  let whereClause = '';
  if (groupBy === 'year' || groupBy === 'month') {
    whereClause = `WHERE ${sqlColumnMap[groupBy]} IS NOT NULL`;
  }
  
  let query = `
  SELECT
    ${sqlColumnMap[groupBy]} AS ${groupBy},
    COUNT(cb.case_id) AS total_cases,
    SUM(cb.killed_victims) AS total_killed_victitms,
    SUM(cb.injured_victims) AS total_injured_victims,
    SUM(cd.pedestrian_killed_count) AS total_pedestrian_killed,
    SUM(cd.pedestrian_injured_count) AS total_pedestrian_injured,
    SUM(cd.bicyclist_killed_count) AS total_bicyclist_killed,
    SUM(cd.bicyclist_injured_count) AS total_bicyclist_injured,
    SUM(cd.motorcyclist_killed_count) AS total_motorcyclist_killed,
    SUM(cd.motorcyclist_injured_count) AS total_motorcyclist_injured
  FROM
    collisions_basics cb
  JOIN
    collisions_details cd ON cb.case_id = cd.case_id
  ${whereClause}
  GROUP BY
    ${sqlColumnMap[groupBy]}
  `;
  
  
  

  // Execute the query
  connection.query(query, (err, data) => {
      if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ error: 'Internal server error', details: err.message });
      }
      if (data.length === 0) {
          return res.status(404).json({ error: 'No data found' });
      }
      res.json(data);
  });
};



 
 //8.GET /alcohol_involved_stats
const alcohol_involved_stats = function(req, res) {
  const query =`
   SELECT
   cl.county_location,
   SUM(cd.alcohol_involved) AS total_alcohol_involved,
   COUNT(cb.case_id) AS total_collisions,
   SUM(cb.killed_victims) AS total_killed_victims,
   AVG(p.party_age) AS average_party_age,
   SUM(cb.injured_victims) AS total_injured_victims,
   SUM(cd.pedestrian_killed_count) AS total_pedestrian_killed,
   SUM(cd.pedestrian_injured_count) AS total_pedestrian_injured,
   SUM(cd.bicyclist_killed_count) AS total_bicyclist_killed,
   SUM(cd.bicyclist_injured_count) AS total_bicyclist_injured,
   SUM(cd.motorcyclist_killed_count) AS total_motorcyclist_killed,
   SUM(cd.motorcyclist_injured_count) AS total_motorcyclist_injured,
   SUM(p.party_number_killed) AS total_party_killed,
   SUM(p.party_number_injured) AS total_party_injured,
   (SUM(p.party_number_killed) / COUNT(cb.case_id)) * 100 AS percentage_party_killed,
   (SUM(p.party_number_injured) / COUNT(cb.case_id)) * 100 AS percentage_party_injured
 FROM
   collisions_basics cb
 INNER JOIN
   collisions_details cd ON cb.case_id = cd.case_id
 INNER JOIN
   collisions_location cl ON cb.case_id = cl.case_id
 LEFT JOIN
   parties p ON cb.case_id = p.case_id
 GROUP BY
   cl.county_location
 ORDER BY
   total_collisions DESC;
`;


connection.query(query, (err, data) => {
 if (err) {
   console.error('Database error:', err);
   // return res.status(500).json({ error: 'Internal server error' });
   return res.json([month])
 }
 if (data.length === 0) {
   return res.status(404).json({ error: 'No data found' });
 }
 res.json(data);
});
};




//9.GET /Top10_collision_type
const Top10_collision_type = async function(req, res) {
  connection.query(`
  SELECT
    cd.type_of_collision,
    cb.party_count
FROM
    collisions_basics cb
JOIN
    collisions_details cd
    ON cb.case_id = cd.case_id
ORDER BY
    cb.party_count DESC
LIMIT 10;
  `,(err, data) => {
    if (err) {
      // console.error('Database error:', err);
      //return res.status(500).json({ error: 'Internal server error' });
      return res.json([collition_type]);
  }
  if (data.length === 0) {
      return res.status(404).json({ error: 'No data found' });
  }
  res.json(data);
});
};

//10. GET /collision_type_victims
const collision_type_victims = async function(req, res) {
  connection.query(`
  -- Assuming appropriate indexes on 'case_id' and 'victim_role' for tables 'collisions_basics' and 'victims'

WITH CaseDetails AS (
    SELECT 
        Cb.case_id, 
        CD.type_of_collision,
        SUM(CASE WHEN v.victim_role = 'driver' THEN 1 ELSE 0 END) AS num_driver_injured,
        SUM(CASE WHEN v.victim_role = 'passenger' THEN 1 ELSE 0 END) AS num_passenger_injured
    FROM 
        collisions_basics Cb
    JOIN 
        victims v ON Cb.case_id = v.case_id
    JOIN 
        collisions_details CD ON CD.case_id = Cb.case_id
    WHERE 
        CD.type_of_collision IN ('broadside', 'head-on', 'hit object', 'other', 'overturned', 'pedestrian', 'rear end', 'sideswipe')
    GROUP BY 
        Cb.case_id, CD.type_of_collision
)
SELECT 
    type_of_collision,
    AVG(num_driver_injured) AS Average_Driver_Injured,
    AVG(num_passenger_injured) AS Average_Passenger_Injured
FROM 
    CaseDetails
GROUP BY 
    type_of_collision;

  `,(err, data) => {
    if (err) {
      // console.error('Database error:', err);
      //return res.status(500).json({ error: 'Internal server error' });
      return res.json([]);
  }
  if (data.length === 0) {
      return res.status(404).json({ error: 'No data found' });
  }
  res.json(data);
});
};


module.exports = {
  author,
  random,
  collisions_basics,
  top_killed_injured,
  collisionDetails,
  dynamicQuery,
  all_time_infor,
  party_num_type,
  time_infor_stats,
  alcohol_involved_stats,
  Top10_collision_type,
  collision_type_victims,
}
