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

/* --------------- Question 8: How many users have 'enim' as one of their tags? --------------- */
db.users.aggregate([
  {
    $match: {
      tags: "enim", // Filter out the users that have 'enim' as one of their tags
    },
  },
  {
    $count: "usersWithEnimTag", // Count the number of documents from stage 1
  },
]);

/* --------------- Question 9: What are the names and age of users who are inactive and have 'velit' as a tag --------------- */
db.users.aggregate([
  // Stage 1: Filter out the users that are inActive and have 'velit' as one of their tags
  {
    $match: {
      isActive: false,
      tags: "velit",
    },
  },
  // Stage 2: Send only the required fields as response (name and age in this case)
  {
    $project: {
      name: 1,
      age: 1,
    },
  },
]);

/* --------------- Question 10: How many users have a phone number starting with '+1 (940)'? --------------- */
db.users.aggregate([
  // Stage 1: Filter out the users whose phone number starts with '+1 (940)' using regex
  {
    $match: {
      "company.phone": {
        $regex: /^\+1 \(940\)/,
      },
    },
  },
  // Stage 2: Count the no of user docs from stage 1
  {
    $count: "usersWithFilteredPhoneNumber",
  },
]);

/* --------------- Question 11: Who has registered the most recently (Limit to 4) ? --------------- */
db.users.aggregate([
  {
    $sort: {
      registered: -1, // Sort by the most recently registered in descending order
    },
  },
  {
    $limit: 4, // Limit the list of users to 4
  },
]);

/* --------------- Question 12: Categorize users by their favorite fruit  --------------- */
db.users.aggregate([
  {
    $group: {
      _id: "$favoriteFruit", // Group documents based on favorite fruit
      users: { $push: "$name" }, // This will create a new users array that will store the names of the users
    },
  },
]);

/* --------------- Question 13: How many users have 'ad' as teh second tag in their list of tags? --------------- */
db.users.aggregate([
  {
    $match: {
      "tags.1": "ad", // Match only those documents that have second tag as "ad"
    },
  },
  {
    $count: "usersWithSecondTagAsAd", // Count the number of documents from stage 1
  },
]);

/* --------------- Question 14: Find users who have both "enim" and "id" as their tags --------------- */
db.users.aggregate([
  {
    $match: {
      tags: { $all: ["enim", "id"] }, // Using "$all" operator we can specify an array with multiple vlues to match with
    },
  },
]);

/* --------------- Question 15: List all companies located in the USA with their corresponding user count --------------- */
db.users.aggregate([
  {
    $match: {
      "company.location.country": "USA", // Match only the companies that are located in the USA
    },
  },
  {
    $group: {
      _id: "$company.title", // Group the documents from stage 1 using the company name
      userCount: { $sum: 1 }, // Count the number of users for each company
    },
  },
]);

/* --------------- Question 16: Find the company with the most employees (users working at the same company title) --------------- */
db.users.aggregate([
  {
    $group: {
      _id: "$company.title", // Group the documents from stage 1 using the company name
      userCount: {
        $sum: 1, // Count the number of users for each company
      },
    },
  },
  {
    $sort: {
      userCount: -1, // Sort the documents in descending order
    },
  },
  {
    $limit: 1, // Limit the number of documents to 1 as we need the company with the most employees
  },
]);

/* --------------- Question 17: Count the number of users registered per year --------------- */
db.users.aggregate([
  {
    $group: {
      _id: { $year: "$registered" }, // Extracts the year from the registered date
      usersRegistered: {
        $sum: 1, // Counts the number of users for each year
      },
    },
  },
  {
    $sort: {
      _id: 1, // Sorts results by year in ascending order
    },
  },
]);

/* --------------- Question 18: Find the month with the highest number of user registrations --------------- */
db.users.aggregate([
  {
    $group: {
      _id: { $month: "$registered" }, // Extracts the month from the registered date
      registeredUsers: {
        $sum: 1,  // Counts the number of users for each month
      },
    },
  },
  {
    $sort: {
      registeredUsers: -1,
    },
  },
  {
    $limit: 1,
  },
]);
