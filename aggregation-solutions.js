// MongoDB Playground

// The current database to use.
use("aggregation-pipeline-demo"); // Name of the database to use

// Question 1: How many users are active?
db.users.aggregate([
  // Stage 1: Filter out the users that are active
  {
    $match: {
      isActive: true,
    },
  },
  // Stage 2: Count the no of user docs from stage 1
  {
    $count: "Active Users", // String value can be changed
  },
]);
