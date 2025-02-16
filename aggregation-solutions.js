// MongoDB Playground

// The current database to use.
use("aggregation-pipeline-demo"); // Name of the database to use

/* --------------- Question 1: How many users are active? --------------- */
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

/* ---------------  Question 2: What is the average age of all users? --------------- */
db.users.aggregate([
  {
    $group: {
      _id: null, // Groups all the documents into a single group
      averageAge: {
        $avg: "$age", // Calulate the average age of the above grouped document
      },
    },
  },
]);

/* --------------- Question 3: List the top 5 most common favorite fruits among all users --------------- */
db.users.aggregate([
  {
    $group: {
      _id: "$favoriteFruit", // Groups all the documents based on different favorites fruits
      count: {
        $sum: 1, // Calculate the sum of each favorite fruit
      },
    },
  },
  {
    $sort: {
      count: -1, // Sort the documents in descending order ( $sort key ordering must be 1 (for ascending) or -1 (for descending))
    },
  },
  {
    $limit: 5, // Limit the list to 5, as we need the top 5
  },
]);

/* --------------- Question 4: Find the total number of males and females --------------- */
db.users.aggregate([
  {
    $group: {
      _id: "$gender",
      genderCount: {
        $sum: 1,
      },
    },
  },
]);
