const connectToDatabase = require("./db");

const User = require("./models/user")
const PhoneNumber = require("./models/phonenumbers")

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    error: message || "An Error occurred.",
  }),
});

const returnError = (error) => {
  console.log(error);
  if (error.name) {
    const message = `Invalid ${error.path}: ${error.value}`;
    callback(null, createErrorResponse(400, `Error:: ${message}`));
  } else {
    callback(
      null,
      createErrorResponse(error.statusCode || 500, `Error:: ${error.name}`)
    );
  }
};

module.exports.getUsers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
      await connectToDatabase();
      const users = await User.find();
      if (!users) {
          callback(null, createErrorResponse(404, 'No Users Found.'));
      }

      return {
          headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Allow": "GET, OPTIONS, POST",
              "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
              "Access-Control-Allow-Headers": "*"
          },
          statusCode: 200,
          body: JSON.stringify(users),
      };
  } catch (error) {
      returnError(error);
  }
};



module.exports.getUsersById = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
      await connectToDatabase();
      const users = await User.findById(id);

      if (!users) {
          callback(null, createErrorResponse(404, `No User found with id: ${id}`));
      }

      callback(null, {
          headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Allow": "GET, OPTIONS, POST",
              "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
              "Access-Control-Allow-Headers": "*"
          },
          statusCode: 200,
          body: JSON.stringify(users),
      });
  } catch (error) {
      returnError(error);
  }
};


module.exports.postUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { cognitoId, email } = JSON.parse(
      event.body
  );

  const users = new User({
      cognitoId,
      email,
  });

  try {
      await connectToDatabase();
      console.log(users);
      const user = await User.create(users);
      return {
          headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Allow": "GET, OPTIONS, POST",
              "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
              "Access-Control-Allow-Headers": "*"
          },
          statusCode: 200,
          body: JSON.stringify(user),
      };
  } catch (error) {
      returnError(error);
  }
};

module.exports.updateUsers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  const { firstName, lastName, tech } = data;

  try {
      await connectToDatabase();

      const user = await User.findById(event.pathParameters.id);

      if (user) {
          user.firstName = firstName || user.firstName;
          user.lastName = lastName || user.lastName;
          user.tech = tech || user.tech;
      }

      const newUser = await user.save();

      callback(null, {
          headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Allow": "GET, OPTIONS, POST",
              "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
              "Access-Control-Allow-Headers": "*"
          },
          statusCode: 204,
          body: JSON.stringify(newUser),
      });
  } catch (error) {
      returnError(error);
  }
};

module.exports.deleteUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
      await connectToDatabase();
      const user = await User.findByIdAndRemove(id);
      callback(null, {
          headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Allow": "GET, OPTIONS, POST",
              "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
              "Access-Control-Allow-Headers": "*"
          },
          statusCode: 200,
          body: JSON.stringify({
              message: `Removed user with id: ${user._id}`,
              user,
          }),
      });
  } catch (error) {
      returnError(error);
  }
};







module.exports.getPhoneNumbers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const pn = await PhoneNumber.find({});
    if (!pn) {
      callback(null, createErrorResponse(404, "No phone number Found."));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(pn),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.getOnePhone = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const pn = await PhoneNumber.findById(id);

    if (!pn) {
      callback(null, createErrorResponse(404, `No phone number found with id: ${id}`));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(pn),
    });
  } catch (error) {
    returnError(error);
  }
};

module.exports.updatePhone = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  const { providerName,number } = data;

  try {
    await connectToDatabase();

    const pn = await PhoneNumber.findById(event.pathParameters.id);

    if (pn) {
      pn.providerName = providerName || pn.providerName;
      pn.number = number || pn.number;
    }

    const newpn = await pn.save();

    callback(null, {
      statusCode: 204,
      body: JSON.stringify(newpn),
    });
  } catch (error) {
    returnError(error);
  }
};


module.exports.deletePhone = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;

  try {
    await connectToDatabase();
    const pn = await PhoneNumber.findByIdAndRemove(id);
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Removed phone number with id: ${pn._id}`,
        pn,
      }),
    });
  } catch (error) {
    returnError(error);
  }
};



module.exports.postPhoneNumbers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;
  const { providerName, number } = JSON.parse(event.body);
  const pn = new PhoneNumber({
    providerName,
    number,
  });

 try {
  await connectToDatabase();
  console.log(pn);
  PhoneNumber.create(pn).then(function(dbPhone){
    return User.findOneAndUpdate({id},
      {
        $push: {phoneNumber: dbPhone.id}},{new:true});
   })
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(pn),
    });
  } catch (error) {
    returnError(error);
  }
};


module.exports.getPhoneUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;
  try {
    await connectToDatabase();
    const pn = await User.find({_id : id}).populate("phoneNumber");
    if (!pn) {
      callback(null, createErrorResponse(404, "No phone number Found."));
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(pn),
    });
  } catch (error) {
    returnError(error);
  }
}