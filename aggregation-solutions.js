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
      _id: "$gender", // Groups all the documents into groups based on the gender
      genderCount: {
        $sum: 1, // Calculate the sum of each gender count
      },
    },
  },
]);

/* --------------- Question 5: Which country has the highest number of registered users? --------------- */
db.users.aggregate([
  {
    $group: {
      _id: "$company.location.country", // Groups all the documents based on different countries
      usersCount: {
        $sum: 1, // Calculate the sum of users in each country
      },
    },
  },
  {
    $sort: {
      usersCount: -1, // Sort the documents in descending order ( $sort key ordering must be 1 (for ascending) or -1 (for descending))
    },
  },
  {
    $limit: 1, // Limit the list to 1, as we need the country with the highest number of users
  },
]);

/* --------------- Question 6: List all unique eye colors present in the collection --------------- */
db.users.aggregate([
  {
    $group: {
      _id: "$eyeColor", // Group all documents based on the eye color
    },
  },
]);

/* --------------- Question 7: What is the average number of tags per user? --------------- */
// Solution 1: Using unwind method
db.users.aggregate([
  {
    $unwind: "$tags", // Deconstruct the tags array, creating a new document for each tag in the array. (for each tag in the array, user will have multiple entries in the pipeline, one for each tag.)
  },
  {
    $group: {
      _id: "$_id", // group the documents back by the user's _id.
      numberOfTags: {
        $sum: 1, // count the number of times each _id appears, which gives us the number of tags each user has.
      },
    },
  },
  {
    $group: {
      _id: null, // group all users into a single group
      averageNumberOfTags: {
        $avg: "$numberOfTags", // Calulate the average number of tags based on the above grouped document
      },
    },
  },
]);

// Solution 2: Using addFields method
db.users.aggregate([
  {
    // Add a new field (numberOfTags)
    $addFields: {
      numberOfTags: {
        // Counts the number of elements in the tags array and stores it in a new field numberOfTags.
        $size: {
          $ifNull: ["$tags", []], // If the tags field is null or missing, it replaces it with an empty array [] to prevent errors.
        },
      },
    },
  },
  {
    $group: {
      _id: null, // group all users into a single group
      averageNumberOfTags: {
        $avg: { $ifNull: ["$numberOfTags", 0] }, // Calulate the average number of tags based on the above grouped document (If numberOfTags is null, it is replaced with 0 to avoid errors.)
      },
    },
  },
]);
