const route = require("express").Router();
const connection = require("./connection");

// Filter out sensitive info. You can add more filter-out field as fit.
present = (employees) => {
  return employees.map((e) => {
    const { hashedPassword, ...presentable } = e;
    return presentable;
  });
};

/*
Example:
  req.body.query { name: "Andy" }
*/

readMany = async (req, res, next) => {
  try {
    const { first_name } = req.body;
    if (!first_name)
      throw { httpCode: 500, message: "req.body.first_name is required!" };
    console.log("User request recieved.", `first_name: ${first_name}`);

    // DANGEROUS!
    // Generating query string directly base on user input can be injected!
    const queryString = `select * from employees where first_name like '%${first_name}%'`;

    connection.query(queryString, (error, results, _) => {
      if (error) return next(error);

      res.json({ data: present(results[0]) });
    });
    // return res.json({ data: present(rows) }); // row[0] is better! Just want to make this
  } catch (error) {
    next(error);
  }
};

/*
A typical readMany route. Response with target object 
*/
route.get("/employees", readMany);
module.exports = route;
