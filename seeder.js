const mongoose = require("mongoose");
require("dotenv").config();

// Connect to mongodb
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) console.log("Unable to connect to the server");
  else console.log("mongoDB is connected");
});

// Loads models
const Course = require("./models/course");
const { Cohort } = require("./models/cohort");
// Connect to DB

// Creates default cohorts for each course.
const createCohortCollection = async () => {
  try {
    // Use the Aggregation Pipeline to transform the data in the original collection to match the new schema
    const courseAggregationPipeline = [
      {
        $project: {
          // Transform fields from old schema to new schema
          _id: 0,
          courseId: "$_id",
          title: "$title",
          slug: "$slug",
          creator: "$creator",
          startDate: "$created_at",
          members: "$members",
          // joiningLink: "$joiningLink"
        },
      },
      {
        $set: {
          title: "$title", // title of the course
          // startDate: new Date(), // Course Start Date
          endDate: {
            $add: [new Date(), { $multiply: [100, 365, 24, 60, 60, 1000] }], // 100 years from now.
          },
          learnerLimit: 50,

          is_active: true,
          autoAccessApproval: false,
          joinCode: {
            $substr: [
              {
                $concat: [
                  {
                    $toString: {
                      $floor: {
                        $multiply: [{ $rand: {} }, 100000],
                      },
                    },
                  },
                  { $toUpper: { $substrCP: ["$slug", 0, 5] } },
                ],
              },
              0,
              10,
            ],
          },
          creator: "$creator", // creator wo
          created_at: new Date(), // current date
          updated_at: new Date(), // current date
          joiningLink: {
            // joinging link
            $concat: ["course/", "$slug"],
          },
          certification: false, //default value
          type: "default",
        },
      },
      {
        $out: "newCohortsCollection", // Write the transformed data to a new collection
      },
    ];

    // inserting Cohort Collection data to new cohort collection
    const cohortAggregationPipeline = [
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseIds",
        },
      },
      {
        $unwind: "$courseIds",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          startDate: 1,
          endDate: 1,
          learnerLimit: 1,
          slug: 1,
          is_active: 1,
          autoAccessApproval: 1,
          joinCode: 1,
          created_at: 1,
          updated_at: 1,
          members: 1,
          creator: "$courseIds.creator",
          count: 1,
          joiningLink: 1,
          certification: 1,
          courseId: 1,
          type: "facilitated",
        },
      },
      {
        $merge: {
          into: "newCohortsCollection",
        },
      },
    ];

    // first creating default cohorts for all the courses.
    await Course.aggregate(courseAggregationPipeline);

    // adding old cohorts with new schema to the new cohort collection.
    await Cohort.aggregate(cohortAggregationPipeline);
    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    // await Cohort.deleteMany();
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  createCohortCollection();
} else if (process.argv[2] === "-d") {
  deleteData();
}
